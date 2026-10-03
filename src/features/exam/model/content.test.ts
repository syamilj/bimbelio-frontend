import { describe, expect, it } from 'vitest';
import { consolidateMath, contentText, renderContent } from './content';

describe('renderContent', () => {
  it('membuang skrip, event handler, style, dan URL berbahaya', () => {
    const html = renderContent(
      '<p onclick="x()" style="color:red">Halo <script>alert(1)</script><a href="javascript:alert(1)">tautan</a><img src="x" onerror="y()"></p>',
    );
    expect(html).not.toMatch(/script|onclick|onerror|style=|javascript:/);
    expect(html).toContain('Halo');
    expect(html).toContain('<a>tautan</a>');
    expect(html).not.toContain('<img');
  });

  it('gambar http(s) tetap, lazy, dan tautan luar dibuka di tab baru', () => {
    const html = renderContent(
      '<p><img src="https://cdn.test/a.png" alt="grafik"><a href="https://contoh.test">x</a></p>',
    );
    expect(html).toContain('src="https://cdn.test/a.png"');
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it('merender rumus $…$, $$…$$, \\(…\\) menjadi KaTeX', () => {
    const html = renderContent('<p>Nilai $x^2$ dan $$\\frac{1}{2}$$ serta \\(y\\)</p>');
    expect(html.match(/class="katex"/g)?.length).toBe(3);
    expect(html).toContain('katex-display');
    expect(html).not.toContain('$x^2$');
  });

  it('inline content latex BlockNote (data-formula) dirender, "$" tersembunyi dibuang', () => {
    const html = renderContent(
      '<p>Hitung <span data-inline-content-type="latex" data-formula="$\\sqrt{4}$"><span class="hidden">$</span><span></span><span class="hidden">$</span></span> ya</p>',
    );
    expect(html).toContain('class="katex"');
    expect(contentText(html)).not.toMatch(/\$\s*\$/);
  });

  it('blok daftar BlockNote menjadi ul/ol', () => {
    const html = renderContent(
      '<div class="bn-block-group"><div class="bn-block-content" data-content-type="bulletListItem"><p class="bn-inline-content">satu</p></div></div>',
    );
    expect(html).toContain('<ul><li>');
    expect(html).not.toContain('bn-block');
  });

  it('kosong → string kosong', () => {
    expect(renderContent('')).toBe('');
    expect(renderContent(null)).toBe('');
  });

  it('consolidateMath menyatukan $$…$$ yang terpecah paragraf', () => {
    expect(
      consolidateMath('$$\\begin{cases} x=1</p><p>y=2 \\end{cases}$$'),
    ).toBe('$$\\begin{cases} x=1 \\\\ y=2 \\end{cases}$$');
  });
});
