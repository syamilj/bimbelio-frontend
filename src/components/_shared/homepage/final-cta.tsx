'use client';

import { useGuest } from '@/components/layout/layoutGuest';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Card, CardContent } from '@/components/ui/card';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { pixel } from '@/lib/pixel/_core'; // ✅ Import pixel untuk Lead tracking
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const FinalCTA = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const { data: session } = useSession();
  const { setShowAuth } = useGuest();
  const router = useRouter();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const achievements = [
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Siswa Aktif',
      value: '15,000+',
      description: 'Siswa yang telah bergabung',
      color: '#10B981',
    },
    {
      icon: <Trophy className="w-5 h-5" />,
      label: 'Tingkat Kelulusan',
      value: '95%',
      description: 'Berhasil lolos PTN & Kedinasan',
      color: '#F59E0B',
    },
    {
      icon: <Target className="w-5 h-5" />,
      label: 'Try Out Tersedia',
      value: '100+',
      description: 'Try out berkualitas tinggi',
      color: '#8B5CF6',
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: 'Akses 24/7',
      value: 'Unlimited',
      description: 'Belajar kapan saja',
      color: '#EF4444',
    },
  ];

  const benefits = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'AI Personal Tutor',
      description: 'Pembelajaran adaptif dengan GPT-4 terdepan',
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: 'Materi Lengkap',
      description: '10,000+ soal dan materi terupdate',
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'Analisis Mendalam',
      description: 'Laporan progress dan rekomendasi belajar',
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: 'Mentor Berpengalaman',
      description: 'Bimbingan dari alumni PTN & Kedinasan terbaik',
    },
  ];

  const urgencyReasons = [
    'Try Out GRATIS terbatas untuk 1000 pendaftar pertama',
    'Bonus materi eksklusif untuk pendaftar bulan ini',
    'Akses ke live class premium tanpa biaya tambahan',
    'Garansi lulus atau uang kembali 100%',
  ];

  return (
    <section
      id="final-cta"
      className="py-16 md:py-24 relative overflow-hidden"
    >
      {/* Enhanced Background with Patterns */}
      <div className="absolute inset-0 -z-10">
        {/* Main gradient background */}
        <div
          className="absolute inset-0 opacity-95"
          style={{
            background: `linear-gradient(135deg, ${mainColor}15, ${secondaryColor}10, ${mainColor}05)`,
          }}
        />

        {/* Floating elements */}
        <div
          className="absolute top-1/4 left-1/6 w-32 h-32 rounded-full opacity-10 blur-2xl animate-pulse"
          style={{ backgroundColor: mainColor }}
        />
        <div
          className="absolute bottom-1/4 right-1/6 w-40 h-40 rounded-full opacity-10 blur-2xl animate-pulse"
          style={{ backgroundColor: secondaryColor, animationDelay: '1s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full opacity-5 blur-xl"
          style={{ backgroundColor: mainColor }}
        />

        {/* Decorative dots */}
        <div className="absolute top-8 left-8 w-2 h-2 bg-blue-400 rounded-full animate-ping" />
        <div className="absolute top-16 right-16 w-1 h-1 bg-purple-400 rounded-full animate-ping animation-delay-500" />
        <div className="absolute bottom-16 left-16 w-1.5 h-1.5 bg-green-400 rounded-full animate-ping animation-delay-1000" />
      </div>

      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex items-center gap-2"
            >
              <span
                className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                }}
              >
                <Sparkles className="w-4 h-4" />
                GABUNG SEKARANG
              </span>
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Wujudkan
                <span
                  className="block bg-linear-to-r bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                  }}
                >
                  Impian Kuliah
                </span>
                <span className="block">Terbaikmu!</span>
              </h2>

              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                Bergabunglah dengan ribuan siswa yang telah{' '}
                <span className="font-bold text-gray-900">berhasil lolos</span>{' '}
                PTN dan sekolah kedinasan{' '}
                <span className="font-bold text-gray-900">impian mereka</span>{' '}
                dengan bantuan AI terdepan.
              </p>
            </div>

            {/* Urgency Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl border-2 border-orange-200 bg-linear-to-r from-orange-50 to-red-50"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-orange-900 text-lg">
                  Penawaran Terbatas!
                </h3>
              </div>
              <div className="space-y-2">
                {urgencyReasons.map((reason, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    viewport={{ once: true }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4 text-orange-600 shrink-0" />
                    <span className="text-orange-800 text-sm font-medium">
                      {reason}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200 hover:shadow-md transition-all duration-300"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${mainColor}15` }}
                  >
                    <div style={{ color: mainColor }}>{benefit.icon}</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">
                      {benefit.title}
                    </h4>
                    <p className="text-gray-600 text-xs mt-1">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {session ? (
                <Link
                  href={`${website_sub_category_id}/user/try-out`}
                  className="flex-1"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-8 py-4 rounded-2xl font-bold text-white shadow-xl transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group"
                    style={{
                      background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                    }}
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 group-hover:animate-shimmer" />
                    <Zap className="w-5 h-5" />
                    <span>Mulai Try Out Gratis</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // ✅ LEAD TRACKING - Track interest untuk signup
                    pixel.meta.track(
                      'Lead',
                      {
                        content_name: 'Homepage CTA - Daftar Gratis',
                        content_type: 'signup',
                      },
                      // ✅ Advanced Matching untuk Meta Pixel (guest user = undefined)
                      undefined,
                    );
                    pixel.tiktok.track('CompleteRegistration', {
                      content_name: 'Homepage CTA - Daftar Gratis',
                      content_id: 'homepage_cta_signup', // ✅ Required untuk TikTok VSA
                    });

                    router.push(
                      `${window.location.pathname}?href=/${website_sub_category_id}/user/try-out`,
                    );
                    setShowAuth((prev) => ({ ...prev, open: true }));
                  }}
                  className="flex-1 px-8 py-4 rounded-2xl font-bold text-white shadow-xl transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group"
                  style={{
                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                  }}
                >
                  <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 group-hover:animate-shimmer" />
                  <Sparkles className="w-5 h-5" />
                  <span>Daftar Sekarang GRATIS</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-4 rounded-2xl font-bold border-2 bg-white/80 backdrop-blur-sm transition-all duration-300 flex items-center justify-center gap-2"
                style={{
                  borderColor: mainColor,
                  color: mainColor,
                }}
              >
                <BookOpen className="w-5 h-5" />
                <span>Lihat Demo</span>
              </motion.button>
            </div>

          </motion.div>

          {/* Right Content - Achievement Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Main Achievement Card */}
            <Card className="relative bg-white shadow-2xl border-0 rounded-3xl overflow-hidden">
              <CardContent className="p-8 md:p-10">
                <div className="text-center space-y-8">
                  {/* Header */}
                  <div className="space-y-4">
                    <div
                      className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: mainColor }}
                    >
                      <Trophy className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                      Raih Prestasi Terbaikmu
                    </h3>
                    <p className="text-gray-600">
                      Bergabunglah dengan siswa terbaik Indonesia
                    </p>
                  </div>

                  {/* Achievement Stats */}
                  <div className="grid grid-cols-2 gap-6">
                    {achievements.map((achievement, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                        viewport={{ once: true }}
                        className="text-center space-y-3"
                      >
                        <div
                          className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${achievement.color}15` }}
                        >
                          <div style={{ color: achievement.color }}>
                            {achievement.icon}
                          </div>
                        </div>
                        <div>
                          <div
                            className="text-2xl font-bold"
                            style={{ color: achievement.color }}
                          >
                            {achievement.value}
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {achievement.label}
                          </div>
                          <div className="text-xs text-gray-500">
                            {achievement.description}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Success Rate */}
                  <div
                    className="p-6 rounded-2xl relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${mainColor}10, ${secondaryColor}10)`,
                    }}
                  >
                    <div className="relative z-10">
                      <div
                        className="text-4xl font-black mb-2"
                        style={{ color: mainColor }}
                      >
                        95%
                      </div>
                      <div className="font-bold text-gray-900 mb-1">
                        Tingkat Kelulusan
                      </div>
                      <div className="text-sm text-gray-600">
                        Siswa kami berhasil lolos PTN & Kedinasan
                      </div>
                    </div>
                    <div
                      className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full opacity-20"
                      style={{ backgroundColor: mainColor }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl shadow-lg flex items-center justify-center"
              style={{ backgroundColor: secondaryColor }}
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>

            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -bottom-4 -left-4 w-12 h-12 rounded-xl shadow-lg flex items-center justify-center bg-white border-2"
              style={{ borderColor: mainColor }}
            >
              <div
                className="w-6 h-6 rounded-lg"
                style={{ backgroundColor: mainColor }}
              />
            </motion.div>

            {/* Decorative Numbers */}
            <div
              className="absolute top-8 left-8 opacity-10 font-black text-6xl"
              style={{ color: mainColor }}
            >
              #1
            </div>
          </motion.div>
        </div>
      </div>

      {/* Custom Animations CSS */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animation-delay-500 {
          animation-delay: 500ms;
        }
        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </section>
  );
};

export default FinalCTA;
