# Naming and Style Guide

## Cross-Repository Rules

- Use descriptive domain names. Prefer `registerUserService` over `service1`.
- Keep one primary responsibility per module.
- Avoid mixed controller, validation, and persistence logic in the same file.
- Use explicit return types for public functions and exported class methods.
- Prefer immutable values with `const`; use `let` only when mutation is needed.
- Prefer early returns over deeply nested conditional blocks.
- Keep functions short and centered on a single business outcome.

## TypeScript Rules

- Enable strict TypeScript settings in both applications.
- Do not use `any` unless there is a documented boundary with an unavoidable
  third-party type gap.
- Use shared response and request DTO names that match the auth domain.
- Use `camelCase` for variables and functions, `PascalCase` for components and
  types, and `UPPER_SNAKE_CASE` for true constants.

## Frontend Rules

- Use plain CSS only. CSS modules are acceptable because they remain plain CSS.
- Use `PascalCase` component filenames and `kebab-case` CSS filenames.
- Keep route components thin and move reusable logic into `components/`,
  `services/`, and `lib/`.
- Prefer semantic HTML and accessible labels on all auth forms.

## Backend Rules

- Keep route handlers thin and push business logic into `services/`.
- Keep persistence details inside `repositories/`.
- Keep input parsing and validation inside `validators/`.
- Keep security-sensitive utilities separate from controller logic.

## Testing Rules

- Cover success, failure, and abuse paths for every authentication flow.
- Keep integration tests close to domain scenarios and contract tests close to
  API boundaries.
- Prefer test names that state the expected business behavior.
