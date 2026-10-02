import { cn } from '@/lib/utils';

type StatCardProps = {
  label: string;
  value: React.ReactNode;
  /** Keterangan kecil di bawah angka, mis. perubahan atau konteks. */
  hint?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
};

export function StatCard({
  label,
  value,
  hint,
  icon,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-md border border-line bg-surface p-4',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 text-sm font-medium text-ink-muted">
        <span>{label}</span>
        {icon && <span className="[&_svg]:size-4">{icon}</span>}
      </div>
      <div className="text-2xl font-extrabold text-ink tabular-nums">
        {value}
      </div>
      {hint && <div className="text-xs text-ink-muted">{hint}</div>}
    </div>
  );
}

export function StatGrid({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('grid grid-cols-2 gap-3 lg:grid-cols-4', className)}
      {...props}
    />
  );
}
