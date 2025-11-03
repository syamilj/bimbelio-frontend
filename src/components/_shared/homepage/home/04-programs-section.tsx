'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
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
      title: 'Core Learning Materi',
      subtitle: 'Bangun Fondasi Kuat',
      badge: 'PROGRAM 1',
      duration: 'Nov-Des 2025',
      monthRange: '2 Bulan',
      features: [
        'Materi UTBK SNBT + materi sekolah lengkap',
        'Meningkatkan nilai SNBP dan persiapan UTBK SNBT',
        'Focus pada pendalaman konsep dasar',
      ],
      highlights: {
        focus: 'Konsep Dasar',
        percentage: '60%',
      },
      color: '#0091FF',
      logos: ['/hero/LOGO_SNBT.webp'],
    },
    {
      id: 2,
      title: 'Intensif UTBK - SNBT',
      subtitle: 'Persiapan Maksimal',
      badge: 'PROGRAM 2',
      duration: 'Jan-Mar 2026',
      monthRange: '3 Bulan',
      features: [
        'Materi UTBK SNBT + 20% materi tambahan',
        'Penajaman materi untuk UAS',
        'Latihan soal intensif dan pembahasan',
      ],
      highlights: {
        focus: 'Drill & Practice',
        percentage: '30%',
      },
      color: '#FFA500',
      logos: ['/hero/LOGO_SNBT.webp'],
    },
    {
      id: 3,
      title: 'Superintensif UTBK-SNBT',
      subtitle: 'Sprint Menuju PTN',
      badge: 'PROGRAM 3',
      duration: 'April 2026',
      monthRange: '1 Bulan',
      features: [
        '100% fokus mengasah keterampilan UTBK SNBT',
        'Konsultasi pemilihan jurusan dan PTN',
        'Simulasi ujian dan strategi pengisian',
      ],
      highlights: {
        focus: 'Full UTBK',
        percentage: '100%',
      },
      color: '#00C853',
      logos: ['/hero/LOGO_SNBT.webp'],
    },
    {
      id: 4,
      title: 'Seleksi Mandiri PTN',
      subtitle: 'Kesempatan Kedua',
      badge: 'PROGRAM 4',
      duration: 'Mei-Jun 2026',
      monthRange: '2 Bulan',
      features: [
        'Materi lengkap seleksi mandiri PTN',
        'SIMAK UI, UM UGM CBT, SM ITB, UM UNDIP, dll',
        'Info lengkap jalur mandiri setiap PTN',
      ],
      highlights: {
        focus: 'Jalur Mandiri',
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
      title: 'Kedinasaan',
      subtitle: 'Serve The Nation',
      badge: 'PROGRAM 5',
      duration: 'Jul-Agu 2026',
      monthRange: '2 Bulan',
      features: [
        'Materi lengkap SKD dan TBI',
        'STAN, STIS, IPDN, AKMIL, AKPOL',
        'Simulasi tes dan tips lolos seleksi',
      ],
      highlights: {
        focus: 'Kedinasan',
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge
            className="mb-6 px-6 py-2 text-sm font-bold text-white border-none"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            <Calendar className="w-4 h-4 mr-2 inline" />
            Timeline Program
          </Badge>

          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            PRINTS Bagus —
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Tapi Kapan Mulainya?
            </span>
          </h2>

          <p className="text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Dari{' '}
            <span
              className="font-bold"
              style={{ color: mainColor }}
            >
              Core Learning (Nov 2025)
            </span>{' '}
            sampai{' '}
            <span
              className="font-bold"
              style={{ color: secondaryColor }}
            >
              Kedinasan (Jul 2026)
            </span>
            , ada <span className="font-bold">5 program bertahap</span> yang
            sesuai sama PRINTS System. Kamu bisa ikut semua atau pilih yang
            match sama target ujian kamu.
          </p>
        </motion.div>

        {/* Programs List with Arrows */}
        <div className="space-y-0">
          {/* Mobile: Stack with arrows between */}
          <div className="md:hidden space-y-0">
            {programs.map((program, index) => (
              <div key={program.id}>
                {/* Program Card */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-md transition-all duration-300"
                >
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
                            'Membangun pemahaman fundamental yang kuat'}
                          {program.id === 2 &&
                            'Latihan intensif dengan soal-soal variatif'}
                          {program.id === 3 &&
                            'Persiapan total menghadapi UTBK SNBT'}
                          {program.id === 4 &&
                            'Strategi khusus ujian mandiri PTN favorit'}
                          {program.id === 5 &&
                            'Persiapan komprehensif sekolah kedinasan'}
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
                </motion.div>

                {/* Mobile Arrow - Single arrow between programs */}
                {index < programs.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, scaleY: 0 }}
                    whileInView={{ opacity: 1, scaleY: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                    viewport={{ once: true }}
                    className="flex justify-center py-4"
                  >
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
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop: 2 columns with arrows */}
          <div className="hidden md:block">
            <div className="grid grid-cols-2 gap-8">
              {/* Column 1: Programs 1, 3 */}
              <div className="space-y-0">
                {[programs[0], programs[2]].map((program, colIndex) => (
                  <div key={program.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: colIndex * 0.1 }}
                      viewport={{ once: true }}
                      className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-md transition-all duration-300"
                    >
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
                                'Membangun pemahaman fundamental yang kuat'}
                              {program.id === 3 &&
                                'Persiapan total menghadapi UTBK SNBT'}
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
                    </motion.div>

                    {/* Arrow for column 1 - only after program 1 */}
                    {program.id === 1 && (
                      <motion.div
                        initial={{ opacity: 0, scaleY: 0 }}
                        whileInView={{ opacity: 1, scaleY: 1 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="flex justify-center py-4"
                      >
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
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>

              {/* Column 2: Programs 2, 4 */}
              <div className="space-y-0">
                {[programs[1], programs[3]].map((program, colIndex) => (
                  <div key={program.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: colIndex * 0.1 + 0.1,
                      }}
                      viewport={{ once: true }}
                      className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-md transition-all duration-300"
                    >
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
                                'Latihan intensif dengan soal-soal variatif'}
                              {program.id === 4 &&
                                'Strategi khusus ujian mandiri PTN favorit'}
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
                    </motion.div>

                    {/* Arrow for column 2 - only after program 2 */}
                    {program.id === 2 && (
                      <motion.div
                        initial={{ opacity: 0, scaleY: 0 }}
                        whileInView={{ opacity: 1, scaleY: 1 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="flex justify-center py-4"
                      >
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
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Program 5 - Full width below */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-8 max-w-3xl mx-auto"
            >
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
                        Persiapan komprehensif sekolah kedinasan
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
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
