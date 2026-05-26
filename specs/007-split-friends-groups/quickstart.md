# Quickstart: Split with Friends, Groups & Expenses

**Feature**: 007-split-friends-groups  
**Date**: 2026-05-26

---

## Prerequisites

- Both `frontend` and `backend` dev servers are running.
- MongoDB is connected (see `backend/.env`).
- You are logged in to the app at `http://localhost:3000`.
- At least two user accounts exist and are friends.

---

## Running the App

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

---

## Trying the Feature

### 1. Create a Group

1. Log in and click **"Groups"** in the sidebar.
2. Click **"Create Group"** button.
3. Enter a group name (e.g., "Goa Trip").
4. Search for a friend by name or email and add them.
5. Submit — you'll be taken to the new group's page.

### 2. Add Members to a Group

1. Open an existing group.
2. Click the **"Add Members"** button (top right of group page).
3. Search for a registered friend and confirm.

### 3. Add an Expense

1. Open a group.
2. Click **"Add Expense"**.
3. Fill in: title, amount, date, payer, and split method.
4. For equal split — just submit.
5. For custom split — enter each member's share (must total the amount).
6. For percentage — enter each member's percentage (must total 100%).
7. Submit — balances update instantly for all members.

### 4. View Balances

- Group page shows a **Balance Summary** card listing who owes whom.
- "All settled up 🎉" appears when net balances are zero.

### 5. Direct Split with a Friend

1. Go to **"Your Friends"** page.
2. Click **"Split"** on any friend card.
3. Fill in expense details — no group creation needed.

---

## Backend API Quick Test (curl)

```bash
# Create group
curl -s -X POST http://localhost:4000/api/v1/groups \
  -H "Content-Type: application/json" \
  --cookie "session=<your-session-token>" \
  -d '{"name":"Test Group","memberIds":["<friendUserId>"]}'

# Add expense (equal split)
curl -s -X POST http://localhost:4000/api/v1/groups/<groupId>/expenses \
  -H "Content-Type: application/json" \
  --cookie "session=<your-session-token>" \
  -d '{
    "title": "Dinner",
    "totalAmount": 120000,
    "currency": "INR",
    "paidById": "<yourUserId>",
    "splitMethod": "equal",
    "date": "2026-05-26"
  }'

# Get balances
curl -s http://localhost:4000/api/v1/groups/<groupId>/balances \
  --cookie "session=<your-session-token>"
```

---

## File Locations (New Files)

### Backend
```
backend/src/
├── models/
│   ├── group.model.ts          ← Group schema
│   ├── expense.model.ts        ← Expense schema
│   └── expense-split.model.ts ← ExpenseSplit schema
├── validators/
│   ├── group.validator.ts
│   └── expense.validator.ts
├── services/
│   ├── group.service.ts
│   └── expense.service.ts      ← split math + balance aggregation
├── controllers/
│   ├── group.controller.ts
│   └── expense.controller.ts
├── routes/
│   ├── groups/
│   │   └── index.ts
│   └── splits/
│       └── index.ts            ← direct split endpoint
└── middleware/
    └── rateLimiter.ts          ← add groupCreate + expenseCreate limiters
```

### Frontend
```
frontend/src/
├── app/
│   └── groups/
│       ├── page.tsx            ← Groups list page
│       └── [groupId]/
│           └── page.tsx        ← Individual group page
├── components/
│   └── groups/
│       ├── GroupCard.tsx
│       ├── CreateGroupModal.tsx
│       ├── AddMembersModal.tsx
│       ├── AddExpenseModal.tsx
│       ├── ExpenseList.tsx
│       ├── BalanceSummary.tsx
│       └── SplitInputs.tsx     ← Equal/Custom/Percentage toggle
├── services/
│   └── api.ts                  ← Add group + expense API calls
├── styles/
│   └── groups.css              ← New CSS following friends.css pattern
└── types/
    └── groups.types.ts
```

---

## Known Constraints (v1)

- Single currency per group (`INR` default).
- Settlement/repayment flow not included — balances are display-only.
- Max 50 members per group.
- No group deletion (leave only).
- Push notifications not included — in-app via Socket.IO only.
