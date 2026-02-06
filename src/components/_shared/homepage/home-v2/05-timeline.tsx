'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Calendar, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Program {
  id: number;
  period: string;
  phase: string;
  badge: string;
  description: string;
  features: string[];
  logos: string[];
  isHighlight?: boolean;
}

const TimelineSection: React.FC = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const pathname = usePathname();

  const isMainLandingPage = pathname === '/';
  const mainColor = isMainLandingPage
    ? '#0091FF'
    : (websiteSubCategory?.main_color ?? '#0091FF');

  const programs: Program[] = [
    {
      id: 1,
      period: 'Jan - Mar',
      phase: 'Fase Intensif',
      badge: '4x/minggu',
      description:
        'Bedah konsep dasar & tipe soal SNBT untuk fondasi yang kuat.',
      features: [
        'Bedah konsep dasar',
        'Live class 4x seminggu',
        'Fondasi materi kuat',
      ],
      logos: ['/hero/LOGO_SNBT.webp'],
    },
    {
      id: 2,
      period: 'Apr - Mei',
      phase: 'Fase Super Intensif',
      badge: '6x/minggu',
      description: 'Full simulasi TO & bahas soal untuk persiapan final.',
      features: [
        'Full Simulasi TO',
        'Drill hampir tiap hari',
        'Sprint menuju ujian',
      ],
      logos: ['/hero/LOGO_SNBT.webp'],
      isHighlight: true,
    },
    {
      id: 3,
      period: 'Jun - Jul',
      phase: 'Fase Ujian Mandiri',
      badge: '6x/minggu',
      description: 'Sikat soal HOTS untuk SIMAK UI & UTUL UGM.',
      features: ['Soal level HOTS', 'Strategi UI & UGM', 'Persiapan mandiri'],
      logos: ['/hero/LOGO_PTN_UI.webp', '/hero/LOGO_PTN_UGM.webp'],
    },
    {
      id: 4,
      period: 'Jul - Agu',
      phase: 'Fase Kedinasan',
      badge: '4x/minggu',
      description: 'Khusus SKD (TIU, TWK, TKP) untuk STAN & STIS.',
      features: [
        'Bedah SKD lengkap',
        'Strategi STAN/STIS',
        'Simulasi kedinasan',
      ],
      logos: [
        '/hero/LOGO_KEDINASAN_STAN.webp',
        '/hero/LOGO_KEDINASAN_STIS.webp',
      ],
    },
  ];

  return (
    <section
      id="timeline"
      className="py-16 md:py-24 px-5 bg-white"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14">
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wide mb-4"
            style={{ backgroundColor: `${mainColor}10`, color: mainColor }}
          >
            <Calendar className="w-3.5 h-3.5" />
            ROADMAP BELAJAR
          </span>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Jadwal Terstruktur{' '}
            <span className="text-gray-400">Sampai Lolos</span>
          </h2>

          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Kamu tinggal ikutin peta. Kami yang atur kapan harus maraton, kapan
            harus sprint.
          </p>
        </div>

        {/* Timeline - Horizontal Scroll on Mobile */}
        <div className="relative">
          {/* Vertical Line - Desktop Only */}
          <div
            className="absolute left-4 md:left-6 top-4 bottom-4 w-0.5 hidden md:block"
            style={{ backgroundColor: `${mainColor}15` }}
          />

          <div className="flex overflow-x-auto touch-pan-y md:block md:space-y-4 gap-4 md:gap-0 snap-x snap-mandatory scrollbar-hide pb-4 md:pb-0 px-4 -mx-4 md:px-0 md:mx-0">
            {programs.map((program, index) => (
              <div
                key={program.id}
                className="relative min-w-[85%] sm:min-w-[350px] md:min-w-0 snap-center"
              >
                {/* Timeline Dot - Desktop */}
                <div
                  className="absolute left-4 md:left-6 top-6 w-3 h-3 rounded-full border-4 border-white z-10 hidden md:block -translate-x-1/2 shadow-sm"
                  style={{
                    backgroundColor: program.isHighlight
                      ? mainColor
                      : '#9CA3AF',
                  }}
                />

                {/* Card */}
                <div
                  className={`md:ml-12 bg-gradient-to-br from-white to-gray-50/50 rounded-3xl border-2 overflow-hidden transition-all hover:shadow-xl shadow-md group ${
                    program.isHighlight
                      ? 'ring-2 ring-offset-2'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                  style={program.isHighlight ? { borderColor: mainColor } : {}}
                >
                  {/* Highlight Badge */}
                  {program.isHighlight && (
                    <div
                      className="px-4 py-2.5 flex items-center gap-2 text-xs font-bold text-white relative overflow-hidden"
                      style={{ backgroundColor: mainColor }}
                    >
                      <div className="absolute inset-0 bg-white/10 animate-pulse" />
                      <Sparkles className="w-4 h-4 relative z-10" />
                      <span className="relative z-10">SPRINT FINAL!</span>
                    </div>
                  )}

                  <div className="p-5 md:p-6">
                    <div className="flex items-start gap-4">
                      {/* Logos */}
                      <div className="flex-shrink-0">
                        <div className="flex -space-x-3">
                          {program.logos.map((logo, idx) => (
                            <div
                              key={idx}
                              className="w-12 h-12 md:w-14 md:h-14 rounded-3xl bg-white border-2 border-gray-200 flex items-center justify-center p-2 relative shadow-sm group-hover:scale-110 transition-transform"
                              style={{ zIndex: program.logos.length - idx }}
                            >
                              <Image
                                src={logo}
                                alt=""
                                width={40}
                                height={40}
                                className="object-contain"
                                loading="lazy"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {program.period}
                          </h3>
                          <span
                            className="px-2.5 py-1 rounded-full text-[11px] font-extrabold text-white shadow-sm"
                            style={{ backgroundColor: mainColor }}
                          >
                            {program.badge}
                          </span>
                        </div>

                        <p
                          className="text-xs font-bold uppercase tracking-wider mb-3"
                          style={{ color: mainColor }}
                        >
                          {program.phase}
                        </p>

                        <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                          {program.description}
                        </p>

                        {/* Features - Better styling */}
                        <div className="flex flex-wrap gap-2">
                          {program.features.map((feature, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs text-blue-700 font-medium"
                            >
                              <CheckCircle2
                                className="w-3.5 h-3.5 flex-shrink-0"
                                style={{ color: mainColor }}
                              />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connector Arrow - Mobile */}
                {index < programs.length - 1 && (
                  <div className="flex justify-center py-2 md:hidden">
                    <div
                      className="w-0.5 h-6"
                      style={{ backgroundColor: `${mainColor}20` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/price"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: mainColor }}
          >
            Mulai Perjalanan
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
