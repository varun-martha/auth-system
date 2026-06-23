export interface GroupMember {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  creatorId: string;
  members: GroupMember[];
  isDirect: boolean;
  memberCount: number;
  createdAt: string;
}

export interface Expense {
  id: string;
  groupId: string;
  title: string;
  totalAmount: number; // cents
  currency: string;
  paidById: string;
  paidByName: string;
  splitMethod: 'equal' | 'custom' | 'percentage' | 'settlement';
  date: string;
  createdById: string;
  splits: ExpenseSplit[];
  createdAt: string;
}

export interface ExpenseSplit {
  userId: string;
  username: string;
  amount: number; // cents
  percentage?: number;
}

export interface GroupBalance {
  fromUserId: string;
  fromUsername: string;
  toUserId: string;
  toUsername: string;
  amount: number; // cents
}
