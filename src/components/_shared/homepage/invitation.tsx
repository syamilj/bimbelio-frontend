'use client';

import { useGuest } from '@/components/layout/layoutGuest';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { motion } from 'framer-motion';
import { ArrowRight, Award, Clock, Sparkles, Users } from 'lucide-react';
import Link from 'next/link';

const Invitation = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const { data: session } = useSession();
  const { setShowAuth } = useGuest();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const stats = [
    {
      icon: <Users className="w-6 h-6" />,
      label: 'Siswa Bergabung',
      value: '10,000+',
      description: 'Sudah merasakan manfaatnya',
    },
    {
      icon: <Award className="w-6 h-6" />,
      label: 'Tingkat Kelulusan',
      value: '95%',
      description: 'Berhasil lolos PTN & Kedinasan',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      label: 'Waktu Belajar',
      value: '24/7',
      description: 'Akses kapan saja',
    },
  ];

  const features = [
    'Try Out GRATIS dengan analisis AI',
    'Materi pembelajaran terlengkap',
    'Pendampingan personal tutor',
    'Simulasi ujian yang realistis',
    'Dashboard progress yang detail',
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
          }}
        />
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: mainColor }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: secondaryColor }}
        />
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="flex items-center gap-2"
              >
                <Sparkles
                  className="w-6 h-6"
                  style={{ color: mainColor }}
                />
                <span
                  className="font-bold text-lg"
                  style={{ color: mainColor }}
                >
                  Bergabung Sekarang
                </span>
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Wujudkan Impian
                <span
                  className="block"
                  style={{ color: mainColor }}
                >
                  Masuk PTN & Kedinasan!
                </span>
              </h2>

              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                Ribuan siswa sudah merasakan manfaat belajar dengan AI. Sekarang
                giliran kamu untuk meraih prestasi terbaik!
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center p-4 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg"
                >
                  <div
                    className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${mainColor}15` }}
                  >
                    <div style={{ color: mainColor }}>{stat.icon}</div>
                  </div>
                  <div
                    className="text-2xl font-bold mb-1"
                    style={{ color: mainColor }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {stat.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {stat.description}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Features List */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">
                Yang akan kamu dapatkan:
              </h3>
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: mainColor }}
                    >
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>
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
                    className="w-full px-8 py-4 rounded-2xl font-bold text-white shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                    style={{
                      background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                    }}
                  >
                    Mulai Try Out Gratis
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    setShowAuth((prev) => ({ ...prev, open: true }))
                  }
                  className="flex-1 px-8 py-4 rounded-2xl font-bold text-white shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                  }}
                >
                  Daftar Sekarang
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-4 rounded-2xl font-bold border-2 bg-white transition-all duration-300"
                style={{
                  borderColor: mainColor,
                  color: mainColor,
                }}
              >
                Lihat Demo
              </motion.button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: mainColor }}
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-gray-600">+10k siswa aktif</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div
                    key={star}
                    className="w-4 h-4 rounded-sm flex items-center justify-center"
                    style={{ backgroundColor: '#FFD700' }}
                  >
                    <span className="text-white text-xs">★</span>
                  </div>
                ))}
                <span className="text-sm text-gray-600 ml-1">4.9/5 rating</span>
              </div>
            </div>
          </motion.div>

          {/* Visual Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Main Illustration Container */}
            <div className="relative">
              {/* Background Circle */}
              <div
                className="absolute inset-0 rounded-full opacity-20 blur-3xl"
                style={{ backgroundColor: mainColor }}
              />

              {/* Main Content Area */}
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                {/* Header */}
                <div className="text-center mb-8">
                  <div
                    className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: mainColor }}
                  >
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Success Dashboard
                  </h3>
                  <p className="text-gray-600">Live Progress Tracking</p>
                </div>

                {/* Mock Dashboard */}
                <div className="space-y-6">
                  {/* Progress Bars */}
                  <div className="space-y-4">
                    {[
                      { label: 'Matematika', progress: 85 },
                      { label: 'Bahasa Indonesia', progress: 92 },
                      { label: 'TKP', progress: 78 },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="space-y-2"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">
                            {item.label}
                          </span>
                          <span
                            className="text-sm font-bold"
                            style={{ color: mainColor }}
                          >
                            {item.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${item.progress}%` }}
                            transition={{ duration: 1, delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className="h-2 rounded-full"
                            style={{ backgroundColor: mainColor }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Achievement Badges */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { title: 'Try Out Master', icon: '🏆' },
                      { title: 'Quick Learner', icon: '⚡' },
                    ].map((badge, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-xl text-center"
                        style={{ backgroundColor: `${mainColor}10` }}
                      >
                        <div className="text-2xl mb-2">{badge.icon}</div>
                        <div
                          className="text-sm font-bold"
                          style={{ color: mainColor }}
                        >
                          {badge.title}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

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
                className="absolute -bottom-4 -left-4 w-12 h-12 rounded-xl shadow-lg flex items-center justify-center bg-white"
              >
                <div
                  className="w-6 h-6 rounded-lg"
                  style={{ backgroundColor: mainColor }}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Invitation;
