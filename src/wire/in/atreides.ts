import { createSchema, field } from '@enxoval/types';

export const AtreidesWireIn = createSchema({
  id: field.uuid(),
  email: field.string(),
  role: field.string(),
});
