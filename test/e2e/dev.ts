/// <reference types="bun" />
/** Dev server dengan env mock untuk debugging E2E: `bun test/e2e/dev.ts`. */
import { E2E_ENV } from './env';

const mock = Bun.spawn(['bun', 'test/e2e/mock-api/server.ts'], {
  stdout: 'inherit',
  stderr: 'inherit',
});
const dev = Bun.spawn(
  ['bun', 'x', 'next', 'dev', '-p', process.env.PORT ?? '3300'],
  {
    env: { ...process.env, ...E2E_ENV },
    stdout: 'inherit',
    stderr: 'inherit',
  },
);
process.on('SIGINT', () => {
  mock.kill();
  dev.kill();
});
await dev.exited;
mock.kill();
