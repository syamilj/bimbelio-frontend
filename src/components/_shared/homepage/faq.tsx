'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Award,
  CheckCircle,
  Clock,
  HelpCircle,
  MessageCircle,
  Plus,
  Quote,
  Star,
  Users,
} from 'lucide-react';
import { useState } from 'react';

const FAQ = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const faqs = [
    {
      question: 'Apa itu Bimbelio dan bagaimana cara kerjanya?',
      answer:
        'Bimbelio adalah platform bimbingan belajar berbasis AI yang membantu siswa mempersiapkan diri untuk ujian masuk PTN dan sekolah kedinasan. Platform kami menggunakan teknologi AI untuk memberikan pembelajaran yang dipersonalisasi sesuai dengan kemampuan dan kebutuhan setiap siswa.',
      category: 'Platform',
      icon: '🤖',
      color: '#3B82F6',
      popularity: '95%',
      bgGradient: 'from-blue-500 to-indigo-600',
    },
    {
      question: 'Apakah Bimbelio benar-benar gratis?',
      answer:
        'Ya, Bimbelio menyediakan akses gratis ke berbagai fitur dasar termasuk try out, materi pembelajaran, dan beberapa fitur AI. Untuk fitur premium dan akses unlimited, kami juga menyediakan paket berbayar dengan harga yang terjangkau.',
      category: 'Pricing',
      icon: '💰',
      color: '#10B981',
      popularity: '92%',
      bgGradient: 'from-emerald-500 to-teal-600',
    },
    {
      question: 'Mata pelajaran apa saja yang tersedia di Bimbelio?',
      answer:
        'Bimbelio menyediakan materi lengkap untuk persiapan UTBK (Tes Potensi Skolastik, Literasi Bahasa, Penalaran Matematika) dan tes sekolah kedinasan (TWK, TIU, TKP). Semua materi disusun sesuai dengan kurikulum terbaru dan standar ujian.',
      category: 'Materi',
      icon: '📚',
      color: '#F59E0B',
      popularity: '89%',
      bgGradient: 'from-amber-500 to-orange-600',
    },
    {
      question: 'Bagaimana AI di Bimbelio membantu pembelajaran saya?',
      answer:
        'AI Bimbelio menganalisis pola belajar dan kemampuan Kamu, kemudian memberikan rekomendasi materi yang tepat, menyesuaikan tingkat kesulitan soal, dan memberikan feedback yang personal. AI juga dapat menjawab pertanyaan Kamu secara real-time melalui fitur chat.',
      category: 'AI Features',
      icon: '⚡',
      color: '#8B5CF6',
      popularity: '97%',
      bgGradient: 'from-purple-500 to-pink-600',
    },
    {
      question: 'Apakah saya bisa mengakses Bimbelio di smartphone?',
      answer:
        'Ya, platform Bimbelio dapat diakses melalui browser di smartphone, tablet, atau komputer. Semua fitur telah dioptimalkan untuk penggunaan mobile sehingga Kamu bisa belajar kapan saja dan dimana saja.',
      category: 'Aksesibilitas',
      icon: '📱',
      color: '#EC4899',
      popularity: '88%',
      bgGradient: 'from-pink-500 to-rose-600',
    },
    {
      question: 'Bagaimana cara mendaftar dan memulai belajar di Bimbelio?',
      answer:
        'Pendaftaran sangat mudah! Klik tombol "Daftar Sekarang", isi data diri Kamu, dan langsung mulai dengan try out gratis untuk mengetahui level kemampuan Kamu. Setelah itu, Kamu akan mendapatkan rekomendasi pembelajaran yang personal.',
      category: 'Getting Started',
      icon: '🚀',
      color: '#06B6D4',
      popularity: '94%',
      bgGradient: 'from-cyan-500 to-blue-600',
    },
  ];

  const statsData = [
    {
      icon: <HelpCircle className="w-5 h-5" />,
      label: 'Total FAQ',
      value: faqs.length,
      color: mainColor,
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Helpful Rating',
      value: '96%',
      color: '#10B981',
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: 'Avg Response',
      value: '< 2h',
      color: secondaryColor,
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="py-16 md:py-24 relative overflow-hidden"
    >
      {/* Enhanced Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl bg-main-default" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl px-4">
        {/* Enhanced Header - Similar to Testimoni */}
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
            <span className="inline-flex items-center gap-2 rounded-3xl px-6 py-3 text-sm font-bold text-white shadow-lg bg-gradient-default">
              <Quote className="w-4 h-4" />
              FREQUENTLY ASKED
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-main-default">
            Pertanyaan yang Sering Ditanyakan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Temukan jawaban lengkap untuk semua pertanyaan tentang Bimbelio dan
            fitur-fiturnya
          </p>

          {/* Enhanced Stats - Same as Testimoni */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center items-center gap-8 mt-8"
          >
            {statsData.map((stat, index) => (
              <div
                key={index}
                className="text-center"
              >
                <div
                  className="w-12 h-12 mx-auto mb-2 rounded-3xl flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <div style={{ color: stat.color }}>{stat.icon}</div>
                </div>
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

        {/* FAQ Grid - Exact same layout as Testimoni */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 container mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="h-full"
            >
              <Card className="h-full border-2 border-gray-100 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group relative">
                {/* Background Gradient - Same as Testimoni */}
                <div
                  className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${faq.color}20, ${faq.color}10)`,
                  }}
                />

                <CardContent className="p-8 h-full flex flex-col relative z-10">
                  {/* Enhanced Header - Same structure as Testimoni */}
                  <div className="relative mb-6">
                    {/* Question Icon Background - Same as Quote in Testimoni */}
                    <div className="absolute -top-2 -right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                      <HelpCircle
                        className="w-16 h-16"
                        style={{ color: faq.color }}
                      />
                    </div>

                    {/* Category Badge - Same as Testimoni */}
                    <div className="mb-4">
                      <span
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                        style={{ backgroundColor: faq.color }}
                      >
                        <span className="text-sm">{faq.icon}</span>
                        {faq.category}
                      </span>
                    </div>

                    {/* Rating - Same as Testimoni */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {faq.popularity.replace('%', '.0')}
                      </span>
                    </div>
                  </div>

                  {/* Content - Interactive FAQ */}
                  <div className="flex-1 space-y-6">
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full text-left group/button"
                    >
                      <div className="flex items-start justify-between">
                        <h3
                          className="text-xl font-bold leading-tight group-hover/button:text-opacity-80 transition-all duration-200 flex-1 pr-4"
                          style={{ color: faq.color }}
                        >
                          {faq.question}
                        </h3>
                        <motion.div
                          animate={{ rotate: openIndex === index ? 45 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="shrink-0"
                        >
                          <div
                            className="w-8 h-8 rounded-3xl flex items-center justify-center transition-all duration-300"
                            style={{
                              backgroundColor:
                                openIndex === index
                                  ? faq.color
                                  : `${faq.color}15`,
                            }}
                          >
                            <Plus
                              className="w-4 h-4"
                              style={{
                                color:
                                  openIndex === index ? 'white' : faq.color,
                              }}
                            />
                          </div>
                        </motion.div>
                      </div>
                    </button>

                    <AnimatePresence>
                      {openIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div
                            className="p-4 rounded-3xl relative"
                            style={{
                              backgroundColor: `${faq.color}08`,
                              borderLeft: `4px solid ${faq.color}`,
                            }}
                          >
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {faq.answer}
                            </p>

                            {/* Helpful indicator */}
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                              <div className="text-xs text-gray-500">
                                Apakah jawaban ini membantu?
                              </div>
                              <div className="flex items-center gap-2">
                                <button className="text-xs text-gray-500 hover:text-green-600 transition-colors">
                                  👍 Ya
                                </button>
                                <button className="text-xs text-gray-500 hover:text-red-600 transition-colors">
                                  👎 Tidak
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Enhanced Author Section - Similar to Testimoni */}
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        ⭐ Rated helpful by{' '}
                        <span className="font-bold">{faq.popularity}</span> of
                        users
                      </div>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  </div>

                  {/* Hover Effect Border - Same as Testimoni */}
                  <div
                    className="absolute bottom-0 left-0 w-full h-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                    style={{
                      background: `linear-gradient(90deg, ${faq.color}, ${faq.color}80)`,
                    }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Bottom CTA - Exact same structure as Testimoni */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16 container mx-auto"
        >
          <div
            className="max-w-4xl mx-auto p-8 rounded-3xl border-2 shadow-lg relative overflow-hidden"
            style={{
              borderColor: `${mainColor}20`,
              background: `linear-gradient(135deg, ${mainColor}05, ${secondaryColor}05)`,
            }}
          >
            {/* Background Pattern - Same as Testimoni */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 left-4 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <div className="absolute top-8 right-8 w-1 h-1 bg-purple-400 rounded-full animate-pulse animation-delay-200" />
              <div className="absolute bottom-8 left-8 w-1 h-1 bg-green-400 rounded-full animate-pulse animation-delay-500" />
            </div>

            <div className="relative z-10 space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 text-main-default">
                Masih ada pertanyaan lain?
              </h3>
              <p className="text-lg text-gray-600">
                Tim support ahli kami siap membantu Kamu kapan saja
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-3xl font-bold text-white shadow-lg transition-all duration-300 flex items-center gap-2 bg-gradient-default"
                >
                  <MessageCircle className="w-5 h-5" />
                  Hubungi Support
                </motion.button>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="font-medium">Online 24/7</span>
                  </div>
                  <div className="w-px h-4 bg-gray-300" />
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">Response &lt; 2 jam</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Custom CSS for animations */}
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

export default FAQ;
