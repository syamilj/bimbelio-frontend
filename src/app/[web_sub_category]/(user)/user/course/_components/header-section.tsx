'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useGet } from '@/lib/fetch-helper/useGet';
import { BookOpen, Clock, Flame, Target, TrendingUp, Zap } from 'lucide-react';

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
  } | null;
};

export default function HeaderSection() {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const { data: headingData, isLoading } = useGet<CourseHeading>(
    '/course/getCourseHeading',
  );

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

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
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white"
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
              {Math.round(
                (headingData.completedSubChapters /
                  headingData.totalSubChapters) *
                  100,
              ) || '-'}
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
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-5 text-center">
            <BookOpen className="w-5 h-5 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700">
              {headingData.completedSubChapters}/{headingData.totalSubChapters}
            </div>
            <p className="text-xs text-blue-600 font-medium mt-1">
              Sub Chapter
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-2xl p-5 text-center">
            <Flame className="w-5 h-5 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-700">
              {headingData.streak}
            </div>
            <p className="text-xs text-orange-600 font-medium mt-1">
              Hari Streak
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl p-5 text-center">
            <Clock className="w-5 h-5 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-700">
              {headingData.totalHours.toFixed(1)}
            </div>
            <p className="text-xs text-green-600 font-medium mt-1">Jam Total</p>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-pink-200 rounded-2xl p-5 text-center">
            <TrendingUp className="w-5 h-5 text-pink-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-pink-700">
              {headingData.tryoutResults?.score || '-'}
            </div>
            <p className="text-xs text-pink-600 font-medium mt-1">
              Nilai Terakhir
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-[120px] rounded-2xl"
            />
          ))}
        </div>
      )}
    </section>
  );
}
