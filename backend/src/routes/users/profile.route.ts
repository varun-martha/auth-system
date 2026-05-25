import type { Router } from "express";

import { currentUserController } from "@/controllers/current-user.controller.js";
import { updateAvatarController } from "@/controllers/update-avatar.controller.js";
import { sessionAuthMiddleware } from "@/middleware/session-auth.middleware.js";

export function registerProfileRoute(router: Router): void {
  router.get("/users/me", sessionAuthMiddleware, currentUserController);
  router.put("/users/me/avatar", sessionAuthMiddleware, updateAvatarController);
}
