import { cn } from '@/lib/utils';
import { LOGO_PATHS, type LogoLayout } from './logo-paths';

// Logo Bimbelio 2.1. Path diambil apa adanya dari paket merek; jangan menyusun
// ulang simbol & tulisan atau mengetik "Bimbelio" dengan font sebagai logo.
//
// Warna (PANDUAN-MEREK §2):
//   latar terang  → tone="brand" (Biru, titik i ikut Biru / warna program)
//   latar Biru, Tinta, foto → tone="white" (titik i = aksen tampilan)
//   cetak satu warna → tone="ink"
// Ukuran minimum: horizontal 96px, tulisan 64px, simbol 16px.

type Tone = 'brand' | 'white' | 'ink' | 'current';

/**
 * Warna titik i (bubble LJK):
 * - `same`: sewarna logo (default di latar terang; lime di putih kontrasnya 1,3)
 * - `accent`: lime/pink aksen tampilan (latar Biru/Tinta)
 * - `program`: warna program track (UTBK Biru, Kedinasan merah, …)
 */
type Dot = 'same' | 'accent' | 'program';

const TONE_CLASS: Record<Tone, string> = {
  brand: 'text-brand',
  white: 'text-white',
  ink: 'text-ink',
  current: '',
};

const DOT_FILL: Record<Exclude<Dot, 'same'>, string> = {
  accent: 'var(--accent)',
  program: 'var(--program)',
};

type LogoProps = {
  layout?: LogoLayout;
  tone?: Tone;
  dot?: Dot;
  className?: string;
  /** Label aksesibel. Kosongkan bila logo hanya dekorasi di samping teks. */
  title?: string;
};

export function Logo({
  layout = 'horizontal',
  tone = 'brand',
  dot,
  className,
  title = 'Bimbelio',
}: LogoProps) {
  const p = LOGO_PATHS[layout];
  const dotMode: Dot = dot ?? (tone === 'white' ? 'accent' : 'same');
  return (
    <svg
      viewBox={p.viewBox}
      role={title ? 'img' : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      data-slot="logo"
      className={cn(
        'shrink-0',
        layout === 'horizontal' && 'h-8 w-auto',
        layout === 'wordmark' && 'h-6 w-auto',
        layout === 'vertical' && 'h-24 w-auto',
        layout === 'symbol' && 'size-8',
        TONE_CLASS[tone],
        className,
      )}
    >
      <path
        fill="currentColor"
        d={p.body}
      />
      {p.dots && (
        <path
          fill={dotMode === 'same' ? 'currentColor' : DOT_FILL[dotMode]}
          d={p.dots}
        />
      )}
    </svg>
  );
}

/** Simbol gajah saja (favicon, avatar, ruang kecil). Warna = currentColor. */
export function BrandMark({
  className,
  title = 'Bimbelio',
}: {
  className?: string;
  title?: string;
}) {
  return (
    <Logo
      layout="symbol"
      tone="current"
      title={title}
      className={cn('size-7', className)}
    />
  );
}
