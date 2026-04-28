import { createSchema, field } from '@enxoval/types';

export const LoginWireIn = createSchema({
  email: field.string(),
  password: field.string(),
});
