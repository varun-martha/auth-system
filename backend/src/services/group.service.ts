import { Types } from "mongoose";
import { GroupModel } from "@/models/group.model.js";
import { UserAccountModel } from "@/models/user-account.model.js";
import { socketService } from "@/services/socket.service.js";

export async function createGroup({
  name,
  description,
  creatorId,
  memberIds,
  isDirect = false,
}: {
  name: string;
  description?: string;
  creatorId: string;
  memberIds: string[];
  isDirect?: boolean;
}) {
  // De-duplicate: always include creator, merge with provided memberIds
  const uniqueIds = Array.from(new Set([creatorId, ...memberIds]));
  if (uniqueIds.length > 50) {
    throw new Error("A group cannot have more than 50 members.");
  }

  const group = await GroupModel.create({
    name,
    description,
    creatorId: new Types.ObjectId(creatorId),
    memberIds: uniqueIds.map((id) => new Types.ObjectId(id)),
    isDirect,
  });

  // Emit group_update to all members except the creator
  for (const id of uniqueIds) {
    if (id !== creatorId) {
      socketService.emitToUser(id, "group_update", { groupId: group._id.toString() });
    }
  }

  return getGroupById(group._id.toString(), creatorId);
}

export async function getGroupById(groupId: string, requestingUserId: string) {
  const group = await GroupModel.findById(groupId)
    .populate<{ memberIds: any[] }>("memberIds", "username email avatarUrl")
    .lean();

  if (!group) return null;

  const isMember = (group.memberIds as any[]).some(
    (m: any) => m._id.toString() === requestingUserId
  );
  if (!isMember) return null; // Caller should 403

  return {
    id: group._id.toString(),
    name: group.name,
    description: group.description,
    creatorId: group.creatorId.toString(),
    members: (group.memberIds as any[]).map((m: any) => ({
      id: m._id.toString(),
      username: m.username,
      email: m.email,
      avatar: m.avatarUrl ?? null,
    })),
    isDirect: group.isDirect,
    memberCount: (group.memberIds as any[]).length,
    createdAt: (group as any).createdAt,
  };
}

export async function listGroupsForUser(userId: string) {
  const groups = await GroupModel.find({ memberIds: new Types.ObjectId(userId) })
    .populate<{ memberIds: any[] }>("memberIds", "username email avatarUrl")
    .select("name description isDirect memberIds createdAt")
    .lean();

  return groups.map((g) => ({
    id: g._id.toString(),
    name: g.name,
    description: g.description,
    isDirect: g.isDirect,
    memberCount: g.memberIds.length,
    members: g.memberIds.map((m: any) => ({
      id: m._id.toString(),
      username: m.username,
      email: m.email,
      avatar: m.avatarUrl ?? null,
    })),
    createdAt: (g as any).createdAt,
  }));
}

export async function addMembersToGroup(groupId: string, newMemberIds: string[], requestingUserId: string) {
  const group = await GroupModel.findById(groupId);
  if (!group) throw new Error("Group not found.");

  const isMember = group.memberIds.some((id) => id.toString() === requestingUserId);
  if (!isMember) throw new Error("FORBIDDEN");

  if (group.isDirect) throw new Error("Cannot add members to a direct split group.");

  const existingIds = new Set(group.memberIds.map((id) => id.toString()));
  const toAdd: string[] = [];
  for (const id of newMemberIds) {
    if (!existingIds.has(id)) toAdd.push(id);
  }

  if (group.memberIds.length + toAdd.length > 50) {
    throw new Error("Adding these members would exceed the 50-member limit.");
  }

  if (toAdd.length > 0) {
    group.memberIds.push(...toAdd.map((id) => new Types.ObjectId(id)));
    await group.save();
    for (const id of toAdd) {
      socketService.emitToUser(id, "group_update", { groupId: group._id.toString() });
    }
  }

  return { addedCount: toAdd.length, group: await getGroupById(groupId, requestingUserId) };
}

export async function getOrCreateDirectGroup(userId: string, friendUserId: string) {
  // Check if direct group already exists between these two users
  const existing = await GroupModel.findOne({
    isDirect: true,
    memberIds: { $all: [new Types.ObjectId(userId), new Types.ObjectId(friendUserId)], $size: 2 },
  }).lean();

  if (existing) {
    return existing._id.toString();
  }

  const group = await GroupModel.create({
    name: "Direct Split",
    creatorId: new Types.ObjectId(userId),
    memberIds: [new Types.ObjectId(userId), new Types.ObjectId(friendUserId)],
    isDirect: true,
  });

  return group._id.toString();
}
