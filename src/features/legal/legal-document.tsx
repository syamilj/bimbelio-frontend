import { CONTACT_CONFIG } from '@/config/contact';

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
    <article className="mx-auto flex max-w-3xl flex-col gap-10 px-4 py-12 sm:px-6 sm:py-16">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl leading-tight font-extrabold tracking-tight text-balance text-ink sm:text-4xl">
          {title}
        </h1>
        <p className="text-sm text-ink-muted">Berlaku sejak {effectiveDate}</p>
        <div className="text-lg text-pretty text-ink-muted">{intro}</div>
      </header>

      <nav
        aria-label="Daftar isi"
        className="rounded-lg border border-line bg-surface p-5"
      >
        <p className="mb-3 text-sm font-bold text-ink">Daftar isi</p>
        <ol className="flex list-decimal flex-col gap-1.5 pl-5 text-sm text-ink-muted">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="hover:text-ink"
              >
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="prose max-w-none prose-slate prose-headings:font-extrabold prose-headings:tracking-tight prose-a:text-brand-strong">
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
