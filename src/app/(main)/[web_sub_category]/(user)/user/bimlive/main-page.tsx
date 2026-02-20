'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  website_sub_category_id,
  website_sub_category_id_params,
} from '@/hooks/use-web-sub-category-id';
import { useGet } from '@/lib/fetch-helper/useGet';
import { trackUnifiedEvent } from '@/lib/tracking/track';
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
  AlertCircle,
  Award,
  Bell,
  BookOpen,
  Calendar,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  Crown,
  Eye,
  LayoutGrid,
  PlayCircle,
  Search,
  Timer,
  UserCheck,
  Users,
  Video,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DialogLiveClassRegister } from './_components/dialog-live-class-register';
import { CalendarView } from './_components/live-class-calendar-view';
import { useCountdown } from './_components/live-class-hooks';
import { CountdownTimer } from './_components/live-class-shared-components';

// ─── Types ─────────────────────────────────────────────────────────────────────

export type LiveLearningDataType = LiveClass & {
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
  participantStatus?: 'Diundang' | 'Terdaftar' | 'Tidak Terdaftar';
};

const TAB_IDS = ['available', 'registered', 'invited', 'completed'] as const;
type TabId = (typeof TAB_IDS)[number];

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function LiveLearningDashboard({
  type,
}: {
  type?: 'LIVECLASS' | 'LIVESTREAM' | 'WEBINAR';
}) {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';
  const webSubCategoryId =
    website_sub_category_id ?? website_sub_category_id_params;

  const [activeTab, setActiveTab] = useState<TabId>('available');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');
  const hasAutoSelected = useRef(false);

  const typeLabel =
    type === 'LIVECLASS'
      ? 'Live Class'
      : type === 'LIVESTREAM'
        ? 'Livestream'
        : type === 'WEBINAR'
          ? 'Webinar'
          : 'Live Learning';

  const TypeIcon =
    type === 'LIVESTREAM' ? PlayCircle : type === 'WEBINAR' ? Users : Video;

  // ─── Data ──────────────────────────────────────────────────────────────────

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

  const { data: LiveClassCompleted, totalData: LiveClassCompletedTotalData } =
    useGet<LiveLearningDataType[]>('/liveClass/getAllLiveClassCompleted', {
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

  const { data: LiveClassInvited, totalData: LiveClassInviteTotalData } =
    useGet<LiveLearningDataType[]>('/user/getUserLiveClassInvited', {
      params: {
        ...(type ? { type } : {}),
        ...(webSubCategoryId
          ? { website_sub_category_id: webSubCategoryId }
          : {}),
      },
      useEffectDependencies: [type, webSubCategoryId],
      enabled: Boolean(webSubCategoryId),
    });

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

  // ─── Filter ────────────────────────────────────────────────────────────────

  const applyFilter = useCallback(
    (list: LiveLearningDataType[] | null | undefined, sortDesc = false) => {
      if (!list) return [];
      const q = searchQuery.toLowerCase();
      const filtered = list.filter((lc) => {
        const matchSearch =
          !q ||
          lc.title.toLowerCase().includes(q) ||
          lc.Instructor.name.toLowerCase().includes(q);
        const matchSubject =
          selectedSubject === 'all' || lc.categoryId === selectedSubject;
        const matchStatus =
          selectedStatus === 'all' || lc.status === selectedStatus;
        return matchSearch && matchSubject && matchStatus;
      });
      // Sort: ascending = soonest first (available/registered/invited), descending = most recently done first (completed)
      return filtered.sort((a, b) => {
        const diff =
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        return sortDesc ? -diff : diff;
      });
    },
    [searchQuery, selectedSubject, selectedStatus],
  );

  const filteredAvailable = useMemo(
    () => applyFilter(LiveClassAvailable),
    [applyFilter, LiveClassAvailable],
  );
  const filteredRegistered = useMemo(
    () => applyFilter(LiveClassRegistered),
    [applyFilter, LiveClassRegistered],
  );
  const filteredInvited = useMemo(
    () => applyFilter(LiveClassInvited),
    [applyFilter, LiveClassInvited],
  );
  const filteredCompleted = useMemo(
    () => applyFilter(LiveClassCompleted, true),
    [applyFilter, LiveClassCompleted],
  );

  // ─── Auto-select first populated tab ───────────────────────────────────────

  const tabCountsRaw = useMemo(
    () => ({
      available: LiveClassAvailable?.length ?? null,
      registered: LiveClassRegistered?.length ?? null,
      invited: LiveClassInvited?.length ?? null,
      completed: LiveClassCompleted?.length ?? null,
    }),
    [
      LiveClassAvailable,
      LiveClassRegistered,
      LiveClassInvited,
      LiveClassCompleted,
    ],
  );

  useEffect(() => {
    if (hasAutoSelected.current) return;
    if (tabCountsRaw.available === null) return;
    for (const id of TAB_IDS) {
      const count = tabCountsRaw[id];
      if (count === null) continue;
      if (count > 0) {
        setActiveTab(id);
        hasAutoSelected.current = true;
        return;
      }
    }
    if (TAB_IDS.every((id) => tabCountsRaw[id] !== null)) {
      hasAutoSelected.current = true;
    }
  }, [tabCountsRaw]);

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

  // ─── Tab config ────────────────────────────────────────────────────────────

  const tabItems: {
    id: TabId;
    label: string;
    icon: React.ElementType;
    count: number;
  }[] = [
    {
      id: 'available',
      label: 'Tersedia',
      icon: BookOpen,
      count: LiveClassAvailableTotalData || LiveClassAvailable?.length || 0,
    },
    {
      id: 'registered',
      label: 'Terdaftar',
      icon: UserCheck,
      count: LiveClassRegisteredTotalData || LiveClassRegistered?.length || 0,
    },
    {
      id: 'invited',
      label: 'Diundang',
      icon: Bell,
      count: LiveClassInviteTotalData || LiveClassInvited?.length || 0,
    },
    {
      id: 'completed',
      label: 'Selesai',
      icon: Check,
      count: LiveClassCompletedTotalData || LiveClassCompleted?.length || 0,
    },
  ];

  const summary = attendanceReport?.summary;

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen pb-12">
      {/* Page title + attendance summary */}
      <div className="p-4 md:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${mainColor}20` }}
          >
            <TypeIcon
              className="w-5 h-5"
              style={{ color: mainColor }}
            />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">{typeLabel}</h1>
            <p className="text-xs text-slate-400 font-medium">
              Ikuti kelas langsung bersama tutor ahli
            </p>
          </div>
        </div>

        {/* Attendance pills */}
        {summary && summary.total > 0 && (
          <div
            className="flex items-center gap-2 overflow-x-auto pb-1"
            style={{ scrollbarWidth: 'none' }}
          >
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 flex-shrink-0">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span className="text-[10px] font-bold text-emerald-700">
                {summary.present} Hadir
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 flex-shrink-0">
              <AlertCircle className="w-3 h-3 text-amber-600" />
              <span className="text-[10px] font-bold text-amber-700">
                {summary.late} Terlambat
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 flex-shrink-0">
              <Clock className="w-3 h-3 text-blue-600" />
              <span className="text-[10px] font-bold text-blue-700">
                {summary.upcoming} Mendatang
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-100 flex-shrink-0">
              <Award className="w-3 h-3 text-violet-600" />
              <span className="text-[10px] font-bold text-violet-700">
                {summary.attendanceRate}% Kehadiran
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-0">
        {/* Filter row */}
        <div className="flex flex-col sm:flex-row gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <Input
              placeholder="Cari judul atau nama tutor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 rounded-2xl border-slate-200 bg-white shadow-sm font-medium text-sm"
            />
          </div>
          <Select
            value={selectedSubject}
            onValueChange={setSelectedSubject}
          >
            <SelectTrigger className="w-full sm:w-[170px] h-10 rounded-2xl border-slate-200 bg-white shadow-sm font-semibold text-sm">
              <SelectValue placeholder="Semua Mapel" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="all">Semua Mapel</SelectItem>
              {Categories?.map((cat) => (
                <SelectItem
                  key={cat.id}
                  value={cat.id}
                >
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedStatus}
            onValueChange={setSelectedStatus}
          >
            <SelectTrigger className="w-full sm:w-[150px] h-10 rounded-2xl border-slate-200 bg-white shadow-sm font-semibold text-sm">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="Akan Datang">Akan Datang</SelectItem>
              <SelectItem value="Sedang Berlangsung">Berlangsung</SelectItem>
              <SelectItem value="Selesai">Selesai</SelectItem>
            </SelectContent>
          </Select>
          {/* View toggle */}
          <div className="flex bg-white border border-slate-200 shadow-sm rounded-2xl p-1 gap-1 h-10 flex-shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'flex items-center gap-1.5 px-3 rounded-xl text-xs font-bold transition-all',
                viewMode === 'grid'
                  ? 'text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700',
              )}
              style={
                viewMode === 'grid' ? { background: mainColor } : undefined
              }
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={cn(
                'flex items-center gap-1.5 px-3 rounded-xl text-xs font-bold transition-all',
                viewMode === 'calendar'
                  ? 'text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700',
              )}
              style={
                viewMode === 'calendar' ? { background: mainColor } : undefined
              }
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kalender</span>
            </button>
          </div>
        </div>

        {/* ─── Sticky Tab Navigation — identical to bimarena ─────────────────── */}
        <div className="sticky top-0 z-30 bg-slate-50/80 backdrop-blur-xl py-2">
          <div
            className="flex gap-1.5 p-1 bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-x-auto"
            style={{ scrollbarWidth: 'none' }}
          >
            {tabItems.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'relative flex items-center gap-1.5 px-4 py-2.5 rounded-3xl font-bold text-xs md:text-sm transition-all whitespace-nowrap flex-1 justify-center min-w-0',
                    isActive
                      ? 'text-white shadow-lg'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50',
                  )}
                >
                  {isActive && (
                    <div
                      className="absolute inset-0 rounded-3xl"
                      style={{ background: mainColor }}
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <span>{tab.label}</span>
                    {tab.count > 0 && (
                      <span
                        className={cn(
                          'text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none',
                          isActive
                            ? 'bg-white/25 text-white'
                            : 'bg-slate-100 text-slate-500',
                        )}
                      >
                        {tab.count}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Tab Content Card — identical frame to bimarena ────────────────── */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden mt-2">
          <div className={cn(activeTab !== 'available' && 'hidden')}>
            <LiveClassSection
              icon={<Video className="w-4 h-4 text-blue-600" />}
              iconBg="bg-blue-100"
              title={`${typeLabel} Tersedia`}
              subtitle="Daftar dan ikuti kelas yang tersedia untukmu"
              count={filteredAvailable.length}
              isLoading={LiveClassAvailableIsLoading}
              hasError={Boolean(LiveClassAvailableError)}
              viewMode={viewMode}
              data={filteredAvailable}
              mainColor={mainColor}
              secondaryColor={secondaryColor}
              emptyIcon={<Video className="w-10 h-10 text-slate-300" />}
              emptyTitle="Belum ada live class tersedia"
              emptyDesc="Live class baru akan segera hadir. Pantau terus halaman ini!"
              isRegistrationStep
              onFinishRegistered={async () => {
                await LiveClassAvailableRefetch();
                await LiveClassRegisteredRefetch();
              }}
            />
          </div>
          <div className={cn(activeTab !== 'registered' && 'hidden')}>
            <LiveClassSection
              icon={<UserCheck className="w-4 h-4 text-emerald-600" />}
              iconBg="bg-emerald-100"
              title={`${typeLabel} Terdaftar`}
              subtitle="Kelas yang sudah kamu daftarkan"
              count={filteredRegistered.length}
              isLoading={false}
              hasError={false}
              viewMode={viewMode}
              data={filteredRegistered}
              mainColor={mainColor}
              secondaryColor={secondaryColor}
              emptyIcon={<Users className="w-10 h-10 text-slate-300" />}
              emptyTitle="Belum ada kelas terdaftar"
              emptyDesc="Kelas yang kamu daftarkan akan muncul di sini."
            />
          </div>
          <div className={cn(activeTab !== 'invited' && 'hidden')}>
            <LiveClassSection
              icon={<Bell className="w-4 h-4 text-purple-600" />}
              iconBg="bg-purple-100"
              title={`Undangan ${typeLabel}`}
              subtitle="Kelas yang diundang khusus untukmu"
              count={filteredInvited.length}
              isLoading={false}
              hasError={false}
              viewMode={viewMode}
              data={filteredInvited}
              mainColor={mainColor}
              secondaryColor={secondaryColor}
              emptyIcon={<Bell className="w-10 h-10 text-slate-300" />}
              emptyTitle="Belum ada undangan"
              emptyDesc="Undangan kelas eksklusif dari admin akan muncul di sini."
            />
          </div>
          <div className={cn(activeTab !== 'completed' && 'hidden')}>
            <LiveClassSection
              icon={<Check className="w-4 h-4 text-slate-600" />}
              iconBg="bg-slate-100"
              title={`${typeLabel} Selesai`}
              subtitle="Rekap kelas yang telah kamu ikuti"
              count={filteredCompleted.length}
              isLoading={false}
              hasError={false}
              viewMode={viewMode}
              data={filteredCompleted}
              mainColor={mainColor}
              secondaryColor={secondaryColor}
              emptyIcon={<Clock className="w-10 h-10 text-slate-300" />}
              emptyTitle="Belum ada kelas selesai"
              emptyDesc="Kelas yang sudah selesai akan tercatat di sini."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section wrapper (same as Terbaru/Upcoming in bimarena) ────────────────────

function LiveClassSection({
  icon,
  iconBg,
  title,
  subtitle,
  count,
  isLoading,
  hasError,
  viewMode,
  data,
  mainColor,
  secondaryColor,
  emptyIcon,
  emptyTitle,
  emptyDesc,
  isRegistrationStep = false,
  onFinishRegistered,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  count: number;
  isLoading: boolean;
  hasError: boolean;
  viewMode: 'grid' | 'calendar';
  data: LiveLearningDataType[];
  mainColor: string;
  secondaryColor: string;
  emptyIcon: React.ReactNode;
  emptyTitle: string;
  emptyDesc: string;
  isRegistrationStep?: boolean;
  onFinishRegistered?: () => Promise<void>;
}) {
  return (
    <div className="p-4 md:p-6">
      {/* Section header — identical to terbaru.tsx */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className={cn(
            'w-8 h-8 rounded-3xl flex items-center justify-center flex-shrink-0',
            iconBg,
          )}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-base font-black text-slate-800">{title}</h3>
          <p className="text-xs text-slate-400 font-medium">{subtitle}</p>
        </div>
        {!isLoading && count > 0 && (
          <Badge className="ml-auto bg-slate-50 text-slate-700 border-slate-200 text-[10px] font-bold">
            {count} kelas
          </Badge>
        )}
      </div>

      {/* Error state */}
      {hasError && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-5 text-center">
          <p className="text-red-700 font-bold text-sm">
            Gagal memuat data. Silakan refresh halaman.
          </p>
        </div>
      )}

      {/* Loading skeletons */}
      {isLoading && (
        <div
          className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x md:grid md:grid-cols-2 md:overflow-visible md:pb-0 md:mx-0 md:px-0 md:gap-5 lg:grid-cols-3"
          style={
            {
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            } as React.CSSProperties
          }
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-[520px] min-w-[80%] sm:min-w-[320px] md:min-w-0 md:w-full rounded-3xl shrink-0 snap-center"
            />
          ))}
        </div>
      )}

      {/* Calendar view */}
      {!isLoading && !hasError && viewMode === 'calendar' && (
        <CalendarView
          liveClass={data}
          onJoin={() => {}}
          onRate={() => {}}
          onUpgrade={() => {}}
        />
      )}

      {/* Grid view */}
      {!isLoading && !hasError && viewMode === 'grid' && data.length > 0 && (
        <div
          className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x md:grid md:grid-cols-2 md:overflow-visible md:pb-0 md:mx-0 md:px-0 md:gap-5 lg:grid-cols-3 xl:grid-cols-4"
          style={
            {
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            } as React.CSSProperties
          }
        >
          {data.map((lc) => (
            <LiveClassCard
              key={lc.id}
              liveClass={lc}
              mainColor={mainColor}
              secondaryColor={secondaryColor}
              isRegistrationStep={isRegistrationStep}
              onFinishRegistered={onFinishRegistered}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !hasError && viewMode === 'grid' && data.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mb-4">
            {emptyIcon}
          </div>
          <h4 className="text-base font-bold text-slate-700 mb-1">
            {emptyTitle}
          </h4>
          <p className="text-sm text-slate-400 max-w-xs">{emptyDesc}</p>
        </div>
      )}
    </div>
  );
}

// ─── LiveClassCard — mirrors card-tryout.tsx structure exactly ─────────────────
// Image: aspect-[4/5], full width, NO text overlay.
// Status badge TOP-LEFT, access badge TOP-RIGHT.
// Instructor info, title, stats grid, timer, and actions all BELOW image.

function LiveClassCard({
  liveClass,
  mainColor,
  secondaryColor,
  isRegistrationStep = false,
  onFinishRegistered,
}: {
  liveClass: LiveLearningDataType;
  mainColor: string;
  secondaryColor: string;
  isRegistrationStep?: boolean;
  onFinishRegistered?: () => Promise<void>;
}) {
  const timeLeft = useCountdown(liveClass.startDate);
  const isLive = liveClass.status === 'Sedang Berlangsung';
  const isDone = liveClass.status === 'Selesai';
  const isUpcoming = liveClass.status === 'Akan Datang' && !timeLeft.isExpired;

  const instructorInitials = liveClass.Instructor.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('');

  // Registration badge — mirrors getBadgeValue from card-tryout
  const statusBadge = liveClass.isRegistered
    ? {
        className: 'bg-green-50 text-green-700 border-green-200 font-medium',
        label: 'Terdaftar',
        icon: <CheckCircle2 className="w-3 h-3" />,
      }
    : isLive
      ? {
          className:
            'bg-red-50 text-red-700 border-red-200 font-medium animate-pulse',
          label: 'LIVE',
          icon: (
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          ),
        }
      : isDone
        ? {
            className:
              'bg-slate-100 text-slate-600 border-slate-200 font-medium',
            label: 'Selesai',
            icon: <Check className="w-3 h-3" />,
          }
        : {
            className: 'bg-blue-50 text-blue-700 border-blue-200 font-medium',
            label: 'Segera',
            icon: <Clock className="w-3 h-3" />,
          };

  return (
    <Card
      className={cn(
        'group relative overflow-hidden border-2 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01] rounded-3xl min-w-[85%] sm:min-w-[300px] md:min-w-0 flex-shrink-0 snap-center md:flex-shrink md:snap-none',
        liveClass.accessType === 'PREMIUM'
          ? 'border-gray-100 bg-white'
          : 'border-emerald-200 bg-emerald-50/30',
      )}
    >
      {/* Registration status badge — top right */}
      <div className="absolute top-4 right-4 z-20">
        <Badge className={cn('flex items-center gap-1', statusBadge.className)}>
          {statusBadge.icon}
          <span className="text-xs">{statusBadge.label}</span>
        </Badge>
      </div>

      {/* Access type badge — top left */}
      <div className="absolute top-4 left-4 z-20">
        {liveClass.accessType === 'PREMIUM' ? (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 font-bold flex items-center gap-1">
            <Crown className="w-3 h-3" />
            <span className="text-xs">Premium</span>
          </Badge>
        ) : (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold flex items-center gap-1">
            <Award className="w-3 h-3" />
            <span className="text-xs">Gratis</span>
          </Badge>
        )}
      </div>

      <CardContent className="p-0">
        {/* ── Hero Image — aspect-[4/5], no text overlay ── */}
        <div className="relative w-full aspect-[4/5] overflow-hidden">
          {liveClass.image ? (
            <Image
              src={liveClass.image}
              alt={liveClass.title}
              fill
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 25vw"
            />
          ) : liveClass.Instructor.image ? (
            <Image
              src={liveClass.Instructor.image}
              alt={liveClass.Instructor.name}
              fill
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 90vw, 25vw"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
            >
              <Video className="w-14 h-14 text-white opacity-40" />
            </div>
          )}
        </div>

        {/* ── Content section — all text/info below image ── */}
        <div className="p-4 lg:p-5 space-y-3">
          {/* Instructor row */}
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7 border-2 border-slate-100 flex-shrink-0">
              <AvatarImage src={liveClass.Instructor.image || undefined} />
              <AvatarFallback
                className="text-[10px] font-black text-white"
                style={{ background: mainColor }}
              >
                {instructorInitials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-700 truncate">
                {liveClass.Instructor.name}
              </p>
              {liveClass.Instructor.certificate && (
                <p className="text-[10px] text-slate-400 truncate">
                  {liveClass.Instructor.certificate}
                </p>
              )}
            </div>
          </div>

          {/* Title */}
          <h3
            className="font-bold leading-tight text-gray-900 line-clamp-2"
            title={liveClass.title}
          >
            {liveClass.title}
          </h3>
          {liveClass.Category && (
            <p className="text-xs text-gray-500">{liveClass.Category.name}</p>
          )}

          {/* Stats grid — 4 cols, mirrors bimarena card */}
          <div className="grid grid-cols-4 gap-2">
            <div className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl border bg-blue-50/50 border-blue-100">
              <Calendar className="w-3.5 h-3.5 text-blue-600 mb-1" />
              <div className="text-[10px] font-bold text-blue-700 text-center leading-tight">
                {new Date(liveClass.startDate).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                })}
              </div>
              <div className="text-[9px] text-blue-500 font-medium mt-0.5">
                Mulai
              </div>
            </div>
            <div className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl border bg-green-50/50 border-green-100">
              <Clock className="w-3.5 h-3.5 text-green-600 mb-1" />
              <div className="text-[10px] font-bold text-green-700 leading-none">
                {liveClass.duration}
              </div>
              <div className="text-[9px] text-green-500 font-medium mt-0.5">
                Menit
              </div>
            </div>
            <div className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl border bg-purple-50/50 border-purple-100">
              <Users className="w-3.5 h-3.5 text-purple-600 mb-1" />
              <div className="text-[10px] font-bold text-purple-700 leading-none">
                {liveClass.participants?.length || 0}
              </div>
              <div className="text-[9px] text-purple-500 font-medium mt-0.5">
                Peserta
              </div>
            </div>
            <div className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl border bg-orange-50/50 border-orange-100">
              <Eye className="w-3.5 h-3.5 text-orange-600 mb-1" />
              <div className="text-[10px] font-bold text-orange-700 leading-none text-center">
                {new Date(liveClass.startDate).toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
              <div className="text-[9px] text-orange-500 font-medium mt-0.5">
                WIB
              </div>
            </div>
          </div>

          {/* Countdown timer — below stats, not on image */}
          {isUpcoming && !timeLeft.isExpired && (
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Timer
                  className="w-3.5 h-3.5"
                  style={{ color: mainColor }}
                />
                <span className="text-[11px] font-bold text-slate-500">
                  Mulai dalam
                </span>
              </div>
              <CountdownTimer timeLeft={timeLeft} />
            </div>
          )}

          {isLive && (
            <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-2xl bg-red-50 border border-red-200">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-black text-red-600">
                Sedang Berlangsung
              </span>
            </div>
          )}
        </div>
      </CardContent>

      {/* ── Action footer ── */}
      <CardFooter className="p-4 lg:p-5 pt-0 flex gap-2">
        <Link
          href={`/${website_sub_category_id}/user/bimlive/detail/${liveClass.id}`}
          className="flex-1"
        >
          <Button
            variant="outline"
            size="sm"
            className="w-full h-10 rounded-2xl border-slate-200 font-bold text-xs gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            Detail
          </Button>
        </Link>

        {isRegistrationStep &&
          liveClass.accessType !== 'PREMIUM' &&
          liveClass.isRegistered === false &&
          onFinishRegistered && (
            <DialogLiveClassRegister
              liveClassId={liveClass.id}
              onFinish={onFinishRegistered}
              liveClassAccessType={liveClass.accessType}
            >
              <Button
                size="sm"
                className="flex-1 h-10 rounded-2xl font-bold text-xs text-white border-0 shadow-sm hover:opacity-90 gap-1.5"
                style={{ background: mainColor }}
              >
                <UserCheck className="w-3.5 h-3.5" />
                Daftar
              </Button>
            </DialogLiveClassRegister>
          )}

        {isRegistrationStep &&
          liveClass.accessType !== 'PREMIUM' &&
          liveClass.isRegistered === true && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-10 rounded-2xl font-bold text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Terdaftar
            </Button>
          )}

        {liveClass.accessType === 'PREMIUM' && (
          <div className="flex-1 h-10 px-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl flex items-center justify-center gap-1.5">
            <Crown className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-xs font-black text-amber-700">Premium</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
