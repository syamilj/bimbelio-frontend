import { Lio, type LioExpression } from '@/components/brand/lio';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

type EmptyStateProps = {
  icon?: LucideIcon;
  /**
   * Lio menggantikan ikon di momen kosong yang ramah (belum ada TO, belum ada
   * catatan). Jangan dipakai di admin.
   */
  lio?: LioExpression;
  title: string;
  description?: React.ReactNode;
  /** Ajakan bertindak — layar kosong adalah undangan untuk mulai. */
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  icon: Icon,
  lio,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-line-strong px-6 py-12 text-center',
        className,
      )}
    >
      {lio ? (
        <Lio
          expression={lio}
          size="m"
        />
      ) : Icon ? (
        <span className="flex size-11 items-center justify-center rounded-full bg-paper text-ink-muted">
          <Icon
            className="size-5"
            aria-hidden
          />
        </span>
      ) : null}
      <div className="flex max-w-sm flex-col gap-1">
        <p className="font-display text-lg font-bold tracking-display text-ink">
          {title}
        </p>
        {description && <p className="text-sm text-ink-muted">{description}</p>}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
