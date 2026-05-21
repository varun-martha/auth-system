import type { Response } from "express";

import type { AuthenticatedRequest } from "@/types/express/authenticated-request.js";

export async function currentUserController(request: AuthenticatedRequest, response: Response): Promise<void> {
  response.status(200).json({
    user: request.authenticatedUser
  });
}
