# PaySplit Frontend Client

This is the Next.js frontend client for PaySplit. It provides a highly responsive, modern, dark-themed user interface following a glassmorphism design system. 

It handles routing, page layouts, visual indicators, user authentication states, real-time WebSocket connections, and user management flows.

---

## 🛠 Tech Stack

- **Framework**: Next.js (App Router, Client-Side Rendering with `"use client"`)
- **Styling**: Vanilla CSS (CSS Variables, keyframe animations, glass panels, responsive grids)
- **WebSockets**: Socket.IO Client (for real-time expense and group refetches)
- **State & Data**: Native React hooks (`useState`, `useEffect`, `useMemo`) + custom fetcher utility
- **Testing**: 
  - Vitest & Testing Library (Unit tests)
  - Playwright (End-to-End browser testing)

---

## 🎨 Design Guidelines & Aesthetics

- **Theme**: Premium Dark Mode with subtle transparent glass layers.
- **Backdrop Filters**: Heavy blurs (`backdrop-filter: blur(16px)`) with thin semi-transparent borders for high-end glassmorphism.
- **Animations**: Soft fade-ups, spin loaders, hover-lifts (`transform: translateY(-2px)`), and radial glow expansions.
- **Typography**: 
  - `Outfit` (Heading styles, numbers, totals)
  - `Space Grotesk` (Interactive elements, cards, and titles)
- **Color Indicators**:
  - Green (`#10b981`) represents positive balances (you are owed / received money).
  - Soft Red (`#ff6b6b`) represents negative balances (you owe / paid money).
  - Muted Grey (`#888` / `var(--text-muted)`) indicates settled balances.

---

## 🖥 Pages & Features

1. **Landing Page (`/`)**: A sleek dashboard teaser and feature overview highlighting OAuth and split mechanics.
2. **Login & Register (`/login`, `/register`)**: Modern, animated authentication forms supporting email logins and Google OAuth.
3. **Dashboard (`/dashboard`)**: Displays overall net balance (green or soft red), quick summaries, and the most recent global activity.
4. **Friends (`/friends`)**: Manage friendships (send requests, accept/reject, delete friends) and split expenses directly.
5. **Groups (`/groups`)**: Create groups, add descriptions, and list existing split groups.
6. **Group Detail (`/groups/[groupId]`)**: Lists all members, current individual balances, shared expenses list, and options to Add Expense, Add Members, or Settle Up.
7. **Activity Feed (`/activity`)**: A complete chronological ledger of your actions, showing when expenses were added, who paid, and settlements with correct color codes.
8. **Profile (`/profile`)**: Manage your email, set dynamic avatars via Dicebear seed values, and logout securely.

---

## ⚙️ Configuration & Setup

1. **Configure Environment Variables**:
   Create a `.env.local` or `.env` file in this directory (or configure at root level if using the monorepo dev scripts):
   ```bash
   cp .env.example .env.local
   ```

2. **Environment Variables**:
   - `NEXT_PUBLIC_API_BASE_URL`: The URL pointing to the backend v1 API (e.g., `http://localhost:4000/api/v1`).
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: The client ID created in your Google Cloud Console for OAuth.

---

## 🏃 Local Scripts

Run all commands from the `frontend/` directory (or prepend `--workspace frontend` if running from the root):

- **Start Development Server**:
  ```bash
  npm run dev
  ```
- **Build Production Bundle**:
  ```bash
  npm run build
  ```
- **Run Production Bundle locally**:
  ```bash
  npm run start
  ```
- **Run Unit Tests (Vitest)**:
  ```bash
  npm run test
  ```
- **Run End-to-End Tests (Playwright)**:
  ```bash
  npm run test:e2e
  ```
- **Lint Code**:
  ```bash
  npm run lint
  ```
- **Format Code**:
  ```bash
  npm run format
  ```
