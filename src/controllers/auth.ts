import { asyncFn } from '@enxoval/types';
import { signToken } from '@enxoval/auth';
import { Session } from '../model/session';
import { AuthorizedUser } from '../model/user';

export const login = asyncFn(AuthorizedUser, Session, async (user) => {
  return { token: signToken(user.userId, user.role) };
});
