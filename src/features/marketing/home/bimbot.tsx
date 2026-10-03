import { Highlight } from '@/components/brand/highlight';
import { BimBotAvatar } from '@/components/brand/lio';
import { MonoLabel } from '@/components/brand/mono-label';
import { SeriesLabel } from '@/components/brand/series-label';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  BookOpen,
  Bot,
  Target,
  Users,
  Video,
  type LucideIcon,
} from 'lucide-react';
import { SITE_CONTAINER, sectionTitleClass } from '../section';

// Contoh percakapan (brand book hlm. 101) — ilustrasi, bukan log pengguna.
const CHAT: { from: 'user' | 'bot'; text: string }[] = [
  { from: 'user', text: 'Kenapa jawabanku 20% salah?' },
  {
    from: 'bot',
    text: 'Turun 20% dihitung dari harga yang sudah naik. Coba misalkan harga awal 100.',
  },
  { from: 'user', text: '120 lalu 96?' },
  { from: 'bot', text: 'Tepat. Jadi turun 4%. Mau latihan soal mirip?' },
];

const SUGGESTIONS = ['Jelaskan pakai contoh lain', 'Kasih 5 soal mirip'];

type Tool = { icon: LucideIcon; name: string; tagline: string; body: string };

const TOOLS: Tool[] = [
  {
    icon: Bot,
    name: 'BimBot',
    tagline: 'AI mentor 24 jam',
    body: 'Foto soal yang bikin buntu, dapat penjelasan langkah demi langkah dalam hitungan detik.',
  },
  {
    icon: Target,
    name: 'BimArena',
    tagline: 'Tryout dengan skor IRT',
    body: 'Simulasi ujian dengan format resmi UTBK dan penilaian IRT untuk memperkirakan skor aslimu.',
  },
  {
    icon: Video,
    name: 'BimLive',
    tagline: 'Kelas live interaktif',
    body: 'Lebih dari 198 sesi live bersama tutor alumni PTN, lengkap dengan tanya jawab dan rekaman.',
  },
  {
    icon: BarChart3,
    name: 'BimInsight',
    tagline: 'Peta strategi lolos',
    body: 'Dashboard progres dan rekomendasi materi berdasarkan kelemahanmu.',
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

/** BimBot (avatar simbol, bukan Lio penuh) + semua alat belajar dalam satu akun. */
export function BimBotSection() {
  return (
    <section
      id="bimbot"
      data-accent="pink"
      aria-labelledby="bimbot-judul"
      className="bg-surface py-16 sm:py-24"
    >
      <div className={cn(SITE_CONTAINER, 'flex flex-col gap-16')}>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-4">
            <SeriesLabel icon={Bot}>BimBot</SeriesLabel>
            <h2
              id="bimbot-judul"
              className={cn(sectionTitleClass, 'text-ink')}
            >
              Bingung jam 11 malam? <Highlight>Tanya BimBot</Highlight> dulu.
            </h2>
            <p className="max-w-[52ch] text-lg text-ink-muted">
              BimBot menjawab soal yang bikin buntu, langkah demi langkah, lalu
              mengajakmu latihan soal yang mirip. Kalau masih bingung, tutor dan
              mentor siap menyambung.
            </p>
          </div>

          <figure className="flex flex-col overflow-hidden rounded-lg border border-line bg-paper">
            <figcaption className="flex items-center gap-3 border-b border-line bg-surface px-5 py-4">
              <BimBotAvatar className="size-10" />
              <span className="flex flex-col leading-tight">
                <span className="font-semibold text-ink">BimBot</span>
                <span className="text-xs text-success">online 24 jam</span>
              </span>
              <MonoLabel className="ml-auto">contoh percakapan</MonoLabel>
            </figcaption>
            <ol className="flex flex-col gap-3 p-5">
              {CHAT.map((m, i) => (
                <li
                  key={i}
                  className={cn(
                    'max-w-[85%] rounded-md px-4 py-3 text-sm leading-relaxed',
                    m.from === 'user'
                      ? 'self-end rounded-br-xs bg-brand text-brand-ink'
                      : 'self-start rounded-bl-xs border border-line bg-surface text-ink',
                  )}
                >
                  <span className="sr-only">
                    {m.from === 'user' ? 'Kamu: ' : 'BimBot: '}
                  </span>
                  {m.text}
                </li>
              ))}
            </ol>
            <div className="flex flex-wrap gap-2 px-5 pb-5">
              {SUGGESTIONS.map((s) => (
                <span
                  key={s}
                  className="inline-flex h-8 items-center rounded-full border-2 border-brand px-3 text-xs font-semibold text-brand-strong"
                >
                  {s}
                </span>
              ))}
            </div>
          </figure>
        </div>

        <div
          id="ecosystem"
          className="flex flex-col gap-6"
        >
          <h3 className="font-display text-2xl font-bold tracking-display text-ink">
            Semua alat belajar dalam satu akun
          </h3>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map(({ icon: Icon, name, tagline, body }) => (
              <li
                key={name}
                id={name === 'BimArena' ? 'features' : undefined}
                className="flex flex-col gap-3 rounded-md border border-line p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border-[1.5px] border-brand text-brand">
                    <Icon
                      className="size-5"
                      aria-hidden
                    />
                  </span>
                  <div className="flex flex-col leading-tight">
                    <h4 className="font-display text-lg font-bold tracking-display text-ink">
                      {name}
                    </h4>
                    <span className="font-mono text-xs font-medium text-ink-muted lowercase">
                      {tagline}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-ink-muted">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
