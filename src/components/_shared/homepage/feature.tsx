import AnimatedGradientText from '@/components/magicui/animated-gradient-text';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Card, CardContent } from '@/components/ui/card';
import { IconFitur1, IconFitur2, IconFitur3 } from '@/styles/icon';
import { motion } from 'framer-motion';
import { Brain, Lightbulb, Target } from 'lucide-react';

const Feature = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const fitur = [
    {
      icon: <IconFitur1 w={80} />,
      modernIcon: <Brain className="w-8 h-8" />,
      text: 'Pendamping belajar cermat',
      description:
        'Gunakan metode strategi revolusi belajar yang terpersonalisasi berdasarkan kemampuanmu.',
      highlights: ['Personal AI Tutor', 'Adaptive Learning', 'Smart Analytics'],
      gradient: 'from-blue-500 to-purple-600',
    },
    {
      icon: <IconFitur2 w={80} />,
      modernIcon: <Target className="w-8 h-8" />,
      text: 'Pembelajaran aktif dan terarah',
      description:
        'Manfaatkan teknologi Active AI-Based Learning untuk mendapatkan pendamping belajar yang interaktif dan efektif.',
      highlights: [
        'Interactive Sessions',
        'Real-time Feedback',
        'Goal-oriented',
      ],
      gradient: 'from-green-500 to-teal-600',
    },
    {
      icon: <IconFitur3 w={80} />,
      modernIcon: <Lightbulb className="w-8 h-8" />,
      text: 'Akses materi variatif dan lengkap',
      description:
        'Nikmati akses ke materi kurasi terbaru yang variatif dan lengkap kapan saja, di mana saja dengan teknologi tertinggi.',
      highlights: ['10.000+ Materials', '24/7 Access', 'Latest Content'],
      gradient: 'from-orange-500 to-red-600',
    },
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: mainColor }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: secondaryColor }}
        />
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <AnimatedGradientText>
              Inovasi Belajar Berbasis AI
            </AnimatedGradientText>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Revolusi cara belajar dengan teknologi AI terdepan untuk
            memaksimalkan potensi akademikmu
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {fitur.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="h-full"
            >
              <Card className="h-full bg-white shadow-xl border-0 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 group">
                <CardContent className="p-8 h-full flex flex-col">
                  {/* Icon Section */}
                  <div className="relative mb-8">
                    {/* Background Circle */}
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                      }}
                    >
                      <div className="text-white">{item.modernIcon}</div>
                    </div>

                    {/* Traditional Icon (Hidden by default, shown on hover) */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                      {item.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-center space-y-6">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                      {item.text}
                    </h3>

                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Highlights */}
                    <div className="space-y-3">
                      {item.highlights.map((highlight, hIndex) => (
                        <motion.div
                          key={hIndex}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + hIndex * 0.1 }}
                          viewport={{ once: true }}
                          className="flex items-center justify-center gap-2"
                        >
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: mainColor }}
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {highlight}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Accent */}
                  <div
                    className="mt-8 h-1 rounded-full mx-auto transition-all duration-300 group-hover:w-full"
                    style={{
                      width: '60%',
                      background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
                    }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-lg text-gray-600 mb-8">
            Siap merasakan revolusi belajar dengan AI?
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

export default Feature;
