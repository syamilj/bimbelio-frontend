import AnimatedGradientText from '@/components/magicui/animated-gradient-text';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpenIcon,
  BrainIcon,
  CheckCircleIcon,
  ClockIcon,
  FileQuestionIcon,
  PlayIcon,
  UsersIcon,
  VideoIcon,
  ZapIcon,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const learningSteps = [
  {
    icon: <BrainIcon className="size-6 hover:text-white" />,
    title: 'Quiz Awal',
    badge: 'Pengecekan Kemampuan',
    description:
      'Nilai kemampuanmu dan dapatkan rencana belajar personal yang sesuai.',
    stats: [
      {
        icon: <FileQuestionIcon className="size-3 mr-1" />,
        value: '30 soal',
      },
      { icon: <ClockIcon className="size-3 mr-1" />, value: '45 menit' },
    ],
    features: [
      'Penilaian komprehensif PTN dan Kedinasan',
      'Analisis kekuatan dan kelemahan',
      'Rekomendasi materi personal',
    ],
    stat: '15 menit',
    statLabel: 'Waktu rata-rata',
    learningPoints: [
      'Mengenal tipe soal PTN dan Kedinasan',
      'Mengidentifikasi kekuatan dan kelemahan',
      'Membuat rencana belajar personal',
    ],
    importance:
      'Untuk mengetahui level kemampuan awal dan membuat rencana belajar yang efektif dan efisien.',
    users: '1000+',
  },
  {
    icon: <PlayIcon className="size-6" />,
    title: 'Bahan Belajar Interaktif',
    badge: 'Video, Materi, Quiz',
    description:
      'Akses beragam materi belajar komprehensif dan interaktif untuk pemahaman optimal.',
    stats: [
      { icon: <BookOpenIcon className="size-3 mr-1" />, value: '50+ materi' },
      {
        icon: <FileQuestionIcon className="size-3 mr-1" />,
        value: '100+ quiz',
      },
    ],
    features: [
      'Video interaktif dengan penjelasan detail',
      'Materi terstruktur per topik',
      'Quiz per bab untuk evaluasi',
    ],
    stat: '1000+',
    statLabel: 'Materi tersedia',
    learningPoints: [
      'Memahami konsep dasar materi PTN dan Kedinasan',
      'Mempelajari materi secara interaktif',
      'Menguji pemahaman melalui quiz',
    ],
    importance:
      'Untuk membangun pemahaman yang kuat dan komprehensif tentang materi PTN dan Kedinasan.',
    users: '2000+',
  },
  {
    icon: <ZapIcon className="size-6" />,
    title: 'Active AI-based Learning',
    badge: 'Pembelajaran Adaptif',
    description:
      'Belajar dengan AI yang menyesuaikan materi berdasarkan kemajuanmu.',
    stats: [{ icon: <ClockIcon className="size-3 mr-1" />, value: '24/7' }],
    features: [
      'Chat AI 24/7',
      'Note AI untuk ringkasan cerdas',
      'Quiz AI adaptif',
    ],
    stat: '95%',
    statLabel: 'Kepuasan pengguna',
    learningPoints: [
      'Belajar dengan kecepatanmu sendiri',
      'Mendapatkan materi yang sesuai dengan kebutuhanmu',
      'Meningkatkan efisiensi belajar',
    ],
    importance:
      'Untuk menyesuaikan pembelajaran dengan kemampuan dan kebutuhan individu.',
    users: '1500+',
  },
  {
    icon: <VideoIcon className="size-6" />,
    title: 'Video Asynchronous',
    badge: 'Belajar Fleksibel',
    description: 'Tonton video pembelajaran kapan saja dan di mana saja.',
    stats: [{ icon: <ClockIcon className="size-3 mr-1" />, value: '500+ jam' }],
    features: [
      'Akses tak terbatas ke perpustakaan video',
      'Fitur tanya AI',
      'Transkrip dan ringkasan otomatis',
    ],
    stat: '500+',
    statLabel: 'Jam konten video',
    learningPoints: [
      'Belajar kapan saja dan di mana saja',
      'Menonton video pembelajaran secara fleksibel',
      'Menggunakan fitur transkrip dan ringkasan',
    ],
    importance: 'Untuk memberikan fleksibilitas dan kemudahan dalam belajar.',
    users: '2500+',
  },
  {
    icon: <UsersIcon className="size-6" />,
    title: 'Kelas Real-time',
    badge: 'Via Google Meet',
    description: 'Ikuti kelas langsung interaktif dengan tutor ahli.',
    stats: [
      { icon: <UsersIcon className="size-3 mr-1" />, value: '20+ tutor' },
    ],
    features: [
      'Jadwal kelas mingguan',
      'Sesi tanya jawab langsung',
      'Rekaman kelas tersedia',
    ],
    stat: '20+',
    statLabel: 'Kelas live per minggu',
    learningPoints: [
      'Berinteraksi langsung dengan tutor ahli',
      'Mendapatkan penjelasan langsung dan interaktif',
      'Mengajukan pertanyaan dan berdiskusi',
    ],
    importance:
      'Untuk mendapatkan interaksi langsung dengan tutor dan meningkatkan pemahaman.',
    users: '1200+',
  },
  {
    icon: <CheckCircleIcon className="size-6" />,
    title: 'Quiz Akhir',
    badge: 'Evaluasi Kemajuan',
    description:
      'Evaluasi perkembanganmu dengan simulasi PTN dan Kedinasan lengkap.',
    stats: [
      { icon: <FileQuestionIcon className="size-3 mr-1" />, value: '100 soal' },
      { icon: <ClockIcon className="size-3 mr-1" />, value: '120 menit' },
    ],
    features: [
      'Simulasi PTN dan Kedinasan lengkap',
      'Analisis detail performa',
      'Rekomendasi langkah selanjutnya',
    ],
    stat: '98%',
    statLabel: 'Akurasi prediksi skor',
    learningPoints: [
      'Menguji pemahaman secara komprehensif',
      'Menganalisis performa dan mengidentifikasi area yang perlu ditingkatkan',
      'Mendapatkan rekomendasi untuk langkah selanjutnya',
    ],
    importance:
      'Untuk mengevaluasi pemahaman dan membuat rencana belajar yang lebih terarah.',
    users: '800+',
  },
];

export default function CaraBelajarSection1() {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [activeStep, setActiveStep] = useState(0);
  const [autoChange, setAutoChange] = useState(true);
  const [ref, inView] = useInView();
  const detailCardRef = useRef<HTMLDivElement>(null);

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  // Logika ketika komponen dalam viewport (bisa dikembangkan sesuai kebutuhan)
  useEffect(() => {
    if (inView) {
      // Tambahkan logika jika diperlukan misal menghentikan autoChange
    }
  }, [inView]);

  // Auto rotate setiap 3 detik
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoChange) {
      timer = setInterval(() => {
        setActiveStep((prevStep) => (prevStep + 1) % learningSteps.length);
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [autoChange]);

  const handleStepClick = useCallback((index: number) => {
    setActiveStep(index);
    setAutoChange(false);
    if (window.innerWidth < 1024 && detailCardRef.current) {
      detailCardRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <section
      id="cara-belajar"
      className="py-16 md:py-24 relative overflow-hidden"
    >
      {/* Enhanced Background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-5 blur-3xl"
          style={{ backgroundColor: mainColor }}
        />
        <div
          className="absolute bottom-20 right-10 w-72 h-72 rounded-full opacity-5 blur-3xl"
          style={{ backgroundColor: secondaryColor }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-3 blur-3xl"
          style={{ backgroundColor: mainColor }}
        />
      </div>

      <div className="max-w-2xl mx-auto px-4 space-y-12">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-6"
        >
          <h2 className="text-4xl md:text-5xl font-bold">
            <AnimatedGradientText>
              Bagaimana Cara Belajarnya?
            </AnimatedGradientText>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Kami menyediakan metode belajar yang{' '}
            <span
              className="font-bold"
              style={{ color: mainColor }}
            >
              komprehensif
            </span>{' '}
            dan{' '}
            <span
              className="font-bold"
              style={{ color: mainColor }}
            >
              interaktif
            </span>{' '}
            untuk memaksimalkan potensi belajarmu menuju kesuksesan PTN dan
            Kedinasan.
          </p>
        </motion.div>

        <div className="grid gap-12 lg:gap-16 xl:grid-cols-2">
          {/* Enhanced Steps Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900">
                Langkah Pembelajaran
              </h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-gray-600">
                  {autoChange ? 'Auto playing' : 'Manual'}
                </span>
              </div>
            </div>

            <AnimatePresence>
              {learningSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    onClick={() => handleStepClick(index)}
                    className={`cursor-pointer transition-all duration-500 overflow-hidden border-2 hover:shadow-xl ${
                      activeStep === index
                        ? 'shadow-2xl scale-[1.02]'
                        : 'hover:shadow-lg'
                    }`}
                    style={{
                      borderColor: activeStep === index ? mainColor : '#e5e7eb',
                      backgroundColor:
                        activeStep === index ? `${mainColor}08` : 'white',
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        {/* Step Number & Icon */}
                        <div className="relative shrink-0">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-300 ${
                              activeStep === index
                                ? 'text-white shadow-lg'
                                : 'text-gray-600'
                            }`}
                            style={{
                              backgroundColor:
                                activeStep === index
                                  ? mainColor
                                  : `${mainColor}15`,
                            }}
                          >
                            {step.icon}
                          </motion.div>
                          <div
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md"
                            style={{ backgroundColor: secondaryColor }}
                          >
                            {index + 1}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-3">
                          <h4 className="text-lg md:text-xl font-bold text-gray-900">
                            {step.title}
                          </h4>
                          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                            {step.description}
                          </p>

                          {/* Enhanced Badges */}
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge
                              variant={
                                activeStep === index ? 'default' : 'outline'
                              }
                              className="text-xs font-medium"
                              style={{
                                backgroundColor:
                                  activeStep === index
                                    ? mainColor
                                    : 'transparent',
                                borderColor: mainColor,
                                color:
                                  activeStep === index ? 'white' : mainColor,
                              }}
                            >
                              {step.badge}
                            </Badge>
                            {step.stats?.map((stat, statIndex) => (
                              <Badge
                                key={statIndex}
                                variant="outline"
                                className="text-xs border-gray-300"
                              >
                                {stat.icon} {stat.value}
                              </Badge>
                            ))}
                          </div>

                          {/* Progress Indicator */}
                          {activeStep === index && (
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: '100%' }}
                              className="h-1 rounded-full mt-4"
                              style={{ backgroundColor: mainColor }}
                            />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Enhanced Detail Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            ref={ref}
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Card
                  ref={detailCardRef}
                  className="overflow-hidden border-2 shadow-2xl rounded-3xl"
                  style={{ borderColor: `${mainColor}20` }}
                >
                  <CardContent className="p-8 space-y-8">
                    {/* Enhanced Header */}
                    <div className="relative">
                      <div
                        className="absolute inset-0 rounded-3xl opacity-10"
                        style={{ backgroundColor: mainColor }}
                      />
                      <div className="relative p-6 text-center">
                        <div
                          className="w-20 h-20 mx-auto mb-4 rounded-3xl flex items-center justify-center text-white shadow-xl"
                          style={{ backgroundColor: mainColor }}
                        >
                          {learningSteps[activeStep].icon}
                        </div>
                        <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                          {learningSteps[activeStep].title}
                        </h4>
                        <Badge
                          className="text-sm font-medium"
                          style={{
                            backgroundColor: `${mainColor}15`,
                            color: mainColor,
                          }}
                        >
                          {learningSteps[activeStep].badge}
                        </Badge>
                      </div>
                    </div>

                    {/* Stats Display */}
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        className="text-center p-4 rounded-3xl"
                        style={{ backgroundColor: `${mainColor}08` }}
                      >
                        <div
                          className="text-3xl font-bold mb-1"
                          style={{ color: mainColor }}
                        >
                          {learningSteps[activeStep].stat}
                        </div>
                        <div className="text-sm text-gray-600">
                          {learningSteps[activeStep].statLabel}
                        </div>
                      </div>
                      <div
                        className="text-center p-4 rounded-3xl"
                        style={{ backgroundColor: `${secondaryColor}08` }}
                      >
                        <div
                          className="text-3xl font-bold mb-1"
                          style={{ color: secondaryColor }}
                        >
                          {learningSteps[activeStep].users}
                        </div>
                        <div className="text-sm text-gray-600">
                          Pengguna Aktif
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Info Grid */}
                    <div className="space-y-6">
                      <div
                        className="p-6 rounded-3xl"
                        style={{ backgroundColor: `${mainColor}08` }}
                      >
                        <h5 className="font-bold text-lg mb-3 flex items-center gap-2">
                          <CheckCircleIcon
                            className="w-5 h-5"
                            style={{ color: mainColor }}
                          />
                          Apa yang akan kamu pelajari:
                        </h5>
                        <ul className="space-y-2">
                          {learningSteps[activeStep].learningPoints?.map(
                            (point, index) => (
                              <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-2 text-sm"
                              >
                                <div
                                  className="w-2 h-2 rounded-full mt-2 shrink-0"
                                  style={{ backgroundColor: mainColor }}
                                />
                                <span>{point}</span>
                              </motion.li>
                            ),
                          )}
                        </ul>
                      </div>

                      <div className="p-6 rounded-3xl bg-gray-50">
                        <h5 className="font-bold text-lg mb-3 text-gray-900">
                          💡 Mengapa ini penting:
                        </h5>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {learningSteps[activeStep].importance}
                        </p>
                      </div>
                    </div>

                    {/* Enhanced Features List */}
                    {learningSteps[activeStep].features && (
                      <div className="space-y-4">
                        <h5 className="font-bold text-lg">
                          🚀 Fitur Unggulan:
                        </h5>
                        <div className="grid gap-3">
                          {learningSteps[activeStep].features.map(
                            (feature, fIndex) => (
                              <motion.div
                                key={fIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: fIndex * 0.1 }}
                                className="flex items-center gap-3 p-3 rounded-3xl bg-white shadow-sm"
                              >
                                <CheckCircleIcon
                                  className="w-5 h-5 shrink-0"
                                  style={{ color: mainColor }}
                                />
                                <span className="text-sm font-medium">
                                  {feature}
                                </span>
                              </motion.div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                    {/* Enhanced Mockup */}
                    <div
                      className="aspect-video rounded-3xl overflow-hidden relative"
                      style={{ backgroundColor: `${mainColor}10` }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center text-white"
                          style={{ backgroundColor: mainColor }}
                        >
                          <PlayIcon className="w-8 h-8 ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-3">
                          <div className="text-sm font-medium text-gray-900 mb-1">
                            Preview: {learningSteps[activeStep].title}
                          </div>
                          <div className="text-xs text-gray-600">
                            Klik untuk melihat demo interaktif
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Footer */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-100">
                      <div className="text-center sm:text-left">
                        <div className="text-sm text-gray-600">
                          ⭐ Rating kepuasan:{' '}
                          <span className="font-bold">4.9/5</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          dari {learningSteps[activeStep].users} pengguna
                        </div>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          size="lg"
                          className="text-white font-bold px-6 py-3 rounded-3xl shadow-lg"
                          style={{ backgroundColor: mainColor }}
                        >
                          Coba Sekarang →
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
