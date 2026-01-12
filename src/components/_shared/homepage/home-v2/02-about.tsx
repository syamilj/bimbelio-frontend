'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Heart, Lightbulb, Sparkles, Target, Users } from 'lucide-react';

const AboutSection: React.FC = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color ?? '#0091FF';

  return (
    <section id="about" className="py-16 md:py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white mb-4"
            style={{ backgroundColor: mainColor }}
          >
            <Users className="w-4 h-4" />
            Kamu Nggak Sendirian
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Mau PTN atau Kedinasan, <span style={{ color: mainColor }}>Sama-Sama Berat</span>
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto">
            SNBT, Ujian Mandiri UI/UGM/ITB, sampai SKD Kedinasan — semuanya butuh
            persiapan serius. Belajar sendiri cuma bikin makin overwhelmed. Tenang,
            itu yang kami rasain dulu juga.
          </p>
        </div>

        {/* Team Photo */}
        <div className="relative w-full md:w-3/5 md:mx-auto rounded-3xl overflow-hidden mb-10 border border-gray-200">
          <img
            src="/hero/about.webp"
            alt="Tim Bimbelio"
            className="w-full h-auto object-cover"
            loading="lazy"
            decoding="async"
            width={600}
            height={400}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gray-900/60 px-5 py-4">
            <p className="text-white text-sm font-medium">
              Dedicated team yang committed untuk kesuksesan siswa
            </p>
          </div>
        </div>

        {/* Story Cards */}
        <div className="grid md:grid-cols-2 gap-5 mb-10">
          {/* Founder Story */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200">
            <div className="flex items-start gap-4 mb-4">
              <div
                className="w-12 h-12 rounded-3xl flex items-center justify-center flex-shrink-0 text-white"
                style={{ backgroundColor: mainColor }}
              >
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Dulu Kita Juga Begitu
                </h3>
                <p className="text-sm font-medium" style={{ color: mainColor }}>
                  Sekarang Giliran Bantu Kamu
                </p>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Tim kami UI, UGM, ITB, STAN, dan kampus top lainnya. Kami pernah
              merasakan kebingungan yang sama — mau SNBT, Mandiri, atau Kedinasan.
              Pengalaman itu yang bikin kami tahu persis apa yang kamu butuhkan.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200">
            <div className="flex items-start gap-4 mb-4">
              <div
                className="w-12 h-12 rounded-3xl flex items-center justify-center flex-shrink-0 text-white"
                style={{ backgroundColor: mainColor }}
              >
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Satu Akun, Semua Jalur</h3>
                <p className="text-sm font-medium" style={{ color: mainColor }}>
                  SNBT + Mandiri + Kedinasan
                </p>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Nggak perlu daftar banyak bimbel. Di Bimbelio, satu akun bisa akses
              persiapan SNBT, Ujian Mandiri (UI, UGM, ITB, dll), sampai SKD Kedinasan
              (STAN, STIS, IPDN). Semua jalur, satu platform.
            </p>
          </div>
        </div>

        {/* What Makes Us Different */}
        <div
          className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200"
        >
          <div className="flex items-start gap-4 mb-6">
            <div
              className="w-14 h-14 rounded-3xl flex items-center justify-center flex-shrink-0 text-white"
              style={{ backgroundColor: mainColor }}
            >
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                Satu Platform, Semua Kebutuhan
              </h3>
              <p className="text-gray-600">
                SNBT, Seleksi Mandiri, sampai Kedinasan —{' '}
                <span className="font-semibold">semuanya ada di sini</span>, dengan:
              </p>
            </div>
          </div>

          {/* Key Differentiators */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 bg-gray-50 rounded-3xl p-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${mainColor}15` }}
              >
                <Lightbulb className="w-5 h-5" style={{ color: mainColor }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">AI-Powered Learning</p>
                <p className="text-xs text-gray-600">
                  Analisis kemampuan real-time & rekomendasi personal
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-gray-50 rounded-3xl p-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${mainColor}15` }}
              >
                <Users className="w-5 h-5" style={{ color: mainColor }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">3-Layer Support</p>
                <p className="text-xs text-gray-600">
                  Tutor expert + Mentor strategis + AI 24/7
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-gray-50 rounded-3xl p-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${mainColor}15` }}
              >
                <Target className="w-5 h-5" style={{ color: mainColor }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">IRT-Based Testing</p>
                <p className="text-xs text-gray-600">
                  Try Out adaptif yang akurat prediksi skor real
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-gray-50 rounded-3xl p-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${mainColor}15` }}
              >
                <Heart className="w-5 h-5" style={{ color: mainColor }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">All-in-One Platform</p>
                <p className="text-xs text-gray-600">
                  Live class, chat AI, notes, TO, mentor — semua di 1 tempat
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
