# Codebase Audit

## Summary
- Total smells found: 16
- Critical: 3 | High: 3 | Medium: 10

## Issues

| File | Issue | Severity | Explanation |
|------|-------|----------|-------------|
| src/routes.js | MD5 password hashing | CRITICAL | MD5 is not a password algorithm; instantly crackable |
| src/routes.js | JWT secret fallback | HIGH | Hardcoded weak JWT secret fallback allows token forging |
| src/routes.js | No permission on delete | CRITICAL | Deleting shipments without ownership/admin check allows data loss |
| src/routes.js | Spreading req.body into models | HIGH | Accepts arbitrary fields and enables NoSQL injection |
| src/routes.js | N+1 DB queries | MEDIUM | Fetches user inside loop instead of using aggregation/lookup |
| src/routes.js | Missing error handling for user lookup | HIGH | Unhandled promise rejections may leave requests hanging |
| src/routes.js | Tracking ID generation weak | MEDIUM | Using Date.now()+Math.random is collision-prone and not cryptographically strong |
| src/routes.js | Returning full user object | HIGH | May leak sensitive fields (password hashes) in responses |
| src/routes.js | Unused imports | MEDIUM | Several unused requires increase maintenance burden |
| src/routes.js | Authorization header parsing | MEDIUM | No Bearer parsing/validation for Authorization header |
| src/routes.js | Generic 200 responses | MEDIUM | Using 200 for errors loses proper HTTP semantics |
| src/routes.js | Logging PII | MEDIUM | Logging user emails may expose PII in logs |
| src/routes.js | Missing validation | MEDIUM | Inputs (email, status, etc.) are used without validation or sanitization |
| src/app.js | Start server before DB | MEDIUM | Server listens before DB connection is established |
| models/User.js | Password hash MD5 | CRITICAL | Passwords stored/hashed with MD5 — use bcrypt/argon2 with salt and proper rounds |
| models/Shipment.js | Missing field validation & enums | MEDIUM | `status` and `weight` lack strict validation; trackingId uniqueness assumptions fragile |
