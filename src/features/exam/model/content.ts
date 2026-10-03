import katex from 'katex';

/**
 * Renderer soal ringan: HTML dari editor BlockNote → HTML aman + rumus KaTeX.
 * Menggantikan instance BlockNote penuh per soal & per opsi.
 *
 * Format data (dari editor admin, `blocksToFullHTML`):
 * - Blok: `<div class="bn-block-content" data-content-type="paragraph|heading|
 *   bulletListItem|numberedListItem|image|table|…">` berisi `<p>`/`<h1>`/`<img>`.
 * - Rumus: teks `$…$`, `$$…$$`, `\(…\)`, `\[…\]`, ATAU inline content
 *   `<span data-inline-content-type="latex" data-formula="$x^2$">`.
 * - HTML biasa (soal lama/impor) juga didukung.
 *
 * Sanitasi berbasis daftar izin (tag & atribut); skrip, event handler, style,
 * dan URL selain http(s)/data:image dibuang. Butuh DOMParser (browser/happy-dom).
 */

const ALLOWED_TAGS = new Set([
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'del', 'sub', 'sup', 'span',
  'div', 'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
  'img', 'a', 'code', 'pre', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'figure', 'figcaption', 'hr', 'mark', 'caption', 'colgroup', 'col',
]);

/** Tag yang dibuang beserta isinya. */
const DROP_TAGS = new Set([
  'script', 'style', 'iframe', 'object', 'embed', 'noscript', 'template',
  'svg', 'math', 'form', 'input', 'button', 'textarea', 'select', 'link', 'meta',
]);

const ALLOWED_ATTRS: Record<string, string[]> = {
  '*': ['data-text-alignment', 'data-level'],
  img: ['src', 'alt', 'width', 'height'],
  a: ['href', 'title'],
  td: ['colspan', 'rowspan'],
  th: ['colspan', 'rowspan'],
  ol: ['start'],
};

const SAFE_URL = /^(https?:|mailto:)/i;
const SAFE_IMG = /^(https?:|data:image\/(png|jpe?g|gif|webp);)/i;

// Rumus di teks, sama dengan editor (latex-helper): $$…$$, \[…\], \(…\), $…$.
const MATH =
  /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\)|\$([^$\n]+?)\$/g;

function tex(formula: string, display: boolean) {
  let raw = formula.trim();
  if (raw.startsWith('$$') && raw.endsWith('$$') && raw.length > 4) {
    raw = raw.slice(2, -2);
    display = true;
  } else if (raw.startsWith('$') && raw.endsWith('$') && raw.length > 2) {
    raw = raw.slice(1, -1);
  }
  try {
    return katex.renderToString(raw, {
      displayMode: display,
      throwOnError: false,
      output: 'html',
      strict: 'ignore',
    });
  } catch {
    return null;
  }
}

/**
 * `$$…$$` yang terpecah lintas paragraf/baris (editor menyisipkan `<p>`/`<br>`
 * di dalam lingkungan `\begin{cases}`…) disatukan dulu, baris jadi `\\`.
 */
export function consolidateMath(html: string) {
  return html.replace(/\$\$([\s\S]*?)\$\$/g, (match, body: string) => {
    if (!/<[^>]+>/.test(body) && !body.includes('\n')) return match;
    const lines = body
      .replace(/<\/p>/gi, '\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/?(div|span|section|td|tr|th|table)[^>]*>/gi, '\n')
      .replace(/<\/?[a-z][^>]*>/gi, '')
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length <= 1) return `$$${lines.join('')}$$`;
    let out = lines[0];
    for (const line of lines.slice(1)) {
      const prev = out.trimEnd();
      const noBreak =
        prev.endsWith('\\\\') ||
        line.startsWith('\\end{') ||
        /\\begin\{[^}]+\}(\[[^\]]*\])?$/.test(prev);
      out += noBreak ? ` ${line}` : ` \\\\ ${line}`;
    }
    return `$$${out}$$`;
  });
}

function mathFragment(doc: Document, html: string) {
  const span = doc.createElement('span');
  span.setAttribute('data-math', '');
  span.innerHTML = html;
  return span;
}

/** Ganti rumus di node teks dengan KaTeX (KaTeX = HTML tepercaya). */
function renderMathInText(doc: Document, root: Element) {
  const walker = doc.createTreeWalker(root, 4 /* NodeFilter.SHOW_TEXT */);
  const targets: Text[] = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const text = n as Text;
    if (text.parentElement?.closest('[data-math], code, pre')) continue;
    MATH.lastIndex = 0;
    if (MATH.test(text.data)) targets.push(text);
  }
  for (const text of targets) {
    const value = text.data;
    const frag = doc.createDocumentFragment();
    let last = 0;
    MATH.lastIndex = 0;
    for (const m of value.matchAll(MATH)) {
      const start = m.index ?? 0;
      if (start > last) frag.append(value.slice(last, start));
      const display = m[1] !== undefined || m[2] !== undefined;
      const html = tex(m[1] ?? m[2] ?? m[3] ?? m[4] ?? '', display);
      frag.append(html ? mathFragment(doc, html) : m[0]);
      last = start + m[0].length;
    }
    if (last < value.length) frag.append(value.slice(last));
    text.replaceWith(frag);
  }
}

function sanitizeAttrs(el: Element) {
  const tag = el.tagName.toLowerCase();
  const allowed = new Set([
    ...(ALLOWED_ATTRS['*'] ?? []),
    ...(ALLOWED_ATTRS[tag] ?? []),
  ]);
  for (const attr of Array.from(el.attributes)) {
    if (!allowed.has(attr.name)) el.removeAttribute(attr.name);
  }
  if (tag === 'a') {
    const href = el.getAttribute('href') ?? '';
    if (!SAFE_URL.test(href)) el.removeAttribute('href');
    else {
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    }
  }
  if (tag === 'img') {
    const src = el.getAttribute('src') ?? '';
    if (!SAFE_IMG.test(src)) {
      el.remove();
      return;
    }
    el.setAttribute('loading', 'lazy');
    el.setAttribute('decoding', 'async');
    if (!el.hasAttribute('alt')) el.setAttribute('alt', '');
  }
}

/** Blok daftar BlockNote → `<ul>/<ol><li>` agar poin/nomor tampil. */
function convertListBlocks(doc: Document, root: Element) {
  for (const type of ['bulletListItem', 'numberedListItem'] as const) {
    for (const block of Array.from(
      root.querySelectorAll(`[data-content-type="${type}"]`),
    )) {
      const list = doc.createElement(type === 'bulletListItem' ? 'ul' : 'ol');
      const index = block.getAttribute('data-index');
      if (type === 'numberedListItem' && index) list.setAttribute('start', index);
      const li = doc.createElement('li');
      while (block.firstChild) li.append(block.firstChild);
      list.append(li);
      block.replaceWith(list);
    }
  }
}

function walk(doc: Document, node: Element) {
  for (const child of Array.from(node.children)) {
    const tag = child.tagName.toLowerCase();

    if (child.getAttribute('data-inline-content-type') === 'latex') {
      const formula = child.getAttribute('data-formula') ?? '';
      const display = child.getAttribute('data-display') === 'true';
      const html = formula ? tex(formula, display) : null;
      child.replaceWith(html ? mathFragment(doc, html) : formula);
      continue;
    }
    if (DROP_TAGS.has(tag)) {
      child.remove();
      continue;
    }
    walk(doc, child);
    if (!ALLOWED_TAGS.has(tag)) {
      child.replaceWith(...Array.from(child.childNodes));
      continue;
    }
    sanitizeAttrs(child);
  }
}

const cache = new Map<string, string>();
const CACHE_LIMIT = 400;

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** HTML aman siap `dangerouslySetInnerHTML`. Hasil di-cache per string. */
export function renderContent(html: string | null | undefined): string {
  const source = (html ?? '').trim();
  if (!source) return '';
  const hit = cache.get(source);
  if (hit !== undefined) return hit;

  if (typeof DOMParser === 'undefined') return escapeHtml(source);

  const doc = new DOMParser().parseFromString(
    `<!doctype html><body><div id="root">${consolidateMath(source)}</div></body>`,
    'text/html',
  );
  const root = doc.getElementById('root');
  if (!root) return '';
  convertListBlocks(doc, root);
  // Rumus inline-content diganti dulu sebelum sanitasi membuang atributnya.
  walk(doc, root);
  renderMathInText(doc, root);
  // Paragraf kosong dari editor (spasi antar-blok) dibuang.
  for (const p of Array.from(root.querySelectorAll('p'))) {
    if (!p.textContent?.trim() && !p.querySelector('img,[data-math]')) p.remove();
  }
  const out = root.innerHTML.trim();

  if (cache.size >= CACHE_LIMIT) cache.clear();
  cache.set(source, out);
  return out;
}

/** Teks polos (untuk label aksesibel / kartu bagikan). */
export function contentText(html: string | null | undefined) {
  return (html ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}
