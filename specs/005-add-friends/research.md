# Research: Adding Friends

## Decision: Search and Friendship Flow
**Decision**: Use standard REST API endpoints for user search and friend management, backed by Mongoose models in MongoDB.
**Rationale**: The feature is a straightforward data modeling and retrieval problem. Using existing REST/Mongoose patterns maintains consistency with the rest of the application.
**Alternatives considered**: GraphQL or real-time WebSockets were considered but rejected as unnecessary complexity for a simple request/accept friend flow and basic text search.

## Decision: Rate Limiting
**Decision**: Apply `express-rate-limit` to the `/api/users/search` and `/api/friends/request` endpoints.
**Rationale**: As per the Constitution Check, search endpoints are prone to enumeration attacks and friend requests could be used for spamming. Rate limiting mitigates both risks.
**Alternatives considered**: Custom token bucket implementation (rejected due to reinventing the wheel since `express-rate-limit` is already in `backend/package.json`).

## Decision: Search Implementation
**Decision**: Use MongoDB `$regex` or text indexes for email and username searches.
**Rationale**: Simple and effective for the scale assumed for this app. We will limit the number of returned results to 20 per request to prevent excessive data transfer.
**Alternatives considered**: Dedicated search engine like Elasticsearch (rejected as overkill for basic user lookup).
