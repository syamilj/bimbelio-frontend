'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Award, Quote, Star, TrendingUp, Users } from 'lucide-react';

const Testimoni = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const dummyTestimoni = [
    {
      start: 5,
      heading: 'Masa Depan Pembelajaran',
      comment:
        'Integrasi AI dalam pendidikan merepresentasikan masa depan pembelajaran, di mana metode yang dipersonalisasi dan adaptif menghasilkan hasil yang lebih baik bagi siswa.',
      name: 'Eric Schmidt',
      profesi: 'Mantan CEO Google',
      avatar: 'ES',
      company: 'Google',
      achievement: 'CEO Terpilih Fortune 500',
      category: 'Technology Leader',
      bgGradient: 'from-blue-500 to-indigo-600',
      iconColor: '#3B82F6',
    },
    {
      start: 5,
      heading: 'AI dan Akses Pendidikan',
      comment:
        'AI dapat mendemokratisasi akses ke pendidikan berkualitas tinggi, menghilangkan hambatan dan membuka peluang bagi pelajar di seluruh dunia.',
      name: 'Daphne Koller',
      profesi: 'Co-founder Coursera',
      avatar: 'DK',
      company: 'Coursera',
      achievement: 'EdTech Pioneer',
      category: 'Education Expert',
      bgGradient: 'from-emerald-500 to-teal-600',
      iconColor: '#10B981',
    },
    {
      start: 5,
      heading: 'Memberdayakan Pelajar',
      comment:
        'Kombinasi AI dan pendidikan dapat memberdayakan pelajar untuk mencapai potensi tertinggi mereka dengan menyesuaikan pengalaman belajar sesuai kebutuhan individu.',
      name: 'Sundar Pichai',
      profesi: 'CEO of Alphabet Inc. and Google LLC',
      avatar: 'SP',
      company: 'Alphabet',
      achievement: 'Fortune CEO of the Year',
      category: 'Tech Visionary',
      bgGradient: 'from-purple-500 to-pink-600',
      iconColor: '#8B5CF6',
    },
  ];

  const statsData = [
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Expert Reviews',
      value: dummyTestimoni.length,
      color: mainColor,
    },
    {
      icon: <Star className="w-5 h-5" />,
      label: 'Average Rating',
      value: '5.0',
      color: '#FFD700',
    },
    {
      icon: <Award className="w-5 h-5" />,
      label: 'Industry Leaders',
      value: '100%',
      color: secondaryColor,
    },
  ];

  return (
    <section
      id="testimoni"
      className="py-16 md:py-24 relative overflow-hidden"
    >
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 rounded-3xl px-6 py-3 text-sm font-bold text-white shadow-lg bg-gradient-default">
            <Quote className="w-4 h-4" />
            EXPERT OPINIONS
          </span>
        </motion.div>

        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-main-default">
          Pendapat Para Ahli Teknologi
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Opini tentang revolusi belajar dengan AI dari para pemimpin teknologi
          dan pendidikan dunia
        </p>

        {/* Enhanced Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center items-center gap-8 mt-8"
        >
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="text-center"
            >
              <div
                className="w-12 h-12 mx-auto mb-2 rounded-3xl flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <div style={{ color: stat.color }}>{stat.icon}</div>
              </div>
              <div
                className="text-2xl md:text-3xl font-bold"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Enhanced Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 container mx-auto">
        {dummyTestimoni.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="h-full"
          >
            <Card className="h-full border-2 border-gray-100 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group relative">
              {/* Background Gradient */}
              <div
                className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, ${item.iconColor}20, ${item.iconColor}10)`,
                }}
              />

              <CardContent className="p-8 h-full flex flex-col relative z-10">
                {/* Enhanced Header */}
                <div className="relative mb-6">
                  {/* Quote Icon Background */}
                  <div className="absolute -top-2 -right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Quote
                      className="w-16 h-16"
                      style={{ color: item.iconColor }}
                    />
                  </div>

                  {/* Category Badge */}
                  <div className="mb-4">
                    <span
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                      style={{ backgroundColor: item.iconColor }}
                    >
                      <TrendingUp className="w-3 h-3" />
                      {item.category}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {item.start}.0
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-6">
                  <h3
                    className="text-xl font-bold leading-tight"
                    style={{ color: item.iconColor }}
                  >
                    &quot;{item.heading}&quot;
                  </h3>

                  <p className="text-gray-600 leading-relaxed text-sm">
                    {item.comment}
                  </p>
                </div>

                {/* Enhanced Author Section */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      <div
                        className="w-14 h-14 rounded-3xl flex items-center justify-center text-white font-bold shadow-lg text-lg group-hover:scale-110 transition-transform duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${item.iconColor}, ${item.iconColor}dd)`,
                        }}
                      >
                        {item.avatar}
                      </div>
                      {/* Badge */}
                      <div
                        className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white"
                        style={{ backgroundColor: item.iconColor }}
                      >
                        <Award className="w-3 h-3 text-white" />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-900 text-sm leading-tight">
                        {item.name}
                      </div>
                      <div
                        className="text-sm font-medium"
                        style={{ color: item.iconColor }}
                      >
                        {item.profesi}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {item.company} • {item.achievement}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div
                  className="absolute bottom-0 left-0 w-full h-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                  style={{
                    background: `linear-gradient(90deg, ${item.iconColor}, ${item.iconColor}80)`,
                  }}
                />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Enhanced Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        viewport={{ once: true }}
        className="text-center mt-16 container mx-auto"
      >
        <div className="max-w-4xl mx-auto p-8 rounded-3xl border-2 shadow-lg relative overflow-hidden border-main-default/20 bg-main-default/10">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 left-4 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <div className="absolute top-8 right-8 w-1 h-1 bg-purple-400 rounded-full animate-pulse animation-delay-200" />
            <div className="absolute bottom-8 left-8 w-1 h-1 bg-green-400 rounded-full animate-pulse animation-delay-500" />
          </div>

          <div className="relative z-10 space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-main-default">
              Bergabunglah dengan Revolusi Pembelajaran AI
            </h3>
            <p className="text-lg text-gray-600">
              Rasakan sendiri teknologi yang dipercaya oleh para ahli teknologi
              dunia
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-3xl font-bold text-white shadow-lg transition-all duration-300 flex items-center gap-2 bg-gradient-default"
              >
                <Star className="w-5 h-5" />
                Mulai Belajar Sekarang
              </motion.button>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-medium">Gratis untuk Mulai</span>
                </div>
                <div className="w-px h-4 bg-gray-300" />
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">Trusted by Experts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Testimoni;
