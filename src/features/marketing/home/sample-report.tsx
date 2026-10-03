import { Disclaimer } from '@/components/brand/disclaimer';
import { Highlight } from '@/components/brand/highlight';
import { MonoLabel } from '@/components/brand/mono-label';
import { SeriesLabel } from '@/components/brand/series-label';
import { BubbleBars } from '@/components/charts/bubble/bubble-bars';
import { BubbleSpread } from '@/components/charts/bubble/bubble-spread';
import {
  normalBins,
  percentileBelow,
} from '@/components/charts/bubble/geometry';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowUp, ChartLine } from 'lucide-react';
import Link from 'next/link';
import { SITE_CONTAINER, sectionTitleClass } from '../section';

// Data contoh (brand book hlm. 101–102) — bukan data siswa sungguhan.
const SCORE = 614;
const RISE = 13;
const SUBTES = [
  { label: 'LBI', value: 669 },
  { label: 'PU', value: 655 },
  { label: 'PBM', value: 641 },
  { label: 'PPU', value: 612 },
  { label: 'LBE', value: 603 },
  { label: 'PM', value: 571 },
  { label: 'PK', value: 548 },
];
const BINS = normalBins(400, 800, 25, 560, 70);
const FOCUS = [
  {
    letter: 'A',
    code: 'PK',
    text: 'Paling jauh dari rata-ratamu. Mulai dari 10 soal perbandingan.',
  },
  {
    letter: 'B',
    code: 'PM',
    text: 'Bacaan matematika: latihan baca tabel dan grafik.',
  },
  { letter: 'C', code: 'LBE', text: 'Kosakata akademik, 15 menit sehari.' },
];

/** Contoh rapor TO di permukaan Tinta + lime: angka raksasa, profil subtes, sebaran. */
export function SampleReportSection() {
  const above = percentileBelow(BINS, SCORE);
  return (
    <section
      id="rapor"
      data-surface="ink"
      aria-labelledby="rapor-judul"
      className="relative py-16 sm:py-24"
    >
      <div
        className={cn(
          SITE_CONTAINER,
          'grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16',
        )}
      >
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <SeriesLabel
              icon={ChartLine}
              tone="light"
            >
              Rapor TO
            </SeriesLabel>
            <h2
              id="rapor-judul"
              className={sectionTitleClass}
            >
              Angkanya jujur,{' '}
              <Highlight tone="text">langkahnya jelas.</Highlight>
            </h2>
            <p className="max-w-[52ch] text-lg text-on-dark-muted">
              Setelah TO, kamu dapat skor IRT per subtes, posisimu di antara
              peserta, dan tiga hal yang paling layak dikejar minggu ini.
            </p>
          </div>

          <figure className="flex flex-col gap-2">
            <MonoLabel>rapor TO #08 · data contoh</MonoLabel>
            <p className="font-display text-[clamp(5rem,14vw,10rem)] leading-[0.85] font-extrabold tracking-score text-highlight tabular-nums">
              <span className="sr-only">Skor IRT rata-rata </span>
              {SCORE}
            </p>
            <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-1 text-base">
              <span>
                di atas <strong className="font-bold">{above}%</strong> peserta
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-highlight">
                <ArrowUp
                  className="size-4"
                  strokeWidth={3}
                  aria-hidden
                />
                naik {RISE} dari TO #07
              </span>
            </figcaption>
          </figure>

          <div className="flex flex-col gap-4 rounded-md bg-white p-5 text-ink sm:p-6">
            <p className="font-display text-lg font-bold tracking-display">
              Fokus minggu ini
            </p>
            <ol className="flex flex-col gap-3">
              {FOCUS.map((f) => (
                <li
                  key={f.letter}
                  className="flex items-start gap-3"
                >
                  <span
                    aria-hidden
                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand font-mono text-sm font-medium text-brand-ink"
                  >
                    {f.letter}
                  </span>
                  <p className="pt-1 text-sm text-ink-muted">
                    <span className="font-mono font-medium text-ink">
                      {f.code}
                    </span>{' '}
                    · {f.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
          <Button
            asChild
            size="lg"
            variant="accent"
            className="self-start"
          >
            <Link href="/tryout">Ikut tryout, dapat rapormu</Link>
          </Button>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-5 rounded-lg border border-on-dark-line p-5 sm:p-7">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-display text-lg font-bold tracking-display">
                Profil 7 subtes
              </p>
              <MonoLabel>1 bubble = 100 poin</MonoLabel>
            </div>
            <BubbleBars
              data={SUBTES}
              focus="PK"
              surface="dark"
              title="Profil skor per subtes, data contoh"
            />
          </div>
          <div className="flex flex-col gap-5 rounded-lg border border-on-dark-line p-5 sm:p-7">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-display text-lg font-bold tracking-display">
                Posisimu di antara peserta
              </p>
              <MonoLabel>1 bubble = 2% peserta</MonoLabel>
            </div>
            <BubbleSpread
              bins={BINS}
              you={SCORE}
              surface="dark"
              title="Posisimu di antara peserta, data contoh"
            />
          </div>
          <Disclaimer className="text-sm">
            Data contoh. Skor dan posisi di rapor adalah perkiraan dari data
            tryout, bukan jaminan hasil seleksi.
          </Disclaimer>
        </div>
      </div>
    </section>
  );
}
