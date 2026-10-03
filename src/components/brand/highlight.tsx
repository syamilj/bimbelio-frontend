import { cn } from '@/lib/utils';

/**
 * Sorotan: aksen di BALIK teks Tinta, untuk satu kata/frasa kunci per tampilan.
 * Ini cara satu-satunya memakai lime/pink di latar putih (lime sebagai teks
 * di putih kontrasnya 1,3). Di permukaan Biru/Tinta pakai `tone="text"`.
 */
export function Highlight({
  className,
  tone = 'mark',
  ...props
}: React.ComponentProps<'mark'> & { tone?: 'mark' | 'text' }) {
  return (
    <mark
      data-slot="highlight"
      className={cn(
        tone === 'mark' &&
          'rounded-[0.18em] bg-highlight box-decoration-clone px-[0.12em] text-highlight-ink',
        tone === 'text' && 'bg-transparent text-highlight',
        className,
      )}
      {...props}
    />
  );
}
