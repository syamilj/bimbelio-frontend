'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useGet } from '@/lib/fetch-helper/useGet';
import { getDateStringShort } from '@/lib/utils';
import { BlogPost } from '@/types/database';
import {
  ArrowRight,
  BookOpenIcon,
  ChevronRightIcon,
  ClockIcon,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export default function PanduanLanjutanSection() {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const { data: blogs, isLoading } = useGet<BlogPost[]>(
    '/blog/getBlogLandingPage',
  );

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

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
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h2
            className="text-2xl md:text-3xl font-bold"
            style={{ color: mainColor }}
          >
            Panduan Lanjutan
          </h2>
        </div>
        <div
          className="w-20 h-1 mx-auto rounded-full"
          style={{ backgroundColor: secondaryColor }}
        />
        <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
          Pelajari panduan lengkap dan tingkatkan pemahaman kamu dengan
          artikel-artikel pilihan
        </p>
      </div>

      {/* Content */}
      {!isLoading ? (
        blogs && blogs.length > 0 ? (
          <div className="space-y-6">
            {/* Scrollable Cards */}
            <ScrollArea className="w-full rounded-xl">
              <div className="flex gap-6 pb-6">
                {blogs.map((guide, index) => (
                  <Card
                    key={index}
                    className="w-[300px] md:w-[340px] shrink-0 bg-white shadow-xl border-0 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 relative"
                  >
                    {/* Floating sparkle animation */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                      <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                    </div>

                    {/* Enhanced Header */}
                    <CardHeader
                      className="pb-6 relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${mainColor}12, ${secondaryColor}12)`,
                      }}
                    >
                      <div className="relative z-10 space-y-4">
                        {/* Icon */}
                        <div className="flex items-center justify-between">
                          <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300"
                            style={{
                              backgroundColor: `${mainColor}15`,
                              background: `linear-gradient(135deg, ${mainColor}20, ${secondaryColor}20)`,
                            }}
                          >
                            <BookOpenIcon
                              className="w-7 h-7"
                              style={{ color: mainColor }}
                            />
                          </div>
                          {/* Tag Badge */}
                          <Badge
                            className="text-white border-0 text-xs font-bold"
                            style={{
                              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                            }}
                          >
                            {guide.tags}
                          </Badge>
                        </div>

                        {/* Title */}
                        <CardTitle
                          className="text-base font-bold leading-tight group-hover:scale-105 transition-transform origin-left"
                          style={{ color: mainColor }}
                        >
                          {guide.title}
                        </CardTitle>
                      </div>

                      {/* Decorative elements */}
                      <div
                        className="absolute -right-8 -top-8 w-20 h-20 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
                        style={{ backgroundColor: mainColor }}
                      />
                      <div
                        className="absolute -left-6 -bottom-6 w-16 h-16 rounded-full opacity-5 group-hover:opacity-10 transition-opacity"
                        style={{ backgroundColor: secondaryColor }}
                      />
                    </CardHeader>

                    <CardContent className="p-6 space-y-4 flex flex-col h-full relative">
                      {/* Description */}
                      <div className="flex-1 space-y-4">
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 group-hover:text-gray-700 transition-colors">
                          {guide.description}
                        </p>

                        {/* Date Badge */}
                        <div
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gray-600 transition-all group-hover:shadow-md"
                          style={{
                            backgroundColor: `${mainColor}08`,
                          }}
                        >
                          <ClockIcon className="size-3.5" />
                          {getDateStringShort(guide.publishedAt)}
                        </div>
                      </div>

                      {/* CTA Button */}
                      <Link
                        href={`/blog/${guide.slug}`}
                        className="w-full"
                      >
                        <button
                          className="w-full py-2.5 px-3 rounded-lg font-medium text-sm text-white transition-all duration-300 hover:shadow-lg flex items-center justify-between"
                          style={{
                            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                          }}
                        >
                          <span>Baca Artikel</span>
                          <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </Link>

                      {/* Bottom accent line */}
                      <div
                        className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500"
                        style={{ backgroundColor: mainColor }}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

            {/* View All CTA - Enhanced */}
            <div className="text-center mt-8">
              <Link href="/blog">
                <button
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-medium text-sm transition-all duration-300 hover:shadow-lg"
                  style={{
                    backgroundColor: `${mainColor}10`,
                    color: mainColor,
                    border: `2px solid ${mainColor}20`,
                  }}
                >
                  <BookOpenIcon className="w-4 h-4" />
                  Lihat Semua Artikel
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        ) : (
          // Empty State - Enhanced
          <div
            className="text-center py-16 rounded-2xl"
            style={{ backgroundColor: `${mainColor}08` }}
          >
            <div
              className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center"
              style={{
                backgroundColor: `${mainColor}15`,
              }}
            >
              <BookOpenIcon
                className="w-10 h-10"
                style={{ color: mainColor }}
              />
            </div>
            <h3
              className="text-lg font-bold mb-2"
              style={{ color: mainColor }}
            >
              Belum Ada Artikel
            </h3>
            <p className="text-gray-600 text-sm max-w-sm mx-auto">
              Artikel panduan akan segera tersedia untuk kamu. Tetap pantau
              halaman ini!
            </p>
          </div>
        )
      ) : (
        // Loading State - Enhanced
        <ScrollArea className="w-full rounded-xl">
          <div className="flex gap-6 pb-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="w-[300px] md:w-[340px] shrink-0"
              >
                <Skeleton className="w-full h-80 rounded-2xl" />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </section>
  );
}

// const guides = [
//   {
//     icon: <BrainCircuitIcon className="size-5 text-main" />,
//     title: 'Teknik Eliminasi TPU',
//     category: 'Teknik & Strategi',
//     description:
//       'Pelajari cara eliminasi jawaban dengan cepat dan akurat untuk soal TPU',
//     time: '15 menit',
//   },
//   {
//     icon: <BookIcon className="size-5 text-main" />,
//     title: 'Konsep Matematika SNBT',
//     category: 'Matematika',
//     description:
//       'Pahami konsep-konsep kunci matematika yang sering muncul di SNBT',
//     time: '20 menit',
//   },
//   {
//     icon: <TimerIcon className="size-5 text-main" />,
//     title: 'Speed Reading',
//     category: 'Teknik Membaca',
//     description: 'Tingkatkan kecepatan membaca tanpa mengurangi pemahaman',
//     time: '10 menit',
//   },
//   {
//     icon: <TargetIcon className="size-5 text-main" />,
//     title: 'Strategi Penalaran',
//     category: 'Teknik & Strategi',
//     description: 'Kuasai cara menganalisis dan memecahkan soal penalaran',
//     time: '25 menit',
//   },
//   {
//     icon: <BookOpenIcon className="size-5 text-main" />,
//     title: 'Persiapan Mental',
//     category: 'Persiapan Ujian',
//     description: 'Tips mengelola stres dan anxiety menjelang ujian',
//     time: '15 menit',
//   },
// ];
