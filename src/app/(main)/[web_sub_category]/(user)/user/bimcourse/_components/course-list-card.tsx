'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { website_sub_category_id_params } from '@/hooks/use-web-sub-category-id';
import {
  BookOpenIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronRight,
  ClockIcon,
  FileQuestionIcon,
  FileTextIcon,
  ForwardIcon,
  Loader2,
  PlayCircleIcon,
  PlayIcon,
  TrendingUpIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { TypeData } from './modul-types';

type CourseListCardProps = {
  category: TypeData[0];
  loadingCourseId: string | null;
  onStartCourse: (categoryId: string) => void;
  mainColor: string;
};

export function CourseListCard({
  category,
  loadingCourseId,
  onStartCourse,
  mainColor,
}: CourseListCardProps) {
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
        <Button
          size="sm"
          onClick={() => onStartCourse(category.id)}
          disabled={loadingCourseId === category.id}
          className="w-full rounded-3xl bg-green-600 hover:bg-green-700 text-white border-0 font-semibold"
        >
          {loadingCourseId === category.id ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Memuat...
            </>
          ) : (
            <>
              <CheckIcon className="w-4 h-4 mr-2" />
              Selesai
            </>
          )}
        </Button>
      );
    } else {
      return (
        <Button
          size="sm"
          onClick={() => onStartCourse(category.id)}
          disabled={loadingCourseId === category.id}
          className="w-full rounded-3xl text-white border-0 font-semibold"
          style={{ backgroundColor: mainColor }}
        >
          {loadingCourseId === category.id ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Memuat...
            </>
          ) : (
            <>
              <ForwardIcon className="w-4 h-4 mr-2" />
              Lanjutkan
            </>
          )}
        </Button>
      );
    }
  };

  const getStatusBadge = () => {
    if (category.completedChapters === category.totalChapters) {
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
    <div
      className="border-2 border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 bg-white overflow-hidden flex-shrink-0 w-[85vw] md:w-[65vw] lg:w-[55vw] xl:w-[45vw] snap-start"
    >
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b-2 border-gray-100">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div
              className="w-16 h-16 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg"
              style={{ backgroundColor: mainColor }}
            >
              <BookOpenIcon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {getStatusBadge()}
                <span
                  className="text-2xl font-black"
                  style={{ color: mainColor }}
                >
                  {Math.min(
                    100,
                    Math.round(category.percentageProgress || 0),
                  )}
                  %
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 truncate">
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <BookOpenIcon className="w-4 h-4" />
                  {category.CourseChapter.length} Bab
                </span>
                <span className="flex items-center gap-1">
                  <FileTextIcon className="w-4 h-4" />
                  {category.totalChapters} Sub-Bab
                </span>
                <span className="flex items-center gap-1">
                  <ClockIcon className="w-4 h-4" />
                  {category.totalSpendTime / 60 < 1
                    ? `${category.totalSpendTime} Min`
                    : `${(category.totalSpendTime / 60).toFixed(1)} Jam`}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 flex-shrink-0">
            {getActionButton()}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="font-medium text-gray-700">
              Progress Keseluruhan
            </span>
            <span className="font-bold text-gray-900">
              {category.completedChapters}/
              {category.totalChapters} Sub-Bab Selesai
            </span>
          </div>
          <Progress
            value={category.percentageProgress}
            className="h-3 rounded-full"
            style={{ backgroundColor: `${mainColor}20` }}
          />
        </div>
      </div>

      {/* Chapters & Sub-chapters */}
      <div className="p-6 max-h-[60vh] overflow-y-auto scrollbar-hide">
        <div className="space-y-6">
          {category.CourseChapter.map((chapter, chapterIndex) => {
            const chapterSubChapters =
              chapter.CourseSubChapter || [];
            const completedInChapter = chapterSubChapters.filter(
              (sub) =>
                sub.CourseProgress &&
                sub.CourseProgress.length > 0,
            ).length;
            const chapterProgress =
              chapterSubChapters.length > 0
                ? Math.round(
                    (completedInChapter /
                      chapterSubChapters.length) *
                      100,
                  )
                : 0;

            return (
              <div
                key={chapterIndex}
                className="border-2 border-gray-100 rounded-3xl overflow-hidden"
              >
                {/* Chapter Header */}
                <div
                  className="p-4"
                  style={{ backgroundColor: `${mainColor}10` }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-3xl text-white font-bold text-lg shadow-md"
                      style={{ backgroundColor: mainColor }}
                    >
                      {chapterIndex + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-bold text-gray-900 mb-1 truncate">
                        {chapter.title}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="font-semibold">
                          {completedInChapter}/
                          {chapterSubChapters.length} Sub-Bab
                          Selesai
                        </span>
                        <span
                          className="font-bold"
                          style={{ color: mainColor }}
                        >
                          {chapterProgress}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-chapters List */}
                <div className="divide-y divide-gray-100">
                  {chapterSubChapters.map(
                    (subChapter, subIndex) => {
                      const isCompleted =
                        subChapter.CourseProgress &&
                        subChapter.CourseProgress.length > 0;
                      const subChapterTypeIcon =
                        {
                          VIDEO: PlayCircleIcon,
                          DOCUMENT: FileTextIcon,
                          MATERI: BookOpenIcon,
                          TRYOUT: FileQuestionIcon,
                          PROGRESS_TEST: FileQuestionIcon,
                        }[subChapter.type] || FileTextIcon;
                      const SubChapterIcon = subChapterTypeIcon;

                      return (
                        <button
                          key={subChapter.id}
                          onClick={() =>
                            router.push(
                              `/${website_sub_category_id_params}/user/bimcourse/${category.id}/study?sub=${subChapter.id}&tab=chat`,
                            )
                          }
                          className="group w-full flex items-center gap-4 p-4 text-left transition-all hover:bg-gray-50"
                        >
                          <div
                            className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-3xl ${
                              isCompleted
                                ? 'bg-green-100'
                                : 'bg-gray-100'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircleIcon className="h-6 w-6 text-green-600" />
                            ) : (
                              <SubChapterIcon className="h-6 w-6 text-gray-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`font-semibold text-base mb-1 truncate ${
                                isCompleted
                                  ? 'text-gray-600 line-through'
                                  : 'text-gray-900 group-hover:text-blue-600'
                              }`}
                            >
                              {subChapter.title}
                            </p>
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                              <span className="capitalize font-medium">
                                {subChapter.type.toLowerCase()}
                              </span>
                              {subChapter.spendTime && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <ClockIcon className="w-3 h-3" />
                                    {subChapter.spendTime} menit
                                  </span>
                                </>
                              )}
                              {isCompleted && (
                                <>
                                  <span>•</span>
                                  <span className="text-green-600 font-semibold flex items-center gap-1">
                                    <CheckCircleIcon className="w-3 h-3" />
                                    Selesai
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 flex-shrink-0 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600" />
                        </button>
                      );
                    },
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
