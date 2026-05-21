# Quickstart: Webapp Authentication

## Overview

This feature is planned as a monorepo with separate frontend and backend
applications:

- `frontend/`: Next.js application for the landing page, auth screens, and
  protected dashboard
- `backend/`: Express + TypeScript API for auth flows, session management,
  Google verification, and protected user data
- `shared/`: documentation-only conventions shared by both apps during this
  phase

## Expected Repository Shape

```text
frontend/
backend/
shared/
specs/001-webapp-auth/
```

## Implementation Flow

1. Create the monorepo folder structure and workspace configuration.
2. Initialize the frontend app with plain CSS styling conventions only.
3. Initialize the backend app with Express, TypeScript, validation, and MongoDB
   connectivity.
4. Add environment-variable handling for:
   - database connection
   - session secret
   - Google auth client configuration
   - frontend/backend base URLs
   - root `.env` loading for backend runtime and `.env.example` files for both apps
5. Implement credential registration and login endpoints.
6. Implement Google sign-in completion endpoint with backend token validation.
7. Implement protected session lookup and profile retrieval endpoints.
8. Build landing, sign-up, sign-in, and dashboard pages.
9. Add quality gates:
   - formatting
   - linting
   - type-checking
   - unit/integration/e2e tests

## Naming and Clean-Code Rules

- Use descriptive domain-based names such as `authService`, `userRepository`,
  `googleIdentityLink`, and `dashboardProfileCard`.
- Use `PascalCase` for React components, `camelCase` for variables/functions,
  and `kebab-case` for route segments and CSS filenames.
- Keep controllers thin, services focused, repositories persistence-only, and
  validation schemas separate from route handlers.
- Prefer one primary responsibility per module.
- Avoid ambiguous names such as `data`, `item`, `stuff`, or `handleEverything`.
- Keep frontend styling in plain CSS files or CSS modules only.

## Validation Targets

- A new user can register and is redirected into the protected area.
- An existing user can log in with credentials and view username/email.
- A user can complete Google sign-in and land in the same protected area.
- Unauthenticated requests to protected routes are rejected.
- Failed login attempts are rate-limited and audit logged.

## Environment Setup

1. Copy the root `.env.example` to `.env`.
2. Adjust values for MongoDB, session secrets, and Google credentials.
3. Keep `frontend/.env.example` and `backend/.env.example` as app-specific
   references, but use the root `.env` as the primary backend-loaded source.
