'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { HelpCircle, Plus, Minus } from 'lucide-react';
import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQSection: React.FC = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const mainColor = websiteSubCategory?.main_color ?? '#0091FF';

  const faqs: FAQItem[] = [
    {
      question: 'Apa bedanya Bimbelio dengan bimbel lainnya?',
      answer:
        'Bimbelio menggabungkan 3 layer support: Tutor berpengalaman, Mentor personal, dan AI Assistant. Kamu bisa belajar kapan aja dengan materi terstruktur, dapat bimbingan 1-on-1, plus bantuan AI untuk jawab pertanyaan instant 24/7.',
    },
    {
      question: 'Apakah ada garansi uang kembali?',
      answer:
        'Ya! Kami memberikan garansi 100% uang kembali dalam 7 hari pertama jika kamu merasa program kami tidak sesuai ekspektasi. Tanpa pertanyaan yang ribet.',
    },
    {
      question: 'Berapa lama akses program berlaku?',
      answer:
        'Akses program berbeda-beda tergantung paket yang kamu pilih. Paket Core Learning berlaku 3 bulan, Intensif 6 bulan, dan Super Intensif 12 bulan. Semua materi bisa diakses kapan saja selama masa aktif.',
    },
    {
      question: 'Apakah bisa konsultasi dulu sebelum daftar?',
      answer:
        'Tentu! Kamu bisa klik tombol "Konsultasi Dulu" untuk chat dengan tim kami. Kami akan bantu kamu pilih program yang paling cocok sesuai target dan budget.',
    },
    {
      question: 'Bagaimana sistem Try Out IRT bekerja?',
      answer:
        'Try Out kami menggunakan metode IRT (Item Response Theory) yang adaptif - soal akan menyesuaikan tingkat kesulitan berdasarkan kemampuan kamu. Hasil skor lebih akurat dan mirip dengan sistem UTBK asli.',
    },
    {
      question: 'Apakah materi sudah sesuai kurikulum terbaru?',
      answer:
        'Semua materi kami selalu diupdate mengikuti kurikulum terbaru dan pola soal UTBK/SNBT terkini. Tim kurikulum kami rutin review dan revisi materi setiap semester.',
    },
    {
      question: 'Bisa cicil pembayaran nggak?',
      answer:
        'Bisa banget! Kami bekerja sama dengan beberapa payment gateway yang menyediakan opsi cicilan 0%. Kamu bisa pilih cicilan 3, 6, atau 12 bulan sesuai kemampuan.',
    },
    {
      question: 'Gimana kalau stuck atau nggak paham materi?',
      answer:
        'Tenang! Kamu bisa langsung chat AI Assistant untuk penjelasan instant, atau booking sesi 1-on-1 dengan Mentor. Ada juga forum diskusi dengan tutor yang dijawab maksimal 24 jam.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 md:py-20 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white mb-4"
            style={{ backgroundColor: mainColor }}
          >
            <HelpCircle className="w-4 h-4" />
            Tapi Kalo...
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Jawaban Buat <span style={{ color: mainColor }}>"Tapi Kalo..."</span> Kamu
          </h2>

          <p className="text-gray-600 max-w-xl mx-auto">
            Kamu mungkin masih mikir "tapi kalo nggak cocok gimana?" atau
            "kalo stuck gimana?". Cek dulu jawabannya di sini.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-3xl border-2 border-gray-100 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-5 md:px-6 py-4 flex items-start justify-between gap-4 text-left hover:bg-gray-100 transition-colors"
              >
                <span className="font-semibold text-sm md:text-base text-gray-900 flex-1">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <Minus
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    style={{ color: mainColor }}
                  />
                ) : (
                  <Plus
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    style={{ color: mainColor }}
                  />
                )}
              </button>

              {openIndex === index && (
                <div className="px-5 md:px-6 pb-4 pt-1">
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        {/* <div className="mt-10 text-center">
          <p className="text-sm text-gray-500 mb-4">Pertanyaan kamu belum kejawab?</p>
          <a
            href="https://www.bimbelio.com/link/komunitas"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 rounded-3xl font-semibold text-white transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: mainColor }}
          >
            Tanya Langsung di W →
          </a>
        </div> */}
      </div>
    </section>
  );
};

export default FAQSection;
