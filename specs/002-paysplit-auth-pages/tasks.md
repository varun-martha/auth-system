# Tasks: PaySplit Authentication Pages

**Input**: Design documents from `/specs/002-paysplit-auth-pages/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are included based on the Authentication System Constitution.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize PaySplit branding assets (e.g. colors, fonts) in `frontend/src/app/globals.css` and Next.js configuration.
- [x] T002 [P] Configure global environment variables for Google Client ID and JWT Secret in `backend/.env` and `frontend/.env.local`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Create User Mongoose model based on data-model.md in `backend/src/models/user.ts`
- [x] T004 [P] Implement JWT cookie generation and validation logic in `backend/src/services/jwtService.ts`
- [x] T005 Setup JWT cookie middleware in `backend/src/middleware/auth.ts`
- [x] T006 [P] Implement base API routes structure for auth in `backend/src/api/auth.ts`
- [x] T007 [P] Create frontend API service module for auth in `frontend/src/services/api.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Landing Page Engagement (Priority: P1) 🎯 MVP

**Goal**: Display landing page themed for "PaySplit" with value prop and Login/Register buttons.

**Independent Test**: Can be tested by loading root URL and verifying branding and CTA buttons.

### Tests for User Story 1 ⚠️

- [x] T008 [P] [US1] Integration test for landing page rendering and CTA buttons in `frontend/tests/unit/landing.test.tsx`

### Implementation for User Story 1

- [x] T009 [US1] Create landing page component with "Splitwise-like" aesthetic in `frontend/src/app/page.tsx`
- [x] T010 [US1] Add CTA buttons linking to `/login` and `/register` in `frontend/src/app/page.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - User Registration (Priority: P1)

**Goal**: Allow new users to create an account via email/password or Google SSO.

**Independent Test**: Test by filling out the registration form with valid details and confirming account creation via database or success response.

### Tests for User Story 2 ⚠️

- [ ] T011 [P] [US2] Contract test for `POST /api/auth/register` in `backend/tests/integration/register.test.ts`
- [ ] T012 [P] [US2] Contract test for `POST /api/auth/google` in `backend/tests/integration/googleAuth.test.ts`
- [ ] T013 [P] [US2] Frontend E2E test for registration flow in `frontend/tests/e2e/register.spec.ts`

### Implementation for User Story 2

- [ ] T014 [P] [US2] Implement user registration logic (including password hashing) in `backend/src/services/authService.ts`
- [ ] T015 [US2] Add `POST /api/auth/register` and `POST /api/auth/google` endpoints in `backend/src/api/auth.ts`
- [x] T016 [P] [US2] Create registration form component (Email/Password + Google button) in `frontend/src/app/register/page.tsx`
- [ ] T017 [US2] Integrate frontend registration form with `POST /api/auth/register` and `POST /api/auth/google` in `frontend/src/services/api.ts`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - User Login (Priority: P1)

**Goal**: Existing users can log in via email/password or Google SSO.

**Independent Test**: Test by entering valid credentials and successfully authenticating to a dashboard.

### Tests for User Story 3 ⚠️

- [ ] T018 [P] [US3] Contract test for `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` in `backend/tests/integration/login.test.ts`
- [ ] T019 [P] [US3] Frontend E2E test for login flow in `frontend/tests/e2e/login.spec.ts`

### Implementation for User Story 3

- [ ] T020 [P] [US3] Implement user login logic (password verification) in `backend/src/services/authService.ts`
- [ ] T021 [US3] Add `POST /api/auth/login`, `POST /api/auth/logout`, and `GET /api/auth/me` endpoints in `backend/src/api/auth.ts`
- [x] T022 [P] [US3] Create login form component in `frontend/src/app/login/page.tsx`
- [x] T023 [P] [US3] Create placeholder dashboard component for successful redirects in `frontend/src/app/dashboard/page.tsx` (Completed with liquid dark responsive layout)
- [ ] T024 [US3] Integrate frontend login form with API endpoints in `frontend/src/services/api.ts`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T025a [P] Implement premium liquid dark glassmorphism theme, SEO footer, and responsive dashboard.
- [ ] T025b [P] Security hardening: verify rate limiting and abuse defenses on auth endpoints.
- [ ] T026 Code cleanup, formatting (`npm run format`), and linting (`npm run lint`) for both frontend and backend.
- [ ] T027 Run quickstart.md validation to ensure setup instructions work.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can proceed sequentially or in parallel.
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2). No dependencies.
- **User Story 2 (P1)**: Can start after Foundational (Phase 2). No dependencies on US1.
- **User Story 3 (P1)**: Can start after Foundational (Phase 2). May share components with US2 (like Google SSO logic) but independently testable.

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel.
- All Foundational tasks marked [P] can run in parallel.
- Once Foundational phase completes, User Stories 1, 2, and 3 can start in parallel.
- Test implementations within each story can be written in parallel to implementation tasks.

---

## Implementation Strategy

### MVP First

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently

### Incremental Delivery

1. Add User Story 2 → Test independently → Validate Registration flow
2. Add User Story 3 → Test independently → Validate Login flow
3. Each story adds value without breaking previous stories.
