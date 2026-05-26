# Feature Specification: Adding Friends

**Feature Branch**: `006-add-friends`

**Created**: 2026-05-25

**Status**: Draft

**Input**: User description: "Want to add one more feature, Adding friends.. Users can able to search and view all other users .. Users can search their friends using their username or email.... the search results should display the list of users matching with email or username.. In the results, every matched user avata, username and email should be displayed. THere should a your friends section in the sidebar,  Upon clicking on this, in the page, your friends list should be displayed and able to add them as friend, search friend and send them friend request and also able to remove as friend.."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Search and View Users (Priority: P1)

As a user, I want to be able to search for other users by their email or username so that I can find people I know.

**Why this priority**: Without being able to find other users, the entire friends feature cannot function. It is the prerequisite for sending friend requests.

**Independent Test**: Can be fully tested by entering an existing user's email or username in a search bar and verifying the correct user profile (avatar, username, email) appears in the results.

**Acceptance Scenarios**:

1. **Given** I am on the friend search page, **When** I enter a valid partial or full username, **Then** I see a list of users matching that username with their avatar, username, and email.
2. **Given** I am on the friend search page, **When** I enter a valid partial or full email, **Then** I see a list of users matching that email with their avatar, username, and email.
3. **Given** I am on the friend search page, **When** I search for an email or username that does not exist, **Then** I see an empty state or message indicating no users were found.

---

### User Story 2 - Manage Friends List (Priority: P1)

As a user, I want to access a "Your Friends" section from the sidebar to view my current friends and manage them.

**Why this priority**: Viewing current friends is core to the feature and provides the primary interface for managing social connections.

**Independent Test**: Can be fully tested by navigating to the "Your Friends" section via the sidebar and observing the list of existing friends.

**Acceptance Scenarios**:

1. **Given** I am logged in, **When** I click "Your Friends" in the sidebar, **Then** I am navigated to a page displaying my current friends.
2. **Given** I am on the "Your Friends" page, **When** I click to remove a friend, **Then** the user is removed from my friends list.

---

### User Story 3 - Send Friend Requests (Priority: P2)

As a user, I want to be able to send friend requests to other users I find through search so that we can become friends.

**Why this priority**: Sending requests is necessary to establish new friendships, but relies on search functionality being present.

**Independent Test**: Can be tested by searching for a user and clicking an "Add Friend" button, verifying that a request is initiated.

**Acceptance Scenarios**:

1. **Given** I have searched for a user who is not my friend, **When** I click the add friend button, **Then** a friend request is sent to that user.
2. **Given** I am viewing a user who is already my friend, **When** I view their profile in search results, **Then** I see an indication that we are already friends instead of an "Add Friend" button.

---

### Edge Cases

- What happens when a user tries to search for themselves?
- What happens when a user sends a friend request to someone they have already sent a request to (pending state)?
- How does the system handle searching with special characters or extremely long strings?
- What happens if a user removes a friend who simultaneously sent them a new friend request?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a "Your Friends" navigation link in the main sidebar.
- **FR-002**: System MUST allow users to search the user directory by full or partial username.
- **FR-003**: System MUST allow users to search the user directory by full or partial email address.
- **FR-004**: System MUST display user search results including the user's avatar, username, and email address.
- **FR-005**: System MUST allow users to send a friend request to non-friend users from the search results.
- **FR-006**: System MUST maintain a friends list for each user, accessible via the "Your Friends" section.
- **FR-007**: System MUST allow users to remove an existing friend from their friends list.
- **FR-008**: System MUST require explicit approval from the recipient for friend requests before establishing a friendship connection.
- **FR-009**: System MUST deliver friend requests, acceptances, and removals in real-time using WebSockets so the UI updates instantaneously without manual refresh.
- **FR-010**: System MUST intelligently update search result action buttons to reflect the user's current relationship status (e.g., displaying "Requested", "Friend", or "Accept") instead of always showing "Add Friend".
- **FR-011**: System MUST badge the incoming requests tab with the accurate count of incoming requests only.

### Security & Auth Considerations *(mandatory when authentication changes)*

- Search functionality MUST NOT expose sensitive user data beyond public profile information (avatar, username, email).
- Search endpoints MUST be protected against enumeration attacks or scraping via rate limiting.
- Only authenticated users MUST be able to search the user directory or manage friends.

### Key Entities *(include if feature involves data)*

- **Friendship / Connection**: Represents a relationship between two users, including the state of the relationship (e.g., requested, accepted, rejected).
- **User Profile Ext**: The public-facing representation of a user in search results (id, username, email, avatar URL).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can successfully navigate to "Your Friends" and view their friends list.
- **SC-002**: Users can search and find existing users within 2 seconds.
- **SC-003**: Users can successfully send a friend request and see UI confirmation.
- **SC-004**: Users can successfully remove an existing friend and see them disappear from the list.

## Assumptions

- We assume basic user profiles (avatar, username, email) already exist in the system.
- We assume standard pagination or limiting will be applied to search results to prevent returning excessively large lists.
- We assume users cannot friend themselves.
