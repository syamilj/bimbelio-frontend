'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useGet } from '@/lib/fetch-helper/useGet';
import { Award, BookOpen, Clock, Flame, Target, TrendingUp, Zap } from 'lucide-react';

type CourseHeading = {
  id: number;
  title: string;
  description: string;
  completedSubChapters: number;
  totalSubChapters: number;
  streak: number;
  totalHours: number;
  tryoutResults: {
    score: number;
    rank: number;
    previousRank: number | null;
  } | null;
  targetValue: number | null;
  gapFromTarget: number | null;
};

export default function HeaderSection() {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const { data: headingData, isLoading } = useGet<CourseHeading>(
    '/course/getCourseHeading',
  );

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  // const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  return (
    <section className="mb-6 md:mb-8">
      {/* Combined Welcome + Progress Card with Diagonal Line */}
      {!isLoading && headingData ? (
        <div className="relative bg-white border-2 border-gray-100 rounded-3xl md:rounded-3xl p-4 md:p-8 shadow-sm hover:shadow-md transition-all mb-4 md:mb-6 overflow-hidden">
          {/* Diagonal Line */}
          <div
            className="absolute top-0 right-0 w-2/5 md:w-1/3 h-full"
            style={{
              background: `linear-gradient(135deg, transparent 0%, transparent 50%, ${mainColor}08 50%, ${mainColor}12 100%)`
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
            {/* Welcome Section */}
            <div className="flex-1 w-full">
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-11 h-11 md:w-14 md:h-14 rounded-3xl md:rounded-3xl flex items-center justify-center text-white flex-shrink-0"
                  style={{ backgroundColor: mainColor }}
                >
                  <BookOpen className="w-5 h-5 md:w-7 md:h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-600 text-xs font-medium mb-0.5">
                    Selamat Belajar,
                  </p>
                  <h1
                    className="text-xl md:text-3xl font-black leading-tight truncate"
                    style={{ color: mainColor }}
                  >
                    {session?.user?.name || 'User'}
                  </h1>
                </div>
              </div>
              <p className="text-gray-600 text-xs md:text-base mb-3 leading-relaxed">
                Lanjutkan perjalanan belajarmu dan raih target yang kamu impikan!
              </p>
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                <Badge className="bg-blue-50 text-blue-700 border border-blue-200 font-medium px-2 py-0.5 text-xs">
                  <Zap className="w-2.5 h-2.5 mr-1" />
                  Terus Semangat!
                </Badge>
                <Badge className="bg-green-50 text-green-700 border border-green-200 font-medium px-2 py-0.5 text-xs">
                  <TrendingUp className="w-2.5 h-2.5 mr-1" />
                  Tingkatkan Pemahaman
                </Badge>
              </div>
            </div>

            {/* Progress Section */}
            <div className="flex items-center gap-3 md:gap-8 self-center">
              {/* Circular Progress */}
              <div className="relative flex-shrink-0">
                <svg className="w-20 h-20 md:w-28 md:h-28 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="text-gray-200"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    strokeWidth="8"
                    stroke={mainColor}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${(headingData.totalSubChapters > 0 ? Math.min(100, Math.round((headingData.completedSubChapters / headingData.totalSubChapters) * 100)) : 0) * 2.51}, 251`}
                    style={{
                      filter: `drop-shadow(0 2px 8px ${mainColor}40)`
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <div className="text-2xl md:text-4xl font-black" style={{ color: mainColor }}>
                    {headingData.totalSubChapters > 0
                      ? Math.min(
                          100,
                          Math.round(
                            (headingData.completedSubChapters /
                              headingData.totalSubChapters) *
                              100,
                          ),
                        )
                      : 0}
                    <span className="text-sm md:text-lg">%</span>
                  </div>
                </div>
              </div>

              {/* Progress Text - Hidden on Mobile, Show on Tablet+ */}
              <div className="hidden lg:block">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5" style={{ color: mainColor }} />
                  <p className="font-bold" style={{ color: mainColor }}>Progress Kamu</p>
                </div>
                <p className="text-sm text-gray-600">
                  {headingData.completedSubChapters} dari{' '}
                  {headingData.totalSubChapters} sub chapter selesai
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Skeleton className="h-40 md:h-56 rounded-3xl md:rounded-3xl mb-4 md:mb-6" />
      )}

      {/* Mobile Progress Text */}
      {!isLoading && headingData && (
        <div className="lg:hidden text-center mb-4 md:mb-6 text-xs md:text-sm text-gray-600">
          {headingData.completedSubChapters} dari {headingData.totalSubChapters} sub chapter selesai
        </div>
      )}

      {/* Horizontal Scroll Stats - Hide scrollbar but keep functionality */}
      {!isLoading && headingData ? (
        <div className="relative">
          <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            <div className="flex gap-3 md:grid md:grid-cols-5 md:gap-4 min-w-max md:min-w-0">
          {/* Sub Chapter */}
          <div className="group bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 border-2 border-blue-200 rounded-3xl md:rounded-3xl p-4 md:p-6 text-center relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 flex-shrink-0 w-40 md:w-auto">
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg md:rounded-3xl flex items-center justify-center mx-auto mb-2 md:mb-3 group-hover:bg-blue-200 transition-colors">
                <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
              <div className="text-2xl md:text-3xl font-black text-blue-700 mb-1">
                {headingData.completedSubChapters}<span className="text-base md:text-lg text-blue-400">/{headingData.totalSubChapters}</span>
              </div>
              <p className="text-[10px] md:text-xs text-blue-600 font-semibold">
                Sub Chapter
              </p>
              <div className="mt-2 md:mt-3 w-full bg-blue-200 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.round((headingData.completedSubChapters / headingData.totalSubChapters) * 100))}%`
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Nilai TO Terakhir + Gap Target */}
          <div className="group bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-purple-100 border-2 border-purple-200 rounded-3xl md:rounded-3xl p-4 md:p-6 text-center relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 flex-shrink-0 w-40 md:w-auto">
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-gradient-to-br from-purple-400/10 to-purple-600/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-lg md:rounded-3xl flex items-center justify-center mx-auto mb-2 md:mb-3 group-hover:bg-purple-200 transition-colors">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
              </div>
              <div className="flex items-baseline justify-center gap-1.5 md:gap-2 mb-1">
                <div className="text-2xl md:text-3xl font-black text-purple-700">
                  {headingData.tryoutResults?.score || '-'}
                </div>
                {headingData.gapFromTarget !== null && headingData.targetValue && (
                  <div className={`text-xs md:text-lg font-bold px-1.5 md:px-2 py-0.5 rounded-lg ${
                    headingData.gapFromTarget >= 0
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {headingData.gapFromTarget >= 0 ? '+' : ''}{headingData.gapFromTarget}
                  </div>
                )}
              </div>
              <p className="text-[10px] md:text-xs text-purple-600 font-semibold">
                Nilai TO Terakhir
              </p>
              {headingData.targetValue && (
                <p className="text-[9px] md:text-[10px] text-purple-500 mt-1.5 md:mt-2">
                  Target: <span className="font-bold">{headingData.targetValue}</span>
                </p>
              )}
            </div>
          </div>

          {/* Peringkat TO */}
          <div className="group bg-white hover:bg-gradient-to-br hover:from-amber-50 hover:to-amber-100 border-2 border-amber-200 rounded-3xl md:rounded-3xl p-4 md:p-6 text-center relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 flex-shrink-0 w-40 md:w-auto">
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-gradient-to-br from-amber-400/10 to-amber-600/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-100 rounded-lg md:rounded-3xl flex items-center justify-center mx-auto mb-2 md:mb-3 group-hover:bg-amber-200 transition-colors">
                <Award className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
              </div>
              <div className="text-2xl md:text-3xl font-black text-amber-700 mb-1">
                {headingData.tryoutResults?.rank ? `#${headingData.tryoutResults.rank}` : '-'}
              </div>
              <p className="text-[10px] md:text-xs text-amber-600 font-semibold">
                Peringkat TO
              </p>
              {headingData.tryoutResults?.previousRank && (
                <div className="mt-1.5 md:mt-2 flex items-center justify-center gap-1 text-[9px] md:text-[10px]">
                  <span className="text-amber-500">Sebelumnya:</span>
                  <span className="font-bold text-amber-600">#{headingData.tryoutResults.previousRank}</span>
                  {headingData.tryoutResults.rank < headingData.tryoutResults.previousRank && (
                    <span className="text-green-600 font-bold">↑</span>
                  )}
                  {headingData.tryoutResults.rank > headingData.tryoutResults.previousRank && (
                    <span className="text-red-600 font-bold">↓</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Hari Streak */}
          <div className="group bg-white hover:bg-gradient-to-br hover:from-orange-50 hover:to-orange-100 border-2 border-orange-200 rounded-3xl md:rounded-3xl p-4 md:p-6 text-center relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 flex-shrink-0 w-40 md:w-auto">
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-gradient-to-br from-orange-400/10 to-orange-600/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-lg md:rounded-3xl flex items-center justify-center mx-auto mb-2 md:mb-3 group-hover:bg-orange-200 transition-colors">
                <Flame className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
              </div>
              <div className="text-2xl md:text-3xl font-black text-orange-700 mb-1">
                {headingData.streak}
              </div>
              <p className="text-[10px] md:text-xs text-orange-600 font-semibold">
                Hari Streak
              </p>
              <p className="text-[9px] md:text-[10px] text-orange-500 mt-1.5 md:mt-2">
                🔥 Keep it up!
              </p>
            </div>
          </div>

          {/* Jam Total */}
          <div className="group bg-white hover:bg-gradient-to-br hover:from-green-50 hover:to-green-100 border-2 border-green-200 rounded-3xl md:rounded-3xl p-4 md:p-6 text-center relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 flex-shrink-0 w-40 md:w-auto">
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-gradient-to-br from-green-400/10 to-green-600/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg md:rounded-3xl flex items-center justify-center mx-auto mb-2 md:mb-3 group-hover:bg-green-200 transition-colors">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
              </div>
              <div className="text-2xl md:text-3xl font-black text-green-700 mb-1">
                {headingData.totalHours.toFixed(1)}
              </div>
              <p className="text-[10px] md:text-xs text-green-600 font-semibold">Jam Total</p>
              <p className="text-[9px] md:text-[10px] text-green-500 mt-1.5 md:mt-2">
                Time invested
              </p>
            </div>
          </div>

            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex gap-3 md:grid md:grid-cols-5 md:gap-4 min-w-max md:min-w-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-[140px] md:h-[160px] rounded-3xl md:rounded-3xl flex-shrink-0 w-40 md:w-auto"
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
