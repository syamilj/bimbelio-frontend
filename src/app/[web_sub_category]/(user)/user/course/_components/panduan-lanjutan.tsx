'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useGet } from '@/lib/fetch-helper/useGet';
import { getDateStringShort } from '@/lib/utils';
import { BlogPost } from '@/types/database';
import {
  BookOpenIcon,
  ChevronRightIcon,
  ClockIcon,
  ExternalLink,
  GraduationCap,
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
      {/* Section Header */}
      <div className="text-center space-y-4">
        <div
          className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center shadow-lg"
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
          <>
            {/* Scrollable Cards */}
            <ScrollArea className="w-full rounded-xl">
              <div className="flex gap-6 pb-6">
                {blogs.map((guide, index) => (
                  <Card
                    key={index}
                    className="w-[300px] md:w-[320px] shrink-0 bg-white shadow-lg border-0 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
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
                            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                            style={{ backgroundColor: `${mainColor}15` }}
                          >
                            <BookOpenIcon
                              className="w-6 h-6"
                              style={{ color: mainColor }}
                            />
                          </div>
                        </div>

                        <div className="text-center space-y-2">
                          <Badge
                            className="text-white border-0"
                            style={{ backgroundColor: mainColor }}
                          >
                            {guide.tags}
                          </Badge>
                          <CardTitle
                            className="text-lg font-bold leading-tight"
                            style={{ color: mainColor }}
                          >
                            {guide.title}
                          </CardTitle>
                        </div>
                      </div>
                      {/* Decorative elements */}
                      <div
                        className="absolute -right-6 -top-6 w-16 h-16 rounded-full opacity-10"
                        style={{ backgroundColor: mainColor }}
                      />
                    </CardHeader>

                    <CardContent className="p-6 space-y-4 flex flex-col h-full">
                      <div className="flex-1 space-y-3">
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                          {guide.description}
                        </p>

                        <div className="flex items-center justify-center">
                          <Badge
                            variant="secondary"
                            className="bg-gray-100 text-gray-600 hover:bg-gray-200"
                          >
                            <ClockIcon className="size-3 mr-1" />
                            {getDateStringShort(guide.publishedAt)}
                          </Badge>
                        </div>
                      </div>

                      <Link
                        href={`/blog/${guide.slug}`}
                        className="w-full"
                      >
                        <Button
                          variant="outline"
                          className="w-full group rounded-xl border-2 hover:shadow-sm transition-all"
                          style={{
                            borderColor: `${mainColor}30`,
                            color: mainColor,
                          }}
                        >
                          <span>Baca Artikel</span>
                          <ChevronRightIcon className="size-4 ml-2 transition-transform group-hover:translate-x-1" />
                          <ExternalLink className="size-3 ml-1 opacity-60" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

            {/* View All CTA */}
            <div className="text-center mt-8">
              <Link href="/blog">
                <Button
                  variant="outline"
                  className="rounded-xl border-2 px-8 py-3 hover:shadow-sm"
                  style={{
                    borderColor: `${mainColor}30`,
                    color: mainColor,
                  }}
                >
                  <BookOpenIcon className="w-4 h-4 mr-2" />
                  Lihat Semua Artikel
                  <ChevronRightIcon className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </>
        ) : (
          // Empty State
          <div className="text-center py-12">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center opacity-50"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <BookOpenIcon
                className="w-8 h-8"
                style={{ color: mainColor }}
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Belum Ada Artikel
            </h3>
            <p className="text-gray-500 text-sm">
              Artikel panduan akan segera tersedia untuk kamu
            </p>
          </div>
        )
      ) : (
        // Loading State
        <ScrollArea className="w-full rounded-xl">
          <div className="flex gap-6 pb-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={index}
                className="w-[300px] md:w-[320px] h-80 shrink-0 rounded-2xl"
              />
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
