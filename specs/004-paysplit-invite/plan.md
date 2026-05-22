# Implementation Plan: Invite and User Profile

**Branch**: `004-paysplit-invite` | **Date**: 2026-05-22 | **Spec**: [spec.md](file:///Users/adminadmin/Documents/gorilla/authentication-system/specs/004-paysplit-invite/spec.md)

**Input**: Feature specification from `/specs/004-paysplit-invite/spec.md`

## Summary

Add the ability for users to invite friends to PaySplit via email using Resend, generate a default avatar via the DiceBear API, and access a mobile-responsive dashboard sidebar that includes a "My Profile" view and a list of invited people.

## Technical Context

**Language/Version**: TypeScript

**Primary Dependencies**: Next.js (frontend), React (frontend), Express (backend), Mongoose (backend), Resend (Node SDK)

**Storage**: MongoDB (via Mongoose)

**Testing**: Vitest, Supertest, Playwright

**Target Platform**: Web application (Desktop & Mobile browsers)

**Project Type**: Web application

**Performance Goals**: Fast invite API response (< 500ms), fast rendering of the generated avatar.

**Constraints**: Sidebar must be mobile responsive. Resend email sending rate limits apply.

**Scale/Scope**: Current scope is individual user invites (1-to-1).

## Constitution Check

*GATE: Passed*

- Approved identity scope is unchanged or explicitly expanded by the spec (adding invitation tracking).
- Password, Google SSO, session, and secret handling decisions are documented.
- Server-side trust boundaries are identified for every auth decision point (Invite endpoint must check for valid auth session).
- Required success, failure, and abuse-path tests are defined (Rate limiting on invite endpoints is a requirement).
- Audit logging, rate limiting, and other abuse defenses are accounted for.
- The selected webapp architecture, storage choice, and operational controls are explicit enough to implement without hidden assumptions.
- No violations of the constitution.

## Project Structure

### Documentation (this feature)

```text
specs/004-paysplit-invite/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── contracts/           # Phase 1 output
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/        # Invitation model
│   ├── services/      # Resend integration
│   └── api/           # Invite routes, Profile routes
└── tests/

frontend/
├── src/
│   ├── app/           # Dashboard layout, My Profile page
│   ├── components/    # Sidebar (mobile-responsive), Avatar component
│   └── services/      # API client for Invites and Profile
└── tests/
```

**Structure Decision**: Option 2 (Web application) is selected since the repository has explicit frontend (Next.js) and backend (Express) folders.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations.
