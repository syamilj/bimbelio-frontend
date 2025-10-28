'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Eye,
  FileText,
  MessageSquare,
  PenTool,
  Sparkles,
  Zap,
} from 'lucide-react';

export default function PricingFeatures() {
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors from the selected category
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  // Dynamic coin colors based on theme
  const coinColors = {
    Notes: `${mainColor}dd`,
    Chat: `${secondaryColor}dd`,
    Quiz: `${mainColor}dd`,
    Tryout: `${mainColor}aa`,
    Vision: `${secondaryColor}dd`,
  };

  const features = [
    {
      icon: (
        <MessageSquare
          className="h-6 w-6"
          style={{ color: mainColor }}
        />
      ),
      title: 'Chat Coin',
      description:
        'Gunakan untuk mengakses fitur chat dengan AI Tutor yang siap menjawab pertanyaanmu',
      color: coinColors.Chat,
      usage: '1 coin per chat',
      gradient: `linear-gradient(135deg, ${coinColors.Chat}, ${coinColors.Chat}dd)`,
    },
    {
      icon: (
        <FileText
          className="h-6 w-6"
          style={{ color: mainColor }}
        />
      ),
      title: 'Tryout Coin',
      description:
        'Gunakan untuk mengakses tryout dengan format yang sama dengan ujian',
      color: coinColors.Tryout,
      usage: '1 coin per tryout',
      gradient: `linear-gradient(135deg, ${coinColors.Tryout}, ${coinColors.Tryout}dd)`,
    },
    {
      icon: (
        <PenTool
          className="h-6 w-6"
          style={{ color: mainColor }}
        />
      ),
      title: 'Notes Coin',
      description:
        'Gunakan untuk membuat catatan belajar dengan fitur AI yang membantu mengorganisir materi',
      color: coinColors.Notes,
      usage: '1 coin per notes',
      gradient: `linear-gradient(135deg, ${coinColors.Notes}, ${coinColors.Notes}dd)`,
    },
    {
      icon: (
        <BookOpen
          className="h-6 w-6"
          style={{ color: mainColor }}
        />
      ),
      title: 'Quiz Coin',
      description:
        'Gunakan untuk mengakses quiz interaktif yang disesuaikan dengan kemampuanmu',
      color: coinColors.Quiz,
      usage: '1 coin per quiz',
      gradient: `linear-gradient(135deg, ${coinColors.Quiz}, ${coinColors.Quiz}dd)`,
    },
    {
      icon: (
        <Eye
          className="h-6 w-6"
          style={{ color: mainColor }}
        />
      ),
      title: 'Vision Coin',
      description:
        'Gunakan untuk mengakses fitur AI Vision yang membantu menyelesaikan soal dari gambar',
      color: coinColors.Vision,
      usage: '1 coin per penggunaan',
      gradient: `linear-gradient(135deg, ${coinColors.Vision}, ${coinColors.Vision}dd)`,
    },
  ];

  return (
    <div className="mt-20 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div
          className="absolute top-20 right-10 w-64 h-64 rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, ${mainColor}20 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute bottom-20 left-10 w-48 h-48 rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, ${secondaryColor}20 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* Header - Enhanced homepage style */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        {/* Badge - Enhanced with icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white border-none mb-8 shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            boxShadow: `0 8px 32px ${mainColor}30`,
          }}
        >
          <Sparkles
            size={16}
            className="animate-pulse"
          />
          Sistem Coin Interaktif
        </motion.div>

        <h2 className="text-4xl md:text-6xl font-black leading-tight text-gray-900 mb-8">
          5 Jenis Coin untuk{' '}
          <span
            className="bg-clip-text text-transparent block mt-2"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Fitur Berbeda
          </span>
        </h2>

        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Sistem coin yang smart untuk mengakses fitur-fitur AI yang akan{' '}
          <span
            className="font-bold"
            style={{ color: mainColor }}
          >
            maksimalkan persiapan ujianmu
          </span>
        </p>
      </motion.div>

      {/* Enhanced Coin Grid - Redesigned layout */}
      <div className="max-w-7xl mx-auto mb-20">
        {/* First row - 3 main coins */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {features.slice(0, 3).map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03, y: -8 }}
              className="group relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-white/20 flex flex-col overflow-hidden"
              style={{
                boxShadow: `0 8px 40px ${mainColor}12, 0 2px 16px ${mainColor}08`,
              }}
            >
              {/* Accent gradient top */}
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
                style={{
                  background: `linear-gradient(135deg, ${feature.color}, ${feature.color}aa)`,
                }}
              />

              {/* Icon with enhanced styling */}
              <div className="flex items-center mb-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${feature.color}, ${feature.color}dd)`,
                  }}
                >
                  <div className="w-7 h-7 text-white">{feature.icon}</div>
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 group-hover:text-gray-700 transition-colors">
                    {feature.title}
                  </h3>
                </div>
              </div>

              <p className="text-gray-600 mb-8 leading-relaxed flex-grow">
                {feature.description}
              </p>

              {/* Usage info with enhanced styling */}
              <div className="mt-auto">
                <div
                  className="flex items-center justify-between p-4 rounded-2xl border"
                  style={{
                    background: `linear-gradient(135deg, ${feature.color}08, ${feature.color}15)`,
                    borderColor: `${feature.color}30`,
                  }}
                >
                  <span className="text-sm font-medium text-gray-700">
                    Biaya penggunaan
                  </span>
                  <span
                    className="text-sm font-bold px-3 py-1 rounded-full bg-white shadow-sm"
                    style={{ color: feature.color }}
                  >
                    {feature.usage}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Second row - 2 remaining coins centered */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {features.slice(3).map((feature, index) => (
            <motion.div
              key={index + 3}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: (index + 3) * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03, y: -8 }}
              className="group relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-white/20 flex flex-col overflow-hidden"
              style={{
                boxShadow: `0 8px 40px ${mainColor}12, 0 2px 16px ${mainColor}08`,
              }}
            >
              {/* Accent gradient top */}
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
                style={{
                  background: `linear-gradient(135deg, ${feature.color}, ${feature.color}aa)`,
                }}
              />

              {/* Icon with enhanced styling */}
              <div className="flex items-center mb-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${feature.color}, ${feature.color}dd)`,
                  }}
                >
                  <div className="w-7 h-7 text-white">{feature.icon}</div>
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 group-hover:text-gray-700 transition-colors">
                    {feature.title}
                  </h3>
                </div>
              </div>

              <p className="text-gray-600 mb-8 leading-relaxed flex-grow">
                {feature.description}
              </p>

              {/* Usage info with enhanced styling */}
              <div className="mt-auto">
                <div
                  className="flex items-center justify-between p-4 rounded-2xl border"
                  style={{
                    background: `linear-gradient(135deg, ${feature.color}08, ${feature.color}15)`,
                    borderColor: `${feature.color}30`,
                  }}
                >
                  <span className="text-sm font-medium text-gray-700">
                    Biaya penggunaan
                  </span>
                  <span
                    className="text-sm font-bold px-3 py-1 rounded-full bg-white shadow-sm"
                    style={{ color: feature.color }}
                  >
                    {feature.usage}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Enhanced How It Works Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 overflow-hidden border border-white/20 max-w-7xl mx-auto"
        style={{
          boxShadow: `0 20px 60px ${mainColor}10, 0 8px 40px ${mainColor}08`,
        }}
      >
        {/* Background decorations */}
        <div
          className="absolute top-0 right-0 w-96 h-96 opacity-5 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${mainColor} 0%, transparent 70%)`,
            transform: 'translate(30%, -30%)',
          }}
        />

        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white border-none mb-6 shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${secondaryColor}, ${mainColor})`,
            }}
          >
            <Zap
              size={16}
              className="animate-pulse"
            />
            Cara Kerja Smart
          </motion.div>

          <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
            Sistem Coin yang{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Efisien & Fleksibel
            </span>
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* How to Use Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center mb-6">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mr-4 shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}, ${mainColor}dd)`,
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-white"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M9 12l2 2 4-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h4 className="text-2xl font-black text-gray-900">
                Cara Penggunaan
              </h4>
            </div>

            <div className="space-y-6">
              {[
                {
                  title: 'Pilih Fitur',
                  desc: 'Setiap fitur memerlukan jenis coin tertentu untuk digunakan',
                },
                {
                  title: 'Efisiensi Paket',
                  desc: 'Semakin tinggi paket berlangganan, semakin sedikit coin yang diperlukan',
                },
                {
                  title: 'No Expire',
                  desc: 'Semua jenis coin tidak memiliki expire dan akan tereset kembali jika mencapai limit',
                },
                {
                  title: 'Top-up Fleksibel',
                  desc: 'Coin tambahan dapat dibeli kapan saja sesuai kebutuhan',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-start group"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-4 mt-1 shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-white"
                    >
                      <path
                        d="M5 12L10 17L20 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 mb-1">
                      {item.title}
                    </h5>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Usage Examples */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center mb-6">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mr-4 shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${secondaryColor}, ${secondaryColor}dd)`,
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-white"
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M8 12l2 2 4-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h4 className="text-2xl font-black text-gray-900">
                Contoh Penggunaan
              </h4>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: MessageSquare,
                  label: '1x Chat dengan AI Tutor',
                  cost: '1 chat coin',
                },
                {
                  icon: FileText,
                  label: '1x Tryout Lengkap',
                  cost: '1 tryout coin',
                },
                { icon: PenTool, label: '1x Notes AI', cost: '1 notes coin' },
                {
                  icon: BookOpen,
                  label: '1x Quiz Latihan',
                  cost: '1 quiz coin',
                },
                {
                  icon: Eye,
                  label: '1x Penggunaan Vision AI',
                  cost: '1 vision coin',
                },
              ].map((example, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 group hover:shadow-lg transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${mainColor}02, ${mainColor}05)`,
                  }}
                >
                  <div className="flex items-center">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300"
                      style={{
                        color: mainColor,
                        backgroundColor: `${mainColor}15`,
                      }}
                    >
                      <example.icon size={20} />
                    </div>
                    <span className="font-semibold text-gray-900">
                      {example.label}
                    </span>
                  </div>
                  <span
                    className="font-bold text-sm px-3 py-2 rounded-lg text-white shadow-sm"
                    style={{ backgroundColor: mainColor }}
                  >
                    {example.cost}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
