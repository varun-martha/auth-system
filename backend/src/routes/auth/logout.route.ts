import type { Router } from "express";

import { logoutController } from "@/controllers/logout.controller.js";
import { sessionAuthMiddleware } from "@/middleware/session-auth.middleware.js";

export function registerLogoutRoute(router: Router): void {
  router.post("/auth/logout", sessionAuthMiddleware, logoutController);
}
