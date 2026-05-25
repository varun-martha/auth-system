# Implementation Plan: Adding Friends

**Branch**: `006-add-friends` | **Date**: 2026-05-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/005-add-friends/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

The "Add Friends" feature allows users to search for other users by username or email and send them friend requests. Friend requests require explicit approval from the recipient. Users can also view and remove friends via a "Your Friends" sidebar section.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript

**Primary Dependencies**: Express (Backend), Mongoose (Backend), Next.js/React (Frontend)

**Storage**: MongoDB (Mongoose)

**Testing**: Vitest (Backend/Frontend), Playwright (E2E)

**Target Platform**: Web application

**Project Type**: Web application

**Performance Goals**: Search results returned < 2 seconds

**Constraints**: Standard web constraints, rate limiting required for search endpoints

**Scale/Scope**: Expanding existing authentication system to support friends and friend requests

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Approved identity scope is unchanged or explicitly expanded by the spec. (Unchanged, leverages existing auth)
- Password, Google SSO, session, and secret handling decisions are documented. (Reusing existing JWTs)
- Server-side trust boundaries are identified for every auth decision point. (Search and friend endpoints will enforce session verification)
- Required success, failure, and abuse-path tests are defined. (Rate limiting tests for search)
- Audit logging, rate limiting, and other abuse defenses are accounted for. (Rate limiting will be applied to search/friend requests)
- The selected webapp architecture, storage choice, and operational controls
  are explicit enough to implement without hidden assumptions.
- Any deviation from the constitution is recorded in Complexity Tracking with a
  concrete justification.

## Project Structure

### Documentation (this feature)

```text
specs/005-add-friends/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
backend/
├── src/
│   ├── models/ (Friendship)
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── app/ (Friends Page)
│   ├── components/ (Friends Sidebar, Search Results)
│   ├── styles/
│   └── services/
└── tests/
```

**Structure Decision**: Web application layout (backend API + Next.js frontend).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
