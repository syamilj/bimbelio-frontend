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
  const secondaryColor = isMainLandingPage
    ? '#5aa4dd'
    : (websiteSubCategory?.secondary_color ?? '#7C3AED');

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
        'Fokus mana dulu, skip mana yang gak penting, prioritas sesuai target PTN-mu.',
      bullets: [
        'Analisis kekuatan & kelemahan',
        'Roadmap personalized 36 minggu',
      ],
      color: '#0091FF',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Time Management',
      description:
        'Fokus mana dulu, skip mana yang gak penting, prioritas sesuai target PTN-mu.',
      bullets: ['Weekly planner template', 'Produktivitas tanpa burnout'],
      color: '#00C853',
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'Mental Coaching',
      description:
        'Jaga motivasi, atasi stress, dan bangun mindset winner untuk jangka panjang.',
      bullets: ['Strategi atasi tekanan UTBK', 'Growth mindset & resilience'],
      color: '#FFA500',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Karir Pasca-PTN',
      description:
        'Persiapan kehidupan kampus, networking, dan strategi karir setelah lulus PTN.',
      bullets: [
        'Tips adaptasi kuliah semester 1',
        'Roadmap karir sesuai jurusan',
      ],
      color: '#9C27B0',
    },
  ];

  // Layer 3: AI Features
  const aiFeatures: AIFeature[] = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Instant Response',
      description: 'Tanya jam 2 pagi pun dijawab instant. No waiting time.',
      color: '#FFA500',
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Error Analysis',
      description: 'Analisis pola kesalahan & kasih tips improve specific.',
      color: '#0091FF',
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Smart Drill Recommendation',
      description: 'Rekomendasikan latihan soal sesuai kelemahanmu.',
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
            <Users className="w-4 h-4" />
            3-Layer Support System
          </Badge>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Platform Canggih
            <span className="block">Tapi Siapa Yang Ngajarin?</span>
            <br />
            <span style={{ color: mainColor }}>
              3 Layer Support yang Saling Melengkapi
            </span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            <span className="font-bold text-gray-900">
              Tools doang nggak cukup.
            </span>{' '}
            Kamu butuh
            <span className="block mt-1">
              <span className="font-bold">Tutor</span> yang ngajar materi,{' '}
              <span className="font-bold">Mentor</span> yang bimbing strategi,
              dan <span className="font-bold">Bimbot AI</span> yang support
              24/7.
            </span>
          </p>

          {/* Three Dots Indicator */}
          <div className="flex items-center justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: [mainColor, '#00C853', '#9C27B0'][i],
                }}
              />
            ))}
          </div>
        </div>

        {/* ========== 3 LAYERS SYSTEM CARDS ========== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-28 justify-items-center">
          {layers.map((layer, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 w-full max-w-sm"
            >
              {/* Top Accent Bar */}
              <div
                className="h-2 w-full"
                style={{ backgroundColor: layer.color }}
              />

              <div className="p-6 text-center">
                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-white mb-4 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300 mx-auto"
                  style={{ backgroundColor: layer.color }}
                >
                  {layer.icon}
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div
                        className="h-1 w-1 rounded-full"
                        style={{ backgroundColor: layer.color }}
                      />
                      <p
                        className="text-xs font-bold uppercase tracking-wider"
                        style={{ color: layer.color }}
                      >
                        {layer.layer}
                      </p>
                      <div
                        className="h-1 w-1 rounded-full"
                        style={{ backgroundColor: layer.color }}
                      />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">
                      {layer.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {layer.description}
                    </p>
                  </div>

                  {/* Divider */}
                  <div
                    className="h-0.5 w-12 rounded-full mx-auto"
                    style={{ backgroundColor: layer.color + '40' }}
                  />

                  {/* Info Box */}
                  <div
                    className="rounded-lg p-3 text-center"
                    style={{
                      backgroundColor: layer.color + '08',
                      border: `1.5px solid ${layer.color}20`,
                    }}
                  >
                    <p className="text-xs font-semibold text-gray-700">
                      {index === 0 && 'Live Class & Video Content'}
                      {index === 1 && 'Strategic Guidance & Planning'}
                      {index === 2 && 'Instant Help Anytime'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ========== LAYER 1: TIM TUTOR BIMBELIO ========== */}
        <div className="mb-24">
          {/* Header */}
          <div className="text-center mb-14">
            <Badge
              className="mb-6 border-none px-6 py-2 text-sm font-bold text-white inline-flex items-center gap-2"
              style={{ backgroundColor: mainColor }}
            >
              <GraduationCap className="w-4 h-4" />
              Layer 1 - Tim Tutor Bimbelio
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Expert Teaching —{' '}
              <span style={{ color: mainColor }}>Bimbelio Tutors</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Fresh graduates dari UI/UGM/ITB yang beneran paham struggle UTBK.{' '}
              <span className="font-bold">
                Mereka bukan hanya ngajar, tapi jadi mentor yang relate-able dan
                supportif.
              </span>{' '}
              Sharing real experience, proven strategies, dan personal guidance
              untuk sukses di PTN.
            </p>
          </div>

          {/* Tutors Grid - Improved Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {tutors.map((tutor, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 h-full flex flex-col"
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

                  {/* Badge - Top Right Corner with UI Logo */}
                  <div className="absolute top-3 right-3 z-20">
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg shadow-lg backdrop-blur-sm bg-white"
                      style={{
                        border: `2px solid ${tutor.color}`,
                      }}
                    >
                      <Image
                        src="/tutors/ui.webp"
                        alt="UI"
                        width={16}
                        height={16}
                        loading="lazy"
                        quality={40}
                      />
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

                  {/* Major - with icon */}
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                    <GraduationCap
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

                  {/* Quote */}
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
                    &quot;{tutor.quote}&quot;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========== LAYER 2: MENTOR SYSTEM ========== */}
        <div className="mb-24">
          {/* Header */}
          <div className="text-center mb-14">
            <Badge
              className="mb-6 border-none px-6 py-2 text-sm font-bold text-white inline-flex items-center gap-2"
              style={{ backgroundColor: '#00C853' }}
            >
              <Users className="w-4 h-4" />
              Layer 2 - Mentor System
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Beyond Teaching —{' '}
              <span style={{ color: '#00C853' }}>Strategic Guidance</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Tutor ngajarin materi, tapi kamu butuh lebih dari itu.{' '}
              <span className="font-bold">
                Mentor system kami memberikan strategic planning, time
                management, mental coaching, dan career guidance
              </span>{' '}
              untuk memastikan kamu siap 100% untuk PTN impian.
            </p>
          </div>

          {/* Mentor Features Grid - Improved 2-column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {mentorFeatures.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
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
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-md flex-shrink-0 group-hover:shadow-lg transition-shadow"
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
          className="mb-24"
          id="mentor-ai"
        >
          {/* Header */}
          <div className="text-center mb-14">
            <Badge
              className="mb-6 border-none px-6 py-2 text-sm font-bold text-white inline-flex items-center gap-2"
              style={{ backgroundColor: '#9C27B0' }}
            >
              <Sparkles className="w-4 h-4" />
              Layer 3 - Bimbot AI
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Always Available —{' '}
              <span style={{ color: '#9C27B0' }}>Bimbot AI 24/7</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Tutor & Mentor butuh sleep, tapi{' '}
              <span className="font-bold">
                Bimbot AI siap standby kapan saja.
              </span>{' '}
              Instant jawab pertanyaan, analisis error pattern, dan
              rekomendasikan drill soal yang paling cocok untuk kelemahan
              spesifik kamu.
            </p>
          </div>

          {/* AI Features Grid - Enhanced 3-Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {aiFeatures.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
              >
                {/* Top Colored Bar */}
                <div
                  className="h-1.5 w-full"
                  style={{ backgroundColor: feature.color }}
                />

                {/* Content */}
                <div className="p-8 text-center flex flex-col flex-1">
                  {/* Icon Container */}
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-5 shadow-md group-hover:shadow-lg transition-shadow group-hover:scale-110 duration-300"
                    style={{ backgroundColor: feature.color }}
                  >
                    <div className="text-white text-2xl">{feature.icon}</div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-black text-gray-900 mb-3">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-1">
                    {feature.description}
                  </p>

                  {/* AI Badge */}
                  <div
                    className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold shadow-sm"
                    style={{
                      backgroundColor: feature.color + '15',
                      border: `1.5px solid ${feature.color}30`,
                      color: feature.color,
                    }}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI-Powered</span>
                  </div>
                </div>
              </div>
            ))}
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
                  className="flex h-12 w-12 items-center justify-center rounded-xl shadow-md"
                  style={{ backgroundColor: mainColor }}
                >
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-2xl md:text-3xl font-black text-gray-900">
                  The Complete Support System
                </h4>
              </div>

              <p className="mb-8 text-lg md:text-xl leading-relaxed text-gray-700 max-w-3xl mx-auto">
                <span className="font-black text-gray-900">
                  3 layer support system yang saling melengkapi
                </span>
                — dari Tutor yang ngajarin materi, Mentor yang guide strategi,
                hingga Bimbot AI yang support 24/7. Kamu
                <span className="block mt-1 font-bold text-gray-900">
                  nggak akan merasa sendirian
                </span>
                dalam perjalanan ke PTN impian.
              </p>

              {/* Badges - Feature Pills */}
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
                  <span>Live Teaching</span>
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
                  <span>Personal Guidance</span>
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
