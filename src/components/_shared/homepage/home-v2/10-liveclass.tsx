'use client';

import { useGuest } from '@/components/layout/layoutGuest';
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
  const { setShowAuth } = useGuest();
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
        'py-16 md:py-20 px-4 bg-white',
        !isLoading && (!liveClasses || liveClasses.length === 0) && 'hidden',
      )}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white mb-4"
            style={{ backgroundColor: mainColor }}
          >
            <Video className="w-4 h-4" />
            Live Class
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Belajar Bareng{' '}
            <span style={{ color: mainColor }}>Tutor Alumni PTN</span>
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto">
            198+ sesi live class interaktif. Tanya langsung, diskusi real-time,
            bukan cuma nonton video.
          </p>
        </div>

        {/* Free Live Class Cards Section */}
        {!isLoading && liveClassesFree.length > 0 && (
          <>
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="h-px flex-1"
                  style={{ backgroundColor: `${mainColor}30` }}
                />
                <span
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: mainColor }}
                >
                  BimLive Gratis
                </span>
                <div
                  className="h-px flex-1"
                  style={{ backgroundColor: `${mainColor}30` }}
                />
              </div>
              <div className="flex overflow-x-auto touch-pan-x md:grid md:grid-cols-3 gap-5 px-4 -mx-4 md:px-0 md:mx-0 snap-x snap-mandatory scrollbar-hide pb-4 md:pb-0">
                {liveClassesFree?.slice(0, 6).map((liveClass) => {
                  const status = getStatusLabel(liveClass.status);
                  const accesType =
                    liveClass.accessType === 'PREMIUM' ? 'Berbayar' : 'Gratis';
                  const href = `/${liveClass.websiteSubCategoryId}/user/bimlive/detail/${liveClass.id}?liveLearningId=${liveClass.id}`;

                  return (
                    <div
                      key={liveClass.id}
                      className="group cursor-default min-w-[85%] sm:min-w-[350px] md:min-w-0 snap-center"
                    >
                      <Card className="overflow-hidden rounded-3xl border-2 border-gray-100 hover:border-gray-200 transition-all bg-white h-full shadow-sm">
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
                            <div className="absolute top-3 right-3 flex gap-2">
                              {status.label.length > 0 && (
                                <span
                                  className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                                  style={{ backgroundColor: status.color }}
                                >
                                  {status.label}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-4">
                            <div className="flex justify-between w-full">
                              <p
                                className="text-xs font-semibold mb-1"
                                style={{ color: mainColor }}
                              >
                                {liveClass.Category?.name || 'Live Class'}
                              </p>
                              <span
                                className={cn(
                                  'px-2 py-1 rounded-full text-xs font-semibold text-white',
                                  liveClass.accessType === 'PREMIUM'
                                    ? 'bg-main'
                                    : 'bg-emerald-500',
                                )}
                              >
                                {liveClass.accessType === 'PREMIUM' && (
                                  <Gem className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5" />
                                )}
                                {accesType}
                              </span>
                            </div>
                            <h3 className="font-semibold text-base text-gray-900 line-clamp-2 mb-3 group-hover:opacity-80 transition-opacity">
                              {liveClass.title}
                            </h3>

                            {/* Instructor */}
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
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
                                    className="w-full h-full flex items-center justify-center text-white text-xs font-semibold"
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
                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
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
                                <Clock className="w-3.5 h-3.5" />
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
                                className="w-full h-12 text-white font-semibold rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer"
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
                                  className="w-full h-12 text-white font-semibold rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer"
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
          <div className="flex overflow-x-auto touch-pan-x md:grid md:grid-cols-3 gap-5 px-4 -mx-4 md:px-0 md:mx-0 snap-x snap-mandatory scrollbar-hide pb-4 md:pb-0">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card
                key={i}
                className="overflow-hidden rounded-3xl min-w-[85%] sm:min-w-[350px] md:min-w-0 snap-center"
              >
                <CardContent className="p-0">
                  <div className="h-32 bg-gray-200 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-6 bg-gray-200 rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="h-px flex-1"
                style={{ backgroundColor: `${mainColor}30` }}
              />
              <span
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold text-white"
                style={{ backgroundColor: mainColor }}
              >
                <Gem className="w-4 h-4" /> BimLive Premium
              </span>
              <div
                className="h-px flex-1"
                style={{ backgroundColor: `${mainColor}30` }}
              />
            </div>
            <div className="flex overflow-x-auto touch-pan-x md:grid md:grid-cols-3 gap-5 px-4 -mx-4 md:px-0 md:mx-0 snap-x snap-mandatory scrollbar-hide pb-4 md:pb-0">
              {liveClasses?.slice(0, 6).map((liveClass) => {
                const status = getStatusLabel(liveClass.status);
                const accesType =
                  liveClass.accessType === 'PREMIUM' ? 'Berbayar' : 'Gratis';
                const href = `/${liveClass.websiteSubCategoryId}/user/bimlive/detail/${liveClass.id}?liveLearningId=${liveClass.id}`;

                return (
                  <div
                    key={liveClass.id}
                    className="group cursor-default min-w-[85%] sm:min-w-[350px] md:min-w-0 snap-center"
                  >
                    <Card className="overflow-hidden rounded-3xl border-2 border-gray-100 hover:border-gray-200 transition-all bg-white h-full shadow-sm">
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
                          <div className="absolute top-3 right-3 flex gap-2">
                            {status.label.length > 0 && (
                              <span
                                className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                                style={{ backgroundColor: status.color }}
                              >
                                {status.label}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <div className="flex justify-between w-full">
                            <p
                              className="text-xs font-semibold mb-1"
                              style={{ color: mainColor }}
                            >
                              {liveClass.Category?.name || 'Live Class'}
                            </p>
                            <span
                              className={cn(
                                'px-2 py-1 rounded-full text-xs font-semibold text-white',
                                liveClass.accessType === 'PREMIUM'
                                  ? 'bg-main'
                                  : 'bg-emerald-500',
                              )}
                            >
                              {liveClass.accessType === 'PREMIUM' && (
                                <Gem className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5" />
                              )}
                              {accesType}
                            </span>
                          </div>
                          <h3 className="font-semibold text-base text-gray-900 line-clamp-2 mb-3 group-hover:opacity-80 transition-opacity">
                            {liveClass.title}
                          </h3>

                          {/* Instructor */}
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
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
                                  className="w-full h-full flex items-center justify-center text-white text-xs font-semibold"
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
                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
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
                              <Clock className="w-3.5 h-3.5" />
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
                              className="w-full h-12 text-white font-semibold rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer"
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
                                className="w-full h-12 text-white font-semibold rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer"
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
        <div className="flex justify-center mt-8">
          <Link
            href={`/${websiteSubCategory?.id || 'utbk'}/user/bimlive`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white transition-transform active:scale-95 shadow-md hover:shadow-lg"
            style={{ backgroundColor: mainColor }}
          >
            Lihat Semua Live Class
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LiveClassSection;
