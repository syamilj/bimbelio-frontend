import { expect, test } from '../fixtures';

// Alur utama mesin ujian: mulai TO → jawab → ragu → istirahat → subtes 2 →
// selesai → rapor + pembahasan. Mock berkeadaan per tryoutId (lihat
// test/e2e/mock-api/exam.ts), jadi setiap tes memakai id unik.

const freshId = (project: string) =>
  `to-e2e-${project}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

test.describe('mesin ujian try out', () => {
  test.beforeEach(async ({ loginAs }) => {
    await loginAs('student');
  });

  test('mulai → jawab → ragu → istirahat → selesai → rapor', async ({
    page,
    expectAccessible,
  }, testInfo) => {
    test.slow();
    const id = freshId(testInfo.project.name);
    await page.goto(`/utbk/user/bimarena/try-out/${id}`);

    // Belum mulai
    await expect(
      page.getByRole('heading', { name: 'TO UTBK E2E', level: 1 }),
    ).toBeVisible();
    await expectAccessible(page);
    const start = page.getByRole('button', { name: 'Mulai subtes 1' });
    await expect(start).toBeDisabled();
    await page.getByRole('checkbox').check();
    await start.click();

    // Ruang ujian subtes 1
    const soal = (n: number) =>
      page.getByRole('heading', { name: new RegExp(`^Soal ${n}`) });
    await expect(soal(1)).toBeVisible();
    await expect(page.locator('.katex').first()).toBeVisible();
    await page.keyboard.press('a');
    await expect(page.getByRole('radio', { name: /Opsi A/ })).toBeChecked();
    await page.keyboard.press('r');
    await expect(
      page.getByRole('button', { name: 'Ditandai ragu' }),
    ).toHaveAttribute('aria-pressed', 'true');
    await page.keyboard.press('n');
    await expect(soal(2)).toBeVisible();
    await page.locator('label', { hasText: 'Pilihan B' }).click();
    await expect(page.getByRole('radio', { name: /Opsi B/ })).toBeChecked();
    await expect(page.getByText('Tersimpan', { exact: true })).toBeVisible({
      timeout: 10_000,
    });
    await expectAccessible(page);

    await page.keyboard.press('n');
    await expect(soal(3)).toBeVisible();
    await page.getByRole('button', { name: 'Kumpulkan', exact: true }).last().click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('1 soal belum dijawab')).toBeVisible();
    await expect(dialog.getByText('1 soal masih ragu')).toBeVisible();
    await dialog.getByRole('button', { name: 'Kumpulkan jawaban' }).click();

    // Istirahat (permukaan Tinta)
    await expect(
      page.getByRole('heading', { name: /Tarik napas dulu/ }),
    ).toBeVisible();
    await expect(page.getByRole('timer')).toBeVisible();
    await expectAccessible(page);
    await page.getByRole('button', { name: 'Lanjut sekarang' }).click();

    // Subtes 2 → kumpulkan
    await expect(page.getByText('Pengetahuan Kuantitatif').first()).toBeVisible();
    await expect(soal(1)).toBeVisible();
    await page.keyboard.press('a');
    await page.keyboard.press('n');
    await page.keyboard.press('n');
    await page.getByRole('button', { name: 'Kumpulkan', exact: true }).last().click();
    await page
      .getByRole('dialog')
      .getByRole('button', { name: 'Kumpulkan jawaban' })
      .click();

    // Rapor
    await expect(page.getByRole('tab', { name: 'Rapor' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(page.getByText(/di atas\s*77%\s*peserta/)).toBeVisible();
    await expect(page.getByText('▲ +40')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Bagikan rapor' })).toBeVisible();
    await expect(
      page.getByRole('img', { name: /Profil skor per subtes/ }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: /^Fokus A/ })).toBeVisible();
    await expect(
      page.getByText('Perkiraan dari data tryout, bukan jaminan hasil seleksi.').first(),
    ).toBeVisible();
    await expectAccessible(page);

    // Pembahasan: status selalu berlabel + ikon
    await page.getByRole('tab', { name: 'Pembahasan' }).click();
    await expect(page).toHaveURL(/tab=review/);
    await expect(page.getByText('Benar', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Pembahasan soal 1.')).toBeVisible();
    await expectAccessible(page);
  });

  test('membuka ulang di tengah sesi memulihkan jawaban', async ({ page }, testInfo) => {
    const id = freshId(testInfo.project.name);
    await page.goto(`/utbk/user/bimarena/try-out/${id}`);
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: 'Mulai subtes 1' }).click();
    await expect(page.getByRole('heading', { name: /^Soal 1/ })).toBeVisible();
    await page.keyboard.press('c');
    await expect(page.getByText('Tersimpan', { exact: true })).toBeVisible({
      timeout: 10_000,
    });
    // Tanpa cadangan lokal → harus pulih dari draft server.
    await page.evaluate(() => localStorage.clear());
    page.on('dialog', (d) => d.accept());
    await page.reload();
    await expect(page.getByRole('radio', { name: /Opsi C/ })).toBeChecked();
  });

  test('tryout tidak ditemukan', async ({ page }) => {
    await page.goto('/utbk/user/bimarena/try-out/tidak-ada');
    await expect(
      page.getByRole('heading', { name: 'Try out tidak ditemukan' }),
    ).toBeVisible();
  });
});
