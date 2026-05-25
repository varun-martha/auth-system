# API Contracts: Adding Friends

All endpoints require a valid session/authentication token.

## Search Users
`GET /api/users/search`
Searches for users by username or email.

**Query Parameters:**
- `q` (string, required): The search query (username or email).
- `limit` (number, optional, default=20): Max results to return.

**Response (200 OK):**
```json
{
  "users": [
    {
      "id": "60d5ecb8b392d700153...",
      "username": "johndoe",
      "email": "john@example.com",
      "avatar": "https://..."
    }
  ]
}
```

## Get Friends
`GET /api/friends`
Returns the current user's friends (accepted) and pending requests.

**Response (200 OK):**
```json
{
  "friends": [
    {
      "id": "60d5ecb8b392d700153...",
      "username": "janedoe",
      "email": "jane@example.com",
      "avatar": "https://...",
      "friendshipId": "..."
    }
  ],
  "pendingRequests": [
    {
      "id": "60d5ecb8b392d700153...",
      "username": "bobsmith",
      "email": "bob@example.com",
      "avatar": "https://...",
      "friendshipId": "...",
      "direction": "incoming" // 'incoming' or 'outgoing'
    }
  ]
}
```

## Send Friend Request
`POST /api/friends/request`
Sends a friend request to another user.

**Request Body:**
```json
{
  "userId": "60d5ecb8b392d700153..." // ID of the user to friend
}
```

**Response (200 OK):**
```json
{
  "message": "Friend request sent",
  "friendshipId": "..."
}
```

## Accept Friend Request
`POST /api/friends/accept`
Accepts a pending incoming friend request.

**Request Body:**
```json
{
  "friendshipId": "..."
}
```

**Response (200 OK):**
```json
{
  "message": "Friend request accepted"
}
```

## Remove Friend / Reject Request
`DELETE /api/friends/:friendshipId`
Removes an existing friend or rejects a pending request.

**Response (200 OK):**
```json
{
  "message": "Friend removed / Request rejected"
}
```
