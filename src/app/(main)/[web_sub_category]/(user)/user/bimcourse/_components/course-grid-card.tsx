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
import { website_sub_category_id_params } from '@/hooks/use-web-sub-category-id';
import {
  ArrowRightIcon,
  BookOpenIcon,
  CheckCircleIcon,
  CheckIcon,
  ClockIcon,
  FileQuestionIcon,
  ForwardIcon,
  ListIcon,
  Loader2,
  PlayIcon,
  TrendingUpIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DetailContent } from './detail-content';
import type { TypeData } from './modul-types';

type CourseGridCardProps = {
  category: TypeData[0];
  loadingCourseId: string | null;
  onStartCourse: (categoryId: string) => void;
  mainColor: string;
};

export function CourseGridCard({
  category,
  loadingCourseId,
  onStartCourse,
  mainColor,
}: CourseGridCardProps) {
  const router = useRouter();

  const getActionButton = () => {
    if (category.completedChapters === 0) {
      return (
        <Button
          size="sm"
          onClick={() => onStartCourse(category.id)}
          disabled={loadingCourseId === category.id}
          className="w-full rounded-3xl text-white border-0 font-semibold transition-all"
          style={{ backgroundColor: mainColor }}
        >
          {loadingCourseId === category.id ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Memuat...
            </>
          ) : (
            <>
              <PlayIcon className="w-4 h-4 mr-2" />
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
          href={`/${website_sub_category_id_params}/user/bimcourse/${category.id}`}
          className="block w-full"
        >
          <Button
            size="sm"
            className="w-full rounded-3xl bg-green-600 hover:bg-green-700 text-white border-0 font-semibold"
          >
            <CheckIcon className="w-4 h-4 mr-2" />
            Selesai
          </Button>
        </Link>
      );
    } else {
      return (
        <Link
          href={`/${website_sub_category_id_params}/user/bimcourse/${category.id}`}
          className="block w-full"
        >
          <Button
            size="sm"
            className="w-full rounded-3xl bg-orange-600 hover:bg-orange-700 text-white border-0 font-semibold"
          >
            <ForwardIcon className="w-4 h-4 mr-2" />
            Lanjutkan
          </Button>
        </Link>
      );
    }
  };

  const getStatusBadge = () => {
    if (category.completedChapters === 0) {
      return (
        <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
          <PlayIcon className="w-3 h-3 mr-1" />
          Belum Dimulai
        </Badge>
      );
    } else if (
      category.completedChapters === category.totalChapters
    ) {
      return (
        <Badge className="bg-green-50 text-green-700 border-green-200 font-medium">
          <CheckCircleIcon className="w-3 h-3 mr-1" />
          Selesai
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-orange-50 text-orange-700 border-orange-200 font-medium">
          <TrendingUpIcon className="w-3 h-3 mr-1" />
          Berlangsung
        </Badge>
      );
    }
  };

  return (
    <Card
      className="border-2 border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-visible"
    >
      {/* Enhanced Progress Ring - Pojok Kanan Atas */}
      <div className="absolute -top-3 -right-3 z-10">
        <div className="relative w-16 h-16">
          {/* Background circle with shadow */}
          <div className="absolute inset-0 bg-white rounded-full shadow-lg" />

          {/* SVG Progress Ring */}
          <svg
            className="w-16 h-16 transform -rotate-90 relative z-10"
            viewBox="0 0 36 36"
          >
            {/* Background track */}
            <path
              className="text-gray-200"
              stroke="currentColor"
              strokeWidth="3.5"
              fill="transparent"
              strokeDasharray="100, 100"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Progress arc */}
            <path
              stroke={mainColor}
              strokeWidth="3.5"
              fill="transparent"
              strokeDasharray={`${Math.min(100, Math.round(category.percentageProgress || 0))}, 100`}
              strokeLinecap="round"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              style={{
                filter: `drop-shadow(0 2px 4px ${mainColor}40)`,
              }}
            />
          </svg>

          {/* Percentage Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span
                className="text-xs font-black leading-none"
                style={{ color: mainColor }}
              >
                {Math.min(
                  100,
                  Math.round(category.percentageProgress || 0),
                )}
                %
              </span>
            </div>
          </div>
        </div>
      </div>

      <CardHeader className="pb-4">
        <div className="flex items-start gap-4 pr-16">
          <div
            className="w-12 h-12 rounded-3xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: mainColor }}
          >
            <BookOpenIcon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            {getStatusBadge()}
            <CardTitle className="text-lg font-bold text-gray-900 mt-2 mb-1">
              {category.name}
            </CardTitle>
            <p className="text-sm text-gray-600 line-clamp-2">
              Tingkatkan kemampuan berpikir logis dan analitis
              untuk menghadapi tantangan SNBT
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-0 space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-gray-700">
              Progress
            </span>
            <span className="font-bold text-gray-900">
              {category.completedChapters}/
              {category.totalChapters} Sub Chapter
            </span>
          </div>
          <Progress
            value={category.percentageProgress}
            className="h-2"
            style={{
              backgroundColor: `${mainColor}20`,
            }}
          />
        </div>

        {/* Stats Grid - Gradient Style */}
        <div className="grid grid-cols-2 gap-3">
          <div
            className="p-4 rounded-3xl border-2"
            style={{
              background: `linear-gradient(to bottom right, rgb(239 246 255), rgb(219 234 254))`,
              borderColor: 'rgb(191 219 254)',
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <ClockIcon className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-600">
                Waktu
              </span>
            </div>
            <div className="text-sm font-bold text-blue-700">
              {category.totalSpendTime / 60 < 1
                ? `${category.totalSpendTime} Min`
                : `${(category.totalSpendTime / 60).toFixed(1)} Jam`}
            </div>
          </div>

          <div
            className="p-4 rounded-3xl border-2"
            style={{
              background: `linear-gradient(to bottom right, rgb(240 253 244), rgb(220 252 231))`,
              borderColor: 'rgb(187 247 208)',
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <FileQuestionIcon className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-green-600">
                Quiz
              </span>
            </div>
            <div className="text-sm font-bold text-green-700">
              {category.totalTryout} Soal
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {/* Detail Dialog Button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-3xl border-2 border-gray-200 hover:border-gray-300"
              >
                <ListIcon className="w-4 h-4 mr-2" />
                Detail
              </Button>
            </DialogTrigger>

            <DialogContent className="md:max-w-[700px] max-h-[85vh]">
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-3xl flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: mainColor }}
                  >
                    <BookOpenIcon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <DialogTitle className="text-2xl font-black text-gray-900">
                      {category.name}
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                      Daftar lengkap materi pembelajaran
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {/* Enhanced Stats Overview */}
              <div className="grid grid-cols-3 gap-3 pb-4 border-b">
                <div
                  className="p-4 rounded-3xl border-2 text-center"
                  style={{
                    background: `linear-gradient(to bottom right, rgb(239 246 255), rgb(219 234 254))`,
                    borderColor: 'rgb(191 219 254)',
                  }}
                >
                  <div className="text-2xl font-black text-blue-700">
                    {category.percentageProgress}%
                  </div>
                  <div className="text-xs font-medium text-blue-600 mt-1">
                    Progress
                  </div>
                </div>

                <div
                  className="p-4 rounded-3xl border-2 text-center"
                  style={{
                    background: `linear-gradient(to bottom right, rgb(254 249 195), rgb(254 240 138))`,
                    borderColor: 'rgb(253 224 71)',
                  }}
                >
                  <div className="text-2xl font-black text-yellow-700">
                    {category.totalChapters}
                  </div>
                  <div className="text-xs font-medium text-yellow-600 mt-1">
                    Total Sub Chapter
                  </div>
                </div>

                <div
                  className="p-4 rounded-3xl border-2 text-center"
                  style={{
                    background: `linear-gradient(to bottom right, rgb(240 253 244), rgb(220 252 231))`,
                    borderColor: 'rgb(187 247 208)',
                  }}
                >
                  <div className="text-2xl font-black text-green-700">
                    {category.completedChapters}
                  </div>
                  <div className="text-xs font-medium text-green-600 mt-1">
                    Selesai
                  </div>
                </div>
              </div>

              {/* Chapter List with Enhanced Info */}
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {category.CourseChapter.map((chapter, i) => (
                    <DetailContent
                      key={i}
                      category={category}
                      chapter={chapter}
                      index={i}
                    />
                  ))}
                </div>
              </ScrollArea>

              <DialogFooter>
                <Button
                  className="w-full rounded-3xl text-white"
                  style={{ backgroundColor: mainColor }}
                  onClick={() => {
                    if (category.completedChapters === 0) {
                      router.push(
                        `/${website_sub_category_id_params}/user/bimcourse/${category.id}/study`,
                      );
                    } else {
                      router.push(
                        `/${website_sub_category_id_params}/user/bimcourse/${category.id}/study`,
                      );
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

          {/* Main Action Button */}
          <div className="flex-1">{getActionButton()}</div>
        </div>
      </CardContent>
    </Card>
  );
}
