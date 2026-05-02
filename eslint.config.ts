import { base, boundaries } from '@enxoval/quality';

export default [
  ...base(),
  ...boundaries([
    { name: 'http-server', pattern: ['src/diplomat/http-server/**'], allow: ['controllers', 'adapters', 'wire', 'model', 'http-client'] },
    { name: 'http-client', pattern: ['src/diplomat/http-client/**'], allow: ['wire', 'model'] },
    { name: 'controllers', pattern: ['src/controllers/**'], allow: ['model', 'adapters'] },
    { name: 'adapters', pattern: ['src/adapters/**'], allow: ['model', 'wire'] },
    { name: 'model', pattern: ['src/model/**'], allow: [] },
    { name: 'wire', pattern: ['src/wire/**'], allow: [] },
  ]),
];
