import type { Router } from "express";
import { createDirectSplitController } from "@/controllers/split.controller.js";
import { sessionAuthMiddleware } from "@/middleware/session-auth.middleware.js";
import { expenseCreateRateLimiter } from "@/middleware/rateLimiter.js";

export function registerSplitRoutes(router: Router): void {
  router.post("/splits/direct", sessionAuthMiddleware, expenseCreateRateLimiter, createDirectSplitController);
}
