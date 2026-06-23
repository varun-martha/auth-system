import { Types } from "mongoose";
import { ExpenseModel } from "@/models/expense.model.js";
import { ExpenseSplitModel } from "@/models/expense-split.model.js";

export async function getUserActivityHistory(userId: string, limit = 50, before?: string) {
  // Find all expenses where user is involved (either paid or split)
  const splits = await ExpenseSplitModel.find({ userId: new Types.ObjectId(userId) }).select("expenseId").lean();
  const expenseIdsFromSplits = splits.map(s => s.expenseId);

  const query: any = {
    $or: [
      { _id: { $in: expenseIdsFromSplits } },
      { paidById: new Types.ObjectId(userId) }
    ]
  };

  if (before) {
    query.date = { $lt: new Date(before) };
  }

  const expenses = await ExpenseModel.find(query)
    .sort({ date: -1 })
    .limit(limit)
    .populate("paidById", "username")
    .populate("groupId", "name")
    .lean();

  return expenses.map((e: any) => ({
    id: e._id.toString(),
    groupId: e.groupId._id.toString(),
    groupName: e.groupId.name,
    title: e.title,
    totalAmount: e.totalAmount,
    currency: e.currency,
    paidById: e.paidById._id?.toString() ?? e.paidById.toString(),
    paidByName: e.paidById.username ?? "Unknown",
    splitMethod: e.splitMethod,
    date: e.date.toISOString(),
    createdAt: e.createdAt,
  }));
}
