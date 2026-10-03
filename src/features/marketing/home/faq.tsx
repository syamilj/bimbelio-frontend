import { Highlight } from '@/components/brand/highlight';
import { SeriesLabel } from '@/components/brand/series-label';
import { ContactButton } from '@/components/layout/site/contact';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MessageCircleQuestion, Plus } from 'lucide-react';
import Link from 'next/link';
import { SITE_CONTAINER, sectionTitleClass } from '../section';

// Teks FAQ dari materi resmi Bimbelio (verbatim). Klaim garansi, durasi akses,
// dan cicilan perlu dijaga sama dengan paket aktif — lihat PLAN.md §8.
export const FAQ = [
  {
    q: 'Apa bedanya Bimbelio dengan bimbel lainnya?',
    a: 'Bimbelio menggabungkan 3 layer support: Tutor berpengalaman, Mentor personal, dan AI Assistant. Kamu bisa belajar kapan aja dengan materi terstruktur, dapat bimbingan 1-on-1, plus bantuan AI untuk jawab pertanyaan instant 24/7.',
  },
  {
    q: 'Apakah ada garansi uang kembali?',
    a: 'Ya. Kami memberikan garansi 100% uang kembali dalam 7 hari pertama jika kamu merasa program kami tidak sesuai ekspektasi. Tanpa pertanyaan yang ribet.',
  },
  {
    q: 'Berapa lama akses program berlaku?',
    a: 'Akses program berbeda-beda tergantung paket yang kamu pilih. Paket Core Learning berlaku 3 bulan, Intensif 6 bulan, dan Super Intensif 12 bulan. Semua materi bisa diakses kapan saja selama masa aktif.',
  },
  {
    q: 'Apakah bisa konsultasi dulu sebelum daftar?',
    a: 'Tentu. Kamu bisa klik tombol "Konsultasi gratis" untuk chat dengan tim kami. Kami akan bantu kamu pilih program yang paling cocok sesuai target dan budget.',
  },
  {
    q: 'Bagaimana sistem tryout IRT bekerja?',
    a: 'Tryout kami menggunakan metode IRT (Item Response Theory) yang adaptif: soal akan menyesuaikan tingkat kesulitan berdasarkan kemampuan kamu. Hasil skor lebih akurat dan mirip dengan sistem UTBK asli.',
  },
  {
    q: 'Apakah materi sudah sesuai kurikulum terbaru?',
    a: 'Semua materi kami selalu diupdate mengikuti kurikulum terbaru dan pola soal UTBK/SNBT terkini. Tim kurikulum kami rutin review dan revisi materi setiap semester.',
  },
  {
    q: 'Bisa cicil pembayaran nggak?',
    a: 'Bisa banget. Kami bekerja sama dengan beberapa payment gateway yang menyediakan opsi cicilan 0%. Kamu bisa pilih cicilan 3, 6, atau 12 bulan sesuai kemampuan.',
  },
  {
    q: 'Gimana kalau stuck atau nggak paham materi?',
    a: 'Tenang, kamu bisa langsung chat AI Assistant untuk penjelasan instant, atau booking sesi 1-on-1 dengan Mentor. Ada juga forum diskusi dengan tutor yang dijawab maksimal 24 jam.',
  },
];

/** Pertanyaan umum — <details> native: dapat diakses keyboard tanpa JavaScript. */
export function FaqSection() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-judul"
      className="py-16 sm:py-24"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div
        className={cn(
          SITE_CONTAINER,
          'grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16',
        )}
      >
        <div className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start">
          <SeriesLabel icon={MessageCircleQuestion}>FAQ</SeriesLabel>
          <h2
            id="faq-judul"
            className={cn(sectionTitleClass, 'text-ink')}
          >
            Pertanyaan yang <Highlight>sering muncul.</Highlight>
          </h2>
          <p className="text-lg text-ink-muted">
            Masih ragu? Cek jawabannya di sini, atau tanya langsung ke tim kami.
            Konsultasinya gratis.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Button
              asChild
              size="lg"
            >
              <Link href="/price">Lihat paket belajar</Link>
            </Button>
            <ContactButton
              size="lg"
              variant="outline"
            />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {FAQ.map((item, i) => (
            <details
              key={item.q}
              className="group rounded-md border border-line bg-surface open:border-brand"
              open={i === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-md px-5 py-4 font-semibold text-ink focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  aria-hidden
                  className="flex size-8 shrink-0 items-center justify-center rounded-full border-[1.5px] border-line-strong text-ink transition-colors group-open:border-brand group-open:bg-brand group-open:text-brand-ink"
                >
                  <Plus className="size-4 transition-transform duration-150 group-open:rotate-45" />
                </span>
              </summary>
              <p className="max-w-[65ch] px-5 pb-5 text-ink-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
