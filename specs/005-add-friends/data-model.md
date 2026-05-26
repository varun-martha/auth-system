# Data Model: Adding Friends

## Entities

### Friendship
Represents a connection between two users and the state of that connection.

**Fields:**
- `requesterId` (ObjectId, ref: User): The user who sent the friend request.
- `recipientId` (ObjectId, ref: User): The user who received the friend request.
- `status` (Enum: 'pending', 'accepted'): The current status of the friendship.
- `createdAt` (Date): When the request was sent.
- `updatedAt` (Date): When the request was accepted (or otherwise modified).

**Indexes:**
- Compound index on `{ requesterId: 1, recipientId: 1 }` (Unique) to prevent duplicate requests between the same two users.
- Index on `requesterId` and `recipientId` individually for fast lookups of a user's friends.

### User (Existing)
*The existing user model will be utilized. No changes strictly required to the schema itself for basic functionality, though we will project specific fields for public viewing.*

**Public Profile Projection:**
When returning users in search results, we must only return:
- `_id`
- `username`
- `email`
- `avatar` (if exists in existing schema)

## Validation Rules
- Users cannot send a friend request to themselves (`requesterId` !== `recipientId`).
- Only 'pending' or 'accepted' statuses are valid. If a request is rejected or a friend is removed, the document is deleted rather than keeping a 'rejected' state, keeping the collection lean.
