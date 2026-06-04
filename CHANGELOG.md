# Changelog

## 2026-06-04

### 1) Structural Refactor: Flat Routes to MVC Layers
- What changed:
  - Reorganized code into `src/routes`, `src/controllers`, `src/services`, `src/models`, `src/middlewares`, and `src/utils`.
  - Split monolithic routing logic into thin route files and dedicated controllers/services.
- What was wrong before:
  - One large route file mixed transport logic, auth logic, business rules, and direct DB calls.
  - Hard to test and hard to reason about ownership of responsibilities.
- Improvement:
  - Clear separation of concerns.
  - Easier maintenance, debugging, and incremental feature development.

### 2) Language Refactor: `var` to `const`/`let`
- What changed:
  - Replaced legacy `var` declarations with `const`/`let` throughout app code.
- What was wrong before:
  - `var` is function-scoped and easier to misuse, increasing accidental reassignments and hoisting confusion.
- Improvement:
  - Safer defaults (`const`), clearer mutability intent, and fewer scope-related bugs.

### 3) Async Refactor: Promise Chains to `async/await`
- What changed:
  - Replaced `.then().catch()` chains with `async/await` in controller/app flows.
- What was wrong before:
  - Nested promise chains reduced readability and made linear error paths harder to follow.
- Improvement:
  - More readable, top-down control flow and cleaner error propagation strategy.

### 4) Request Validation: Joi Schemas + Validation Middleware
- What changed:
  - Added Joi schemas in `src/validators/*`.
  - Added validation middleware that runs `schema.validate(req.body, { abortEarly: false, stripUnknown: true })`.
  - Wired all body-accepting routes (`POST`/`PATCH`) through schema validation.
- What was wrong before:
  - Unvalidated `req.body` reached controller/service logic directly.
  - Unknown fields and invalid payloads could pass through.
- Improvement:
  - Consistent 422 validation responses.
  - Sanitized request bodies via `stripUnknown` before business logic runs.

### 5) Security Refactor: MD5 to bcrypt
- What changed:
  - Replaced password hashing/verification from MD5 to bcrypt (`12` rounds).
  - Updated auth flow to use secure compare logic.
- What was wrong before:
  - MD5 is not a password hashing algorithm and is fast/easy to crack.
- Improvement:
  - Strong password hashing with work factor, materially improving credential security.

### 6) Auth Refactor: Dedicated JWT Middleware
- What changed:
  - Centralized token verification in `src/middlewares/auth.middleware.js`.
  - Protected routes now rely on middleware instead of ad-hoc inline checks.
- What was wrong before:
  - Repeated auth logic across routes increased drift and inconsistency risk.
- Improvement:
  - Single auth gate, consistent token parsing/verification behavior.

### 7) Error Handling Refactor: Centralized Error Pipeline
- What changed:
  - Added `AppError`, `NotFoundError`, `UnauthorizedError`, `ConflictError`, `ValidationError`.
  - Added `errorHandler.middleware.js` and wired as final app middleware.
  - Controllers/middlewares now forward failures using `next(err)`.
- What was wrong before:
  - Distributed inline error responses and inconsistent error formatting/status behavior.
- Improvement:
  - Uniform API error contract, explicit HTTP semantics, and cleaner controllers.

### 8) Performance Refactor: N+1 Query Prevention
- What changed:
  - Shipment reads now use `.populate('userId', 'name email role')` in service methods.
  - Controller ownership checks updated to support populated refs.
- What was wrong before:
  - Previous architecture had N+1-style data fetching patterns (DB calls inside loops).
- Improvement:
  - Reduced round-trips for user-shipment hydration and better scalability on list endpoints.

### 9) Query Observability: Mongoose Debug + Per-Request Query Count
- What changed:
  - Added optional instrumentation (`MONGOOSE_DEBUG=true`) to log Mongoose operations and per-request query counts.
- What was wrong before:
  - No direct visibility into query volume for regression checks.
- Improvement:
  - Practical before/after measurement for query optimization and performance diagnostics.

### 10) Documentation Refactor: JSDoc Coverage
- What changed:
  - Added JSDoc blocks to exported functions in services/controllers/utils/middlewares.
  - Included `@param`, `@returns`, and `@throws` annotations.
- What was wrong before:
  - Exported APIs lacked consistent contracts and error expectations.
- Improvement:
  - Better developer onboarding, stronger editor hints, and clearer runtime contracts.
