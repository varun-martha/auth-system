# Tasks: Adding Friends

**Input**: Design documents from `/specs/005-add-friends/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/api.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Verify existing project structure, User model, and authentication middleware

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T002 Create Friendship model in `backend/src/models/Friendship.ts`
- [ ] T003 [P] Implement rate limiting configuration for search and friend endpoints in `backend/src/api/middlewares/rateLimiter.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Search and View Users (Priority: P1) 🎯 MVP

**Goal**: Users can search for other users by email or username.

**Independent Test**: Can be fully tested by entering an existing user's email or username in a search bar and verifying the correct user profile appears.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T004 [P] [US1] Integration test for user search endpoint in `backend/tests/integration/test_search.ts`
- [ ] T005 [P] [US1] Failure-path test for rate limiting on search endpoint in `backend/tests/integration/test_search_ratelimit.ts`

### Implementation for User Story 1

- [ ] T006 [P] [US1] Create search endpoint (`GET /api/users/search`) in `backend/src/api/userController.ts`
- [ ] T007 [US1] Add search API client method in `frontend/src/services/api.ts`
- [ ] T008 [P] [US1] Create UserCard component in `frontend/src/components/UserCard.tsx`
- [ ] T009 [US1] Create Search page in `frontend/src/app/search/page.tsx` integrating the API and UserCard

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Manage Friends List (Priority: P1)

**Goal**: Users can access a "Your Friends" section to view and manage current friends.

**Independent Test**: Can be fully tested by navigating to the "Your Friends" section and observing the list of existing friends.

### Tests for User Story 2 ⚠️

- [ ] T010 [P] [US2] Integration test for get friends endpoint in `backend/tests/integration/test_friends.ts`
- [ ] T011 [P] [US2] Integration test for remove friend endpoint in `backend/tests/integration/test_friends_remove.ts`

### Implementation for User Story 2

- [ ] T012 [P] [US2] Create get friends endpoint (`GET /api/friends`) in `backend/src/api/friendController.ts`
- [ ] T013 [P] [US2] Create remove friend endpoint (`DELETE /api/friends/:friendshipId`) in `backend/src/api/friendController.ts`
- [ ] T014 [US2] Implement friends API client methods in `frontend/src/services/api.ts`
- [ ] T015 [US2] Create Friends page to display current friends in `frontend/src/app/friends/page.tsx`
- [ ] T016 [US2] Add "Your Friends" navigation link to the main layout in `frontend/src/components/Sidebar.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Send Friend Requests (Priority: P2)

**Goal**: Users can send friend requests to other users found through search.

**Independent Test**: Can be tested by searching for a user and clicking an "Add Friend" button, verifying that a request is initiated.

### Tests for User Story 3 ⚠️

- [ ] T017 [P] [US3] Integration test for send and accept friend requests in `backend/tests/integration/test_friend_requests.ts`

### Implementation for User Story 3

- [ ] T018 [P] [US3] Create send request endpoint (`POST /api/friends/request`) in `backend/src/api/friendController.ts`
- [ ] T019 [P] [US3] Create accept request endpoint (`POST /api/friends/accept`) in `backend/src/api/friendController.ts`
- [ ] T020 [US3] Add request API client methods in `frontend/src/services/api.ts`
- [ ] T021 [US3] Update UserCard component to show Add Friend / Accept Request actions in `frontend/src/components/UserCard.tsx`
- [ ] T022 [US3] Display pending incoming and outgoing requests on the Friends page in `frontend/src/app/friends/page.tsx`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T023 [P] E2E Playwright test for complete friend flow (search, request, accept, view list) in `frontend/tests/e2e/friend_flow.spec.ts`
- [ ] T024 [P] Update documentation with new API endpoints
- [ ] T025 Run quality checks (linting/type-checking) across all new files

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can proceed sequentially (US1 → US2 → US3) or in parallel.
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2).
- **User Story 2 (P1)**: Can start after Foundational (Phase 2).
- **User Story 3 (P2)**: Integrates UI with US1 (Search) and US2 (Friends list) but API endpoints can be developed in parallel.

### Parallel Opportunities

- All tests for a user story marked [P] can run in parallel
- Endpoints within a story marked [P] can run in parallel
- Backend API and Frontend API clients can be developed in parallel by mocking responses.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
