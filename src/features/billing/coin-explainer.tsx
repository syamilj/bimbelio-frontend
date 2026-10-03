import { SeriesLabel } from '@/components/brand/series-label';
import { MarketingSection } from '@/features/marketing/section';
import {
  BookOpen,
  Coins,
  Eye,
  FileText,
  MessageSquare,
  PenTool,
  type LucideIcon,
} from 'lucide-react';

const COINS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: MessageSquare,
    title: 'Chat',
    body: 'Tanya BimBot, tutor AI yang menjawab pertanyaanmu.',
  },
  {
    icon: FileText,
    title: 'Try out',
    body: 'Kerjakan try out dengan format seperti ujian aslinya.',
  },
  {
    icon: PenTool,
    title: 'Catatan',
    body: 'Buat catatan belajar yang dirapikan AI dari materimu.',
  },
  {
    icon: BookOpen,
    title: 'Quiz',
    body: 'Latihan quiz yang menyesuaikan kemampuanmu.',
  },
  {
    icon: Eye,
    title: 'Vision',
    body: 'Foto soal, lalu AI membantu menyelesaikannya.',
  },
];

/** Penjelasan sistem koin di halaman paket. */
export function CoinExplainer() {
  return (
    <MarketingSection
      id="koin"
      tone="surface"
      accent="pink"
      eyebrow={<SeriesLabel icon={Coins}>Koin</SeriesLabel>}
      title="Cara kerja koin"
      description="Fitur AI dan try out memakai koin: satu koin untuk satu kali pakai. Paket belajar sudah termasuk koin, dan kamu bisa menambah koin kapan saja."
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {COINS.map(({ icon: Icon, title, body }) => (
          <li
            key={title}
            className="flex flex-col gap-3 rounded-md border border-line p-5"
          >
            <span className="flex size-10 items-center justify-center rounded-full border-[1.5px] border-brand text-brand">
              <Icon
                className="size-5"
                aria-hidden
              />
            </span>
            <div className="flex flex-col gap-1">
              <h3 className="font-display text-lg font-bold tracking-display text-ink">
                Koin {title.toLowerCase()}
              </h3>
              <p className="text-sm text-ink-muted">{body}</p>
            </div>
            <p className="mt-auto font-mono text-xs font-medium text-ink-muted">
              1 koin per penggunaan
            </p>
          </li>
        ))}
      </ul>
    </MarketingSection>
  );
}
