/// <reference types="bun" />
/**
 * Build produksi untuk E2E dengan env mock (`bun run e2e:build`).
 * Mock API ikut dinyalakan selama build karena beberapa halaman (blog, sitemap)
 * mengambil data saat build — tanpa ini build akan memanggil host yang salah.
 */
import { E2E_ENV } from './env';

const mock = Bun.spawn(['bun', 'test/e2e/mock-api/server.ts'], {
  stdout: 'inherit',
  stderr: 'inherit',
});
try {
  const build = Bun.spawn(['bun', 'x', 'next', 'build'], {
    env: { ...process.env, ...E2E_ENV },
    stdout: 'inherit',
    stderr: 'inherit',
  });
  process.exitCode = await build.exited;
} finally {
  mock.kill();
}
