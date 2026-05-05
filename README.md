# janus

Auth token issuer. Validates credentials against `atreides` and signs JWT tokens used by all services in the platform.

Named after Janus, the two-faced Roman god — one face looks at who you are, the other at where you're going.

---

## Responsibilities

- Validate `email + password` via atreides
- Sign and return a JWT containing `{ userId, role }`
- Stateless — no database, no session state

---

## Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 24 + TypeScript |
| HTTP | Fastify (`@enxoval/http`) |
| Auth | JWT HS256 (`@enxoval/auth`) |
| Logging | Pino structured JSON (`@enxoval/observability`) |
| Validation | `createSchema` + `asyncFn` (`@enxoval/types`) |
| Database | None — stateless |

---

## HTTP API

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/health` | — | Health check |
| `POST` | `/auth/login` | — | Authenticate and receive a JWT token |

### POST /auth/login

```bash
curl -X POST http://localhost:3003/auth/login \
  -H 'Content-Type: application/json' \
  -d '{ "email": "paul@arrakis.dune", "password": "spice123" }'
```

**Response:**

```json
{ "token": "<jwt>" }
```

The JWT payload contains `{ userId, role }`. Pass it as `Authorization: Bearer <token>` on all subsequent requests to any service.

---

## Auth Flow

```
1. client  → POST /auth/login { email, password }
2. janus   → POST atreides /users/authenticate
3. atreides → validates password hash, returns { id, email, role }
4. janus   → signs JWT { userId: id, role } with JWT_SECRET
5. client  ← { token }
```

The JWT is validated independently by each downstream service via `@enxoval/auth`. Janus never needs to be called again after login.

---

## Observability

Every request emits structured JSON logs:

```json
{ "level": "info", "service": "janus", "cid": "abc:0", "method": "POST", "url": "/auth/login", "msg": "http-server: request received" }
{ "level": "info", "service": "janus", "cid": "abc:0", "status": 200, "durationMs": 22, "msg": "http-server: response sent" }
```

Logs are available in Grafana via `{service="janus"}`.

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | HTTP port (default: `3003`) |
| `HOST` | Bind address (default: `0.0.0.0`) |
| `JWT_SECRET` | Secret used to sign tokens — must match all services |
| `JWT_EXPIRES_IN` | Token expiry (default: `1h`) |
| `ATREIDES_URL` | Base URL of the atreides service |

---

## Running Locally

```bash
cp .env.example .env
npm install
npm run dev
```

Default port: **3003**

---

## Scripts

```bash
npm run dev       # start with hot reload
npm run build     # compile TypeScript
npm test          # run tests (Vitest)
npm run lint      # check formatting + lint
npm run lint-fix  # auto-fix
```
