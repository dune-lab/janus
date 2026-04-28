import { UnauthorizedError } from '@enxoval/types';

export type AtreidesUser = { id: string; email: string; role: string };

export async function authenticateAtreides(email: string, password: string): Promise<AtreidesUser> {
  const url = `${process.env.ATREIDES_URL}/users/authenticate`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (res.status === 401) throw new UnauthorizedError('Invalid credentials');
  if (!res.ok) throw new Error(`atreides returned ${res.status}`);

  return res.json() as Promise<AtreidesUser>;
}
