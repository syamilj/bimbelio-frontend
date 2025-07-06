'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Quote, Star, Users } from 'lucide-react';
import AnimatedGradientText from '../../magicui/animated-gradient-text';

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
      color: '#3B82F6',
    },
    {
      start: 5,
      heading: 'AI dan Akses Pendidikan',
      comment:
        'AI dapat mendemokratisasi akses ke pendidikan berkualitas tinggi, menghilangkan hambatan dan membuka peluang bagi pelajar di seluruh dunia.',
      name: 'Daphne Koller',
      profesi: 'Co-founder Coursera',
      avatar: 'DK',
      color: '#10B981',
    },
    {
      start: 5,
      heading: 'Memberdayakan Pelajar',
      comment:
        'Kombinasi AI dan pendidikan dapat memberdayakan pelajar untuk mencapai potensi tertinggi mereka dengan menyesuaikan pengalaman belajar sesuai kebutuhan individu.',
      name: 'Sundar Pichai',
      profesi: 'CEO of Alphabet Inc. and Google LLC',
      avatar: 'SP',
      color: '#8B5CF6',
    },
  ];

  return (
    <section
      id="testimoni"
      className="py-16 md:py-24 relative overflow-hidden"
    >
      {/* Enhanced Background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl"
          style={{ backgroundColor: mainColor }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl"
          style={{ backgroundColor: secondaryColor }}
        />
      </div>

      <div className="container mx-auto max-w-7xl px-4">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <AnimatedGradientText>
              Bagaimana Pendapat Para Ahli?
            </AnimatedGradientText>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Opini tentang revolusi belajar dengan AI dari para pemimpin
            teknologi dunia
          </p>

          {/* Stats */}
          <div className="flex justify-center items-center gap-8 mt-8">
            <div className="flex items-center gap-2">
              <Users
                className="w-5 h-5"
                style={{ color: mainColor }}
              />
              <span
                className="font-bold"
                style={{ color: mainColor }}
              >
                3 Ahli
              </span>
            </div>
            <div className="w-px h-6 bg-gray-300" />
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                />
              ))}
              <span className="ml-2 font-bold text-gray-700">5.0 Rating</span>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {dummyTestimoni.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <Card className="h-full border-2 border-gray-100 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group">
                <CardContent className="p-8 h-full flex flex-col relative">
                  {/* Quote Icon */}
                  <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-30 transition-opacity">
                    <Quote
                      className="w-12 h-12"
                      style={{ color: item.color }}
                    />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-6">
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

                  {/* Content */}
                  <div className="flex-1 space-y-6">
                    <h3
                      className="text-xl font-bold"
                      style={{ color: item.color }}
                    >
                      "{item.heading}"
                    </h3>

                    <p className="text-gray-600 leading-relaxed line-clamp-4">
                      {item.comment}
                    </p>
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-100">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{item.name}</div>
                      <div
                        className="text-sm"
                        style={{ color: item.color }}
                      >
                        {item.profesi}
                      </div>
                    </div>
                  </div>

                  {/* Decorative Element */}
                  <div
                    className="absolute bottom-0 left-0 w-full h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: item.color }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-lg text-gray-600 mb-6">
            Bergabunglah dengan revolusi pembelajaran AI bersama para ahli
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-2xl font-bold text-white shadow-lg transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            Mulai Belajar Sekarang
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimoni;
