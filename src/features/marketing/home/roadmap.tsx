import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { MarketingSection } from '../section';

const PHASES = [
  {
    period: 'Januari – Maret',
    phase: 'Fase intensif',
    rhythm: '4× seminggu',
    body: 'Bedah konsep dasar dan tipe soal SNBT untuk fondasi yang kuat.',
    exams: 'SNBT',
  },
  {
    period: 'April – Mei',
    phase: 'Fase super intensif',
    rhythm: '6× seminggu',
    body: 'Simulasi try out penuh dan pembahasan soal, drill hampir setiap hari menuju ujian.',
    exams: 'SNBT',
    peak: true,
  },
  {
    period: 'Juni – Juli',
    phase: 'Fase ujian mandiri',
    rhythm: '6× seminggu',
    body: 'Soal HOTS dan strategi khusus SIMAK UI dan UTUL UGM.',
    exams: 'UI, UGM',
  },
  {
    period: 'Juli – Agustus',
    phase: 'Fase kedinasan',
    rhythm: '4× seminggu',
    body: 'SKD lengkap (TIU, TWK, TKP) dan simulasi untuk STAN dan STIS.',
    exams: 'STAN, STIS',
  },
];

/** Jadwal 8 bulan — urutan nyata, jadi ditampilkan sebagai garis waktu bernomor. */
export function RoadmapSection() {
  return (
    <MarketingSection
      id="timeline"
      title="Jadwal terstruktur sampai lolos"
      description="Kamu tinggal ikuti peta. Kami yang mengatur kapan harus maraton dan kapan harus sprint."
      headerAction={
        <Button
          asChild
          variant="outline"
        >
          <Link href="/price">Lihat program</Link>
        </Button>
      }
    >
      <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {PHASES.map((p, i) => (
          <li
            key={p.period}
            className={cn(
              'flex flex-col gap-3 rounded-lg border p-5',
              p.peak
                ? 'border-brand-strong bg-brand-soft'
                : 'border-line bg-surface',
            )}
          >
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'flex size-8 items-center justify-center rounded-full text-sm font-bold tabular-nums',
                  p.peak
                    ? 'bg-brand-strong text-brand-ink'
                    : 'bg-paper text-ink',
                )}
              >
                {i + 1}
              </span>
              <span className="text-sm font-semibold text-ink-muted">
                {p.period}
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-ink">{p.phase}</h3>
            <p className="text-sm text-ink-muted">{p.body}</p>
            <dl className="mt-auto flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink">
              <div>
                <dt className="sr-only">Frekuensi</dt>
                <dd className="font-semibold">{p.rhythm}</dd>
              </div>
              <div>
                <dt className="sr-only">Ujian</dt>
                <dd className="text-ink-muted">{p.exams}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
    </MarketingSection>
  );
}
