'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGet } from '@/lib/fetch-helper/useGet';
import { cn } from '@/lib/utils';
import {
  Category,
  CourseSubChapter,
  Instructor,
  LiveClass,
  LiveClassAgenda,
  LiveClassReference,
} from '@/types/database';
import {
  ArrowRight,
  Calendar,
  Clock,
  Gem,
  PlayCircle,
  Video,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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

const LiveClassSection: React.FC = () => {
  const {
    useAuth: { setShowAuth },
  } = useAppContext();
  const { websiteSubCategory, mainColor, secondaryColor } =
    useWebsiteSubCategory();
  const { data: session } = useSession();

  const { data: liveClasses, isLoading } = useGet<LiveLearningDataType[]>(
    '/liveClass/getAllLiveClassForLandingPage',
    { params: { take: 6, page: 1 } },
  );

  console.log({ liveClasses });

  const liveClassesFree =
    liveClasses?.filter((lc) => lc.accessType !== 'PREMIUM') || [];

  if (!isLoading && (!liveClasses || liveClasses.length === 0)) {
    return null;
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Sedang Berlangsung':
        return { label: 'LIVE', color: '#EF4444' };
      case 'Akan Datang':
        return { label: 'Upcoming', color: mainColor };
      default:
        return { label: '', color: '#6B7280' };
    }
  };

  return (
    <section
      id="live-learning"
      className={cn(
        'bg-white px-4 py-16 md:py-20',
        !isLoading && (!liveClasses || liveClasses.length === 0) && 'hidden',
      )}
    >
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <span
            className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white"
            style={{ backgroundColor: mainColor }}
          >
            <Video className="h-4 w-4" />
            Live Class
          </span>

          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Belajar Bareng{' '}
            <span style={{ color: mainColor }}>Tutor Alumni PTN</span>
          </h2>

          <p className="mx-auto max-w-2xl text-gray-600">
            198+ sesi live class interaktif. Tanya langsung, diskusi real-time,
            bukan cuma nonton video.
          </p>
        </div>

        {/* Free Live Class Cards Section */}
        {!isLoading && liveClassesFree.length > 0 && (
          <>
            <div className="mb-12">
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="h-px flex-1"
                  style={{ backgroundColor: `${mainColor}30` }}
                />
                <span
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold text-white"
                  style={{ backgroundColor: mainColor }}
                >
                  BimLive Gratis
                </span>
                <div
                  className="h-px flex-1"
                  style={{ backgroundColor: `${mainColor}30` }}
                />
              </div>
              <div className="scrollbar-hide -mx-4 flex touch-pan-x snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-3 md:px-0 md:pb-0">
                {liveClassesFree?.slice(0, 6).map((liveClass) => {
                  const status = getStatusLabel(liveClass.status);
                  const accesType =
                    liveClass.accessType === 'PREMIUM' ? 'Berbayar' : 'Gratis';
                  const href = `/${liveClass.websiteSubCategoryId}/user/bimlive/detail/${liveClass.id}?liveLearningId=${liveClass.id}`;

                  return (
                    <div
                      key={liveClass.id}
                      className="group min-w-[85%] cursor-default snap-center sm:min-w-[350px] md:min-w-0"
                    >
                      <Card className="h-full overflow-hidden rounded-3xl border-2 border-gray-100 bg-white shadow-sm transition-all hover:border-gray-200">
                        <CardContent className="p-0">
                          {/* Header with status */}
                          <div
                            className={cn(
                              'relative flex h-24 items-center justify-center',
                              liveClass.image && 'h-full',
                            )}
                            style={{ backgroundColor: `${mainColor}10` }}
                          >
                            {!liveClass.image && (
                              <PlayCircle
                                className="h-12 w-12"
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
                            <div className="absolute top-3 right-3 flex gap-2">
                              {status.label.length > 0 && (
                                <span
                                  className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                                  style={{ backgroundColor: status.color }}
                                >
                                  {status.label}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-4">
                            <div className="flex w-full justify-between">
                              <p
                                className="mb-1 text-xs font-semibold"
                                style={{ color: mainColor }}
                              >
                                {liveClass.Category?.name || 'Live Class'}
                              </p>
                              <span
                                className={cn(
                                  'rounded-full px-2 py-1 text-xs font-semibold text-white',
                                  liveClass.accessType === 'PREMIUM'
                                    ? 'bg-main'
                                    : 'bg-emerald-500',
                                )}
                              >
                                {liveClass.accessType === 'PREMIUM' && (
                                  <Gem className="-mt-0.5 mr-1 inline-block h-3.5 w-3.5" />
                                )}
                                {accesType}
                              </span>
                            </div>
                            <h3 className="mb-3 line-clamp-2 text-base font-semibold text-gray-900 transition-opacity group-hover:opacity-80">
                              {liveClass.title}
                            </h3>

                            {/* Instructor */}
                            <div className="mb-3 flex items-center gap-2">
                              <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-200">
                                {liveClass.Instructor?.image ? (
                                  <Image
                                    src={liveClass.Instructor.image}
                                    alt={liveClass.Instructor.name}
                                    width={32}
                                    height={32}
                                    className="object-cover"
                                  />
                                ) : (
                                  <div
                                    className="flex h-full w-full items-center justify-center text-xs font-semibold text-white"
                                    style={{ backgroundColor: mainColor }}
                                  >
                                    {liveClass.Instructor?.name?.charAt(0) ||
                                      'T'}
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {liveClass.Instructor?.name || 'Tutor'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {liveClass.Instructor?.lastEducation ||
                                    'Alumni PTN'}
                                </p>
                              </div>
                            </div>

                            {/* Meta */}
                            <div className="mb-3 flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>
                                  {new Date(
                                    liveClass.startDate,
                                  ).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                <span>
                                  {new Date(
                                    liveClass.startDate,
                                  ).toLocaleTimeString('id-ID', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                            </div>

                            {!session ? (
                              <Button
                                className="group h-12 w-full cursor-pointer rounded-3xl font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg"
                                style={{
                                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                }}
                                onClick={() => {
                                  setShowAuth({
                                    open: true,
                                    redirect: href,
                                  });
                                }}
                              >
                                Gabung Sekarang
                              </Button>
                            ) : (
                              <Link href={href}>
                                <Button
                                  className="group h-12 w-full cursor-pointer rounded-3xl font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg"
                                  style={{
                                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                  }}
                                >
                                  Gabung Sekarang
                                </Button>
                              </Link>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* All Live Class Cards Section */}
        {isLoading ? (
          <div className="scrollbar-hide -mx-4 flex touch-pan-x snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-3 md:px-0 md:pb-0">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card
                key={i}
                className="min-w-[85%] snap-center overflow-hidden rounded-3xl sm:min-w-[350px] md:min-w-0"
              >
                <CardContent className="p-0">
                  <div className="h-32 animate-pulse bg-gray-200" />
                  <div className="space-y-3 p-4">
                    <div className="h-4 animate-pulse rounded bg-gray-200" />
                    <div className="h-6 animate-pulse rounded bg-gray-200" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center gap-3">
              <div
                className="h-px flex-1"
                style={{ backgroundColor: `${mainColor}30` }}
              />
              <span
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold text-white"
                style={{ backgroundColor: mainColor }}
              >
                <Gem className="h-4 w-4" /> BimLive Premium
              </span>
              <div
                className="h-px flex-1"
                style={{ backgroundColor: `${mainColor}30` }}
              />
            </div>
            <div className="scrollbar-hide -mx-4 flex touch-pan-x snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-3 md:px-0 md:pb-0">
              {liveClasses?.slice(0, 6).map((liveClass) => {
                const status = getStatusLabel(liveClass.status);
                const accesType =
                  liveClass.accessType === 'PREMIUM' ? 'Berbayar' : 'Gratis';
                const href = `/${liveClass.websiteSubCategoryId}/user/bimlive/detail/${liveClass.id}?liveLearningId=${liveClass.id}`;

                return (
                  <div
                    key={liveClass.id}
                    className="group min-w-[85%] cursor-default snap-center sm:min-w-[350px] md:min-w-0"
                  >
                    <Card className="h-full overflow-hidden rounded-3xl border-2 border-gray-100 bg-white shadow-sm transition-all hover:border-gray-200">
                      <CardContent className="p-0">
                        {/* Header with status */}
                        <div
                          className={cn(
                            'relative flex h-24 items-center justify-center',
                            liveClass.image && 'h-full',
                          )}
                          style={{ backgroundColor: `${mainColor}10` }}
                        >
                          {!liveClass.image && (
                            <PlayCircle
                              className="h-12 w-12"
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
                          <div className="absolute top-3 right-3 flex gap-2">
                            {status.label.length > 0 && (
                              <span
                                className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                                style={{ backgroundColor: status.color }}
                              >
                                {status.label}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <div className="flex w-full justify-between">
                            <p
                              className="mb-1 text-xs font-semibold"
                              style={{ color: mainColor }}
                            >
                              {liveClass.Category?.name || 'Live Class'}
                            </p>
                            <span
                              className={cn(
                                'rounded-full px-2 py-1 text-xs font-semibold text-white',
                                liveClass.accessType === 'PREMIUM'
                                  ? 'bg-main'
                                  : 'bg-emerald-500',
                              )}
                            >
                              {liveClass.accessType === 'PREMIUM' && (
                                <Gem className="-mt-0.5 mr-1 inline-block h-3.5 w-3.5" />
                              )}
                              {accesType}
                            </span>
                          </div>
                          <h3 className="mb-3 line-clamp-2 text-base font-semibold text-gray-900 transition-opacity group-hover:opacity-80">
                            {liveClass.title}
                          </h3>

                          {/* Instructor */}
                          <div className="mb-3 flex items-center gap-2">
                            <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-200">
                              {liveClass.Instructor?.image ? (
                                <Image
                                  src={liveClass.Instructor.image}
                                  alt={liveClass.Instructor.name}
                                  width={32}
                                  height={32}
                                  className="object-cover"
                                />
                              ) : (
                                <div
                                  className="flex h-full w-full items-center justify-center text-xs font-semibold text-white"
                                  style={{ backgroundColor: mainColor }}
                                >
                                  {liveClass.Instructor?.name?.charAt(0) || 'T'}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {liveClass.Instructor?.name || 'Tutor'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {liveClass.Instructor?.lastEducation ||
                                  'Alumni PTN'}
                              </p>
                            </div>
                          </div>

                          {/* Meta */}
                          <div className="mb-3 flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>
                                {new Date(
                                  liveClass.startDate,
                                ).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'short',
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              <span>
                                {new Date(
                                  liveClass.startDate,
                                ).toLocaleTimeString('id-ID', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          </div>

                          {!session ? (
                            <Button
                              className="group h-12 w-full cursor-pointer rounded-3xl font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg"
                              style={{
                                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                              }}
                              onClick={() => {
                                setShowAuth({
                                  open: true,
                                  redirect: href,
                                });
                              }}
                            >
                              Gabung Sekarang
                            </Button>
                          ) : (
                            <Link href={href}>
                              <Button
                                className="group h-12 w-full cursor-pointer rounded-3xl font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg"
                                style={{
                                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                }}
                              >
                                Gabung Sekarang
                              </Button>
                            </Link>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* View All Button */}
        <div className="mt-8 flex justify-center">
          <Link
            href={`/${websiteSubCategory?.id || 'utbk'}/user/bimlive`}
            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-md transition-transform hover:shadow-lg active:scale-95"
            style={{ backgroundColor: mainColor }}
          >
            Lihat Semua Live Class
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LiveClassSection;
