import { cn } from '@/lib/utils';
import { LOGO_PATHS } from './logo-paths';

/**
 * Supergrafis: simbol diperbesar dan terpotong di tepi, senada latar
 * (putih 12% di Biru/Tinta, Biru muda di putih). Hanya hero & kartu besar.
 * Induk wajib `relative overflow-hidden`.
 */
export function Supergraphic({
  className,
  tone = 'on-dark',
}: {
  className?: string;
  tone?: 'on-dark' | 'on-light';
}) {
  const p = LOGO_PATHS.symbol;
  return (
    <svg
      viewBox={p.viewBox}
      aria-hidden
      data-slot="supergraphic"
      className={cn(
        'pointer-events-none absolute -right-[12%] -bottom-[18%] h-[120%] w-auto select-none',
        tone === 'on-dark' ? 'text-white/12' : 'text-brand-soft',
        className,
      )}
    >
      <path
        fill="currentColor"
        d={p.body}
      />
    </svg>
  );
}
