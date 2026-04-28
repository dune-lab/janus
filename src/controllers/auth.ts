import { asyncFn } from '@enxoval/types';
import { signToken } from '@enxoval/auth';
import { Session } from '../model/session';
import { LoginWireIn } from '../wire/in/auth';
import { authenticateAtreides } from '../adapters/atreides';

export const login = asyncFn(LoginWireIn, Session, async (input) => {
  const user = await authenticateAtreides(input.email, input.password);
  return { token: signToken(user.id, user.role) };
});
