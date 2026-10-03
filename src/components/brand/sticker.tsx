import { cn } from '@/lib/utils';

/**
 * Stiker: pil Shantell Sans bergaris Tinta, sedikit miring, isi aksen tampilan.
 * Maks. 5 kata dan satu stiker per layar (brand book hlm. 58). Bukan untuk admin.
 */
export function Sticker({
  className,
  tilt = -5,
  children,
  ...props
}: React.ComponentProps<'span'> & {
  /** Derajat kemiringan, −4 s.d. −8 (boleh positif kecil untuk variasi). */
  tilt?: number;
}) {
  return (
    <span
      data-slot="sticker"
      style={{ '--pop-rotate': `${tilt}deg` } as React.CSSProperties}
      className={cn(
        'inline-flex w-fit rotate-(--pop-rotate) animate-pop items-center gap-1.5 rounded-full border-[3px] border-ink bg-highlight px-4 py-1.5 font-hand text-base leading-tight font-bold text-highlight-ink shadow-float',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
