import { expect, test } from '../fixtures';

test.describe('shell aplikasi siswa', () => {
  test.beforeEach(async ({ loginAs }) => {
    await loginAs('student');
  });

  test('sidebar desktop: menu utama, status aktif, dan ciutkan tersimpan', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'sidebar desktop');
    await page.goto('/utbk/user/bimboard');
    const nav = page.getByRole('navigation', { name: 'Navigasi aplikasi' });
    await expect(nav.getByRole('link', { name: 'BimBoard' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(nav.getByRole('link', { name: /Try Out/ })).toHaveAttribute(
      'href',
      '/utbk/user/bimarena/try-out',
    );
    await expect(nav.getByRole('link', { name: 'BimPrediction' })).toHaveCount(
      0,
    );

    // Merek 2.1: item aktif = bubble Biru terisi + teks Tinta 600.
    const active = nav.getByRole('link', { name: 'BimBoard' });
    await expect(active).toHaveCSS('color', 'rgb(11, 23, 54)');
    await expect(active).toHaveCSS('font-weight', '600');
    await expect(active.locator('span[aria-hidden]').first()).toHaveCSS(
      'background-color',
      'rgb(0, 102, 255)',
    );
    await expect(
      nav
        .getByRole('link', { name: 'BimCourse' })
        .locator('span[aria-hidden]')
        .first(),
    ).not.toHaveCSS('background-color', 'rgb(0, 102, 255)');
    // Logo sidebar: titik i memakai warna program track.
    await expect(
      page.locator('aside [data-slot="logo"] path').nth(1),
    ).toHaveAttribute('fill', 'var(--program)');

    await page.getByRole('button', { name: 'Ciutkan sidebar' }).click();
    await page.reload();
    await expect(
      page.getByRole('button', { name: 'Lebarkan sidebar' }),
    ).toBeVisible();
  });

  test('mobile: tab bar & menu', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'tab bar mobile');
    await page.goto('/utbk/user/bimboard');
    const tabs = page.getByRole('navigation', { name: 'Navigasi cepat' });
    await expect(tabs.getByRole('link', { name: 'Beranda' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(
      tabs
        .getByRole('link', { name: 'Beranda' })
        .locator('span[aria-hidden]')
        .first(),
    ).toHaveCSS('background-color', 'rgb(0, 102, 255)');
    await tabs.getByRole('button', { name: 'Menu' }).click();
    await expect(
      page
        .getByRole('dialog', { name: 'Menu' })
        .getByRole('link', { name: 'BimInsight' }),
    ).toBeVisible();
  });

  test('pencarian materi membuka ruang belajar', async ({ page, isMobile }) => {
    await page.goto('/utbk/user/bimboard');
    if (isMobile) {
      await page.getByRole('button', { name: 'Buka menu' }).first().click();
      await page
        .getByRole('dialog', { name: 'Menu' })
        .getByRole('button', { name: /Cari materi/ })
        .click();
    } else {
      await page.getByRole('button', { name: /Cari materi/ }).click();
    }
    const search = page
      .getByRole('dialog')
      .filter({ has: page.getByRole('combobox') });
    await search.getByRole('combobox').fill('kuadrat');
    await search.getByRole('option', { name: /Persamaan kuadrat/ }).click();
    await expect(page).toHaveURL(
      '/utbk/user/bimcourse/mat/study?sub=l1&tab=chat',
      {
        timeout: 30_000,
      },
    );
  });

  test('notifikasi menampilkan jumlah belum dibaca dan tautan detail', async ({
    page,
  }) => {
    await page.goto('/utbk/user/bimboard');
    await page
      .getByRole('button', { name: /Notifikasi, 1 belum dibaca/ })
      .click();
    await expect(page.getByText('Try out minggu ini dibuka')).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Lihat detail' }),
    ).toHaveAttribute('href', '/utbk/user/bimarena/try-out');
  });

  test('akun gratis diarahkan ke paket belajar', async ({ page, isMobile }) => {
    test.skip(isMobile, 'menu paket di topbar desktop');
    await page.goto('/utbk/user/bimboard');
    await page.getByRole('button', { name: /Gratis/ }).click();
    await page
      .getByRole('dialog')
      .getByRole('button', { name: 'Lihat paket belajar' })
      .click();
    await expect(page).toHaveURL('/utbk/user/plans', {
      timeout: 30_000,
    });
  });

  test('shell siswa lolos axe (di luar isi halaman lama)', async ({
    page,
    expectAccessible,
  }) => {
    await page.goto('/utbk/user/bimboard');
    await expect(
      page.getByRole('button', { name: /Notifikasi/ }),
    ).toBeVisible();
    await expectAccessible(page, { exclude: ['main'] });
  });

  test('halaman ujian tampil tanpa navigasi aplikasi', async ({ page }) => {
    await page.goto('/utbk/user/bimarena/try-out/tryout-uji');
    await expect(
      page.getByRole('navigation', { name: 'Navigasi aplikasi' }),
    ).toHaveCount(0);
    await expect(
      page.getByRole('navigation', { name: 'Navigasi cepat' }),
    ).toHaveCount(0);
  });
});

test.describe('shell panel admin', () => {
  test('admin melihat menu sesuai role, tanpa kategori khusus super admin', async ({
    page,
    loginAs,
    isMobile,
  }) => {
    test.skip(isMobile, 'sidebar desktop');
    await loginAs('admin');
    await page.goto('/utbk/admin/voucher');
    const nav = page.getByRole('navigation', { name: 'Navigasi admin' });
    await expect(nav.getByRole('link', { name: 'Voucher' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(
      nav.getByRole('link', { name: 'Dashboard' }),
    ).not.toHaveAttribute('aria-current', 'page');
    await expect(
      nav.getByRole('link', { name: 'Kategori try out' }),
    ).toHaveCount(0);
    await expect(
      page.getByRole('navigation', { name: 'Breadcrumb' }),
    ).toContainText('Voucher');
    // Admin "rendah suara": bubble aktif sama, tanpa Lio/coretan/stiker.
    await expect(
      nav
        .getByRole('link', { name: 'Voucher' })
        .locator('span[aria-hidden]')
        .first(),
    ).toHaveCSS('background-color', 'rgb(0, 102, 255)');
    await expect(
      page.locator(
        'aside [data-slot="lio"], aside [data-slot="scribble"], aside [data-slot="sticker"], header [data-slot="lio"]',
      ),
    ).toHaveCount(0);
  });

  test('shell admin lolos axe (di luar isi halaman lama)', async ({
    page,
    loginAs,
    expectAccessible,
  }) => {
    await loginAs('admin');
    await page.goto('/utbk/admin/voucher');
    await expect(
      page.getByRole('navigation', { name: 'Breadcrumb' }),
    ).toBeVisible();
    await expectAccessible(page, { exclude: ['main'] });
  });

  test('finance hanya melihat menu transaksi', async ({
    page,
    loginAs,
    isMobile,
  }) => {
    test.skip(isMobile, 'sidebar desktop');
    await loginAs('finance');
    await page.goto('/utbk/admin/transaction');
    const links = page
      .getByRole('navigation', { name: 'Navigasi admin' })
      .getByRole('link');
    await expect(links).toHaveCount(1);
    await expect(links.first()).toHaveText('Transaksi');
  });

  test('finance yang membuka seksi admin lain lewat URL diarahkan ke transaksi', async ({
    page,
    loginAs,
  }) => {
    await loginAs('finance');
    for (const path of [
      '/utbk/admin',
      '/utbk/admin/voucher',
      '/utbk/admin/login',
    ]) {
      await page.goto(path);
      await expect(page).toHaveURL('/utbk/admin/transaction');
    }
  });
});
