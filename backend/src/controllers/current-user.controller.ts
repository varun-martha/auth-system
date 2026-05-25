import type { Response } from "express";
import type { AuthenticatedRequest } from "@/types/express/authenticated-request.js";
import { UserService } from "@/services/user.service.js";

export async function currentUserController(
  request: AuthenticatedRequest,
  response: Response
): Promise<void> {
  const user = request.authenticatedUser;

  if (user && !user.avatarUrl && user.email) {
    user.avatarUrl = await UserService.ensureAvatar(user.id, user.email);
  }

  response.status(200).json({
    user
  });
}
