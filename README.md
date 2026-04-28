# janus

Auth service. Issues JWT tokens by validating credentials against `atreides`.

## Stack

- Node.js 24 + TypeScript
- Fastify (via `@enxoval/http`)
- JWT HS256 (via `@enxoval/auth`)

## How to Run

```bash
cp .env.example .env
npm install
npm run dev
```

Or with Docker:

```bash
docker-compose up
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/auth/login` | Authenticate and receive a JWT token |

## POST /auth/login

```bash
curl -X POST http://localhost:3003/auth/login \
  -H 'Content-Type: application/json' \
  -d '{ "email": "paul@arrakis.dune", "password": "spice123" }'
```

Response:

```json
{ "token": "<jwt>" }
```

The token payload contains `userId` and `role`. Pass it as `Authorization: Bearer <token>` in subsequent requests to other services.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | HTTP port (default `3003`) |
| `HOST` | Bind address (default `0.0.0.0`) |
| `JWT_SECRET` | Secret used to sign tokens |
| `JWT_EXPIRES_IN` | Token expiry (default `1h`) |
| `ATREIDES_URL` | Base URL of the atreides service |

## Scripts

```bash
npm run dev      # dev server with hot reload
npm run build    # compile TypeScript
npm test         # run all tests
npm run lint     # check formatting and lint
```
