'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  MessageCircle,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';

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

export default function MentorAISection() {
  const { websiteSubCategory } = useWebsiteSubCategory();

  const isMainLandingPage =
    typeof window !== 'undefined' && window.location.pathname === '/';
  const mainColor = isMainLandingPage
    ? '#0091FF'
    : (websiteSubCategory?.main_color ?? '#0091FF');
  const secondaryColor = isMainLandingPage
    ? '#5aa4dd'
    : (websiteSubCategory?.secondary_color ?? '#7C3AED');

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
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Layer 2: Mentor Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Badge
              className="mb-4 border-none px-6 py-2 text-sm font-bold text-white"
              style={{
                background: 'linear-gradient(135deg, #00C853, #00C853dd)',
              }}
            >
              <Users className="w-4 h-4 mr-2 inline" />
              Layer 2 - Mentor System
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Layer 1 Udah Kenal —
              <br />
              <span style={{ color: '#00C853' }}>Layer 2 & 3 Gimana?</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Tutor ngajarin materi. Tapi lo juga butuh{' '}
              <span className="font-bold">
                strategic planning & instant support
              </span>
              . Makanya ada Mentor buat bimbing strategi lo, dan AI buat jawab
              pertanyaan kapan aja.
            </p>
          </div>

          {/* Mentor Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mentorFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-md transition-all duration-300 border-2 border-gray-100"
              >
                {/* Top Accent Bar */}
                <div
                  className="h-1.5 w-full"
                  style={{ backgroundColor: feature.color }}
                />

                <div className="p-6">
                  {/* Icon & Title */}
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${feature.color}, ${feature.color}dd)`,
                      }}
                    >
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div
                    className="h-0.5 w-12 rounded-full mb-4"
                    style={{ backgroundColor: feature.color + '40' }}
                  />

                  {/* Bullets */}
                  <div className="space-y-2.5">
                    {feature.bullets.map((bullet, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 rounded-2xl bg-white p-3"
                      >
                        <CheckCircle2
                          className="w-4 h-4 mt-0.5 flex-shrink-0"
                          style={{ color: feature.color }}
                        />
                        <span className="text-sm font-semibold text-gray-800">
                          {bullet}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Layer 3: AI Mentor Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Badge
              className="mb-4 border-none px-6 py-2 text-sm font-bold text-white"
              style={{
                background: 'linear-gradient(135deg, #9C27B0, #9C27B0dd)',
              }}
            >
              <Sparkles className="w-4 h-4 mr-2 inline" />
              Layer 3 - AI Mentor
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              AI Mentor —{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  background: 'linear-gradient(135deg, #9C27B0, #7B1FA2)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Support 24/7
              </span>
            </h2>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto">
              Kalau tutor & mentor lagi offline, ada{' '}
              <span className="font-bold">AI Mentor yang selalu standby.</span>{' '}
              Instant jawab pertanyaan, analisis error pattern, dan kasih
              rekomendasi drill soal yang tepat.
            </p>
          </div>

          {/* AI Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aiFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-md transition-all duration-300 border-2 border-gray-100"
              >
                {/* Top Accent Bar */}
                <div
                  className="h-1.5 w-full"
                  style={{ backgroundColor: feature.color }}
                />

                <div className="p-8 text-center">
                  {/* Icon */}
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${feature.color}, ${feature.color}dd)`,
                    }}
                  >
                    <div className="text-white">{feature.icon}</div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-black text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {feature.description}
                  </p>

                  {/* Info Badge */}
                  <div
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold"
                    style={{
                      backgroundColor: feature.color + '15',
                      border: `1.5px solid ${feature.color}30`,
                      color: feature.color,
                    }}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>AI Powered</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div
            className="rounded-3xl p-8 max-w-4xl mx-auto border-2 shadow-md"
            style={{
              borderColor: `${mainColor}30`,
              background: `linear-gradient(to right, ${mainColor}08, ${secondaryColor}08)`,
            }}
          >
            <div className="mb-4 flex items-center justify-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                }}
              >
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">
                Triple Layer Support System
              </h4>
            </div>
            <p className="mb-6 text-lg leading-relaxed text-gray-700">
              <span className="font-black text-gray-900">
                3 layers bekerja bareng
              </span>{' '}
              — Tutor ngajarin materi, Mentor guide strategi, AI support 24/7.
              Lo nggak akan merasa{' '}
              <span className="font-bold">sendirian lagi</span> dalam perjalanan
              ke PTN impian!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-md"
                style={{
                  backgroundColor: '#0091FF15',
                  border: '1.5px solid #0091FF30',
                  color: '#0091FF',
                }}
              >
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span>Tutor Expert</span>
              </div>
              <div
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-md"
                style={{
                  backgroundColor: '#00C85315',
                  border: '1.5px solid #00C85330',
                  color: '#00C853',
                }}
              >
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span>Mentor Guide</span>
              </div>
              <div
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-md"
                style={{
                  backgroundColor: '#9C27B015',
                  border: '1.5px solid #9C27B030',
                  color: '#9C27B0',
                }}
              >
                <div className="h-2 w-2 rounded-full bg-purple-500" />
                <span>AI Assistant</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
