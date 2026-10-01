import { cn } from '@/lib/utils';

/**
 * Indikator memuat: lima bubble yang terisi bergantian, seperti mengisi LJK.
 * Hormati prefers-reduced-motion lewat aturan global di tokens.css.
 */
export function BubbleLoader({
  className,
  label = 'Memuat…',
}: {
  className?: string;
  label?: string;
}) {
  return (
    <span
      role="status"
      aria-live="polite"
      className={cn('inline-flex items-center gap-1.5', className)}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          aria-hidden
          className="size-2.5 animate-bubble-fill rounded-full border-[1.5px] border-line-strong"
          style={{ animationDelay: `${i * 120}ms` }}
        />
      ))}
      <span className="sr-only">{label}</span>
    </span>
  );
}
