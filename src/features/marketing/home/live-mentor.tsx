import { Highlight } from '@/components/brand/highlight';
import { SeriesLabel } from '@/components/brand/series-label';
import {
  Bot,
  Compass,
  GraduationCap,
  MonitorPlay,
  type LucideIcon,
} from 'lucide-react';
import { MarketingSection } from '../section';
import { LiveClassPreview } from './liveclass-preview';

const LAYERS: {
  icon: LucideIcon;
  name: string;
  role: string;
  points: string[];
}[] = [
  {
    icon: GraduationCap,
    name: 'Tutor',
    role: 'Alumni UI, UGM, dan ITB yang terbukti lolos PTN top.',
    points: [
      'Live class interaktif, lebih dari 198 sesi',
      'Materi dan strategi soal UTBK yang sebenarnya',
      'Rekaman lengkap, bisa diputar ulang kapan saja',
    ],
  },
  {
    icon: Compass,
    name: 'Mentor',
    role: 'Menjaga target, mental, dan ritme belajarmu.',
    points: [
      'Perencanaan strategi dan target',
      'Review progres dan masukan tiap minggu',
      'Konseling 1-on-1 prioritas',
      'Pendampingan mindset dan ritme belajar',
    ],
  },
  {
    icon: Bot,
    name: 'BimBot AI',
    role: 'Bantuan instan 24 jam, tanpa menunggu jadwal.',
    points: [
      'Tetap bisa bertanya jam 2 pagi',
      'Analisis kesalahan otomatis',
      'Latihan yang menyesuaikan kelemahanmu',
    ],
  },
];

/** Kelas live & mentor: tiga lapis pendamping, tutor asli, dan jadwal kelas terdekat. */
export function LiveMentorSection({
  tutors,
  children,
}: {
  tutors?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <MarketingSection
      id="live-learning"
      eyebrow={
        <SeriesLabel icon={MonitorPlay}>Kelas live & mentor</SeriesLabel>
      }
      title={
        <>
          Belajar langsung bareng <Highlight>tutor alumni PTN.</Highlight>
        </>
      }
      description="SNBT, mandiri, atau kedinasan: tutor mengajarkan strategi tiap ujian, mentor menjaga progres, dan BimBot siaga 24 jam."
    >
      <ol
        id="3-layer"
        aria-label="Tiga lapis pendamping"
        className="grid gap-4 lg:grid-cols-3"
      >
        {LAYERS.map(({ icon: Icon, name, role, points }, i) => (
          <li
            key={name}
            className="flex flex-col gap-4 rounded-md border border-line bg-surface p-6"
          >
            <div className="flex items-center justify-between">
              <span className="flex size-11 items-center justify-center rounded-full bg-brand text-brand-ink">
                <Icon
                  className="size-5"
                  aria-hidden
                />
              </span>
              <span className="font-mono text-xs font-medium text-ink-muted">
                lapis {i + 1}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-display text-xl font-bold tracking-display text-ink">
                {name}
              </h3>
              <p className="text-ink-muted">{role}</p>
            </div>
            <ul className="flex flex-col gap-2 text-sm text-ink">
              {points.map((p) => (
                <li
                  key={p}
                  className="flex gap-2"
                >
                  <span
                    aria-hidden
                    className="mt-1.5 size-2 shrink-0 rounded-full border-[1.5px] border-brand"
                  />
                  {p}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      {tutors}
      <LiveClassPreview />
      {children}
    </MarketingSection>
  );
}
