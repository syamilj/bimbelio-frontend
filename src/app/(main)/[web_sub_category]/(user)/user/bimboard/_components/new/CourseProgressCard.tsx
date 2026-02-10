'use client';

import { StatusBadge } from '@/components/ds';
import {
  BookOpen,
  CheckCircle,
  Clock,
  Target,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CourseProgressCardProps {
  course: {
    id: string;
    name: string;
    category: string;
    progress: number;
    totalChapters: number;
    completedChapters: number;
    thumbnail: string | null;
  };
  webSubCategoryId: string;
  mainColor: string;
}

export function CourseProgressCard({
  course,
  webSubCategoryId,
  mainColor,
}: CourseProgressCardProps) {
  const statusBadge = () => {
    if (course.progress === 0) {
      return (
        <StatusBadge variant="info" size="sm">
          <Clock className="w-3 h-3" />
          Belum Dimulai
        </StatusBadge>
      );
    } else if (course.progress === 100) {
      return (
        <StatusBadge variant="success" size="sm">
          <CheckCircle className="w-3 h-3" />
          Selesai
        </StatusBadge>
      );
    } else {
      return (
        <StatusBadge variant="warning" size="sm">
          <Target className="w-3 h-3" />
          Berlangsung
        </StatusBadge>
      );
    }
  };

  return (
    <Link
      href={`/${webSubCategoryId}/user/bimcourse/${course.id}`}
      className="group relative bg-white rounded-3xl border-2 border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all overflow-hidden flex-shrink-0 w-[280px] md:w-auto"
    >
      {/* Progress Ring - Top Right */}
      <div className="absolute -top-2 -right-2 z-10">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 bg-white rounded-full shadow-md" />
          <svg
            className="w-14 h-14 transform -rotate-90 relative z-10"
            viewBox="0 0 36 36"
          >
            <path
              className="text-slate-200"
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              strokeDasharray="100, 100"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              stroke={mainColor}
              strokeWidth="3"
              fill="transparent"
              strokeDasharray={`${course.progress}, 100`}
              strokeLinecap="round"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-[10px] font-black"
              style={{ color: mainColor }}
            >
              {course.progress}%
            </span>
          </div>
        </div>
      </div>

      {/* Thumbnail */}
      <div className="relative h-36 overflow-hidden bg-slate-100">
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={course.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${mainColor}80)`,
            }}
          >
            <BookOpen className="w-12 h-12 text-white opacity-50" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Status Badge */}
        <div>{statusBadge()}</div>

        {/* Title & Category */}
        <div>
          <h3 className="font-bold text-sm text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors mb-1">
            {course.name}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            {course.category}
          </p>
        </div>

        {/* Progress Info */}
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Clock className="w-3.5 h-3.5 opacity-70" />
          <span className="font-bold">
            {course.completedChapters}/{course.totalChapters} Bab Selesai
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${course.progress}%`,
              backgroundColor: mainColor,
            }}
          />
        </div>
      </div>
    </Link>
  );
}
