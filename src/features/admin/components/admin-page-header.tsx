import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export type Crumb = { label: string; href?: string };

type AdminPageHeaderProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Tombol aksi utama, rata kanan di desktop. */
  actions?: React.ReactNode;
  /**
   * Jejak halaman di atas judul untuk halaman dalam (detail/ubah). Topbar
   * AdminShell sudah punya breadcrumb dari URL; pakai ini bila butuh label
   * yang lebih jelas (mis. judul try out, bukan "Detail").
   */
  breadcrumbs?: Crumb[];
  /** Tautan kembali ringkas (alternatif breadcrumb). */
  back?: { href: string; label: string };
  /** Info kecil DM Mono di atas judul, mis. `id · 7f3a…`. */
  meta?: React.ReactNode;
  className?: string;
};

/**
 * Kepala halaman admin: judul Parkinsans 28 px, deskripsi, aksi, dan
 * breadcrumb opsional. Merek rendah suara — tanpa Lio/coretan/aksen.
 */
export function AdminPageHeader({
  title,
  description,
  actions,
  breadcrumbs,
  back,
  meta,
  className,
}: AdminPageHeaderProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-1.5">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <AdminBreadcrumbs items={breadcrumbs} />
        )}
        {back && (
          <Link
            href={back.href}
            className="-ml-1 inline-flex w-fit items-center gap-1 rounded-xs px-1 text-sm text-ink-muted hover:text-ink focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
          >
            <ChevronLeft
              className="size-4"
              aria-hidden
            />
            {back.label}
          </Link>
        )}
        {meta && <p className="font-mono text-xs text-ink-subtle">{meta}</p>}
        <h1 className="font-display text-2xl font-bold tracking-display text-balance text-ink">
          {title}
        </h1>
        {description && (
          <p className="max-w-prose text-sm text-ink-muted">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>
      )}
    </header>
  );
}

export function AdminBreadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Jejak halaman">
      <ol className="flex flex-wrap items-center gap-1 text-sm">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li
              key={`${item.label}-${i}`}
              className="flex items-center gap-1"
            >
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="text-ink-muted hover:text-ink"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    last ? 'font-semibold text-ink' : 'text-ink-muted',
                  )}
                  aria-current={last ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
              {!last && (
                <ChevronRight
                  className="size-3.5 text-ink-subtle"
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
