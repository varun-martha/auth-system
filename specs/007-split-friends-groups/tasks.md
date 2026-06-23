# Tasks: Split with Friends, Groups & Expenses

**Feature**: `007-split-friends-groups`  
**Branch**: `007-split-friends-groups`  
**Input**: Design documents from `specs/007-split-friends-groups/`

**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/api.md ✅ | quickstart.md ✅

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no blocking dependencies)
- **[Story]**: Which user story this task belongs to ([US1]–[US5])
- Exact file paths are included in every task description

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create all new directories and shared type definitions that every subsequent phase depends on.

- [x] T001 Create backend directory structure: `backend/src/models/`, `backend/src/validators/`, `backend/src/services/`, `backend/src/controllers/`, `backend/src/routes/groups/`, `backend/src/routes/splits/`
- [x] T002 Create frontend directory structure: `frontend/src/app/groups/`, `frontend/src/app/groups/[groupId]/`, `frontend/src/components/groups/`
- [x] T003 [P] Create shared TypeScript types file `frontend/src/types/groups.types.ts` — define `Group`, `GroupMember`, `Expense`, `ExpenseSplit`, `GroupBalance` interfaces as specified in `data-model.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Backend models, validators, rate limiters, and route registration that ALL user story phases depend on. No user story can begin until this phase is complete.

**⚠️ CRITICAL**: Complete this phase before any Phase 3+ work.

- [x] T004 [P] Create `backend/src/models/group.model.ts` — Mongoose schema for `groups` collection with fields: `name`, `description`, `creatorId`, `memberIds` (array), `isDirect`; add indexes on `memberIds`, `creatorId`, and compound `{ isDirect, memberIds }`
- [x] T005 [P] Create `backend/src/models/expense.model.ts` — Mongoose schema for `expenses` collection with fields: `groupId`, `title`, `totalAmount` (Number, cents), `currency`, `paidById`, `splitMethod` (enum: equal/custom/percentage), `date`, `createdById`; add compound index `{ groupId, date: -1 }`
- [x] T006 [P] Create `backend/src/models/expense-split.model.ts` — Mongoose schema for `expense_splits` collection with fields: `expenseId`, `groupId` (denormalised), `userId`, `amount` (cents), `percentage` (optional); add indexes on `{ expenseId }`, `{ groupId, userId }`, `{ userId }`
- [x] T007 Update `backend/src/models/index.ts` — re-export `GroupModel`, `ExpenseModel`, `ExpenseSplitModel` alongside existing model exports
- [x] T008 [P] Create `backend/src/validators/group.validator.ts` — Zod schemas for `createGroupBody` (`name` 1–50 chars, optional `description` max 200 chars, optional `memberIds` array) and `addMembersBody` (`memberIds` non-empty array of ObjectId strings)
- [x] T009 [P] Create `backend/src/validators/expense.validator.ts` — Zod schemas for `createExpenseBody` validating `title` 1–100 chars, `totalAmount` > 0 integer, `currency` string, `paidById` ObjectId, `splitMethod` enum, `date` not-future; conditional validation for `splits` array based on `splitMethod`
- [x] T010 Update `backend/src/middleware/rateLimiter.ts` — add `groupCreateRateLimiter` (10 per 15 min) and `expenseCreateRateLimiter` (30 per 15 min) following the existing `friendRequestRateLimiter` pattern

**Checkpoint**: All models, validators, and rate limiters exist. Route registration begins next.

---

## Phase 3: User Story 1 — Create a Split Group (Priority: P1) 🎯 MVP

**Goal**: Allow authenticated users to create a named group and invite friends as members. The group appears in the group list for all members immediately after creation.

**Independent Test**: Create a group via `POST /api/v1/groups` with a name and one `memberId`, verify `201` response, then call `GET /api/v1/groups` as the invited member and confirm the group appears.

### Implementation — User Story 1

- [x] T011 [P] [US1] Create `backend/src/services/group.service.ts` — implement `createGroup({ name, description, creatorId, memberIds, isDirect })` that de-duplicates memberIds, validates max 50 members, persists to `groups` collection, and emits `group_update` via `socketService.emitToUser` to all added members
- [x] T012 [P] [US1] Create `backend/src/controllers/group.controller.ts` — implement `createGroupController` using `groupCreateRateLimiter`, parse and validate body with `createGroupBody` Zod schema, call `group.service.ts`, return `201` with populated group; implement `listGroupsController` querying `GroupModel` by `{ memberIds: userId }` returning summary list
- [x] T013 [US1] Create `backend/src/routes/groups/index.ts` — register `POST /groups` → `createGroupController` and `GET /groups` → `listGroupsController`, both behind `sessionAuthMiddleware`; register `groupCreateRateLimiter` on `POST /groups` (depends on T010, T012)
- [x] T014 [US1] Update `backend/src/routes/index.ts` — import and call `registerGroupRoutes(router)` and `registerSplitRoutes(router)` after existing route registrations (depends on T013)
- [x] T015 [P] [US1] Create `frontend/src/styles/groups.css` — glass panel page shell (`.groups-page`, `.groups-shell`) with liquidFloat orb background using `rgba(16,185,129,0.05)` tint; responsive grid `.groups-grid` (`auto-fill, minmax(300px,1fr)`) collapsing to single column at 768px; `.group-card` with hover lift + brand-accent glow; empty-state style; follow `friends.css` pattern exactly
- [x] T016 [P] [US1] Create `frontend/src/components/groups/GroupCard.tsx` — display group name, stacked member avatars (max 5 + overflow count), member count, creation date; hover state with border glow; link to `/groups/[groupId]`
- [x] T017 [P] [US1] Create `frontend/src/components/groups/CreateGroupModal.tsx` — modal with group name input (required), optional description textarea, member search input reusing `.friends-search-input` style, member chips row with ✕ remove, "Create Group" primary button; validate name required before submit; follow `friends-modal-*` CSS pattern with `slideUp` + `fadeIn` animations
- [x] T018 [US1] Create `frontend/src/app/groups/layout.tsx` — wrap with `<Sidebar />` and `<main className="groups-main">` identical to `friends/layout.tsx` structure (depends on T015)
- [x] T019 [US1] Create `frontend/src/app/groups/page.tsx` — groups list page: fetch groups via `api.getGroups()`, render `<GroupCard>` grid, header with "Your Groups" h1 and "Create Group" button that opens `<CreateGroupModal>`; empty state if no groups; mark `"use client"` (depends on T016, T017, T018)
- [x] T020 [US1] Update `frontend/src/services/api.ts` — add `getGroups()`, `createGroup(payload)`, `getGroup(id)`, `addGroupMembers(id, memberIds)`, `getGroupBalances(id)`, `getGroupExpenses(id)`, `createExpense(groupId, payload)`, `createDirectSplit(payload)` using existing `fetchJson` + `buildApiUrl` pattern (depends on T013, T014)
- [x] T021 [US1] Update `frontend/src/components/Sidebar.tsx` — add `{ name: "Groups", href: "/groups" }` to `navItems` array between "Your Friends" and "My Profile"

**Checkpoint**: User can create a group, invite friends, and see the groups list. Core feature is live and testable end-to-end.

---

## Phase 4: User Story 3 — Add an Expense to a Group (Priority: P1) 🎯 MVP

**Goal**: A group member can record a shared expense with equal, custom, or percentage split. Server validates splits sum to total and persists per-member `ExpenseSplit` records. All group members see the new expense instantly.

**Independent Test**: `POST /api/v1/groups/:id/expenses` with an equal split, verify `201`, fetch `GET /api/v1/groups/:id/expenses`, confirm the expense appears with correct per-member share amounts.

> Note: US3 is P1 in the spec (same priority as US1) — implemented directly after group creation since expense recording is the core value proposition.

### Implementation — User Story 3

- [x] T022 [US3] Create `backend/src/services/expense.service.ts` — implement `createExpense({ groupId, title, totalAmount, currency, paidById, splitMethod, date, splits, createdById })`:
  - Verify `paidById` and all split `userId` values are group members
  - For `equal`: auto-compute shares, assign remainder to payer
  - For `custom`: validate sum ±1 cent equals `totalAmount`
  - For `percentage`: validate sum = 100, convert to cent amounts
  - Persist `Expense` document then bulk-insert `ExpenseSplit` documents
  - Emit `expense_update` via `socketService.emitToUser` to all group members
  (depends on T004–T006)
- [x] T023 [US3] Create `backend/src/controllers/expense.controller.ts` — implement `createExpenseController` (validate body with `createExpenseBody`, call `expense.service`, return `201` populated expense) and `listExpensesController` (query expenses by `groupId` descending by `date`, paginate with `limit` + `before`) (depends on T022)
- [x] T024 [US3] Add expense routes to `backend/src/routes/groups/index.ts` — `POST /groups/:groupId/expenses` → `createExpenseController` with `expenseCreateRateLimiter` + `sessionAuthMiddleware`; `GET /groups/:groupId/expenses` → `listExpensesController` (depends on T023)
- [x] T025 [P] [US3] Create `frontend/src/components/groups/AddExpenseModal.tsx` — modal with:
  - Title input, amount input (₹ prefix, large monospace font)
  - Date input (HTML date, styled to match theme)
  - Payer selector dropdown from group members
  - Split method segmented toggle: `Equal | Custom | Percentage` (reuse `.friends-tabs` style)
  - Equal: read-only per-member share preview
  - Custom: editable amount per member row + running total indicator (green when matched, red when off) with animated CSS transition
  - Percentage: editable % per member + total indicator
  - "Add Expense" primary button disabled until validation passes
  (depends on T015)
- [x] T026 [P] [US3] Create `frontend/src/components/groups/ExpenseList.tsx` — chronological expense cards showing title, date, payer name, total amount (₹), split method chip ("Split equally" / "Custom" / "By %"); hover reveals per-member split breakdown; empty state "No expenses yet — add the first one!"
- [x] T027 [US3] Create `frontend/src/app/groups/[groupId]/page.tsx` — group detail page:
  - Fetch group details + expenses + balances in parallel via `Promise.all`
  - Render group name/description header, member avatar row, "Add Members" and "Add Expense" buttons
  - Desktop: two-column grid (balance left, expenses right)
  - Mobile ≤768px: single column stacked (balance above expenses)
  - Wire `<AddExpenseModal>` open/close state
  - Wire `<BalanceSummary>` and `<ExpenseList>` components
  - Mark `"use client"` (depends on T025, T026)

**Checkpoint**: Groups + Expenses are fully functional. Users can record and view shared expenses with any split method.

---

## Phase 5: User Story 2 — Add Members to an Existing Group (Priority: P2)

**Goal**: A group member can add new friends to an existing group after creation. New members immediately gain access to the group and its expense history.

**Independent Test**: `POST /api/v1/groups/:id/members` with a valid `memberIds` array, verify `200`, call `GET /api/v1/groups/:id` as the new member and confirm access.

### Implementation — User Story 2

- [x] T028 [US2] Add `getGroupController` and `addMembersController` to `backend/src/controllers/group.controller.ts`:
  - `getGroupController`: fetch group by id, verify requesting user is a member (403 if not), return populated members list
  - `addMembersController`: validate `addMembersBody`, reject `isDirect` groups (400), de-duplicate against existing members, push new memberIds, emit `group_update` to new members
  (depends on T011, T012)
- [x] T029 [US2] Add routes to `backend/src/routes/groups/index.ts` — `GET /groups/:groupId` → `getGroupController` and `POST /groups/:groupId/members` → `addMembersController`, both behind `sessionAuthMiddleware` (depends on T028)
- [x] T030 [P] [US2] Create `frontend/src/components/groups/AddMembersModal.tsx` — modal with friend search input (reuse `.friends-search-input`), search results list showing already-member indicator (greyed with "Already added"), "Add" button per result; success confirmation showing added count; follow `friends-modal-*` pattern (depends on T015)
- [x] T031 [US2] Wire `<AddMembersModal>` into `frontend/src/app/groups/[groupId]/page.tsx` — "Add Members" button opens modal, on success refetch group details and update member avatar row (depends on T027, T030)

**Checkpoint**: Group membership management is complete. Any member can grow the group after creation.

---

## Phase 6: User Story 4 — View Group Balances & Expense History (Priority: P2)

**Goal**: All group members can see a net balance summary (who owes whom) and a full chronological expense list. "All settled up 🎉" shown when all balances are zero.

**Independent Test**: Add 3 expenses with different payers to a group, call `GET /api/v1/groups/:id/balances`, verify the net amounts are arithmetically correct and simplified (no double-counting).

### Implementation — User Story 4

- [x] T032 [US4] Add `getGroupBalances` to `backend/src/services/expense.service.ts` — aggregate `expense_splits` joined with `expenses.paidById` for the group; compute per-pair net amounts; simplify (if A→B $10 and B→A $6, result is A→B $4); return `GroupBalance[]` array and `isSettled` boolean (depends on T022)
- [x] T033 [US4] Create `getGroupBalancesController` in `backend/src/controllers/expense.controller.ts` — verify membership (403), call `getGroupBalances`, return `{ balances, isSettled }` (depends on T032)
- [x] T034 [US4] Add `GET /groups/:groupId/balances` → `getGroupBalancesController` to `backend/src/routes/groups/index.ts` behind `sessionAuthMiddleware` (depends on T033)
- [x] T035 [P] [US4] Create `frontend/src/components/groups/BalanceSummary.tsx` — balance summary card:
  - "All settled up 🎉" empty state with green icon when `isSettled: true`
  - Per-balance row: "[Name] owes [Name] ₹X.XX" with red/green amount badge
  - Smooth entrance animation matching other cards
  - Compact mobile view: name truncation + amount only
  (depends on T015)
- [x] T036 [US4] Confirm `frontend/src/app/groups/[groupId]/page.tsx` fetches and renders balances correctly — verify `Promise.all([getGroup, getExpenses, getGroupBalances])` pattern, wire `<BalanceSummary>` with real data (depends on T027, T035)

**Checkpoint**: Full expense tracking with balance display is operational. Users know exactly who owes what.

---

## Phase 7: User Story 5 — Direct Split with a Friend (Priority: P3)

**Goal**: A user can record a one-off expense directly with a single friend without creating a formal group. The system auto-creates (or reuses) an `isDirect` group behind the scenes.

**Independent Test**: `POST /api/v1/splits/direct` with a valid `friendUserId`, verify `201`; call it again for the same pair, confirm the same `groupId` is reused (no duplicate direct group created).

### Implementation — User Story 5

- [x] T037 [US5] Add `getOrCreateDirectGroup` to `backend/src/services/group.service.ts` — query for an existing `isDirect: true` group where `memberIds` contains exactly `[userId, friendUserId]`; create one if none found; verify the two users are friends (query `FriendshipModel` for accepted friendship — reject 400 if not friends) (depends on T011)
- [x] T038 [US5] Create `backend/src/controllers/split.controller.ts` — implement `createDirectSplitController`: validate `friendUserId` + expense payload, call `getOrCreateDirectGroup`, call `createExpense` service with the resolved `groupId`, return `201` with expense + `groupId` (depends on T022, T037)
- [x] T039 [US5] Create `backend/src/routes/splits/index.ts` — register `POST /splits/direct` → `createDirectSplitController` with `sessionAuthMiddleware` + `expenseCreateRateLimiter`
- [x] T040 [US5] Update `backend/src/routes/index.ts` — import and call `registerSplitRoutes(router)` (depends on T039)
- [x] T041 [P] [US5] Update `frontend/src/app/friends/page.tsx` — add "Split" button to each accepted friend card in the friends list; opens `<AddExpenseModal>` pre-configured for direct split (calls `api.createDirectSplit`) instead of group expense; follows existing `card-actions` button layout pattern

**Checkpoint**: Direct splits are available from the Friends page. No group creation friction for simple two-party expenses.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Socket.IO real-time updates, mobile polish, navigation, and final integration.

- [x] T042 [P] Wire Socket.IO `group_update` listener in `frontend/src/app/groups/page.tsx` — on event, refetch groups list to reflect new memberships or group additions in real time; follow the existing `friend_update` socket pattern used in the friends page
- [x] T043 [P] Wire Socket.IO `expense_update` listener in `frontend/src/app/groups/[groupId]/page.tsx` — on event matching current `groupId`, refetch expenses and balances; show a brief "New expense added" toast/pulse animation on the expense list
- [x] T044 [P] Add `groups.css` import to `frontend/src/app/globals.css` — add `@import "../styles/groups.css"` after the `friends.css` import line
- [x] T045 [P] Mobile polish pass on `frontend/src/styles/groups.css` — verify all breakpoints at 375px, 480px, 768px: single-column group detail, full-width modals (`width: 95%`), compact balance rows, touch-friendly buttons (min-height 44px), expense card compact view at 480px
- [x] T046 [P] Add `"use client"` socket hook to groups pages — ensure socket connection/disconnection lifecycle is managed correctly (connect on mount, disconnect on unmount) following the pattern established in the friends page
- [x] T047 Review and add missing `aria-label` attributes to all new interactive elements in group components for accessibility (modal close buttons, split method toggle, expense form inputs)
- [x] T048 [P] Update `frontend/src/app/dashboard/page.tsx` — wire "Add an expense" button to navigate to `/groups` (replace the non-functional static button with a `Link` to the groups page)
- [x] T049 Run quickstart.md manual verification — create group, add expense (all 3 split methods), verify balances, test direct split, verify mobile layout at 375px viewport

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
    └── Phase 2 (Foundational: models, validators, rate limiters)
            ├── Phase 3 (US1: Create Group) ← MVP starts here
            │       └── Phase 4 (US3: Add Expense) ← depends on group existing
            │               └── Phase 6 (US4: Balances) ← depends on expenses
            ├── Phase 5 (US2: Add Members) ← parallel with US3 after foundational
            └── Phase 7 (US5: Direct Split) ← parallel with US2/US4
                    └── Phase 8 (Polish) ← after all stories complete
```

### User Story Dependencies

| Story | Depends on | Can parallelize with |
|-------|-----------|---------------------|
| US1 — Create Group (P1) | Phase 2 complete | US2 backend work |
| US3 — Add Expense (P1) | US1 complete (group must exist) | US2 frontend |
| US2 — Add Members (P2) | Phase 2 complete | US3 in parallel |
| US4 — View Balances (P2) | US3 complete (expenses must exist) | US2 |
| US5 — Direct Split (P3) | US3 complete (reuses expense service) | US4 |

### Within Each Phase

1. Models (`T004–T006`) → can all run in parallel [P]
2. Validators (`T008–T009`) → can run in parallel with models [P]
3. Service → depends on models
4. Controller → depends on service
5. Route → depends on controller
6. Frontend components [P] → can be built while backend is wired
7. Page assembly → depends on components

---

## Parallel Execution Examples

### Phase 2 — Run all foundational tasks together

```
Parallel group:
  T004 — group.model.ts
  T005 — expense.model.ts
  T006 — expense-split.model.ts
  T008 — group.validator.ts
  T009 — expense.validator.ts
  T010 — rateLimiter.ts updates
Then:
  T007 — models/index.ts (after T004–T006)
```

### Phase 3 (US1) — Backend and frontend in parallel

```
Parallel group (once Phase 2 done):
  T011 — group.service.ts
  T015 — groups.css
  T016 — GroupCard.tsx
  T017 — CreateGroupModal.tsx
Then:
  T012 — group.controller.ts (after T011)
  T018 — groups layout.tsx (after T015)
Then:
  T013 — routes/groups/index.ts (after T012)
  T019 — groups/page.tsx (after T016, T017, T018)
  T020 — api.ts updates (after T013)
  T021 — Sidebar.tsx update
```

### Phase 4 (US3) — Expense backend + UI components in parallel

```
Parallel group:
  T022 — expense.service.ts
  T025 — AddExpenseModal.tsx
  T026 — ExpenseList.tsx
Then:
  T023 — expense.controller.ts (after T022)
  T024 — expense routes (after T023)
  T027 — groups/[groupId]/page.tsx (after T025, T026)
```

---

## Implementation Strategy

### MVP (Phase 1 → Phase 2 → Phase 3 → Phase 4)

1. Complete **Phase 1** (Setup — ~15 min)
2. Complete **Phase 2** (Foundational models + validators — ~30 min)
3. Complete **Phase 3** (US1: Create Group — groups list, creation modal, sidebar nav)
4. Complete **Phase 4** (US3: Add Expense — expense modal, expense list, group detail page)
5. **STOP and VALIDATE**: Group creation + expense recording fully functional end-to-end
6. Demo / test at this point — this is shippable MVP

### Incremental Delivery After MVP

- Add **Phase 5** (US2: Add Members) → test independently
- Add **Phase 6** (US4: Balances) → balance summary card live
- Add **Phase 7** (US5: Direct Split) → friends page split button works
- **Phase 8** (Polish) → real-time updates, mobile validation, dashboard wiring

### Task Count Summary

| Phase | Tasks | Notes |
|-------|-------|-------|
| Phase 1: Setup | 3 | Fast, all parallelizable |
| Phase 2: Foundational | 7 | Blocks everything — do first |
| Phase 3: US1 Create Group | 11 | P1 MVP |
| Phase 4: US3 Add Expense | 6 | P1 MVP |
| Phase 5: US2 Add Members | 4 | P2 |
| Phase 6: US4 Balances | 5 | P2 |
| Phase 7: US5 Direct Split | 5 | P3 |
| Phase 8: Polish | 8 | Cross-cutting |
| **Total** | **49** | |

---

## Notes

- `[P]` tasks touch different files — safe to execute concurrently
- `[Story]` label maps each task to the user story for full traceability
- Each story phase has a **Checkpoint** — stop and verify before proceeding
- Commit after each logical group (model, service, controller, page)
- All amounts stored as **integer cents** — never use floating point for money
- All new routes require `sessionAuthMiddleware` — no exceptions
- Rate limiters required on all create/mutation endpoints (constitution Principle V)
- Zod validation required on all new request bodies (constitution Principle III)
