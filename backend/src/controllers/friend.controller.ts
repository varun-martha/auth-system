import type { Request, Response } from "express";
import { FriendshipModel } from "@/models/friendship.model.js";
import { socketService } from "@/services/socket.service.js";

export async function getFriendsController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const userId = (req as any).authenticatedUser.id;

    // Find all friendships where the user is either the requester or recipient
    const friendships = await FriendshipModel.find({
      $or: [{ requesterId: userId }, { recipientId: userId }]
    })
      .populate("requesterId", "username email avatarUrl")
      .populate("recipientId", "username email avatarUrl")
      .lean();

    const friends: any[] = [];
    const pendingRequests: any[] = [];

    for (const f of friendships) {
      const isRequester = f.requesterId?._id?.toString() === userId.toString();
      const otherUser = (isRequester ? f.recipientId : f.requesterId) as any;

      if (!otherUser) continue;

      const userData = {
        id: otherUser._id,
        username: otherUser.username,
        email: otherUser.email,
        avatar: otherUser.avatarUrl,
        friendshipId: f._id
      };

      if (f.status === "accepted") {
        friends.push(userData);
      } else if (f.status === "pending") {
        pendingRequests.push({
          ...userData,
          direction: isRequester ? "outgoing" : "incoming"
        });
      }
    }

    res.status(200).json({
      friends,
      pendingRequests
    });
  } catch (error) {
    console.error("Error getting friends:", error);
    res.status(500).json({
      success: false,
      message: "An internal server error occurred while getting friends."
    });
  }
}

export async function removeFriendController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const userId = (req as any).authenticatedUser.id;
    const { friendshipId } = req.params;

    if (!friendshipId) {
      res.status(400).json({
        success: false,
        message: "Friendship ID is required."
      });
      return;
    }

    // Find and delete only if the user is part of the friendship
    const deletedFriendship = await FriendshipModel.findOneAndDelete({
      _id: friendshipId,
      $or: [{ requesterId: userId }, { recipientId: userId }]
    }).lean();

    if (!deletedFriendship) {
      res.status(404).json({
        success: false,
        message: "Friendship not found or you are not authorized to remove it."
      });
      return;
    }

    const otherUserId = deletedFriendship.requesterId.toString() === userId.toString() 
      ? deletedFriendship.recipientId.toString() 
      : deletedFriendship.requesterId.toString();
    socketService.emitToUser(otherUserId, "friend_update");

    res.status(200).json({
      success: true,
      message: "Friend removed / Request rejected successfully."
    });
  } catch (error) {
    console.error("Error removing friend:", error);
    res.status(500).json({
      success: false,
      message: "An internal server error occurred while removing a friend."
    });
  }
}

export async function sendFriendRequestController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const userId = (req as any).authenticatedUser.id;
    const { targetUserId } = req.body;

    if (!targetUserId) {
      res.status(400).json({ success: false, message: "Target user ID is required." });
      return;
    }

    if (userId === targetUserId) {
      res.status(400).json({ success: false, message: "Cannot send friend request to yourself." });
      return;
    }

    // Check if friendship already exists
    const existing = await FriendshipModel.findOne({
      $or: [
        { requesterId: userId, recipientId: targetUserId },
        { requesterId: targetUserId, recipientId: userId }
      ]
    }).lean();

    if (existing) {
      res.status(400).json({ success: false, message: "Friendship or request already exists." });
      return;
    }

    const newRequest = await FriendshipModel.create({
      requesterId: userId,
      recipientId: targetUserId,
      status: "pending"
    });

    socketService.emitToUser(targetUserId, "friend_update");

    res.status(201).json({ success: true, request: newRequest });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
}

export async function acceptFriendRequestController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const userId = (req as any).authenticatedUser.id;
    const { friendshipId } = req.body;

    if (!friendshipId) {
      res.status(400).json({ success: false, message: "Friendship ID is required." });
      return;
    }

    const friendship = await FriendshipModel.findOne({ _id: friendshipId });

    if (!friendship || friendship.recipientId.toString() !== userId.toString() || friendship.status !== "pending") {
      res.status(404).json({ success: false, message: "Friend request not found or unauthorized." });
      return;
    }

    friendship.status = "accepted";
    await friendship.save();

    socketService.emitToUser(friendship.requesterId.toString(), "friend_update");

    res.status(200).json({ success: true, message: "Friend request accepted." });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
}

