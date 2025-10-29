'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

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
    <section className="mb-12">
      {/* Section Header - Match Dashboard Style */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: mainColor }}
        >
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-black text-gray-900">Alur Pembelajaran</h2>
      </div>

      {/* Learning Steps - Clean Grid */}
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
  const numValue = parseInt(number);
  const difficultyLevel =
    numValue <= 4 ? 'Dasar' : numValue <= 8 ? 'Menengah' : 'Lanjut';

  const getBadgeColor = () => {
    if (numValue <= 4) {
      return {
        bg: 'linear-gradient(to bottom right, rgb(239 246 255), rgb(219 234 254))',
        border: 'rgb(191 219 254)',
        text: 'text-blue-700',
      };
    } else if (numValue <= 8) {
      return {
        bg: 'linear-gradient(to bottom right, rgb(255 247 237), rgb(254 237 219))',
        border: 'rgb(254 215 170)',
        text: 'text-orange-700',
      };
    } else {
      return {
        bg: 'linear-gradient(to bottom right, rgb(240 253 244), rgb(220 252 231))',
        border: 'rgb(187 247 208)',
        text: 'text-green-700',
      };
    }
  };

  const badgeStyle = getBadgeColor();

  return (
    <Card className="border-2 border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-6 space-y-4">
        {/* Header with step number */}
        <div className="flex items-start justify-between gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
            style={{ backgroundColor: mainColor }}
          >
            {number}
          </div>

          {/* Difficulty Badge */}
          <div
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 ${badgeStyle.text}`}
            style={{
              background: badgeStyle.bg,
              borderColor: badgeStyle.border,
            }}
          >
            {difficultyLevel}
          </div>
        </div>

        {/* Title and Description */}
        <div className="space-y-2">
          <h3 className="font-bold text-base leading-tight text-gray-900">
            {title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default AlurPembelajaranSection;
