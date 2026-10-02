import { ContactButton } from '@/components/layout/site/contact';
import { Button } from '@/components/ui/button';
import { MarketingSection } from '@/features/marketing/section';
import {
  Award,
  Brain,
  CheckCircle,
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
    title: 'Update terus menerus',
    body: 'Aku selalu tambahin fitur baru biar kamu makin dimudahin.',
  },
  {
    icon: Users,
    title: 'Komunitas yang solid',
    body: 'Kamu belajar bareng ribuan siswa lain yang seperjuangan.',
  },
  {
    icon: Award,
    title: 'Bukti nyata',
    body: 'Ribuan alumni aku udah lolos ke PTN dan kedinasan impian.',
  },
];

const WHY: Item[] = [
  {
    icon: Brain,
    title: 'AI yang ngerti kamu',
    body: 'Bukan AI biasa — ini AI yang belajar dari progress kamu dan kasih rekomendasi materi yang pas banget.',
  },
  {
    icon: Target,
    title: 'Fokus ke target kamu',
    body: 'Mau SNBT, SIMAK UI, UM-UGM, atau Kedinasan? Semua materi udah aku sesuaikan sama pola soal terbaru.',
  },
  {
    icon: Award,
    title: 'Mentor berpengalaman',
    body: 'Bukan sembarang tutor — mereka udah ngebimbing ratusan siswa lolos PTN dan kedinasan favorit.',
  },
  {
    icon: TrendingUp,
    title: 'Hasil yang keliatan',
    body: 'Ribuan alumni aku udah lolos. Kamu bisa cek sendiri testimoni dan data passing rate yang transparan.',
  },
];

const EXAMS = [
  {
    name: 'SNBT',
    full: 'Seleksi Nasional Berdasarkan Tes',
    logo: '/hero/LOGO_SNBT.webp',
    body: 'Jalur utama masuk PTN — aku kasih kamu ribuan soal latihan yang mirip banget sama aslinya.',
    stats: ['5.000+ soal latihan', '200+ video pembahasan'],
  },
  {
    name: 'SIMAK UI',
    full: 'SIMAK Universitas Indonesia',
    logo: '/hero/LOGO_PTN_UI.webp',
    body: 'Mau masuk UI lewat jalur mandiri? Soal-soal spesifik UI udah aku siapin lengkap.',
    stats: ['3.500+ soal spesifik UI', '50+ paket try out'],
  },
  {
    name: 'UM-UGM',
    full: 'Ujian Mandiri Universitas Gadjah Mada',
    logo: '/hero/LOGO_PTN_UGM.webp',
    body: 'Target UGM? Aku punya bank soal UM-UGM dari tahun-tahun sebelumnya buat kamu pelajari.',
    stats: ['2.800+ soal tahun lalu', 'Pembahasan video & teks'],
  },
  {
    name: 'Kedinasan',
    full: 'IPDN, STAN, STIS & lainnya',
    logo: '/hero/LOGO_KEDINASAN_STAN.webp',
    body: 'IPDN, STAN, STIS? Semua pola soal kedinasan udah aku cover di sini.',
    stats: ['4.200+ soal multi instansi', '150+ topik materi'],
  },
];

const VALUES: Item[] = [
  {
    icon: Lightbulb,
    title: 'Terus berinovasi',
    body: 'Aku selalu cari cara terbaru biar kamu belajar lebih efektif — makanya aku pakai AI dan teknologi canggih.',
  },
  {
    icon: Shield,
    title: 'All-in buat kamu',
    body: 'Aku komit bantu kamu sampe beneran lolos. Sukses kamu adalah bukti kesuksesan aku juga.',
  },
  {
    icon: CheckCircle,
    title: 'Kualitas nomor 1',
    body: 'Aku gak mau asal-asalan — dari materi, soal, sampai mentor, semua aku pastikan berkualitas tinggi.',
  },
  {
    icon: Rocket,
    title: 'Percepat progres kamu',
    body: 'Aku bikin sistem yang ngebuat kamu belajar lebih cepet dan efisien daripada belajar sendiri.',
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
    <ul className={`grid gap-6 ${cols}`}>
      {items.map(({ icon: Icon, title, body }) => (
        <li
          key={title}
          className="flex flex-col gap-3"
        >
          <span className="flex size-11 items-center justify-center rounded-full bg-brand-soft text-brand-strong">
            <Icon
              className="size-5"
              aria-hidden
            />
          </span>
          <h3 className="text-lg font-bold text-ink">{title}</h3>
          <p className="text-ink-muted">{body}</p>
        </li>
      ))}
    </ul>
  );
}

export default function AboutPage() {
  return (
    <>
      <MarketingSection
        headingLevel={1}
        title="Kenalan sama Bimbelio"
        description="Aku Bimbelio — platform bimbel + AI yang bikin persiapan SNBT, SIMAK UI, UM-UGM, sama Kedinasan jadi gak ribet dan super terstruktur."
        className="pt-10 sm:pt-14"
      >
        <dl className="grid grid-cols-3 gap-4 sm:max-w-xl">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="flex flex-col"
            >
              <dt className="order-2 text-sm text-ink-muted">{s.label}</dt>
              <dd className="order-1 text-3xl font-extrabold text-ink tabular-nums">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
          >
            <Link href="/price">Mulai belajar</Link>
          </Button>
          <ContactButton
            size="lg"
            variant="outline"
          >
            Hubungi kami
          </ContactButton>
        </div>
      </MarketingSection>

      <MarketingSection tone="surface">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-extrabold tracking-tight text-ink">
              Kenapa aku ada?
            </h2>
            <p className="text-lg text-ink-muted">
              Aku tau banget gimana rasanya belajar sendiri tanpa arah jelas.
              Makanya aku ada — buat kasih kamu sistem belajar yang terstruktur,
              didukung AI canggih dan mentor berpengalaman. Target kamu lolos
              ujian? Aku bantu maksimalin peluang kamu.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-extrabold tracking-tight text-ink">
              Mau jadi apa aku?
            </h2>
            <p className="text-lg text-ink-muted">
              Aku pengen jadi platform bimbel #1 di Indonesia yang ngebantu
              ribuan — bahkan jutaan siswa lolos ke universitas impian mereka.
              Bukan cuma soal lulus, tapi soal ngasih pengalaman belajar yang
              bener-bener ngerti struggle kamu.
            </p>
          </div>
        </div>
        <IconList
          items={PROOF}
          columns={3}
        />
      </MarketingSection>

      <MarketingSection
        title="Kenapa harus pilih aku?"
        description="Aku gabungin yang terbaik dari dua dunia: mentor expert yang ngerti struggle kamu + AI canggih yang personalize belajar kamu 24/7."
      >
        <IconList
          items={WHY}
          columns={4}
        />
      </MarketingSection>

      <MarketingSection
        tone="surface"
        title="Ujian yang aku cover"
        description="Aku fokus ke 4 ujian besar yang paling banyak kamu butuhin — semua udah ada materinya lengkap dan update terus."
      >
        <ul className="grid gap-4 md:grid-cols-2">
          {EXAMS.map((exam) => (
            <li
              key={exam.name}
              className="flex gap-4 rounded-lg border border-line p-5"
            >
              <Image
                src={exam.logo}
                alt=""
                width={48}
                height={48}
                className="size-12 shrink-0 object-contain"
              />
              <div className="flex flex-col gap-2">
                <div>
                  <h3 className="text-lg font-bold text-ink">{exam.name}</h3>
                  <p className="text-sm text-ink-muted">{exam.full}</p>
                </div>
                <p className="text-ink">{exam.body}</p>
                <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium text-ink-muted">
                  {exam.stats.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </MarketingSection>

      <MarketingSection
        title="Prinsip aku dalam ngajarin kamu"
        description="Ini nilai-nilai yang aku pegang teguh setiap kali bikin fitur atau konten buat kamu."
      >
        <IconList
          items={VALUES}
          columns={4}
        />
      </MarketingSection>

      <section className="bg-brand-strong text-brand-ink">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-2xl flex-col gap-3">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Udah kenal kan? Sekarang action!
            </h2>
            <p className="text-lg">
              Ribuan siswa udah percaya sama aku dan berhasil lolos
              PTN/kedinasan impian mereka. Sekarang giliran kamu.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              variant="marker"
            >
              <Link href="/price">Lihat paket belajar</Link>
            </Button>
            <ContactButton
              size="lg"
              variant="outline"
              className="border-brand-ink/40 bg-transparent text-brand-ink hover:bg-brand-ink/10"
            />
          </div>
        </div>
      </section>
    </>
  );
}
