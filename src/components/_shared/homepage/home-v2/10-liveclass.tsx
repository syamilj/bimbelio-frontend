'use client';

import { useGuest } from '@/components/layout/layoutGuest';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
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
import { Calendar, Clock, PlayCircle, Video } from 'lucide-react';
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
  const { websiteSubCategory } = useWebsiteSubCategory();
  const { data: session } = useSession();

  const { data: liveClasses, isLoading } = useGet<LiveLearningDataType[]>(
    '/liveClass/getAllLiveClassForLandingPage',
    { params: { take: 3, page: 1 } },
  );

  const mainColor = websiteSubCategory?.main_color ?? '#0091FF';

  if (!isLoading && (!liveClasses || liveClasses.length === 0)) {
    return null;
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'LIVE':
        return { label: 'LIVE', color: '#EF4444' };
      case 'UPCOMING':
        return { label: 'Upcoming', color: mainColor };
      default:
        return { label: 'Selesai', color: '#6B7280' };
    }
  };

  return (
    <section
      id="live-class"
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

        {/* Live Class Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="overflow-hidden rounded-2xl"
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {liveClasses?.slice(0, 3).map((liveClass) => {
              const status = getStatusLabel(liveClass.status);
              const href = `/${liveClass.websiteSubCategoryId}/user/live-learning/detail/${liveClass.id}?liveLearningId=${liveClass.id}`;
              const linkId = `live-class-link-${liveClass.id}`;

              return (
                <div
                  key={liveClass.id}
                  className="group cursor-pointer"
                  onClick={() => {
                    if (!session) {
                      setShowAuth({
                        open: true,
                        redirect: href,
                      });
                    } else {
                      const linkElement = document.getElementById(linkId);
                      linkElement?.click();
                    }
                  }}
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

                      {/* Content */}
                      <div className="p-4">
                        <p
                          className="text-xs font-semibold mb-1"
                          style={{ color: mainColor }}
                        >
                          {liveClass.Category?.name || 'Live Class'}
                        </p>
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
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>
                              {new Date(liveClass.startDate).toLocaleDateString(
                                'id-ID',
                                {
                                  day: 'numeric',
                                  month: 'short',
                                },
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>
                              {new Date(liveClass.startDate).toLocaleTimeString(
                                'id-ID',
                                {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                },
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-8">
          <Link
            href="/snbt/user/live-learning"
            className="inline-flex items-center px-6 py-3 rounded-2xl font-semibold text-white transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: mainColor }}
          >
            Lihat Semua Live Class →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LiveClassSection;
