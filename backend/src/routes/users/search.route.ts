import type { Router } from "express";
import { searchUsersController } from "@/controllers/search-users.controller.js";
import { sessionAuthMiddleware } from "@/middleware/session-auth.middleware.js";
import { searchRateLimiter } from "@/middleware/rateLimiter.js";

export function registerSearchRoute(router: Router): void {
  router.get(
    "/users/search",
    sessionAuthMiddleware,
    searchRateLimiter,
    searchUsersController
  );
}
