'use client';

import { useCountdown } from '@/app/(main)/[web_sub_category]/(user)/user/live-learning/_components/live-class-hooks';
import { CountdownTimer } from '@/app/(main)/[web_sub_category]/(user)/user/live-learning/_components/live-class-shared-components';
import { useGuest } from '@/components/layout/layoutGuest';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { useGet } from '@/lib/fetch-helper/useGet';
import { cn, formatDateTime, formatDuration } from '@/lib/utils';
import {
  Category,
  CourseSubChapter,
  Instructor,
  LiveClass,
  LiveClassAgenda,
  LiveClassReference,
} from '@/types/database';
import { Calendar, Clock, Crown, Eye, PlayCircle, Users, Video } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

type LiveLearningDataType = LiveClass & {
  Instructor: Instructor;
  Category: Category;
  LiveClassReference: (LiveClassReference & {
    CourseSubChapter: CourseSubChapter;
  })[];
  LiveClassAgenda: LiveClassAgenda[];
  endDate: string;
  status: string;
  participants: {
    id: string;
    email: string;
    name: string;
    subs: string;
    image: string | null;
  }[];
  isRegistered?: boolean;
};

const LiveLearningSection: React.FC = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const href = searchParams?.get('href');

  const ref = useRef(null);

  const { data: cards, isLoading } = useGet<LiveLearningDataType[]>(
    '/liveClass/getAllLiveClassForLandingPage',
    {
      params: { take: 3, page: 1 },
    },
  );

  useEffect(() => {
    if (href && href?.length > 0) {
      router.push(href);
    }
  }, [href]);

  const pathname = usePathname();
  const isMainLandingPage = pathname === '/';
  const mainColor = isMainLandingPage
    ? '#0091FF'
    : (websiteSubCategory?.main_color ?? '#0091FF');

  return (
    <section
      id="live-learning"
      className={cn(
        'py-16 md:py-20 px-4 bg-gray-50/50',
        !isLoading && cards?.length === 0 && 'hidden',
      )}
    >
      <div
        className="max-w-5xl mx-auto"
        ref={ref}
      >
        {/* Header */}
        <div className="text-center mb-10">
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white mb-4"
            style={{ backgroundColor: mainColor }}
          >
            <Video className="w-4 h-4" />
            Live Learning
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Belajar Bareng{' '}
            <span style={{ color: mainColor }}>Tutor Expert</span>
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto">
            Kelas live interaktif dengan tutor berpengalaman. Tanya langsung,
            dapat pembahasan real-time, dan akses rekaman selamanya.
          </p>
        </div>

        {/* Cards Grid */}
        <div
          className={cn(
            'grid gap-5 mb-8',
            cards?.length === 1 && !isLoading
              ? 'grid-cols-1 max-w-md mx-auto'
              : cards?.length === 2 && !isLoading
                ? 'grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto'
                : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
          )}
        >
          {/* Loading State */}
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-gray-200 animate-pulse overflow-hidden"
                >
                  <Link
                    hidden
                    id={linkId}
                    href={href}
                  />
                  <Card className="overflow-hidden rounded-2xl border border-gray-200 hover:border-gray-300 transition-colors bg-white h-full">
                    <CardContent className="p-0">
                      {/* Header with status */}
                      <div
                        className={cn(
                          'h-24 relative flex items-center justify-center',
                          liveClass.image && 'h-full',
                        )}
                        style={{ backgroundColor: `${mainColor}10` }}
                      >
                        {!liveClass.image && (
                          <PlayCircle
                            className="w-12 h-12"
                            style={{ color: mainColor }}
                          />
                        )}
                        {liveClass.image && (
                          <Image
                            src={liveClass.image}
                            alt={liveClass.title}
                            width={400}
                            height={96}
                          />
                        )}
                        <div className="absolute top-3 right-3">
                          <span
                            className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                            style={{ backgroundColor: status.color }}
                          >
                            {status.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="h-5 bg-gray-100 rounded w-full" />
                    <div className="h-4 bg-gray-100 rounded w-2/3" />
                    <div className="h-10 bg-gray-100 rounded mt-4" />
                  </div>
                </div>
              ))
            : cards?.map((liveClass) => (
                <LiveClassCard
                  key={liveClass.id}
                  liveClass={liveClass}
                  mainColor={mainColor}
                />
              ))}
        </div>

        {/* View All CTA */}
        {cards && cards.length > 0 && (
          <div className="text-center">
            <Link
              href={`/${website_sub_category_id}/user/live-learning`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold border-2 transition-all duration-200 hover:bg-gray-50"
              style={{ borderColor: mainColor, color: mainColor }}
            >
              Lihat Semua Kelas
              <PlayCircle className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

// LiveClass Card Component - Match Screenshot Design
const LiveClassCard = ({
  liveClass,
  mainColor,
}: {
  liveClass: LiveLearningDataType;
  mainColor: string;
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { setShowAuth } = useGuest();
  const searchParams = useSearchParams();
  const liveLearningId = searchParams?.get('liveLearningId');

  useEffect(() => {
    if (!liveClass || !liveLearningId || !session) return;
    if (liveLearningId === liveClass.id) {
      router.push(
        `${liveClass.websiteSubCategoryId}/user/live-learning?id=${liveLearningId}`,
      );
    }
  }, [liveClass, liveLearningId, session]);

  const timeLeft = useCountdown(liveClass.startDate);
  const isUpcoming = liveClass.status === 'Akan Datang' && !timeLeft.isExpired;
  const isLive = liveClass.status === 'Sedang Berlangsung';
  const isFinished = liveClass.status === 'Selesai';

  const getStatusBadge = () => {
    if (isLive) {
      return {
        label: 'Sedang Berlangsung',
        className: 'bg-red-100 text-red-700 border-red-200',
      };
    }
    if (isUpcoming) {
      return {
        label: 'Akan Datang',
        className: 'bg-blue-100 text-blue-700 border-blue-200',
      };
    }
    if (isFinished) {
      return {
        label: 'Selesai',
        className: 'bg-gray-100 text-gray-700 border-gray-200',
      };
    }
    return {
      label: liveClass.status,
      className: 'bg-gray-100 text-gray-700 border-gray-200',
    };
  };

  const statusBadge = getStatusBadge();

  return (
    <Card className="group relative overflow-hidden border-2 border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01] bg-white rounded-3xl">
      <CardContent className="p-5 lg:p-6">
        {/* Status Badge */}
        <div className="mb-4">
          <Badge
            className={cn(
              'px-3 py-1 text-xs font-semibold rounded-full border',
              statusBadge.className,
            )}
          >
            {statusBadge.label}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="text-lg lg:text-xl font-bold text-gray-900 line-clamp-2 mb-4 group-hover:text-blue-600 transition-colors">
          {liveClass.title}
        </h3>

        {/* Countdown for upcoming */}
        {isUpcoming && !timeLeft.isExpired && (
          <div className="mb-4 flex justify-center">
            <CountdownTimer timeLeft={timeLeft} />
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-100 my-4" />

        {/* Title + ID Row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <h4 className="text-base font-bold text-gray-900 line-clamp-2 flex-1">
            {liveClass.title}
          </h4>
          <Badge
            variant="outline"
            className="text-xs font-mono bg-gray-50 text-gray-600 border-gray-200 shrink-0 rounded-full"
          >
            #{liveClass.id.slice(-6).toUpperCase()}
          </Badge>
        </div>

        {/* Instructor */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10 border-2 border-gray-100">
            <AvatarImage src={liveClass.Instructor.image || undefined} />
            <AvatarFallback
              className="text-sm font-bold text-white"
              style={{ backgroundColor: mainColor }}
            >
              {liveClass.Instructor.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-sm">
              {liveClass.Instructor.name}
            </p>
            {liveClass.Instructor.lastEducation && (
              <Badge
                className="mt-1 text-xs px-2 py-0.5 rounded-full border"
                style={{
                  backgroundColor: `${mainColor}15`,
                  color: mainColor,
                  borderColor: `${mainColor}30`,
                }}
              >
                {liveClass.Instructor.lastEducation}
              </Badge>
            )}
          </div>
        </div>

        {/* Date & Duration */}
        <div className="space-y-2 mb-5">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar
              className="w-4 h-4"
              style={{ color: mainColor }}
            />
            <span>{formatDateTime(liveClass.startDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock
              className="w-4 h-4"
              style={{ color: mainColor }}
            />
            <span>{formatDuration(liveClass.duration)}</span>
          </div>
        </div>

        {/* Footer: Participants + Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* Participants */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            <span>{liveClass.participants?.length || 0}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-4 rounded-full border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold"
              onClick={() => {
                if (!session) {
                  setShowAuth({
                    open: true,
                    redirect: `/${website_sub_category_id}/user/live-learning/detail/${liveClass.id}`,
                  });
                  return;
                }
                router.push(
                  `/${website_sub_category_id}/user/live-learning/detail/${liveClass.id}`,
                );
              }}
            >
              <Eye className="w-4 h-4 mr-1.5" />
              Detail
            </Button>
            <Button
              size="sm"
              className="h-9 px-4 rounded-full font-semibold text-white border-2"
              style={{
                backgroundColor: mainColor,
                borderColor: mainColor,
              }}
              onClick={() => {
                if (!session) {
                  setShowAuth({
                    open: true,
                    redirect: `/${website_sub_category_id}/user/live-learning/detail/${liveClass.id}`,
                  });
                  return;
                }
                router.push(
                  `/${website_sub_category_id}/user/live-learning/detail/${liveClass.id}`,
                );
              }}
            >
              <Crown className="w-4 h-4 mr-1.5" />
              Premium
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveLearningSection;
export { LiveLearningSection };
