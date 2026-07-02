# Plan 01-02 Summary: Authentication

## Output Created
- `src/models/User.js` — Mongoose model for User with bcrypt helper.
- `scripts/createSeller.js` — CLI script using commander to seed seller.
- `src/controllers/authController.js` — Zod schema validation, login generating JWT with `jose`, logout denylisting jti.
- `src/middleware/auth.js` — JWT verification and Redis denylist graceful check.
- `src/routes/authRoutes.js` — /login, /logout, /me endpoints.

## Execution Details
Auth endpoints use httpOnly cookies. Redis errors fail open so active valid tokens still work if Redis restarts. Zod schemas enforce login payload format.
