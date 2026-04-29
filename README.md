# janus

Auth service. Issues JWT tokens by validating credentials against `atreides`.

Named after Janus, the two-faced Roman god — one face looks at who you are, the other at where you're going.

## Stack

- Node.js 24 + TypeScript
- Fastify (via `@enxoval/http`)
- JWT HS256 (via `@enxoval/auth`)
- No DB — stateless

## How to Run

```bash
cp .env.example .env
npm install
npm run dev
```

Or with Docker (from `platform/`):

```bash
docker-compose up janus
```

Default port: **3003**

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/health` | — | Health check |
| `POST` | `/auth/login` | — | Authenticate and receive a JWT token |

## POST /auth/login

```bash
curl -X POST http://localhost:3003/auth/login \
  -H 'Content-Type: application/json' \
  -d '{ "email": "paul@arrakis.dune", "password": "spice123" }'
```

**Response:**

```json
{ "token": "<jwt>" }
```

The JWT payload contains `userId` and `role`. Pass it as `Authorization: Bearer <token>` on all subsequent requests to `imperium`.

## Flow

```
client → POST /auth/login
           │
           └─ janus calls atreides POST /users/authenticate
                │
                └─ returns { id, email, role }
                        │
                        └─ janus signs JWT { userId, role } → returns token
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | HTTP port (default: `3003`) |
| `HOST` | Bind address (default: `0.0.0.0`) |
| `JWT_SECRET` | Secret used to sign tokens (must match all services) |
| `JWT_EXPIRES_IN` | Token expiry (default: `1h`) |
| `ATREIDES_URL` | Base URL of the atreides service |

## Scripts

```bash
npm run dev      # dev server with hot reload
npm run build    # compile TypeScript
npm test         # run all tests
npm run lint     # check formatting and lint
```
