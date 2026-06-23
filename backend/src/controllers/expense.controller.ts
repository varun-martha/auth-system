import type { Request, Response } from "express";
import { createExpenseBody } from "@/validators/expense.validator.js";
import { createExpense, listExpenses, getGroupBalances, updateExpense } from "@/services/expense.service.js";

export async function createExpenseController(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).authenticatedUser.id;
    const { groupId } = req.params;
    const parsed = createExpenseBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: parsed.error.errors[0]?.message || "Invalid request." });
      return;
    }
    const expense = await createExpense({ ...parsed.data, groupId, createdById: userId });
    res.status(201).json({ success: true, expense });
  } catch (error: any) {
    if (error.message === "FORBIDDEN") {
      res.status(403).json({ success: false, message: "You are not a member of this group." });
      return;
    }
    console.error("createExpenseController error:", error);
    res.status(400).json({ success: false, message: error.message || "Server error." });
  }
}

export async function updateExpenseController(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).authenticatedUser.id;
    const { groupId, expenseId } = req.params;
    const parsed = createExpenseBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: parsed.error.errors[0]?.message || "Invalid request." });
      return;
    }
    const expense = await updateExpense(expenseId, { ...parsed.data, groupId, createdById: userId });
    res.status(200).json({ success: true, expense });
  } catch (error: any) {
    if (error.message === "FORBIDDEN") {
      res.status(403).json({ success: false, message: "You are not a member of this group." });
      return;
    }
    console.error("updateExpenseController error:", error);
    res.status(400).json({ success: false, message: error.message || "Server error." });
  }
}

export async function listExpensesController(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).authenticatedUser.id;
    const { groupId } = req.params;
    const limit = Math.min(parseInt(String(req.query.limit || "20")), 100);
    const before = req.query.before as string | undefined;
    const result = await listExpenses(groupId, userId, limit, before);
    res.status(200).json(result);
  } catch (error: any) {
    if (error.message === "FORBIDDEN") {
      res.status(403).json({ success: false, message: "You are not a member of this group." });
      return;
    }
    console.error("listExpensesController error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
}

export async function getGroupBalancesController(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).authenticatedUser.id;
    const { groupId } = req.params;
    const result = await getGroupBalances(groupId, userId);
    res.status(200).json(result);
  } catch (error: any) {
    if (error.message === "FORBIDDEN") {
      res.status(403).json({ success: false, message: "You are not a member of this group." });
      return;
    }
    console.error("getGroupBalancesController error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
}
