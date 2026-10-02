import { defineConfig, devices } from '@playwright/test';

import {
  E2E_DOMAINS,
  E2E_DOMAINS_ENV,
  E2E_DOMAINS_PORT,
  E2E_ENV,
  E2E_PORT,
  MOCK_API,
} from './test/e2e/env';

// Jalankan `bun run e2e:build` lebih dulu; di sini hanya menyalakan server.
// Debug cepat: `bun test/e2e/dev.ts` lalu `E2E_BASE_URL=http://localhost:3300 bun run e2e`.
const externalBaseURL = process.env.E2E_BASE_URL;
export default defineConfig({
  testDir: './test/e2e/specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: externalBaseURL ?? `http://127.0.0.1:${E2E_PORT}`,
    trace: 'retain-on-failure',
    locale: 'id-ID',
    timezoneId: 'Asia/Jakarta',
  },
  projects: [
    {
      name: 'desktop',
      testIgnore: /domains\.spec/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile',
      testIgnore: /domains\.spec/,
      use: { ...devices['Pixel 7'] },
    },
    // Mode domain terpisah (bimbelio.com / app. / admin.) lewat next dev,
    // karena URL domain ikut ter-inline saat build.
    {
      name: 'domains',
      testMatch: /domains\.spec/,
      timeout: 90_000,
      use: { ...devices['Desktop Chrome'], baseURL: E2E_DOMAINS.site },
    },
  ],
  webServer: externalBaseURL
    ? undefined
    : [
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
        {
          command: `bun x next dev -p ${E2E_DOMAINS_PORT}`,
          url: `${E2E_DOMAINS.site}/about`,
          env: E2E_DOMAINS_ENV,
          timeout: 180_000,
          reuseExistingServer: !process.env.CI,
        },
      ],
});
