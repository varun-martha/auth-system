import type { Router } from "express";
import { getDashboardSummaryController } from "@/controllers/dashboard.controller.js";
import { sessionAuthMiddleware } from "@/middleware/session-auth.middleware.js";

export function registerDashboardRoute(router: Router): void {
  router.get("/users/me/dashboard", sessionAuthMiddleware, getDashboardSummaryController);
}
