import type { Router } from "express";
import { getGlobalActivityController } from "@/controllers/activity.controller.js";
import { sessionAuthMiddleware } from "@/middleware/session-auth.middleware.js";

export function registerActivityRoute(router: Router): void {
  router.get("/users/me/activity", sessionAuthMiddleware, getGlobalActivityController);
}
