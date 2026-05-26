import type { Router } from "express";
import { 
  getFriendsController, 
  removeFriendController,
  sendFriendRequestController,
  acceptFriendRequestController
} from "@/controllers/friend.controller.js";
import { sessionAuthMiddleware } from "@/middleware/session-auth.middleware.js";
import { friendRequestRateLimiter } from "@/middleware/rateLimiter.js";

export function registerFriendRoutes(router: Router): void {
  router.get(
    "/friends",
    sessionAuthMiddleware,
    getFriendsController
  );
  
  router.delete(
    "/friends/:friendshipId",
    sessionAuthMiddleware,
    removeFriendController
  );

  router.post(
    "/friends/request",
    sessionAuthMiddleware,
    friendRequestRateLimiter,
    sendFriendRequestController
  );

  router.post(
    "/friends/accept",
    sessionAuthMiddleware,
    acceptFriendRequestController
  );
}
