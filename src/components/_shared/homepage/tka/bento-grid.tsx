'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle,
  FileText,
  MessageCircle,
  Play,
  Target,
  Video,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

interface Feature {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  size: 'large' | 'medium';
  metrics?: Array<{ label: string; value: string }>;
  features?: string[];
  highlight?: string;
}

const BentoGrid: React.FC = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const router = useRouter();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#7C3AED';

  // Navigation handler untuk button CTA
  const handlePricingNavigation = () => {
    router.push('/price');
  };

  const features: Feature[] = [
    {
      id: 'assessment',
      title: 'Diagnosis Tepat',
      subtitle: 'Tau kelemahan dalam 90 menit',
      description:
        'Nggak perlu belajar semua materi dulu. Diagnosis ini kasih tau lo persis kurikulum mana yang lemah—jadi belajar langsung terarah!',
      icon: <Brain className="w-8 h-8" />,
      gradient: `from-[${mainColor}] to-[${mainColor}80]`,
      size: 'large',
      metrics: [
        { label: 'Akurasi Diagnosis', value: '94%' },
        { label: 'Waktu Uji Progress', value: '90 menit' },
      ],
      features: [
        '3 Kurikulum Inti Uji Progress',
        'Analisis Tipe & Pola Soal',
        'Roadmap Personal Langsung',
      ],
    },
    {
      id: 'prediction',
      title: 'Target Jelas',
      subtitle: 'Nilai 90+ poin terukur',
      description:
        'Bukan cuma prediksi skor aja. Ini kasih target yang realistis dan terarah—step by step menuju skor impian lo.',
      icon: <Target className="w-6 h-6" />,
      gradient: `from-[${secondaryColor}] to-[${secondaryColor}80]`,
      size: 'medium',
      highlight: 'Terukur & Terarah',
    },
    {
      id: 'chat-ai',
      title: 'AI Tutor 24/7',
      subtitle: 'Bantuan instant kapan aja',
      description:
        'Stuck di soal? Langsung tanya aja. AI tutor ini ngerti pola soal dan bisa jelasin dengan cara yang gampang dipahami.',
      icon: <MessageCircle className="w-6 h-6" />,
      gradient: `from-[${mainColor}] to-emerald-500`,
      size: 'medium',
      highlight: 'Bantuan Instant',
    },
    {
      id: 'analytics',
      title: 'Progress Tracking',
      subtitle: 'Monitor kenaikan real-time',
      description:
        'Progress kamu dari tes awal terus dimonitor. Setiap strategi yang dipakai, hasilnya langsung kelihatan—goal nilai 90 bukan angan-angan.',
      icon: <BarChart3 className="w-6 h-6" />,
      gradient: `from-amber-500 to-[${mainColor}]`,
      size: 'medium',
    },
    {
      id: 'live-class',
      title: 'Live Class Elite',
      subtitle: 'Tutor Univ Top 3 & Medalis Olimpiade',
      description:
        'Belajar langsung dari lulusan ITB, UI, UGM dengan segudang prestasi. Plus medalis olimpiade nasional & internasional yang udah proven banget!',
      icon: <Video className="w-8 h-8" />,
      gradient: `from-[${secondaryColor}] to-[${mainColor}]`,
      size: 'large',
      features: [
        'Lulusan ITB, UI, UGM dengan IPK 3.8+',
        'Medalis Olimpiade Nasional & Internasional',
        'Track Record Ribuan Siswa Lolos PTN',
        'Method Terbukti dari Pengalaman Nyata',
      ],
      highlight: 'Live Class Elite',
    },
    {
      id: 'tryout',
      title: 'Tryout by Tipe',
      subtitle: 'Latihan strategis & efektif',
      description:
        'Latihan nggak asal-asalan. Setiap tryout dirancang khusus buat ngasah tipe soal yang sering keluar—jadi makin latihan, makin paham polanya.',
      icon: <FileText className="w-6 h-6" />,
      gradient: `from-[${mainColor}] to-[${secondaryColor}]`,
      size: 'medium',
      highlight: 'Latihan Strategis',
    },
    {
      id: 'elite-tutors',
      title: 'Elite Tutors',
      subtitle: 'Lulusan Top 3 & Medalis Olimpiade',
      description:
        'Belajar langsung dari lulusan ITB, UI, UGM dengan segudang prestasi. Plus medalis olimpiade nasional & internasional yang udah proven banget!',
      icon: <Target className="w-6 h-6" />,
      gradient: `from-[${secondaryColor}] to-[${mainColor}]`,
      size: 'large',
      features: [
        'Lulusan ITB, UI, UGM dengan IPK 3.8+',
        'Medalis Olimpiade Nasional & Internasional',
        'Track Record Ribuan Siswa Lolos PTN',
        'Method Terbukti dari Pengalaman Nyata',
      ],
      highlight: 'Elite Tutors',
    },
    {
      id: 'workspace',
      title: 'Workspace Rapi',
      subtitle: 'Semua materi di satu tempat',
      description:
        'Nggak perlu cari-cari materi ke mana-mana. Semua 3 kurikulum inti diorganisir rapi dalam satu workspace—gampang diakses, mudah dipahami.',
      icon: <BookOpen className="w-6 h-6" />,
      gradient: `from-teal-500 to-[${mainColor}]`,
      size: 'medium',
    },
    {
      id: 'course',
      title: 'Course Simplified',
      subtitle: 'Fokus yang penting aja',
      description:
        'Course yang dirancang khusus buat efisiensi. Nggak ada materi yang nggak perlu—cuma yang bener-bener bikin skor lo naik.',
      icon: <Calendar className="w-6 h-6" />,
      gradient: `from-[${mainColor}] to-[${secondaryColor}]`,
      size: 'medium',
    },
  ];

  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge
            variant="outline"
            className="mb-6 px-6 py-2 text-sm font-semibold text-white border-none items-center gap-2 mx-auto"
            style={{ backgroundColor: mainColor }}
          >
            <Target className="w-4 h-4" />
            Sistem 3 Kurikulum Utama
          </Badge>

          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Lupakan materi yang{' '}
            <span className="text-red-500">nggak jelas & kebanyakan!</span>
            <br />
            Kami{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${mainColor}aa)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              simplifikasi
            </span>{' '}
            jadi 3 kurikulum inti
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            <span
              className="font-bold"
              style={{ color: mainColor }}
            >
              Cukup fokus pada yang benar-benar keluar di ujian.
            </span>
            <br />
            Belajar nggak perlu ribet. Soal ujian itu polanya sama, tipe soalnya
            berulang.{' '}
            <span
              className="font-bold bg-clip-text text-transparent"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${mainColor}aa)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Jadi, kamu cukup latihan by tipe soal!
            </span>
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`
                group relative overflow-hidden rounded-3xl bg-white border border-gray-200 hover:border-gray-300
                transition-all duration-500 hover:shadow-2xl hover:-translate-y-2
                ${feature.size === 'large' ? 'md:col-span-2' : ''}
                ${feature.size === 'medium' ? 'md:col-span-1' : ''}
              `}
            >
              <div className="p-8 h-full flex flex-col">
                {/* Icon & Badge */}
                <div className="flex items-start justify-between mb-6">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                    }}
                  >
                    {feature.icon}
                  </div>

                  {feature.highlight && (
                    <Badge
                      variant="secondary"
                      className="text-xs font-bold bg-gray-100 text-gray-700"
                    >
                      {feature.highlight}
                    </Badge>
                  )}
                </div>

                {/* Title & Description */}
                <div className="mb-6 flex-grow">
                  <h3 className="text-xl font-black text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p
                    className="text-sm font-semibold mb-3"
                    style={{ color: mainColor }}
                  >
                    {feature.subtitle}
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Metrics for large cards */}
                {feature.metrics && (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {feature.metrics.map((metric, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 rounded-xl p-3 text-center"
                      >
                        <div className="text-lg font-black text-gray-900">
                          {metric.value}
                        </div>
                        <div className="text-xs text-gray-500">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Features list for large cards */}
                {feature.features && (
                  <div className="space-y-2 mb-6">
                    {feature.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle
                          className="w-4 h-4 flex-shrink-0"
                          style={{ color: mainColor }}
                        />
                        <span className="text-sm text-gray-700">{feat}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Hover action */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div
                    className="flex items-center gap-2 text-sm font-semibold"
                    style={{ color: mainColor }}
                  >
                    <span>Jelajahi fitur</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Gradient overlay on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div
            className="rounded-3xl p-8 max-w-2xl mx-auto"
            style={{
              background: `linear-gradient(to right, ${mainColor}08, ${secondaryColor}08)`,
            }}
          >
            <h3 className="text-2xl font-black text-gray-900 mb-4">
              Gak Perlu Platform Ribet!
            </h3>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Semua yang lo butuhin ada di sini. Nggak ada lagi belajar ngawang
              atau buang waktu ke materi yang nggak penting.
              <span className="font-semibold">
                {' '}
                Kamu belajar cara tercepat & terbukti buat ningkatin skor.
              </span>
            </p>

            <Button
              size="lg"
              onClick={handlePricingNavigation}
              className="font-bold rounded-2xl px-8 py-3 hover:scale-105 transition-transform duration-300"
              style={{ backgroundColor: mainColor, color: 'white' }}
            >
              <Play className="w-5 h-5 mr-2" />
              Coba Sistem Terbukti Gratis
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BentoGrid;
