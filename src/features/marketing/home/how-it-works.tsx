import { Highlight } from '@/components/brand/highlight';
import { SeriesLabel } from '@/components/brand/series-label';
import { Route } from 'lucide-react';
import { MarketingSection } from '../section';

const STEPS = [
  {
    letter: 'A',
    title: 'Kerjakan TO',
    body: 'Tryout dengan format resmi UTBK dan waktu sungguhan. Gratis untuk semua member.',
  },
  {
    letter: 'B',
    title: 'Lihat posisimu',
    body: 'Skor IRT per subtes dan posisimu di antara peserta lain, lengkap dengan pembahasan.',
  },
  {
    letter: 'C',
    title: 'Belajar topik yang paling menaikkan skor',
    body: 'Mulai dari subtes yang paling jauh dari targetmu: materi, kelas live, dan latihan yang pas.',
  },
];

/**
 * Cara kerja = bubble A–B–C (brand book hlm. 55). Bubble terisi berurutan:
 * satu langkah selesai, langkah berikutnya terbuka.
 */
export function HowItWorksSection({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <MarketingSection
      id="cara-kerja"
      accent="pink"
      eyebrow={<SeriesLabel icon={Route}>Cara kerja</SeriesLabel>}
      title={
        <>
          Tiga langkah, satu arah: <Highlight>naik skor.</Highlight>
        </>
      }
      description="Bukan asal banyak latihan. Tiap TO memberi tahu posisimu dan apa yang perlu dikejar berikutnya."
    >
      <div className="relative">
        <span
          aria-hidden
          className="absolute top-12 right-[16%] left-[16%] hidden h-0.5 bg-brand-muted md:block"
        />
        <ol className="relative grid gap-4 md:grid-cols-3 md:gap-6">
          {STEPS.map((step) => (
            <li
              key={step.letter}
              className="relative flex gap-5 rounded-md border border-line bg-surface p-6 md:flex-col md:items-center md:text-center"
            >
              <span
                aria-hidden
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand font-mono text-lg font-medium text-brand-ink ring-8 ring-surface md:-mt-1"
              >
                {step.letter}
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="font-display text-xl leading-tight font-bold tracking-display text-ink">
                  <span className="sr-only">Langkah {step.letter}: </span>
                  {step.title}
                </h3>
                <p className="text-ink-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      {children}
    </MarketingSection>
  );
}
