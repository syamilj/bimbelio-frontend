'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, Calendar, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

interface Program {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  duration: string;
  monthRange: string;
  features: string[];
  highlights: {
    focus: string;
    percentage: string;
  };
  color: string;
  logos: string[];
}

export default function ProgramsSection() {
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Gunakan default main landing page colors jika websiteSubCategory null
  const mainColor = websiteSubCategory?.main_color ?? '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color ?? '#5aa4dd';

  const programs: Program[] = [
    {
      id: 1,
      title: 'Core Learning',
      subtitle: 'Bangun Pondasi Kuat',
      badge: 'TAHAP 1',
      duration: 'Nov-Des 2025',
      monthRange: '2 Bulan',
      features: [
        'Kuasai konsep fundamental dari awal yang benar',
        'Identifikasi gap pemahaman sebelum masuk fase intensif',
        'Siap mental dan punya roadmap yang jelas ke depan',
      ],
      highlights: {
        focus: 'Fondasi Konsep',
        percentage: '60%',
      },
      color: '#0091FF',
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
        'Drill soal intensif berdasarkan pola ujian sebenarnya',
        'Analisis kesalahan & perbaiki strategi setiap minggu',
        'Pantau progress real-time sampai stabil di target skor',
      ],
      highlights: {
        focus: 'Penguasaan Soal',
        percentage: '30%',
      },
      color: '#FFA500',
      logos: ['/hero/LOGO_SNBT.webp'],
    },
    {
      id: 3,
      title: 'Super Intensif',
      subtitle: 'Persiapan Final',
      badge: 'TAHAP 3',
      duration: 'Apr 2026',
      monthRange: '1 Bulan',
      features: [
        'Simulasi ujian full lengkap seperti kondisi sebenarnya',
        'Optimasi strategi waktu & mental untuk hari H',
        'Finishing touches untuk maksimalkan skor final',
      ],
      highlights: {
        focus: 'Eksekusi Sempurna',
        percentage: '100%',
      },
      color: '#00C853',
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
        'Materi spesifik ujian mandiri setiap PTN favorit',
        'Strategi berbeda untuk UI, UGM, ITB, dan PTN lainnya',
        'Tingkatkan peluang dengan jalur kedua yang matang',
      ],
      highlights: {
        focus: 'Multiplied Chances',
        percentage: '100%',
      },
      color: '#9C27B0',
      logos: [
        '/hero/LOGO_PTN_UI.webp',
        '/hero/LOGO_PTN_UGM.webp',
        '/hero/LOGO_PTN_ITB.webp',
      ],
    },
    {
      id: 5,
      title: 'Kedinasan',
      subtitle: 'Karir Stabil & Terhormat',
      badge: 'TAHAP 5',
      duration: 'Jul-Agu 2026',
      monthRange: '2 Bulan',
      features: [
        'SKD dan TBI dengan strategi yang sudah terbukti',
        'Pahami kultur & kebutuhan setiap lembaga kedinasan',
        'Raih stabilitas karir di instansi negara terkemuka',
      ],
      highlights: {
        focus: 'Karir Terjamin',
        percentage: '100%',
      },
      color: '#E91E63',
      logos: [
        '/hero/LOGO_KEDINASAN_STAN.webp',
        '/hero/LOGO_KEDINASAN_STIS.webp',
        '/hero/LOGO_KEDINASAN_IPDN.webp',
      ],
    },
  ];

  return (
    <section
      id="timeline"
      className="py-24 px-4 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge
            className="mb-6 px-6 py-2 text-sm font-bold text-white border-none"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            <Calendar className="w-4 h-4 mr-2 inline" />
            Perjalanan Belajar Terstruktur
          </Badge>

          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Setiap Target Ujian
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Ada Program Yang Pas
            </span>
          </h2>

          <p className="text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Sistem belajar yang efektif butuh progression yang jelas. Dari{' '}
            <span
              className="font-bold"
              style={{ color: mainColor }}
            >
              membangun dasar (Core Learning)
            </span>{' '}
            sampai{' '}
            <span
              className="font-bold"
              style={{ color: secondaryColor }}
            >
              eksekusi maksimal (Intensif & Super Intensif)
            </span>
            , ada tahap untuk setiap target kamu. Mulai dari mana aja sesuai
            jadwal & kebutuhan.
          </p>
        </div>

        {/* Programs List with Arrows */}
        <div className="space-y-0">
          {/* Mobile: Stack with arrows between */}
          <div className="md:hidden space-y-0">
            {programs.map((program, index) => (
              <div key={program.id}>
                {/* Program Card */}
                <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-md transition-all duration-300">
                  {/* Top Accent Bar */}
                  <div
                    className="h-1.5 w-full"
                    style={{ backgroundColor: program.color }}
                  />

                  <div className="p-6">
                    <div className="flex flex-col gap-6">
                      {/* Logo + Content */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4 mb-6">
                          {/* Logo Section */}
                          <div className="flex-shrink-0">
                            {program.logos.length === 1 ? (
                              // Single Logo
                              <div className="relative">
                                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white shadow-lg border-2 border-gray-100">
                                  <Image
                                    src={program.logos[0]}
                                    alt={program.title}
                                    width={64}
                                    height={64}
                                    loading="lazy"
                                    className="w-full h-full object-contain p-2"
                                  />
                                </div>
                              </div>
                            ) : (
                              // Multiple Logos - Overlapping
                              <div className="relative w-20 h-16">
                                {program.logos.map((logo, idx) => (
                                  <div
                                    key={idx}
                                    className="absolute w-12 h-12 rounded-2xl overflow-hidden bg-white shadow-lg border-2 border-white hover:scale-110 hover:z-20 transition-all duration-300"
                                    style={{
                                      left: `${idx * 18}px`,
                                      top: `${idx * 4}px`,
                                      zIndex: program.logos.length - idx,
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
                                {/* Count Badge */}
                                <div
                                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white shadow-md z-30"
                                  style={{ backgroundColor: program.color }}
                                >
                                  {program.logos.length}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Title & Badge */}
                          <div className="flex-1">
                            <div className="mb-2">
                              <span
                                className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-2"
                                style={{ backgroundColor: program.color }}
                              >
                                {program.badge}
                              </span>
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-1">
                              {program.title}
                            </h3>
                            <p
                              className="text-sm font-semibold"
                              style={{ color: program.color }}
                            >
                              {program.subtitle}
                            </p>
                          </div>
                        </div>

                        {/* Duration */}
                        <div className="flex flex-wrap items-center gap-3 mb-5">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar
                              className="w-4 h-4"
                              style={{ color: program.color }}
                            />
                            <span className="font-semibold">
                              {program.duration}
                            </span>
                          </div>
                          <div
                            className="flex items-center gap-2 text-sm font-semibold"
                            style={{ color: program.color }}
                          >
                            <span>⏱</span>
                            <span>{program.monthRange}</span>
                          </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-2.5">
                          {program.features.map((feature, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2.5"
                            >
                              <CheckCircle2
                                className="w-4 h-4 flex-shrink-0 mt-0.5"
                                style={{ color: program.color }}
                              />
                              <span className="text-sm text-gray-700 leading-snug">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Focus Area Box */}
                      <div className="bg-white rounded-2xl p-5 border-2 border-gray-100">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: program.color }}
                          />
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Focus Area
                          </p>
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: program.color }}
                          />
                        </div>
                        <p
                          className="text-lg font-black text-center mb-2"
                          style={{ color: program.color }}
                        >
                          {program.highlights.focus}
                        </p>
                        <p className="text-xs text-gray-600 text-center mb-4 leading-relaxed">
                          {program.id === 1 &&
                            'Pahami setiap konsep dari awal supaya siap untuk fase berikutnya'}
                          {program.id === 2 &&
                            'Latihan soal terus menerus sampai pattern-nya jelas dan konsisten'}
                          {program.id === 3 &&
                            'Siap menghadapi ujian dengan percaya diri dan strategi yang matang'}
                          {program.id === 4 &&
                            'Buka peluang masuk PTN favorit lewat jalur yang berbeda'}
                          {program.id === 5 &&
                            'Raih kesempatan berkarir di institusi negara yang prestisius'}
                        </p>
                        {/* Progress Bar */}
                        <div className="relative h-2.5 bg-gray-200 rounded-full overflow-hidden mb-2">
                          <div
                            className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
                            style={{
                              width: program.highlights.percentage,
                              backgroundColor: program.color,
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500">Intensitas</p>
                          <p
                            className="text-sm font-black"
                            style={{ color: program.color }}
                          >
                            {program.highlights.percentage}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Arrow - Single arrow between programs */}
                {index < programs.length - 1 && (
                  <div className="flex justify-center py-4">
                    <div className="flex flex-col items-center">
                      {/* Vertical Line */}
                      <div
                        className="w-1 h-8 rounded-full"
                        style={{
                          background: `linear-gradient(to bottom, ${program.color}, ${programs[index + 1].color})`,
                        }}
                      />
                      {/* Arrow Icon */}
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md"
                        style={{
                          background: `linear-gradient(135deg, ${program.color}, ${programs[index + 1].color})`,
                        }}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop: 2 columns with arrows */}
          <div className="hidden md:block">
            <div className="grid grid-cols-2 gap-8">
              {/* Column 1: Programs 1, 3 */}
              <div className="space-y-0">
                {[programs[0], programs[2]].map((program) => (
                  <div key={program.id}>
                    <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-md transition-all duration-300">
                      {/* Top Accent Bar */}
                      <div
                        className="h-1.5 w-full"
                        style={{ backgroundColor: program.color }}
                      />

                      <div className="p-8">
                        <div className="flex flex-col gap-6">
                          {/* Logo + Content */}
                          <div className="flex-1">
                            <div className="flex items-start gap-4 mb-6">
                              {/* Logo Section */}
                              <div className="flex-shrink-0">
                                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white shadow-lg border-2 border-gray-100">
                                  <Image
                                    src={program.logos[0]}
                                    alt={program.title}
                                    width={80}
                                    height={80}
                                    loading="lazy"
                                    className="w-full h-full object-contain p-2"
                                  />
                                </div>
                              </div>

                              {/* Title & Badge */}
                              <div className="flex-1">
                                <div className="mb-2">
                                  <span
                                    className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-2"
                                    style={{ backgroundColor: program.color }}
                                  >
                                    {program.badge}
                                  </span>
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-1">
                                  {program.title}
                                </h3>
                                <p
                                  className="text-base font-semibold"
                                  style={{ color: program.color }}
                                >
                                  {program.subtitle}
                                </p>
                              </div>
                            </div>

                            {/* Duration */}
                            <div className="flex flex-wrap items-center gap-3 mb-5">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar
                                  className="w-4 h-4"
                                  style={{ color: program.color }}
                                />
                                <span className="font-semibold">
                                  {program.duration}
                                </span>
                              </div>
                              <div
                                className="flex items-center gap-2 text-sm font-semibold"
                                style={{ color: program.color }}
                              >
                                <span>⏱</span>
                                <span>{program.monthRange}</span>
                              </div>
                            </div>

                            {/* Features */}
                            <div className="space-y-2.5">
                              {program.features.map((feature, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start gap-2.5"
                                >
                                  <CheckCircle2
                                    className="w-4 h-4 flex-shrink-0 mt-0.5"
                                    style={{ color: program.color }}
                                  />
                                  <span className="text-sm text-gray-700 leading-snug">
                                    {feature}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Focus Area Box */}
                          <div className="bg-white rounded-2xl p-5 border-2 border-gray-100">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <div
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: program.color }}
                              />
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Focus Area
                              </p>
                              <div
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: program.color }}
                              />
                            </div>
                            <p
                              className="text-xl font-black text-center mb-2"
                              style={{ color: program.color }}
                            >
                              {program.highlights.focus}
                            </p>
                            <p className="text-xs text-gray-600 text-center mb-4 leading-relaxed">
                              {program.id === 1 &&
                                'Pahami setiap konsep dari awal supaya siap untuk fase berikutnya'}
                              {program.id === 3 &&
                                'Siap menghadapi ujian dengan percaya diri dan strategi yang matang'}
                            </p>
                            {/* Progress Bar */}
                            <div className="relative h-2.5 bg-gray-200 rounded-full overflow-hidden mb-2">
                              <div
                                className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
                                style={{
                                  width: program.highlights.percentage,
                                  backgroundColor: program.color,
                                }}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-gray-500">
                                Intensitas
                              </p>
                              <p
                                className="text-sm font-black"
                                style={{ color: program.color }}
                              >
                                {program.highlights.percentage}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Arrow for column 1 - only after program 1 */}
                    {program.id === 1 && (
                      <div className="flex justify-center py-4">
                        <div className="flex flex-col items-center">
                          <div
                            className="w-1 h-8 rounded-full"
                            style={{
                              background: `linear-gradient(to bottom, ${programs[0].color}, ${programs[2].color})`,
                            }}
                          />
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md"
                            style={{
                              background: `linear-gradient(135deg, ${programs[0].color}, ${programs[2].color})`,
                            }}
                          >
                            <ArrowDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Column 2: Programs 2, 4 */}
              <div className="space-y-0">
                {[programs[1], programs[3]].map((program) => (
                  <div key={program.id}>
                    <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-md transition-all duration-300">
                      {/* Top Accent Bar */}
                      <div
                        className="h-1.5 w-full"
                        style={{ backgroundColor: program.color }}
                      />

                      <div className="p-8">
                        <div className="flex flex-col gap-6">
                          {/* Logo + Content */}
                          <div className="flex-1">
                            <div className="flex items-start gap-4 mb-6">
                              {/* Logo Section */}
                              <div className="flex-shrink-0">
                                {program.logos.length === 1 ? (
                                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white shadow-lg border-2 border-gray-100">
                                    <Image
                                      src={program.logos[0]}
                                      alt={program.title}
                                      width={80}
                                      height={80}
                                      loading="lazy"
                                      className="w-full h-full object-contain p-2"
                                    />
                                  </div>
                                ) : (
                                  // Multiple Logos
                                  <div className="relative w-24 h-20">
                                    {program.logos.map((logo, idx) => (
                                      <div
                                        key={idx}
                                        className="absolute w-14 h-14 rounded-2xl overflow-hidden bg-white shadow-lg border-2 border-white hover:scale-110 hover:z-20 transition-all duration-300"
                                        style={{
                                          left: `${idx * 18}px`,
                                          top: `${idx * 4}px`,
                                          zIndex: program.logos.length - idx,
                                        }}
                                      >
                                        <Image
                                          src={logo}
                                          alt={`${program.title} ${idx + 1}`}
                                          width={56}
                                          height={56}
                                          loading="lazy"
                                          className="w-full h-full object-contain p-1.5"
                                        />
                                      </div>
                                    ))}
                                    <div
                                      className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white shadow-md z-30"
                                      style={{
                                        backgroundColor: program.color,
                                      }}
                                    >
                                      {program.logos.length}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Title & Badge */}
                              <div className="flex-1">
                                <div className="mb-2">
                                  <span
                                    className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-2"
                                    style={{ backgroundColor: program.color }}
                                  >
                                    {program.badge}
                                  </span>
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-1">
                                  {program.title}
                                </h3>
                                <p
                                  className="text-base font-semibold"
                                  style={{ color: program.color }}
                                >
                                  {program.subtitle}
                                </p>
                              </div>
                            </div>

                            {/* Duration */}
                            <div className="flex flex-wrap items-center gap-3 mb-5">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar
                                  className="w-4 h-4"
                                  style={{ color: program.color }}
                                />
                                <span className="font-semibold">
                                  {program.duration}
                                </span>
                              </div>
                              <div
                                className="flex items-center gap-2 text-sm font-semibold"
                                style={{ color: program.color }}
                              >
                                <span>⏱</span>
                                <span>{program.monthRange}</span>
                              </div>
                            </div>

                            {/* Features */}
                            <div className="space-y-2.5">
                              {program.features.map((feature, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start gap-2.5"
                                >
                                  <CheckCircle2
                                    className="w-4 h-4 flex-shrink-0 mt-0.5"
                                    style={{ color: program.color }}
                                  />
                                  <span className="text-sm text-gray-700 leading-snug">
                                    {feature}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Focus Area Box */}
                          <div className="bg-white rounded-2xl p-5 border-2 border-gray-100">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <div
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: program.color }}
                              />
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Focus Area
                              </p>
                              <div
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: program.color }}
                              />
                            </div>
                            <p
                              className="text-xl font-black text-center mb-2"
                              style={{ color: program.color }}
                            >
                              {program.highlights.focus}
                            </p>
                            <p className="text-xs text-gray-600 text-center mb-4 leading-relaxed">
                              {program.id === 2 &&
                                'Latihan soal terus menerus sampai pattern-nya jelas dan konsisten'}
                              {program.id === 4 &&
                                'Buka peluang masuk PTN favorit lewat jalur yang berbeda'}
                            </p>
                            {/* Progress Bar */}
                            <div className="relative h-2.5 bg-gray-200 rounded-full overflow-hidden mb-2">
                              <div
                                className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
                                style={{
                                  width: program.highlights.percentage,
                                  backgroundColor: program.color,
                                }}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-gray-500">
                                Intensitas
                              </p>
                              <p
                                className="text-sm font-black"
                                style={{ color: program.color }}
                              >
                                {program.highlights.percentage}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Arrow for column 2 - only after program 2 */}
                    {program.id === 2 && (
                      <div className="flex justify-center py-4">
                        <div className="flex flex-col items-center">
                          <div
                            className="w-1 h-8 rounded-full"
                            style={{
                              background: `linear-gradient(to bottom, ${programs[1].color}, ${programs[3].color})`,
                            }}
                          />
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md"
                            style={{
                              background: `linear-gradient(135deg, ${programs[1].color}, ${programs[3].color})`,
                            }}
                          >
                            <ArrowDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Program 5 - Full width below */}
            <div className="mt-8 max-w-3xl mx-auto">
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-md transition-all duration-300">
                {/* Top Accent Bar */}
                <div
                  className="h-1.5 w-full"
                  style={{ backgroundColor: programs[4].color }}
                />

                <div className="p-8">
                  <div className="flex flex-col gap-6">
                    {/* Logo + Content */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-6">
                        {/* Logo Section */}
                        <div className="flex-shrink-0">
                          <div className="relative w-24 h-20">
                            {programs[4].logos.map((logo, idx) => (
                              <div
                                key={idx}
                                className="absolute w-14 h-14 rounded-2xl overflow-hidden bg-white shadow-lg border-2 border-white hover:scale-110 hover:z-20 transition-all duration-300"
                                style={{
                                  left: `${idx * 18}px`,
                                  top: `${idx * 4}px`,
                                  zIndex: programs[4].logos.length - idx,
                                }}
                              >
                                <Image
                                  src={logo}
                                  alt={`${programs[4].title} ${idx + 1}`}
                                  width={56}
                                  height={56}
                                  loading="lazy"
                                  className="w-full h-full object-contain p-1.5"
                                />
                              </div>
                            ))}
                            <div
                              className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white shadow-md z-30"
                              style={{ backgroundColor: programs[4].color }}
                            >
                              {programs[4].logos.length}
                            </div>
                          </div>
                        </div>

                        {/* Title & Badge */}
                        <div className="flex-1">
                          <div className="mb-2">
                            <span
                              className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-2"
                              style={{ backgroundColor: programs[4].color }}
                            >
                              {programs[4].badge}
                            </span>
                          </div>
                          <h3 className="text-2xl font-black text-gray-900 mb-1">
                            {programs[4].title}
                          </h3>
                          <p
                            className="text-base font-semibold"
                            style={{ color: programs[4].color }}
                          >
                            {programs[4].subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Duration */}
                      <div className="flex flex-wrap items-center gap-3 mb-5">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar
                            className="w-4 h-4"
                            style={{ color: programs[4].color }}
                          />
                          <span className="font-semibold">
                            {programs[4].duration}
                          </span>
                        </div>
                        <div
                          className="flex items-center gap-2 text-sm font-semibold"
                          style={{ color: programs[4].color }}
                        >
                          <span>⏱</span>
                          <span>{programs[4].monthRange}</span>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="space-y-2.5">
                        {programs[4].features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2.5"
                          >
                            <CheckCircle2
                              className="w-4 h-4 flex-shrink-0 mt-0.5"
                              style={{ color: programs[4].color }}
                            />
                            <span className="text-sm text-gray-700 leading-snug">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Focus Area Box */}
                    <div className="bg-white rounded-2xl p-5 border-2 border-gray-100">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: programs[4].color }}
                        />
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Focus Area
                        </p>
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: programs[4].color }}
                        />
                      </div>
                      <p
                        className="text-xl font-black text-center mb-2"
                        style={{ color: programs[4].color }}
                      >
                        {programs[4].highlights.focus}
                      </p>
                      <p className="text-xs text-gray-600 text-center mb-4 leading-relaxed">
                        Raih kesempatan berkarir di institusi negara yang
                        prestisius
                      </p>
                      {/* Progress Bar */}
                      <div className="relative h-2.5 bg-gray-200 rounded-full overflow-hidden mb-2">
                        <div
                          className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
                          style={{
                            width: programs[4].highlights.percentage,
                            backgroundColor: programs[4].color,
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">Intensitas</p>
                        <p
                          className="text-sm font-black"
                          style={{ color: programs[4].color }}
                        >
                          {programs[4].highlights.percentage}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
