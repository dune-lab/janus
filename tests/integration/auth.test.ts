import { test, describe, it, expect, beforeAll, beforeEach } from '@enxoval/testing';

test.mock('../../src/diplomat/http-client/atreides', () => ({
  authenticate: test.fn(),
}));

import { buildApp } from '../../src/app';
import { inject } from '@enxoval/http';
import { authenticate } from '../../src/diplomat/http-client/atreides';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = 'test-secret';

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
    (authenticate as ReturnType<typeof test.fn>).mockResolvedValue({
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      email: 'alice@example.com',
      role: 'student',
    });

    const res = await inject({ method: 'POST', url: '/auth/login', body: { email: 'alice@example.com', password: 'secret123' } });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.token).toBeDefined();
  });

  it('token payload contains userId and role', async () => {
    (authenticate as ReturnType<typeof test.fn>).mockResolvedValue({
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      email: 'alice@example.com',
      role: 'student',
    });

    const res = await inject({ method: 'POST', url: '/auth/login', body: { email: 'alice@example.com', password: 'secret123' } });

    const { token } = res.json();
    const payload = verify(token, JWT_SECRET) as { userId: string; role: string };
    expect(payload.userId).toBe('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
    expect(payload.role).toBe('student');
  });

  it('returns 401 when atreides rejects credentials', async () => {
    const { UnauthorizedError } = await import('@enxoval/types');
    (authenticate as ReturnType<typeof test.fn>).mockRejectedValue(new UnauthorizedError('Invalid credentials'));

    const res = await inject({ method: 'POST', url: '/auth/login', body: { email: 'alice@example.com', password: 'wrong' } });

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
