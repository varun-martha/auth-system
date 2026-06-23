import type { Router } from "express";
import {
  createGroupController,
  listGroupsController,
  getGroupController,
  addMembersController,
} from "@/controllers/group.controller.js";
import { getGroupBalancesController } from "@/controllers/expense.controller.js";
import { createExpenseController, listExpensesController, updateExpenseController } from "@/controllers/expense.controller.js";
import { sessionAuthMiddleware } from "@/middleware/session-auth.middleware.js";
import { groupCreateRateLimiter, expenseCreateRateLimiter } from "@/middleware/rateLimiter.js";

export function registerGroupRoutes(router: Router): void {
  router.post("/groups", sessionAuthMiddleware, groupCreateRateLimiter, createGroupController);
  router.get("/groups", sessionAuthMiddleware, listGroupsController);
  router.get("/groups/:groupId", sessionAuthMiddleware, getGroupController);
  router.post("/groups/:groupId/members", sessionAuthMiddleware, addMembersController);
  router.post("/groups/:groupId/expenses", sessionAuthMiddleware, expenseCreateRateLimiter, createExpenseController);
  router.put("/groups/:groupId/expenses/:expenseId", sessionAuthMiddleware, expenseCreateRateLimiter, updateExpenseController);
  router.get("/groups/:groupId/expenses", sessionAuthMiddleware, listExpensesController);
  router.get("/groups/:groupId/balances", sessionAuthMiddleware, getGroupBalancesController);
}
