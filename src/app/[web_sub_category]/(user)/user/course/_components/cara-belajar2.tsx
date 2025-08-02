'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { pixel } from '@/lib/pixel/_core';
import {
  BotMessageSquareIcon,
  ChartColumnIcon,
  FileTextIcon,
  NotepadTextIcon,
  Sparkles,
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
  },
  {
    icon: <NotepadTextIcon className="size-6 text-white" />,
    title: 'Note AI',
    description:
      'Buat dan kelola catatan dengan bantuan AI untuk pembelajaran yang lebih efektif',
    gradient: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  {
    icon: <FileTextIcon className="size-6 text-white" />,
    title: 'Quiz AI',
    description:
      'Latihan soal yang menyesuaikan dengan tingkat kemampuan dan perkembanganmu',
    gradient: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  {
    icon: <ChartColumnIcon className="size-6 text-white" />,
    title: 'Laporan Belajar',
    description:
      'Pantau perkembangan belajarmu dengan laporan dan analisis detail',
    gradient: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
];

export default function CaraBelajarSection2() {
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';
  useEffect(() => {
    pixel.meta.track('ViewContent', { content_name: 'Course Page' });
    pixel.tiktok.track('ViewContent', { content_name: 'Course Page' });
  }, []);

  return (
    <section className="space-y-6 pt-8">
      {/* Section Header */}
      <div className="text-center space-y-4">
        <div
          className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center shadow-lg"
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
        <div
          className="w-20 h-1 mx-auto rounded-full"
          style={{ backgroundColor: secondaryColor }}
        />
        <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
          Manfaatkan teknologi AI terdepan untuk pengalaman belajar yang lebih
          optimal
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {supportFeatures.map((feature, index) => (
          <Card
            key={index}
            className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
          >
            <CardHeader
              className="pb-4 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
              }}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-linear-to-br ${feature.gradient}`}
                  >
                    {feature.icon}
                  </div>
                </div>
                <CardTitle
                  className="text-lg font-bold text-center"
                  style={{ color: mainColor }}
                >
                  {feature.title}
                </CardTitle>
              </div>
              {/* Decorative elements */}
              <div
                className="absolute -right-4 -top-4 w-12 h-12 rounded-full opacity-10"
                style={{ backgroundColor: mainColor }}
              />
            </CardHeader>

            <CardContent className="p-6 text-center">
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Feature highlight */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `${mainColor}15`,
                    color: mainColor,
                  }}
                >
                  <Sparkles className="w-3 h-3" />
                  AI Powered
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom CTA */}
      <div
        className="mt-8 p-6 rounded-2xl text-center"
        style={{
          background: `linear-gradient(135deg, ${mainColor}10, ${secondaryColor}10)`,
        }}
      >
        <h3
          className="text-lg font-bold mb-2"
          style={{ color: mainColor }}
        >
          Siap untuk Pengalaman Belajar yang Lebih Canggih?
        </h3>
        <p className="text-gray-600 text-sm">
          Semua fitur AI ini dirancang khusus untuk membantu kamu meraih target
          SNBT impian
        </p>
      </div>
    </section>
  );
}
