import { InfoPill } from '@/components/brand/info-pill';
import { MonoLabel } from '@/components/brand/mono-label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CalendarClock } from 'lucide-react';
import Link from 'next/link';

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
    body: 'Simulasi tryout penuh dan pembahasan soal, latihan hampir setiap hari menuju ujian.',
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

/**
 * Jadwal 8 bulan. Urutan nyata → garis waktu bernomor dengan bubble: fase
 * puncak terisi, fase lain cincin. Ritme kelas = InfoPill.
 */
export function RoadmapSection() {
  return (
    <div
      id="timeline"
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="font-display text-2xl font-bold tracking-display text-ink">
            Jadwal terstruktur sampai lolos
          </h3>
          <p className="text-ink-muted">
            Kamu tinggal ikuti peta. Kami yang mengatur kapan harus maraton dan
            kapan harus sprint.
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          className="self-start sm:self-auto"
        >
          <Link href="/price">Lihat program</Link>
        </Button>
      </div>
      <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {PHASES.map((p, i) => (
          <li
            key={p.period}
            className={cn(
              'flex flex-col gap-3 rounded-md border bg-surface p-5',
              p.peak ? 'border-brand' : 'border-line',
            )}
          >
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'flex size-8 items-center justify-center rounded-full border-[1.5px] font-mono text-sm font-medium',
                  p.peak
                    ? 'border-brand bg-brand text-brand-ink'
                    : 'border-brand text-brand-strong',
                )}
              >
                {i + 1}
              </span>
              <MonoLabel>{p.period}</MonoLabel>
            </div>
            <h4 className="font-display text-lg font-bold tracking-display text-ink">
              {p.phase}
            </h4>
            <p className="text-sm text-ink-muted">{p.body}</p>
            <dl className="mt-auto flex flex-wrap items-center gap-2 pt-1">
              <dt className="sr-only">Frekuensi kelas</dt>
              <dd>
                <InfoPill
                  size="sm"
                  variant={p.peak ? 'solid' : 'outline'}
                >
                  <CalendarClock aria-hidden />
                  {p.rhythm}
                </InfoPill>
              </dd>
              <dt className="sr-only">Ujian</dt>
              <dd className="font-mono text-xs font-medium text-ink-muted">
                {p.exams}
              </dd>
            </dl>
          </li>
        ))}
      </ol>
    </div>
  );
}
