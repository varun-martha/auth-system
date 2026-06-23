import { Types } from "mongoose";
import { GroupModel } from "@/models/group.model.js";
import { ExpenseModel } from "@/models/expense.model.js";
import { ExpenseSplitModel } from "@/models/expense-split.model.js";
import { UserAccountModel } from "@/models/user-account.model.js";
import { socketService } from "@/services/socket.service.js";

interface SplitInput {
  userId: string;
  amount?: number;
  percentage?: number;
}

interface CreateExpenseInput {
  groupId: string;
  title: string;
  totalAmount: number;
  currency: string;
  paidById: string;
  splitMethod: "equal" | "custom" | "percentage" | "settlement";
  date: string;
  splits?: SplitInput[];
  createdById: string;
}

export async function createExpense(input: CreateExpenseInput) {
  const { groupId, title, totalAmount, currency, paidById, splitMethod, date, splits, createdById } = input;

  const group = await GroupModel.findById(groupId).lean();
  if (!group) throw new Error("Group not found.");

  const memberIdStrings = group.memberIds.map((id) => id.toString());
  if (!memberIdStrings.includes(paidById)) throw new Error("Payer must be a group member.");
  if (!memberIdStrings.includes(createdById)) throw new Error("FORBIDDEN");

  // Compute splits
  let resolvedSplits: { userId: string; amount: number; percentage?: number }[] = [];

  if (splitMethod === "equal") {
    const involvedIds = splits && splits.length > 0 ? splits.map(s => s.userId) : memberIdStrings;
    if (involvedIds.length === 0) throw new Error("At least one member must be involved in the split.");
    for (const uid of involvedIds) {
      if (!memberIdStrings.includes(uid)) throw new Error(`User ${uid} is not a group member.`);
    }
    const perMember = Math.floor(totalAmount / involvedIds.length);
    const remainder = totalAmount - perMember * involvedIds.length;
    resolvedSplits = involvedIds.map((uid, i) => ({
      userId: uid,
      amount: i === 0 ? perMember + remainder : perMember, // assign remainder to first member
    }));
  } else if (splitMethod === "custom") {
    if (!splits || splits.length === 0) throw new Error("Splits are required for custom split method.");
    const sum = splits.reduce((acc, s) => acc + (s.amount ?? 0), 0);
    if (Math.abs(sum - totalAmount) > 1) throw new Error(`Split amounts must sum to ${totalAmount} (got ${sum}).`);
    for (const s of splits) {
      if (!memberIdStrings.includes(s.userId)) throw new Error(`User ${s.userId} is not a group member.`);
    }
    resolvedSplits = splits.map((s) => ({ userId: s.userId, amount: s.amount! }));
  } else if (splitMethod === "percentage") {
    if (!splits || splits.length === 0) throw new Error("Splits are required for percentage split method.");
    const percentSum = splits.reduce((acc, s) => acc + (s.percentage ?? 0), 0);
    if (Math.abs(percentSum - 100) > 0.01) throw new Error(`Percentages must sum to 100 (got ${percentSum}).`);
    for (const s of splits) {
      if (!memberIdStrings.includes(s.userId)) throw new Error(`User ${s.userId} is not a group member.`);
    }
    let remaining = totalAmount;
    resolvedSplits = splits.map((s, i) => {
      const amount = i === splits!.length - 1 ? remaining : Math.floor(totalAmount * (s.percentage! / 100));
      remaining -= amount;
      return { userId: s.userId, amount, percentage: s.percentage };
    });
  } else if (splitMethod === "settlement") {
    if (!splits || splits.length !== 1) throw new Error("Settlement requires exactly one recipient split.");
    const s = splits[0];
    if (s.amount !== totalAmount) throw new Error("Settlement split amount must equal total amount.");
    if (!memberIdStrings.includes(s.userId)) throw new Error(`User ${s.userId} is not a group member.`);
    if (s.userId === paidById) throw new Error("Cannot settle up with yourself.");
    resolvedSplits = [{ userId: s.userId, amount: s.amount }];
  }

  const expense = await ExpenseModel.create({
    groupId: new Types.ObjectId(groupId),
    title,
    totalAmount,
    currency,
    paidById: new Types.ObjectId(paidById),
    splitMethod,
    date: new Date(date),
    createdById: new Types.ObjectId(createdById),
  });

  const splitDocs = resolvedSplits.map((s) => ({
    expenseId: expense._id,
    groupId: new Types.ObjectId(groupId),
    userId: new Types.ObjectId(s.userId),
    amount: s.amount,
    percentage: s.percentage,
  }));

  await ExpenseSplitModel.insertMany(splitDocs);

  // Notify all group members
  for (const uid of memberIdStrings) {
    socketService.emitToUser(uid, "expense_update", { groupId, expenseId: expense._id.toString() });
  }

  // Populate and return
  const populatedExpense = await ExpenseModel.findById(expense._id)
    .populate("paidById", "username")
    .lean();

  const paidByUser = populatedExpense?.paidById as any;

  const populatedSplits = await ExpenseSplitModel.find({ expenseId: expense._id })
    .populate("userId", "username")
    .lean();

  return {
    id: expense._id.toString(),
    groupId,
    title,
    totalAmount,
    currency,
    paidById,
    paidByName: paidByUser?.username ?? "Unknown",
    splitMethod,
    date: expense.date.toISOString(),
    createdById,
    splits: populatedSplits.map((s) => ({
      userId: (s.userId as any)._id?.toString() ?? s.userId.toString(),
      username: (s.userId as any).username ?? "Unknown",
      amount: s.amount,
      percentage: s.percentage,
    })),
    createdAt: (expense as any).createdAt,
  };
}

export async function listExpenses(groupId: string, userId: string, limit = 20, before?: string) {
  const group = await GroupModel.findById(groupId).lean();
  if (!group) throw new Error("Group not found.");
  const isMember = group.memberIds.some((id) => id.toString() === userId);
  if (!isMember) throw new Error("FORBIDDEN");

  const query: any = { groupId: new Types.ObjectId(groupId) };
  if (before) query.date = { $lt: new Date(before) };

  const expenses = await ExpenseModel.find(query)
    .sort({ date: -1 })
    .limit(Math.min(limit, 100))
    .populate("paidById", "username")
    .lean();

  const total = await ExpenseModel.countDocuments({ groupId: new Types.ObjectId(groupId) });

  return {
    expenses: expenses.map((e) => ({
      id: e._id.toString(),
      groupId,
      title: e.title,
      totalAmount: e.totalAmount,
      currency: e.currency,
      paidById: (e.paidById as any)._id?.toString() ?? e.paidById.toString(),
      paidByName: (e.paidById as any).username ?? "Unknown",
      splitMethod: e.splitMethod,
      date: e.date.toISOString(),
      createdAt: (e as any).createdAt,
    })),
    total,
  };
}

export async function getGroupBalances(groupId: string, userId: string) {
  const group = await GroupModel.findById(groupId).lean();
  if (!group) throw new Error("Group not found.");
  const isMember = group.memberIds.some((id) => id.toString() === userId);
  if (!isMember) throw new Error("FORBIDDEN");

  const splits = await ExpenseSplitModel.find({ groupId: new Types.ObjectId(groupId) })
    .populate("userId", "username")
    .lean();

  const expenses = await ExpenseModel.find({ groupId: new Types.ObjectId(groupId) })
    .populate("paidById", "username")
    .lean();

  const expenseMap = new Map(expenses.map((e) => [e._id.toString(), e]));

  // pairKey -> net amount (positive = from owes to)
  const netMap = new Map<string, number>();
  const userNameMap = new Map<string, string>();

  for (const split of splits) {
    const expense = expenseMap.get(split.expenseId.toString());
    if (!expense) continue;

    const payer = expense.paidById as any;
    const payerId: string = payer._id?.toString() ?? payer.toString();
    const payerName: string = payer.username ?? "Unknown";

    const debtor = split.userId as any;
    const debtorId: string = debtor._id?.toString() ?? debtor.toString();
    const debtorName: string = debtor.username ?? "Unknown";

    if (payerId === debtorId) continue; // payer doesn't owe themselves

    userNameMap.set(payerId, payerName);
    userNameMap.set(debtorId, debtorName);

    // debtor owes payer split.amount
    const key = `${debtorId}:${payerId}`;
    const reverseKey = `${payerId}:${debtorId}`;

    if (netMap.has(reverseKey)) {
      const existing = netMap.get(reverseKey)!;
      netMap.set(reverseKey, existing - split.amount);
    } else {
      netMap.set(key, (netMap.get(key) ?? 0) + split.amount);
    }
  }

  const balances: any[] = [];
  for (const [key, amount] of netMap.entries()) {
    if (amount === 0) continue;
    const [fromId, toId] = amount > 0 ? key.split(":") : key.split(":").reverse();
    const absAmount = Math.abs(amount);
    balances.push({
      fromUserId: fromId,
      fromUsername: userNameMap.get(fromId) ?? "Unknown",
      toUserId: toId,
      toUsername: userNameMap.get(toId) ?? "Unknown",
      amount: absAmount,
    });
  }

  return { balances, isSettled: balances.length === 0 };
}

export async function updateExpense(expenseId: string, input: CreateExpenseInput) {
  const { groupId, title, totalAmount, currency, paidById, splitMethod, date, splits, createdById } = input;

  const group = await GroupModel.findById(groupId).lean();
  if (!group) throw new Error("Group not found.");

  const memberIdStrings = group.memberIds.map((id) => id.toString());
  if (!memberIdStrings.includes(paidById)) throw new Error("Payer must be a group member.");
  
  const existingExpense = await ExpenseModel.findById(expenseId);
  if (!existingExpense) throw new Error("Expense not found.");
  if (existingExpense.groupId.toString() !== groupId) throw new Error("Expense does not belong to this group.");

  // For simplicity, we allow any member of the group to edit the expense.
  if (!memberIdStrings.includes(createdById)) throw new Error("FORBIDDEN");

  // Compute splits
  let resolvedSplits: { userId: string; amount: number; percentage?: number }[] = [];

  if (splitMethod === "equal") {
    const involvedIds = splits && splits.length > 0 ? splits.map(s => s.userId) : memberIdStrings;
    if (involvedIds.length === 0) throw new Error("At least one member must be involved in the split.");
    for (const uid of involvedIds) {
      if (!memberIdStrings.includes(uid)) throw new Error(`User ${uid} is not a group member.`);
    }
    const perMember = Math.floor(totalAmount / involvedIds.length);
    const remainder = totalAmount - perMember * involvedIds.length;
    resolvedSplits = involvedIds.map((uid, i) => ({
      userId: uid,
      amount: i === 0 ? perMember + remainder : perMember, // assign remainder to first member
    }));
  } else if (splitMethod === "custom") {
    if (!splits || splits.length === 0) throw new Error("Splits are required for custom split method.");
    const sum = splits.reduce((acc, s) => acc + (s.amount ?? 0), 0);
    if (Math.abs(sum - totalAmount) > 1) throw new Error(`Split amounts must sum to ${totalAmount} (got ${sum}).`);
    for (const s of splits) {
      if (!memberIdStrings.includes(s.userId)) throw new Error(`User ${s.userId} is not a group member.`);
    }
    resolvedSplits = splits.map((s) => ({ userId: s.userId, amount: s.amount! }));
  } else if (splitMethod === "percentage") {
    if (!splits || splits.length === 0) throw new Error("Splits are required for percentage split method.");
    const percentSum = splits.reduce((acc, s) => acc + (s.percentage ?? 0), 0);
    if (Math.abs(percentSum - 100) > 0.01) throw new Error(`Percentages must sum to 100 (got ${percentSum}).`);
    for (const s of splits) {
      if (!memberIdStrings.includes(s.userId)) throw new Error(`User ${s.userId} is not a group member.`);
    }
    let remaining = totalAmount;
    resolvedSplits = splits.map((s, i) => {
      const amount = i === splits!.length - 1 ? remaining : Math.floor(totalAmount * (s.percentage! / 100));
      remaining -= amount;
      return { userId: s.userId, amount, percentage: s.percentage };
    });
  } else if (splitMethod === "settlement") {
    if (!splits || splits.length !== 1) throw new Error("Settlement requires exactly one recipient split.");
    const s = splits[0];
    if (s.amount !== totalAmount) throw new Error("Settlement split amount must equal total amount.");
    if (!memberIdStrings.includes(s.userId)) throw new Error(`User ${s.userId} is not a group member.`);
    if (s.userId === paidById) throw new Error("Cannot settle up with yourself.");
    resolvedSplits = [{ userId: s.userId, amount: s.amount }];
  }

  existingExpense.title = title;
  existingExpense.totalAmount = totalAmount;
  existingExpense.currency = currency;
  existingExpense.paidById = new Types.ObjectId(paidById);
  existingExpense.splitMethod = splitMethod;
  existingExpense.date = new Date(date);
  
  await existingExpense.save();

  await ExpenseSplitModel.deleteMany({ expenseId: new Types.ObjectId(expenseId) });

  const splitDocs = resolvedSplits.map((s) => ({
    expenseId: existingExpense._id,
    groupId: new Types.ObjectId(groupId),
    userId: new Types.ObjectId(s.userId),
    amount: s.amount,
    percentage: s.percentage,
  }));

  await ExpenseSplitModel.insertMany(splitDocs);

  // Notify all group members
  for (const uid of memberIdStrings) {
    socketService.emitToUser(uid, "expense_update", { groupId, expenseId: existingExpense._id.toString() });
  }

  // Populate and return
  const populatedExpense = await ExpenseModel.findById(existingExpense._id)
    .populate("paidById", "username")
    .lean();

  const paidByUser = populatedExpense?.paidById as any;

  const populatedSplits = await ExpenseSplitModel.find({ expenseId: existingExpense._id })
    .populate("userId", "username")
    .lean();

  return {
    id: existingExpense._id.toString(),
    groupId,
    title,
    totalAmount,
    currency,
    paidById,
    paidByName: paidByUser?.username ?? "Unknown",
    splitMethod,
    date: existingExpense.date.toISOString(),
    createdById: existingExpense.createdById.toString(),
    splits: populatedSplits.map((s) => ({
      userId: (s.userId as any)._id?.toString() ?? s.userId.toString(),
      username: (s.userId as any).username ?? "Unknown",
      amount: s.amount,
      percentage: s.percentage,
    })),
    createdAt: (existingExpense as any).createdAt,
  };
}
