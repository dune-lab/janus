import { fn } from '@enxoval/types';
import { AtreidesWireIn } from '../wire/in/atreides';
import { AuthorizedUser } from '../model/user';

export const toAuthUser = fn(AtreidesWireIn, AuthorizedUser, (wire) => ({
  userId: wire.id,
  role: wire.role,
}));
