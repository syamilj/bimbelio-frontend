import { cn } from '@/lib/utils';

type PageHeaderProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Tombol aksi utama halaman, rata kanan di desktop. */
  actions?: React.ReactNode;
  /** Mis. breadcrumb atau tautan kembali, di atas judul. */
  leading?: React.ReactNode;
  className?: string;
};

export function PageHeader({
  title,
  description,
  actions,
  leading,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-1.5">
        {leading}
        <h1 className="font-display text-2xl font-bold tracking-display text-balance text-ink sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="max-w-prose text-sm text-ink-muted sm:text-base">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>
      )}
    </header>
  );
}

export function SectionHeader({
  title,
  description,
  actions,
  className,
}: Omit<PageHeaderProps, 'leading'>) {
  return (
    <div className={cn('flex items-end justify-between gap-4', className)}>
      <div className="flex min-w-0 flex-col gap-0.5">
        <h2 className="font-display text-lg font-bold tracking-display text-ink">
          {title}
        </h2>
        {description && <p className="text-sm text-ink-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </div>
  );
}
