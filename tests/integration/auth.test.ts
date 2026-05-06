import { test, describe, it, expect, beforeAll, beforeEach, generate } from '@enxoval/testing';

test.mock('../../src/diplomat/http-client/atreides', () => ({
  authenticate: test.fn(),
}));

import { buildApp } from '../../src/app';
import { inject } from '@enxoval/http';
import { authenticate } from '../../src/diplomat/http-client/atreides';
import { verify } from 'jsonwebtoken';
import { createSchema, field } from '@enxoval/types';
import { LoginWireIn } from '../../src/wire/in/auth';

const JWT_SECRET = 'test-secret';

const AuthUser = createSchema({
  id: field.uuid(),
  email: field.string(),
  role: field.literal('student', 'teacher', 'admin'),
});

beforeAll(() => {
  process.env.JWT_SECRET = JWT_SECRET;
  process.env.JWT_EXPIRES_IN = '1h';
  buildApp();
});

beforeEach(() => {
  test.clearAll();
});

describe('POST /auth/login', () => {
  it('returns 200 with token for valid credentials', async () => {
    const mockUser = generate(AuthUser);
    (authenticate as ReturnType<typeof test.fn>).mockResolvedValue(mockUser);

    const res = await inject({ method: 'POST', url: '/auth/login', body: generate(LoginWireIn) });

    expect(res.statusCode).toBe(200);
    expect(res.json().token).toBeDefined();
  });

  it('token payload contains userId and role', async () => {
    const mockUser = generate(AuthUser);
    (authenticate as ReturnType<typeof test.fn>).mockResolvedValue(mockUser);

    const res = await inject({ method: 'POST', url: '/auth/login', body: generate(LoginWireIn) });

    const { token } = res.json();
    const payload = verify(token, JWT_SECRET) as { userId: string; role: string };
    expect(payload.userId).toBe(mockUser.id);
    expect(payload.role).toBe(mockUser.role);
  });

  it('returns 401 when atreides rejects credentials', async () => {
    const { UnauthorizedError } = await import('@enxoval/types');
    (authenticate as ReturnType<typeof test.fn>).mockRejectedValue(new UnauthorizedError('Invalid credentials'));

    const res = await inject({ method: 'POST', url: '/auth/login', body: generate(LoginWireIn) });

    expect(res.statusCode).toBe(401);
  });

  it('returns 400 on missing email', async () => {
    const res = await inject({ method: 'POST', url: '/auth/login', body: { password: 'secret123' } });
    expect(res.statusCode).toBe(400);
  });

  it('returns 400 on missing password', async () => {
    const res = await inject({ method: 'POST', url: '/auth/login', body: { email: 'alice@example.com' } });
    expect(res.statusCode).toBe(400);
  });
});
