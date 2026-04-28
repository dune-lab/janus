import { createSchema, field } from '@enxoval/types';

export const AuthorizedUser = createSchema({
  userId: field.uuid(),
  role: field.string(),
});

export type AuthorizedUser = ReturnType<typeof AuthorizedUser.parse>;
