import { ContactButton } from '@/components/layout/site/contact';
import { Plus } from 'lucide-react';
import { MarketingSection } from '../section';

// Teks FAQ dari materi resmi Bimbelio (verbatim). Klaim garansi, durasi akses,
// dan cicilan perlu dijaga sama dengan paket aktif — lihat PLAN.md §8.
export const FAQ = [
  {
    q: 'Apa bedanya Bimbelio dengan bimbel lainnya?',
    a: 'Bimbelio menggabungkan 3 layer support: Tutor berpengalaman, Mentor personal, dan AI Assistant. Kamu bisa belajar kapan aja dengan materi terstruktur, dapat bimbingan 1-on-1, plus bantuan AI untuk jawab pertanyaan instant 24/7.',
  },
  {
    q: 'Apakah ada garansi uang kembali?',
    a: 'Ya! Kami memberikan garansi 100% uang kembali dalam 7 hari pertama jika kamu merasa program kami tidak sesuai ekspektasi. Tanpa pertanyaan yang ribet.',
  },
  {
    q: 'Berapa lama akses program berlaku?',
    a: 'Akses program berbeda-beda tergantung paket yang kamu pilih. Paket Core Learning berlaku 3 bulan, Intensif 6 bulan, dan Super Intensif 12 bulan. Semua materi bisa diakses kapan saja selama masa aktif.',
  },
  {
    q: 'Apakah bisa konsultasi dulu sebelum daftar?',
    a: 'Tentu! Kamu bisa klik tombol "Konsultasi gratis" untuk chat dengan tim kami. Kami akan bantu kamu pilih program yang paling cocok sesuai target dan budget.',
  },
  {
    q: 'Bagaimana sistem Try Out IRT bekerja?',
    a: 'Try Out kami menggunakan metode IRT (Item Response Theory) yang adaptif - soal akan menyesuaikan tingkat kesulitan berdasarkan kemampuan kamu. Hasil skor lebih akurat dan mirip dengan sistem UTBK asli.',
  },
  {
    q: 'Apakah materi sudah sesuai kurikulum terbaru?',
    a: 'Semua materi kami selalu diupdate mengikuti kurikulum terbaru dan pola soal UTBK/SNBT terkini. Tim kurikulum kami rutin review dan revisi materi setiap semester.',
  },
  {
    q: 'Bisa cicil pembayaran nggak?',
    a: 'Bisa banget! Kami bekerja sama dengan beberapa payment gateway yang menyediakan opsi cicilan 0%. Kamu bisa pilih cicilan 3, 6, atau 12 bulan sesuai kemampuan.',
  },
  {
    q: 'Gimana kalau stuck atau nggak paham materi?',
    a: 'Tenang! Kamu bisa langsung chat AI Assistant untuk penjelasan instant, atau booking sesi 1-on-1 dengan Mentor. Ada juga forum diskusi dengan tutor yang dijawab maksimal 24 jam.',
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
    <MarketingSection
      id="faq"
      tone="surface"
      title="Pertanyaan yang sering muncul"
      description="Masih ragu? Cek jawabannya di sini, atau tanya langsung ke tim kami."
      headerAction={<ContactButton variant="outline" />}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="divide-y divide-line rounded-lg border border-line">
        {FAQ.map((item, i) => (
          <details
            key={item.q}
            className="group"
            open={i === 0}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-ink [&::-webkit-details-marker]:hidden">
              {item.q}
              <Plus
                className="size-5 shrink-0 text-ink-muted transition-transform duration-150 group-open:rotate-45"
                aria-hidden
              />
            </summary>
            <p className="px-5 pb-5 text-ink-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </MarketingSection>
  );
}
