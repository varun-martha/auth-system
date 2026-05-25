# API Contracts

## `POST /api/invites`
Send an invite to a new user.
- **Auth**: Required (Session/Token)
- **Request Body**:
  ```json
  {
    "email": "friend@example.com"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "message": "Invitation sent successfully",
    "invitation": {
      "inviterId": "123",
      "inviteeEmail": "friend@example.com",
      "status": "Sent",
      "createdAt": "2026-05-22T00:00:00Z"
    }
  }
  ```

## `GET /api/invites`
Get a list of people the current user has invited.
- **Auth**: Required
- **Response (200 OK)**:
  ```json
  {
    "invitations": [
      {
        "inviteeEmail": "friend@example.com",
        "status": "Sent",
        "createdAt": "2026-05-22T00:00:00Z"
      }
    ]
  }
  ```

## `GET /api/users/profile`
Get the current user's profile details including avatar.
- **Auth**: Required
- **Response (200 OK)**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "avatarUrl": "https://api.dicebear.com/7.x/avataaars/svg?seed=john@example.com"
  }
  ```
