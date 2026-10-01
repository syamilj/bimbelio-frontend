import { AnswerBubble } from '@/components/patterns/answer-bubble';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { MarketingSection } from '../section';

// Data pendaftar & daya tampung dari materi Bimbelio sebelumnya.
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
      title="Kursinya sedikit, pesaingnya ratusan ribu"
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
              className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-5"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={exam.logo}
                  alt=""
                  width={40}
                  height={40}
                  className="size-10 object-contain"
                />
                <div className="flex min-w-0 flex-1 flex-col">
                  <h3 className="font-bold text-ink">{exam.name}</h3>
                  <p className="text-sm text-ink-muted tabular-nums">
                    {fmt(exam.applicants)} pendaftar, {fmt(exam.accepted)}{' '}
                    diterima
                  </p>
                </div>
                <p className="text-3xl font-extrabold text-ink tabular-nums">
                  {pct(ratio)}
                </p>
              </div>
              <div
                role="img"
                aria-label={`${filled} dari ${SLOTS} pendaftar diterima`}
                className="grid grid-cols-10 gap-1.5"
              >
                {Array.from({ length: SLOTS }, (_, i) => (
                  <AnswerBubble
                    key={i}
                    size="xs"
                    state={i < filled ? 'filled' : 'empty'}
                    className="size-4"
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
