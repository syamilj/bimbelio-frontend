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
      title: 'Core Learning',
      subtitle: 'Bangun Pondasi Kuat',
      badge: 'TAHAP 1',
      duration: 'Nov-Des 2025',
      monthRange: '2 Bulan',
      highlight: 'Mulai dari sini!',
      features: [
        'Kuasai konsep fundamental yang benar',
        'Identifikasi gap pemahaman',
        'Siap mental & roadmap jelas',
      ],
      logos: ['/hero/LOGO_SNBT.webp'],
    },
    {
      id: 2,
      title: 'Intensif UTBK',
      subtitle: 'Drill & Strategi',
      badge: 'TAHAP 2',
      duration: 'Jan-Mar 2026',
      monthRange: '3 Bulan',
      features: [
        'Drill soal intensif pola ujian real',
        'Analisis kesalahan mingguan',
        'Progress tracking real-time',
      ],
      logos: ['/hero/LOGO_SNBT.webp'],
    },
    {
      id: 3,
      title: 'Super Intensif',
      subtitle: 'Persiapan Final',
      badge: 'TAHAP 3',
      duration: 'Apr 2026',
      monthRange: '1 Bulan',
      highlight: 'Sprint terakhir!',
      features: [
        'Simulasi ujian full kondisi real',
        'Optimasi strategi waktu & mental',
        'Finishing touches skor maksimal',
      ],
      logos: ['/hero/LOGO_SNBT.webp'],
    },
    {
      id: 4,
      title: 'Seleksi Mandiri',
      subtitle: 'Jalur Tambahan',
      badge: 'TAHAP 4',
      duration: 'Mei-Jun 2026',
      monthRange: '2 Bulan',
      features: [
        'Materi spesifik ujian mandiri PTN',
        'Strategi beda UI, UGM, ITB',
        'Tingkatkan peluang jalur kedua',
      ],
      logos: [
        '/hero/LOGO_PTN_UI.webp',
        '/hero/LOGO_PTN_UGM.webp',
        '/hero/LOGO_PTN_ITB.webp',
      ],
    },
    {
      id: 5,
      title: 'Kedinasan',
      subtitle: 'Karir Stabil',
      badge: 'TAHAP 5',
      duration: 'Jul-Agu 2026',
      monthRange: '2 Bulan',
      features: [
        'SKD dan TBI strategi terbukti',
        'Pahami kultur lembaga kedinasan',
        'Raih stabilitas karir negara',
      ],
      logos: [
        '/hero/LOGO_KEDINASAN_STAN.webp',
        '/hero/LOGO_KEDINASAN_STIS.webp',
        '/hero/LOGO_KEDINASAN_IPDN.webp',
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
            Full Timeline: Nov 2025 – Agu 2026
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Dari SNBT Sampai <span style={{ color: mainColor }}>Kedinasan</span>
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto">
            Ini roadmap lengkapnya. Core → Intensif → Super → Mandiri → Kedinasan.
            Semua jalur masuk di-cover, tinggal ikutin aja.
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
                <div className="md:ml-16 bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors">
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
                            className="w-16 h-16 rounded-2xl overflow-hidden border-2"
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

                        {/* Duration Pills */}
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          <div
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm"
                            style={{
                              backgroundColor: `${mainColor}10`,
                              color: mainColor,
                            }}
                          >
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">{program.duration}</span>
                          </div>
                          <div
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-white"
                            style={{ backgroundColor: mainColor }}
                          >
                            <Clock className="w-4 h-4" />
                            <span>{program.monthRange}</span>
                          </div>
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
