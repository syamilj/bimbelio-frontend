import { Bot, Compass, GraduationCap, type LucideIcon } from 'lucide-react';
import { MarketingSection } from '../section';

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

const REASONS = [
  {
    title: 'Dulu kami juga begitu',
    body: 'Tim kami dari UI, UGM, ITB, STAN, dan kampus top lain. Kami pernah bingung memilih SNBT, mandiri, atau kedinasan, jadi kami tahu apa yang kamu butuhkan.',
  },
  {
    title: 'Satu akun, semua jalur',
    body: 'Tidak perlu daftar banyak bimbel. Satu akun Bimbelio mencakup SNBT, ujian mandiri (UI, UGM, ITB, dan lainnya), sampai SKD kedinasan (STAN, STIS, IPDN).',
  },
];

/** Kenapa Bimbelio + tiga lapis pendampingan. */
export function ApproachSection({ children }: { children?: React.ReactNode }) {
  return (
    <MarketingSection
      id="3-layer"
      tone="surface"
      title="Tiga tim yang menemanimu sampai hari ujian"
      description="SNBT, mandiri, atau kedinasan: tutor mengajarkan strategi tiap ujian, mentor menjaga progres, dan AI siaga 24 jam."
    >
      <ol className="grid gap-4 lg:grid-cols-3">
        {LAYERS.map(({ icon: Icon, name, role, points }, i) => (
          <li
            key={name}
            className="flex flex-col gap-4 rounded-lg border border-line p-6"
          >
            <div className="flex items-center justify-between">
              <span className="flex size-11 items-center justify-center rounded-full bg-brand-soft text-brand-strong">
                <Icon
                  className="size-5"
                  aria-hidden
                />
              </span>
              <span className="text-sm font-semibold text-ink-subtle tabular-nums">
                Lapis {i + 1}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-extrabold text-ink">{name}</h3>
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
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand"
                  />
                  {p}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <div
        id="about"
        className="grid gap-6 md:grid-cols-2"
      >
        {REASONS.map((r) => (
          <div
            key={r.title}
            className="flex flex-col gap-2"
          >
            <h3 className="text-lg font-bold text-ink">{r.title}</h3>
            <p className="text-ink-muted">{r.body}</p>
          </div>
        ))}
      </div>
      {children}
    </MarketingSection>
  );
}
