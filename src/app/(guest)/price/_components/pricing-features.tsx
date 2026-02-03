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
    <div className="mt-16 relative">
      {/* Subtle Background decoration */}
      <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none">
        <div
          className="absolute top-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-[0.03]"
          style={{ backgroundColor: mainColor }}
        />
      </div>

      {/* Clean Header - BimArena Style */}
      <div className="text-center mb-12">
        {/* Simple Badge */}
        <div
          className="inline-flex items-center gap-2 rounded-3xl px-4 py-1.5 text-xs font-bold text-white border-none mb-4 shadow-sm"
          style={{
            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
          }}
        >
          <Sparkles size={14} />
          Sistem Coin Interaktif
        </div>

        <h2 className="text-3xl md:text-4xl font-black leading-tight text-slate-800 mb-4">
          5 Jenis Coin untuk{' '}
          <span style={{ color: mainColor }}>Fitur Berbeda</span>
        </h2>

        <p className="text-base text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Sistem coin yang smart untuk mengakses fitur-fitur AI yang akan{' '}
          <span className="font-bold text-slate-900">
            maksimalkan persiapan ujianmu
          </span>
        </p>
      </div>

      {/* Clean Coin Grid - BimArena Style */}
      <div className="max-w-7xl mx-auto mb-16">
        {/* First row - 3 main coins */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {features.slice(0, 3).map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-3xl overflow-hidden border-2 border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200"
            >
              {/* Top Accent Bar - Thicker */}
              <div
                className="h-1 w-full"
                style={{
                  background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
                }}
              />

              <div className="p-5 flex flex-col">
                {/* Icon at top left corner */}
                <div className="mb-4">
                  <div
                    className="p-3 rounded-2xl inline-flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: `${mainColor}15` }}
                  >
                    {feature.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-black text-slate-900 mb-3">
                  {feature.title}
                </h3>

                <p className="text-sm text-slate-600 mb-6 leading-relaxed flex-grow">
                  {feature.description}
                </p>

                {/* Usage info with clean styling */}
                <div className="mt-auto">
                  <div
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50"
                  >
                    <span className="text-xs font-semibold text-slate-700">
                      Biaya penggunaan
                    </span>
                    <span
                      className="text-xs font-bold px-3 py-1.5 rounded-full text-white"
                      style={{ backgroundColor: mainColor }}
                    >
                      {feature.usage}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Second row - 2 remaining coins centered */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {features.slice(3).map((feature, index) => (
            <div
              key={index + 3}
              className="group relative bg-white rounded-3xl overflow-hidden border-2 border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200"
            >
              {/* Top Accent Bar - Thicker */}
              <div
                className="h-1 w-full"
                style={{ backgroundColor: secondaryColor }}
              />

              <div className="p-5 flex flex-col">
                {/* Icon at top left corner */}
                <div className="mb-4">
                  <div
                    className="p-3 rounded-2xl inline-flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: `${secondaryColor}15` }}
                  >
                    {feature.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-black text-slate-900 mb-3">
                  {feature.title}
                </h3>

                <p className="text-sm text-slate-600 mb-6 leading-relaxed flex-grow">
                  {feature.description}
                </p>

                {/* Usage info with clean styling */}
                <div className="mt-auto">
                  <div
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50"
                  >
                    <span className="text-xs font-semibold text-slate-700">
                      Biaya penggunaan
                    </span>
                    <span
                      className="text-xs font-bold px-3 py-1.5 rounded-full text-white"
                      style={{ backgroundColor: secondaryColor }}
                    >
                      {feature.usage}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clean How It Works Section - BimArena Style */}
      <div
        className="relative bg-white rounded-3xl p-6 md:p-8 overflow-hidden border-2 border-slate-200 max-w-7xl mx-auto shadow-sm"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center gap-2 rounded-3xl px-4 py-1.5 text-xs font-bold text-white border-none mb-4 shadow-sm"
            style={{
              background: `linear-gradient(135deg, ${secondaryColor}, ${mainColor})`,
            }}
          >
            <Zap size={14} />
            Cara Kerja Smart
          </div>

          <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-2">
            Sistem Coin yang{' '}
            <span style={{ color: mainColor }}>
              Efisien & Fleksibel
            </span>
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* How to Use Section */}
          <div>
            <div className="flex items-center mb-4">
              <div
                className="w-10 h-10 rounded-3xl flex items-center justify-center mr-3 shadow-sm"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}, ${mainColor}dd)`,
                }}
              >
                <svg
                  width="20"
                  height="20"
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
              <h4 className="text-lg font-black text-slate-800">
                Cara Penggunaan
              </h4>
            </div>

            <div className="space-y-4">
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
                <div
                  key={index}
                  className="flex items-start group"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-0.5 shrink-0 shadow-sm"
                    style={{
                      background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
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
                    <h5 className="font-bold text-sm text-slate-800 mb-0.5">
                      {item.title}
                    </h5>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Usage Examples */}
          <div>
            <div className="flex items-center mb-4">
              <div
                className="w-10 h-10 rounded-3xl flex items-center justify-center mr-3 shadow-sm"
                style={{
                  background: `linear-gradient(135deg, ${secondaryColor}, ${secondaryColor}dd)`,
                }}
              >
                <svg
                  width="20"
                  height="20"
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
              <h4 className="text-lg font-black text-slate-800">
                Contoh Penggunaan
              </h4>
            </div>

            <div className="space-y-3">
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
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-3xl border border-slate-200 hover:shadow-sm transition-all duration-200"
                  style={{
                    background: `linear-gradient(135deg, ${mainColor}02, ${mainColor}05)`,
                  }}
                >
                  <div className="flex items-center">
                    <div
                      className="w-8 h-8 rounded-3xl flex items-center justify-center mr-2.5"
                      style={{
                        color: mainColor,
                        backgroundColor: `${mainColor}15`,
                      }}
                    >
                      <example.icon size={16} />
                    </div>
                    <span className="font-semibold text-sm text-slate-800">
                      {example.label}
                    </span>
                  </div>
                  <span
                    className="font-bold text-xs px-2.5 py-1 rounded-3xl text-white shadow-sm"
                    style={{ backgroundColor: mainColor }}
                  >
                    {example.cost}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
