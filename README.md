# PaySplit — Shared Expense Management & Authentication System

PaySplit is a premium shared expense management monorepo application. It enables users to register accounts, authenticate securely, add friends, form groups, split bills, track balances, record settlements, and view a real-time ledger of all transaction histories. 

The project features a sleek, dark-themed glassmorphism interface with micro-animations and custom typography, driven by real-time updates via WebSockets.

---

## 🌟 Key Features

### 🔐 Secure Authentication & Accounts
- Session-based cookie authentication with customizable TTL.
- Local email/password registration and login.
- OAuth 2.0 integration with Google Login.
- Password reset flow with secure token generation and email delivery via SMTP.
- Profile management with custom avatar seed selection (using Dicebear Avataaars API).

### 👥 Friendships & Group Management
- Friend request system (Send, Accept, Reject, Unfriend).
- Multi-party groups (up to 50 members) with custom names and descriptions.
- Dynamic group member addition.
- Simplified two-party **Direct Splits** directly from the Friends list.

### 💸 Flexible Expense Splitting
- Store all money amounts as **integer cents** to avoid floating-point inaccuracies.
- Support for multiple currencies (defaults to `INR` / `₹`).
- **Four Split Methods**:
  - `equal`: Split evenly among some or all group members.
  - `custom`: Split by exact amounts (validated to match the total paid).
  - `percentage`: Split by percentages (validated to sum to 100%).
  - `settlement`: Record settlements directly between users to zero out balances.

### 📊 Real-Time Balances & Activity
- **Dashboard Overview**: Displays total net balance (green if owed overall, soft coral red if you owe overall) and recent transactions.
- **Activity Feed**: A chronological ledger of every expense, split, and settlement involving the user.
- **Real-Time Synchronisation**: Websockets (Socket.IO) notify relevant clients instantly when expenses are added, edited, or when a group's members change.

---

## 🛠 Tech Stack

### Monorepo Infrastructure
- **Package Manager**: npm Workspaces
- **Language**: TypeScript

### Frontend
- **Framework**: Next.js (App Router, Client Components, Dynamic Routes)
- **Styling**: Vanilla CSS (Custom variables, responsive layouts, glassmorphism design system)
- **Real-time Communication**: Socket.IO Client
- **Testing**: Vitest (Unit) & Playwright (End-to-End)

### Backend
- **Server Framework**: Express (v5)
- **Database**: MongoDB & Mongoose ORM (Aggregations, schemas)
- **Real-time Communication**: Socket.IO Server
- **Security & Validation**: Zod, Express Rate Limit, Session Cookies
- **Utility**: Nodemailer (SMTP Email Transporter)
- **Testing**: Vitest & Supertest

---

## 📂 Project Structure

```text
├── backend/                   # Node.js/Express API server & MongoDB Models
├── frontend/                  # Next.js web application & CSS styles
├── shared/                    # Shared assets or utilities (optional/future)
├── specs/                     # Specification and architectural documents
├── package.json               # Root monorepo configuration
└── README.md                  # Root documentation (this file)
```

---

## 🚀 Getting Started

### 📋 Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher recommended)
- **MongoDB** running locally or via a cloud instance (e.g., MongoDB Atlas)
- **SMTP credentials** (e.g., Gmail App Password) for password reset emails
- **Google OAuth credentials** (Client ID and Secret) for Google Sign-In

### ⚙️ Installation & Configuration

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd authentication-system
   ```

2. **Install all dependencies** (at the root level):
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file at the root level by copying the example:
   ```bash
   cp .env.example .env
   ```
   *Note: You must also configure the specific environment variables inside the `frontend/` and `backend/` directories. Refer to their respective README files for details.*

---

## 🏃 Running the Application

The monorepo uses npm workspaces, allowing you to control both servers from the root directory.

### Development Mode
Runs both the backend API server (with hot-reloading) and the frontend Next.js dev server:
```bash
npm run dev
```
- **Frontend URL**: `http://localhost:3000`
- **Backend API URL**: `http://localhost:4000`

Alternatively, you can run them individually:
- Frontend only: `npm run dev:frontend`
- Backend only: `npm run dev:backend`

### Production Build
Compiles TypeScript backend files and generates the Next.js optimized frontend bundle:
```bash
npm run build
```

### Type Checking & Linting
Run TypeScript compiler check across both workspaces:
```bash
npm run type-check
```

Run ESLint check:
```bash
npm run lint
```

Format code using Prettier:
```bash
npm run format
```

### Running Tests
Execute unit tests for both workspaces:
```bash
npm run test
```
