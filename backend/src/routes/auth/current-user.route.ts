import type { Router } from "express";

import { currentUserController } from "@/controllers/current-user.controller.js";
import { sessionAuthMiddleware } from "@/middleware/session-auth.middleware.js";

export function registerCurrentUserRoute(router: Router): void {
  router.get("/auth/me", sessionAuthMiddleware, currentUserController);
}
