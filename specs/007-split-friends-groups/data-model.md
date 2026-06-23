# Data Model: Split with Friends, Groups & Expenses

**Feature**: 007-split-friends-groups  
**Phase**: 1 — Design  
**Date**: 2026-05-26

---

## Overview

This feature introduces three new MongoDB collections: `groups`, `expenses`, and `expense_splits`. These sit alongside the existing `friendships`, `user_accounts`, and `user_sessions` collections.

---

## Entities

### 1. Group

**Collection**: `groups`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | auto | |
| `name` | String | ✅ | 1–50 chars, trimmed |
| `description` | String | ❌ | max 200 chars |
| `creatorId` | ObjectId → UserAccount | ✅ | User who created the group |
| `memberIds` | ObjectId[] → UserAccount | ✅ | Includes creator, min 1 |
| `isDirect` | Boolean | ✅ | `true` for 2-party direct splits |
| `createdAt` | Date | auto | Mongoose timestamps |
| `updatedAt` | Date | auto | Mongoose timestamps |

**Indexes**:
- `{ memberIds: 1 }` — fast lookup of all groups a user belongs to
- `{ creatorId: 1 }` — fast lookup of groups created by user
- `{ isDirect: 1, memberIds: 1 }` — for finding an existing direct split pair

**Validation rules**:
- `name`: required, min 1 char, max 50 chars
- `memberIds`: must contain at least the creator; max 50 members
- `isDirect: true` groups must have exactly 2 members
- Duplicate `memberIds` are de-duplicated before save

**State transitions**: None (groups are created and remain active; archiving is out of scope for v1)

---

### 2. Expense

**Collection**: `expenses`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | auto | |
| `groupId` | ObjectId → Group | ✅ | The group this expense belongs to |
| `title` | String | ✅ | 1–100 chars |
| `totalAmount` | Number | ✅ | Positive, stored in smallest unit (cents) |
| `currency` | String | ✅ | Default: `"INR"` (single currency per v1) |
| `paidById` | ObjectId → UserAccount | ✅ | Member who paid |
| `splitMethod` | String enum | ✅ | `"equal"` \| `"custom"` \| `"percentage"` |
| `date` | Date | ✅ | When the expense occurred |
| `createdById` | ObjectId → UserAccount | ✅ | Member who recorded it |
| `createdAt` | Date | auto | |
| `updatedAt` | Date | auto | |

**Indexes**:
- `{ groupId: 1, date: -1 }` — chronological expense list per group
- `{ paidById: 1 }` — for user-level balance queries

**Validation rules**:
- `totalAmount`: must be > 0; stored as integer (cents × 100) to avoid floating point
- `title`: required, 1–100 chars
- `paidById` must be a member of the referenced group (validated server-side in service)
- `date`: must not be in the future (beyond today)

---

### 3. ExpenseSplit

**Collection**: `expense_splits`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | auto | |
| `expenseId` | ObjectId → Expense | ✅ | Parent expense |
| `groupId` | ObjectId → Group | ✅ | Denormalised for fast group-level balance queries |
| `userId` | ObjectId → UserAccount | ✅ | Member who owes this share |
| `amount` | Number | ✅ | This member's share in cents |
| `percentage` | Number | ❌ | For percentage splits; 0–100 |
| `createdAt` | Date | auto | |

**Indexes**:
- `{ expenseId: 1 }` — get all splits for an expense
- `{ groupId: 1, userId: 1 }` — get all splits for a user in a group (balance aggregation)
- `{ userId: 1 }` — cross-group balance lookups

**Validation rules**:
- The sum of all `amount` fields for a given `expenseId` must equal the parent `Expense.totalAmount` (±1 cent rounding tolerance)
- `percentage` values must sum to 100 for percentage-method expenses
- Each `userId` in splits must be a member of the group

---

## Relationships Diagram

```
UserAccount (existing)
    │
    ├── creatorId ──────────────── Group
    ├── memberIds (array ref) ───► Group
    │                               │
    │                               │ groupId
    │                               ▼
    │                            Expense
    ├── paidById ───────────────► Expense
    ├── createdById ────────────► Expense
    │                               │ expenseId + groupId
    │                               ▼
    └── userId ─────────────────► ExpenseSplit
```

---

## Balance Computation

Balances are computed via aggregation on `expense_splits` and NOT stored as a separate collection in v1.

**Algorithm** (per group):
1. Fetch all `ExpenseSplit` records for the group (indexed by `groupId`).
2. Fetch corresponding `Expense.paidById` for each split.
3. For each split: the payer is owed `split.amount` from `split.userId`.
4. Aggregate net amounts per (payer, debtor) pair.
5. Simplify: if A owes B $10 and B owes A $6, result is A owes B $4.

**Output shape** (per group balance response):
```typescript
interface GroupBalance {
  fromUserId: string;
  toUserId: string;
  amount: number; // cents
}
```

---

## Notification Events (Socket.IO)

| Event | Emitted to | Trigger |
|-------|-----------|---------|
| `group_update` | all group member IDs | Group created, member added |
| `expense_update` | all group member IDs | Expense added to group |

---

## Shared TypeScript Types (frontend/src/types/)

New file: `groups.types.ts`

```typescript
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
  splitMethod: "equal" | "custom" | "percentage";
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
```
