# Data Model

## Entities

### User
- **Fields**:
  - `_id`: ObjectId
  - `name`: String
  - `email`: String (Unique, Indexed)
  - `avatarUrl`: String (Default: DiceBear URL)
- **Relationships**: 1-to-Many with Invitations (as Inviter)

### Invitation
- **Fields**:
  - `_id`: ObjectId
  - `inviterId`: ObjectId (Ref: User)
  - `inviteeEmail`: String
  - `status`: String (Enum: ['Sent', 'Accepted'])
  - `createdAt`: Date
- **Relationships**: Belongs to User (Inviter)
