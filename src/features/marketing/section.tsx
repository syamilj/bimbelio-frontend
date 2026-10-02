import { cn } from '@/lib/utils';

/** Kerangka seksi halaman marketing: lebar konten, jarak, dan judul yang konsisten. */
export function MarketingSection({
  id,
  title,
  description,
  children,
  className,
  tone = 'paper',
  headerAction,
  headingLevel = 2,
}: {
  /** Seksi pertama halaman memakai h1. */
  headingLevel?: 1 | 2;
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  tone?: 'paper' | 'surface' | 'ink';
  headerAction?: React.ReactNode;
}) {
  const headingId = id ? `${id}-judul` : undefined;
  const Heading = headingLevel === 1 ? 'h1' : 'h2';
  return (
    <section
      id={id}
      aria-labelledby={title ? headingId : undefined}
      className={cn(
        'py-16 sm:py-20',
        tone === 'surface' && 'border-y border-line bg-surface',
        tone === 'ink' && 'bg-ink text-surface',
        className,
      )}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 sm:px-6">
        {title && (
          <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex max-w-2xl flex-col gap-3">
              <Heading
                id={headingId}
                className={cn(
                  'text-2xl leading-tight font-extrabold tracking-tight text-balance sm:text-3xl',
                  tone === 'ink' ? 'text-surface' : 'text-ink',
                )}
              >
                {title}
              </Heading>
              {description && (
                <p
                  className={cn(
                    'text-lg text-pretty',
                    tone === 'ink' ? 'text-surface/75' : 'text-ink-muted',
                  )}
                >
                  {description}
                </p>
              )}
            </div>
            {headerAction && <div className="shrink-0">{headerAction}</div>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
