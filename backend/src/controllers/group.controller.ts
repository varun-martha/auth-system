import type { Request, Response } from "express";
import { createGroupBody, addMembersBody } from "@/validators/group.validator.js";
import {
  createGroup,
  getGroupById,
  listGroupsForUser,
  addMembersToGroup,
} from "@/services/group.service.js";

export async function createGroupController(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).authenticatedUser.id;
    const parsed = createGroupBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: parsed.error.errors[0]?.message || "Invalid request." });
      return;
    }
    const { name, description, memberIds } = parsed.data;
    const group = await createGroup({ name, description, creatorId: userId, memberIds: memberIds ?? [] });
    res.status(201).json({ success: true, group });
  } catch (error: any) {
    console.error("createGroupController error:", error);
    res.status(500).json({ success: false, message: error.message || "Server error." });
  }
}

export async function listGroupsController(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).authenticatedUser.id;
    const groups = await listGroupsForUser(userId);
    res.status(200).json({ groups });
  } catch (error: any) {
    console.error("listGroupsController error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
}

export async function getGroupController(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).authenticatedUser.id;
    const groupId = req.params.groupId as string;
    const group = await getGroupById(groupId, userId);
    if (!group) {
      res.status(403).json({ success: false, message: "Group not found or access denied." });
      return;
    }
    res.status(200).json({ group });
  } catch (error: any) {
    console.error("getGroupController error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
}

export async function addMembersController(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).authenticatedUser.id;
    const groupId = req.params.groupId as string;
    const parsed = addMembersBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: parsed.error.errors[0]?.message || "Invalid request." });
      return;
    }
    const result = await addMembersToGroup(groupId, parsed.data.memberIds, userId);
    res.status(200).json({ success: true, ...result });
  } catch (error: any) {
    if (error.message === "FORBIDDEN") {
      res.status(403).json({ success: false, message: "You are not a member of this group." });
      return;
    }
    console.error("addMembersController error:", error);
    res.status(400).json({ success: false, message: error.message || "Server error." });
  }
}
