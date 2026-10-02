import { describe, expect, it } from 'vitest';
import { readingMinutes, renderArticle } from './render';

describe('renderArticle', () => {
  it('memberi id pada heading dan membangun daftar isi dari sumber yang sama', async () => {
    const { html, toc } = await renderArticle(
      '<h2>Strategi <strong>PPU</strong> - Eliminasi</h2><p>isi</p><h3>Contoh soal</h3><h2>Strategi PPU - Eliminasi</h2>',
    );
    expect(toc).toEqual([
      {
        id: 'strategi-ppu---eliminasi',
        text: 'Strategi PPU - Eliminasi',
        level: 2,
      },
      { id: 'contoh-soal', text: 'Contoh soal', level: 3 },
      {
        id: 'strategi-ppu---eliminasi-1',
        text: 'Strategi PPU - Eliminasi',
        level: 2,
      },
    ]);
    for (const item of toc) expect(html).toContain(`id="${item.id}"`);
  });

  it('membuang skrip dan atribut berbahaya', async () => {
    const { html } = await renderArticle(
      '<p onclick="alert(1)">aman</p><script>alert(2)</script><img src="x" onerror="alert(3)">',
    );
    expect(html).not.toMatch(/script|onclick|onerror|alert/);
    expect(html).toContain('aman');
  });

  it('tautan luar dibuka di tab baru', async () => {
    const { html } = await renderArticle(
      '<p><a href="https://contoh.id">luar</a> <a href="/price">dalam</a></p>',
    );
    expect(html).toContain(
      '<a href="https://contoh.id" target="_blank" rel="noopener noreferrer">luar</a>',
    );
    expect(html).toContain('<a href="/price">dalam</a>');
  });

  it('merender rumus LaTeX blok dan sebaris, tapi tidak $ tunggal', async () => {
    const { html } = await renderArticle(
      '<p>Luas \\(\\pi r^2\\) dan $$x^2+1$$ harga $5 saja</p>',
    );
    expect(html).toContain('class="katex"');
    expect(html).toContain('katex-display');
    expect(html).toContain('harga $5 saja');
  });
});

it('readingMinutes menghitung kata, bukan tag', () => {
  const html = `<p>${'kata '.repeat(400)}</p>`;
  expect(readingMinutes(html)).toBe(2);
  expect(readingMinutes('')).toBe(1);
});
