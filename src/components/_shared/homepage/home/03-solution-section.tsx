'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  FileCheck,
  Lightbulb,
  Map,
  RefreshCw,
  Target,
  Users,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
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

  const pathname = usePathname();

  // Get dynamic colors
  const isMainLandingPage = pathname === '/';
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
        subtitle: 'Identifikasi topik penting',
        description:
          'Dari ribuan topik, kami hitung mana yang paling sering keluar di ujian. Fokus ke situ dulu — bukan random belajar.',
        icon: <Target className="w-8 h-8" />,
        color: PILLAR_COLORS.azure,
      },
      {
        letter: 'R',
        title: 'Rhythm',
        subtitle: 'Belajar dengan rutinitas',
        description:
          'Sistem tracking memastikan kamu belajar konsisten setiap hari. Bukan sekali-kali intensif yang bikin burnout.',
        icon: <Clock className="w-8 h-8" />,
        color: PILLAR_COLORS.violet,
      },
      {
        letter: 'I',
        title: 'Iterate',
        subtitle: 'Perbaiki strategi berdasarkan data',
        description:
          'Setiap kali jawab soal salah, sistem analisis kenapa. Terus diapdate sampai pattern-nya jelas dan bisa dihindari.',
        icon: <RefreshCw className="w-8 h-8" />,
        color: PILLAR_COLORS.emerald,
      },
      {
        letter: 'N',
        title: 'Navigate',
        subtitle: 'Roadmap yang jelas dari awal',
        description:
          'Tahu persis harus belajar apa dulu, apa sesudahnya. Materi tersusun — bukan sembarangan atau tersesat di tengah jalan.',
        icon: <Map className="w-8 h-8" />,
        color: PILLAR_COLORS.amber,
      },
      {
        letter: 'T',
        title: 'Test',
        subtitle: 'Latihan yang adaptive & terukur',
        description:
          'Soal yang diberikan disesuaikan level kamu — makin pintar, makin sulit. Progress real-time bisa dilihat kapan saja.',
        icon: <FileCheck className="w-8 h-8" />,
        color: PILLAR_COLORS.rose,
      },
      {
        letter: 'S',
        title: 'Support',
        subtitle: 'Mentor siap kapan saja',
        description:
          'Stuck? Ada AI Mentor 24/7 atau tutor alumni PTN top yang siap jawab. Nggak pernah belajar sendiri sampai frustasi.',
        icon: <Users className="w-8 h-8" />,
        color: PILLAR_COLORS.indigo,
      },
    ],
    [],
  );

  const problemMappings: ProblemMapping[] = useMemo(() => [], []);

  // const socialProofStats: SocialProofStat[] = useMemo(
  //   () => [
  //     {
  //       value: '95%',
  //       label: 'Siswa Lolos',
  //       icon: <CheckCircle2 className="w-5 h-5" />,
  //     },
  //     {
  //       value: '5000+',
  //       label: 'Siswa Aktif',
  //       icon: <Users className="w-5 h-5" />,
  //     },
  //     {
  //       value: '4.9/5',
  //       label: 'Rating',
  //       icon: <Sparkles className="w-5 h-5" />,
  //     },
  //   ],
  //   [],
  // );

  // Animation variants
  // const containerVariants = {
  //   hidden: { opacity: 0 },
  //   visible: {
  //     opacity: 1,
  //     transition: {
  //       staggerChildren: 0.1,
  //       delayChildren: 0.2,
  //     },
  //   },
  // };

  // const itemVariants = {
  //   hidden: { opacity: 0, y: 20 },
  //   visible: {
  //     opacity: 1,
  //     y: 0,
  //     transition: {
  //       duration: 0.5,
  //     },
  //   },
  // };

  // const cardVariants = {
  //   hidden: { opacity: 0, scale: 0.95 },
  //   visible: {
  //     opacity: 1,
  //     scale: 1,
  //     transition: {
  //       duration: 0.6,
  //     },
  //   },
  // };

  return (
    <section
      id="solution"
      className="py-20 md:py-24 px-4 md:px-8 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <Badge
              variant="outline"
              className="px-6 py-2 text-sm font-bold text-white border-none"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
            >
              <Lightbulb className="w-4 h-4 mr-2 inline" />
              Ada Solusi Sistematis
            </Badge>
          </div>

          {/* Main Heading */}
          <div className="mb-8">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
              Yang Berhasil Tahu Satu Hal —
            </h2>
            <h2
              className="text-4xl md:text-5xl font-black bg-clip-text text-transparent"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Mereka Punya Sistem
            </h2>
          </div>

          {/* Subtext */}
          <p className="text-base text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Ribuan siswa yang awalnya juga bingung & stagnan — berhasil masuk
            PTN impian bukan karena lebih pintar, tapi karena{' '}
            <span
              style={{ color: mainColor }}
              className="font-bold"
            >
              punya sistem yang jelas
            </span>
            . PRINTS adalah kerangka kerja berdasarkan pola mereka yang
            berhasil: enam pilar yang menjawab setiap masalah, dari materi,
            prioritas, rhythm, feedback, latihan, hingga support lengkap.
          </p>
        </div>

        {/* PRINTS Pillars Grid */}
        <div className="mb-20">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Gimana Cara Kerjanya?
            </h3>
            <p className="text-base md:text-lg text-gray-600">
              PRINTS bekerja dalam 6 tahap — dari identifikasi masalah sampai
              konsistensi berkelanjutan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {printsPillars.map((pillar, idx) => (
              <div
                key={idx}
                className="group relative bg-white rounded-2xl border-2 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
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

                <div className="p-6 flex flex-col items-center text-center h-full">
                  {/* Header with Icon & Letter */}
                  <div className="flex flex-col items-center gap-3 mb-4">
                    {/* Icon */}
                    <div
                      className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg"
                      style={{
                        backgroundColor: pillar.color,
                      }}
                    >
                      {pillar.icon}
                    </div>

                    {/* Large Letter */}
                    <div
                      className="text-5xl font-black leading-none opacity-30"
                      style={{ color: pillar.color }}
                    >
                      {pillar.letter}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-2 flex-1 flex flex-col justify-center">
                    <h4 className="text-xl font-black text-gray-900">
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
                  <div className="mt-4 pt-4 border-t border-gray-100 w-full">
                    <div
                      className="h-1 w-12 rounded-full mx-auto"
                      style={{ backgroundColor: pillar.color }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
