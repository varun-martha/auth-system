# Feature Specification: Split with Friends, Groups & Expenses

**Feature Branch**: `007-split-friends-groups`

**Created**: 2026-05-26

**Status**: Draft

**Input**: User description: "Want to built the feature of Adding or creating split with friends and able to create a group and add members to the group and add an expense"

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create a Split Group (Priority: P1)

A registered user wants to organize shared expenses with a set of friends by creating a named group. The user gives the group a name (e.g., "Goa Trip 2026"), optionally adds a description, and invites friends by searching for them within the app or entering their email addresses. Once created, the group acts as a shared ledger visible to all members.

**Why this priority**: Groups are the foundational unit of the feature. Without a group, no expense can be shared. This is the entry point for every subsequent interaction.

**Independent Test**: Can be fully tested by creating a group, adding at least one friend as a member, and verifying the group appears in the group list for all members — delivering immediate collaborative value.

**Acceptance Scenarios**:

1. **Given** a logged-in user is on the Groups page, **When** they tap "Create Group", enter a group name, and add at least one friend, **Then** the group is created, appears in the user's group list, and all invited members receive a notification.
2. **Given** a user tries to create a group without entering a name, **When** they submit the form, **Then** they see a validation error and the group is not created.
3. **Given** a user searches for a friend by name or email, **When** no matching user is found, **Then** the user sees a "No results found" message and can invite via email instead.
4. **Given** a user creates a group with duplicate members, **When** the form is submitted, **Then** duplicates are silently de-duplicated and only unique members are added.

---

### User Story 2 - Add Members to an Existing Group (Priority: P2)

A group creator or member with appropriate permissions wants to add new people to an existing group after it has been created. They navigate to the group settings, search for friends or enter emails, and add them. New members immediately gain access to the group's expense history.

**Why this priority**: Groups grow over time — friends join trips late, or new collaborators are added to a household. This keeps the feature usable without needing to recreate groups.

**Independent Test**: Can be fully tested by opening an existing group, adding a new member, and verifying the new member sees the group and its existing expenses.

**Acceptance Scenarios**:

1. **Given** a group member is viewing the group details, **When** they select "Add Members" and search for a registered user, **Then** the found user is added to the group and receives an in-app notification.
2. **Given** a user tries to add someone already in the group, **When** they submit, **Then** they see an informative message stating the person is already a member.
3. **Given** a non-member user tries to access group add-member functionality, **When** they attempt the action, **Then** they are denied access with an appropriate error.

---

### User Story 3 - Add an Expense to a Group (Priority: P1)

A group member records a shared expense within a group. They provide the expense title, total amount, the date it occurred, and choose how to split it (equally among all members, by custom amounts, or by percentage). The system automatically calculates each member's share and updates everyone's balances.

**Why this priority**: Recording expenses is the core value proposition of the feature. Without this, the group is an empty container.

**Independent Test**: Can be fully tested by adding a single expense to a group with two members, verifying the split is calculated correctly, and checking that both members see updated balances.

**Acceptance Scenarios**:

1. **Given** a group member is viewing a group, **When** they tap "Add Expense", fill in title, amount, and choose equal split, **Then** the expense is recorded, each member's share is calculated, and all members can view the expense.
2. **Given** a user adds an expense with a custom split that does not sum to the total amount, **When** they submit, **Then** they see a validation error indicating the split amounts must equal the total.
3. **Given** a user adds an expense and assigns the payer as a specific member (not themselves), **When** saved, **Then** the balances reflect that the selected member paid and others owe them.
4. **Given** a user adds an expense with a zero or negative amount, **When** they submit, **Then** they see a validation error requiring a positive amount.

---

### User Story 4 - View Group Balances & Expense History (Priority: P2)

A group member wants to see a summary of who owes whom within a group, along with a chronological list of all expenses added. This allows members to track their financial obligations and understand the history of shared spending.

**Why this priority**: Visibility into balances is what makes the feature actionable — users need to know what they owe or are owed before they can settle up.

**Independent Test**: Can be fully tested by adding multiple expenses to a group and verifying the balance summary correctly reflects the net amounts owed between all members.

**Acceptance Scenarios**:

1. **Given** a group has multiple expenses recorded, **When** a member views the group, **Then** they see a clear balance summary showing net amounts owed and a list of all expenses.
2. **Given** a group has no expenses, **When** a member views the group, **Then** they see an empty state message prompting them to add the first expense.
3. **Given** balances are fully settled (all members even), **When** viewing the group summary, **Then** the system shows a "All settled up" status.

---

### User Story 5 - Create a Direct Split with a Friend (Priority: P3)

Without creating a formal group, a user can record a one-off shared expense directly with a single friend. This is a lightweight flow for simple, two-party splits (e.g., splitting a lunch bill).

**Why this priority**: Some splits are simple and creating a full group adds unnecessary friction. This story delivers convenience for common, everyday scenarios.

**Independent Test**: Can be fully tested by navigating to a friend's profile or the "Split with Friend" shortcut, adding a one-off expense, and verifying both users see the correct balances.

**Acceptance Scenarios**:

1. **Given** a logged-in user selects a friend and taps "Split Expense", **When** they enter an amount and description, **Then** the expense is recorded between just those two users and their mutual balance is updated.
2. **Given** the user has no friends added, **When** they try to use direct split, **Then** they are prompted to add a friend first.

---

### Edge Cases

- What happens when a group member is removed — are their past expense contributions preserved?
- How does the system handle currency: is only a single currency supported per group, or can multi-currency splits be recorded?
- What happens if a user loses internet connectivity mid-expense submission — is data lost or retried?
- What happens when a user is invited to a group but has not yet registered on the platform?
- Can a group have a single member (creator only), and if so, can expenses still be added?
- What is the maximum number of members allowed in a group?

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow any authenticated user to create a group with a name and at least one additional member.
- **FR-002**: System MUST allow group members to invite other registered users to the group by name or email address.
- **FR-003**: System MUST allow any group member to add an expense, specifying a title, total amount, date, payer, and split method.
- **FR-004**: System MUST support at least three split methods: equal split among all members, custom fixed-amount split, and percentage-based split.
- **FR-005**: System MUST validate that expense split amounts sum exactly to the total expense amount before saving.
- **FR-006**: System MUST calculate and display each group member's running balance (who owes whom and how much) after every expense is added.
- **FR-007**: System MUST display a chronological list of all expenses within a group, visible to all members.
- **FR-008**: System MUST notify group members (in-app) when a new expense is added to a group they belong to.
- **FR-009**: System MUST notify a user (in-app) when they are added to a group.
- **FR-010**: System MUST allow a user to create a direct two-party split expense with a friend outside of a group context.
- **FR-011**: System MUST prevent duplicate members within a single group.
- **FR-012**: System MUST restrict group management actions (e.g., adding members) to authenticated users who are members of the group.
- **FR-013**: System MUST allow users to view a list of all groups they belong to.
- **FR-014**: System MUST preserve expense history and balances when a member is removed from a group.

### Key Entities *(include if feature involves data)*

- **Group**: Represents a collection of users sharing expenses. Has a name, optional description, member list, creation date, and creator.
- **Group Member**: A user who belongs to a group. Tracks their running balance within that group.
- **Expense**: A shared cost recorded within a group or between two friends. Has a title, total amount, date, payer (one member), and a set of expense splits.
- **Expense Split**: The individual share of an expense assigned to a specific member. Can be an equal share, fixed amount, or percentage.
- **Balance**: The net amount one user owes another, derived from the sum of all expense splits between those two users within a group.
- **Friend Connection**: A mutual link between two registered users enabling direct splits and group invitations.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create a group and add the first expense in under 2 minutes from first interaction.
- **SC-002**: Group expense balances update and are visible to all members within 5 seconds of an expense being saved.
- **SC-003**: Split calculation validation catches mismatched totals 100% of the time before any data is persisted.
- **SC-004**: 90% of users successfully add an expense on their first attempt without encountering an error or needing to retry.
- **SC-005**: Group members receive expense notifications within 30 seconds of the expense being added.
- **SC-006**: The expense list and balance summary load within 2 seconds for groups with up to 50 expenses.
- **SC-007**: The feature supports groups with up to 50 members without degradation in performance or usability.

---

## Assumptions

- Users must be registered and authenticated to create groups, add members, or record expenses. Guest access is out of scope.
- Only a single currency per group is supported in the initial version; multi-currency support is deferred to a future iteration.
- The platform already has a "friends" or contacts system (from the existing add-friends feature); group invitations will leverage this.
- Expense settlement (marking balances as paid/settled) is out of scope for this version — only tracking who owes whom is required.
- Group deletion is out of scope for this version; groups can be archived or left by individual members.
- Mobile responsiveness is assumed — the feature must work seamlessly on both desktop and mobile screen sizes.
- Push notifications are out of scope; in-app notifications are sufficient for this version.
- The payer of an expense defaults to the user adding the expense but can be changed to any group member.
