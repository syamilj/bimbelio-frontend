'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { BimBot } from '@/components/ui/bim-brand';
import {
  Brain,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface Tutor {
  name: string;
  university: string;
  major: string;
  quote: string;
  badge: string;
  image?: string;
}

const LayersSection: React.FC = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [activeLayer, setActiveLayer] = useState<number>(0);
  const mainColor = websiteSubCategory?.main_color ?? '#0091FF';

  const tutors: Tutor[] = [
    {
      name: 'Kak Ashel',
      university: 'Universitas Indonesia',
      major: 'Sastra Arab',
      quote: 'Bahasa itu bukan soal hafalan, tapi feeling!',
      badge: 'UI 2022',
      image: '/tutors/ashel.webp',
    },
    {
      name: 'Kak Erich',
      university: 'Universitas Indonesia',
      major: 'Ilmu Komputer',
      quote: 'Matematika UTBK itu pattern recognition!',
      badge: 'UI 2022',
      image: '/tutors/erich.webp',
    },
    {
      name: 'Kak Naufal',
      university: 'Universitas Indonesia',
      major: 'Matematika',
      quote: 'Penalaran Umum bukan IQ test. Ada triknya!',
      badge: 'UI 2020',
      image: '/tutors/naufal.webp',
    },
    {
      name: 'Kak Okky',
      university: 'Universitas Indonesia',
      major: 'Sastra Arab',
      quote: 'Baca cepat, tangkep inti, jawab tepat!',
      badge: 'UI 2019',
      image: '/tutors/okky.webp',
    },
    {
      name: 'Kak Syamil',
      university: 'Universitas Indonesia',
      major: 'Manajemen',
      quote: 'PPU bukan tes wawasan, tapi strategi eliminasi!',
      badge: 'UI 2019',
      image: '/tutors/syamil.webp',
    },
  ];

  const layers = [
    {
      id: 0,
      layer: 'LAYER 1',
      title: 'TUTOR',
      icon: <GraduationCap className="w-6 h-6" />,
      description: 'UI, UGM, ITB yang proven masuk PTN top',
      features: [
        'Live class interaktif 198+ sesi',
        'Ngajar materi & strategi soal real UTBK',
        'Rekaman lengkap bisa diakses kapan saja',
      ],
    },
    {
      id: 1,
      layer: 'LAYER 2',
      title: 'MENTOR',
      icon: <Users className="w-6 h-6" />,
      description: 'Bimbingan strategis 360° untuk mental & roadmap',
      features: [
        'Strategic planning & goal setting',
        'Weekly progress review & feedback',
        '1-on-1 konseling prioritas',
        'Mindset coaching & study rhythm',
      ],
    },
    {
      id: 2,
      layer: 'LAYER 3',
      title: 'BIMBOT AI',
      titleElement: <><BimBot className="uppercase" /> AI</>,
      icon: <Sparkles className="w-6 h-6" />,
      description: 'Support instant 24/7 tanpa batas waktu',
      features: [
        'Instant help jam 2 pagi sekalipun',
        'Smart error analysis otomatis',
        'Personalized drill queue adaptif',
      ],
    },
  ];

  return (
    <section
      id="3-layer"
      className="py-16 md:py-20 px-4 bg-white"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white mb-4"
            style={{ backgroundColor: mainColor }}
          >
            <GraduationCap className="w-4 h-4" />
            Gimana Caranya?
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ada 3 Tim yang <span style={{ color: mainColor }}>Backup Kamu</span>
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto">
            Mau SNBT, Mandiri, atau Kedinasan — semuanya di-support. Tutor
            ngajar strategi tiap ujian, Mentor jaga progress, dan AI standby
            24/7.
          </p>
        </div>

        {/* Desktop: 3 Columns */}
        <div className="hidden md:grid md:grid-cols-3 gap-5 mb-12">
          {layers.map((layer) => (
            <div
              key={layer.id}
              className="bg-gray-50 rounded-3xl p-6 border-2 border-gray-100 shadow-sm"
            >
              <div className="flex flex-col items-center text-center mb-5">
                <div
                  className="w-14 h-14 rounded-3xl flex items-center justify-center mb-4 text-white"
                  style={{ backgroundColor: mainColor }}
                >
                  {layer.icon}
                </div>
                <span
                  className="text-xs font-semibold mb-1"
                  style={{ color: mainColor }}
                >
                  {layer.layer}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {layer.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {layer.description}
                </p>
              </div>

              <div className="space-y-2">
                {layer.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2"
                  >
                    <CheckCircle2
                      className="w-4 h-4 flex-shrink-0 mt-0.5"
                      style={{ color: mainColor }}
                    />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: Accordion */}
        <div className="md:hidden space-y-3 mb-10">
          {layers.map((layer) => (
            <div
              key={layer.id}
              className="bg-gray-50 rounded-3xl border-2 border-gray-100 shadow-sm overflow-hidden"
            >
              <button
                onClick={() =>
                  setActiveLayer(activeLayer === layer.id ? -1 : layer.id)
                }
                className="w-full p-4 flex items-center gap-3"
              >
                <div
                  className="w-10 h-10 rounded-3xl flex items-center justify-center flex-shrink-0 text-white"
                  style={{ backgroundColor: mainColor }}
                >
                  {layer.icon}
                </div>
                <div className="flex-1 text-left">
                  <span
                    className="text-xs font-semibold block mb-0.5"
                    style={{ color: mainColor }}
                  >
                    {layer.layer}
                  </span>
                  <h3 className="text-base font-bold text-gray-900">
                    {layer.titleElement || layer.title}
                  </h3>
                </div>
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${mainColor}15` }}
                >
                  <span
                    className="text-lg font-bold"
                    style={{ color: mainColor }}
                  >
                    {activeLayer === layer.id ? '−' : '+'}
                  </span>
                </div>
              </button>

              {activeLayer === layer.id && (
                <div className="px-4 pb-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3 mt-3">
                    {layer.description}
                  </p>
                  <div className="space-y-2">
                    {layer.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2"
                      >
                        <CheckCircle2
                          className="w-4 h-4 flex-shrink-0 mt-0.5"
                          style={{ color: mainColor }}
                        />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tutor Showcase */}
        <div
          id="tutors"
          className="mt-12"
        >
          <div className="text-center mb-8">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              Meet Our Tutors
            </h3>
            <p className="text-sm text-gray-600">
              PTN top yang paham strategi asli UTBK
            </p>
          </div>

          {/* Desktop: 5 columns grid */}
          <div className="hidden md:flex md:flex-wrap md:justify-center md:gap-4">
            {tutors.map((tutor, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl overflow-hidden border-2 border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col"
                style={{ width: 'calc(20% - 13px)' }}
              >
                <div
                  className="relative flex-1 overflow-hidden min-h-[320px]"
                  style={{ backgroundColor: `${mainColor}10` }}
                >
                  {tutor.image ? (
                    <Image
                      src={tutor.image}
                      alt={tutor.name}
                      fill
                      loading="lazy"
                      quality={60}
                      className="object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Brain className="w-16 h-16 text-gray-300" />
                    </div>
                  )}
                  <div
                    className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold bg-white shadow-sm"
                    style={{ color: mainColor }}
                  >
                    {tutor.badge}
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="text-sm font-bold text-gray-900 mb-1">
                    {tutor.name}
                  </h4>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Target
                      className="w-3 h-3 flex-shrink-0"
                      style={{ color: mainColor }}
                    />
                    <p
                      className="text-xs font-medium"
                      style={{ color: mainColor }}
                    >
                      {tutor.major}
                    </p>
                  </div>
                  <p className="text-xs text-gray-600 italic line-clamp-2">
                    "{tutor.quote}"
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: Horizontal Scroll */}
          <div className="md:hidden flex overflow-x-auto touch-pan-y gap-3 snap-x snap-mandatory scrollbar-hide pb-4 px-4 -mx-4">
            {tutors.map((tutor, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl overflow-hidden border-2 border-gray-100 hover:border-gray-200 min-w-[45%] sm:min-w-[280px] snap-center flex-shrink-0 flex flex-col h-[400px]"
              >
                <div
                  className="relative flex-1 overflow-hidden"
                  style={{ backgroundColor: `${mainColor}10` }}
                >
                  {tutor.image ? (
                    <Image
                      src={tutor.image}
                      alt={tutor.name}
                      fill
                      loading="lazy"
                      quality={60}
                      className="object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Brain className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  <div
                    className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold bg-white shadow-sm"
                    style={{ color: mainColor }}
                  >
                    {tutor.badge}
                  </div>
                </div>

                <div className="p-3 flex-shrink-0">
                  <h4 className="text-sm font-bold text-gray-900 mb-1">
                    {tutor.name}
                  </h4>
                  <p
                    className="text-xs font-medium mb-2"
                    style={{ color: mainColor }}
                  >
                    {tutor.major}
                  </p>
                  <p className="text-xs text-gray-600 italic line-clamp-2">
                    "{tutor.quote}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LayersSection;
