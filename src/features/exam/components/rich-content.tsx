'use client';

import { cn } from '@/lib/utils';
import 'katex/dist/katex.min.css';
import { useMemo } from 'react';
import { renderContent } from '../model/content';

/** Tipografi konten soal/opsi/pembahasan: lebar baca, tenang, token saja. */
const CONTENT =
  'min-w-0 break-words text-ink [&_a]:text-brand-strong [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-brand-muted [&_blockquote]:pl-4 [&_code]:rounded-xs [&_code]:bg-paper [&_code]:px-1 [&_code]:font-mono [&_code]:text-sm [&_h1]:font-display [&_h1]:text-xl [&_h1]:font-bold [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-bold [&_h3]:text-base [&_h3]:font-semibold [&_img]:my-3 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-sm [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-2 [&_table]:my-3 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_td]:border [&_td]:border-line [&_td]:p-2 [&_th]:border [&_th]:border-line [&_th]:bg-paper [&_th]:p-2 [&_th]:text-left [&_ul]:list-disc [&_ul]:pl-6 [&_[data-text-alignment=center]]:text-center [&_[data-text-alignment=right]]:text-right [&_.katex-display]:my-3 [&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden [&>*:first-child]:mt-0 [&>*:last-child]:mb-0';

type Props = {
  html: string | null | undefined;
  className?: string;
  /** Teks pengganti bila konten kosong. */
  fallback?: string;
  as?: 'div' | 'span';
};

/** Konten HTML editor (soal, opsi, pembahasan) yang sudah disanitasi + KaTeX. */
export function RichContent({ html, className, fallback, as = 'div' }: Props) {
  const rendered = useMemo(() => renderContent(html), [html]);
  const Tag = as;
  if (!rendered) {
    return fallback ? (
      <Tag className={cn('text-ink-muted', className)}>{fallback}</Tag>
    ) : null;
  }
  return (
    <Tag
      className={cn(CONTENT, className)}
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  );
}
