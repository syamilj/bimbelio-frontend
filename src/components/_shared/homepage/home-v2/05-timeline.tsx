'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { ArrowDown, Calendar, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface Program {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  duration: string;
  monthRange: string;
  features: string[];
  logos: string[];
  highlight?: string;
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
      title: 'JAN - MAR',
      subtitle: 'Fase Intensif',
      badge: '4x Seminggu Live Class',
      duration: 'Fokus',
      monthRange: 'Bedah konsep dasar & tipe soal SNBT biar fondasi kuat',
      features: [
        'Bedah konsep dasar & tipe soal SNBT',
        'Fondasi kuat untuk semua materi',
        'Live class interaktif 4x seminggu',
      ],
      logos: ['/hero/LOGO_SNBT.webp'],
    },
    {
      id: 2,
      title: 'APR - MEI',
      subtitle: 'Fase Super Intensif',
      badge: '6x Seminggu (Hampir Tiap Hari)',
      duration: 'Fokus',
      monthRange: 'Full Simulasi TO & Bahas Soal buat persiapan final',
      highlight: 'Sprint Final!',
      features: [
        'Full Simulasi TO & Bahas Soal',
        'Persiapan final menjelang ujian',
        'Drill intensif hampir setiap hari',
      ],
      logos: ['/hero/LOGO_SNBT.webp'],
    },
    {
      id: 3,
      title: 'JUN - JUL',
      subtitle: 'Fase Ujian Mandiri',
      badge: '6x Seminggu Live Class',
      duration: 'Fokus',
      monthRange: 'Sikat soal level tinggi (HOTS) buat SIMAK UI &UTUL UGM',
      features: [
        'Sikat soal level tinggi (HOTS)',
        'Strategi khusus SIMAK UI &UTUL UGM',
        'Persiapan ujian mandiri PTN top',
      ],
      logos: [
        '/hero/LOGO_PTN_UI.webp',
        '/hero/LOGO_PTN_UGM.webp',
      ],
    },
    {
      id: 4,
      title: 'JUL - AGU',
      subtitle: 'Fase Kedinasan',
      badge: '4x Seminggu Live Class',
      duration: 'Fokus',
      monthRange: 'Khusus bahas SKD (TIU, TWK, TKP) buat masuk STAN/STIS',
      features: [
        'Khusus bahas SKD (TIU, TWK, TKP)',
        'Persiapan masuk STAN/STIS',
        'Strategi lolos seleksi kedinasan',
      ],
      logos: [
        '/hero/LOGO_KEDINASAN_STAN.webp',
        '/hero/LOGO_KEDINASAN_STIS.webp',
      ],
    },
  ];

  return (
    <section id="timeline" className="py-16 md:py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white mb-4"
            style={{ backgroundColor: mainColor }}
          >
            <Calendar className="w-4 h-4" />
            Jadwal Kita Padat
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tapi Tetap <span style={{ color: mainColor }}>Teratur</span>
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto">
            Kita atur ritmemya. Kapan lari maraton, kapan harus sprint.<br />
            <span className="font-semibold" style={{ color: mainColor }}>Kamu tinggal ikutin peta</span>
          </p>
        </div>

        {/* Timeline - Vertical */}
        <div className="relative">
          {/* Vertical Line */}
          <div
            className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 hidden md:block"
            style={{ backgroundColor: `${mainColor}20` }}
          />

          <div className="space-y-4">
            {programs.map((program, index) => (
              <div key={program.id} className="relative">
                {/* Timeline Dot - Desktop */}
                <div
                  className="absolute left-6 md:left-8 top-8 w-3 h-3 rounded-full border-4 border-white z-10 hidden md:block -translate-x-1/2"
                  style={{ backgroundColor: mainColor }}
                />

                {/* Program Card */}
                <div className="md:ml-16 bg-white rounded-3xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors">
                  {/* Highlight Bar */}
                  {program.highlight && (
                    <div
                      className="px-5 py-2 flex items-center gap-2 text-sm font-semibold text-white"
                      style={{ backgroundColor: mainColor }}
                    >
                      <Sparkles className="w-4 h-4" />
                      {program.highlight}
                    </div>
                  )}

                  <div className="p-5 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                      {/* Logo Section */}
                      <div className="flex-shrink-0">
                        {program.logos.length === 1 ? (
                          <div
                            className="w-16 h-16 rounded-3xl overflow-hidden border-2"
                            style={{
                              backgroundColor: `${mainColor}08`,
                              borderColor: `${mainColor}20`,
                            }}
                          >
                            <Image
                              src={program.logos[0]}
                              alt={program.title}
                              width={64}
                              height={64}
                              loading="lazy"
                              className="w-full h-full object-contain p-2"
                            />
                          </div>
                        ) : (
                          <div className="relative w-24 h-16">
                            {program.logos.map((logo, idx) => (
                              <div
                                key={idx}
                                className="absolute w-12 h-12 rounded-xl overflow-hidden bg-white border-2"
                                style={{
                                  left: `${idx * 18}px`,
                                  top: `${idx * 2}px`,
                                  zIndex: program.logos.length - idx,
                                  borderColor: `${mainColor}20`,
                                }}
                              >
                                <Image
                                  src={logo}
                                  alt={`${program.title} ${idx + 1}`}
                                  width={48}
                                  height={48}
                                  loading="lazy"
                                  className="w-full h-full object-contain p-1.5"
                                />
                              </div>
                            ))}
                            <div
                              className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white z-30"
                              style={{ backgroundColor: mainColor }}
                            >
                              {program.logos.length}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="mb-4">
                          <span
                            className="inline-block px-3 py-1 rounded-lg text-xs font-bold text-white mb-2"
                            style={{ backgroundColor: mainColor }}
                          >
                            {program.badge}
                          </span>
                          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                            {program.title}
                          </h3>
                          <p className="text-sm font-semibold" style={{ color: mainColor }}>
                            {program.subtitle}
                          </p>
                        </div>

                        {/* Duration Info */}
                        <div className="mb-4">
                          <div
                            className="inline-block px-3 py-1.5 rounded-lg text-xs font-bold mb-2"
                            style={{
                              backgroundColor: '#FFD700',
                              color: '#000',
                            }}
                          >
                            {program.duration}
                          </div>
                          <p className="text-sm text-gray-700 font-medium">
                            {program.monthRange}
                          </p>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 gap-2">
                          {program.features.map((feature, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gray-50"
                            >
                              <CheckCircle2
                                className="w-5 h-5 flex-shrink-0"
                                style={{ color: mainColor }}
                              />
                              <span className="text-sm text-gray-700 font-medium">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow Connector */}
                {index < programs.length - 1 && (
                  <div className="flex justify-center py-3 md:ml-16">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md"
                      style={{ backgroundColor: mainColor }}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
