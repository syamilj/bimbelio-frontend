'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import {
  BimArena,
  BimBot,
  BimCircle,
  BimCourse,
  BimInsight,
  BimLive,
} from '@/components/ui/bim-brand';
import {
  BarChart3,
  BookOpen,
  Bot,
  ChevronRight,
  Target,
  Users,
  Video,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

interface EcosystemItem {
  id: string;
  name: React.ReactNode;
  tagline: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const EcosystemSection: React.FC = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color ?? '#0091FF';

  const ecosystem: EcosystemItem[] = [
    {
      id: 'biminsight',
      name: <BimInsight />,
      tagline: 'Peta Strategi Lolos',
      description: 'Analisis kelemahan dan rekomendasi materi personal berbasis data.',
      icon: BarChart3,
      color: '#0091FF',
    },
    {
      id: 'bimlive',
      name: <BimLive />,
      tagline: 'Kelas Live Interaktif',
      description: 'Live class 2 arah dengan Master Tutor. Tanya langsung, paham seketika.',
      icon: Video,
      color: '#8B5CF6',
    },
    {
      id: 'bimcourse',
      name: <BimCourse />,
      tagline: 'Video Materi 4K',
      description: '5000+ video animasi berkualitas. Konsep rumit jadi gampang nempel.',
      icon: BookOpen,
      color: '#10B981',
    },
    {
      id: 'bimarena',
      name: <BimArena />,
      tagline: 'Try Out IRT Akurat',
      description: 'Simulasi ujian 100% mirip asli dengan scoring IRT nasional.',
      icon: Target,
      color: '#F59E0B',
    },
    {
      id: 'bimbot',
      name: <BimBot />,
      tagline: 'AI Mentor 24/7',
      description: 'Stuck jam 2 pagi? Foto soal, dapat penjelasan step-by-step instan.',
      icon: Bot,
      color: '#EC4899',
    },
    {
      id: 'bimcircle',
      name: <BimCircle />,
      tagline: 'Komunitas Pejuang',
      description: 'Circle siswa ambis se-Indonesia. Sharing tips, catatan, dan motivasi.',
      icon: Users,
      color: '#14B8A6',
    },
  ];

  return (
    <section id="ecosystem" className="py-16 md:py-24 px-5 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.03]"
          style={{ background: `radial-gradient(circle, ${mainColor} 0%, transparent 70%)` }}
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14">
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wide mb-4"
            style={{ backgroundColor: `${mainColor}10`, color: mainColor }}
          >
            <Zap className="w-3.5 h-3.5" />
            6 SENJATA RAHASIA
          </span>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Ekosistem Lengkap{' '}
            <span className="text-gray-400">untuk Lolos PTN</span>
          </h2>

          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Bukan sekadar bimbel. Semua tools yang kamu butuhkan untuk persiapan maksimal — dalam satu platform.
          </p>
        </div>

        {/* Ecosystem Grid - Mobile First */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-10">
          {ecosystem.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="group relative bg-white rounded-3xl p-5 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                {/* Colored accent bar */}
                <div
                  className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: item.color }}
                />

                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-3xl flex items-center justify-center flex-shrink-0 text-white"
                    style={{ backgroundColor: item.color }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-gray-900 mb-0.5">
                      {item.name}
                    </h3>
                    <p
                      className="text-[10px] font-bold uppercase tracking-wider mb-2"
                      style={{ color: item.color }}
                    >
                      {item.tagline}
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div
          className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-center"
          style={{ backgroundColor: mainColor }}
        >
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/10" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/20 text-white mb-4">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Semua fitur sudah termasuk
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
              Siap Akses Semua Fitur?
            </h3>
            <p className="text-white/80 text-sm mb-6 max-w-md mx-auto">
              Daftar sekarang dan langsung explore semua tools untuk persiapan PTN impianmu.
            </p>

            <Link
              href="/price"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold bg-white transition-all hover:bg-gray-50"
              style={{ color: mainColor }}
            >
              Lihat Paket
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EcosystemSection;
