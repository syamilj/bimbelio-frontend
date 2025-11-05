'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
// import { motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle2,
  HelpCircle,
  MessageCircle,
  PiggyBank,
  PlayCircle,
  Shield,
  Smartphone,
  Trophy,
  Zap,
} from 'lucide-react';

interface Question {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

interface Solution {
  title: string;
  description: string;
  color: string;
}

export default function FAQSection() {
  const { websiteSubCategory } = useWebsiteSubCategory();

  const isMainLandingPage =
    typeof window !== 'undefined' && window.location.pathname === '/';
  const mainColor = isMainLandingPage
    ? '#0091FF'
    : (websiteSubCategory?.main_color ?? '#0091FF');
  const secondaryColor = isMainLandingPage
    ? '#5aa4dd'
    : (websiteSubCategory?.secondary_color ?? '#7C3AED');

  // Top 6 Questions - Updated without guarantee/proof claims
  const questions: Question[] = [
    {
      icon: <Trophy className="w-6 h-6" />,
      title: 'Kalau ketinggalan kelas, gimana?',
      description:
        'Tenang! Semua sesi auto-rekam. Akses kapan aja, review ulang sepuasnya.',
      color: '#0091FF',
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: 'Cuma pake HP bisa?',
      description:
        'Bisa banget! Platform kami mobile-friendly 100%. Belajar di mana aja nyaman.',
      color: '#00C853',
    },
    {
      icon: <PlayCircle className="w-6 h-6" />,
      title: 'Bedanya sama video on-demand?',
      description:
        'Live = Bisa tanya langsung ke tutor, diskusi real-time, dapat motivasi bareng teman.',
      color: '#FFA500',
    },
    {
      icon: <PiggyBank className="w-6 h-6" />,
      title: 'Bisa cicil nggak?',
      description:
        'Bisa! Cicilan 3× tanpa ribet, tanpa bunga. Bank transfer & e-wallet juga diterima.',
      color: '#E91E63',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'PRINTS System itu apa?',
      description:
        'Framework belajar cerdas: Prioritize materi penting, Rhythm konsisten, Iterate dengan AI feedback, Navigate roadmap jelas, Test IRT-based, Support 24/7.',
      color: '#9C27B0',
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: 'Jadwal kelasnya kapan?',
      description:
        'Livestream: Sen–Jum 18:30–21:30. Liveclass: Sen–Kam 19:00–21:00. Fleksibel, lihat rekaman juga bisa.',
      color: '#0091FF',
    },
  ];

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
            FAQ & Solutions
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

          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Aku jawab semua keraguan kamu dengan{' '}
            <span className="font-bold">jujur dan transparan</span>.
            <br />
            <span className="font-bold text-gray-900">
              Nggak ada yang disembunyikan. Ini commitment aku ke kamu.
            </span>
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
                Fast Response
              </span>
            </div>
          </div>
        </div>

        {/* Questions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {questions.map((question, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border-2 hover:shadow-md transition-all duration-300"
              style={{
                borderColor: `${question.color}20`,
              }}
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-4 shadow-md"
                style={{
                  background: `linear-gradient(135deg, ${question.color}, ${question.color}dd)`,
                }}
              >
                {question.icon}
              </div>

              {/* Content */}
              <h3 className="text-lg font-black text-gray-900 mb-2">
                {question.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {question.description}
              </p>
            </div>
          ))}
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
                className="rounded-2xl p-6 text-white relative overflow-hidden"
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
                className="h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg"
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
