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

const FeaturesBentoGrid: React.FC = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  // const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const features: Feature[] = [
    {
      id: 'assessment',
      title: 'Assessment AI',
      subtitle: 'Diagnosis Akurat dalam 90 Menit',
      description:
        'Analisis mendalam kemampuan dan kelemahan spesifikmu dengan teknologi AI terdepan',
      icon: <Brain className="w-8 h-8" />,
      gradient: 'from-blue-500 to-cyan-500',
      size: 'large',
      metrics: [
        { label: 'Akurasi Prediksi', value: '94%' },
        { label: 'Waktu Assessment', value: '90 menit' },
      ],
      features: [
        'Tes adaptif 200+ soal',
        'Analisis pola kesalahan',
        'Roadmap personal instant',
      ],
    },
    {
      id: 'prediction',
      title: 'Prediksi Skor',
      subtitle: 'Akurasi 94%',
      description:
        'Sistem prediksi yang membantu kamu mempersiapkan strategi UTBK dengan tepat',
      icon: <Target className="w-6 h-6" />,
      gradient: 'from-purple-500 to-pink-500',
      size: 'medium',
      highlight: '94% akurat',
    },
    {
      id: 'chat-ai',
      title: 'AI Chat 24/7',
      subtitle: 'Tutor Personal',
      description:
        'Chatbot AI yang siap membantu menjelaskan konsep dan menjawab pertanyaanmu kapan saja',
      icon: <MessageCircle className="w-6 h-6" />,
      gradient: 'from-green-500 to-emerald-500',
      size: 'medium',
      highlight: 'Aktif 24/7',
    },
    {
      id: 'analytics',
      title: 'Dashboard Analytics',
      subtitle: 'Progress Real-time',
      description:
        'Pantau perkembanganmu dengan dashboard yang menampilkan analisis mendalam',
      icon: <BarChart3 className="w-6 h-6" />,
      gradient: 'from-amber-500 to-orange-500',
      size: 'medium',
      metrics: [
        { label: 'Tracking Progress', value: 'Real-time' },
        { label: 'Insight Analytics', value: 'Mendalam' },
      ],
    },
    {
      id: 'live-class',
      title: 'Live Class Olympic',
      subtitle: 'Mentor Juara Olimpiade',
      description:
        'Belajar langsung dari para juara olimpiade dengan teknik problem solving terukur',
      icon: <Video className="w-8 h-8" />,
      gradient: 'from-red-500 to-pink-500',
      size: 'large',
      features: [
        'Mentor olimpiade internasional',
        'Teknik problem solving advanced',
        'Live interaction dengan mentor',
        'Recording tersedia selamanya',
      ],
      highlight: 'Mentor Olympiad',
    },
    {
      id: 'tryout',
      title: 'Tryout System',
      subtitle: '100+ Paket TO',
      description:
        'Sistem tryout komprehensif dengan analisis detail untuk persiapan UTBK optimal',
      icon: <FileText className="w-6 h-6" />,
      gradient: 'from-indigo-500 to-purple-500',
      size: 'medium',
      highlight: '100+ paket',
    },
    {
      id: 'workspace',
      title: 'Document Workspace',
      subtitle: 'Kelola Materi',
      description:
        'Workspace digital untuk mengorganisir semua materi belajarmu dalam satu tempat',
      icon: <BookOpen className="w-6 h-6" />,
      gradient: 'from-teal-500 to-cyan-500',
      size: 'medium',
    },
    {
      id: 'course',
      title: 'Course System',
      subtitle: 'Pembelajaran Terstruktur',
      description:
        'Sistem kursus dengan kurikulum terstruktur yang disesuaikan dengan kebutuhanmu',
      icon: <Calendar className="w-6 h-6" />,
      gradient: 'from-violet-500 to-purple-500',
      size: 'medium',
    },
  ];

  return (
    <section className="py-24 px-4 bg-white">
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
            className="mb-6 px-6 py-2 text-sm font-semibold"
            style={{ borderColor: mainColor, color: mainColor }}
          >
            ECOSYSTEM BLUEPRINT
          </Badge>

          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Platform All-in-One untuk
            <br />
            <span style={{ color: mainColor }}>Sukses UTBK</span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Gabungan teknologi AI, mentoring olimpiade, dan sistem pembelajaran
            yang terukur efektif membantu ribuan siswa lolos PTN impian
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
              {/* Content */}
              <div className="p-8 h-full flex flex-col">
                {/* Icon & Badge */}
                <div className="flex items-start justify-between mb-6">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}
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
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
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
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
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
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-black text-gray-900 mb-4">
              Semua Fitur dalam Satu Platform
            </h3>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Tidak perlu platform terpisah-pisah. Blueprint menyediakan
              <span className="font-semibold"> ecosystem lengkap</span> untuk
              persiapan UTBK yang optimal.
            </p>

            <Button
              size="lg"
              className="font-bold rounded-2xl px-8 py-3"
              style={{ backgroundColor: mainColor, color: 'white' }}
            >
              <Play className="w-5 h-5 mr-2" />
              Coba Gratis Sekarang
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesBentoGrid;
