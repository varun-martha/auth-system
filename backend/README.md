# PaySplit Backend API

The Node.js Express backend server for PaySplit. It provides a RESTful API and WebSocket event handlers, serving data from MongoDB using Mongoose schemas. 

It handles security middlewares, user session cookies, rate-limiting protection, request validations, transactional currency operations (cents), and real-time events.

---

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express (v5)
- **Database**: MongoDB (Mongoose ORM)
- **Language**: TypeScript
- **WebSockets**: Socket.IO
- **Validation**: Zod
- **Security**: Express Rate Limit, Session-based Cookie Auth (with cookie-parser)
- **Mail**: Nodemailer (SMTP transporter)
- **Testing**: Vitest, Supertest

---

## 💾 Database Models & Schema

All models reside under `src/models/` and are built using Mongoose:

1. **UserAccount (`user-account.model.ts`)**:
   - Stores username, email, hashed password, verification status, avatar seed, reset password tokens, and Google OAuth IDs.
2. **Friendship (`friendship.model.ts`)**:
   - Represents the link between two users. Statuses: `pending`, `accepted`, `rejected`.
3. **Group (`group.model.ts`)**:
   - Groups of users (max 50). Fields: `name`, `description`, `creatorId`, `memberIds`, and `isDirect` (flag indicating a simple two-party direct split).
4. **Expense (`expense.model.ts`)**:
   - Individual recorded expenses. Stored in **cents** (`totalAmount`) to prevent floating-point calculation errors. Supports `splitMethod`: `equal`, `custom`, `percentage`, and `settlement`.
5. **ExpenseSplit (`expense-split.model.ts`)**:
   - Denormalised breakdown of how much each user owes/is owed for a specific expense.

---

## 🚦 REST API Routes

Endpoints are prefixed with `/api/v1`:

### 🔐 Authentication (`/auth`)
- `POST /auth/register` — Create a new account (Zod validated).
- `POST /auth/login` — Sign in and receive a secure HTTP-only session cookie.
- `POST /auth/logout` — Destroys session.
- `GET /auth/me` — Retrieve currently logged-in user profile.
- `POST /auth/google` — Handles Google OAuth token verification and account linkage.
- `POST /auth/forgot-password` — Generates a 1-hour secure token and emails a reset link.
- `POST /auth/reset-password` — Verifies token and updates account password.

### 👥 Friendships (`/friends`)
- `GET /friends` — Lists accepted friends, pending sent, and pending received requests.
- `POST /friends/request` — Sends a friend request.
- `POST /friends/accept` — Accepts a received request.
- `POST /friends/reject` — Rejects a received request.
- `DELETE /friends` — Unfriends a user.
- `GET /friends/search` — Search for potential friends by username or email.

### 👥 Groups (`/groups`)
- `POST /groups` — Create a new group (includes rate limiter).
- `GET /groups` — Lists all groups the authenticated user belongs to.
- `GET /groups/:groupId` — Retrieves group details (members, details) if authorized.
- `POST /groups/:groupId/members` — Add members to a group (max 50 total).
- `POST /groups/:groupId/expenses` — Create a new expense split inside a group.
- `GET /groups/:groupId/expenses` — Retrieve list of expenses.
- `GET /groups/:groupId/balances` — Retrieve optimized calculated balances between group members.

### 💸 Splits (`/splits`)
- `POST /splits/direct` — Facilitates direct splits between two friends (automatically resolves or constructs a direct split group, requires accepted friendship).

### 📊 Dashboard & Activity (`/users`)
- `GET /users/me/dashboard` — Retrieves total balance aggregated via MongoDB queries and a list of recent activity.
- `GET /users/me/activity` — Chronological history feed of all splits, expenses, and settlements involving the user with fallback optional chaining protection.

---

## ⚙️ Configuration & Setup

1. **Configure Environment Variables**:
   Create a `.env` file in the `backend/` directory (or configure at root level if using the monorepo dev scripts):
   ```bash
   cp .env.example .env
   ```

2. **Required Variables**:
   - `PORT`: Port the server runs on (defaults to `4000`).
   - `APP_ORIGIN`: Allowed CORS origin (usually client port, e.g. `http://localhost:3000`).
   - `MONGODB_URI`: MongoDB connection string.
   - `SESSION_SECRET`: Long random secret to sign session cookies.
   - `SESSION_COOKIE_NAME`: Session cookie key name.
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: Credentials for verifying Google tokens.
   - `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS`: Transporter settings for sending password reset emails.

---

## 🏃 Local Scripts

Run all commands from the `backend/` directory (or prepend `--workspace backend` if running from the root):

- **Start Development Server**:
  ```bash
  npm run dev
  ```
- **Build Server (TS compilation)**:
  ```bash
  npm run build
  ```
- **Start Compiled Server**:
  ```bash
  npm run start
  ```
- **Run Tests (Vitest)**:
  ```bash
  npm run test
  ```
- **Lint Code**:
  ```bash
  npm run lint
  ```
- **Format Code**:
  ```bash
  npm run format
  ```
