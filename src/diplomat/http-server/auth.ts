import { fn } from '@enxoval/types';
import { postOk } from '@enxoval/http';
import { LoginWireIn } from '../../wire/in/auth';
import { SessionWireOut } from '../../wire/out/session';
import { Session } from '../../model/session';
import { login } from '../../controllers/auth';

const toWireOut = fn(Session, SessionWireOut, (s) => ({ token: s.token }));

export function registerAuthRoutes(): void {
  postOk('/auth/login', async (body) => {
    const input = LoginWireIn.parse(body);
    const session = await login(input);
    return toWireOut(session);
  });
}
