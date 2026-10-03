import { expect, test } from '../fixtures';

test.describe('beranda', () => {
  test('HTML server berisi h1, seksi utama, dan FAQ terstruktur', async ({
    request,
  }) => {
    const html = await (await request.get('/')).text();
    expect(html).toMatch(/<h1[^>]*>Selesai TO, langsung tahu jalan ke/);
    expect(html).toContain('id="timeline"');
    expect(html).toContain('"@type":"FAQPage"');
    expect(html).toContain('Blueprint UTBK');
    // Klaim & data yang sudah dikonfirmasi pemilik tetap tampil (PLAN.md §8.6).
    expect(html).toContain('Rp1.499.000');
    expect(html).toContain('garansi 100% uang kembali dalam 7 hari');
  });

  test('sembilan seksi merek 2.1 berurutan, footer di permukaan Tinta', async ({
    page,
  }) => {
    await page.goto('/');
    const ids = await page
      .locator('main > section[id]')
      .evaluateAll((els) => els.map((el) => el.id));
    expect(ids).toEqual([
      'cara-kerja',
      'rapor',
      'bimbot',
      'live-learning',
      'statistics',
      'pricing',
      'about',
      'faq',
    ]);
    // Hero Biru penuh dengan Lio, rapor Tinta, footer Tinta.
    await expect(page.locator('main > section').first()).toHaveAttribute(
      'data-surface',
      'brand',
    );
    await expect(
      page.locator('main > section').first().locator('[data-slot="lio"]'),
    ).toHaveAttribute('data-expression', 'ambis');
    await expect(page.locator('#rapor')).toHaveAttribute('data-surface', 'ink');
    await expect(page.getByRole('contentinfo')).toHaveAttribute(
      'data-surface',
      'ink',
    );
  });

  test('hero: CTA lime ke tryout dan contoh rapor berlabel data contoh + penafian', async ({
    page,
  }) => {
    await page.goto('/');
    const hero = page.locator('main > section').first();
    await expect(hero.getByRole('link', { name: 'Ikut tryout' })).toHaveCSS(
      'background-color',
      'rgb(198, 244, 50)',
    );
    await hero.getByRole('link', { name: 'Lihat contoh rapor' }).click();
    await expect(page).toHaveURL(/#rapor$/);
    const rapor = page.locator('#rapor');
    await expect(rapor.getByText('rapor TO #08 · data contoh')).toBeVisible();
    await expect(
      rapor.getByRole('img', { name: /Profil skor per subtes/ }),
    ).toBeVisible();
    await expect(
      rapor.getByRole('img', { name: /Posisimu di antara peserta/ }),
    ).toBeVisible();
    await expect(rapor.getByText(/bukan jaminan hasil seleksi/)).toBeVisible();
  });

  test('tryout & kelas live terdekat tampil dari API, daftar meminta login', async ({
    page,
  }) => {
    await page.goto('/');
    const tryouts = page.locator('#tryout');
    await expect(
      tryouts.getByRole('heading', { name: 'Tryout UTBK #09' }),
    ).toBeVisible();
    await expect(
      page
        .locator('#live-learning')
        .getByText('Bedah PK: perbandingan & persentase'),
    ).toBeVisible();
    await tryouts
      .getByRole('button', { name: 'Daftar gratis' })
      .first()
      .click();
    await expect(
      page.getByRole('dialog', { name: 'Masuk ke Bimbelio' }),
    ).toBeVisible();
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

test.describe('kalender bubble', () => {
  test('tryout = bubble terisi, kelas live = cincin, agenda bulan ini', async ({
    page,
    expectAccessible,
  }) => {
    await page.goto('/calendar');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Jadwal event Bimbelio' }),
    ).toBeVisible();
    const table = page.getByRole('table');
    await expect(table).toBeVisible();
    await expect(table.getByText(/Tryout: Tryout UTBK #09/)).toHaveCount(1);
    await expect(table.getByText(/Kelas live: Bedah PK/)).toHaveCount(1);
    await expect(
      page
        .getByRole('region', { name: 'Agenda bulan ini' })
        .getByText('Tryout UTBK #09'),
    ).toBeVisible();
    // Bulan berikutnya bisa dibuka dan kembali.
    await page.getByRole('button', { name: 'Bulan berikutnya' }).click();
    await page.getByRole('button', { name: 'Bulan sebelumnya' }).click();
    await expect(table.getByText(/Tryout: Tryout UTBK #09/)).toHaveCount(1);
    await expectAccessible(page);
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
    await page.getByPlaceholder('Masukkan password').fill('salah');
    await page.getByRole('button', { name: 'Buka halaman' }).click();
    await expect(
      page.getByRole('alert').filter({ hasText: 'Password salah' }),
    ).toBeVisible();
    await expect(page).toHaveURL('/link/rahasia?error=password');

    await page.getByPlaceholder('Masukkan password').fill('kunci123');
    await page.getByRole('button', { name: 'Buka halaman' }).click();
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

test.describe('OG dinamis', () => {
  test('/api/og menghasilkan PNG 1200×630', async ({ request }) => {
    const res = await request.get(
      '/api/og?title=Blueprint%20UTBK&value=614&label=rapor&tone=ink',
    );
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toBe('image/png');
    const png = await res.body();
    // Header IHDR: lebar & tinggi big-endian di byte 16–23.
    expect(png.readUInt32BE(16)).toBe(1200);
    expect(png.readUInt32BE(20)).toBe(630);
  });

  test('paket tanpa gambar memakai OG dinamis', async ({ request }) => {
    const html = await (await request.get('/price/blueprint-utbk')).text();
    expect(html).toMatch(
      /property="og:image" content="[^"]*\/api\/og\?title=Blueprint/,
    );
  });
});

test.describe('aksesibilitas halaman publik (merek 2.1)', () => {
  for (const path of [
    '/',
    '/price',
    '/price/blueprint-utbk',
    '/blog',
    '/blog/strategi-penalaran-umum',
    '/tryout',
    '/about',
    '/scholarship',
    '/link/komunitas',
    '/link/rahasia',
    '/halaman-yang-tidak-ada',
  ]) {
    test(`${path} lolos axe`, async ({ page, expectAccessible }) => {
      await page.goto(path);
      await expect(page.locator('h1').first()).toBeVisible();
      await expectAccessible(page);
    });
  }
});
