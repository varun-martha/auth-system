# Quickstart: Testing the Invite Feature

1. **Environment Setup**:
   - Get a Resend API key and add it to `backend/.env` as `RESEND_API_KEY`.
2. **Running the App**:
   - Start the backend: `cd backend && npm run dev`
   - Start the frontend: `cd frontend && npm run dev`
3. **Testing Flow**:
   - Log in to the application.
   - Navigate to the dashboard.
   - Click the sidebar to ensure it collapses/expands and is responsive on small screens.
   - Go to "My Profile" to view your DiceBear avatar.
   - Enter an email in the "Invite" section and click "Send".
   - Check the Resend dashboard or the recipient email to verify delivery.
   - View the "Invited People" list to see the sent invite.
