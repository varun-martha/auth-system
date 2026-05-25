import type { Response } from "express";
import { updateUserAvatarUrl } from "@/repositories/user-account.repository.js";
import type { AuthenticatedRequest } from "@/types/express/authenticated-request.js";

export async function updateAvatarController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const user = req.authenticatedUser;
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { avatarUrl } = req.body;
    if (!avatarUrl || typeof avatarUrl !== "string") {
      res.status(400).json({ message: "Valid avatarUrl is required" });
      return;
    }

    await updateUserAvatarUrl(user.id, avatarUrl);

    res.status(200).json({ success: true, message: "Avatar updated" });
  } catch (error) {
    console.error("Avatar update error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
