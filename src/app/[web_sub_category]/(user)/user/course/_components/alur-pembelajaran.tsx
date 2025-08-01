'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, BookOpen } from 'lucide-react';

const learningSteps = [
  {
    number: '1',
    title: 'Pengenalan UTBK & SNBT',
    description:
      'Pelajari format, struktur, dan strategi dasar menghadapi ujian SNBT.',
  },
  {
    number: '2',
    title: 'Fondasi Penalaran Umum',
    description:
      'Kuasai konsep logika & analisis sebagai landasan berpikir kritis.',
  },
  {
    number: '3',
    title: 'Teknik Membaca Efektif',
    description: 'Tingkatkan kecepatan dan pemahaman baca untuk teks kompleks.',
  },
  {
    number: '4',
    title: 'Strategi Penalaran Kuantitatif',
    description:
      'Selesaikan soal matematika & kuantitatif dengan cepat dan tepat.',
  },
  {
    number: '5',
    title: 'Pemahaman Bacaan Kritis',
    description: 'Asah kemampuan menelaah & mengevaluasi berbagai tipe teks.',
  },
  {
    number: '6',
    title: 'Pengetahuan & Pemahaman Umum',
    description:
      'Perluas wawasan sains, sosial, dan isu kontemporer untuk SNBT.',
  },
  {
    number: '7',
    title: 'Literasi Bahasa Indonesia',
    description:
      'Dalami analisis teks & tata bahasa Indonesia yang sering keluar.',
  },
  {
    number: '8',
    title: 'Literasi Bahasa Inggris',
    description: 'Tingkatkan kemampuan membaca teks dan pemahaman grammar.',
  },
  {
    number: '9',
    title: 'Latihan Soal Terpadu',
    description:
      'Kombinasi soal logika, matematika, dan literasi dalam satu sesi.',
  },
  {
    number: '10',
    title: 'Simulasi Tryout SNBT',
    description: 'Uji kesiapanmu dengan simulasi ujian mendekati kondisi real.',
  },
  {
    number: '11',
    title: 'Review & Analisis Hasil',
    description:
      'Identifikasi kelemahan & perkuat area yang masih perlu peningkatan.',
  },
  {
    number: '12',
    title: 'Persiapan Akhir',
    description: 'Tips final & manajemen waktu untuk menghadapi hari-H SNBT.',
  },
];

export function AlurPembelajaranSection() {
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  return (
    <section className="space-y-6 pt-8">
      {/* Section Header */}
      <div className="text-center space-y-4">
        <div
          className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
          }}
        >
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <h2
          className="text-2xl md:text-3xl font-bold"
          style={{ color: mainColor }}
        >
          Alur Pembelajaran Bimbelio
        </h2>
        <div
          className="w-20 h-1 mx-auto rounded-full"
          style={{ backgroundColor: secondaryColor }}
        />
        <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
          Lalui setiap tahap, dan lihat bagaimana perkembanganmu naik pesat!
        </p>
      </div>

      {/* Learning Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {learningSteps.map((item, index) => (
          <LearningPathCard
            key={index}
            number={item.number}
            title={item.title}
            description={item.description}
            mainColor={mainColor}
            secondaryColor={secondaryColor}
            isLast={index === learningSteps.length - 1}
          />
        ))}
      </div>

      {/* Bottom CTA */}
      <div
        className="mt-12 p-8 rounded-2xl text-center relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
        }}
      >
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-white mb-3">
            Siap Memulai Perjalanan Belajar?
          </h3>
          <p className="text-white/90 mb-4 max-w-2xl mx-auto">
            Ikuti alur pembelajaran yang telah dirancang khusus untuk
            mempersiapkan kamu menghadapi SNBT dengan percaya diri
          </p>
          <div className="flex items-center justify-center gap-2 text-white/80 text-sm">
            <span>12 Tahap Pembelajaran</span>
            <ArrowRight className="w-4 h-4" />
            <span>Target SNBT Tercapai</span>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute -left-8 -bottom-8 w-24 h-24 rounded-full bg-white/10" />
      </div>
    </section>
  );
}

function LearningPathCard({
  number,
  title,
  description,
  mainColor,
  secondaryColor,
  isLast,
}: {
  number: string;
  title: string;
  description: string;
  mainColor: string;
  secondaryColor: string;
  isLast: boolean;
}) {
  return (
    <Card className="group bg-white shadow-lg border-0 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative">
      {/* Connection line to next card */}
      {!isLast && (
        <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 z-10 hidden lg:block">
          <div
            className="w-6 h-0.5 opacity-30 group-hover:opacity-60 transition-opacity"
            style={{ backgroundColor: mainColor }}
          />
          <ArrowRight
            className="w-4 h-4 absolute -right-2 -top-1.5 opacity-30 group-hover:opacity-60 transition-all group-hover:translate-x-1"
            style={{ color: mainColor }}
          />
        </div>
      )}

      {/* Floating sparkles */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
      </div>
      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div
          className="w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse"
          style={{ animationDelay: '200ms' }}
        />
      </div>

      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Enhanced Step Number */}
          <div className="relative shrink-0">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg text-white font-bold text-xl group-hover:scale-110 transition-all duration-300 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
            >
              <span className="relative z-10">{number}</span>
              {/* Shine effect */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 -skew-x-12 group-hover:animate-shimmer" />
            </div>

            {/* Pulse ring */}
            <div
              className="absolute inset-0 w-14 h-14 rounded-2xl opacity-0 group-hover:opacity-30 animate-ping"
              style={{ backgroundColor: mainColor }}
            />
          </div>

          {/* Enhanced Content */}
          <div className="flex-1 space-y-4">
            <div>
              <h3
                className="font-bold text-lg leading-tight group-hover:scale-105 transition-transform duration-300 origin-left mb-2"
                style={{ color: mainColor }}
              >
                {title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors">
                {description}
              </p>
            </div>

            {/* Enhanced Progress indicator */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: mainColor }}
                  />
                  <div className="text-xs text-gray-500 font-medium">
                    Tahap {number} dari 12
                  </div>
                </div>
              </div>

              {/* Arrow for mobile view */}
              {!isLast && (
                <div className="lg:hidden">
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                </div>
              )}
            </div>

            {/* Difficulty indicator */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Tingkat:</span>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(parseInt(number), 3) }).map(
                  (_, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor:
                          i < Math.min(parseInt(number), 3)
                            ? mainColor
                            : '#e5e7eb',
                      }}
                    />
                  ),
                )}
              </div>
              <span
                className="text-xs font-medium"
                style={{ color: mainColor }}
              >
                {parseInt(number) <= 4
                  ? 'Dasar'
                  : parseInt(number) <= 8
                    ? 'Menengah'
                    : 'Lanjut'}
              </span>
            </div>
          </div>
        </div>

        {/* Hover effect overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
          }}
        />

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500 rounded-b-2xl"
          style={{ backgroundColor: mainColor }}
        />
      </CardContent>

      {/* Custom CSS for shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </Card>
  );
}

export default AlurPembelajaranSection;
