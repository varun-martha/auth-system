# Implementation Plan: Webapp Authentication

**Branch**: `001-webapp-auth` | **Date**: 2026-05-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-webapp-auth/spec.md`

## Summary

Build a monorepo web application with separate `frontend/` and `backend/`
projects that deliver a modern landing page, credential-based sign-up and
sign-in, Google SSO, protected post-authentication routing, and an authenticated
dashboard that displays username and email. The design uses a Next.js frontend,
an Express API written in TypeScript, MongoDB-backed account storage, secure
server-side session handling, and explicit code-style, naming, and clean-code
rules for both applications.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js LTS

**Primary Dependencies**: Next.js, React, Express, MongoDB, Mongoose, Google
Identity Services / OAuth integration library, schema validation library,
linting and formatting toolchain

**Storage**: MongoDB for user, identity-link, and session-related persistence

**Testing**: Frontend component and end-to-end coverage, backend unit and
integration coverage, API contract validation

**Target Platform**: Modern desktop and mobile browsers, Node.js-based web
server environment

**Project Type**: Monorepo web application with separate frontend and backend
services

**Performance Goals**: Auth page loads complete in under 2 seconds on standard
broadband, authenticated redirects complete in under 1 second after successful
login, and common auth API requests complete within p95 300 ms under expected
load

**Constraints**: Plain CSS only in the frontend, server-side trust decisions
for all auth flows, HTTP-only secure session transport, structured audit
logging without secret leakage, consistent style-guide enforcement, and clear
naming conventions across the monorepo

**Scale/Scope**: Initial release for a single webapp with public landing page,
credential auth, Google SSO, protected dashboard, and foundational support for
thousands of registered users

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Approved identity scope is unchanged or explicitly expanded by the spec.
  Status: PASS. The plan only covers username/password and Google SSO.
- Password, Google SSO, session, and secret handling decisions are documented.
  Status: PASS. Research and contracts define server-side validation,
  HTTP-only secure sessions, and environment-managed secrets.
- Server-side trust boundaries are identified for every auth decision point.
  Status: PASS. Credential validation, Google token verification, protected
  route access, and session lookup are all backend responsibilities.
- Required success, failure, and abuse-path tests are defined.
  Status: PASS. Testing strategy includes credential rejection, SSO failure,
  unauthorized access, and repeated failed attempts.
- Audit logging, rate limiting, and other abuse defenses are accounted for.
  Status: PASS. Backend middleware and auth services include structured auth
  event logging and request-throttling on sensitive endpoints.
- The selected webapp architecture, storage choice, and operational controls
  are explicit enough to implement without hidden assumptions.
  Status: PASS. Monorepo structure, persistence model, contracts, and startup
  steps are fully defined.
- Any deviation from the constitution is recorded in Complexity Tracking with a
  concrete justification.
  Status: PASS. No deviations are required.

## Project Structure

### Documentation (this feature)

```text
specs/001-webapp-auth/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── auth-api.yaml
└── tasks.md
```

### Source Code (repository root)

```text
frontend/
├── public/
├── src/
│   ├── app/
│   │   ├── (marketing)/
│   │   ├── (auth)/
│   │   └── dashboard/
│   ├── components/
│   │   ├── auth/
│   │   ├── layout/
│   │   └── marketing/
│   ├── lib/
│   ├── services/
│   ├── styles/
│   └── types/
├── tests/
│   ├── e2e/
│   └── unit/
└── package.json

backend/
├── src/
│   ├── app/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── types/
│   ├── utils/
│   └── validators/
├── tests/
│   ├── integration/
│   └── unit/
└── package.json

shared/
└── conventions/
    └── naming-and-style.md
```

**Structure Decision**: Use a monorepo with top-level `frontend/` and
`backend/` applications to keep UI and API concerns isolated while preserving a
single repository workflow. `shared/` holds human-readable conventions rather
than runtime code for this phase so both apps can apply the same naming,
clean-code, and style-guide rules without premature abstraction.

## Phase 0: Research Summary

See [research.md](./research.md) for detailed decisions covering monorepo
organization, session strategy, Google SSO flow, validation, naming
conventions, and testing standards.

## Phase 1: Design Summary

- [data-model.md](./data-model.md) defines `UserAccount`, `IdentityLink`,
  `UserSession`, and `AuthAuditEvent`.
- [contracts/auth-api.yaml](./contracts/auth-api.yaml) defines registration,
  credential login, Google SSO completion, current-user fetch, logout, and
  protected profile retrieval endpoints.
- [quickstart.md](./quickstart.md) describes the local monorepo workflow and
  expected structure for implementation.

## Post-Design Constitution Check

- Identity scope remains limited to credentials plus Google SSO. PASS.
- All trust decisions remain backend-enforced. PASS.
- Session design is documented as HTTP-only secure cookie-based sessions with
  revocation support. PASS.
- Failure-path, abuse-path, and audit requirements are captured in the data
  model and API contract. PASS.
- The design remains intentionally simple: one frontend app, one backend app,
  one database, no speculative provider expansion. PASS.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | Not applicable | Not applicable |
