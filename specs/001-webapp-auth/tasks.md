# Tasks: Webapp Authentication

**Input**: Design documents from `/specs/001-webapp-auth/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Include all tests required by the feature specification and
constitution. Authentication and security features MUST include explicit
success-path, failure-path, and abuse-path coverage.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`
- **Tests**: `backend/tests/`, `frontend/tests/`
- **Feature docs**: `specs/001-webapp-auth/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and monorepo structure

- [X] T001 Create the monorepo folder structure for `frontend/`, `backend/`, and `shared/conventions/` per `specs/001-webapp-auth/plan.md`
- [X] T002 Initialize the frontend workspace in `frontend/package.json` and `frontend/tsconfig.json`
- [X] T003 Initialize the backend workspace in `backend/package.json` and `backend/tsconfig.json`
- [X] T004 [P] Add shared naming and clean-code rules in `shared/conventions/naming-and-style.md`
- [X] T005 [P] Configure frontend linting and formatting in `frontend/eslint.config.js`, `frontend/.prettierrc`, and `frontend/package.json`
- [X] T006 [P] Configure backend linting and formatting in `backend/eslint.config.js`, `backend/.prettierrc`, and `backend/package.json`
- [X] T007 [P] Configure root workspace scripts in `package.json` for install, lint, test, and type-check orchestration

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T008 Create frontend application shell and route groups in `frontend/src/app/layout.tsx`, `frontend/src/app/(marketing)/page.tsx`, `frontend/src/app/(auth)/sign-in/page.tsx`, `frontend/src/app/(auth)/sign-up/page.tsx`, and `frontend/src/app/dashboard/page.tsx`
- [X] T009 Create backend Express bootstrap and route registration in `backend/src/app/server.ts`, `backend/src/app/app.ts`, and `backend/src/routes/index.ts`
- [X] T010 [P] Configure environment loading and validation in `backend/src/config/env.ts`, `frontend/src/lib/env.ts`, `backend/.env.example`, and `frontend/.env.example`
- [X] T011 [P] Configure MongoDB connection and base schema options in `backend/src/config/database.ts` and `backend/src/models/index.ts`
- [X] T012 [P] Implement core shared backend models in `backend/src/models/user-account.model.ts`, `backend/src/models/identity-link.model.ts`, `backend/src/models/user-session.model.ts`, and `backend/src/models/auth-audit-event.model.ts`
- [X] T013 [P] Implement auth middleware, session middleware, and error handling in `backend/src/middleware/session-auth.middleware.ts`, `backend/src/middleware/rate-limit.middleware.ts`, and `backend/src/middleware/error-handler.middleware.ts`
- [X] T014 [P] Implement core repositories in `backend/src/repositories/user-account.repository.ts`, `backend/src/repositories/identity-link.repository.ts`, `backend/src/repositories/user-session.repository.ts`, and `backend/src/repositories/auth-audit-event.repository.ts`
- [X] T015 [P] Implement backend utilities for password hashing, session tokens, and audit logging in `backend/src/utils/password.util.ts`, `backend/src/utils/session.util.ts`, and `backend/src/utils/audit-log.util.ts`
- [X] T016 [P] Implement backend request validators in `backend/src/validators/register.validator.ts`, `backend/src/validators/login.validator.ts`, and `backend/src/validators/google-auth.validator.ts`
- [X] T017 [P] Implement frontend API client and auth session helpers in `frontend/src/services/auth-api.service.ts`, `frontend/src/lib/fetcher.ts`, and `frontend/src/lib/session.ts`
- [X] T018 Define the protected-route and session contract coverage in `backend/tests/contract/auth-api.contract.test.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Explore and register (Priority: P1) 🎯 MVP

**Goal**: Deliver the modern landing page and a complete credential-based sign-up flow that lands the new user in the protected area

**Independent Test**: A new visitor can browse the landing page, navigate to sign up, create an account with valid details, and reach the protected dashboard with an authenticated session

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T019 [P] [US1] Add contract coverage for `POST /auth/register` in `backend/tests/contract/register.contract.test.ts`
- [X] T020 [P] [US1] Add backend integration tests for registration success and duplicate-email rejection in `backend/tests/integration/register.integration.test.ts`
- [X] T021 [P] [US1] Add frontend end-to-end test for landing-to-sign-up journey in `frontend/tests/e2e/sign-up-flow.spec.ts`
- [X] T022 [P] [US1] Add frontend unit tests for the sign-up form and landing CTA behavior in `frontend/tests/unit/sign-up-form.test.tsx` and `frontend/tests/unit/landing-page.test.tsx`
- [X] T023 [P] [US1] Add failure-path and abuse-path tests for invalid registration input and repeated registration attempts in `backend/tests/integration/register-security.integration.test.ts`

### Implementation for User Story 1

- [X] T024 [P] [US1] Implement landing page sections and plain CSS styling in `frontend/src/app/(marketing)/page.tsx` and `frontend/src/styles/landing-page.css`
- [X] T025 [P] [US1] Implement reusable marketing and auth CTA components in `frontend/src/components/marketing/hero-section.tsx`, `frontend/src/components/marketing/feature-grid.tsx`, and `frontend/src/components/layout/auth-cta-bar.tsx`
- [X] T026 [P] [US1] Implement sign-up form UI and styling in `frontend/src/components/auth/sign-up-form.tsx` and `frontend/src/styles/sign-up-form.css`
- [X] T027 [P] [US1] Implement registration DTOs and response types in `frontend/src/types/auth/register.ts` and `backend/src/types/auth/register-request.ts`
- [X] T028 [P] [US1] Implement registration service flow in `backend/src/services/register-user.service.ts` and `backend/src/services/create-session.service.ts`
- [X] T029 [US1] Implement registration controller and route in `backend/src/controllers/register.controller.ts` and `backend/src/routes/auth/register.route.ts`
- [X] T030 [US1] Wire frontend sign-up submission and redirect handling in `frontend/src/app/(auth)/sign-up/page.tsx` and `frontend/src/services/auth/register-user.ts`
- [X] T031 [US1] Add registration error messaging and audit event recording in `frontend/src/components/auth/sign-up-feedback.tsx` and `backend/src/services/audit-registration-event.service.ts`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Sign in with credentials or Google (Priority: P2)

**Goal**: Allow returning users to authenticate with credentials or Google and land in the same protected destination

**Independent Test**: An existing user can sign in with valid credentials or Google SSO, failed attempts are handled safely, and both paths redirect to the protected dashboard or homepage

### Tests for User Story 2 ⚠️

- [X] T032 [P] [US2] Add contract coverage for `POST /auth/login` and `POST /auth/google` in `backend/tests/contract/login.contract.test.ts` and `backend/tests/contract/google-auth.contract.test.ts`
- [X] T033 [P] [US2] Add backend integration tests for credential login success and failure in `backend/tests/integration/login.integration.test.ts`
- [X] T034 [P] [US2] Add backend integration tests for Google SSO success, cancellation, and token rejection in `backend/tests/integration/google-auth.integration.test.ts`
- [X] T035 [P] [US2] Add frontend end-to-end tests for credential login and Google login entry flow in `frontend/tests/e2e/sign-in-flow.spec.ts`
- [X] T036 [P] [US2] Add abuse-path tests for rate limiting and unauthorized credential retries in `backend/tests/integration/login-rate-limit.integration.test.ts`

### Implementation for User Story 2

- [X] T037 [P] [US2] Implement sign-in form UI and styling in `frontend/src/components/auth/sign-in-form.tsx` and `frontend/src/styles/sign-in-form.css`
- [X] T038 [P] [US2] Implement Google sign-in button component and callback handling in `frontend/src/components/auth/google-sign-in-button.tsx` and `frontend/src/services/auth/google-sign-in.ts`
- [X] T039 [P] [US2] Implement credential login service flow in `backend/src/services/login-user.service.ts` and `backend/src/services/verify-password.service.ts`
- [X] T040 [P] [US2] Implement Google token verification and account-linking services in `backend/src/services/verify-google-token.service.ts` and `backend/src/services/link-google-identity.service.ts`
- [X] T041 [US2] Implement login and Google auth controllers and routes in `backend/src/controllers/login.controller.ts`, `backend/src/controllers/google-auth.controller.ts`, `backend/src/routes/auth/login.route.ts`, and `backend/src/routes/auth/google.route.ts`
- [X] T042 [US2] Wire frontend sign-in page flows, redirect behavior, and error states in `frontend/src/app/(auth)/sign-in/page.tsx` and `frontend/src/components/auth/auth-error-banner.tsx`
- [X] T043 [US2] Add login audit events, rate-limit integration, and provider-specific failure handling in `backend/src/services/audit-login-event.service.ts` and `backend/src/middleware/rate-limit.middleware.ts`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - View authenticated profile summary (Priority: P3)

**Goal**: Show signed-in users their username and email on the protected destination and keep unauthorized users out

**Independent Test**: A signed-in user can load the protected dashboard or homepage, view username/email, refresh during an active session, and an unauthenticated visitor is redirected or rejected

### Tests for User Story 3 ⚠️

- [X] T044 [P] [US3] Add contract coverage for `GET /auth/me`, `GET /users/me`, and `POST /auth/logout` in `backend/tests/contract/session-profile.contract.test.ts`
- [X] T045 [P] [US3] Add backend integration tests for authenticated profile retrieval, logout, and unauthorized access in `backend/tests/integration/session-profile.integration.test.ts`
- [X] T046 [P] [US3] Add frontend end-to-end test for protected dashboard access and session persistence in `frontend/tests/e2e/dashboard-session.spec.ts`
- [X] T047 [P] [US3] Add frontend unit tests for dashboard profile rendering and auth guard behavior in `frontend/tests/unit/dashboard-profile.test.tsx` and `frontend/tests/unit/auth-guard.test.tsx`
- [X] T048 [P] [US3] Add failure-path tests for expired or revoked sessions in `backend/tests/integration/session-expiry.integration.test.ts`

### Implementation for User Story 3

- [X] T049 [P] [US3] Implement current-user and logout service flow in `backend/src/services/get-current-user.service.ts` and `backend/src/services/logout-user.service.ts`
- [X] T050 [P] [US3] Implement current-user and logout controllers and routes in `backend/src/controllers/current-user.controller.ts`, `backend/src/controllers/logout.controller.ts`, `backend/src/routes/auth/current-user.route.ts`, `backend/src/routes/auth/logout.route.ts`, and `backend/src/routes/users/profile.route.ts`
- [X] T051 [P] [US3] Implement frontend auth guard, protected data loader, and session bootstrap in `frontend/src/lib/require-auth.ts`, `frontend/src/services/auth/get-current-user.ts`, and `frontend/src/app/dashboard/page.tsx`
- [X] T052 [P] [US3] Implement dashboard profile components and plain CSS styling in `frontend/src/components/auth/dashboard-profile-card.tsx` and `frontend/src/styles/dashboard.css`
- [X] T053 [US3] Implement logout UI, unauthorized redirect handling, and stale-session recovery in `frontend/src/components/auth/logout-button.tsx`, `frontend/src/app/dashboard/page.tsx`, and `frontend/src/app/(auth)/sign-in/page.tsx`
- [X] T054 [US3] Record unauthorized access and session-revocation audit events in `backend/src/services/audit-session-event.service.ts`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T055 [P] Add implementation notes and environment setup guidance to `specs/001-webapp-auth/quickstart.md`
- [X] T056 Run monorepo lint, format, type-check, and test scripts through `package.json`, `frontend/package.json`, and `backend/package.json`
- [X] T057 Review naming conventions, clean-code boundaries, and dead-code cleanup across `frontend/src/` and `backend/src/`
- [X] T058 Perform final auth hardening review against `specs/001-webapp-auth/contracts/auth-api.yaml` and `specs/001-webapp-auth/plan.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel if desired
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Reuses shared auth/session infrastructure and should preserve US1 behavior
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Depends on authenticated session flows established in US1/US2

### Within Each User Story

- Tests MUST be written and fail before implementation
- UI components before page wiring where forms or layouts are reused
- Models/repositories before services
- Services before controllers/routes
- Backend integration before frontend redirect and display wiring

### Parallel Opportunities

- `T004`-`T007` can run in parallel after workspace initialization
- `T010`-`T017` can run in parallel within the foundational phase once app shells exist
- In each story phase, contract/integration/e2e/unit tests marked `[P]` can run in parallel
- In each story phase, UI component tasks and backend service tasks marked `[P]` can run in parallel because they touch separate files

---

## Parallel Example: User Story 1

```bash
# Launch User Story 1 tests together:
Task: "Add contract coverage for POST /auth/register in backend/tests/contract/register.contract.test.ts"
Task: "Add backend integration tests for registration success and duplicate-email rejection in backend/tests/integration/register.integration.test.ts"
Task: "Add frontend end-to-end test for landing-to-sign-up journey in frontend/tests/e2e/sign-up-flow.spec.ts"

# Launch User Story 1 implementation slices together:
Task: "Implement landing page sections and plain CSS styling in frontend/src/app/(marketing)/page.tsx and frontend/src/styles/landing-page.css"
Task: "Implement registration service flow in backend/src/services/register-user.service.ts and backend/src/services/create-session.service.ts"
Task: "Implement registration DTOs and response types in frontend/src/types/auth/register.ts and backend/src/types/auth/register-request.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Confirm a visitor can land, sign up, and reach the protected destination

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Validate registration journey
3. Add User Story 2 → Validate credential and Google sign-in
4. Add User Story 3 → Validate protected dashboard identity summary
5. Finish with Polish → Validate full quality and security gates

### Parallel Team Strategy

1. One developer handles frontend shell and shared styling conventions while another handles backend bootstrap during Setup/Foundational
2. Once Foundation is complete:
   - Developer A: User Story 1 frontend registration experience
   - Developer B: User Story 2 backend login and Google SSO
   - Developer C: User Story 3 protected dashboard/profile work
3. Merge back into shared quality and hardening tasks during Phase 6

---

## Notes

- All tasks follow the required checklist format with checkbox, task ID, labels, and file paths
- `[P]` tasks are safe to run in parallel because they touch separate files or independent slices
- Each user story phase is designed to be independently testable
- The suggested MVP scope is User Story 1 only
