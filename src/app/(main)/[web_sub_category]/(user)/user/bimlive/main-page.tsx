'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  EmptyState as DSEmptyState,
  PageShell,
} from '@/components/ds';
import {
  website_sub_category_id,
  website_sub_category_id_params,
} from '@/hooks/use-web-sub-category-id';
import { useGet } from '@/lib/fetch-helper/useGet';
import { trackUnifiedEvent } from '@/lib/tracking/track';
import type { Category } from '@/types/database';
import {
  BookOpen,
  Check,
  Clock,
  Crown,
  PlayCircle,
  Users,
  Video,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import './_components/_style.css';
import { CalendarView } from './_components/live-class-calendar-view';
import { LiveClassFilters } from './_components/LiveClassFilters';
import { LiveClassHeader } from './_components/LiveClassHeader';
import {
  NotificationBadge,
} from './_components/live-class-shared-components';
import type { LiveLearningDataType } from './_components/live-class-types';
import { LiveClassCard } from './_components/live-class-card';

export default function LiveLearningDashboard({
  type,
}: {
  type?: 'LIVECLASS' | 'LIVESTREAM' | 'WEBINAR';
}) {
  // === DESIGN SYSTEM PATTERNS FROM LEADERBOARD ===
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';
  const webSubCategoryId =
    website_sub_category_id ?? website_sub_category_id_params;

  const [activeTab, setActiveTab] = useState('available');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');
  // const [sortBy, setSortBy] = useState<'date' | 'name' | 'status'>('date');
  // const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const typeLabel = type
    ? type === 'LIVECLASS'
      ? 'Live Class'
      : type === 'LIVESTREAM'
        ? 'Livestream'
        : 'Webinar'
    : 'Live Learning';
  const typeIcon =
    type === 'LIVECLASS'
      ? Video
      : type === 'LIVESTREAM'
        ? PlayCircle
        : type === 'WEBINAR'
          ? Users
          : Video;
  const TypeIcon = typeIcon;

  const {
    data: LiveClassAvailable,
    isLoading: LiveClassAvailableIsLoading,
    error: LiveClassAvailableError,
    totalData: LiveClassAvailableTotalData,
    refetch: LiveClassAvailableRefetch,
  } = useGet<LiveLearningDataType[]>('/liveClass/getAllLiveClassAvailable', {
    params: {
      ...(type ? { type } : {}),
      ...(webSubCategoryId
        ? { website_sub_category_id: webSubCategoryId }
        : {}),
    },
    useEffectDependencies: [type, webSubCategoryId],
    enabled: Boolean(webSubCategoryId),
  });

  console.log({ LiveClassAvailableTotalData, LiveClassAvailableIsLoading });

  const {
    data: LiveClassCompleted,
    // isLoading: LiveClassCompletedIsLoading,
    // error: LiveClassCompletedError,
    totalData: LiveClassCompletedTotalData,
  } = useGet<LiveLearningDataType[]>('/liveClass/getAllLiveClassCompleted', {
    params: {
      ...(type ? { type } : {}),
      ...(webSubCategoryId
        ? { website_sub_category_id: webSubCategoryId }
        : {}),
    },
    useEffectDependencies: [type, webSubCategoryId],
    enabled: Boolean(webSubCategoryId),
  });

  const {
    data: LiveClassRegistered,
    // isLoading: LiveClassRegisteredIsLoading,
    // error: LiveClassRegisteredError,
    totalData: LiveClassRegisteredTotalData,
    refetch: LiveClassRegisteredRefetch,
  } = useGet<LiveLearningDataType[]>('/user/getUserLiveClassRegistered', {
    params: {
      ...(type ? { type } : {}),
      ...(webSubCategoryId
        ? { website_sub_category_id: webSubCategoryId }
        : {}),
    },
    enabled: LiveClassAvailableIsLoading === false && Boolean(webSubCategoryId),
    useEffectDependencies: [
      type,
      LiveClassAvailableIsLoading,
      webSubCategoryId,
    ],
  });

  const {
    data: LiveClassInvited,
    // isLoading: LiveClassInvitedIsLoading,
    // error: LiveClassInvitedError,
    totalData: LiveClassInviteTotalData,
  } = useGet<LiveLearningDataType[]>('/user/getUserLiveClassInvited', {
    params: {
      ...(type ? { type } : {}),
      ...(webSubCategoryId
        ? { website_sub_category_id: webSubCategoryId }
        : {}),
    },
    useEffectDependencies: [type, webSubCategoryId],
    enabled: Boolean(webSubCategoryId),
  });

  // Attendance Report
  const { data: attendanceReport } = useGet<{
    report: {
      id: string;
      attendanceStatus: 'PRESENT' | 'LATE' | 'ABSENT' | 'UPCOMING';
    }[];
    summary: {
      total: number;
      present: number;
      late: number;
      absent: number;
      upcoming: number;
      attendanceRate: number;
    };
  }>('/liveClass/getAttendanceReport', {
    params: {
      take: 100,
      page: 1,
      ...(type ? { type } : {}),
      ...(webSubCategoryId
        ? { website_sub_category_id: webSubCategoryId }
        : {}),
    },
    useEffectDependencies: [type, webSubCategoryId],
    enabled: Boolean(webSubCategoryId),
  });

  // Create attendance status map for quick lookup
  const attendanceStatusMap = new Map(
    attendanceReport?.report?.map((r) => [r.id, r.attendanceStatus]) || [],
  );

  const { data: Categories } = useGet<Category[]>(
    '/category/getAllCategories',
    {
      params: webSubCategoryId
        ? { website_sub_category_id: webSubCategoryId }
        : undefined,
      useEffectDependencies: [webSubCategoryId],
      enabled: Boolean(webSubCategoryId),
    },
  );

  console.log({
    LiveClassAvailable,
    LiveClassRegistered,
    LiveClassCompleted,
    LiveClassInvited,
  });

  useEffect(() => {
    trackUnifiedEvent({
      eventName: 'ViewContent',
      customData: {
        content_name: 'Live Class Page',
        content_type: 'page',
        content_id: 'live_class_page_main',
      },
      user: session?.user
        ? {
            email: session.user.email,
            phone: session.user.phone || undefined,
            userId: session.user.id,
            firstName: session.user.name?.split(' ')[0],
            lastName: session.user.name?.split(' ').slice(1).join(' '),
          }
        : undefined,
    });
  }, [session]);

  return (
    <PageShell className="py-6">
      <LiveClassHeader
        typeLabel={typeLabel}
        TypeIcon={TypeIcon}
        mainColor={mainColor}
        secondaryColor={secondaryColor}
        attendanceSummary={attendanceReport?.summary}
        upcomingClasses={LiveClassAvailable ?? undefined}
        onViewAllClick={() => setActiveTab('available')}
      />

        <LiveClassFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedSubject={selectedSubject}
          onSubjectChange={setSelectedSubject}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          categories={Categories ?? undefined}
        />

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-4 mb-6 md:mb-8 bg-gray-50 rounded-3xl p-1 h-11 md:h-12 border-2 border-gray-100">
            <TabsTrigger
              value="available"
              className="flex items-center gap-2 rounded-3xl px-3 md:px-4 py-2 text-xs md:text-sm font-bold transition-all duration-200 text-gray-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
              style={
                { '--tw-bg-opacity': '1' } as React.CSSProperties & {
                  [key: string]: string;
                }
              }
              data-active-bg={mainColor}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline font-bold">
                {typeLabel} Tersedia
              </span>
              <span className="sm:hidden font-bold">Semua</span>
              <NotificationBadge
                count={
                  LiveClassAvailableTotalData || LiveClassAvailable?.length || 0
                }
              />
            </TabsTrigger>
            <TabsTrigger
              value="registered"
              className="flex items-center gap-2 rounded-3xl px-3 md:px-4 py-2 text-xs md:text-sm font-bold transition-all duration-200 text-gray-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
              style={
                { '--tw-bg-opacity': '1' } as React.CSSProperties & {
                  [key: string]: string;
                }
              }
              data-active-bg={mainColor}
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline font-bold">Terdaftar</span>
              <span className="sm:hidden font-bold">Daftar</span>
              <NotificationBadge
                count={
                  LiveClassRegisteredTotalData ||
                  LiveClassRegistered?.length ||
                  0
                }
                variant="yellow"
              />
            </TabsTrigger>
            <TabsTrigger
              value="invited"
              className="flex items-center gap-2 rounded-3xl px-3 md:px-4 py-2 text-xs md:text-sm font-bold transition-all duration-200 text-gray-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
              style={
                { '--tw-bg-opacity': '1' } as React.CSSProperties & {
                  [key: string]: string;
                }
              }
              data-active-bg={mainColor}
            >
              <Video className="w-4 h-4" />
              <span className="hidden sm:inline font-bold">Diundang</span>
              <span className="sm:hidden font-bold">Live</span>
              <NotificationBadge
                count={
                  LiveClassInviteTotalData || LiveClassInvited?.length || 0
                }
                variant="green"
              />
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="flex items-center gap-2 rounded-3xl px-3 md:px-4 py-2 text-xs md:text-sm font-bold transition-all duration-200 text-gray-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
              style={
                { '--tw-bg-opacity': '1' } as React.CSSProperties & {
                  [key: string]: string;
                }
              }
              data-active-bg={mainColor}
            >
              <Check className="w-4 h-4" />
              <span className="hidden sm:inline font-bold">Selesai</span>
              <span className="sm:hidden font-bold">Selesai</span>
              <NotificationBadge
                count={
                  LiveClassCompletedTotalData || LiveClassCompleted?.length || 0
                }
                variant="green"
              />
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="available"
            className="space-y-4"
          >
            {LiveClassAvailableError ? (
              <div className="bg-orange-50 border-2 border-orange-200 rounded-3xl p-6 text-center">
                <div className="text-orange-500 mb-3">
                  <svg
                    className="h-12 w-12 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-orange-800 mb-2">
                  Fitur Multi-Plan Tidak Tersedia
                </h3>
                <p className="text-orange-600">
                  Terjadi kesalahan saat memuat data multi-plan. Anda masih
                  dapat menggunakan tab lain.
                </p>
              </div>
            ) : LiveClassAvailableIsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="border rounded-3xl p-4 animate-pulse"
                  >
                    <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded w-24"></div>
                  </div>
                ))}
              </div>
            ) : viewMode === 'calendar' ? (
              <CalendarView
                liveClass={LiveClassAvailable || []}
                onJoin={() => {}}
                onRate={() => {}}
                onUpgrade={() => {}}
              />
            ) : (
              <>
                {LiveClassAvailable && LiveClassAvailable?.length > 0 && (
                  <div
                    className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : ''}`}
                  >
                    {LiveClassAvailable?.map((liveClass) => (
                      <LiveClassCard
                        key={liveClass.id}
                        liveClass={liveClass}
                        onJoin={() => {}}
                        onRate={() => {}}
                        viewMode={viewMode}
                        isRegistrationStep={true}
                        onFinishRegistered={async () => {
                          await LiveClassAvailableRefetch();
                          await LiveClassRegisteredRefetch();
                        }}
                      />
                    ))}
                  </div>
                )}
                {LiveClassAvailable?.length === 0 && (
                  <DSEmptyState
                    icon={Crown}
                    color="amber"
                    title="Belum ada live class premium"
                    description="Live class premium dengan plan requirements akan muncul di sini. Saat ini belum ada live class yang dikaitkan dengan paket premium."
                  />
                )}
              </>
            )}
          </TabsContent>

          <TabsContent
            value="registered"
            className="space-y-4"
          >
            {viewMode === 'calendar' ? (
              <CalendarView
                liveClass={LiveClassRegistered || []}
                onJoin={() => {}}
                onRate={() => {}}
                onUpgrade={() => {}}
              />
            ) : LiveClassRegistered && LiveClassRegistered?.length > 0 ? (
              <div
                className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : ''}`}
              >
                {LiveClassRegistered?.map((liveClass) => (
                  <LiveClassCard
                    key={liveClass.id}
                    liveClass={liveClass}
                    onJoin={() => {}}
                    onRate={() => {}}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <DSEmptyState
                icon={Users}
                color="blue"
                title="Belum ada kelas terdaftar"
                description="Kelas yang sudah Anda daftarkan akan muncul di sini."
              />
            )}
          </TabsContent>

          <TabsContent
            value="invited"
            className="space-y-4"
          >
            {viewMode === 'calendar' ? (
              <CalendarView
                liveClass={LiveClassInvited || []}
                onJoin={() => {}}
                onRate={() => {}}
                onUpgrade={() => {}}
              />
            ) : LiveClassInvited && LiveClassInvited?.length > 0 ? (
              <div
                className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : ''}`}
              >
                {LiveClassInvited?.map((liveClass) => (
                  <LiveClassCard
                    key={liveClass.id}
                    liveClass={liveClass}
                    onJoin={() => {}}
                    onRate={() => {}}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <DSEmptyState
                icon={Video}
                color="purple"
                title="Belum ada undangan kelas"
                description="Kelas yang sudah diundang admin akan muncul di sini."
              />
            )}
          </TabsContent>

          <TabsContent
            value="completed"
            className="space-y-4"
          >
            {viewMode === 'calendar' ? (
              <CalendarView
                liveClass={LiveClassCompleted || []}
                onJoin={() => {}}
                onRate={() => {}}
                onUpgrade={() => {}}
              />
            ) : LiveClassCompleted && LiveClassCompleted?.length > 0 ? (
              <div
                className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : ''}`}
              >
                {LiveClassCompleted?.map((liveClass) => (
                  <LiveClassCard
                    key={liveClass.id}
                    liveClass={liveClass}
                    onJoin={() => {}}
                    onRate={() => {}}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <DSEmptyState
                icon={Clock}
                color="blue"
                title="Belum ada kelas selesai"
                description="Kelas yang sudah selesai akan muncul di sini."
              />
            )}
          </TabsContent>
        </Tabs>

        {/* <RatingModal
          isOpen={ratingModal.isOpen}
          onClose={closeRatingModal}
          liveClass={ratingModal.liveClass}
          onSubmit={handleRatingSubmit}
        />
        <JoinLiveClassModal
          isOpen={joinModal.isOpen}
          onClose={closeJoinModal}
          liveClass={joinModal.liveClass}
          onSuccess={handleJoinSuccess}
        /> */}
    </PageShell>
  );
}
