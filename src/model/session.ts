import { createSchema, field } from '@enxoval/types';

export const Session = createSchema({
  token: field.string(),
});

export type Session = ReturnType<typeof Session.parse>;
