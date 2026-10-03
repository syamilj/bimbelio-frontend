import { Highlight } from '@/components/brand/highlight';
import { MonoLabel } from '@/components/brand/mono-label';
import { SeriesLabel } from '@/components/brand/series-label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Landmark } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { MarketingSection } from '../section';

// Data pendaftar & daya tampung dari materi Bimbelio sebelumnya (PLAN.md §8.6).
const EXAMS = [
  {
    name: 'SNBT',
    logo: '/hero/LOGO_SNBT.webp',
    applicants: 785_058,
    accepted: 231_104,
  },
  {
    name: 'SIMAK UI',
    logo: '/hero/LOGO_PTN_UI.webp',
    applicants: 31_289,
    accepted: 4_200,
  },
  {
    name: 'UM UGM',
    logo: '/hero/LOGO_PTN_UGM.webp',
    applicants: 34_627,
    accepted: 3_670,
  },
  {
    name: 'PKN STAN',
    logo: '/hero/LOGO_KEDINASAN_STAN.webp',
    applicants: 100_000,
    accepted: 500,
  },
];

const SLOTS = 20;
const fmt = (n: number) => n.toLocaleString('id-ID');
const pct = (r: number) =>
  `${(r * 100).toLocaleString('id-ID', { maximumFractionDigits: 1 })}%`;

/**
 * Persaingan per ujian. Setiap baris = 20 pendaftar; bubble terisi = yang lolos.
 * (Bubble dipakai sesuai maknanya: kursi yang berhasil "diisi".)
 */
export function CompetitionSection() {
  return (
    <MarketingSection
      id="statistics"
      tone="surface"
      accent="pink"
      eyebrow={<SeriesLabel icon={Landmark}>Persaingan kampus</SeriesLabel>}
      title={
        <>
          Kursinya sedikit, <Highlight>pesaingnya ratusan ribu.</Highlight>
        </>
      }
      description="Tiap baris di bawah mewakili 20 pendaftar. Bubble terisi adalah yang diterima. Persiapan yang tepat membuatmu jadi salah satunya."
      headerAction={
        <Button
          asChild
          variant="outline"
        >
          <Link href="/price">Mulai persiapan</Link>
        </Button>
      }
    >
      <ul className="grid gap-4 md:grid-cols-2">
        {EXAMS.map((exam) => {
          const ratio = exam.accepted / exam.applicants;
          const filled = Math.round(ratio * SLOTS);
          return (
            <li
              key={exam.name}
              className="flex flex-col gap-5 rounded-md border border-line bg-paper p-5 sm:p-6"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-surface">
                  <Image
                    src={exam.logo}
                    alt=""
                    width={36}
                    height={36}
                    className="size-9 object-contain"
                  />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <h3 className="font-display text-lg font-bold tracking-display text-ink">
                    {exam.name}
                  </h3>
                  <MonoLabel className="tabular-nums">
                    {fmt(exam.applicants)} pendaftar · {fmt(exam.accepted)}{' '}
                    diterima
                  </MonoLabel>
                </div>
                <p className="font-display text-3xl font-extrabold tracking-score text-brand tabular-nums sm:text-4xl">
                  {pct(ratio)}
                </p>
              </div>
              <div
                role="img"
                aria-label={`${filled} dari ${SLOTS} pendaftar diterima`}
                className="grid grid-cols-10 gap-1.5 sm:gap-2"
              >
                {Array.from({ length: SLOTS }, (_, i) => (
                  <span
                    key={i}
                    className={cn(
                      'aspect-square w-full max-w-7 rounded-full border-[1.5px]',
                      i < filled
                        ? 'border-brand bg-brand'
                        : 'border-line-strong bg-surface',
                    )}
                  />
                ))}
              </div>
              {filled === 0 && (
                <p className="text-sm text-ink-muted">
                  Kurang dari 1 dari 20 pendaftar yang diterima.
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </MarketingSection>
  );
}
