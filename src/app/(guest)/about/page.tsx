import { Highlight } from '@/components/brand/highlight';
import { Lio } from '@/components/brand/lio';
import { MonoLabel } from '@/components/brand/mono-label';
import { SeriesLabel } from '@/components/brand/series-label';
import { Supergraphic } from '@/components/brand/supergraphic';
import { ContactButton } from '@/components/layout/site/contact';
import { Button } from '@/components/ui/button';
import {
  MarketingSection,
  SITE_CONTAINER,
  sectionTitleClass,
} from '@/features/marketing/section';
import { cn } from '@/lib/utils';
import {
  Award,
  Brain,
  CheckCircle,
  Compass,
  Heart,
  Lightbulb,
  Rocket,
  Shield,
  Target,
  TrendingUp,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Tentang Bimbelio',
  description:
    'Bimbelio adalah platform bimbel + AI untuk persiapan SNBT, SIMAK UI, UM-UGM, dan kedinasan yang terstruktur.',
  alternates: { canonical: '/about' },
};

type Item = { icon: LucideIcon; title: string; body: string };

const PROOF: Item[] = [
  {
    icon: Zap,
    title: 'Update terus-menerus',
    body: 'Kami terus menambah fitur baru supaya belajarmu makin mudah.',
  },
  {
    icon: Users,
    title: 'Komunitas yang solid',
    body: 'Kamu belajar bareng ribuan siswa lain yang seperjuangan.',
  },
  {
    icon: Award,
    title: 'Bukti nyata',
    body: 'Ribuan alumni kami sudah lolos ke PTN dan kedinasan impian.',
  },
];

const WHY: Item[] = [
  {
    icon: Brain,
    title: 'AI yang ngerti kamu',
    body: 'AI yang belajar dari progresmu dan memberi rekomendasi materi yang pas.',
  },
  {
    icon: Target,
    title: 'Fokus ke targetmu',
    body: 'SNBT, SIMAK UI, UM-UGM, atau kedinasan? Semua materi sudah disesuaikan dengan pola soal terbaru.',
  },
  {
    icon: Award,
    title: 'Mentor berpengalaman',
    body: 'Mentor kami sudah membimbing ratusan siswa lolos PTN dan kedinasan favorit.',
  },
  {
    icon: TrendingUp,
    title: 'Hasil yang kelihatan',
    body: 'Ribuan alumni sudah lolos. Kamu bisa cek sendiri testimoni dan data passing rate yang transparan.',
  },
];

const EXAMS = [
  {
    name: 'SNBT',
    full: 'Seleksi Nasional Berdasarkan Tes',
    logo: '/hero/LOGO_SNBT.webp',
    body: 'Jalur utama masuk PTN. Ribuan soal latihan yang mirip dengan aslinya.',
    stats: ['5.000+ soal latihan', '200+ video pembahasan'],
  },
  {
    name: 'SIMAK UI',
    full: 'SIMAK Universitas Indonesia',
    logo: '/hero/LOGO_PTN_UI.webp',
    body: 'Mau masuk UI lewat jalur mandiri? Soal-soal khusus UI sudah lengkap.',
    stats: ['3.500+ soal spesifik UI', '50+ paket tryout'],
  },
  {
    name: 'UM-UGM',
    full: 'Ujian Mandiri Universitas Gadjah Mada',
    logo: '/hero/LOGO_PTN_UGM.webp',
    body: 'Target UGM? Bank soal UM-UGM dari tahun-tahun sebelumnya siap dipelajari.',
    stats: ['2.800+ soal tahun lalu', 'Pembahasan video & teks'],
  },
  {
    name: 'Kedinasan',
    full: 'IPDN, STAN, STIS & lainnya',
    logo: '/hero/LOGO_KEDINASAN_STAN.webp',
    body: 'IPDN, STAN, STIS? Semua pola soal kedinasan sudah tercakup.',
    stats: ['4.200+ soal multi instansi', '150+ topik materi'],
  },
];

const VALUES: Item[] = [
  {
    icon: Lightbulb,
    title: 'Terus berinovasi',
    body: 'Kami selalu mencari cara belajar yang lebih efektif, termasuk lewat AI dan teknologi.',
  },
  {
    icon: Shield,
    title: 'All-in buat kamu',
    body: 'Kami berkomitmen menemanimu sampai lolos. Suksesmu adalah bukti kerja kami.',
  },
  {
    icon: CheckCircle,
    title: 'Kualitas nomor satu',
    body: 'Materi, soal, sampai mentor, semuanya kami pastikan berkualitas.',
  },
  {
    icon: Rocket,
    title: 'Percepat progresmu',
    body: 'Sistem yang membuatmu belajar lebih cepat dan efisien daripada belajar sendiri.',
  },
];

const STATS = [
  { value: '10.000+', label: 'siswa aktif' },
  { value: '85%', label: 'passing rate' },
  { value: '4,9/5', label: 'rating siswa' },
];

function IconList({
  items,
  columns = 2,
}: {
  items: Item[];
  columns?: 2 | 3 | 4;
}) {
  const cols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }[columns];
  return (
    <ul className={`grid gap-4 ${cols}`}>
      {items.map(({ icon: Icon, title, body }) => (
        <li
          key={title}
          className="flex flex-col gap-3 rounded-md border border-line bg-surface p-5"
        >
          <span className="flex size-10 items-center justify-center rounded-full border-[1.5px] border-brand text-brand">
            <Icon
              className="size-5"
              aria-hidden
            />
          </span>
          <h3 className="font-display text-lg font-bold tracking-display text-ink">
            {title}
          </h3>
          <p className="text-sm text-ink-muted">{body}</p>
        </li>
      ))}
    </ul>
  );
}

export default function AboutPage() {
  return (
    <>
      <section
        data-surface="brand"
        aria-labelledby="about-judul"
        className="relative isolate overflow-hidden"
      >
        <Supergraphic className="-right-[30%] -bottom-[40%] -z-10 h-[120%] text-white/10 lg:-right-[8%]" />
        <div
          className={cn(
            SITE_CONTAINER,
            'grid items-center gap-10 py-14 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.6fr)] lg:py-20',
          )}
        >
          <div className="flex flex-col gap-6">
            <SeriesLabel
              icon={Heart}
              tone="light"
            >
              Tentang kami
            </SeriesLabel>
            <h1
              id="about-judul"
              className="font-display text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.02] font-extrabold tracking-hero text-balance"
            >
              Kenalan sama <Highlight tone="text">Bimbelio.</Highlight>
            </h1>
            <p className="max-w-[52ch] text-lg text-on-dark-muted">
              Platform bimbel + AI yang bikin persiapan SNBT, SIMAK UI, UM-UGM,
              dan kedinasan jadi nggak ribet dan terstruktur.
            </p>
            <dl className="grid max-w-xl grid-cols-3 gap-4">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col"
                >
                  <dt className="order-2 font-mono text-xs font-medium lowercase">
                    {s.label}
                  </dt>
                  <dd className="order-1 font-display text-3xl font-extrabold tracking-score text-highlight tabular-nums sm:text-5xl">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                variant="accent"
              >
                <Link href="/price">Mulai belajar</Link>
              </Button>
              <ContactButton
                size="lg"
                variant="outline-light"
              >
                Hubungi kami
              </ContactButton>
            </div>
          </div>
          <div className="hidden justify-center lg:flex">
            <Lio
              expression="senang"
              tone="white"
              size="l"
              className="size-72"
            />
          </div>
        </div>
      </section>

      <MarketingSection
        tone="surface"
        accent="pink"
      >
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-3">
            <MonoLabel>kenapa kami ada</MonoLabel>
            <h2 className={cn(sectionTitleClass, 'text-ink')}>
              Belajar sendiri tanpa arah itu <Highlight>melelahkan.</Highlight>
            </h2>
            <p className="text-lg text-ink-muted">
              Kami tahu rasanya. Makanya Bimbelio memberi sistem belajar yang
              terstruktur, didukung AI dan mentor berpengalaman. Target kamu
              lolos ujian? Kami bantu memaksimalkan peluangmu.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <MonoLabel>mau jadi apa kami</MonoLabel>
            <h2 className={cn(sectionTitleClass, 'text-ink')}>
              Bimbel yang benar-benar ngerti perjuanganmu.
            </h2>
            <p className="text-lg text-ink-muted">
              Kami ingin jadi platform bimbel nomor satu di Indonesia yang
              membantu jutaan siswa lolos ke kampus impian. Bukan cuma soal
              lulus, tapi soal pengalaman belajar yang paham perjuanganmu.
            </p>
          </div>
        </div>
        <IconList
          items={PROOF}
          columns={3}
        />
      </MarketingSection>

      <MarketingSection
        eyebrow={<SeriesLabel icon={Compass}>Kenapa Bimbelio</SeriesLabel>}
        title={
          <>
            Mentor yang paham, <Highlight>AI yang personal.</Highlight>
          </>
        }
        description="Kami menggabungkan yang terbaik dari dua dunia: mentor yang paham perjuanganmu dan AI yang menyesuaikan belajarmu 24 jam."
      >
        <IconList
          items={WHY}
          columns={4}
        />
      </MarketingSection>

      <MarketingSection
        tone="surface"
        accent="pink"
        title="Ujian yang kami cakup"
        description="Empat ujian besar yang paling banyak kamu butuhkan, lengkap dengan materi yang terus diperbarui."
      >
        <ul className="grid gap-4 md:grid-cols-2">
          {EXAMS.map((exam) => (
            <li
              key={exam.name}
              className="flex gap-4 rounded-md border border-line bg-paper p-5"
            >
              <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-surface">
                <Image
                  src={exam.logo}
                  alt=""
                  width={40}
                  height={40}
                  className="size-10 object-contain"
                />
              </span>
              <div className="flex flex-col gap-2">
                <div>
                  <h3 className="font-display text-xl font-bold tracking-display text-ink">
                    {exam.name}
                  </h3>
                  <p className="text-sm text-ink-muted">{exam.full}</p>
                </div>
                <p className="text-ink">{exam.body}</p>
                <ul className="flex flex-wrap gap-2">
                  {exam.stats.map((s) => (
                    <li
                      key={s}
                      className="rounded-full bg-surface px-3 py-1 font-mono text-xs font-medium text-ink-muted"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </MarketingSection>

      <MarketingSection
        title="Prinsip kami saat mengajarimu"
        description="Nilai yang kami pegang setiap kali membuat fitur atau konten untukmu."
      >
        <IconList
          items={VALUES}
          columns={4}
        />
      </MarketingSection>

      <MarketingSection
        tone="ink"
        title={
          <>
            Udah kenal, kan?{' '}
            <Highlight tone="text">Sekarang giliranmu.</Highlight>
          </>
        }
        description="Ribuan siswa sudah percaya dan berhasil lolos PTN atau kedinasan impian mereka."
        headerAction={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              variant="accent"
            >
              <Link href="/price">Lihat paket belajar</Link>
            </Button>
            <ContactButton
              size="lg"
              variant="outline-light"
            />
          </div>
        }
      />
    </>
  );
}
