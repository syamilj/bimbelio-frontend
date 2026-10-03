import { Disclaimer } from '@/components/brand/disclaimer';
import { Highlight } from '@/components/brand/highlight';
import { InfoPill } from '@/components/brand/info-pill';
import { BimBotAvatar, Lio, type LioExpression } from '@/components/brand/lio';
import { Logo } from '@/components/brand/logo';
import { MonoLabel } from '@/components/brand/mono-label';
import { Scribble } from '@/components/brand/scribble';
import { SeriesLabel } from '@/components/brand/series-label';
import { Sticker } from '@/components/brand/sticker';
import { Supergraphic } from '@/components/brand/supergraphic';
import { BubbleBars } from '@/components/charts/bubble/bubble-bars';
import { BubbleHeatmap } from '@/components/charts/bubble/bubble-heatmap';
import { BubbleLadder } from '@/components/charts/bubble/bubble-ladder';
import { BubbleSpread } from '@/components/charts/bubble/bubble-spread';
import { normalBins } from '@/components/charts/bubble/geometry';
import { AnswerBubble } from '@/components/patterns/answer-bubble';
import { EmptyState } from '@/components/patterns/empty-state';
import { PageHeader } from '@/components/patterns/page-header';
import { StatCard } from '@/components/patterns/stat-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { ChartLine, Lightbulb, Trophy } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Katalog hidup sistem desain merek 2.1 (docs/redesign/BRAND-2.1.md).
// Dipakai untuk review visual & snapshot E2E; tidak tersedia di produksi.
export const metadata: Metadata = {
  title: 'Styleguide',
  robots: { index: false, follow: false },
};

const SWATCHES = [
  ['Biru Bimbelio', 'bg-brand', '#0066FF'],
  ['Tinta', 'bg-ink', '#0B1736'],
  ['Kertas', 'bg-paper', '#F4F7FC'],
  ['Lime', 'bg-lime', '#C6F432'],
  ['Pink', 'bg-pink', '#FF5FA2'],
  ['Benar / naik', 'bg-success', '#0B7038'],
  ['Salah / turun', 'bg-danger', '#C4234A'],
] as const;

const EXPRESSIONS: LioExpression[] = [
  'netral',
  'fokus',
  'ambis',
  'senang',
  'bintang',
  'ngantuk',
  'licik',
  'kaget',
  'panik',
  'pusing',
];

// Data contoh — bukan data siswa.
const SUBTES = [
  { label: 'PU', value: 655 },
  { label: 'PPU', value: 612 },
  { label: 'PBM', value: 641 },
  { label: 'PK', value: 548 },
  { label: 'LBI', value: 669 },
  { label: 'LBE', value: 603 },
  { label: 'PM', value: 571 },
];
const HEAT = [
  [0, 0, 0, 0, 20, 30, 45, 60, 50],
  [0, 0, 0, 0, 25, 30, 50, 70, 55],
  [0, 0, 0, 0, 0, 40, 45, 60, 65],
  [0, 0, 0, 0, 30, 35, 55, 90, 95],
  [0, 0, 0, 0, 20, 25, 30, 45, 30],
  [30, 50, 70, 35, 0, 0, 30, 25, 45],
  [0, 20, 40, 45, 25, 30, 50, 55, 60],
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5 border-t border-line pt-8">
      <MonoLabel>{title}</MonoLabel>
      {children}
    </section>
  );
}

export default function StyleguidePage() {
  if (process.env.VERCEL_ENV === 'production') notFound();

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-12 px-5 py-12 lg:px-8">
      <PageHeader
        leading={<MonoLabel>styleguide · merek 2.1</MonoLabel>}
        title="Lembar Jawaban 2.1"
        description="Semua token dan komponen sistem desain Bimbelio. Angka di halaman ini adalah data contoh."
      />

      <Section title="logo">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex h-32 items-center justify-center rounded-md border border-line bg-surface">
            <Logo />
          </div>
          <div
            data-surface="brand"
            className="flex h-32 items-center justify-center rounded-md"
          >
            <Logo tone="white" />
          </div>
          <div
            data-surface="ink"
            data-accent="pink"
            className="flex h-32 items-center justify-center rounded-md"
          >
            <Logo tone="white" />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Logo layout="symbol" />
          <Logo layout="wordmark" />
          <Logo
            layout="vertical"
            className="h-20"
          />
          <BimBotAvatar />
        </div>
      </Section>

      <Section title="warna">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {SWATCHES.map(([name, cls, hex]) => (
            <div
              key={name}
              className="overflow-hidden rounded-md border border-line bg-surface"
            >
              <div className={`h-16 ${cls}`} />
              <div className="p-3">
                <p className="text-sm font-semibold">{name}</p>
                <MonoLabel>{hex}</MonoLabel>
              </div>
            </div>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-4">
          {(
            [
              ['brand', 'lime', 'Biru + lime'],
              ['ink', 'lime', 'Tinta + lime'],
              ['ink', 'pink', 'Tinta + pink'],
            ] as const
          ).map(([surface, accent, label]) => (
            <div
              key={label}
              data-surface={surface}
              data-accent={accent}
              className="flex flex-col gap-1 rounded-md p-6"
            >
              <MonoLabel>{label}</MonoLabel>
              <span className="font-display text-6xl font-extrabold tracking-score text-highlight">
                614
              </span>
              <span className="font-display text-xl font-bold">
                Skor <Highlight tone="text">naik.</Highlight>
              </span>
            </div>
          ))}
          <div className="flex flex-col gap-1 rounded-md border border-line bg-surface p-6">
            <MonoLabel>putih + lime</MonoLabel>
            <span className="font-display text-6xl font-extrabold tracking-score text-brand">
              614
            </span>
            <span className="font-display text-xl font-bold">
              Skor <Highlight>naik.</Highlight>
            </span>
          </div>
        </div>
      </Section>

      <Section title="huruf">
        <p className="font-display text-6xl font-extrabold tracking-score text-brand tabular-nums">
          612,4
        </p>
        <p className="font-display text-5xl font-extrabold tracking-hero text-balance">
          Tahu <Highlight>posisimu.</Highlight> Kejar kampusmu.
        </p>
        <p className="font-display text-3xl font-bold tracking-display">
          Kenapa 28 benar bisa menang dari 30 benar?
        </p>
        <p className="max-w-[70ch] text-base">
          Di IRT, soal yang jarang dijawab benar bobotnya lebih besar. Jadi dua
          siswa dengan jumlah benar sama bisa punya skor berbeda.
        </p>
        <Scribble arrow="up">Lio liat. Lio selalu liat.</Scribble>
        <MonoLabel>rapor TO #08 · data contoh</MonoLabel>
      </Section>

      <Section title="tombol & isian">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Ikut tryout</Button>
          <Button variant="outline">Lihat paket belajar</Button>
          <Button variant="secondary">Simpan</Button>
          <Button variant="ghost">Batal</Button>
          <Button variant="destructive">Hapus</Button>
          <Button variant="link">Lihat pembahasan</Button>
          <Button loading>Menyimpan</Button>
        </div>
        <div
          data-surface="brand"
          className="flex flex-wrap items-center gap-3 rounded-md p-6"
        >
          <Button
            variant="accent"
            size="lg"
          >
            Daftar TO gratis
          </Button>
          <Button
            variant="outline-light"
            size="lg"
          >
            Lihat contoh rapor
          </Button>
        </div>
        <div className="grid max-w-xl gap-3 sm:grid-cols-2">
          <Input placeholder="Email kamu" />
          <Input
            placeholder="Kode voucher"
            aria-invalid
          />
        </div>
        <Tabs defaultValue="ringkasan">
          <TabsList>
            <TabsTrigger value="ringkasan">Ringkasan</TabsTrigger>
            <TabsTrigger value="subtes">Per subtes</TabsTrigger>
            <TabsTrigger value="pembahasan">Pembahasan</TabsTrigger>
          </TabsList>
          <TabsContent value="ringkasan">Ringkasan hasil TO.</TabsContent>
          <TabsContent value="subtes">Skor tiap subtes.</TabsContent>
          <TabsContent value="pembahasan">Pembahasan soal.</TabsContent>
        </Tabs>
      </Section>

      <Section title="label, pil, stiker">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Baru</Badge>
          <Badge variant="highlight">Rekomendasi</Badge>
          <Badge variant="success">Benar</Badge>
          <Badge variant="destructive">Salah</Badge>
          <Badge variant="ink">Live</Badge>
          <Badge variant="mono">PK</Badge>
          <InfoPill>Sabtu, 24 Okt · 19.00 WIB</InfoPill>
          <InfoPill variant="outline">Kelas live</InfoPill>
          <SeriesLabel icon={ChartLine}>Rapor TO</SeriesLabel>
          <SeriesLabel
            icon={Lightbulb}
            episode={8}
          >
            Tips Belajar
          </SeriesLabel>
        </div>
        <Sticker>TO serentak, rasa UTBK</Sticker>
      </Section>

      <Section title="bubble LJK">
        <div className="flex flex-wrap items-center gap-3">
          {(
            [
              'empty',
              'filled',
              'flagged',
              'correct',
              'wrong',
              'missed',
              'disabled',
            ] as const
          ).map((state, i) => (
            <AnswerBubble
              key={state}
              state={state}
              label={
                state === 'correct' || state === 'wrong'
                  ? undefined
                  : String(i + 1)
              }
              size="lg"
              current={i === 1}
            />
          ))}
        </div>
      </Section>

      <Section title="lio">
        <div className="grid grid-cols-5 gap-4 sm:grid-cols-10">
          {EXPRESSIONS.map((e) => (
            <div
              key={e}
              className="flex flex-col items-center gap-2"
            >
              <Lio
                expression={e}
                size="m"
                className="size-20"
              />
              <MonoLabel>{e}</MonoLabel>
            </div>
          ))}
        </div>
        <div
          data-surface="brand"
          className="relative flex items-center gap-6 overflow-hidden rounded-md p-8"
        >
          <Supergraphic />
          <Lio
            expression="ambis"
            props={['ikat']}
            tone="white"
            size="l"
          />
          <Lio
            expression="bintang"
            props={['kilau']}
            tone="white"
            size="m"
          />
        </div>
      </Section>

      <Section title="chart bubble · data contoh">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <MonoLabel>a1 · tangga</MonoLabel>
              <CardTitle>Skor naik per TO</CardTitle>
            </CardHeader>
            <CardContent>
              <BubbleLadder scores={[548, 560, 577, 581, 590, 603, 612, 627]} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <MonoLabel>b1 · batang</MonoLabel>
              <CardTitle>Profil 7 subtes</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <BubbleBars
                data={SUBTES}
                focus="PK"
              />
              <Disclaimer />
            </CardContent>
          </Card>
          <div
            data-surface="ink"
            className="flex flex-col gap-4 rounded-md p-6"
          >
            <MonoLabel>c1 · sebaran</MonoLabel>
            <p className="font-display text-xl font-bold">
              Di atas <Highlight tone="text">78%</Highlight> peserta
            </p>
            <BubbleSpread
              bins={normalBins(400, 800, 25, 560, 70)}
              you={612}
              surface="dark"
            />
            <Disclaimer />
          </div>
          <Card>
            <CardHeader>
              <MonoLabel>d1 · peta jam</MonoLabel>
              <CardTitle>Jam belajar seminggu</CardTitle>
            </CardHeader>
            <CardContent>
              <BubbleHeatmap grid={HEAT} />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section title="pola">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Skor IRT rata-rata"
            value="612"
            hint="▲ +13 dari TO #07"
            icon={<Trophy />}
          />
          <StatCard
            label="Posisi"
            value="78%"
            hint="di atas peserta lain"
          />
          <StatCard
            label="Soal dikerjakan"
            value="1.240"
            hint="minggu ini"
          />
        </div>
        <EmptyState
          lio="netral"
          title="Belum ada TO yang kamu kerjakan"
          description="Kerjakan satu TO dulu, nanti Lio bantu baca posisimu."
          action={<Button>Lihat jadwal TO</Button>}
        />
      </Section>
    </main>
  );
}
