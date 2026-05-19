<!--
Sync Impact Report
- Version change: 1.1.0 -> 2.0.0
- Modified principles:
  - V. Auditability, Abuse Defense, Simplicity, and Code Quality -> V. Auditability, Abuse Defense, and Simplicity
- Added sections:
  - None
- Removed sections:
  - Technology Standards
- Templates requiring updates:
  - ✅ updated .specify/templates/plan-template.md
  - ✅ updated .specify/templates/spec-template.md
  - ✅ updated .specify/templates/tasks-template.md
  - ⚠ pending .specify/templates/commands/*.md (directory not present in this repo)
- Follow-up TODOs:
  - None
-->
# Authentication System Constitution

## Core Principles

### I. Security-First Authentication
Every change that touches authentication MUST preserve confidentiality,
integrity, and least privilege before convenience or delivery speed. Passwords
MUST never be stored or logged in plaintext. Authentication secrets, session
artifacts, and provider credentials MUST be handled through approved secret
storage and server-side controls. Rationale: the product's first trust boundary
is login, so weak defaults here create system-wide compromise risk.

### II. Approved Identity Flows Only
The system MUST support only explicitly approved sign-in methods for the current
scope: username plus password and Google SSO. New identity providers, password
recovery flows, account linking behavior, and MFA requirements MUST be added
through a spec and constitution-aligned plan before implementation. Rationale:
authentication scope creep creates inconsistent user state, incomplete edge-case
handling, and avoidable security exposure.

### III. Verified Credentials and Tokens
All credential validation, password verification, Google identity token
verification, session issuance, and authorization boundary decisions MUST occur
server-side. Password handling MUST use a modern one-way password hashing
algorithm and provider tokens MUST be validated for issuer, audience, expiry,
and subject before trust is granted. Rationale: trust decisions based on
client-side assertions or partially validated tokens are not acceptable.

### IV. Testable Authentication Journeys
Authentication work MUST define and execute tests for success paths, failure
paths, and abuse-relevant edge cases before release. At minimum, changes to
username/password login or Google SSO MUST cover credential rejection,
provider-token rejection, session creation, logout or session invalidation
behavior, and user-visible error handling. Rationale: auth defects are rarely
isolated; they commonly break access, create lockout loops, or open security
gaps across multiple entry points.

### V. Auditability, Abuse Defense, and Simplicity
Authentication behavior MUST emit structured security-relevant events without
recording sensitive secret material. Rate limiting, brute-force resistance, and
clear failure responses MUST be designed into auth endpoints and callbacks.
Solutions MUST favor the smallest implementation that satisfies the approved
flows instead of speculative identity architecture. Rationale: secure systems
need observable behavior and controlled failure modes, while unnecessary auth
complexity increases attack surface.

## Security Requirements

- Password-based authentication MUST enforce server-side input validation and
  hashed password storage.
- Google SSO integrations MUST use verified Google identity claims and MUST map
  identities to local user records through explicit rules.
- Session or token strategy MUST be documented in the feature plan before
  implementation and MUST define issuance, expiry, revocation, and storage
  expectations.
- Authentication errors returned to users MUST avoid leaking whether a username,
  email, or provider identity exists unless the specific flow requires it and
  the risk is documented.
- Security-sensitive configuration values MUST come from environment-specific
  secret management, not hardcoded source files.

## Delivery Workflow

- Every auth-related spec MUST identify supported login methods, trust
  boundaries, user journeys, edge cases, and measurable success criteria.
- Every implementation plan MUST define the chosen webapp architecture,
  authentication boundaries, persistence approach, and operational safeguards
  before coding starts.
- Every implementation plan MUST pass a constitution check covering approved
  identity flows, secret handling, token or session design, required tests, and
  audit or rate-limit controls.
- Tasks for auth work MUST include validation, test coverage, and security
  instrumentation, not only happy-path feature coding.
- Pull requests and reviews MUST block merges when constitution requirements are
  unmet or deferred without an explicit documented justification.

## Governance

This constitution supersedes conflicting local habits for authentication work in
this repository. Amendments require a documented change to this file, a clear
reason for the governance update, and corresponding template updates where the
constitution changes delivery expectations. Versioning follows semantic
versioning: MAJOR for incompatible principle removals or redefinitions, MINOR
for new principles or materially expanded guidance, and PATCH for clarifications
that do not change requirements. Compliance review is mandatory during planning,
spec review, task generation, and pull request review for any change affecting
authentication, session handling, or identity provider integration.

**Version**: 2.0.0 | **Ratified**: 2026-05-19 | **Last Amended**: 2026-05-19
