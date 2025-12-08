'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  MessageCircle,
  Sparkles,
  Target,
  Users,
  Video,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

interface Feature {
  id: number;
  badge: string;
  title: string;
  description: string;
  features: string[];
  icon: React.ElementType;
  imagePlaceholder: string;
}

const FeaturesSection: React.FC = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const pathname = usePathname();
  const router = useRouter();

  const isMainLandingPage = pathname === '/';
  const mainColor = isMainLandingPage
    ? '#0091FF'
    : (websiteSubCategory?.main_color ?? '#0091FF');

  const features: Feature[] = [
    {
      id: 1,
      badge: 'AI-Powered',
      title: 'Chat AI 24/7 (Bimbot)',
      description:
        'Tanya soal kapan aja, jawaban instant dengan penjelasan detail step-by-step. Nggak perlu tunggu tutor online besok pagi.',
      features: [
        'Instant response dalam hitungan detik',
        'Step-by-step explanation lengkap',
        'Available 24/7 tanpa batas waktu',
        'Multi-subject support (semua mapel)',
      ],
      icon: MessageCircle,
      imagePlaceholder: '/hero/fitur_bimbelio_1.webp',
    },
    {
      id: 2,
      badge: 'Smart Learning',
      title: 'Note AI',
      description:
        'Bikin catatan pintar dengan AI highlighting otomatis. Sistem deteksi konsep penting dan kasih saran materi terkait.',
      features: [
        'AI highlights konsep penting',
        'Auto-linking ke materi terkait',
        'Search note super cepat',
        'Sync across devices',
      ],
      icon: BookOpen,
      imagePlaceholder: '/hero/fitur_bimbelio-2.webp',
    },
    {
      id: 3,
      badge: 'Adaptive Testing',
      title: 'Try Out IRT-based',
      description:
        'Try out adaptif yang akurat prediksi skor real UTBK. Soal disesuaikan level kamu — makin pintar, makin sulit.',
      features: [
        'IRT-based scoring akurat',
        'Adaptive difficulty real-time',
        'Analytics detail per topik',
        'Prediksi skor SNBT real',
      ],
      icon: Target,
      imagePlaceholder: '/hero/fitur_bimbelio-3.webp',
    },
    {
      id: 4,
      badge: 'Interactive',
      title: 'Live Class',
      description:
        '198+ sesi live class interaktif bareng tutor alumni PTN. Tanya langsung, diskusi real-time, nggak cuma nonton video.',
      features: [
        'Live interaction dengan tutor',
        'Q&A session setiap kelas',
        'Rekaman lengkap tersimpan',
        'Small batch eksklusif',
      ],
      icon: Video,
      imagePlaceholder: '/hero/fitur_bimbelio-4.webp',
    },
    {
      id: 5,
      badge: 'Data-Driven',
      title: 'Progress Tracking',
      description:
        'Dashboard lengkap yang track progress kamu real-time. Tahu persis mana yang udah kuat, mana yang masih lemah.',
      features: [
        'Real-time analytics dashboard',
        'Topik-by-topik breakdown',
        'Weekly progress report',
        'Target tracking otomatis',
      ],
      icon: BarChart3,
      imagePlaceholder: '/hero/fitur_bimbelio-5.webp',
    },
    {
      id: 6,
      badge: 'Personalized',
      title: 'Mentorship',
      description:
        'Konseling personal sama mentor buat bahas strategi, mindset, dan roadmap PTN kamu. Nggak sendirian, ada yang guide.',
      features: [
        'Strategic planning session',
        'Weekly check-in available',
        'Mindset & mental coaching',
        'Career path guidance',
      ],
      icon: Users,
      imagePlaceholder: '/hero/fitur_bimbelio_1.webp',
    },
  ];

  return (
    <section
      id="ecosystem"
      className="py-16 md:py-20 px-4 bg-white"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white mb-4"
            style={{ backgroundColor: mainColor }}
          >
            <Sparkles className="w-4 h-4" />
            Satu Platform untuk Semua
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Apa Aja yang <span style={{ color: mainColor }}>Kamu Dapet?</span>
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto">
            Live class untuk SNBT, Mandiri, & Kedinasan. Plus chat AI, try out
            IRT, dan progress tracking — semua di satu tempat.
          </p>
        </div>

        {/* Features Alternating Layout */}
        <div className="space-y-12 md:space-y-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className={`grid md:grid-cols-2 gap-6 md:gap-10 items-center ${
                  index % 2 === 1 ? 'md:[direction:rtl]' : ''
                }`}
              >
                {/* Screenshot Placeholder */}
                <div
                  className={`relative rounded-2xl overflow-hidden border border-gray-200 ${
                    index % 2 === 1 ? 'md:[direction:ltr]' : ''
                  }`}
                >
                  <img
                    src={feature.imagePlaceholder}
                    alt={feature.title}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />

                  {/* Badge */}
                  <div
                    className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: mainColor }}
                  >
                    {feature.badge}
                  </div>
                </div>

                {/* Description */}
                <div className={index % 2 === 1 ? 'md:[direction:ltr]' : ''}>
                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
                        style={{ backgroundColor: mainColor }}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <span
                        className="text-xs font-semibold uppercase tracking-wide"
                        style={{ color: mainColor }}
                      >
                        {feature.badge}
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>

                  {/* Feature bullets */}
                  <div className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5"
                      >
                        <CheckCircle2
                          className="w-5 h-5 flex-shrink-0 mt-0.5"
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
        <div className="mt-16 bg-gray-50 rounded-2xl p-6 md:p-8 text-center border border-gray-200">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Siap Explore Semua Fitur?
          </h3>
          <p className="text-gray-600 mb-5">
            Daftar sekarang dan langsung akses ke semua fitur premium platform
          </p>
          <button
            onClick={() => router.push('/price')}
            className="px-8 py-3 rounded-2xl font-semibold text-white transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: mainColor }}
          >
            Lihat Semua Paket →
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
