'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { pixel } from '@/lib/pixel/_core';
import {
  BotMessageSquareIcon,
  Brain,
  ChartColumnIcon,
  CheckCircle2,
  FileTextIcon,
  NotepadTextIcon,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useEffect } from 'react';

const supportFeatures = [
  {
    icon: <BotMessageSquareIcon className="size-6 text-white" />,
    title: 'Chat AI',
    description:
      'Dapatkan jawaban instan untuk pertanyaanmu kapan saja dengan asisten AI kami',
    gradient: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    feature1: 'Respons Instan',
    feature2: '24/7 Tersedia',
    badge: 'Chat',
  },
  {
    icon: <NotepadTextIcon className="size-6 text-white" />,
    title: 'Note AI',
    description:
      'Buat dan kelola catatan dengan bantuan AI untuk pembelajaran yang lebih efektif',
    gradient: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    feature1: 'Auto Organize',
    feature2: 'Smart Summary',
    badge: 'Notes',
  },
  {
    icon: <FileTextIcon className="size-6 text-white" />,
    title: 'Quiz AI',
    description:
      'Latihan soal yang menyesuaikan dengan tingkat kemampuan dan perkembanganmu',
    gradient: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    feature1: 'Adaptive Level',
    feature2: 'Smart Feedback',
    badge: 'Quiz',
  },
  {
    icon: <ChartColumnIcon className="size-6 text-white" />,
    title: 'Laporan Belajar',
    description:
      'Pantau perkembangan belajarmu dengan laporan dan analisis detail',
    gradient: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    feature1: 'Analisis Detail',
    feature2: 'Rekomendasi Aksi',
    badge: 'Reports',
  },
];

export default function CaraBelajarSection2() {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  useEffect(() => {
    pixel.meta.track(
      'ViewContent',
      {
        content_name: 'Course Page',
        content_type: 'page',
      },
      // ✅ Advanced Matching untuk Meta Pixel
      session?.user
        ? {
            em: session.user.email,
            ph: session.user.phone || undefined,
            fn: session.user.name?.split(' ')[0],
            ln: session.user.name?.split(' ').slice(1).join(' '),
          }
        : undefined,
    );
    pixel.tiktok.track('ViewContent', {
      content_name: 'Course Page',
      content_id: 'course_page_main', // ✅ Required untuk TikTok VSA
    });
  }, [session]);

  return (
    <section className="space-y-6 pt-8">
      {/* Section Header - Enhanced */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg animate-bounce"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2
            className="text-2xl md:text-3xl font-bold"
            style={{ color: mainColor }}
          >
            Fitur Pendukung Belajar
          </h2>
        </div>
        <div
          className="w-20 h-1 mx-auto rounded-full"
          style={{ backgroundColor: secondaryColor }}
        />
        <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
          Manfaatkan teknologi AI terdepan untuk pengalaman belajar yang lebih
          optimal
        </p>
      </div>

      {/* Feature Cards Grid - Enhanced */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {supportFeatures.map((feature, index) => (
          <Card
            key={index}
            className="group bg-white shadow-lg border-0 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative"
          >
            {/* Floating particles */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
            </div>

            {/* Enhanced Header with gradient background */}
            <CardHeader
              className="pb-6 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${mainColor}12, ${secondaryColor}12)`,
              }}
            >
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br ${feature.gradient} group-hover:scale-110 transition-all duration-300`}
                  >
                    {feature.icon}
                  </div>
                  <div
                    className="px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{
                      background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                    }}
                  >
                    {feature.badge}
                  </div>
                </div>

                <div>
                  <CardTitle
                    className="text-lg font-bold text-left"
                    style={{ color: mainColor }}
                  >
                    {feature.title}
                  </CardTitle>
                  <p className="text-xs text-gray-500 mt-1">
                    Teknologi AI Terdepan
                  </p>
                </div>
              </div>

              {/* Decorative elements */}
              <div
                className="absolute -right-4 -top-4 w-12 h-12 rounded-full opacity-10"
                style={{ backgroundColor: mainColor }}
              />
              <div
                className="absolute -left-6 -bottom-6 w-16 h-16 rounded-full opacity-5"
                style={{ backgroundColor: secondaryColor }}
              />
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Feature highlights */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-gray-50 group-hover:bg-blue-50 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-semibold text-gray-700">
                      {feature.feature1}
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 group-hover:bg-blue-50 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-semibold text-gray-700">
                      {feature.feature2}
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Powered Badge with shimmer */}
              <div
                className="mt-4 pt-4 border-t border-gray-100 p-3 rounded-lg text-center transition-all group-hover:shadow-md"
                style={{
                  backgroundColor: `${mainColor}08`,
                }}
              >
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: `${mainColor}15`,
                    color: mainColor,
                  }}
                >
                  <Brain className="w-3 h-3" />
                  AI Powered
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                </div>
              </div>
            </CardContent>

            {/* Bottom accent line */}
            <div
              className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500"
              style={{ backgroundColor: mainColor }}
            />
          </Card>
        ))}
      </div>

      {/* Enhanced Bottom CTA Section */}
      <div
        className="mt-12 p-8 rounded-2xl text-center relative overflow-hidden group"
        style={{
          background: `linear-gradient(135deg, ${mainColor}10, ${secondaryColor}10)`,
        }}
      >
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Sparkles
              className="w-5 h-5 text-yellow-400 animate-spin"
              style={{ animationDuration: '3s' }}
            />
            <h3
              className="text-lg font-bold"
              style={{ color: mainColor }}
            >
              Siap untuk Pengalaman Belajar yang Lebih Canggih?
            </h3>
            <Sparkles
              className="w-5 h-5 text-yellow-400 animate-spin"
              style={{ animationDuration: '3s', animationDirection: 'reverse' }}
            />
          </div>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto">
            Semua fitur AI ini dirancang khusus untuk membantu kamu meraih
            target SNBT impian dengan hasil yang maksimal
          </p>

          {/* Feature count */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="text-center">
              <div
                className="text-2xl font-bold"
                style={{ color: mainColor }}
              >
                4
              </div>
              <p className="text-xs text-gray-600">Fitur Premium</p>
            </div>
            <div className="w-px h-8 bg-gray-300" />
            <div className="text-center">
              <div
                className="text-2xl font-bold"
                style={{ color: mainColor }}
              >
                24/7
              </div>
              <p className="text-xs text-gray-600">Dukungan AI</p>
            </div>
            <div className="w-px h-8 bg-gray-300" />
            <div className="text-center">
              <div
                className="text-2xl font-bold"
                style={{ color: mainColor }}
              >
                ∞
              </div>
              <p className="text-xs text-gray-600">Unlimited Access</p>
            </div>
          </div>
        </div>

        {/* Decorative circles */}
        <div
          className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
          style={{ backgroundColor: mainColor }}
        />
        <div
          className="absolute -left-8 -bottom-8 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
          style={{ backgroundColor: secondaryColor }}
        />
      </div>
    </section>
  );
}
