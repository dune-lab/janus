import { fn } from '@enxoval/types';
import { postOk } from '@enxoval/http';
import { LoginWireIn } from '../../wire/in/auth';
import { SessionWireOut } from '../../wire/out/session';
import { Session } from '../../model/session';
import { toAuthUser } from '../../adapters/atreides';
import { authenticate } from '../http-client/atreides';
import { login } from '../../controllers/auth';

const toWireOut = fn(Session, SessionWireOut, (s) => ({ token: s.token }));

export function registerAuthRoutes(): void {
  postOk('/auth/login', async (body) => {
    const input = LoginWireIn.parse(body);
    const raw = await authenticate(input.email, input.password);
    const user = toAuthUser(raw);
    const session = await login(user);
    return toWireOut(session);
  }, { in: { schema: LoginWireIn, name: 'LoginWireIn' }, out: { schema: SessionWireOut, name: 'SessionWireOut' } });
}
