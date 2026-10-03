import { MonoLabel } from '@/components/brand/mono-label';
import { CONTACT_CONFIG } from '@/config/contact';
import { PROSE_CLASS } from '@/features/marketing/prose';
import { cn } from '@/lib/utils';

export type LegalSection = {
  id: string;
  title: string;
  body: React.ReactNode;
};

/** Kerangka halaman legal: judul, tanggal berlaku, daftar isi, dan isi pasal. */
export function LegalDocument({
  title,
  intro,
  effectiveDate,
  sections,
}: {
  title: string;
  intro: React.ReactNode;
  /** Tanggal berlaku dalam format tampilan, mis. "2 Oktober 2026". */
  effectiveDate: string;
  sections: LegalSection[];
}) {
  return (
    <article className="mx-auto flex w-full max-w-[75rem] flex-col gap-10 px-5 py-12 sm:px-8 sm:py-16">
      <header className="flex max-w-[70ch] flex-col gap-4">
        <MonoLabel>dokumen legal · berlaku sejak {effectiveDate}</MonoLabel>
        <h1 className="font-display text-4xl leading-[1.05] font-extrabold tracking-hero text-balance text-ink sm:text-5xl">
          {title}
        </h1>
        <div className="text-lg text-pretty text-ink-muted">{intro}</div>
      </header>

      <nav
        aria-label="Daftar isi"
        className="max-w-[70ch] rounded-md border border-line bg-surface p-5"
      >
        <p className="mb-3 font-mono text-xs font-medium text-ink-muted lowercase">
          Daftar isi
        </p>
        <ol className="flex list-decimal flex-col gap-1.5 pl-5 text-sm text-ink marker:font-mono marker:text-ink-muted">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="rounded-xs hover:text-brand-strong focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
              >
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className={cn(PROSE_CLASS, 'max-w-[70ch]')}>
        {sections.map((s, i) => (
          <section
            key={s.id}
            id={s.id}
            className="scroll-mt-24"
          >
            <h2>
              {i + 1}. {s.title}
            </h2>
            {s.body}
          </section>
        ))}
      </div>
    </article>
  );
}

/** Blok kontak resmi untuk pasal "Hubungi kami". */
export function LegalContact() {
  return (
    <address className="not-italic">
      {CONTACT_CONFIG.address.map((line) => (
        <span
          key={line}
          className="block"
        >
          {line}
        </span>
      ))}
      <span className="block">
        Email:{' '}
        <a href={`mailto:${CONTACT_CONFIG.email}`}>{CONTACT_CONFIG.email}</a>
      </span>
      <span className="block">WhatsApp: {CONTACT_CONFIG.whatsapp.display}</span>
    </address>
  );
}
