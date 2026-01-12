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
    <section className="mb-12">
      {/* Modern Header Section - Card Style */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-8">
        {/* Welcome Card */}
        <div className="md:col-span-2 bg-white border-2 border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">
                Selamat Belajar,
              </p>
              <h1
                className="text-3xl md:text-4xl font-black"
                style={{ color: mainColor }}
              >
                {session?.user?.name || 'User'}
              </h1>
            </div>
            <div
              className="w-16 h-16 rounded-3xl flex items-center justify-center text-white"
              style={{ backgroundColor: mainColor }}
            >
              <BookOpen className="w-8 h-8" />
            </div>
          </div>
          <p className="text-gray-600 text-base">
            Lanjutkan perjalanan belajarmu dan raih target yang kamu impikan!
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Badge className="bg-blue-50 text-blue-700 border border-blue-200 font-medium px-4 py-2">
              <Zap className="w-3 h-3 mr-2" />
              Terus Semangat!
            </Badge>
            <Badge className="bg-green-50 text-green-700 border border-green-200 font-medium px-4 py-2">
              <TrendingUp className="w-3 h-3 mr-2" />
              Tingkatkan Pemahaman
            </Badge>
          </div>
        </div>

        {/* Progress Card */}
        {!isLoading && headingData ? (
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-purple-600" />
              <p className="text-purple-700 font-bold">Progress Kamu</p>
            </div>
            <div className="text-4xl font-black text-purple-700 mb-2">
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
              %
            </div>
            <p className="text-sm text-purple-600">
              {headingData.completedSubChapters} dari{' '}
              {headingData.totalSubChapters} sub chapter selesai
            </p>
          </div>
        ) : (
          <Skeleton className="h-full rounded-3xl" />
        )}
      </div>

      {/* Quick Stats Grid */}
      {!isLoading && headingData ? (
        <div className="grid gap-4 md:grid-cols-5 grid-cols-2">
          {/* Sub Chapter */}
          <div className="group bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 border-2 border-blue-200 rounded-3xl p-6 text-center relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105">
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-3xl font-black text-blue-700 mb-1">
                {headingData.completedSubChapters}<span className="text-lg text-blue-400">/{headingData.totalSubChapters}</span>
              </div>
              <p className="text-xs text-blue-600 font-semibold">
                Sub Chapter
              </p>
              <div className="mt-3 w-full bg-blue-200 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.round((headingData.completedSubChapters / headingData.totalSubChapters) * 100))}%`
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Hari Streak */}
          <div className="group bg-white hover:bg-gradient-to-br hover:from-orange-50 hover:to-orange-100 border-2 border-orange-200 rounded-3xl p-6 text-center relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105">
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-gradient-to-br from-orange-400/10 to-orange-600/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-200 transition-colors">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-3xl font-black text-orange-700 mb-1">
                {headingData.streak}
              </div>
              <p className="text-xs text-orange-600 font-semibold">
                Hari Streak
              </p>
              <p className="text-[10px] text-orange-500 mt-2">
                🔥 Keep it up!
              </p>
            </div>
          </div>

          {/* Jam Total */}
          <div className="group bg-white hover:bg-gradient-to-br hover:from-green-50 hover:to-green-100 border-2 border-green-200 rounded-3xl p-6 text-center relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105">
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-gradient-to-br from-green-400/10 to-green-600/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 transition-colors">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-3xl font-black text-green-700 mb-1">
                {headingData.totalHours.toFixed(1)}
              </div>
              <p className="text-xs text-green-600 font-semibold">Jam Total</p>
              <p className="text-[10px] text-green-500 mt-2">
                Time invested
              </p>
            </div>
          </div>

          {/* Nilai TO Terakhir + Gap Target */}
          <div className="group bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-purple-100 border-2 border-purple-200 rounded-3xl p-6 text-center relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105">
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-gradient-to-br from-purple-400/10 to-purple-600/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition-colors">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex items-baseline justify-center gap-2 mb-1">
                <div className="text-3xl font-black text-purple-700">
                  {headingData.tryoutResults?.score || '-'}
                </div>
                {headingData.gapFromTarget !== null && headingData.targetValue && (
                  <div className={`text-lg font-bold px-2 py-0.5 rounded-lg ${
                    headingData.gapFromTarget >= 0
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {headingData.gapFromTarget >= 0 ? '+' : ''}{headingData.gapFromTarget}
                  </div>
                )}
              </div>
              <p className="text-xs text-purple-600 font-semibold">
                Nilai TO Terakhir
              </p>
              {headingData.targetValue && (
                <p className="text-[10px] text-purple-500 mt-2">
                  Target: <span className="font-bold">{headingData.targetValue}</span>
                </p>
              )}
            </div>
          </div>

          {/* Peringkat TO */}
          <div className="group bg-white hover:bg-gradient-to-br hover:from-amber-50 hover:to-amber-100 border-2 border-amber-200 rounded-3xl p-6 text-center relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105">
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-gradient-to-br from-amber-400/10 to-amber-600/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-amber-200 transition-colors">
                <Award className="w-6 h-6 text-amber-600" />
              </div>
              <div className="text-3xl font-black text-amber-700 mb-1">
                {headingData.tryoutResults?.rank ? `#${headingData.tryoutResults.rank}` : '-'}
              </div>
              <p className="text-xs text-amber-600 font-semibold">
                Peringkat TO
              </p>
              {headingData.tryoutResults?.previousRank && (
                <div className="mt-2 flex items-center justify-center gap-1 text-[10px]">
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


        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-[160px] rounded-3xl"
            />
          ))}
        </div>
      )}
    </section>
  );
}
