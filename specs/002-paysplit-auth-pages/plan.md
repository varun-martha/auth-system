# Implementation Plan: PaySplit Authentication Pages

**Branch**: `002-paysplit-auth-pages` | **Date**: 2026-05-21 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-paysplit-auth-pages/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implement the PaySplit landing page, registration form, and login form with a premium, liquid dark glassmorphism aesthetic. Authentication will support both standard email/password and Google SSO.

## Technical Context

**Language/Version**: TypeScript (Frontend and Backend)

**Primary Dependencies**: Next.js, React (Frontend); Express, Mongoose, google-auth-library (Backend)

**Storage**: MongoDB (Mongoose)

**Testing**: Vitest (Unit/Integration), Playwright (E2E frontend), Supertest (Backend API)

**Target Platform**: Web application (Desktop and Mobile browsers)

**Project Type**: Web application (Frontend + Backend)

**Performance Goals**: Standard web performance; < 1 second load for landing page; fast auth redirects.

**Constraints**: Premium "liquid dark" glassmorphism aesthetic (#050505 base, blur filters, green/white split branding, Outfit/Inter fonts); must conform to Authentication System Constitution (secure password hashing, server-side validation, rate limiting).

**Scale/Scope**: Auth flows (Login, Register), Dashboard, and SEO-optimized Landing page. Session strategy resolved to JWT in HTTP-only cookies (see research.md).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Approved identity scope is unchanged or explicitly expanded by the spec (Email/password and Google SSO are approved in spec).
- [x] Password, Google SSO, session, and secret handling decisions are documented (Will be detailed in research.md).
- [x] Server-side trust boundaries are identified for every auth decision point.
- [x] Required success, failure, and abuse-path tests are defined.
- [x] Audit logging, rate limiting, and other abuse defenses are accounted for.
- [x] The selected webapp architecture, storage choice, and operational controls are explicit enough to implement without hidden assumptions.
- [x] Any deviation from the constitution is recorded in Complexity Tracking with a concrete justification (None currently).

## Project Structure

### Documentation (this feature)

```text
specs/002-paysplit-auth-pages/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── app/
│   ├── components/
│   ├── styles/
│   └── services/
└── tests/
```

**Structure Decision**: Selected the existing Web Application structure separating `frontend/` (Next.js) and `backend/` (Express.js).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None      | N/A        | N/A                                 |
