import { cn } from '@/lib/utils';

/**
 * Label kepala DM Mono huruf kecil: "rapor TO #08 · data contoh".
 * Untuk sumber, konteks, dan label data — bukan kalimat.
 */
export function MonoLabel({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="mono-label"
      className={cn(
        'font-mono text-xs font-medium tracking-normal text-ink-muted lowercase in-data-[surface]:text-on-dark-muted',
        className,
      )}
      {...props}
    />
  );
}
