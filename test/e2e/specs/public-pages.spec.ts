import { expect, test } from '../fixtures';

test.describe('beranda', () => {
  test('HTML server berisi h1, seksi utama, dan FAQ terstruktur', async ({
    request,
  }) => {
    const html = await (await request.get('/')).text();
    expect(html).toMatch(
      /<h1[^>]*>Bimbel AI untuk SNBT, Ujian Mandiri, dan Kedinasan<\/h1>/,
    );
    expect(html).toContain('id="timeline"');
    expect(html).toContain('"@type":"FAQPage"');
    expect(html).toContain('Blueprint UTBK');
  });

  test('FAQ bisa dibuka dengan keyboard dan halaman lolos axe', async ({
    page,
    expectAccessible,
  }) => {
    await page.goto('/');
    const question = page.getByText('Bisa cicil pembayaran nggak?');
    await question.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByText(/opsi cicilan 0%/)).toBeVisible();
    await expectAccessible(page);
  });

  test('statistik persaingan memakai label yang dapat dibaca pembaca layar', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(
      page.getByRole('img', { name: '6 dari 20 pendaftar diterima' }),
    ).toBeVisible();
  });
});

test.describe('paket & checkout', () => {
  test('filter koin hanya menampilkan paket koin', async ({ page }) => {
    await page.goto('/price');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Paket belajar' }),
    ).toBeVisible();
    await expect(page.getByText('2 paket')).toBeVisible();
    await page.getByRole('tab', { name: 'Koin' }).click();
    await expect(page.getByText('1 paket')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Sprint Try Out 10x' }),
    ).toBeVisible();
  });

  test('pengunjung yang belum masuk diminta login dulu saat membeli', async ({
    page,
  }) => {
    await page.goto('/price');
    await page.getByRole('button', { name: 'Beli paket' }).first().click();
    await expect(
      page.getByRole('dialog', { name: 'Masuk ke Bimbelio' }),
    ).toBeVisible();
  });

  test('setelah login, ?checkout= membuka checkout paket yang dipilih', async ({
    page,
    loginAs,
  }) => {
    await loginAs('student');
    await page.goto('/price?checkout=plan-utbk');
    const dialog = page.getByRole('dialog', { name: 'Checkout' });
    await expect(dialog).toContainText('Blueprint UTBK');
    await expect(page).toHaveURL('/price');
  });

  test('checkout dengan voucher mengarah ke invoice', async ({
    page,
    loginAs,
  }) => {
    await loginAs('student');
    await page.goto('/price');
    await page.getByRole('button', { name: 'Beli paket' }).first().click();
    const dialog = page.getByRole('dialog', { name: 'Checkout' });
    await dialog.getByLabel('Kode voucher (opsional)').fill('HEMAT20');
    await dialog.getByRole('button', { name: 'Pakai' }).click();
    await expect(dialog.getByText(/Voucher dipakai, hemat/)).toBeVisible();
    const invoice = page.waitForRequest('**/__invoice');
    await dialog.getByRole('button', { name: 'Lanjut ke pembayaran' }).click();
    await invoice;
  });

  test('detail paket dirender server; slug tak dikenal → 404', async ({
    page,
    request,
  }) => {
    const res = await page.goto('/price/blueprint-utbk');
    expect(res?.status()).toBe(200);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Blueprint UTBK' }),
    ).toBeVisible();
    await expect(page.getByText('Bisa dicicil 3×')).toBeVisible();
    expect((await request.get('/price/tidak-ada')).status()).toBe(404);
  });
});

test.describe('blog', () => {
  test('artikel dirender server lengkap dengan daftar isi dan rumus', async ({
    request,
    page,
  }) => {
    const html = await (
      await request.get('/blog/strategi-penalaran-umum')
    ).text();
    expect(html).toContain('id="kenali-tipe-soal"');
    expect(html).toContain('href="#kenali-tipe-soal"');
    expect(html).toContain('class="katex"');
    expect(html).toContain('"@type":"BlogPosting"');

    await page.goto('/blog');
    await page.getByRole('button', { name: '#mandiri' }).click();
    await expect(page.getByText('1 artikel')).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Jadwal UM UGM' }),
    ).toBeVisible();
  });

  test('artikel tak dikenal → 404', async ({ request }) => {
    expect((await request.get('/blog/tidak-ada')).status()).toBe(404);
  });
});

test.describe('URL berbahasa Inggris & pengalihan', () => {
  test('URL lama dialihkan permanen', async ({ request }) => {
    const beasiswa = await request.get('/beasiswa', { maxRedirects: 0 });
    expect(beasiswa.status()).toBe(308);
    expect(beasiswa.headers().location).toBe('/scholarship');

    const plans = await request.get('/utbk/user/paket-belajar', {
      maxRedirects: 0,
    });
    expect(plans.status()).toBe(308);
    expect(plans.headers().location).toBe('/utbk/user/plans');

    const tutor = await request.get('/tutor', { maxRedirects: 0 });
    expect(tutor.headers().location).toBe('/#tutors');
  });

  test('tautan pendek dialihkan langsung oleh server', async ({ request }) => {
    const res = await request.get('/l/wa-grup', { maxRedirects: 0 });
    expect(res.status()).toBe(307);
    expect(res.headers().location).toMatch(/\/l\/wa-grup$/);
  });

  test('sitemap memuat artikel & paket, tanpa rute mati', async ({
    request,
  }) => {
    const xml = await (await request.get('/sitemap.xml')).text();
    expect(xml).toContain('/blog/strategi-penalaran-umum');
    expect(xml).toContain('/price/blueprint-utbk');
    expect(xml).toContain('/scholarship');
    expect(xml).not.toMatch(/\/(discord|program|tutor|beasiswa)</);
  });
});

test.describe('halaman link', () => {
  test('password dikirim lewat form (POST), tidak muncul di URL', async ({
    page,
  }) => {
    await page.goto('/link/rahasia');
    await page.getByPlaceholder('Masukkan Password').fill('salah');
    await page.getByRole('button', { name: 'Buka Halaman' }).click();
    await expect(
      page.getByRole('alert').filter({ hasText: 'Password salah' }),
    ).toBeVisible();
    await expect(page).toHaveURL('/link/rahasia?error=password');

    await page.getByPlaceholder('Masukkan Password').fill('kunci123');
    await page.getByRole('button', { name: 'Buka Halaman' }).click();
    await expect(
      page.getByRole('heading', { name: 'Halaman Khusus Peserta' }),
    ).toBeVisible();
    expect(page.url()).not.toContain('kunci123');
  });
});

test.describe('halaman legal', () => {
  for (const [path, title] of [
    ['/privacy', 'Kebijakan Privasi'],
    ['/terms', 'Syarat dan Ketentuan'],
  ]) {
    test(`${path} dirender server, ditautkan dari footer, dan lolos axe`, async ({
      page,
      request,
      expectAccessible,
    }) => {
      const html = await (await request.get(path)).text();
      expect(html).toContain(`>${title}</h1>`);
      await page.goto('/');
      await page
        .getByRole('navigation', { name: 'Legal' })
        .getByRole('link', { name: new RegExp(title, 'i') })
        .click();
      await expect(page).toHaveURL(path);
      // Muat langsung: progress bar navigasi klien bukan bagian halaman.
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
      await expectAccessible(page);
    });
  }
});
