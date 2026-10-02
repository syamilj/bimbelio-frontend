import AxeBuilder from '@axe-core/playwright';
import { test as base, expect, type Page } from '@playwright/test';

import { MOCK_API } from './env';
const ALLOWED_HOSTS = new Set(['127.0.0.1', 'localhost']);

type Role = 'student' | 'premium' | 'admin' | 'superadmin';

type Fixtures = {
  /** Masuk sebagai pengguna fiktif dengan menanam cookie token. */
  loginAs: (role: Role) => Promise<void>;
  /** Jalankan axe dan gagal bila ada pelanggaran serius/kritis. */
  expectAccessible: (
    page: Page,
    opts?: { exclude?: string[] },
  ) => Promise<void>;
};

export const test = base.extend<Fixtures>({
  context: async ({ context }, use) => {
    // Blokir semua host di luar lokal (pixel, Google, CDN, dan TERUTAMA backend
    // produksi) — tes tidak boleh pernah menyentuh layanan sungguhan.
    await context.route('**/*', (route) => {
      const { hostname } = new URL(route.request().url());
      return ALLOWED_HOSTS.has(hostname)
        ? route.continue()
        : route.abort('blockedbyclient');
    });
    await use(context);
  },

  loginAs: async ({ context, baseURL }, use) => {
    await use(async (role) => {
      await context.addCookies([
        { name: 'token', value: `e2e-${role}`, url: baseURL! },
      ]);
    });
  },

  // eslint-disable-next-line no-empty-pattern -- Playwright mewajibkan pola objek
  expectAccessible: async ({}, use) => {
    await use(async (page, opts) => {
      let builder = new AxeBuilder({ page }).withTags([
        'wcag2a',
        'wcag2aa',
        'wcag21aa',
      ]);
      for (const selector of opts?.exclude ?? [])
        builder = builder.exclude(selector);
      const { violations } = await builder.analyze();
      const serious = violations.filter(
        (v) => v.impact === 'serious' || v.impact === 'critical',
      );
      expect(
        serious.map((v) => `${v.id}: ${v.help} (${v.nodes.length} elemen)`),
      ).toEqual([]);
    });
  },
});

export { expect };

/** Daftar endpoint yang dipanggil tetapi belum di-mock (untuk debugging). */
export async function unhandledApiCalls(): Promise<string[]> {
  return (await fetch(`${MOCK_API}/__unhandled`)).json();
}
