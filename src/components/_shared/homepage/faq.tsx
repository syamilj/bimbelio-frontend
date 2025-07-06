'use client';

import AnimatedGradientText from '@/components/magicui/animated-gradient-text';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  HelpCircle,
  MessageCircle,
  Minus,
  Plus,
  Users,
} from 'lucide-react';
import { useState } from 'react';

const FAQ = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const faqData = [
    {
      category: 'Umum',
      icon: <HelpCircle className="w-5 h-5" />,
      questions: [
        {
          question: 'Apa itu Bimbelio dan bagaimana cara kerjanya?',
          answer:
            'Bimbelio adalah platform bimbingan belajar berbasis AI yang membantu siswa mempersiapkan ujian masuk PTN dan sekolah kedinasan. Platform kami menggunakan teknologi GPT-4 untuk memberikan pembelajaran yang personal dan adaptif sesuai kemampuan setiap siswa.',
        },
        {
          question: 'Apakah Bimbelio benar-benar gratis?',
          answer:
            'Ya! Bimbelio menyediakan akses gratis untuk try out, materi dasar, dan fitur pembelajaran AI terbatas. Untuk akses penuh ke semua fitur premium seperti analisis mendalam, live class, dan materi lengkap, tersedia paket berlangganan mulai dari Rp 99.000/bulan.',
        },
        {
          question: 'Bagaimana cara mendaftar di Bimbelio?',
          answer:
            'Pendaftaran sangat mudah! Cukup klik tombol "Daftar Sekarang", masukkan email dan data diri Anda, lalu verifikasi akun melalui email. Setelah itu, Anda langsung bisa mengakses try out gratis dan mulai belajar.',
        },
      ],
    },
    {
      category: 'Pembelajaran',
      icon: <BookOpen className="w-5 h-5" />,
      questions: [
        {
          question: 'Apa saja mata pelajaran yang tersedia?',
          answer:
            'Bimbelio menyediakan materi lengkap untuk ujian PTN (TPS, Literasi Bahasa, Penalaran Matematika) dan sekolah kedinasan (TWK, TIU, TKP). Semua materi disusun sesuai dengan kurikulum terbaru dan standar ujian nasional.',
        },
        {
          question: 'Bagaimana AI membantu proses belajar saya?',
          answer:
            'AI Personal Tutor kami menganalisis kemampuan dan pola belajar Anda, kemudian memberikan rekomendasi materi yang tepat, menyesuaikan tingkat kesulitan soal, dan memberikan penjelasan yang personal. AI juga bisa menjawab pertanyaan Anda 24/7.',
        },
        {
          question: 'Apakah ada jadwal belajar yang terstruktur?',
          answer:
            'Ya! Sistem kami akan membuat jadwal belajar personal berdasarkan target ujian, waktu yang tersedia, dan kemampuan awal Anda. Jadwal ini bisa disesuaikan kapan saja sesuai kebutuhan.',
        },
      ],
    },
    {
      category: 'Try Out & Evaluasi',
      icon: <Users className="w-5 h-5" />,
      questions: [
        {
          question: 'Seberapa sering try out diadakan?',
          answer:
            'Try out diadakan setiap minggu dengan berbagai jenis tes. Ada try out komprehensif bulanan, try out per mata pelajaran mingguan, dan try out kilat harian. Semua hasil langsung dianalisis oleh AI.',
        },
        {
          question: 'Bagaimana sistem penilaian dan ranking?',
          answer:
            'Sistem penilaian menggunakan IRT (Item Response Theory) yang sama dengan ujian sesungguhnya. Ranking ditampilkan real-time dan Anda bisa melihat posisi relatif terhadap peserta lain serta analisis kekuatan-kelemahan.',
        },
        {
          question: 'Apakah ada sertifikat atau achievement?',
          answer:
            'Ya! Kami memberikan badge achievement untuk berbagai pencapaian, sertifikat digital untuk try out, dan laporan progress yang bisa dibagikan. Top performer juga mendapat recognition khusus.',
        },
      ],
    },
  ];

  const allQuestions = faqData.flatMap((category, categoryIndex) =>
    category.questions.map((q, questionIndex) => ({
      ...q,
      category: category.category,
      icon: category.icon,
      globalIndex: categoryIndex * 10 + questionIndex,
    })),
  );

  const stats = [
    { label: 'Pertanyaan Terjawab', value: '500+', color: mainColor },
    { label: 'Tingkat Kepuasan', value: '98%', color: '#10B981' },
    { label: 'Respon Cepat', value: '< 1 jam', color: '#F59E0B' },
    { label: 'Support 24/7', value: 'Aktif', color: '#8B5CF6' },
  ];

  return (
    <section
      id="faq"
      className="py-16 md:py-24 relative overflow-hidden"
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
              className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
            >
              <MessageCircle className="w-4 h-4" />
              FAQ & BANTUAN
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <AnimatedGradientText>
              Pertanyaan yang Sering Ditanyakan
            </AnimatedGradientText>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Temukan jawaban untuk pertanyaan umum seputar platform dan layanan
            Bimbelio
          </p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
          >
            {stats.map((stat, index) => (
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* FAQ Categories - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Kategori</h3>
            {faqData.map((category, index) => (
              <Card
                key={index}
                className="border-2 border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                style={{
                  borderColor:
                    openIndex !== null && Math.floor(openIndex / 10) === index
                      ? mainColor
                      : '#e5e7eb',
                  backgroundColor:
                    openIndex !== null && Math.floor(openIndex / 10) === index
                      ? `${mainColor}08`
                      : 'white',
                }}
                onClick={() => setOpenIndex(index * 10)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{
                        backgroundColor:
                          openIndex !== null &&
                          Math.floor(openIndex / 10) === index
                            ? mainColor
                            : `${mainColor}15`,
                      }}
                    >
                      <div
                        style={{
                          color:
                            openIndex !== null &&
                            Math.floor(openIndex / 10) === index
                              ? 'white'
                              : mainColor,
                        }}
                      >
                        {category.icon}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {category.category}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {category.questions.length} pertanyaan
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* FAQ Questions - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-4"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Pertanyaan & Jawaban
            </h3>
            {allQuestions.map((item, index) => (
              <Card
                key={index}
                className="border-2 border-gray-100 rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  borderColor:
                    openIndex === item.globalIndex ? mainColor : '#e5e7eb',
                  backgroundColor:
                    openIndex === item.globalIndex ? `${mainColor}03` : 'white',
                }}
              >
                <CardContent className="p-0">
                  <button
                    className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    onClick={() =>
                      setOpenIndex(
                        openIndex === item.globalIndex
                          ? null
                          : item.globalIndex,
                      )
                    }
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${mainColor}15` }}
                      >
                        <div style={{ color: mainColor }}>{item.icon}</div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-left leading-tight">
                          {item.question}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300"
                      style={{
                        backgroundColor:
                          openIndex === item.globalIndex
                            ? mainColor
                            : `${mainColor}15`,
                        transform:
                          openIndex === item.globalIndex
                            ? 'rotate(180deg)'
                            : 'rotate(0deg)',
                      }}
                    >
                      {openIndex === item.globalIndex ? (
                        <Minus className="w-4 h-4 text-white" />
                      ) : (
                        <Plus
                          className="w-4 h-4"
                          style={{ color: mainColor }}
                        />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {openIndex === item.globalIndex && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-0">
                          <div
                            className="p-4 rounded-xl leading-relaxed text-gray-700"
                            style={{ backgroundColor: `${mainColor}08` }}
                          >
                            {item.answer}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>

        {/* Contact Support CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Card
            className="max-w-4xl mx-auto border-2 rounded-3xl overflow-hidden shadow-lg"
            style={{
              borderColor: `${mainColor}20`,
              background: `linear-gradient(135deg, ${mainColor}05, ${secondaryColor}05)`,
            }}
          >
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    Masih ada pertanyaan?
                  </h3>
                  <p className="text-lg text-gray-600">
                    Tim support kami siap membantu Anda 24/7. Jangan ragu untuk
                    menghubungi kami!
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      className="px-8 py-4 rounded-2xl font-bold text-white shadow-lg transition-all duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                      }}
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Hubungi Support
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="px-8 py-4 rounded-2xl font-bold border-2 transition-all duration-300"
                      style={{
                        borderColor: mainColor,
                        color: mainColor,
                      }}
                    >
                      <BookOpen className="w-5 h-5 mr-2" />
                      Lihat Panduan
                    </Button>
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  {[
                    {
                      icon: '📧',
                      label: 'Email',
                      value: 'support@bimbelio.com',
                    },
                    {
                      icon: '💬',
                      label: 'Live Chat',
                      value: 'Chat langsung di website',
                    },
                    {
                      icon: '📱',
                      label: 'WhatsApp',
                      value: '+62 812-3456-7890',
                    },
                  ].map((contact, index) => (
                    <div
                      key={index}
                      className="text-center p-4 rounded-xl bg-white/60 backdrop-blur-sm"
                    >
                      <div className="text-2xl mb-2">{contact.icon}</div>
                      <div className="font-medium text-gray-900">
                        {contact.label}
                      </div>
                      <div className="text-sm text-gray-600">
                        {contact.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
