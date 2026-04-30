# janus

Auth service. Issues JWT tokens by validating credentials against `atreides`.

Named after Janus, the two-faced Roman god — one face looks at who you are, the other at where you're going.

## Stack

- Node.js 22 + TypeScript
- Fastify (via `@enxoval/http`)
- JWT HS256 (via `@enxoval/auth`)
- No DB — stateless

## How to Run

```bash
cp .env.example .env
npm install
npm run dev
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

The JWT payload contains `userId` and `role`. Pass it as `Authorization: Bearer <token>` on all subsequent requests.

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
npm run dev            # dev server with hot reload
npm run build          # compile TypeScript + generate contracts.json
npm test               # run all tests
npm run integration    # integration tests only
npm run lint           # check formatting and lint
npm run lint-fix       # auto-fix formatting
```

## CI Pipeline

Every PR runs 5 checks in sequence:

```
Build
├── Unit Tests        (skipped — no unit tests defined)
├── Integration Tests
└── Publish Contracts
        └── Contract Validation
```

| Check | Description |
|-------|-------------|
| **Build** | Compiles TypeScript, generates `contracts.json` |
| **Integration Tests** | Tests against atreides HTTP client |
| **Publish Contracts** | Publishes `contracts.json` to [dune-lab/contracts](https://github.com/dune-lab/contracts) |
| **Contract Validation** | Runs kanly — validates wire compatibility with atreides |

## Contract Validation

Wire types live in `src/wire/`. They are defined with `createSchema` and `field.*`:

```ts
import { createSchema, field } from '@enxoval/types';

export const AtreidesWireIn = createSchema({
  id: field.uuid(),
  email: field.string(),
  role: field.string(),
});
```

After every build, `contracts.json` is auto-generated via the `postbuild` script and published to [dune-lab/contracts](https://github.com/dune-lab/contracts). kanly reads this registry on every PR and validates that each consumer's `wire_in` fields are compatible with the producer's `wire_out`.
