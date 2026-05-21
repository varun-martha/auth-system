# Data Model: Webapp Authentication

## UserAccount

**Purpose**: Represents a registered webapp user who can authenticate and view
protected account information.

**Fields**:
- `id`: unique system identifier
- `username`: displayable account name, unique within the application
- `email`: normalized unique email address
- `passwordHash`: stored only for credential-enabled accounts
- `status`: `pending`, `active`, `suspended`, or `disabled`
- `createdAt`: account creation timestamp
- `updatedAt`: last account update timestamp
- `lastAuthenticatedAt`: most recent successful authentication timestamp

**Validation Rules**:
- `username` is required for all accounts and must be unique after normalization.
- `email` is required, normalized to lowercase, and must be unique.
- `passwordHash` is required for credential-based accounts and never returned in
  response payloads.
- `status` defaults to `active` for this feature unless future flows add a
  review or verification step.

**Relationships**:
- One `UserAccount` can have many `IdentityLink` records.
- One `UserAccount` can have many `UserSession` records.
- One `UserAccount` can have many `AuthAuditEvent` records.

## IdentityLink

**Purpose**: Associates a `UserAccount` with an allowed authentication method.

**Fields**:
- `id`: unique system identifier
- `userId`: owning `UserAccount` identifier
- `provider`: `credentials` or `google`
- `providerSubject`: provider-specific subject or unique identifier
- `providerEmail`: provider email used during linking when available
- `linkedAt`: timestamp of first successful link
- `lastUsedAt`: timestamp of most recent successful auth via this provider

**Validation Rules**:
- `provider` must be one of the approved identity methods.
- `providerSubject` is required for non-credential providers.
- A single external provider subject can map to only one local account.

**Relationships**:
- Many `IdentityLink` records belong to one `UserAccount`.

## UserSession

**Purpose**: Represents an authenticated browser session used for protected
navigation and identity retrieval.

**Fields**:
- `id`: unique session identifier
- `userId`: owning `UserAccount` identifier
- `sessionTokenHash`: hashed representation of the browser session token
- `issuedAt`: timestamp when the session was created
- `expiresAt`: session expiry timestamp
- `revokedAt`: timestamp when the session was invalidated, if applicable
- `ipAddress`: source IP captured for audit and abuse detection
- `userAgent`: browser identifier captured for audit and support

**Validation Rules**:
- `sessionTokenHash` is required and never exposed through the API.
- Expired or revoked sessions cannot authorize protected requests.
- Session lifetime must be finite and documented in configuration.

**Relationships**:
- Many `UserSession` records belong to one `UserAccount`.

## AuthAuditEvent

**Purpose**: Stores security-relevant authentication events without exposing
secrets.

**Fields**:
- `id`: unique event identifier
- `userId`: optional related `UserAccount` identifier
- `eventType`: `sign_up_success`, `sign_in_success`, `sign_in_failure`,
  `google_sign_in_success`, `google_sign_in_failure`, `session_revoked`,
  `unauthorized_access_attempt`
- `provider`: `credentials`, `google`, or `system`
- `occurredAt`: event timestamp
- `ipAddress`: request source IP
- `userAgent`: request user agent
- `metadata`: sanitized context such as failure reason category

**Validation Rules**:
- Event payloads must not contain plaintext passwords, session tokens, or raw
  third-party tokens.
- Failure metadata must remain user-safe and audit-useful.

**Relationships**:
- Many `AuthAuditEvent` records may belong to one `UserAccount`.

## State Transitions

### UserAccount

- `pending` -> `active`: future-compatible path if verification is introduced.
- `active` -> `suspended`: administrative or security action outside current UI
  scope.
- `active` -> `disabled`: account deactivation outside current UI scope.

### UserSession

- `issued` -> `active`: session is created after successful auth.
- `active` -> `expired`: session lifetime ends.
- `active` -> `revoked`: logout or security invalidation occurs.

### IdentityLink

- `unlinked` -> `linked`: first successful credential registration or Google
  account association.
- `linked` -> `reused`: subsequent successful authentication via the same
  provider updates `lastUsedAt`.
