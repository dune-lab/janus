import { createSchema, field } from '@enxoval/types';

export const SessionWireOut = createSchema({
  token: field.string(),
});
