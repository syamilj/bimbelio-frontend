'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { pixel } from '@/lib/pixel/_core';
import {
  BotMessageSquareIcon,
  ChartColumnIcon,
  CheckCircle2,
  FileTextIcon,
  NotepadTextIcon,
  Sparkles,
  TrendingUp,
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
  // const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

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
    <section className="mb-12">
      {/* Section Header - Match Dashboard Style */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: mainColor }}
        >
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-black text-gray-900">
          Fitur Pendukung Belajar
        </h2>
      </div>

      {/* Feature Cards Grid - Clean Style */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {supportFeatures.map((feature, index) => (
          <Card
            key={index}
            className="border-2 border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300"
          >
            {/* Enhanced Header with gradient background */}
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${feature.gradient}`}
                >
                  {feature.icon}
                </div>
              </div>
              <CardTitle className="text-base font-bold text-gray-900">
                {feature.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 pt-0 space-y-4">
              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Feature highlights */}
              <div className="grid grid-cols-2 gap-3">
                <div
                  className={`p-3 rounded-2xl border-2 ${feature.borderColor} ${feature.bgColor}`}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-semibold text-gray-700">
                      {feature.feature1}
                    </span>
                  </div>
                </div>
                <div
                  className={`p-3 rounded-2xl border-2 ${feature.borderColor} ${feature.bgColor}`}
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-semibold text-gray-700">
                      {feature.feature2}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
