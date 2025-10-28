'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  FileCheck,
  Lightbulb,
  Map,
  RefreshCw,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';
import { useMemo } from 'react';

interface PrintsPillar {
  letter: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface SocialProofStat {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface ProblemMapping {
  problem: string;
  solution: string;
}

export const SolutionSection: React.FC = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const isMainLandingPage = window.location.pathname === '/';
  const mainColor = isMainLandingPage
    ? '#0091FF'
    : (websiteSubCategory?.main_color ?? '#0091FF');
  const secondaryColor = isMainLandingPage
    ? '#5aa4dd'
    : (websiteSubCategory?.secondary_color ?? '#5aa4dd');

  // Definisi warna untuk setiap pilar PRINTS (vibrant palette seperti problem section)
  const PILLAR_COLORS = {
    azure: '#0EA5E9',
    violet: '#8B5CF6',
    emerald: '#10B981',
    amber: '#F59E0B',
    rose: '#EC4899',
    indigo: '#6366F1',
  };

  const printsPillars: PrintsPillar[] = useMemo(
    () => [
      {
        letter: 'P',
        title: 'Prioritize',
        subtitle: 'Fokus ke yang penting dulu',
        description:
          'Nilai stagnan? PRINTS kasih roadmap jelas: materi mana yang urgent, mana yang bisa ditunda. Nggak buang waktu lagi.',
        icon: <Target className="w-8 h-8" />,
        color: PILLAR_COLORS.azure,
      },
      {
        letter: 'R',
        title: 'Rhythm',
        subtitle: 'Konsisten tanpa burnout',
        description:
          'Stamina drop? Rhythm builder bikin lo belajar 2 jam/hari yang efektif — bukan 14 jam seminggu sekali yang akhirnya zonk.',
        icon: <Clock className="w-8 h-8" />,
        color: PILLAR_COLORS.violet,
      },
      {
        letter: 'I',
        title: 'Iterate',
        subtitle: 'Coba, evaluasi, improve',
        description:
          'Nilai nggak naik-naik? Sistem iterate bantu lo analisis kesalahan → perbaiki strategi → coba lagi. Loop sampai berhasil.',
        icon: <RefreshCw className="w-8 h-8" />,
        color: PILLAR_COLORS.emerald,
      },
      {
        letter: 'N',
        title: 'Navigate',
        subtitle: 'Peta belajar yang jelas',
        description:
          'Galau jurusan? Takut kelamaan di satu bab? Navigator guide lo dari Core → Intensif → Super Intensif. Ada peta, nggak nyasar.',
        icon: <Map className="w-8 h-8" />,
        color: PILLAR_COLORS.amber,
      },
      {
        letter: 'T',
        title: 'Test',
        subtitle: 'Latihan soal yang cerdas',
        description:
          'Video ngebosenin? TO pakai IRT system — ngasih soal yang pas sama level lo. Progress terlihat real-time, bukan cuma berasa aja.',
        icon: <FileCheck className="w-8 h-8" />,
        color: PILLAR_COLORS.rose,
      },
      {
        letter: 'S',
        title: 'Support',
        subtitle: 'Nggak pernah sendirian',
        description:
          'Butuh dukungan intensif? AI Mentor 24/7 sudah termasuk. Plus, tutor alumni PTN top siap membimbing — sistem support lengkap terintegrasi.',
        icon: <Users className="w-8 h-8" />,
        color: PILLAR_COLORS.indigo,
      },
    ],
    [],
  );

  const problemMappings: ProblemMapping[] = useMemo(
    () => [
      { problem: 'Nilai Stagnasi', solution: 'Iterate & Test' },
      { problem: 'Bingung Materi', solution: 'Prioritize & Navigate' },
      { problem: 'Stamina Menurun', solution: 'Rhythm' },
      { problem: 'Butuh Support', solution: 'Support System' },
    ],
    [],
  );

  const socialProofStats: SocialProofStat[] = useMemo(
    () => [
      {
        value: '95%',
        label: 'Siswa Lolos',
        icon: <CheckCircle2 className="w-5 h-5" />,
      },
      {
        value: '5000+',
        label: 'Siswa Aktif',
        icon: <Users className="w-5 h-5" />,
      },
      {
        value: '4.9/5',
        label: 'Rating',
        icon: <Sparkles className="w-5 h-5" />,
      },
    ],
    [],
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section className="py-20 md:py-24 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex justify-center mb-6"
          >
            <Badge
              variant="outline"
              className="px-6 py-2 text-sm font-bold text-white border-none"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
            >
              SOLUSI TERINTEGRASI
            </Badge>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
              PRINTS System —
            </h2>
            <h2
              className="text-4xl md:text-5xl font-black bg-clip-text text-transparent"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Strategi Belajar yang Terbukti Bekerja
            </h2>
          </motion.div>

          {/* Subtext */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto space-y-4 text-lg text-gray-700 leading-relaxed"
          >
            <p>
              Bukan soal IQ atau talent. Bukan sekadar nonton video atau
              menghapal soal. Ribuan siswa biasa yang ngga ngerti matematika
              bisa masuk PTN top karena tahu{' '}
              <span
                className="font-bold"
                style={{ color: mainColor }}
              >
                cara yang tepat untuk belajar.
              </span>
            </p>

            <p>
              Sistem PRINTS adalah kerangka kerja{' '}
              <span
                className="font-bold"
                style={{ color: secondaryColor }}
              >
                yang menjawab semua masalah
              </span>{' '}
              — dari nilai stagnasi, hingga stamina turun, sampai ngga tahu
              harus mulai dari mana. Satu sistem, enam pilar, hasil nyata
              terukur.
            </p>

            <p className="text-sm md:text-base italic text-gray-600 border-l-4 pl-4 my-6 text-left">
              <span
                className="inline-block"
                style={{ borderColor: mainColor }}
              >
                &quot;95% siswa kita lolos karena mereka belajar dengan strategi
                yang jelas, bukan sekadar kerja keras tanpa arah.&quot;
              </span>
            </p>
          </motion.div>
        </motion.div>

        {/* Problem to Solution Mapping */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          {/* Header Icon + Title */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <div
              className="p-4 rounded-2xl text-white shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
            >
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-gray-900">
                Dari 8 Masalah → 1 Sistem yang Ngejawab Semua
              </h3>
              <p className="text-sm md:text-base text-gray-600">
                PRINTS System dirancang khusus untuk mengatasi semua pain points
                lo
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {problemMappings.map((mapping, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-white rounded-2xl border-2 hover:shadow-md transition-all duration-300 overflow-hidden"
                style={{
                  borderColor: `${mainColor}20`,
                }}
              >
                {/* Top Accent Bar */}
                <div
                  className="h-2 w-full"
                  style={{
                    background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
                  }}
                />

                <div className="p-6 flex items-center gap-4">
                  <div
                    className="flex-shrink-0 p-3 rounded-2xl"
                    style={{ backgroundColor: `${mainColor}15` }}
                  >
                    <CheckCircle2
                      className="w-6 h-6"
                      style={{ color: mainColor }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-base text-gray-700">
                      <span className="font-black text-gray-900">
                        {mapping.problem}
                      </span>{' '}
                      →{' '}
                      <span
                        className="font-bold"
                        style={{ color: mainColor }}
                      >
                        {mapping.solution}
                      </span>
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* PRINTS Pillars Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          {/* Section Title */}
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              6 Pilar PRINTS
            </h3>
            <p className="text-base md:text-lg text-gray-600">
              Setiap pilar dirancang untuk mengatasi masalah spesifik dalam
              perjalanan belajar lo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {printsPillars.map((pillar, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-white rounded-2xl border-2 hover:shadow-md transition-all duration-300 overflow-hidden"
                style={{
                  borderColor: `${pillar.color}20`,
                }}
              >
                {/* Top Accent Bar */}
                <div
                  className="h-2 w-full"
                  style={{
                    backgroundColor: pillar.color,
                  }}
                />

                <div className="p-6">
                  {/* Header with Icon & Letter */}
                  <div className="flex items-start gap-4 mb-4">
                    {/* Icon */}
                    <div
                      className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg"
                      style={{
                        backgroundColor: pillar.color,
                      }}
                    >
                      {pillar.icon}
                    </div>

                    {/* Large Letter */}
                    <div
                      className="text-6xl font-black leading-none opacity-20"
                      style={{ color: pillar.color }}
                    >
                      {pillar.letter}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h4 className="text-2xl font-black text-gray-900">
                      {pillar.title}
                    </h4>
                    <p
                      className="text-sm font-bold"
                      style={{ color: pillar.color }}
                    >
                      {pillar.subtitle}
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Bottom accent line */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div
                      className="h-1 w-12 rounded-full"
                      style={{ backgroundColor: pillar.color }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Social Proof Section */}

        {/* CTA line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-gray-200 text-center"
        >
          <p className="text-sm md:text-base text-gray-600">
            <span
              className="font-black"
              style={{ color: mainColor }}
            >
              Penasaran?
            </span>{' '}
            Scroll ke bawah untuk melihat{' '}
            <span
              className="font-black"
              style={{ color: secondaryColor }}
            >
              paket berlangganan
            </span>{' '}
            yang cocok untuk lo.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default SolutionSection;
