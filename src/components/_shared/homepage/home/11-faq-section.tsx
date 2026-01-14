'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  DollarSign,
  HelpCircle,
  MessageCircle,
  PlayCircle,
  Shield,
  Smartphone,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

interface FAQItem {
  icon: React.ReactNode;
  category: string;
  title: string;
  answer: string;
  color: string;
  isPopular?: boolean;
}

interface Solution {
  title: string;
  description: string;
  color: string;
}

export default function FAQSection() {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [expandedId, setExpandedId] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const isMainLandingPage =
    typeof window !== 'undefined' && window.location.pathname === '/';
  const mainColor = isMainLandingPage
    ? '#0091FF'
    : (websiteSubCategory?.main_color ?? '#0091FF');
  const secondaryColor = isMainLandingPage
    ? '#5aa4dd'
    : (websiteSubCategory?.secondary_color ?? '#7C3AED');

  // Expanded FAQ with Categories
  const faqs: FAQItem[] = [
    // Program Category
    {
      icon: <Calendar className="w-5 h-5" />,
      category: 'Program',
      title: 'Berapa lama program ini?',
      answer:
        '9 bulan intensif hingga kedinasan, mulai 21 Nov 2025. Dibagi 3 fase: Bimbel (persiapan), Intensif (fokus materi), Super (final push kedinasan).',
      color: '#0091FF',
      isPopular: true,
    },
    {
      icon: <Users className="w-5 h-5" />,
      category: 'Program',
      title: 'Livestream vs Liveclass, pilih mana?',
      answer:
        'Livestream (799K) = Unlimited siswa, format besar, harga lebih terjangkau. Liveclass (1.499K) = Max 50 siswa, personal attention, priority support. Dua-duanya 9 bulan hingga kedinasan.',
      color: '#0091FF',
      isPopular: true,
    },
    {
      icon: <Trophy className="w-5 h-5" />,
      category: 'Program',
      title: 'Kalau ketinggalan kelas, gimana?',
      answer:
        'Tenang! Semua sesi auto-rekam HD. Akses kapan aja, review ulang sepuasnya. Bisa catch-up dengan kecepatan kamu sendiri.',
      color: '#0091FF',
    },

    // Harga Category
    {
      icon: <DollarSign className="w-5 h-5" />,
      category: 'Harga',
      title: 'Bisa cicil nggak?',
      answer:
        'Bisa! Cicilan 3× tanpa ribet, tanpa bunga. Livestream (799K) = 3× Rp266K. Liveclass (1.499K) = 3× Rp499K. Bank transfer & e-wallet diterima.',
      color: '#E91E63',
      isPopular: true,
    },
    {
      icon: <Shield className="w-5 h-5" />,
      category: 'Harga',
      title: 'Harga bakal berubah nggak?',
      answer:
        'Nope! Harga fixed untuk peserta yang daftar sekarang. Dijamin nggak ada biaya tersembunyi atau tambahan mendadak.',
      color: '#E91E63',
    },
    {
      icon: <CheckCircle2 className="w-5 h-5" />,
      category: 'Harga',
      title: 'Ada garansi uang kembali?',
      answer:
        'Iya! Trial gratis 7 hari untuk cek apakah cocok. Kalau nggak puas, uang kembali 100%. Nggak ada syarat yang ribet.',
      color: '#E91E63',
    },

    // Teknis Category
    {
      icon: <Smartphone className="w-5 h-5" />,
      category: 'Teknis',
      title: 'Cuma pake HP bisa?',
      answer:
        'Bisa banget! Platform kami 100% mobile-friendly. Belajar dari HP, laptop, tablet—semua support. Internet stabil aja cukup.',
      color: '#00C853',
      isPopular: true,
    },
    {
      icon: <PlayCircle className="w-5 h-5" />,
      category: 'Teknis',
      title: 'Bedanya sama video on-demand?',
      answer:
        'Live = Bisa tanya langsung, diskusi real-time, dapat motivasi bareng teman. Video on-demand = Anda sendiri, nggak ada interaksi. Bimbelio? Live + Rekaman unlimited!',
      color: '#00C853',
    },
    {
      icon: <Zap className="w-5 h-5" />,
      category: 'Teknis',
      title: 'PRINTS System itu apa?',
      answer:
        'Framework belajar smart kami: Prioritize (fokus materi penting), Rhythm (konsisten), Iterate (AI feedback), Navigate (roadmap jelas), Test (IRT-based), Support (24/7). Semua terintegrasi.',
      color: '#00C853',
    },

    // Jadwal & Support Category
    {
      icon: <MessageCircle className="w-5 h-5" />,
      category: 'Support',
      title: 'Kalau ada masalah, support siapa?',
      answer:
        'Tim support 24/7 siap membantu via chat, WhatsApp, atau email. Response time < 5 menit untuk urgent. Liveclass dapet priority support.',
      color: '#9C27B0',
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      category: 'Support',
      title: 'Bisa konsultasi one-on-one?',
      answer:
        'Iya! Liveclass ada konseling dengan tutor alumni PTN. Livestream bisa join grup diskusi atau upgrade jadi Liveclass kapan saja.',
      color: '#9C27B0',
    },
  ];

  // Get unique categories
  const categories = ['all', ...new Set(faqs.map((f) => f.category))];

  // Filter FAQs based on selected category
  const filteredFaqs =
    selectedCategory === 'all'
      ? faqs
      : faqs.filter((f) => f.category === selectedCategory);

  // Popular FAQs (show 3 as featured)
  const popularFaqs = faqs.filter((f) => f.isPopular).slice(0, 3);

  // Solutions - Takut Nggak Konsisten? Kami Punya Solusinya
  const solutions: Solution[] = [
    {
      title: 'Takut nggak konsisten?',
      description: 'AI Mentor ngingetin + progress tracking real-time',
      color: '#0091FF',
    },
    {
      title: 'Takut materi terlalu cepat?',
      description: 'Rekaman unlimited + bisa konseling dengan tutor',
      color: '#00C853',
    },
    {
      title: 'Takut stuck di satu materi?',
      description: 'AI kasih rekomendasi drill soal yang tepat',
      color: '#FFA500',
    },
    {
      title: 'Takut nggak ada progress?',
      description: 'TO IRT-based + weekly report yang jelas',
      color: '#9C27B0',
    },
  ];

  return (
    <section
      id="faq"
      className="py-24 px-4 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge
            className="mb-6 px-6 py-2 text-sm font-bold text-white border-none"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            <HelpCircle className="w-4 h-4 mr-2 inline" />
            Pertanyaan & Jawaban
          </Badge>

          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Masih Ada Yang —
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Bikin Kamu Ragu?
            </span>
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Jawaban jujur untuk setiap keraguan kamu.{' '}
            <span className="font-bold">Nggak ada yang disembunyikan.</span>
          </p>

          {/* Info Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full shadow-md"
              style={{
                backgroundColor: `${mainColor}15`,
                border: `1.5px solid ${mainColor}30`,
              }}
            >
              <CheckCircle2
                className="w-4 h-4"
                style={{ color: mainColor }}
              />
              <span
                className="text-sm font-semibold"
                style={{ color: mainColor }}
              >
                Jawaban Jujur
              </span>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full shadow-md"
              style={{
                backgroundColor: '#00C85315',
                border: '1.5px solid #00C85330',
              }}
            >
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-600">
                100% Transparan
              </span>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full shadow-md"
              style={{
                backgroundColor: '#9C27B015',
                border: '1.5px solid #9C27B030',
              }}
            >
              <Zap className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-600">
                Response Cepat
              </span>
            </div>
          </div>
        </div>

        {/* Popular FAQs Section */}
        {popularFaqs.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                🔥 Paling Sering Ditanya
              </h3>
              <p className="text-gray-600">
                Jawaban untuk pertanyaan yang paling banyak diajukan
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {popularFaqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl p-6 border-2 hover:shadow-md transition-all duration-300"
                  style={{
                    borderColor: `${faq.color}30`,
                    backgroundColor: `${faq.color}05`,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-3xl flex items-center justify-center text-white mb-4 shadow-md"
                    style={{
                      background: `linear-gradient(135deg, ${faq.color}, ${faq.color}dd)`,
                    }}
                  >
                    {faq.icon}
                  </div>

                  <h4 className="text-base font-bold text-gray-900 mb-3">
                    {faq.title}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 text-sm md:text-base ${
                  selectedCategory === cat
                    ? 'text-white shadow-lg'
                    : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                }`}
                style={{
                  background:
                    selectedCategory === cat
                      ? `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`
                      : undefined,
                }}
              >
                {cat === 'all' ? 'Semua' : cat}
              </button>
            ))}
          </div>

          {/* Accordion FAQ List */}
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl border-2 overflow-hidden transition-all duration-300"
                style={{
                  borderColor:
                    expandedId === index ? faq.color : `${faq.color}20`,
                  boxShadow:
                    expandedId === index ? `0 8px 24px ${faq.color}20` : 'none',
                }}
              >
                <button
                  onClick={() =>
                    setExpandedId(expandedId === index ? null : index)
                  }
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4 text-left flex-1">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${faq.color}, ${faq.color}dd)`,
                      }}
                    >
                      {faq.icon}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gray-900 text-left">
                        {faq.title}
                      </h4>
                      <p className="text-xs font-semibold text-gray-500 mt-1">
                        {faq.category}
                      </p>
                    </div>
                  </div>

                  <ChevronDown
                    className={`w-5 h-5 text-gray-600 transition-transform duration-300 flex-shrink-0`}
                    style={{
                      transform:
                        expandedId === index
                          ? 'rotate(180deg)'
                          : 'rotate(0deg)',
                      color: faq.color,
                    }}
                  />
                </button>

                {expandedId === index && (
                  <div
                    className="px-6 py-4 border-t-2 bg-gradient-to-br"
                    style={{
                      borderColor: `${faq.color}20`,
                      background: `linear-gradient(135deg, ${faq.color}05, white)`,
                    }}
                  >
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Solutions Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
              Takut Nggak Konsisten?
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kami punya solusi untuk setiap kekhawatiran kamu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {solutions.map((solution, index) => (
              <div
                key={index}
                className="rounded-3xl p-6 text-white relative overflow-hidden"
                style={{
                  background: solution.color,
                }}
              >
                {/* Decorative element */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12" />

                <h4 className="text-lg font-black mb-2 relative z-10">
                  {solution.title}
                </h4>
                <p className="text-sm opacity-95 relative z-10">
                  {solution.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section - Redirect to FloatingContactButton */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-md p-8 md:p-12">
            {/* Icon Header */}
            <div className="mb-4 flex items-center justify-center gap-3">
              <div
                className="h-12 w-12 rounded-3xl flex items-center justify-center shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                }}
              >
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-gray-900">
                Masih Ada Pertanyaan?
              </h3>
            </div>

            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              Lihat tombol floating di kanan bawah layar! Klik untuk langsung
              chat WhatsApp, Instagram, atau konsultasi gratis.
            </p>

            {/* Visual Indicator */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-full border-2 border-green-200">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute" />
                  <div className="w-3 h-3 bg-green-500 rounded-full relative" />
                </div>
                <span className="text-sm font-bold text-gray-700">
                  Tombol Floating di Kanan Bawah
                </span>
                <span className="text-2xl">👉</span>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="pt-6 border-t-2 border-gray-100 flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="font-semibold text-gray-700">
                  Response &lt; 5 Menit
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="font-semibold text-gray-700">
                  Support 24/7
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-500" />
                <span className="font-semibold text-gray-700">
                  Konsultasi Gratis
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
