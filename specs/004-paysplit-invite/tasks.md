# Tasks: Invite and User Profile

**Input**: Design documents from `/specs/004-paysplit-invite/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Include all tests required by the feature specification and constitution. Authentication and security features MUST include explicit success-path, failure-path, and abuse-path coverage.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Add `resend` package to `backend/package.json`
- [ ] T002 Add `RESEND_API_KEY` to `backend/.env.example`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 Create `Invitation` Mongoose schema in `backend/src/models/invitation.model.ts`
- [ ] T004 Update `User` Mongoose schema to include `avatarUrl` in `backend/src/models/user.model.ts`
- [ ] T005 [P] Setup rate limiting middleware for API routes in `backend/src/middleware/rateLimiter.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Invite Friends via Email (Priority: P1) 🎯 MVP

**Goal**: As a user, I want to invite friends to the PaySplit platform by entering their email addresses, so that they receive an invitation email containing a link to sign up.

**Independent Test**: Can be independently tested by entering an email, triggering the invite action, and verifying that the correct email is sent with the appropriate invite link.

### Tests for User Story 1 ⚠️

- [ ] T006 [P] [US1] Integration test for successful invite flow in `backend/tests/integration/invite.test.ts`
- [ ] T007 [P] [US1] Failure-path test for rate limiting abuse defense in `backend/tests/integration/invite.test.ts`
- [ ] T008 [P] [US1] Unit tests for Resend service in `backend/tests/unit/email.service.test.ts`

### Implementation for User Story 1

- [ ] T009 [P] [US1] Implement `EmailService` using Resend in `backend/src/services/email.service.ts`
- [ ] T010 [US1] Implement `POST /api/invites` endpoint in `backend/src/api/invite.routes.ts` (with rate limiter)
- [ ] T011 [US1] Create Invite UI component in `frontend/src/components/InviteForm.tsx`
- [ ] T012 [US1] Integrate `InviteForm` with backend API in `frontend/src/services/api.ts`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - View My Profile and Avatar (Priority: P2)

**Goal**: As a user, I want to access a "My Profile" section from a dashboard sidebar, so that I can view my user details and my auto-generated default avatar.

**Independent Test**: Can be tested by navigating the dashboard sidebar, clicking "My Profile", and verifying that user details and a random generated avatar are displayed.

### Tests for User Story 2 ⚠️

- [ ] T013 [P] [US2] Integration test for fetching profile in `backend/tests/integration/profile.test.ts`
- [ ] T014 [P] [US2] UI test for Sidebar responsiveness in `frontend/tests/e2e/sidebar.spec.ts`

### Implementation for User Story 2

- [ ] T015 [P] [US2] Implement DiceBear URL generation logic in `backend/src/services/user.service.ts`
- [ ] T016 [US2] Implement `GET /api/users/profile` endpoint in `backend/src/api/user.routes.ts`
- [ ] T017 [US2] Create responsive Dashboard Sidebar component in `frontend/src/components/Sidebar.tsx`
- [ ] T018 [US2] Create Avatar component in `frontend/src/components/Avatar.tsx`
- [ ] T019 [US2] Create "My Profile" page in `frontend/src/app/profile/page.tsx` integrating Sidebar and Avatar

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - View Invited People List (Priority: P3)

**Goal**: As a user, I want to see a list of people I have successfully invited to the platform, so that I can track my invitations.

**Independent Test**: Can be tested by viewing the invited people section and verifying it correctly lists previously invited emails or users.

### Tests for User Story 3 ⚠️

- [ ] T020 [P] [US3] Integration test for fetching invited people in `backend/tests/integration/invite.test.ts`

### Implementation for User Story 3

- [ ] T021 [US3] Implement `GET /api/invites` endpoint in `backend/src/api/invite.routes.ts`
- [ ] T022 [US3] Create Invited People List component in `frontend/src/components/InvitedList.tsx`
- [ ] T023 [US3] Integrate `InvitedList` into the dashboard or profile page

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T024 Run code formatting and linting
- [ ] T025 Run quickstart.md validation to ensure the feature is documented properly
- [ ] T026 Clean up UI inconsistencies across the newly added components

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2)

### Within Each User Story

- Tests required by the spec or constitution MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority
