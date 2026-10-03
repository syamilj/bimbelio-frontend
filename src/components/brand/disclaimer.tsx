import { cn } from '@/lib/utils';

export const SCORE_DISCLAIMER =
  'Perkiraan dari data tryout, bukan jaminan hasil seleksi.';

/**
 * Penafian wajib di bawah setiap skor IRT, posisi, atau peluang lolos
 * (nilai merek "Jujur soal posisi"). Jangan disembunyikan di tooltip.
 */
export function Disclaimer({
  className,
  children = SCORE_DISCLAIMER,
  ...props
}: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="disclaimer"
      className={cn(
        'text-xs leading-relaxed text-ink-muted in-data-[surface]:text-on-dark-muted',
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}
