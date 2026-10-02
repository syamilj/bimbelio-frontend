import { defineConfig, devices } from '@playwright/test';

import { E2E_ENV, E2E_PORT, MOCK_API } from './test/e2e/env';

// Jalankan `bun run e2e:build` lebih dulu; di sini hanya menyalakan server.
export default defineConfig({
  testDir: './test/e2e/specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://127.0.0.1:${E2E_PORT}`,
    trace: 'retain-on-failure',
    locale: 'id-ID',
    timezoneId: 'Asia/Jakarta',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: [
    {
      command: 'bun test/e2e/mock-api/server.ts',
      url: `${MOCK_API}/__unhandled`,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: `bun x next start -p ${E2E_PORT}`,
      url: `http://127.0.0.1:${E2E_PORT}`,
      env: E2E_ENV,
      timeout: 120_000,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
