# Research & Decisions

## Session Strategy

**Decision**: Use JWT stored in HTTP-only, secure, SameSite=Strict cookies.

**Rationale**:
- Fits well with a Next.js (frontend) and Express.js (backend) architecture.
- Cookies automatically sent with API requests, avoiding the need for the frontend to manually manage tokens in local storage (which is vulnerable to XSS).
- Complies with Constitution Rule III (server-side boundaries) and V (abuse defense).

**Details (Issuance, Expiry, Revocation, Storage)**:
- **Issuance**: Upon successful password verification or Google SSO token validation, the backend generates a JWT containing the User ID.
- **Expiry**: The JWT will have a short expiry (e.g., 1 hour).
- **Revocation**: To support logout, the backend will clear the cookie. For forced revocation, we can track a `tokenVersion` or `lastLogoutAt` field in the user document and include it in the JWT; if the JWT was issued before `lastLogoutAt`, it is rejected.
- **Storage**: Stored on the client in HTTP-only, Secure cookies. Not stored on the server (stateless).

## Google SSO Integration

**Decision**: Use the official `google-auth-library` to verify tokens server-side.

**Rationale**:
- Complies with Constitution Rule III: "Google identity token verification... MUST occur server-side... provider tokens MUST be validated for issuer, audience, expiry, and subject before trust is granted."

**Alternatives considered**:
- OAuth2 full flow: Rejected in favor of the simpler OpenID Connect (OIDC) token verification using the Google Sign-In button on the frontend, which yields an ID token sent to the backend.

## PaySplit Aesthetic

**Decision**: Implement a clean, modern fintech UI utilizing a specific color palette (e.g., `#5bc5a7` similar to Splitwise green), simple rounded buttons, clear typography, and a prominent value proposition on the landing page.

**Rationale**:
- Directly addresses the user request to make the login, register, and landing page suit a "PaySplit" application similar to Splitwise.
