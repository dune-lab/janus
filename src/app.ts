import { get } from '@enxoval/http';
import { setupRoutes } from './diplomat/http-server/index';

export function buildApp(): void {
  get('/health', async () => ({ status: 'ok' }));
  setupRoutes();
}
