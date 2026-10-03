import { expect, test } from '../fixtures';

// Katalog sistem desain merek 2.1 (BRAND-2.1.md) — penjaga regresi token & komponen.
test.describe('styleguide merek 2.1', () => {
  test('semua komponen merek tampil dan lolos axe', async ({
    page,
    expectAccessible,
  }) => {
    await page.goto('/styleguide');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Lembar Jawaban 2.1' }),
    ).toBeVisible();
    await expect(page.locator('[data-slot="logo"]').first()).toBeVisible();
    await expect(page.locator('[data-slot="lio"]')).toHaveCount(13); // 10 ekspresi + 2 di kartu Biru + 1 di EmptyState
    await expect(
      page.getByRole('img', { name: /Profil skor per subtes/ }),
    ).toBeVisible();
    await expect(
      page.getByText('Perkiraan dari data tryout').first(),
    ).toBeVisible();
    await expectAccessible(page);
  });

  test('token Biru Bimbelio terpasang di tombol utama', async ({ page }) => {
    await page.goto('/styleguide');
    await expect(page.getByRole('button', { name: 'Ikut tryout' })).toHaveCSS(
      'background-color',
      'rgb(0, 102, 255)',
    );
  });
});
