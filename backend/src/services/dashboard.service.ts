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

  // 3. Calculate Global Net Balance using Aggregations
  // Calculate sum of all expenses paid by the user
  const totalPaidRes = await ExpenseModel.aggregate([
    { $match: { paidById: userObjId } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } }
  ]);
  const totalPaid = totalPaidRes[0]?.total || 0;

  // Calculate sum of all splits assigned to the user
  const totalOwedRes = await ExpenseSplitModel.aggregate([
    { $match: { userId: userObjId } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);
  const totalOwed = totalOwedRes[0]?.total || 0;

  const totalBalance = totalPaid - totalOwed;

  return {
    totalBalance,
    recentActivity,
  };
}
