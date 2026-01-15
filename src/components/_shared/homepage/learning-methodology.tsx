'use client';

import AnimatedGradientText from '@/components/magicui/animated-gradient-text';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  BarChart3,
  Brain,
  CheckCircle,
  Clock,
  Lightbulb,
  MessageCircle,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useRef, useState } from 'react';

const LearningMethodology = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [activeMethod, setActiveMethod] = useState(0);
  const ref = useRef(null);
  // const isInView = useInView(ref, { once: true, amount: 0.3 });

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const learningMethods = [
    {
      id: 'adaptive',
      title: 'Adaptive Learning AI',
      subtitle: 'Pembelajaran yang Menyesuaikan Kemampuanmu',
      description:
        'Sistem AI kami menganalisis pola belajar dan kemampuan kamu secara real-time, kemudian menyesuaikan tingkat kesulitan dan materi yang diberikan.',
      icon: <Brain className="w-8 h-8" />,
      color: '#3B82F6',
      gradient: 'from-blue-500 to-indigo-600',
      features: [
        'AI menganalisis kekuatan & kelemahan',
        'Materi disesuaikan dengan level kemampuan',
        'Jalur pembelajaran personal',
        'Prediksi skor ujian yang akurat',
      ],
      stats: [
        { label: 'Akurasi Prediksi', value: '94%' },
        { label: 'Peningkatan Skor', value: '87%' },
        { label: 'Kepuasan Siswa', value: '4.9/5' },
      ],
      methodology: 'Item Response Theory (IRT) + Machine Learning',
      benefits: [
        'Efisiensi waktu belajar meningkat 3x',
        'Fokus pada area yang perlu diperbaiki',
        'Motivasi belajar tetap terjaga',
        'Progress yang terukur dan konsisten',
      ],
    },
    {
      id: 'collaborative',
      title: 'Collaborative Learning',
      subtitle: 'Belajar Bersama Komunitas Juara',
      description:
        'Bergabung dengan ribuan siswa lain dalam komunitas belajar yang supportif. Diskusi, tanya jawab, dan saling memotivasi untuk mencapai target bersama.',
      icon: <Users className="w-8 h-8" />,
      color: '#10B981',
      gradient: 'from-emerald-500 to-teal-600',
      features: [
        'Grup belajar berdasarkan target universitas',
        'Live discussion dengan mentor',
        'Peer-to-peer learning sessions',
        'Kompetisi sehat antar siswa',
      ],
      stats: [
        { label: 'Siswa Aktif', value: '15K+' },
        { label: 'Study Groups', value: '500+' },
        { label: 'Live Sessions', value: '50+/minggu' },
      ],
      methodology: 'Social Learning Theory + Gamification',
      benefits: [
        'Motivasi tinggi dari kompetisi sehat',
        'Network dengan sesama pejuang PTN',
        'Sharing tips dan strategi efektif',
        'Support system yang kuat',
      ],
    },
    {
      id: 'mastery',
      title: 'Mastery-Based Learning',
      subtitle: 'Kuasai Setiap Konsep Secara Mendalam',
      description:
        'Tidak ada yang tertinggal! Setiap konsep harus dikuasai dengan baik sebelum lanjut ke materi selanjutnya. Sistem pembelajaran bertahap yang memastikan pemahaman solid.',
      icon: <Target className="w-8 h-8" />,
      color: '#F59E0B',
      gradient: 'from-amber-500 to-orange-600',
      features: [
        'Progress tracking per konsep',
        'Remedial otomatis untuk konsep lemah',
        'Milestone achievements system',
        'Sertifikasi penguasaan materi',
      ],
      stats: [
        { label: 'Tingkat Penguasaan', value: '96%' },
        { label: 'Retensi Materi', value: '91%' },
        { label: 'Success Rate', value: '95%' },
      ],
      methodology: "Bloom's Taxonomy + Competency-Based Education",
      benefits: [
        'Fondasi yang kuat di setiap materi',
        'Confidence yang tinggi saat ujian',
        'Pemahaman konseptual yang mendalam',
        'Skill problem solving yang terasah',
      ],
    },
    {
      id: 'microlearning',
      title: 'Microlearning Strategy',
      subtitle: 'Belajar Efektif dalam Waktu Singkat',
      description:
        'Materi dipecah menjadi segmen-segmen kecil yang mudah dicerna. Perfect untuk siswa yang sibuk dengan jadwal sekolah yang padat.',
      icon: <Clock className="w-8 h-8" />,
      color: '#8B5CF6',
      gradient: 'from-purple-500 to-violet-600',
      features: [
        'Sesi belajar 15-30 menit',
        'Konten bite-sized yang fokus',
        'Spaced repetition algorithm',
        'Mobile-first learning experience',
      ],
      stats: [
        { label: 'Rata-rata Sesi', value: '22 min' },
        { label: 'Completion Rate', value: '89%' },
        { label: 'Knowledge Retention', value: '85%' },
      ],
      methodology: 'Cognitive Load Theory + Spaced Repetition',
      benefits: [
        'Fleksibel dengan jadwal sekolah',
        'Mengurangi cognitive overload',
        'Retensi jangka panjang yang baik',
        'Bisa belajar kapan saja, dimana saja',
      ],
    },
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Diagnostic Assessment',
      description:
        'AI menganalisis kemampuan awal kamu melalui tes diagnostik yang komprehensif.',
      icon: <BarChart3 className="w-6 h-6" />,
      color: mainColor,
    },
    {
      step: '02',
      title: 'Personalized Path',
      description:
        'Sistem membuat jalur pembelajaran yang disesuaikan dengan profil belajar kamu.',
      icon: <Target className="w-6 h-6" />,
      color: secondaryColor,
    },
    {
      step: '03',
      title: 'Adaptive Content',
      description:
        'Materi dan soal secara dinamis disesuaikan berdasarkan progress real-time.',
      icon: <Zap className="w-6 h-6" />,
      color: '#10B981',
    },
    {
      step: '04',
      title: 'Continuous Monitoring',
      description:
        'AI terus memantau dan mengoptimasi strategi belajar untuk hasil maksimal.',
      icon: <TrendingUp className="w-6 h-6" />,
      color: '#F59E0B',
    },
  ];

  const researchBacking = [
    {
      title: 'Proven Methodology',
      description:
        'Didukung oleh penelitian dari MIT, Stanford, dan Harvard tentang efektivitas adaptive learning.',
      icon: <Award className="w-5 h-5" />,
      papers: [
        'MIT Technology Review 2023',
        'Stanford Education Research',
        'Harvard Business Review',
      ],
    },
    {
      title: 'Data-Driven Approach',
      description:
        'Setiap keputusan pembelajaran didasarkan pada analisis data dari jutaan interaksi siswa.',
      icon: <BarChart3 className="w-5 h-5" />,
      papers: [
        'Educational Data Mining',
        'Learning Analytics Research',
        'AI in Education Journal',
      ],
    },
    {
      title: 'Continuous Innovation',
      description:
        'Tim R&D kami terus mengembangkan algoritma berdasarkan feedback dan hasil terbaru.',
      icon: <Lightbulb className="w-5 h-5" />,
      papers: [
        'IEEE Learning Technology',
        'ACM Education Conference',
        'Nature Education Research',
      ],
    },
  ];

  return (
    <section
      id="learning-methodology"
      className="py-16 md:py-24 relative overflow-hidden"
      ref={ref}
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
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full opacity-3 blur-3xl"
          style={{ backgroundColor: mainColor }}
        />

        {/* Floating Elements */}
        <div className="absolute top-8 left-8 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
        <div className="absolute top-16 right-16 w-1 h-1 bg-purple-400 rounded-full animate-pulse animation-delay-200" />
        <div className="absolute bottom-16 left-16 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse animation-delay-500" />
      </div>

      <div className="container mx-auto max-w-7xl px-4">
        {/* Enhanced Header */}
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
              className="inline-flex items-center gap-2 rounded-3xl px-6 py-3 text-sm font-bold text-white shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
            >
              <Brain className="w-4 h-4" />
              METODE PEMBELAJARAN
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <AnimatedGradientText>
              Revolusi Cara Belajar dengan AI
            </AnimatedGradientText>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Bimbelio menggunakan metodologi pembelajaran terdepan yang{' '}
            <span
              className="font-bold"
              style={{ color: mainColor }}
            >
              terbukti secara ilmiah
            </span>{' '}
            untuk meningkatkan efektivitas belajar hingga{' '}
            <span
              className="font-bold"
              style={{ color: mainColor }}
            >
              300%
            </span>
          </p>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto"
          >
            {[
              {
                label: 'Efektivitas Belajar',
                value: '+300%',
                color: '#3B82F6',
              },
              { label: 'Tingkat Kelulusan', value: '95%', color: '#10B981' },
              { label: 'Kepuasan Siswa', value: '4.9/5', color: '#F59E0B' },
              { label: 'Penelitian Pendukung', value: '50+', color: '#8B5CF6' },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center"
              >
                <div
                  className="text-2xl md:text-3xl font-bold"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Learning Process Steps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Bagaimana AI Membantu Pembelajaran Kamu?
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Proses pembelajaran yang sistematis dan berbasis data untuk hasil
              optimal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <Card className="h-full border-2 border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-500 group">
                  <CardContent className="p-6 text-center">
                    {/* Step Number */}
                    <div
                      className="w-16 h-16 mx-auto mb-4 rounded-3xl flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: step.color }}
                    >
                      {step.step}
                    </div>

                    {/* Icon */}
                    <div
                      className="w-12 h-12 mx-auto mb-4 rounded-3xl flex items-center justify-center"
                      style={{ backgroundColor: `${step.color}15` }}
                    >
                      <div style={{ color: step.color }}>{step.icon}</div>
                    </div>

                    {/* Content */}
                    <h4 className="text-lg font-bold text-gray-900 mb-3">
                      {step.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {step.description}
                    </p>

                    {/* Connection Line */}
                    {index < processSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                        <ArrowRight className="w-6 h-6 text-gray-300" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Learning Methods Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              4 Metode Pembelajaran Revolusioner
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Kombinasi metodologi terbaik dunia untuk pembelajaran yang efektif
              dan efisien
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Method Selector */}
            <div className="space-y-4">
              {learningMethods.map((method, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`cursor-pointer border-2 rounded-3xl overflow-hidden transition-all duration-300 ${
                      activeMethod === index
                        ? 'shadow-xl scale-105'
                        : 'hover:shadow-lg border-gray-200'
                    }`}
                    style={{
                      borderColor:
                        activeMethod === index ? method.color : undefined,
                      backgroundColor:
                        activeMethod === index ? `${method.color}08` : 'white',
                    }}
                    onClick={() => setActiveMethod(index)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-3xl flex items-center justify-center text-white transition-all duration-300 ${
                            activeMethod === index ? 'shadow-lg' : ''
                          }`}
                          style={{
                            background:
                              activeMethod === index
                                ? `linear-gradient(135deg, ${method.color}, ${method.color}dd)`
                                : `${method.color}15`,
                          }}
                        >
                          <div
                            style={{
                              color:
                                activeMethod === index ? 'white' : method.color,
                            }}
                          >
                            {method.icon}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 leading-tight">
                            {method.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {method.subtitle}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Method Detail */}
            <div className="lg:col-span-2">
              <motion.div
                key={activeMethod}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-2 border-gray-100 rounded-3xl overflow-hidden shadow-xl">
                  <CardContent className="p-8">
                    {/* Header */}
                    <div className="mb-8">
                      <div className="flex items-center gap-4 mb-4">
                        <div
                          className="w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-lg"
                          style={{
                            background: `linear-gradient(135deg, ${learningMethods[activeMethod].color}, ${learningMethods[activeMethod].color}dd)`,
                          }}
                        >
                          {learningMethods[activeMethod].icon}
                        </div>
                        <div>
                          <h4 className="text-2xl font-bold text-gray-900">
                            {learningMethods[activeMethod].title}
                          </h4>
                          <p
                            className="text-lg"
                            style={{
                              color: learningMethods[activeMethod].color,
                            }}
                          >
                            {learningMethods[activeMethod].subtitle}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {learningMethods[activeMethod].description}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      {learningMethods[activeMethod].stats.map(
                        (stat, index) => (
                          <div
                            key={index}
                            className="text-center p-4 rounded-3xl bg-gray-50"
                          >
                            <div
                              className="text-2xl font-bold"
                              style={{
                                color: learningMethods[activeMethod].color,
                              }}
                            >
                              {stat.value}
                            </div>
                            <div className="text-sm text-gray-600">
                              {stat.label}
                            </div>
                          </div>
                        ),
                      )}
                    </div>

                    {/* Features */}
                    <div className="mb-8">
                      <h5 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                        <Sparkles
                          className="w-5 h-5"
                          style={{ color: learningMethods[activeMethod].color }}
                        />
                        Fitur Unggulan
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {learningMethods[activeMethod].features.map(
                          (feature, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3"
                            >
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span className="text-gray-700">{feature}</span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    {/* Methodology */}
                    <div
                      className="mb-8 p-4 rounded-3xl"
                      style={{
                        backgroundColor: `${learningMethods[activeMethod].color}10`,
                      }}
                    >
                      <h5 className="font-bold text-gray-900 mb-2">
                        🔬 Metodologi:
                      </h5>
                      <p className="text-gray-700 font-medium">
                        {learningMethods[activeMethod].methodology}
                      </p>
                    </div>

                    {/* Benefits */}
                    <div>
                      <h5 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingUp
                          className="w-5 h-5"
                          style={{ color: learningMethods[activeMethod].color }}
                        />
                        Manfaat yang Didapat
                      </h5>
                      <div className="space-y-2">
                        {learningMethods[activeMethod].benefits.map(
                          (benefit, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3"
                            >
                              <div
                                className="w-2 h-2 rounded-full mt-2"
                                style={{
                                  backgroundColor:
                                    learningMethods[activeMethod].color,
                                }}
                              />
                              <span className="text-gray-700">{benefit}</span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Research Backing */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Didukung Penelitian Ilmiah Terdepan
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Metodologi kami telah terbukti efektif melalui puluhan penelitian
              dari universitas ternama dunia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {researchBacking.map((research, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-2 border-gray-100 rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div
                      className="w-12 h-12 mb-4 rounded-3xl flex items-center justify-center"
                      style={{ backgroundColor: `${mainColor}15` }}
                    >
                      <div style={{ color: mainColor }}>{research.icon}</div>
                    </div>
                    <h4 className="font-bold text-lg text-gray-900 mb-3">
                      {research.title}
                    </h4>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {research.description}
                    </p>
                    <div className="space-y-2">
                      <h5 className="font-semibold text-sm text-gray-900">
                        Referensi:
                      </h5>
                      {research.papers.map((paper, paperIndex) => (
                        <div
                          key={paperIndex}
                          className="text-xs text-gray-500 flex items-center gap-2"
                        >
                          <div className="w-1 h-1 bg-gray-400 rounded-full" />
                          {paper}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
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
                    Siap Merasakan Revolusi Pembelajaran?
                  </h3>
                  <p className="text-lg text-gray-600">
                    Bergabunglah dengan 15,000+ siswa yang sudah merasakan
                    efektivitas metode pembelajaran AI kami
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      className="px-8 py-4 rounded-3xl font-bold text-white shadow-lg transition-all duration-300 flex items-center gap-2"
                      style={{
                        background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                      }}
                    >
                      <Brain className="w-5 h-5" />
                      Coba Metode AI Sekarang
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="px-8 py-4 rounded-3xl font-bold border-2 transition-all duration-300 flex items-center gap-2"
                      style={{
                        borderColor: mainColor,
                        color: mainColor,
                      }}
                    >
                      <MessageCircle className="w-5 h-5" />
                      Tanya Metode Pembelajaran
                    </Button>
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  {[
                    {
                      icon: '🎯',
                      label: 'Target Oriented',
                      value: 'Fokus pada tujuan spesifik kamu',
                    },
                    {
                      icon: '📊',
                      label: 'Data Driven',
                      value: 'Keputusan berdasarkan analisis data',
                    },
                    {
                      icon: '🚀',
                      label: 'Results Proven',
                      value: '95% siswa berhasil mencapai target',
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="text-center p-4 rounded-3xl bg-white/60 backdrop-blur-sm"
                    >
                      <div className="text-2xl mb-2">{feature.icon}</div>
                      <div className="font-medium text-gray-900">
                        {feature.label}
                      </div>
                      <div className="text-sm text-gray-600">
                        {feature.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        .animation-delay-500 {
          animation-delay: 500ms;
        }
      `}</style>
    </section>
  );
};

export default LearningMethodology;
