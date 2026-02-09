'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import {
  BimArena,
  BimBot,
  BimInsight,
  BimLive,
} from '@/components/ui/bim-brand';
import {
  BarChart3,
  CheckCircle2,
  MessageCircle,
  Sparkles,
  Target,
  Video,
} from 'lucide-react';
import Link from 'next/link';

interface Feature {
  id: number;
  badge: string;
  title: string;
  titleElement?: React.ReactNode;
  description: string;
  features: string[];
  icon: React.ElementType;
  image: string;
}

const FeaturesSection: React.FC = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color ?? '#0091FF';

  const features: Feature[] = [
    {
      id: 1,
      badge: 'AI-Powered',
      title: 'BimBot',
      titleElement: <BimBot />,
      description:
        'Tanya soal kapan aja, jawaban instant dengan penjelasan detail step-by-step.',
      features: [
        'Instant response dalam hitungan detik',
        'Penjelasan step-by-step lengkap',
        'Available 24/7 tanpa batas',
      ],
      icon: MessageCircle,
      image: '/hero/fitur_bimbelio_1.webp',
    },
    {
      id: 2,
      badge: 'Adaptive Testing',
      title: 'BimArena',
      titleElement: <BimArena />,
      description:
        'Try out adaptif yang akurat prediksi skor real UTBK dengan sistem IRT.',
      features: [
        'IRT-based scoring akurat',
        'Adaptive difficulty real-time',
        'Prediksi skor SNBT real',
      ],
      icon: Target,
      image: '/hero/fitur_bimbelio-3.webp',
    },
    {
      id: 3,
      badge: 'Interactive',
      title: 'BimLive',
      titleElement: <BimLive />,
      description:
        '198+ sesi live class interaktif bareng tutor alumni PTN top.',
      features: [
        'Live interaction dengan tutor',
        'Q&A session setiap kelas',
        'Rekaman lengkap tersimpan',
      ],
      icon: Video,
      image: '/hero/fitur_bimbelio-4.webp',
    },
    {
      id: 4,
      badge: 'Data-Driven',
      title: 'BimInsight',
      titleElement: <BimInsight />,
      description: 'Dashboard lengkap yang track progress kamu real-time.',
      features: [
        'Real-time analytics dashboard',
        'Weekly progress report',
        'Target tracking otomatis',
      ],
      icon: BarChart3,
      image: '/hero/fitur_bimbelio-5.webp',
    },
  ];

  return (
    <section
      id="features"
      className="py-16 md:py-24 px-5 bg-white"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14">
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wide mb-4"
            style={{ backgroundColor: `${mainColor}10`, color: mainColor }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            FITUR UNGGULAN
          </span>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Tools yang Kamu <span style={{ color: mainColor }}>Butuhkan</span>
          </h2>

          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Semua fitur yang kamu perlukan untuk persiapan PTN — dalam satu
            platform terintegrasi.
          </p>
        </div>

        {/* Features Grid - Horizontal Scroll on Mobile */}
        <div className="flex overflow-x-auto touch-pan-y md:grid md:grid-cols-2 gap-4 md:gap-6 mb-10 snap-x snap-mandatory scrollbar-hide pb-4 md:pb-0 px-4 -mx-4 md:px-0 md:mx-0">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="group bg-white rounded-3xl border-2 border-gray-100 overflow-hidden hover:border-gray-300 hover:shadow-lg transition-all shadow-sm min-w-[85%] sm:min-w-[350px] md:min-w-0 snap-center"
              >
                {/* Image */}
                <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Badge */}
                  <div
                    className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider"
                    style={{ backgroundColor: mainColor }}
                  >
                    {feature.badge}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-3xl flex items-center justify-center flex-shrink-0 text-white"
                      style={{ backgroundColor: mainColor }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {feature.titleElement ?? feature.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2 pl-13">
                    {feature.features.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2"
                      >
                        <CheckCircle2
                          className="w-4 h-4 flex-shrink-0 mt-0.5"
                          style={{ color: mainColor }}
                        />
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Link
            href="/price"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: mainColor }}
          >
            Akses Semua Fitur
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
