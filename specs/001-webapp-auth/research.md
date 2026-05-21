# Research: Webapp Authentication

## Decision: Monorepo with top-level `frontend/` and `backend/`

**Rationale**: The feature clearly splits into marketing/authentication UI and
server-side identity/session handling. A monorepo keeps a single change stream,
shared conventions, and one planning workflow while avoiding mixed concerns
inside one runtime package.

**Alternatives considered**:
- Single project layout: rejected because frontend and backend concerns would be
  harder to isolate.
- Multi-repository split: rejected because it increases setup and coordination
  overhead for a tightly coupled first release.

## Decision: Next.js frontend with App Router and plain CSS

**Rationale**: Next.js provides a practical structure for a landing page,
authentication routes, protected pages, and redirect-aware navigation. Plain
CSS satisfies the explicit user requirement and keeps styling predictable.
Component-scoped CSS modules can be used where helpful without introducing a UI
framework or CSS-in-JS runtime.

**Alternatives considered**:
- SPA-only frontend: rejected because server-rendered marketing and auth entry
  points benefit from a structured webapp framework.
- Utility CSS or component library: rejected because the requirement explicitly
  prefers plain CSS only.

## Decision: Express backend in TypeScript with layered modules

**Rationale**: Express provides a small, understandable HTTP layer for auth
flows. TypeScript enforces explicit contracts across controllers, services,
repositories, and validators. A layered structure keeps request handling,
business logic, persistence, and validation responsibilities separated.

**Alternatives considered**:
- All auth handled inside the frontend runtime: rejected because the
  constitution requires server-side trust decisions.
- Heavier backend framework: rejected because the feature scope does not need
  more abstraction at this stage.

## Decision: MongoDB with schema-backed models

**Rationale**: MongoDB fits the early-stage user, identity-link, session, and
audit-event data shapes. Schema-backed modeling provides validation, indexing,
and consistent naming rules for persisted entities while remaining flexible.

**Alternatives considered**:
- SQL database: rejected for this plan because the requested persistence choice
  is MongoDB.
- Raw document storage without schema modeling: rejected because auth data needs
  consistent validation and explicit constraints.

## Decision: HTTP-only secure cookie sessions backed by server-side session records

**Rationale**: Cookie-based sessions simplify protected page access for a webapp
and reduce token handling risk in the browser. Server-side session records allow
revocation, expiry checks, and audit correlation. This aligns with the
constitution's requirement that trust decisions remain server-side.

**Alternatives considered**:
- Local-storage bearer tokens: rejected because they increase client-side
  exposure.
- Stateless JWT-only sessions: rejected because revocation and active-session
  control become less straightforward for a first release.

## Decision: Google SSO completed by backend token verification and account linking

**Rationale**: The frontend only initiates the Google sign-in flow and forwards
the provider result to the backend. The backend verifies issuer, audience,
expiry, and subject before creating or linking the account. This preserves a
single trust boundary for all auth paths.

**Alternatives considered**:
- Frontend-trusted Google identity: rejected because it violates the
  constitution's server-side verification requirement.
- Separate account trees per auth method: rejected because users need a
  consistent post-login identity summary.

## Decision: Style guides, naming conventions, and clean-code rules are first-class requirements

**Rationale**: The user explicitly asked for standard formats, clear naming, and
clean code. The plan therefore treats linting, formatting, naming, module
boundaries, and single-responsibility design as required engineering controls,
not optional polish.

**Alternatives considered**:
- Deferred code quality setup: rejected because it leads to immediate drift in a
  monorepo with two applications.
- Framework-default conventions only: rejected because shared expectations must
  be explicit across frontend and backend.

## Decision: Testing must cover success, failure, and abuse paths

**Rationale**: Authentication features are high risk and the constitution
requires failure-path and abuse-path coverage. The minimum bar includes frontend
journey verification, backend endpoint and service tests, and contract checks
for protected access and invalid authentication attempts.

**Alternatives considered**:
- Happy-path-only tests: rejected because they do not protect auth boundaries.
- UI-only testing: rejected because token verification, session handling, and
  abuse controls live on the backend.
