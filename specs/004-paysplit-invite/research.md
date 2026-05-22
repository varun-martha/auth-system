# Research: Invite and User Profile

## Decision 1: Email Integration
- **Decision**: Use Resend Node SDK.
- **Rationale**: Modern, easy to integrate, great API, supports React Email for future expansion, user selected it during clarification.
- **Alternatives considered**: SendGrid, AWS SES, Nodemailer with SMTP.

## Decision 2: Default Avatar
- **Decision**: Use the DiceBear HTTP API (e.g., `https://api.dicebear.com/7.x/avataaars/svg?seed=[email]`).
- **Rationale**: Deterministic generation based on email, no backend storage needed, fast, highly customizable. User selected it during clarification.
- **Alternatives considered**: Backend generation of SVG, predefined assets.

## Decision 3: Abuse Defense for Invites
- **Decision**: Implement a basic rate limiter on the backend `/api/invites` endpoint using an express rate limiting middleware.
- **Rationale**: Constitution requires rate limiting for sign-in/invite endpoints to prevent spam.
- **Alternatives considered**: CAPTCHA (disruptive UX, out of scope).
