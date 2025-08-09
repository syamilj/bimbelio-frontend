'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Card, CardContent } from '@/components/ui/card';
import {
  IconRevolusi1,
  IconRevolusi2,
  IconRevolusi3,
  IconRevolusi4,
} from '@/styles/icon';

import { ImageBahanAjar } from '@/_assets/homepage/Revolusi/BahanAjar';
import { ImageChatAI } from '@/_assets/homepage/Revolusi/Chat';
import { ImageNotes } from '@/_assets/homepage/Revolusi/Notes';
import { ImageQuiz } from '@/_assets/homepage/Revolusi/Quiz';
import { motion } from 'framer-motion';
import { Brain, Lightbulb, Target, Zap } from 'lucide-react';
import { memo, useMemo } from 'react';

const LearningRevolutions = memo(() => {
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors - memoized untuk menghindari re-calculation
  const { mainColor, secondaryColor } = useMemo(
    () => ({
      mainColor: websiteSubCategory?.main_color || '#0091FF',
      secondaryColor: websiteSubCategory?.secondary_color || '#5aa4dd',
    }),
    [websiteSubCategory],
  );

  // Memoized data untuk menghindari recreation setiap render
  const revolusiBelajar = useMemo(
    () => [
      {
        icon: <IconRevolusi1 />,
        modernIcon: <Brain className="w-8 h-8" />,
        text: 'Interactive Materials',
        description:
          'Dapatkan materi, soal, dan video yang bisa kamu tandai dan tanyakan sesuai kebutuhan!',
        image: <ImageBahanAjar />,
        highlights: [
          'Materi Interaktif',
          'Soal Terintegrasi',
          'Video Learning',
        ],
        color: '#3B82F6',
        stats: { items: '10K+', completion: '95%' },
      },
      {
        icon: <IconRevolusi2 />,
        modernIcon: <Target className="w-8 h-8" />,
        text: 'Chat & Vision',
        description:
          'Chat Bimbelio AI untuk penjelasan dan analisis materi dalam bentuk apapun secara real-time!',
        image: <ImageChatAI />,
        highlights: ['AI Chat 24/7', 'Vision Analysis', 'Real-time Help'],
        color: '#10B981',
        stats: { items: '24/7', completion: '98%' },
      },
      {
        icon: <IconRevolusi3 />,
        modernIcon: <Lightbulb className="w-8 h-8" />,
        text: 'Note Collection',
        description:
          'Gunakan fitur Note yang disertai AI untuk membantu mencatat dan mengatur informasi penting!',
        image: <ImageNotes />,
        highlights: ['Smart Notes', 'AI Assistant', 'Organization Tools'],
        color: '#F59E0B',
        stats: { items: '5K+', completion: '92%' },
      },
      {
        icon: <IconRevolusi4 />,
        modernIcon: <Zap className="w-8 h-8" />,
        text: 'Generate Quiz',
        description:
          'Generate Quiz pilihan ganda maupun esai secara otomatis dari material yang ada!',
        image: <ImageQuiz />,
        highlights: ['Auto Generate', 'Multiple Choice', 'Essay Questions'],
        color: '#8B5CF6',
        stats: { items: '2K+', completion: '90%' },
      },
    ],
    [],
  );

  // Optimized motion variants
  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          duration: 0.6,
          staggerChildren: 0.15, // Reduced stagger
        },
      },
    }),
    [],
  );

  const cardVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 30 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5, // Reduced duration
          ease: 'easeOut',
        },
      },
    }),
    [],
  );

  const highlightVariants = useMemo(
    () => ({
      hidden: { opacity: 0, x: -10 },
      visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.3 }, // Reduced duration
      },
    }),
    [],
  );

  return (
    <section
      id="learning-revolutions"
      className="py-16 md:py-24 relative overflow-hidden"
    >
      {/* Simplified Background - reduced opacity dan blur untuk performa */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-3 blur-2xl bg-main-default" // Reduced size and blur
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-3 blur-2xl bg-main-default" // Reduced size and blur
        />
      </div>

      <div className="container mx-auto max-w-7xl px-4">
        {/* Header - simplified animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }} // Added margin for earlier trigger
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white shadow-lg bg-gradient-default">
              <Zap className="w-4 h-4" />
              REVOLUSI BELAJAR
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-main-default">
            Revolusi Persiapan Belajar dengan AI!
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Bagaimana cara belajar dengan AI membantu Kamu mencapai target
            impianmu?
          </p>
        </motion.div>

        {/* Optimized Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-2 gap-8"
        >
          {revolusiBelajar.map((item, index) => (
            <RevolutionCard
              key={index}
              item={item}
              index={index}
              variants={cardVariants}
              highlightVariants={highlightVariants}
            />
          ))}
        </motion.div>

        {/* Simplified CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <CTASection
            mainColor={mainColor}
            secondaryColor={secondaryColor}
          />
        </motion.div>
      </div>
    </section>
  );
});

// Memoized Card Component untuk menghindari re-render
const RevolutionCard = memo(
  ({
    item,
    index,
    variants,
    highlightVariants,
  }: {
    item: any;
    index: number;
    variants: any;
    highlightVariants: any;
  }) => (
    <motion.div
      variants={variants}
      whileHover={{
        y: -5,
        scale: 1.01,
        transition: { duration: 0.2 }, // Faster hover transition
      }}
      className="h-full"
    >
      <Card className="h-full border-2 border-gray-100 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
        {/* Simplified transition */}
        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-6 items-center h-full">
            {/* Content */}
            <div className="space-y-6">
              {/* Icon & Stats */}
              <div className="flex items-start justify-between">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-105" // Faster transition
                  style={{ backgroundColor: item.color }}
                >
                  <div className="text-white">{item.modernIcon}</div>
                </div>
                <div className="text-right">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: item.color }}
                  >
                    {item.stats.items}
                  </div>
                  <div className="text-xs text-gray-500">Resources</div>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                  {item.text}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Highlights - optimized animation */}
              <div className="space-y-3">
                {item.highlights.map((highlight: string, hIndex: number) => (
                  <motion.div
                    key={hIndex}
                    variants={highlightVariants}
                    className="flex items-center gap-3"
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {highlight}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Success Rate - simplified */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Success Rate</span>
                  <span
                    className="font-bold"
                    style={{ color: item.color }}
                  >
                    {item.stats.completion}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="h-2 rounded-full transition-all duration-1000"
                    style={{
                      backgroundColor: item.color,
                      width: item.stats.completion,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Image - optimized rendering */}
            <div className="hidden md:block relative">
              <div className="transform transition-transform duration-300 group-hover:scale-105">
                {/* Faster transition */}
                <div style={{ color: item.color }}>{item.image}</div>
              </div>

              {/* Floating Badge */}
              <div
                className="absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg"
                style={{ backgroundColor: item.color }}
              >
                {index + 1}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  ),
);

// Memoized CTA Component
const CTASection = memo(
  ({
    mainColor,
    secondaryColor,
  }: {
    mainColor: string;
    secondaryColor: string;
  }) => (
    <Card className="max-w-4xl mx-auto border-2 rounded-3xl overflow-hidden shadow-xl border-main-default/20 bg-white">
      <CardContent className="p-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-main-default">
              Siap Merasakan Revolusi Belajar?
            </h3>
            <p className="text-lg text-gray-600">
              Bergabunglah dengan 15,000+ siswa yang sudah merasakan kecanggihan
              AI
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.1 }} // Faster button interaction
          >
            <button className="px-8 py-4 rounded-2xl font-bold text-white shadow-lg transition-all duration-200 flex items-center justify-center gap-2 mx-auto bg-main-default">
              <Zap className="w-5 h-5" />
              Coba Revolusi AI Sekarang
            </button>
          </motion.div>

          <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>100% Gratis</span>
            </div>
            <div className="w-px h-4 bg-gray-300" />
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-main-default" />
              <span>AI Powered</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
);

LearningRevolutions.displayName = 'LearningRevolutions';
RevolutionCard.displayName = 'RevolutionCard';
CTASection.displayName = 'CTASection';

export default LearningRevolutions;
