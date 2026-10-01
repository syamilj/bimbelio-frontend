import GithubSlugger from 'github-slugger';
import type { Element, ElementContent, Root, Text } from 'hast';
import { toString } from 'hast-util-to-string';
import katex from 'katex';
import rehypeParse from 'rehype-parse';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import { unified } from 'unified';
import { SKIP, visit } from 'unist-util-visit';

export type TocItem = { id: string; text: string; level: 2 | 3 };

// LaTeX dari editor: $$…$$ dan \[…\] tampil sebagai blok, \(…\) sebaris.
// `$…$` tunggal sengaja tidak diproses (sering muncul sebagai harga "$5").
const MATH = /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\)/g;

const schema = {
  ...defaultSchema,
  // Gambar & tautan dari editor tetap boleh; atribut berbahaya dibuang.
  attributes: {
    ...defaultSchema.attributes,
    '*': [...(defaultSchema.attributes?.['*'] ?? []), 'className'],
  },
  clobberPrefix: '',
};

function renderMath(tex: string, displayMode: boolean) {
  try {
    return katex.renderToString(tex.trim(), {
      displayMode,
      throwOnError: false,
      output: 'html',
    });
  } catch {
    return null;
  }
}

/** Plugin: id heading (sumber tunggal untuk daftar isi), tautan aman, gambar lazy, rumus KaTeX. */
function enhance(toc: TocItem[]) {
  return () => (tree: Root) => {
    const slugger = new GithubSlugger();

    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'h2' || node.tagName === 'h3') {
        const text = toString(node).trim();
        if (!text) return;
        const id = slugger.slug(text);
        node.properties = { ...node.properties, id };
        toc.push({ id, text, level: node.tagName === 'h2' ? 2 : 3 });
      }
      if (node.tagName === 'a') {
        const href = String(node.properties?.href ?? '');
        if (/^https?:\/\//.test(href) && !href.includes('bimbelio.com')) {
          node.properties = {
            ...node.properties,
            target: '_blank',
            rel: ['noopener', 'noreferrer'],
          };
        }
      }
      if (node.tagName === 'img') {
        node.properties = {
          ...node.properties,
          loading: 'lazy',
          decoding: 'async',
        };
      }
    });

    visit(tree, 'text', (node: Text, index, parent) => {
      if (!parent || index === undefined || !MATH.test(node.value)) return;
      MATH.lastIndex = 0;
      const parts: ElementContent[] = [];
      let last = 0;
      for (const match of node.value.matchAll(MATH)) {
        const start = match.index ?? 0;
        if (start > last)
          parts.push({ type: 'text', value: node.value.slice(last, start) });
        const display = match[1] !== undefined || match[2] !== undefined;
        const html = renderMath(
          match[1] ?? match[2] ?? match[3] ?? '',
          display,
        );
        parts.push(
          html
            ? ({ type: 'raw', value: html } as unknown as ElementContent)
            : { type: 'text', value: match[0] },
        );
        last = start + match[0].length;
      }
      if (last < node.value.length)
        parts.push({ type: 'text', value: node.value.slice(last) });
      parent.children.splice(index, 1, ...parts);
      return [SKIP, index + parts.length];
    });
  };
}

/**
 * Ubah HTML artikel (dari editor admin) menjadi HTML aman untuk dirender di
 * server, sekaligus daftar isi dari heading h2/h3.
 */
export async function renderArticle(html: string) {
  const toc: TocItem[] = [];
  const file = await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeSanitize, schema)
    .use(enhance(toc))
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(html ?? '');
  return { html: String(file), toc };
}

/** Perkiraan menit baca dari teks (bukan dari tag HTML). */
export function readingMinutes(html: string) {
  const text = (html ?? '').replace(/<[^>]+>/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
