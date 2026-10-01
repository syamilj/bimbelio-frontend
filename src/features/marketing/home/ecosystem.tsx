import { Button } from '@/components/ui/button';
import {
  BarChart3,
  BookOpen,
  Bot,
  Target,
  Users,
  Video,
  type LucideIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { MarketingSection } from '../section';

type Tool = {
  icon: LucideIcon;
  name: string;
  tagline: string;
  body: string;
  image?: string;
};

const TOOLS: Tool[] = [
  {
    icon: Bot,
    name: 'BimBot',
    tagline: 'AI mentor 24 jam',
    body: 'Foto soal yang bikin buntu, dapat penjelasan langkah demi langkah dalam hitungan detik.',
    image: '/hero/fitur_bimbelio_1.webp',
  },
  {
    icon: Target,
    name: 'BimArena',
    tagline: 'Try out dengan skor IRT',
    body: 'Simulasi ujian dengan format resmi UTBK dan penilaian IRT untuk memprediksi skor aslimu.',
    image: '/hero/fitur_bimbelio-3.webp',
  },
  {
    icon: Video,
    name: 'BimLive',
    tagline: 'Kelas live interaktif',
    body: 'Lebih dari 198 sesi live bersama tutor alumni PTN, lengkap dengan tanya jawab dan rekaman.',
    image: '/hero/fitur_bimbelio-4.webp',
  },
  {
    icon: BarChart3,
    name: 'BimInsight',
    tagline: 'Peta strategi lolos',
    body: 'Dashboard progres dan rekomendasi materi berdasarkan kelemahanmu.',
    image: '/hero/fitur_bimbelio-5.webp',
  },
  {
    icon: BookOpen,
    name: 'BimCourse',
    tagline: 'Video materi',
    body: 'Lebih dari 5.000 video animasi yang membuat konsep rumit jadi mudah diingat.',
  },
  {
    icon: Users,
    name: 'BimCircle',
    tagline: 'Komunitas pejuang',
    body: 'Belajar bareng siswa ambis se-Indonesia: berbagi tips, catatan, dan semangat.',
  },
];

/** Enam alat belajar dalam satu akun. */
export function EcosystemSection() {
  const featured = TOOLS.filter((t) => t.image);
  const others = TOOLS.filter((t) => !t.image);
  return (
    <MarketingSection
      id="ecosystem"
      tone="surface"
      title="Semua alat belajar dalam satu akun"
      description="Bukan sekadar bimbel. Dari kelas live sampai AI, semuanya terhubung ke progresmu."
      headerAction={
        <Button asChild>
          <Link href="/price">Lihat paket</Link>
        </Button>
      }
    >
      <ul className="grid gap-5 md:grid-cols-2">
        {featured.map(({ icon: Icon, name, tagline, body, image }) => (
          <li
            key={name}
            id={name === 'BimArena' ? 'features' : undefined}
            className="flex flex-col overflow-hidden rounded-lg border border-line"
          >
            <div className="relative aspect-video bg-paper">
              <Image
                src={image!}
                alt={`Tampilan ${name}`}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-2 p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-brand-strong">
                <Icon
                  className="size-4"
                  aria-hidden
                />
                {tagline}
              </p>
              <h3 className="text-xl font-extrabold text-ink">{name}</h3>
              <p className="text-ink-muted">{body}</p>
            </div>
          </li>
        ))}
      </ul>
      <ul className="grid gap-5 md:grid-cols-2">
        {others.map(({ icon: Icon, name, tagline, body }) => (
          <li
            key={name}
            className="flex gap-4 rounded-lg border border-line p-5"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-paper text-brand-strong">
              <Icon
                className="size-5"
                aria-hidden
              />
            </span>
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-extrabold text-ink">
                {name}{' '}
                <span className="text-sm font-semibold text-ink-muted">
                  {tagline}
                </span>
              </h3>
              <p className="text-ink-muted">{body}</p>
            </div>
          </li>
        ))}
      </ul>
    </MarketingSection>
  );
}
