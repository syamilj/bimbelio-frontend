import AnimatedGradientText from '@/components/magicui/animated-gradient-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
      'Penilaian komprehensif UTBK/SNBT',
      'Analisis kekuatan dan kelemahan',
      'Rekomendasi materi personal',
    ],
    stat: '15 menit',
    statLabel: 'Waktu rata-rata',
    learningPoints: [
      'Mengenal tipe soal UTBK/SNBT',
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
      'Memahami konsep dasar materi UTBK/SNBT',
      'Mempelajari materi secara interaktif',
      'Menguji pemahaman melalui quiz',
    ],
    importance:
      'Untuk membangun pemahaman yang kuat dan komprehensif tentang materi UTBK/SNBT.',
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
    badge: 'Via Zoom',
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
    description: 'Evaluasi perkembanganmu dengan simulasi UTBK/SNBT lengkap.',
    stats: [
      { icon: <FileQuestionIcon className="size-3 mr-1" />, value: '100 soal' },
      { icon: <ClockIcon className="size-3 mr-1" />, value: '120 menit' },
    ],
    features: [
      'Simulasi UTBK/SNBT lengkap',
      'Analisis detail performa',
      'Rekomendasi langkah selanjutnya',
    ],
    stat: '98%',
    statLabel: 'Akurasi prediksi skor UTBK',
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
  const [activeStep, setActiveStep] = useState(0);
  const [autoChange, setAutoChange] = useState(true);
  const [ref, inView] = useInView();
  const detailCardRef = useRef<HTMLDivElement>(null);

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
    // Menambahkan id sehingga halaman dapat di‑href, misalnya "#cara-belajar"
    <section
      id="cara-belajar"
      className="max-w-[1280px] space-y-8 mx-auto px-4 py-8"
    >
      <div className="text-center space-y-2">
        <h2 className="text-center text-[1.5rem] font-bold md:text-[2.5rem]">
          <AnimatedGradientText>
            Bagaimana Cara Belajarnya?
          </AnimatedGradientText>
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          Kami menyediakan metode belajar yang{' '}
          <span className="font-semibold text-main">komprehensif</span> dan{' '}
          <span className="font-semibold text-main">interaktif</span> untuk
          memaksimalkan potensi belajarmu menuju kesuksesan UTBK/SNBT.
        </p>
      </div>

      <div className="grid gap-8 lg:gap-12 lg:grid-cols-2">
        {/* Steps (Bagian Kiri) */}
        <div className="space-y-4 sm:space-y-6 items-center justify-center">
          {learningSteps.map((step, index) => (
            <Card
              key={index}
              onClick={() => handleStepClick(index)}
              className={`cursor-pointer transition-all duration-300 overflow-hidden ${
                activeStep === index
                  ? 'ring-2 ring-main shadow-lg'
                  : 'hover:shadow-sm'
              }`}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div
                    className={`size-10 sm:size-12 rounded-full flex items-center justify-center ${
                      activeStep === index
                        ? 'bg-main text-white'
                        : 'bg-main/10 text-main'
                    }`}
                  >
                    {step.icon}
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-semibold text-sm sm:text-base mb-1">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {step.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <Badge
                        variant={activeStep === index ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {step.badge}
                      </Badge>
                      {step.stats &&
                        step.stats.map((stat, statIndex) => (
                          <Badge
                            key={statIndex}
                            variant="outline"
                            className="text-xs"
                          >
                            {stat.icon} {stat.value}
                          </Badge>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detail (Bagian Kanan) */}
        <div
          ref={ref}
          className="lg:sticky lg:top-24 lg:self-start"
        >
          <Card
            ref={detailCardRef}
            className="overflow-hidden"
          >
            <CardContent className="p-4 sm:p-6 space-y-6">
              {/* Header Detail */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-1">
                  <h4 className="text-xl sm:text-2xl font-bold">
                    {learningSteps[activeStep].title}
                  </h4>
                  <Badge
                    variant="outline"
                    className="text-xs sm:text-sm"
                  >
                    {learningSteps[activeStep].badge}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {learningSteps[activeStep].description}
                  </p>
                </div>
                <div className="text-left sm:text-right space-y-1">
                  <p className="text-xl sm:text-2xl font-bold text-main">
                    {learningSteps[activeStep].stat}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {learningSteps[activeStep].statLabel}
                  </p>
                </div>
              </div>

              {/* Info Tambahan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-muted p-3 sm:p-4 rounded-xl space-y-1">
                  <h5 className="font-semibold">
                    Apa yang akan kamu pelajari:
                  </h5>
                  <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                    {learningSteps[activeStep].learningPoints?.map(
                      (point, index) => <li key={index}>{point}</li>,
                    )}
                  </ul>
                </div>
                <div className="bg-muted p-3 sm:p-4 rounded-xl space-y-1">
                  <h5 className="font-semibold">Mengapa ini penting:</h5>
                  <p className="text-xs sm:text-sm">
                    {learningSteps[activeStep].importance}
                  </p>
                </div>
              </div>

              {/* Fitur Utama */}
              {learningSteps[activeStep].features && (
                <div className="space-y-2">
                  <h5 className="font-semibold text-sm sm:text-base">
                    Fitur Utama:
                  </h5>
                  <ul className="space-y-2">
                    {learningSteps[activeStep].features.map(
                      (feature, fIndex) => (
                        <li
                          key={fIndex}
                          className="flex items-center gap-2"
                        >
                          <CheckCircleIcon className="size-4 sm:size-5 mr-1 text-main" />
                          <span className="text-xs sm:text-sm">{feature}</span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}

              {/* Placeholder Gambar/Video */}
              <div className="aspect-video bg-muted rounded-xl overflow-hidden" />

              {/* Footer */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {learningSteps[activeStep].users} pengguna telah mencoba ini
                </p>
                <Button
                  variant="outline"
                  size="sm"
                >
                  Coba Sekarang
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
