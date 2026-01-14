'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
// import { motion } from 'framer-motion';
import {
  Brain,
  CheckCircle2,
  Clock,
  GraduationCap,
  MessageCircle,
  Send,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import Image from 'next/image';

interface Layer {
  layer: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface Tutor {
  name: string;
  university: string;
  major: string;
  quote: string;
  badge: string;
  color: string;
  image?: string;
}

interface MentorFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
  bullets: string[];
  color: string;
}

interface AIFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

export default function TutorsSection() {
  const { websiteSubCategory } = useWebsiteSubCategory();

  const isMainLandingPage =
    typeof window !== 'undefined' && window.location.pathname === '/';
  const mainColor = isMainLandingPage
    ? '#0091FF'
    : (websiteSubCategory?.main_color ?? '#0091FF');
  // const secondaryColor = isMainLandingPage
  //   ? '#5aa4dd'
  //   : (websiteSubCategory?.secondary_color ?? '#7C3AED');

  // 3 Layers System
  const layers: Layer[] = [
    {
      layer: 'LAYER 1',
      title: 'TUTOR',
      description: 'Ngajar materi & strategi soal',
      icon: <GraduationCap className="w-8 h-8" />,
      color: '#0091FF',
    },
    {
      layer: 'LAYER 2',
      title: 'MENTOR',
      description: 'Bimbingan strategis 360°',
      icon: <Users className="w-8 h-8" />,
      color: '#00C853',
    },
    {
      layer: 'LAYER 3',
      title: 'Bimbot AI',
      description: 'Support instant 24/7',
      icon: <Sparkles className="w-8 h-8" />,
      color: '#9C27B0',
    },
  ];

  // Tutors data - placeholder dengan data dummy
  const tutors: Tutor[] = [
    {
      name: 'Kak Ashel',
      university: 'Universitas Indonesia',
      major: 'Sastra Arab',
      quote: 'Bahasa itu bukan soal hafalan, tapi feeling. Let me show you!',
      badge: 'UI 2022',
      color: '#0091FF',
      image: '/tutors/ashel.webp', // Placeholder - ganti dengan path image sebenarnya
    },
    {
      name: 'Kak Erich',
      university: 'Universitas Indonesia',
      major: 'Ilmu Komputer',
      quote:
        'Matematika UTBK itu pattern recognition. Pola ketemu, soal selesai!',
      badge: 'UI 2022',
      color: '#FFA500',
      image: '/tutors/erich.webp', // Placeholder - ganti dengan path image sebenarnya
    },
    {
      name: 'Kak Rheza',
      university: 'Universitas Indonesia',
      major: 'Kedokteran',
      quote:
        'Penalaran Umum bukan IQ test. Ada triknya, dan aku tau rahasianya.',
      badge: 'UI 2020',
      color: '#00C853',
      image: '/tutors/rheza.webp', // Placeholder - ganti dengan path image sebenarnya
    },
    {
      name: 'Kak Okky',
      university: 'Universitas Indonesia',
      major: 'Sastra Arab',
      quote: 'Baca cepat, tangkep inti, jawab tepat. Itu rahasianya!',
      badge: 'UI 2019',
      color: '#E91E63',
      image: '/tutors/okky.webp', // Placeholder - ganti dengan path image sebenarnya
    },
    {
      name: 'Kak Syamil',
      university: 'Universitas Indonesia',
      major: 'Manajemen',
      quote: 'PPU itu bukan tes wawasan, tapi strategi eliminasi yang smart.',
      badge: 'UI 2019',
      color: '#9C27B0',
      image: '/tutors/syamil.webp', // Placeholder - ganti dengan path image sebenarnya
    },
  ];

  // Layer 2: Mentor Features
  const mentorFeatures: MentorFeature[] = [
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Strategic Planning',
      description:
        'Mapping target PTN, identifikasi kelemahan, buat roadmap 36 minggu yang breakthrough-focused.',
      bullets: [
        'Pilih target PTN & breakdown kebutuhan skor',
        'Analisis gap antara level saat ini vs target',
      ],
      color: '#0091FF',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Study Rhythm',
      description:
        'Bangun habits yang sustainable — nggak burnout, tapi consistently progressing setiap minggu.',
      bullets: [
        'Weekly study plan template + checklist',
        'Monitoring consistency & adjust pace sesuai kebutuhan',
      ],
      color: '#00C853',
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'Mindset Coaching',
      description:
        'Jaga mental tetap sharp — atasi procrastination, self-doubt, dan test anxiety yang biasa muncul.',
      bullets: [
        'Strategi mindset sebelum & sesudah practice test',
        'Dealing dengan imposter syndrome & failure recovery',
      ],
      color: '#FFA500',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Career Roadmap',
      description:
        'Nggak cuma masuk PTN — persiapan sukses di kuliah & strategi karir jangka panjang.',
      bullets: [
        'Tips adaptasi semester 1 di kampus',
        'Networking strategy & internship planning',
      ],
      color: '#9C27B0',
    },
  ];

  // Layer 3: AI Features
  const aiFeatures: AIFeature[] = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Instant Help 24/7',
      description:
        'Stuck jam 2 pagi? Bimbot siap jawab instant. Nggak perlu tunggu tutor online besok.',
      color: '#FFA500',
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Smart Error Analysis',
      description:
        'Setiap soal salah di-analisis — tahu persis mana konsep yang belum paham, mana strategy yang kurang.',
      color: '#0091FF',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Personalized Drill Queue',
      description:
        'Soal yang diberikan disesuaikan skill level & weakness pattern kamu. Nggak asal ngasih soal.',
      color: '#9C27B0',
    },
  ];

  return (
    <section
      id="tutors"
      className="py-24 px-4 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        {/* ========== HEADER SECTION ========== */}
        <div className="text-center mb-20">
          <Badge
            className="mb-8 px-6 py-2 text-sm font-bold text-white border-none inline-flex items-center gap-2"
            style={{ backgroundColor: mainColor }}
          >
            <GraduationCap className="w-4 h-4" />
            Experts Yang Ngajarin
          </Badge>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Mereka Sukses di PTN —
            <span
              className="block"
              style={{ color: mainColor }}
            >
              Sekarang Mereka Ngajarin Kamu
            </span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            <span className="font-bold text-gray-900">
              Fresh graduates dari UI/UGM/ITB
            </span>
            yang bukan cuma tahu caranya, tapi juga
            <span className="block mt-1">
              beneran relate sama struggle-nya calon mahasiswa.
            </span>
            <span className="block mt-3 font-semibold text-gray-700">
              3 layer support: Tutor yang ngajar, Mentor yang guide, Bimbot AI
              yang siap 24/7.
            </span>
          </p>
        </div>

        {/* ========== LAYER 1: TIM TUTOR BIMBELIO ========== */}
        <div className="mb-28">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge
              className="mb-6 border-none px-6 py-2 text-sm font-bold text-white inline-flex items-center gap-2"
              style={{ backgroundColor: mainColor }}
            >
              <GraduationCap className="w-4 h-4" />
              LAYER 1 - Expert Tutors
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Tutor yang Proven
              <span
                className="block"
                style={{ color: mainColor }}
              >
                Masuk PTN Top + Pahami Strategi Asli
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Bukan hanya pinter di akademik — mereka{' '}
              <span className="font-bold">
                tahu persis gimana strategi UTBK itu
              </span>
              , mana topik yang paling keluar, dan cara jenius jawab soalnya.
            </p>
          </div>

          {/* Tutors Grid - Improved Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {tutors.map((tutor, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 h-full flex flex-col border border-gray-100"
              >
                {/* Top Section - Image with Overlay */}
                <div
                  className="relative h-64 overflow-hidden bg-gradient-to-br"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${tutor.color}40 0%, ${tutor.color}10 100%)`,
                  }}
                >
                  {/* Background Accent */}
                  <div
                    className="absolute inset-0 opacity-5"
                    style={{ backgroundColor: tutor.color }}
                  />

                  {/* Image */}
                  {tutor.image ? (
                    <Image
                      src={tutor.image}
                      alt={tutor.name}
                      fill
                      loading="lazy"
                      quality={50}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Brain className="w-20 h-20 text-gray-300" />
                    </div>
                  )}

                  {/* Badge - Top Right Corner */}
                  <div className="absolute top-3 right-3 z-20">
                    <div
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm bg-white"
                      style={{
                        border: `2px solid ${tutor.color}`,
                      }}
                    >
                      <span
                        className="text-xs font-black"
                        style={{ color: tutor.color }}
                      >
                        {tutor.badge}
                      </span>
                    </div>
                  </div>

                  {/* Color Indicator Bar */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1"
                    style={{ backgroundColor: tutor.color }}
                  />
                </div>

                {/* Bottom Section */}
                <div className="p-5 bg-white flex flex-col flex-1">
                  {/* Name */}
                  <h4 className="text-lg font-black text-gray-900 mb-2">
                    {tutor.name}
                  </h4>

                  {/* Subject - with icon */}
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                    <Target
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: tutor.color }}
                    />
                    <p
                      className="text-xs font-bold uppercase tracking-wide"
                      style={{ color: tutor.color }}
                    >
                      {tutor.major}
                    </p>
                  </div>

                  {/* Quote - the insight */}
                  <p
                    className="text-sm leading-relaxed italic font-medium flex-1"
                    style={{
                      color:
                        tutor.color === '#9C27B0'
                          ? '#6B21A8'
                          : tutor.color === '#00C853'
                            ? '#059669'
                            : tutor.color === '#E91E63'
                              ? '#BE185D'
                              : tutor.color === '#FFA500'
                                ? '#D97706'
                                : '#1E40AF',
                    }}
                  >
                    💡 &quot;{tutor.quote}&quot;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========== LAYER 2: MENTOR SYSTEM ========== */}
        <div className="mb-28">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge
              className="mb-6 border-none px-6 py-2 text-sm font-bold text-white inline-flex items-center gap-2"
              style={{ backgroundColor: '#00C853' }}
            >
              <Users className="w-4 h-4" />
              LAYER 2 - Mentorship
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Beyond Teaching —
              <span
                className="block"
                style={{ color: '#00C853' }}
              >
                Strategic Guidance & Mental Coaching
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Tutor ngajarin materi, tapi kamu butuh lebih.{' '}
              <span className="font-bold">Mentor system kami</span> handle
              strategi PTN, time management, mindset, dan even career prep after
              graduation.
            </p>
          </div>

          {/* Mentor Features Grid - Improved 2-column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {mentorFeatures.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                {/* Top Colored Bar */}
                <div
                  className="h-1.5 w-full"
                  style={{ backgroundColor: feature.color }}
                />

                <div className="p-7">
                  {/* Icon & Title Row */}
                  <div className="flex items-start gap-4 mb-5">
                    {/* Icon Container */}
                    <div
                      className="w-14 h-14 rounded-3xl flex items-center justify-center text-white shadow-md flex-shrink-0 group-hover:shadow-lg transition-shadow"
                      style={{ backgroundColor: feature.color }}
                    >
                      {feature.icon}
                    </div>

                    {/* Title & Description */}
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-gray-900 mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div
                    className="h-0.5 w-8 rounded-full mb-5"
                    style={{ backgroundColor: feature.color + '40' }}
                  />

                  {/* Bullets with improved styling */}
                  <div className="space-y-3">
                    {feature.bullets.map((bullet, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-lg transition-colors duration-200"
                        style={{
                          backgroundColor: feature.color + '08',
                        }}
                      >
                        <CheckCircle2
                          className="w-5 h-5 mt-0.5 flex-shrink-0"
                          style={{ color: feature.color }}
                        />
                        <span className="text-sm font-semibold text-gray-800 leading-relaxed">
                          {bullet}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========== LAYER 3: AI MENTOR ========== */}
        <div
          className="mb-28"
          id="mentor-ai"
        >
          {/* Header */}
          <div className="text-center mb-16">
            <Badge
              className="mb-6 border-none px-6 py-2 text-sm font-bold text-white inline-flex items-center gap-2"
              style={{ backgroundColor: '#9C27B0' }}
            >
              <Sparkles className="w-4 h-4" />
              LAYER 3 - AI Support
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Support Nonstop —
              <span
                className="block"
                style={{ color: '#9C27B0' }}
              >
                Bimbot AI Ready 24/7
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Tutor & Mentor perlu istirahat, tapi{' '}
              <span className="font-bold">Bimbot AI nggak pernah tidur.</span>{' '}
              Instant jawab pertanyaan, analisis error pattern, recommend soal
              yang tepat sesuai kelemahan kamu.
            </p>
          </div>

          {/* Chat UI Visual */}
          <div className="max-w-2xl mx-auto">
            <div
              className="rounded-3xl overflow-hidden shadow-2xl border"
              style={{
                borderColor: '#9C27B030',
                backgroundColor: '#F8FAFC',
              }}
            >
              {/* Chat Header */}
              <div
                className="px-6 py-6 border-b flex items-center justify-between gap-6 bg-white"
                style={{
                  borderColor: '#9C27B015',
                }}
              >
                {/* Left: Logo Horizontal */}
                <div className="flex-shrink-0">
                  <Image
                    src="/logo-kecil.png"
                    alt="Bimbelio"
                    width={140}
                    height={48}
                    quality={100}
                    priority
                  />
                </div>

                {/* Right: Status */}
                <div className="flex items-center gap-2.5 ml-auto">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: '#9C27B0',
                      boxShadow: '0 0 8px rgba(156, 39, 176, 0.6)',
                      animation:
                        'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    }}
                  />
                  <span
                    className="text-sm font-bold tracking-wide"
                    style={{ color: '#9C27B0' }}
                  >
                    Online • Ready
                  </span>
                </div>
              </div>

              {/* Chat Messages Area */}
              <div
                className="px-6 py-8 space-y-4 bg-white"
                style={{ minHeight: '320px' }}
              >
                {/* User Message */}
                <div className="flex justify-end">
                  <div
                    className="max-w-xs px-4 py-3 rounded-3xl text-sm font-medium"
                    style={{
                      backgroundColor: '#9C27B0',
                      color: 'white',
                    }}
                  >
                    Kak, cara ngerjain soal PRU yang susah gitu gimana?
                  </div>
                </div>

                {/* AI Thinking */}
                <div className="flex justify-start">
                  <div
                    className="px-4 py-3 rounded-3xl"
                    style={{
                      backgroundColor: '#9C27B008',
                      border: '1px solid #9C27B020',
                    }}
                  >
                    <div className="flex gap-1.5 items-center">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: '#9C27B0',
                          animation:
                            'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        }}
                      />
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: '#9C27B0',
                          animation:
                            'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.3s',
                        }}
                      />
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: '#9C27B0',
                          animation:
                            'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.6s',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex justify-start">
                  <div
                    className="max-w-xs px-4 py-3 rounded-3xl text-sm leading-relaxed"
                    style={{
                      backgroundColor: '#9C27B010',
                      border: '1px solid #9C27B020',
                      color: '#1F2937',
                    }}
                  >
                    <p className="font-semibold mb-2">Oke, jadi begini:</p>
                    <p>1. Pahami struktur pertanyaan dulu</p>
                    <p>2. Identifikasi keyword penting</p>
                    <p>3. Eliminasi pilihan yang jelas salah</p>
                  </div>
                </div>

                {/* User Message 2 */}
                <div className="flex justify-end">
                  <div
                    className="max-w-xs px-4 py-3 rounded-3xl text-sm font-medium"
                    style={{
                      backgroundColor: '#9C27B0',
                      color: 'white',
                    }}
                  >
                    Bisa kasih contoh soal yang sesuai level aku?
                  </div>
                </div>

                {/* AI Response 2 */}
                <div className="flex justify-start">
                  <div
                    className="max-w-xs px-4 py-3 rounded-3xl text-sm"
                    style={{
                      backgroundColor: '#9C27B010',
                      border: '1px solid #9C27B020',
                      color: '#1F2937',
                    }}
                  >
                    <p className="font-semibold mb-2">✅ Siap!</p>
                    <p className="text-xs">
                      Saya sudah identify weakness pattern kamu dari 47 soal
                      terakhir.
                    </p>
                    <p className="text-xs mt-1">
                      Rekomendasi: 5 soal PRU level medium-hard ✓
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Input Area */}
              <div
                className="px-6 py-4 border-t flex gap-3"
                style={{ borderColor: '#9C27B010' }}
              >
                <input
                  type="text"
                  placeholder="Tanya apa aja..."
                  className="flex-1 px-4 py-2.5 rounded-full text-sm border outline-none focus:ring-2"
                  style={{
                    borderColor: '#9C27B020',
                    backgroundColor: '#F8FAFC',
                    color: '#1F2937',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#9C27B0';
                    e.target.style.backgroundColor = 'white';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#9C27B020';
                    e.target.style.backgroundColor = '#F8FAFC';
                  }}
                />
                <button
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-all hover:scale-110 duration-300"
                  style={{ backgroundColor: '#9C27B0' }}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Features Below Chat */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {aiFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="text-center p-6"
                >
                  {/* Icon Container */}
                  <div
                    className="w-12 h-12 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-md"
                    style={{ backgroundColor: feature.color + '15' }}
                  >
                    <div style={{ color: feature.color }}>{feature.icon}</div>
                  </div>

                  {/* Title */}
                  <h4 className="font-black text-gray-900 mb-2">
                    {feature.title}
                  </h4>

                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========== BOTTOM CTA ========== */}
        <div className="text-center">
          <div
            className="rounded-3xl p-8 md:p-12 max-w-5xl mx-auto border-2 shadow-lg overflow-hidden relative"
            style={{
              borderColor: `${mainColor}30`,
              backgroundColor: `${mainColor}05`,
            }}
          >
            {/* Background Accent Elements */}
            <div
              className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
              style={{ backgroundColor: mainColor, filter: 'blur(40px)' }}
            />
            <div
              className="absolute bottom-0 left-0 w-40 h-40 rounded-full opacity-10"
              style={{ backgroundColor: '#00C853', filter: 'blur(50px)' }}
            />

            {/* Content */}
            <div className="relative z-10">
              <div className="mb-6 flex items-center justify-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-3xl shadow-md"
                  style={{ backgroundColor: mainColor }}
                >
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-2xl md:text-3xl font-black text-gray-900">
                  Complete Support Ecosystem
                </h4>
              </div>

              <p className="mb-8 text-lg md:text-xl leading-relaxed text-gray-700 max-w-3xl mx-auto">
                <span className="font-black text-gray-900">
                  Experts di TOP + support yang lengkap.
                </span>
                Dari Tutor yang proven sukses di PTN, Mentor yang guide strategi
                & mindset, sampai Bimbot AI yang available 24/7.
                <span className="block mt-3 font-semibold text-gray-900">
                  Kamu nggak sendirian di perjalanan ini.
                </span>
              </p>

              {/* Feature Pills */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
                <div
                  className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-md transition-all"
                  style={{
                    backgroundColor: layers[0].color + '20',
                    border: `2px solid ${layers[0].color}40`,
                    color: layers[0].color,
                  }}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Expert Tutors</span>
                </div>

                <div
                  className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-md transition-all"
                  style={{
                    backgroundColor: layers[1].color + '20',
                    border: `2px solid ${layers[1].color}40`,
                    color: layers[1].color,
                  }}
                >
                  <Users className="w-4 h-4" />
                  <span>Strategic Mentors</span>
                </div>

                <div
                  className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-md transition-all"
                  style={{
                    backgroundColor: layers[2].color + '20',
                    border: `2px solid ${layers[2].color}40`,
                    color: layers[2].color,
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Bimbot AI 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
