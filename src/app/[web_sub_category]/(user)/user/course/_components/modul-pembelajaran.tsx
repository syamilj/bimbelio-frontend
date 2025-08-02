'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { website_sub_category_id_params } from '@/hooks/use-web-sub-category-id';
import { useGet } from '@/lib/fetch-helper/useGet';
import { TypeCourseEnum } from '@/types/database';

import {
  ArrowRightIcon,
  BrainCircuitIcon,
  CheckCircleIcon,
  CheckIcon,
  ClockIcon,
  FileQuestionIcon,
  ForwardIcon,
  ListIcon,
  Loader2,
  PlayIcon,
  SparklesIcon,
  StarIcon,
  TrendingUpIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type TypeData = {
  id: string;
  name: string;
  CourseChapter: {
    isDone: boolean;
    title: string;
    CourseSubChapter: ({
      CourseProgress: {
        website_sub_category_id: string;
        id: string;
        createdAt: Date;
        userId: string;
        courseSubChapterId: string;
        totalScore: number | null;
      }[];
    } & {
      number: number;
      website_sub_category_id: string;
      id: string;
      title: string;
      description: string;
      courseChapterId: string;
      spendTime: number;
      type: TypeCourseEnum;
      premium: boolean;
      tryoutSessionId: string | null;
      video: string | null;
      document: string | null;
      materi: string | null;
    })[];
  }[];
  totalChapters: number;
  completedChapters: number;
  percentageProgress: number;
  totalSpendTime: number;
  totalTryout: number;
}[];

export default function ModulPembelajaranSection() {
  const router = useRouter();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const { data: CategoryCard, isLoading } = useGet<TypeData>(
    '/course/getCategoryForCard',
  );
  const [loadingCourseId, setLoadingCourseId] = useState<string | null>(null);

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const handleStartCourse = (categoryId: string) => {
    setLoadingCourseId(categoryId);
    // Add a small delay for better UX feedback
    setTimeout(() => {
      router.push(
        `/${website_sub_category_id_params}/user/course/${categoryId}?start=true`,
      );
    }, 300);
  };

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
          <BrainCircuitIcon className="w-6 h-6 text-white" />
        </div>
        <h2
          className="text-2xl md:text-3xl font-bold"
          style={{ color: mainColor }}
        >
          Modul Belajar
        </h2>
        <div
          className="w-20 h-1 mx-auto rounded-full"
          style={{ backgroundColor: secondaryColor }}
        />
        <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
          Mau mulai dari mana dulu? Yuk, pilih modul di bawah!
        </p>
      </div>

      {/* Module Cards */}
      {!isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CategoryCard?.map((category, index) => {
            const getActionButton = () => {
              if (category.completedChapters === 0) {
                return (
                  <Button
                    size="sm"
                    onClick={() => handleStartCourse(category.id)}
                    disabled={loadingCourseId === category.id}
                    className="flex-1 w-full rounded-xl text-white border-0 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                    style={{
                      background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                    }}
                  >
                    {loadingCourseId === category.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Memuat...
                      </>
                    ) : (
                      <>
                        <PlayIcon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                        Mulai Belajar
                      </>
                    )}
                  </Button>
                );
              } else if (
                category.completedChapters === category.totalChapters
              ) {
                return (
                  <Link
                    href={`/${website_sub_category_id_params}/user/course/${category.id}`}
                    className="flex-1"
                  >
                    <Button
                      size="sm"
                      className="w-full rounded-xl bg-linear-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 border-0 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      <CheckIcon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                      Selesai
                    </Button>
                  </Link>
                );
              } else {
                return (
                  <Link
                    href={`/${website_sub_category_id_params}/user/course/${category.id}`}
                    className="flex-1"
                  >
                    <Button
                      size="sm"
                      className="w-full rounded-xl bg-linear-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 border-0 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      <ForwardIcon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                      Lanjutkan
                    </Button>
                  </Link>
                );
              }
            };

            const getStatusBadge = () => {
              if (category.completedChapters === 0) {
                return (
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200 font-medium">
                    <PlayIcon className="w-3 h-3 mr-1" />
                    Belum Dimulai
                  </Badge>
                );
              } else if (
                category.completedChapters === category.totalChapters
              ) {
                return (
                  <Badge className="bg-green-100 text-green-700 border-green-200 font-medium">
                    <CheckCircleIcon className="w-3 h-3 mr-1" />
                    Selesai
                  </Badge>
                );
              } else {
                return (
                  <Badge className="bg-amber-100 text-amber-700 border-amber-200 font-medium">
                    <TrendingUpIcon className="w-3 h-3 mr-1" />
                    Berlangsung
                  </Badge>
                );
              }
            };

            return (
              <Card
                key={category.id}
                className="group bg-white shadow-lg border-0 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative"
                style={{
                  background: `linear-gradient(135deg, #ffffff 0%, ${mainColor}02 100%)`,
                }}
              >
                {/* Floating particles animation */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <SparklesIcon
                    className="w-4 h-4 animate-pulse text-yellow-400"
                    style={{ animationDelay: '0ms' }}
                  />
                </div>
                <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <SparklesIcon
                    className="w-3 h-3 animate-pulse text-yellow-300"
                    style={{ animationDelay: '300ms' }}
                  />
                </div>
                <div className="absolute top-6 right-12 opacity-0 group-hover:opacity-100 transition-opacity duration-600">
                  <SparklesIcon
                    className="w-2 h-2 animate-pulse text-yellow-500"
                    style={{ animationDelay: '600ms' }}
                  />
                </div>

                {/* Progress ring indicator */}
                <div className="absolute -top-3 -right-3 z-20">
                  <div className="relative w-12 h-12">
                    <svg
                      className="w-12 h-12 transform -rotate-90"
                      viewBox="0 0 36 36"
                    >
                      <path
                        className="text-gray-200"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="transparent"
                        strokeDasharray="100, 100"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="transition-all duration-1000 group-hover:animate-pulse"
                        stroke={mainColor}
                        strokeWidth="3"
                        fill="transparent"
                        strokeDasharray={`${category.percentageProgress}, 100`}
                        strokeLinecap="round"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className="text-xs font-bold"
                        style={{ color: mainColor }}
                      >
                        {category.percentageProgress}%
                      </span>
                    </div>
                  </div>
                </div>

                <CardHeader className="pb-4 relative overflow-hidden border-b border-gray-50">
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300"
                          style={{
                            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                          }}
                        >
                          <BrainCircuitIcon className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getStatusBadge()}
                          </div>
                          <CardTitle
                            className="text-lg font-bold leading-tight group-hover:scale-105 transition-transform duration-300 origin-left"
                            style={{ color: mainColor }}
                          >
                            {category.name}
                          </CardTitle>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed">
                      Tingkatkan kemampuan berpikir logis dan analitis untuk
                      menghadapi tantangan SNBT
                    </p>
                  </div>

                  {/* Animated background gradient */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                    }}
                  />
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  {/* Enhanced Progress Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">
                        Progress Belajar
                      </span>
                      <span
                        className="text-sm font-bold px-2 py-1 rounded-lg"
                        style={{
                          backgroundColor: `${mainColor}15`,
                          color: mainColor,
                        }}
                      >
                        {category.completedChapters}/{category.totalChapters}{' '}
                        Chapter
                      </span>
                    </div>

                    <div className="relative">
                      <Progress
                        value={category.percentageProgress}
                        className="h-3 rounded-full bg-gray-100 overflow-hidden"
                      />
                      <div
                        className="absolute inset-0 h-3 rounded-full transition-all duration-1000 group-hover:animate-pulse"
                        style={{
                          background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
                          width: `${category.percentageProgress}%`,
                        }}
                      />
                      {/* Shine effect */}
                      <div className="absolute inset-0 h-3 rounded-full overflow-hidden">
                        <div
                          className="h-full w-full bg-linear-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 group-hover:animate-shimmer"
                          style={{
                            transform: 'translateX(-100%) skewX(-12deg)',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="group/stat p-4 rounded-xl bg-linear-to-br from-blue-50 to-blue-100 border border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover/stat:scale-110 transition-transform">
                          <ClockIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-blue-700">
                            {category.totalSpendTime / 60 < 1
                              ? `${category.totalSpendTime} Min`
                              : `${(category.totalSpendTime / 60).toFixed(1)} Jam`}
                          </div>
                          <div className="text-xs text-blue-600">
                            Estimasi Waktu
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="group/stat p-4 rounded-xl bg-linear-to-br from-green-50 to-green-100 border border-green-200 hover:from-green-100 hover:to-green-200 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg group-hover/stat:scale-110 transition-transform">
                          <FileQuestionIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-green-700">
                            {category.totalTryout} Quiz
                          </div>
                          <div className="text-xs text-green-600">
                            Latihan Soal
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Achievement badges */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      {category.percentageProgress >= 25 && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-100 text-yellow-700 text-xs font-medium">
                          <StarIcon className="w-3 h-3" />
                          25%
                        </div>
                      )}
                      {category.percentageProgress >= 50 && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-orange-100 text-orange-700 text-xs font-medium">
                          <StarIcon className="w-3 h-3" />
                          50%
                        </div>
                      )}
                      {category.percentageProgress >= 75 && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-100 text-purple-700 text-xs font-medium">
                          <StarIcon className="w-3 h-3" />
                          75%
                        </div>
                      )}
                      {category.percentageProgress === 100 && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-medium animate-pulse">
                          <CheckCircleIcon className="w-3 h-3" />
                          Complete
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    {/* Enhanced Detail Dialog */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl border-2 hover:shadow-lg transition-all duration-300 group/btn"
                          style={{
                            borderColor: `${mainColor}30`,
                            color: mainColor,
                          }}
                        >
                          <ListIcon className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                          Detail
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-[600px] w-[95%] mx-auto rounded-2xl">
                        <DialogHeader className="space-y-3 pb-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                              style={{
                                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                              }}
                            >
                              <BrainCircuitIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <DialogTitle
                                className="text-xl"
                                style={{ color: mainColor }}
                              >
                                {category.name}
                              </DialogTitle>
                              <DialogDescription className="text-sm">
                                {category.completedChapters}/
                                {category.totalChapters} Chapter Selesai
                              </DialogDescription>
                            </div>
                          </div>
                        </DialogHeader>

                        {/* Dialog Body */}
                        <div className="space-y-4">
                          {/* Progress Detail */}
                          <div className="space-y-2">
                            <Progress
                              value={category.percentageProgress}
                              className="h-3"
                            />
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>
                                {category.percentageProgress}% Selesai
                              </span>
                              <span>
                                {category.totalChapters -
                                  category.completedChapters}{' '}
                                chapter tersisa
                              </span>
                            </div>
                          </div>

                          {/* Chapter List */}
                          <ScrollArea className="h-[300px] pr-3">
                            <div className="space-y-2">
                              {category.CourseChapter.map((chapter, i) => (
                                <div
                                  key={i}
                                  className="p-3 rounded-xl border-2 border-gray-100 hover:border-gray-200 transition-all cursor-pointer hover:shadow-sm"
                                  onClick={() => {
                                    if (chapter.CourseSubChapter.length > 0) {
                                      router.push(
                                        `/${website_sub_category_id_params}/user/course/${category.id}?sub=${chapter.CourseSubChapter[0].id}&tab=chat`,
                                      );
                                    }
                                  }}
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                                      style={{ backgroundColor: mainColor }}
                                    >
                                      {i + 1}
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-sm">
                                        {chapter.title}
                                      </h4>
                                      <p className="text-xs">
                                        {chapter.isDone ? (
                                          <span className="text-green-600 font-medium">
                                            ✓ Selesai
                                          </span>
                                        ) : (
                                          <span className="text-gray-500">
                                            Belum Dimulai
                                          </span>
                                        )}
                                      </p>
                                    </div>
                                    {chapter.isDone && (
                                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>

                        {/* Dialog Footer */}
                        <DialogFooter className="mt-6">
                          <Button
                            className="w-full text-sm rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300"
                            style={{
                              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                            }}
                            onClick={() => {
                              if (category.completedChapters === 0) {
                                // If no progress, go to start flow
                                router.push(
                                  `/${website_sub_category_id_params}/user/course/${category.id}?start=true`,
                                );
                              } else {
                                // If has progress, go to first incomplete chapter
                                const firstIncompleteChapter =
                                  category.CourseChapter.find(
                                    (chapter) => !chapter.isDone,
                                  );
                                if (
                                  firstIncompleteChapter &&
                                  firstIncompleteChapter.CourseSubChapter
                                    .length > 0
                                ) {
                                  router.push(
                                    `/${website_sub_category_id_params}/user/course/${category.id}?sub=${firstIncompleteChapter.CourseSubChapter[0].id}&tab=chat`,
                                  );
                                } else {
                                  router.push(
                                    `/${website_sub_category_id_params}/user/course/${category.id}`,
                                  );
                                }
                              }
                            }}
                          >
                            {category.completedChapters === 0
                              ? 'Mulai Belajar'
                              : 'Lanjutkan Belajar'}
                            <ArrowRightIcon className="w-4 h-4 ml-2" />
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* Enhanced Action Button */}
                    {getActionButton()}
                  </div>
                </CardContent>

                {/* Hover glow effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none rounded-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                    filter: 'blur(20px)',
                  }}
                />
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-96 rounded-2xl"
            />
          ))}
        </div>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
