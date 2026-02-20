'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  Clock,
  ExternalLink,
  FlaskConical,
  Layers,
  Sparkles,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface AnotherWebCourse {
  id: number;
  name: string;
  image: string | null;
  totalChapters: number;
  completedChapters: number;
  percentageProgress: number;
  totalSpendTime: number;
  totalTryout: number;
  websiteSubCategory: {
    id: string;
    name: string;
    main_color: string;
  };
}

interface GroupedPlatform {
  id: string;
  name: string;
  main_color: string;
  courses: AnotherWebCourse[];
}

interface Props {
  onCountReady: (count: number) => void;
}

/** spendTime is stored in minutes in the database */
function formatTime(minutes: number): string {
  if (!minutes || minutes <= 0) return '—';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) return `${h}j${m > 0 ? ` ${m}m` : ''}`;
  return `${m}m`;
}

function UpsellCard({
  course,
  platform,
}: {
  course: AnotherWebCourse;
  platform: GroupedPlatform;
}) {
  const estimatedTime = formatTime(course.totalSpendTime);

  return (
    <div className="group flex flex-col rounded-2xl overflow-hidden border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-200 bg-white">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
        {course.image ? (
          <Image
            src={course.image}
            alt={course.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50">
            <BookOpen className="w-9 h-9 text-slate-300" />
          </div>
        )}
        {/* Platform badge */}
        <div className="absolute top-2 left-2">
          <span
            className="text-[10px] font-black px-2 py-0.5 rounded-full text-white backdrop-blur-md"
            style={{ backgroundColor: `${platform.main_color}cc` }}
          >
            {platform.name}
          </span>
        </div>
        {/* Gradient scrim */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 gap-2.5">
        <p className="font-bold text-slate-800 text-[13px] leading-snug line-clamp-2 flex-1">
          {course.name}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-semibold flex-wrap">
          <span className="flex items-center gap-1">
            <Layers className="w-3 h-3" />
            {course.totalChapters} chapter
          </span>
          {course.totalTryout > 0 && (
            <span className="flex items-center gap-1">
              <FlaskConical className="w-3 h-3" />
              {course.totalTryout} Uji Progress
            </span>
          )}
          {estimatedTime !== '—' && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {estimatedTime}
            </span>
          )}
        </div>

        {/* CTA */}
        <Link
          href={`/${platform.id}/user/bimcourse`}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-black text-white transition-all duration-150 hover:opacity-90"
          style={{ backgroundColor: platform.main_color }}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Lihat di {platform.name}
        </Link>
      </div>
    </div>
  );
}

export default function CourseTabUpsell({ onCountReady }: Props) {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();

  const [courses, setCourses] = useState<AnotherWebCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    getGeneral(
      `/course/getCategoryForCardAnotherWeb?userId=${session.user.id}`,
      {
        setData: setCourses,
        setLoading: setIsLoading,
      },
    );
  }, [session]);

  const onCountRef = useRef(onCountReady);
  onCountRef.current = onCountReady;

  useEffect(() => {
    if (!isLoading) {
      onCountRef.current(courses.length);
    }
  }, [isLoading, courses.length]);

  // Group by platform
  const platforms: GroupedPlatform[] = [];
  const seen = new Set<string>();
  for (const c of courses) {
    if (!seen.has(c.websiteSubCategory.id)) {
      seen.add(c.websiteSubCategory.id);
      platforms.push({ ...c.websiteSubCategory, courses: [] });
    }
    platforms.find((p) => p.id === c.websiteSubCategory.id)!.courses.push(c);
  }

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden animate-pulse border border-slate-100"
            >
              <div className="aspect-video bg-slate-100" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-slate-100 rounded-full w-3/4" />
                <div className="h-3 bg-slate-100 rounded-full w-1/2" />
                <div className="h-7 bg-slate-100 rounded-xl w-full mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (platforms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <Sparkles className="w-7 h-7 text-slate-300" />
        </div>
        <p className="font-bold text-slate-600 mb-1">Tidak ada platform lain</p>
        <p className="text-sm text-slate-400">
          Semua materi tersedia di platform ini.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-8">
      {platforms.map((platform) => (
        <section key={platform.id}>
          {/* Platform header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div
                className="w-2 h-6 rounded-full"
                style={{ backgroundColor: platform.main_color }}
              />
              <div>
                <h3 className="font-black text-slate-800 text-sm">
                  {platform.name}
                </h3>
                <p className="text-[10px] text-slate-400 font-medium">
                  {platform.courses.length} modul tersedia
                </p>
              </div>
            </div>
            <Link
              href={`/${platform.id}/user/bimcourse`}
              className={cn(
                'flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-full transition-all hover:opacity-80',
                'text-white',
              )}
              style={{ backgroundColor: platform.main_color }}
            >
              Lihat Semua
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {platform.courses.map((course) => (
              <UpsellCard
                key={course.id}
                course={course}
                platform={platform}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
