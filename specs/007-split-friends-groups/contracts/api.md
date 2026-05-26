# API Contracts: Groups & Expenses

**Feature**: 007-split-friends-groups  
**Base path**: `/api/v1`  
**Auth**: All endpoints require an active session cookie (`sessionAuthMiddleware`)

---

## Groups

### `POST /groups`
Create a new group.

**Rate limit**: 10 per 15 min (groupCreateRateLimiter)

**Request body**:
```json
{
  "name": "Goa Trip 2026",
  "description": "Trip expenses",
  "memberIds": ["userId1", "userId2"]
}
```

**Validation**:
- `name`: required, string, 1–50 chars
- `description`: optional, max 200 chars
- `memberIds`: optional array of valid user ObjectIds; creator is always added automatically
- Duplicate IDs are de-duplicated

**Response `201`**:
```json
{
  "success": true,
  "group": {
    "id": "...",
    "name": "Goa Trip 2026",
    "description": "Trip expenses",
    "creatorId": "...",
    "members": [{ "id": "...", "username": "...", "email": "...", "avatar": null }],
    "isDirect": false,
    "createdAt": "2026-05-26T00:00:00.000Z"
  }
}
```

**Response `400`**: Validation error (name missing, too many members)  
**Response `401`**: Not authenticated

---

### `GET /groups`
List all groups the authenticated user belongs to.

**Response `200`**:
```json
{
  "groups": [
    {
      "id": "...",
      "name": "Goa Trip 2026",
      "isDirect": false,
      "memberCount": 4,
      "createdAt": "..."
    }
  ]
}
```

---

### `GET /groups/:groupId`
Get full group details including members.

**Response `200`**:
```json
{
  "group": {
    "id": "...",
    "name": "...",
    "description": "...",
    "creatorId": "...",
    "members": [...],
    "isDirect": false,
    "createdAt": "..."
  }
}
```

**Response `403`**: User is not a member of this group  
**Response `404`**: Group not found

---

### `POST /groups/:groupId/members`
Add members to an existing group.

**Request body**:
```json
{
  "memberIds": ["userId3", "userId4"]
}
```

**Validation**:
- `memberIds`: required, non-empty array of valid user ObjectIds
- Users already in the group are silently skipped
- `isDirect: true` groups cannot have members added (returns `400`)

**Response `200`**:
```json
{
  "success": true,
  "addedCount": 2,
  "group": { ... }
}
```

**Response `400`**: Invalid payload or direct group  
**Response `403`**: Not a group member

---

### `GET /groups/:groupId/balances`
Get net balance summary for all members in the group.

**Response `200`**:
```json
{
  "balances": [
    {
      "fromUserId": "...",
      "fromUsername": "Alice",
      "toUserId": "...",
      "toUsername": "Bob",
      "amount": 4500
    }
  ],
  "isSettled": false
}
```

---

## Expenses

### `POST /groups/:groupId/expenses`
Add an expense to a group.

**Rate limit**: 30 per 15 min (expenseCreateRateLimiter)

**Request body (equal split)**:
```json
{
  "title": "Dinner at Mario's",
  "totalAmount": 120000,
  "currency": "INR",
  "paidById": "userId1",
  "splitMethod": "equal",
  "date": "2026-05-25"
}
```

**Request body (custom split)**:
```json
{
  "title": "Hotel stay",
  "totalAmount": 600000,
  "currency": "INR",
  "paidById": "userId1",
  "splitMethod": "custom",
  "date": "2026-05-25",
  "splits": [
    { "userId": "userId1", "amount": 200000 },
    { "userId": "userId2", "amount": 200000 },
    { "userId": "userId3", "amount": 200000 }
  ]
}
```

**Request body (percentage split)**:
```json
{
  "title": "Cab",
  "totalAmount": 50000,
  "currency": "INR",
  "paidById": "userId2",
  "splitMethod": "percentage",
  "date": "2026-05-25",
  "splits": [
    { "userId": "userId1", "percentage": 40 },
    { "userId": "userId2", "percentage": 60 }
  ]
}
```

**Validation**:
- `title`: required, 1–100 chars
- `totalAmount`: required, integer > 0 (cents)
- `paidById`: required, must be a group member
- `splitMethod`: one of `"equal"`, `"custom"`, `"percentage"`
- For `"custom"`: splits must be provided and sum to `totalAmount` (±1 cent)
- For `"percentage"`: splits must be provided and sum to 100
- For `"equal"`: no `splits` required; server computes equal shares
- All `userId` values in splits must be group members
- `date`: required, not in the future

**Response `201`**:
```json
{
  "success": true,
  "expense": {
    "id": "...",
    "groupId": "...",
    "title": "Dinner at Mario's",
    "totalAmount": 120000,
    "currency": "INR",
    "paidById": "userId1",
    "paidByName": "Alice",
    "splitMethod": "equal",
    "date": "2026-05-25T00:00:00.000Z",
    "splits": [
      { "userId": "userId1", "username": "Alice", "amount": 40000 },
      { "userId": "userId2", "username": "Bob", "amount": 40000 },
      { "userId": "userId3", "username": "Carol", "amount": 40000 }
    ],
    "createdAt": "..."
  }
}
```

**Response `400`**: Validation error (amount mismatch, invalid split)  
**Response `403`**: Not a group member

---

### `GET /groups/:groupId/expenses`
Get chronological expense list for a group.

**Query params**:
- `limit` (optional, default 20, max 100)
- `before` (optional, ISO date, for pagination)

**Response `200`**:
```json
{
  "expenses": [...],
  "total": 12
}
```

---

## Direct Split (Convenience Endpoint)

### `POST /splits/direct`
Create a one-off split between the authenticated user and one friend. Creates a `isDirect: true` group automatically (or reuses an existing one between the same pair).

**Request body**:
```json
{
  "friendUserId": "userId2",
  "title": "Lunch at Haldirams",
  "totalAmount": 35000,
  "currency": "INR",
  "paidById": "userId1",
  "splitMethod": "equal",
  "date": "2026-05-26"
}
```

**Response `201`**: Same as `POST /groups/:groupId/expenses` but also returns `groupId` of the auto-created/reused direct group.

**Response `400`**: Not friends with `friendUserId`  
**Response `401`**: Not authenticated

---

## Socket.IO Events

| Event name | Payload | Emitted when |
|-----------|---------|-------------|
| `group_update` | `{ groupId: string }` | Group created, member added |
| `expense_update` | `{ groupId: string, expenseId: string }` | Expense added |
