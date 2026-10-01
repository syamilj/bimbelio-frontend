import { expect, test } from '../fixtures';

test.describe('shell situs publik', () => {
  test('header desktop: navigasi, dropdown, dan tautan kalender per jenis', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'navigasi desktop');
    await page.goto('/about');
    const nav = page
      .getByRole('navigation')
      .filter({ has: page.getByRole('link', { name: /Program/ }) })
      .first();
    await expect(nav.getByRole('link', { name: /Program/ })).toHaveAttribute(
      'href',
      '/price',
    );

    await page.getByRole('button', { name: 'Kalender' }).hover();
    await expect(page.getByRole('link', { name: 'Webinar' })).toHaveAttribute(
      'href',
      '/calendar?type=webinar',
    );

    await page.getByRole('button', { name: 'Fitur' }).hover();
    await page.getByRole('link', { name: /Try out online/ }).click();
    await expect(page).toHaveURL(/\/#tryout$/);
  });

  test('menu mobile terbuka dan berisi tautan yang benar', async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, 'menu mobile');
    await page.goto('/about');
    await page.getByRole('button', { name: 'Buka menu navigasi' }).click();
    const sheet = page.getByRole('dialog', { name: 'Menu' });
    await expect(sheet).toBeVisible();
    await expect(
      sheet.getByRole('link', { name: 'Live class' }),
    ).toHaveAttribute('href', '/calendar?type=live-class');
    await sheet.getByRole('link', { name: 'Blog' }).click();
    await expect(page).toHaveURL('/blog');
    await expect(sheet).toBeHidden();
  });

  test('tombol Masuk membuka modal login Google', async ({ page }) => {
    await page.goto('/about');
    await page.getByRole('button', { name: 'Masuk', exact: true }).click();
    await expect(page.getByText('Selamat Datang!')).toBeVisible();
  });

  test('pengguna yang sudah masuk melihat tautan dashboard ke track terakhir', async ({
    page,
    loginAs,
    isMobile,
  }) => {
    test.skip(isMobile, 'tombol dashboard hanya di header desktop');
    await loginAs('student');
    await page.addInitScript(() =>
      localStorage.setItem('website_sub_category_id', 'utbk'),
    );
    await page.goto('/about');
    await expect(
      page.getByRole('link', { name: 'Ke dashboard' }),
    ).toHaveAttribute('href', '/utbk/user/bimboard');
  });

  test('dialog konsultasi dari tombol mengambang memakai nomor resmi', async ({
    page,
  }) => {
    await page.goto('/about');
    await page.getByRole('button', { name: 'Buka menu konsultasi' }).click();
    const dialog = page.getByRole('dialog', { name: 'Tanya tim Bimbelio' });
    await expect(
      dialog.getByRole('link', { name: /Chat di WhatsApp/ }),
    ).toHaveAttribute('href', /wa\.me\/6285128056771/);
    await expect(dialog.getByRole('link', { name: /Telepon/ })).toHaveAttribute(
      'href',
      'tel:+6285161112223',
    );
  });

  test('footer: kontak konsisten, tahun berjalan, tanpa tautan kosong', async ({
    page,
  }) => {
    await page.goto('/about');
    const footer = page.getByRole('contentinfo');
    await expect(
      footer.getByRole('link', { name: /WhatsApp \+62 851-2805-6771/ }),
    ).toHaveAttribute('href', /wa\.me\/6285128056771/);
    await expect(footer).toContainText(`© ${new Date().getFullYear()}`);
    await expect(footer.locator('a[href="#"]')).toHaveCount(0);
  });

  test('halaman publik di-render server dengan konten, bukan spinner', async ({
    request,
  }) => {
    // Bila provider sesi/kuota memblokir render, HTML hanya berisi pemuat.
    for (const path of ['/about', '/blog', '/price']) {
      const html = await (await request.get(path)).text();
      expect(html, path).toContain('<header');
      expect(html, path).toContain('<footer');
    }
  });

  test('halaman publik lolos pemeriksaan aksesibilitas header & footer', async ({
    page,
    expectAccessible,
  }) => {
    await page.goto('/about');
    await expectAccessible(page, { exclude: ['main'] });
  });
});
