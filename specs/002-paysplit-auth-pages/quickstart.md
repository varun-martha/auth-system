# Quickstart

## Getting Started

To test and run the PaySplit authentication pages:

### 1. Prerequisites
- Node.js installed
- MongoDB instance running (local or Atlas)
- Google OAuth 2.0 Client ID for Google SSO

### 2. Environment Setup

Create `.env` in `backend/`:
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/paysplit
JWT_SECRET=your_super_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
```

Create `.env.local` in `frontend/`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

### 3. Running the Backend
```bash
cd backend
npm install
npm run dev
```

### 4. Running the Frontend
```bash
cd frontend
npm install
npm run dev
```

### 5. Verify Setup
- Navigate to `http://localhost:3000` to see the PaySplit landing page.
- Click "Register" to create a new user.
- Click "Login" to access an existing account.
