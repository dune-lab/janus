import { UnauthorizedError } from '@enxoval/types';

export async function authenticate(email: string, password: string): Promise<unknown> {
  const res = await fetch(`${process.env.ATREIDES_URL}/users/authenticate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (res.status === 401) throw new UnauthorizedError('Invalid credentials');
  if (!res.ok) throw new Error(`atreides returned ${res.status}`);

  return res.json();
}
