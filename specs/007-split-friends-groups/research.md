# Research: Split with Friends, Groups & Expenses

**Feature**: 007-split-friends-groups  
**Phase**: 0 — Pre-design research  
**Date**: 2026-05-26

---

## 1. Tech Stack (Resolved)

**Decision**: TypeScript full-stack — Next.js 15 App Router (frontend) + Express.js (backend) + MongoDB/Mongoose (storage).

**Rationale**: Matches the existing project exactly. No new technology is introduced.

**Alternatives considered**: None. Consistency is mandatory.

---

## 2. Authentication & Session Boundary

**Decision**: All group and expense endpoints are protected by `sessionAuthMiddleware` (same cookie-based session middleware used by `/friends`). User identity is read from `req.authenticatedUser.id`.

**Rationale**: The constitution mandates server-side trust decisions. Session cookies are already the approved identity boundary. No new auth mechanism is needed.

**Alternatives considered**: JWT tokens — rejected, the project already uses session cookies and introducing a second mechanism would violate constitution Principle II.

---

## 3. Real-Time Notifications

**Decision**: Use the existing `socketService.emitToUser(userId, event, data)` pattern (Socket.IO) to push `group_update` and `expense_update` events to relevant group members whenever a group or expense changes.

**Rationale**: Socket.IO is already wired into the app, authenticated via session cookie, and used for `friend_update` events. Reusing the same infrastructure is the smallest correct solution.

**Alternatives considered**: Polling — rejected, the existing architecture already delivers real-time and polling would regress UX.

---

## 4. Expense Split Calculation

**Decision**: All split math is performed server-side in a dedicated `expense.service.ts`. The service validates that splits sum to the total (±0.01 rounding tolerance for percentage splits). The remainder from rounding is assigned to the payer's share.

**Rationale**: Client-side math cannot be trusted (constitution Principle III). Server-side validation ensures no inconsistent balances can be persisted.

**Alternatives considered**: Client-only split preview then server accepts final values — rejected, the server must independently validate regardless, so computing server-side avoids duplicate divergent logic.

---

## 5. Balance Computation Strategy

**Decision**: Balances are computed on-the-fly by querying all `ExpenseSplit` records for a group and aggregating per user-pair. A `GET /groups/:id/balances` endpoint returns the pre-computed summary. Results are not cached in a separate collection for v1.

**Rationale**: Groups in v1 support up to 50 members and 50 expenses (per spec SC-006). At this scale, an aggregation pipeline on each request is fast enough. Introducing a materialized balance cache adds complexity without measurable benefit at this scale.

**Alternatives considered**: Persisting a running `Balance` document — deferred to v2 when group size/expense count requires it.

---

## 6. Data Relationship Pattern

**Decision**: Use MongoDB ObjectId references (`ref`) consistent with existing models. Populate is used for reads (lean queries with `.populate()`). No embedded subdocument arrays for splits — each `ExpenseSplit` is its own document with a reference to the parent `Expense`.

**Rationale**: Consistent with `FriendshipModel` and `UserAccountModel` patterns. Separate split documents allow future querying/filtering of individual member shares without re-parsing embedded arrays.

**Alternatives considered**: Embedding splits inside the Expense document — rejected; querying "all expenses I owe money on" requires cross-document aggregation even with embedding, so the benefit is minimal.

---

## 7. Frontend UI Patterns

**Decision**: 
- New sidebar navigation entry: **"Groups"** (`/groups`) — added to `Sidebar.tsx` nav items.
- New route group: `frontend/src/app/groups/` (group list + individual group page).
- New CSS file: `frontend/src/styles/groups.css` — follows the same pattern as `friends.css` (glass panel, liquidFloat orbs, fadeUp animation, brand-accent tokens, mobile media queries).
- Split modals follow the `friends-modal-*` pattern (blurred overlay, slideUp card).
- Expense amount inputs follow the existing `friends-search-input` style.

**Rationale**: Zero new design tokens introduced. Re-using the existing `--brand-accent`, `--panel-background`, `--border-subtle`, `liquidFloat`, and `fadeUp` ensures visual consistency without divergence.

**Alternatives considered**: New design system component library — rejected; the project uses Vanilla CSS by convention and adding a library would conflict with the constitution's simplicity principle.

---

## 8. Rate Limiting

**Decision**: Add two new rate limiters to `rateLimiter.ts`:
- `groupCreateRateLimiter`: 10 group creates per 15 minutes per IP.
- `expenseCreateRateLimiter`: 30 expense creates per 15 minutes per IP.

**Rationale**: Constitution Principle V requires abuse defenses on all mutation endpoints. Pattern matches existing `friendRequestRateLimiter`.

---

## 9. Validation

**Decision**: Zod validators in `backend/src/validators/` for all new request bodies (group create, member add, expense create). Consistent with patterns seen in `login.controller.ts` style.

**Rationale**: Input validation must be server-side (constitution Principle III). Zod provides type-safe validation already in use.

---

## 10. Direct Split (Two-Party)

**Decision**: A direct split is modelled as a special-case group with exactly 2 members, created automatically when a user initiates a "Split with Friend" flow. A `isDirect: boolean` flag on the Group document distinguishes it from multi-member groups in the UI.

**Rationale**: Reusing the Group + Expense model for direct splits avoids a parallel data model. Balance computation, expense history, and notification logic are automatically inherited.

**Alternatives considered**: Separate `DirectSplit` collection — rejected; it would require duplicating most of the expense/balance logic.

---

## 11. Mobile Responsiveness

**Decision**: All new pages follow the existing responsive pattern:
- Groups list: responsive card grid (`auto-fill, minmax(300px, 1fr)`) → single column on `max-width: 768px`.
- Group detail: two-column layout (balance summary + expense list) → stacked on mobile.
- Add Expense modal: full-width on mobile (`width: 95%`), max 500px on desktop.
- Sidebar remains unchanged (hamburger pattern already in place).

**Rationale**: Matches the established `friends.css` and `dashboard.css` responsive breakpoints exactly.
