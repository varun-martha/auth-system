# Feature Specification: Invite and User Profile

**Feature Branch**: `004-paysplit-invite`

**Created**: 2026-05-22

**Status**: Draft

**Input**: User description: "Would like to add invite to paysplit feature. This will asks users email to invite them and An invitation email will be sent the provided url... User can invite anyone and their friends to this platform... And also in the dashboard there should be side bar to various features.. In that one of it is My profile. upon selecting the My profile then it should open my profile section and should display the user details and also a default user avatar(This can be randomly generated for each user....)..And user can also check who are the people that he/she invited to the application"

## Clarifications

### Session 2026-05-22

- Q: Should the dashboard sidebar be mobile responsive? → A: Yes, the dashboard sidebar must be mobile responsive.
- Q: Which email service provider should be used to send the invitation emails? → A: Nodemailer (SMTP)
- Q: How should the randomly generated default avatar be created? → A: Use DiceBear API to generate a deterministic image URL based on their email

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Invite Friends via Email (Priority: P1)

As a user, I want to invite friends to the PaySplit platform by entering their email addresses, so that they receive an invitation email containing a link to sign up.

**Why this priority**: Growth and user acquisition are critical core functions of a social platform like PaySplit.

**Independent Test**: Can be independently tested by entering an email, triggering the invite action, and verifying that the correct email is sent with the appropriate invite link.

**Acceptance Scenarios**:

1. **Given** I am logged into the dashboard, **When** I enter a valid email address and click send invite, **Then** an invitation email containing the sign-up URL is sent to the recipient.
2. **Given** I am on the invite screen, **When** I enter an invalid email format, **Then** I should see an error message and the invite is not sent.
3. **Given** I am on the invite screen, **When** I try to invite an email that is already registered, **Then** I am notified that the user is already on the platform.

---

### User Story 2 - View My Profile and Avatar (Priority: P2)

As a user, I want to access a "My Profile" section from a dashboard sidebar, so that I can view my user details and my auto-generated default avatar.

**Why this priority**: Personalization and clear navigation enhance the user experience and give users a sense of identity.

**Independent Test**: Can be tested by navigating the dashboard sidebar, clicking "My Profile", and verifying that user details and a random generated avatar are displayed.

**Acceptance Scenarios**:

1. **Given** I am on the dashboard, **When** I click "My Profile" in the sidebar, **Then** my profile section opens displaying my details (e.g., name, email).
2. **Given** I view my profile for the first time, **When** the profile loads, **Then** a randomly generated avatar is uniquely displayed for my account.

---

### User Story 3 - View Invited People List (Priority: P3)

As a user, I want to see a list of people I have successfully invited to the platform, so that I can track my invitations.

**Why this priority**: Closes the loop on the invite feature, giving users visibility into their network growth.

**Independent Test**: Can be tested by viewing the invited people section and verifying it correctly lists previously invited emails or users.

**Acceptance Scenarios**:

1. **Given** I have invited several friends, **When** I navigate to the invited people list, **Then** I see the email addresses of the people I invited.
2. **Given** I have not invited anyone yet, **When** I view the list, **Then** I see an empty state with a call-to-action to invite friends.
3. **Given** an invited friend registers for an account, **When** their registration is successful, **Then** the invitation status automatically updates from 'Sent' to 'Joined'.

### Edge Cases

- What happens when the email service provider fails to send the invitation?
- How does the system handle an invitation sent to the same email address multiple times by the same user?
- What happens if a user tries to invite their own email address?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a dashboard sidebar containing navigation links, including one for "My Profile", and this sidebar MUST be mobile responsive.
- **FR-002**: The system MUST allow users to input an email address to send a platform invitation.
- **FR-003**: The system MUST send an email to the provided address containing a registration link.
- **FR-004**: The system MUST use the DiceBear API to generate and assign a deterministic default avatar URL based on the user's email upon account creation or profile viewing.
- **FR-005**: The system MUST display user details (e.g., name, email) in the "My Profile" section.
- **FR-006**: The system MUST maintain a record of which user invited which email addresses.
- **FR-007**: The system MUST display a list of invited people (emails or names) to the user who sent the invitations.

### Security & Auth Considerations

- The invitation URL should not contain sensitive information and may include an invite token to track the source of the invite.
- Rate limiting MUST be applied to the invite email endpoint to prevent abuse or spamming.

### Key Entities

- **User**: Represents the platform member. Attributes: ID, Name, Email, Avatar URL.
- **Invitation**: Represents an invite sent to a potential user. Attributes: Inviter ID, Invitee Email, Status (Sent, Joined), Timestamp.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can successfully send an invite in under 30 seconds from the dashboard.
- **SC-002**: 100% of generated avatars are correctly displayed without broken images in the profile view.
- **SC-003**: The invited list correctly reflects the sent invitations within 1 second of an invite being sent.

## Assumptions

- Users have already been authenticated before accessing the dashboard.
- Nodemailer will be configured via SMTP as the email service provider for sending invitations.
- Tracking whether an invite is "joined" is automatically handled upon successful registration.
