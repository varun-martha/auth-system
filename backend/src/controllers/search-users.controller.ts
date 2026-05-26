import type { Request, Response } from "express";
import { UserAccountModel } from "@/models/user-account.model.js";

export async function searchUsersController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const query = req.query.q as string;
    
    if (!query || query.trim().length < 2) {
      res.status(400).json({
        success: false,
        message: "Search query must be at least 2 characters long."
      });
      return;
    }

    const searchQuery = query.trim();
    // Case-insensitive regex search
    const regex = new RegExp(searchQuery, "i");

    const currentUserId = (req as any).authenticatedUser?.id;

    const users = await UserAccountModel.find({
      $and: [
        { _id: { $ne: currentUserId } },
        { $or: [{ username: regex }, { email: regex }] }
      ]
    })
      .select("username email avatarUrl")
      .limit(20)
      .lean();

    // Map to expected frontend format (rename _id to id)
    const formattedUsers = users.map(u => ({
      id: u._id,
      username: u.username,
      email: u.email,
      avatar: u.avatarUrl
    }));

    res.status(200).json({ users: formattedUsers });
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({
      success: false,
      message: "An internal server error occurred while searching for users."
    });
  }
}
