import { Types } from "mongoose";
import { GroupModel } from "@/models/group.model.js";
import { ExpenseModel } from "@/models/expense.model.js";
import { ExpenseSplitModel } from "@/models/expense-split.model.js";

export async function getDashboardSummary(userId: string) {
  const userObjId = new Types.ObjectId(userId);

  // 1. Find all groups the user is in
  const groups = await GroupModel.find({ memberIds: userObjId }).select("_id").lean();
  const groupIds = groups.map((g: any) => g._id);

  if (groupIds.length === 0) {
    return { totalBalance: 0, recentActivity: [] };
  }

  // 2. Fetch recent activity (last 5 expenses across all these groups)
  const recentExpenses = await ExpenseModel.find({ groupId: { $in: groupIds } })
    .sort({ date: -1 })
    .limit(5)
    .populate("paidById", "username")
    .lean();

  const recentActivity = recentExpenses.map((e: any) => ({
    id: e._id.toString(),
    groupId: e.groupId.toString(),
    title: e.title,
    totalAmount: e.totalAmount,
    currency: e.currency,
    paidById: (e.paidById as any)._id?.toString() ?? e.paidById.toString(),
    paidByName: (e.paidById as any).username ?? "Unknown",
    splitMethod: e.splitMethod,
    date: e.date.toISOString(),
  }));

  // 3. Calculate Global Net Balance
  const splits = await ExpenseSplitModel.find({ groupId: { $in: groupIds } }).lean();
  const expenses = await ExpenseModel.find({ groupId: { $in: groupIds } }).lean();
  
  const expenseMap = new Map(expenses.map((e: any) => [e._id.toString(), e]));

  let totalBalance = 0; // positive = owed money, negative = owes money

  for (const split of splits as any[]) {
    const expense = expenseMap.get(split.expenseId.toString());
    if (!expense) continue;

    const payerId = expense.paidById.toString();
    const debtorId = split.userId.toString();

    if (payerId === debtorId) continue;

    if (payerId === userId) {
      totalBalance += split.amount;
    } else if (debtorId === userId) {
      totalBalance -= split.amount;
    }
  }

  return {
    totalBalance,
    recentActivity,
  };
}
