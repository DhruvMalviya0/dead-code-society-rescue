# LogiTrack Backend API

## Overview
LogiTrack is a backend API for shipment lifecycle management. It supports user registration/login, authenticated profile access, and CRUD-style shipment operations with role-based authorization checks (for example, only admins can mark shipments as delivered).

The codebase follows an MVC-style layout (`routes -> controllers -> services -> models`) with centralized error handling, Joi validation middleware, JWT auth middleware, and query-count instrumentation for N+1 performance checks.

## Tech Stack

| Layer | Technology |
|------|------------|
| Runtime | Node.js |
| Framework | Express |
| Database | MongoDB + Mongoose |
| Authentication | JWT (`jsonwebtoken`) |
| Validation | Joi |
| Hashing | bcrypt |

## Quick Start

1. Clone and enter the project:

```bash
git clone <your-repository-url>
cd dead-code-society-rescue
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
copy .env.example .env
```

4. Update `.env` values (especially `JWT_SECRET` and `DATABASE_URL`).

5. Run the app:

```bash
npm run dev
```

Or:

```bash
npm start
```

## Environment Variables

| Name | Example | Required | Description |
|------|---------|----------|-------------|
| `PORT` | `3000` | No | HTTP port used by Express. Defaults to `3000`. |
| `DATABASE_URL` | `mongodb://localhost:27017/logitrack` | Yes | MongoDB connection URI for Mongoose. |
| `JWT_SECRET` | `super_secret_logitrack_2019_dont_share` | Yes | Secret used to sign/verify JWT tokens. |
| `MONGOOSE_DEBUG` | `true` | No | Enables mongoose debug + per-request query count logs. |

## API Reference

Base URL prefix for API routes: `/api`

| Method | Endpoint | Auth Required | Description |
|------|----------|---------------|-------------|
| `GET` | `/` | No | Health-style welcome response. |
| `POST` | `/api/users/register` | No | Register a new user account. |
| `POST` | `/api/users/login` | No | Authenticate and receive JWT token. |
| `GET` | `/api/users/profile` | Yes (Bearer JWT) | Return current authenticated user profile. |
| `GET` | `/api/shipments` | Yes (Bearer JWT) | List shipments belonging to authenticated user. |
| `GET` | `/api/shipments/:id` | Yes (Bearer JWT) | Get one shipment if owner or admin. |
| `POST` | `/api/shipments` | Yes (Bearer JWT) | Create shipment for authenticated user. |
| `PATCH` | `/api/shipments/:id/status` | Yes (Bearer JWT) | Update shipment status (delivered restricted to admin). |
| `DELETE` | `/api/shipments/:id` | Yes (Bearer JWT) | Delete shipment if owner or admin. |

## ASCII Architecture Diagram

```text
Client
	|
	v
Express App (src/app.js)
	|
	+--> Global Middleware
	|      - cors
	|      - body-parser
	|      - auth.middleware (protected routes)
	|      - validate (Joi schema per body route)
	|
	+--> Routes (src/routes/*)
					|
					v
			Controllers (src/controllers/*)
					|
					v
			Services (src/services/*)
					|
					v
			Models (src/models/*, Mongoose)
					|
					v
				MongoDB

Error Flow:
Controller/Middleware -> next(err) -> errorHandler.middleware
```
