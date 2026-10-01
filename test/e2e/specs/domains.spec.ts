import type { BrowserContext } from '@playwright/test';

import { E2E_DOMAINS } from '../env';
import { expect, test } from '../fixtures';

// Mode produksi: bimbelio.com (situs), app.bimbelio.com (siswa), admin.bimbelio.com.
// Di sini: localhost / app.localhost / admin.localhost pada server dev kedua.
const { site, app, admin } = E2E_DOMAINS;

/** Cookie token di ketiga host (produksi memakai satu cookie `.bimbelio.com`). */
const login = (context: BrowserContext, role: string, track?: string) =>
  context.addCookies(
    [site, app, admin].flatMap((url) => [
      { name: 'token', value: `e2e-${role}`, url },
      ...(track ? [{ name: 'bimbelio_track', value: track, url }] : []),
    ]),
  );

test('URL lama area siswa dialihkan permanen ke subdomain app', async ({
  page,
  context,
}) => {
  await login(context, 'student');
  const res = await page.request.get(`${site}/utbk/user/bimarena/try-out?x=1`, {
    maxRedirects: 0,
  });
  expect(res.status()).toBe(308);
  expect(res.headers().location).toBe(`${app}/utbk/bimarena/try-out?x=1`);

  await page.goto(`${site}/utbk/user/bimboard`);
  await expect(page).toHaveURL(`${app}/utbk/bimboard`);
  await expect(
    page.getByRole('navigation', { name: 'Navigasi aplikasi' }),
  ).toBeVisible();
});

test('app: path publik, link sidebar, status aktif, dan noindex', async ({
  page,
  context,
}) => {
  await login(context, 'student');
  const res = await page.goto(`${app}/utbk/bimboard`);
  expect(res?.headers()['x-robots-tag']).toContain('noindex');

  const nav = page.getByRole('navigation', { name: 'Navigasi aplikasi' });
  await expect(nav.getByRole('link', { name: 'BimBoard' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  const tryout = nav.getByRole('link', { name: /Try Out/ });
  await expect(tryout).toHaveAttribute('href', `${app}/utbk/bimarena/try-out`);
  await tryout.click();
  // Server dev mengompilasi rute saat pertama dibuka.
  await expect(page).toHaveURL(`${app}/utbk/bimarena/try-out`, {
    timeout: 45_000,
  });
  await expect(tryout).toHaveAttribute('aria-current', 'page');
});

test('app: beranda ke dashboard track terakhir; halaman marketing ke situs', async ({
  page,
  context,
}) => {
  await login(context, 'student', 'utbk');
  await page.goto(`${app}/`);
  await expect(page).toHaveURL(`${app}/utbk/bimboard`);

  const res = await page.request.get(`${app}/price`, { maxRedirects: 0 });
  expect(res.status()).toBe(308);
  expect(res.headers().location).toBe(`${site}/price`);
});

test('app tanpa sesi diarahkan ke beranda situs', async ({ page }) => {
  await page.goto(`${app}/utbk/bimboard`);
  await expect(page).toHaveURL(`${site}/`);
});

test('admin: dashboard & menu di subdomain admin', async ({
  page,
  context,
}) => {
  await login(context, 'admin');
  await page.goto(`${admin}/utbk/voucher`);
  const nav = page.getByRole('navigation', { name: 'Navigasi admin' });
  await expect(nav.getByRole('link', { name: 'Voucher' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await expect(nav.getByRole('link', { name: 'Dashboard' })).toHaveAttribute(
    'href',
    `${admin}/utbk`,
  );
});

test('siswa tidak bisa membuka subdomain admin', async ({ page, context }) => {
  await login(context, 'student');
  await page.goto(`${admin}/utbk/voucher`);
  await expect(page).toHaveURL(`${site}/`);
});
