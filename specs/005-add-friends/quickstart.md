# Quickstart: Adding Friends Implementation

This guide outlines the critical steps for developers implementing the Adding Friends feature.

## 1. Environment Setup
No new environment variables are strictly required beyond the existing MongoDB connection and JWT secrets used for authentication.

## 2. Backend Implementation (Express/Mongoose)
1. **Model**: Create `Friendship` Mongoose model in `backend/src/models/Friendship.ts`.
2. **Controllers**: Create `friendController.ts` and `userController.ts` (if search doesn't exist) to handle the API contracts.
3. **Routes**: Wire up `/api/users/search` and `/api/friends/*` endpoints in `backend/src/api/routes`.
4. **Middleware**: Apply session verification middleware to all new routes. Apply `express-rate-limit` to the search and friend request POST routes.

## 3. Frontend Implementation (Next.js/React)
1. **API Client**: Add search and friend management methods to the frontend API services (`frontend/src/services/api.ts`).
2. **Sidebar**: Update the main layout sidebar to include a "Your Friends" link.
3. **Pages**:
   - `/friends`: Displays current friends and pending requests.
   - `/search`: Search input for finding users, rendering `UserCard` components for results.
4. **Components**:
   - `UserCard`: Displays avatar, username, email, and the appropriate action button (Add Friend, Accept, Remove).

## 4. Testing
- Write backend unit tests for the `Friendship` model validations (cannot friend self).
- Write endpoint integration tests (requires auth token setup).
- E2E Playwright test: Log in as User A, search for User B, send request, log in as User B, accept request, verify friendship on both accounts.
