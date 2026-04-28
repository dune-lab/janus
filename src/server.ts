import { listen } from '@enxoval/http';
import { buildApp } from './app';

const PORT = Number(process.env.PORT ?? 3003);
const HOST = process.env.HOST ?? '0.0.0.0';

buildApp();

listen(PORT, HOST).then(() => {
  console.log(`janus running on ${HOST}:${PORT}`);
});
