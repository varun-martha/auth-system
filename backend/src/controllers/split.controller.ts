import type { Request, Response } from "express";
import { createExpenseBody } from "@/validators/expense.validator.js";
import { getOrCreateDirectGroup } from "@/services/group.service.js";
import { createExpense } from "@/services/expense.service.js";
import { z } from "zod";

const createDirectSplitBody = createExpenseBody.extend({
  friendUserId: z.string(),
});

export async function createDirectSplitController(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).authenticatedUser.id;
    const parsed = createDirectSplitBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: parsed.error.errors[0]?.message || "Invalid request." });
      return;
    }
    
    const { friendUserId, ...expenseData } = parsed.data;
    
    // Resolve/create direct split group
    const groupId = await getOrCreateDirectGroup(userId, friendUserId);
    
    // Create the expense inside the resolved group
    const expense = await createExpense({
      ...expenseData,
      groupId,
      createdById: userId,
    });
    
    res.status(201).json({ success: true, expense, groupId });
  } catch (error: any) {
    if (error.message === "You must be accepted friends to split expenses directly.") {
      res.status(400).json({ success: false, message: error.message });
      return;
    }
    console.error("createDirectSplitController error:", error);
    res.status(400).json({ success: false, message: error.message || "Server error." });
  }
}
