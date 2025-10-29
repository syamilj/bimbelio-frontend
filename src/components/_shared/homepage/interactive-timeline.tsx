'use client';

import AnimatedGradientText from '@/components/magicui/animated-gradient-text';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Card, CardContent } from '@/components/ui/card';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Target,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import { useRef } from 'react';

const InteractiveTimeline = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const progressHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const timelineData = [
    {
      phase: 'Fase 1',
      title: 'Diagnostic & Goal Setting',
      duration: 'Minggu 1-2',
      description: 'Asesmen kemampuan awal dan penetapan target yang realistis',
      icon: <Target className="w-6 h-6" />,
      color: '#3B82F6',
      achievements: [
        'Analisis kemampuan dasar',
        'Penetapan target universitas',
        'Penyusunan roadmap pembelajaran',
        'Setup personal AI tutor',
      ],
      stats: { completion: '100%', students: '15,000+' },
    },
    {
      phase: 'Fase 2',
      title: 'Foundation Building',
      duration: 'Minggu 3-8',
      description: 'Membangun fondasi kuat di semua mata pelajaran inti',
      icon: <BookOpen className="w-6 h-6" />,
      color: '#10B981',
      achievements: [
        'Penguasaan konsep dasar',
        'Latihan soal terstruktur',
        'Live class & mentoring',
        'Progress tracking mingguan',
      ],
      stats: { completion: '87%', students: '13,050+' },
    },
    {
      phase: 'Fase 3',
      title: 'Skill Enhancement',
      duration: 'Minggu 9-16',
      description:
        'Pengembangan strategi dan teknik penyelesaian soal advanced',
      icon: <Zap className="w-6 h-6" />,
      color: '#F59E0B',
      achievements: [
        'Strategi time management',
        'Teknik eliminasi jawaban',
        'Mock test intensif',
        'Analisis kekuatan/kelemahan',
      ],
      stats: { completion: '92%', students: '12,006+' },
    },
    {
      phase: 'Fase 4',
      title: 'Mastery & Practice',
      duration: 'Minggu 17-24',
      description: 'Intensive practice dan simulasi ujian real conditions',
      icon: <Trophy className="w-6 h-6" />,
      color: '#8B5CF6',
      achievements: [
        'Simulasi UTBK/Kedinasan',
        'Final preparation strategy',
        'Mental & psychological prep',
        'Last-minute optimization',
      ],
      stats: { completion: '95%', students: '11,406+' },
    },
    {
      phase: 'Results',
      title: 'Achievement Unlocked',
      duration: 'Target Tercapai',
      description: 'Lolos PTN/Kedinasan impian dengan persiapan optimal',
      icon: <Award className="w-6 h-6" />,
      color: '#DC2626',
      achievements: [
        'Lolos PTN favorit',
        'Skor di atas target',
        'Achievement badges',
        'Alumni network access',
      ],
      stats: { completion: '95%', students: '10,835+' },
    },
  ];

  return (
    <section
      id="interactive-timeline"
      className="py-16 md:py-24 relative overflow-hidden"
      ref={containerRef}
    >
      {/* Enhanced Background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl"
          style={{ backgroundColor: mainColor }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl"
          style={{ backgroundColor: secondaryColor }}
        />
      </div>

      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <span
              className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
            >
              <Calendar className="w-4 h-4" />
              ROADMAP PEMBELAJARAN
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <AnimatedGradientText>
              Perjalanan Menuju Kesuksesan
            </AnimatedGradientText>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Timeline pembelajaran terstruktur yang telah membantu ribuan siswa
            meraih impian mereka
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-8 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-1 bg-gray-200">
            <motion.div
              className="w-full rounded-full origin-top"
              style={{
                height: progressHeight,
                background: `linear-gradient(to bottom, ${mainColor}, ${secondaryColor})`,
              }}
            />
          </div>

          {/* Timeline Items */}
          <div className="space-y-12 md:space-y-16">
            {timelineData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } flex-col md:gap-8`}
              >
                {/* Timeline Node */}
                <div className="absolute left-8 md:left-1/2 md:-translate-x-1/2 -translate-y-1/2 top-8 z-10">
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl relative overflow-hidden"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.icon}
                    <div
                      className="absolute inset-0 rounded-full opacity-30"
                      style={{ backgroundColor: item.color }}
                    />
                  </motion.div>
                </div>

                {/* Content Card */}
                <div
                  className={`w-full md:w-[calc(50%-2rem)] ml-20 md:ml-0 ${
                    index % 2 === 0
                      ? 'md:mr-auto md:pr-8'
                      : 'md:ml-auto md:pl-8'
                  }`}
                >
                  <Card className="border-2 border-gray-100 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group">
                    <CardContent className="p-6 md:p-8">
                      {/* Phase Badge */}
                      <div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white mb-4 shadow-lg"
                        style={{ backgroundColor: item.color }}
                      >
                        <Clock className="w-4 h-4" />
                        {item.phase} • {item.duration}
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Achievements */}
                      <div className="space-y-3 mb-6">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          Key Achievements
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {item.achievements.map((achievement, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 + i * 0.1 }}
                              viewport={{ once: true }}
                              className="flex items-center gap-2 text-sm"
                            >
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-gray-700">
                                {achievement}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                        <div className="text-center">
                          <div
                            className="text-xl font-bold"
                            style={{ color: item.color }}
                          >
                            {item.stats.completion}
                          </div>
                          <div className="text-xs text-gray-500">
                            Success Rate
                          </div>
                        </div>
                        <div className="text-center">
                          <div
                            className="text-xl font-bold"
                            style={{ color: item.color }}
                          >
                            {item.stats.students}
                          </div>
                          <div className="text-xs text-gray-500">Alumni</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Card
            className="max-w-4xl mx-auto border-2 rounded-3xl overflow-hidden shadow-xl"
            style={{
              borderColor: `${mainColor}20`,
              background: `linear-gradient(135deg, ${mainColor}05, ${secondaryColor}05)`,
            }}
          >
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    Mulai Perjalanan Sukses Kamu Sekarang!
                  </h3>
                  <p className="text-lg text-gray-600">
                    Bergabung dengan 15,000+ siswa yang sudah memulai perjalanan
                    menuju PTN/Kedinasan impian
                  </p>
                </div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    className="px-8 py-4 rounded-2xl font-bold text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
                    style={{
                      background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                    }}
                  >
                    <Users className="w-5 h-5" />
                    Mulai Perjalanan Aku
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </motion.div>

                <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>24 Minggu Program</span>
                  </div>
                  <div className="w-px h-4 bg-gray-300" />
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span>95% Success Rate</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveTimeline;
