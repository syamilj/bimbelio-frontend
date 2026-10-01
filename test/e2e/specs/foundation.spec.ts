import { expect, test } from '../fixtures';

test.describe('fondasi', () => {
  test('beranda dapat dibuka dengan judul situs', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/Bimbelio/);
  });

  test('URL tak dikenal menampilkan halaman 404 yang baru', async ({
    page,
    expectAccessible,
  }) => {
    const response = await page.goto('/halaman-yang-tidak-ada/sama-sekali');
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole('heading', { name: 'Halaman tidak ditemukan' }),
    ).toBeVisible();
    await expectAccessible(page);
    await page.getByRole('link', { name: 'Ke beranda' }).click();
    await expect(page).toHaveURL('/');
  });

  test('area siswa tanpa sesi dialihkan ke beranda', async ({ page }) => {
    await page.goto('/utbk/user/bimboard');
    await expect(page).toHaveURL('/');
  });

  test('siswa tidak bisa membuka area admin', async ({ page, loginAs }) => {
    await loginAs('student');
    await page.goto('/utbk/admin/voucher');
    await expect(page).toHaveURL('/');
  });

  test('admin biasa tidak bisa membuka kategori (khusus super admin)', async ({
    page,
    loginAs,
  }) => {
    await loginAs('admin');
    await page.goto('/utbk/admin/category');
    await expect(page).toHaveURL(/\/404$/);
  });

  test('token tidak valid dialihkan ke beranda', async ({
    page,
    context,
    baseURL,
  }) => {
    await context.addCookies([
      { name: 'token', value: 'token-palsu', url: baseURL! },
    ]);
    await page.goto('/utbk/user/bimboard');
    await expect(page).toHaveURL('/');
  });
});

test('URL satu segmen yang bukan track menampilkan 404, bukan pemilih track', async ({
  page,
}) => {
  await page.goto('/salah-ketik');
  await expect(
    page.getByRole('heading', { name: 'Halaman tidak ditemukan' }),
  ).toBeVisible();
  await expect(page.getByText('Pilih jalur ujian')).toHaveCount(0);
});
