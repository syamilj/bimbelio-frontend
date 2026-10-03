import { cn } from '@/lib/utils';

/** Lebar konten situs: 1200px, margin 120 di desktop 1440 dan 20 di HP (brand book hlm. 103). */
export const SITE_CONTAINER = 'mx-auto w-full max-w-[75rem] px-5 sm:px-8';

/** Judul seksi marketing (Parkinsans). Dipakai juga oleh seksi yang menyusun header sendiri. */
export const sectionTitleClass =
  'font-display text-3xl leading-[1.2] font-bold tracking-display text-balance sm:text-4xl';

/** Kerangka seksi halaman marketing: lebar konten, jarak, dan judul yang konsisten. */
export function MarketingSection({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  tone = 'paper',
  accent,
  headerAction,
  headingLevel = 2,
}: {
  /** Seksi pertama halaman memakai h1. */
  headingLevel?: 1 | 2;
  id?: string;
  /** Label kecil di atas judul: `SeriesLabel` atau `MonoLabel`. */
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  /** paper/surface = terang; ink/brand = permukaan gelap (teks putih). */
  tone?: 'paper' | 'surface' | 'ink' | 'brand';
  /** Aksen seksi. Satu per seksi, bergantian antar seksi. Pink dilarang di Biru. */
  accent?: 'lime' | 'pink';
  headerAction?: React.ReactNode;
}) {
  const headingId = id ? `${id}-judul` : undefined;
  const Heading = headingLevel === 1 ? 'h1' : 'h2';
  const dark = tone === 'ink' || tone === 'brand';
  return (
    <section
      id={id}
      aria-labelledby={title ? headingId : undefined}
      data-surface={dark ? tone : undefined}
      data-accent={accent === 'pink' && tone !== 'brand' ? 'pink' : undefined}
      className={cn(
        'relative py-16 sm:py-24',
        tone === 'surface' && 'bg-surface',
        className,
      )}
    >
      <div className={cn(SITE_CONTAINER, 'flex flex-col gap-10 sm:gap-12')}>
        {title && (
          <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex max-w-2xl flex-col gap-4">
              {eyebrow}
              <Heading
                id={headingId}
                className={cn(sectionTitleClass, !dark && 'text-ink')}
              >
                {title}
              </Heading>
              {description && (
                <p
                  className={cn(
                    'max-w-[60ch] text-lg text-pretty',
                    dark ? 'text-on-dark-muted' : 'text-ink-muted',
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
