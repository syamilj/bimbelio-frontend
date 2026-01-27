'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  website_sub_category_id,
  website_sub_category_id_params,
} from '@/hooks/use-web-sub-category-id';
import { useGet } from '@/lib/fetch-helper/useGet';
import { trackUnifiedEvent } from '@/lib/tracking/track';
import { formatDateTime, formatDuration } from '@/lib/utils';
import { getStatusColor } from '@/lib/utils/live-class';
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
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Crown,
  Eye,
  PlayCircle,
  Search,
  Star,
  Target,
  Timer,
  UserCheck,
  Users,
  Video,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import './_components/_style.css'; // Keep the CSS import here if it's specific to the dashboard layout
import { DialogLiveClassRegister } from './_components/dialog-live-class-register';
import { CalendarView } from './_components/live-class-calendar-view';
import { useCountdown } from './_components/live-class-hooks';
import {
  CountdownTimer,
  EmptyState,
  MarketingCTA,
  NotificationBadge,
  PreviewContent,
} from './_components/live-class-shared-components';

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
  const webSubCategoryId = website_sub_category_id ?? website_sub_category_id_params;

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
      ...(webSubCategoryId ? { website_sub_category_id: webSubCategoryId } : {}),
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
      ...(webSubCategoryId ? { website_sub_category_id: webSubCategoryId } : {}),
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
      ...(webSubCategoryId ? { website_sub_category_id: webSubCategoryId } : {}),
    },
    enabled: LiveClassAvailableIsLoading === false && Boolean(webSubCategoryId),
    useEffectDependencies: [type, LiveClassAvailableIsLoading, webSubCategoryId],
  });

  const {
    data: LiveClassInvited,
    // isLoading: LiveClassInvitedIsLoading,
    // error: LiveClassInvitedError,
    totalData: LiveClassInviteTotalData,
  } = useGet<LiveLearningDataType[]>('/user/getUserLiveClassInvited', {
    params: {
      ...(type ? { type } : {}),
      ...(webSubCategoryId ? { website_sub_category_id: webSubCategoryId } : {}),
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
      ...(webSubCategoryId ? { website_sub_category_id: webSubCategoryId } : {}),
    },
    useEffectDependencies: [type, webSubCategoryId],
    enabled: Boolean(webSubCategoryId),
  });

  // Create attendance status map for quick lookup
  const attendanceStatusMap = new Map(
    attendanceReport?.report?.map((r) => [r.id, r.attendanceStatus]) || []
  );

  const { data: Categories } = useGet<Category[]>('/category/getAllCategories', {
    params: webSubCategoryId ? { website_sub_category_id: webSubCategoryId } : undefined,
    useEffectDependencies: [webSubCategoryId],
    enabled: Boolean(webSubCategoryId),
  });

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
    <div className="min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 py-6">
        {/* ENHANCED HEADER - LEADERBOARD PATTERN */}
        <Card className="bg-white shadow-sm border-2 border-gray-100 rounded-3xl overflow-hidden mb-8">
          <CardHeader
            className="pb-6 border-b-2 border-gray-100 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
            }}
          >
            <div className="relative z-10">
              <CardTitle className="text-3xl font-black flex items-center gap-4 text-gray-900">
                <div
                  className="w-12 h-12 rounded-3xl flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: `${mainColor}15` }}
                >
                  <TypeIcon
                    className="w-6 h-6"
                    style={{ color: mainColor }}
                  />
                </div>
                {typeLabel} Dashboard
              </CardTitle>
              <CardDescription className="text-lg mt-3 text-gray-500 font-medium">
                Ikuti kelas langsung dengan tutor ahli dan tingkatkan persiapan
                ujian Anda
              </CardDescription>
            </div>
          </CardHeader>
          {/* STATS CARDS - LEADERBOARD PATTERN */}
          <CardContent className="p-6">
            {/* Attendance Stats */}
            {attendanceReport?.summary && attendanceReport.summary.total > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-black text-gray-900">
                    Statistik Kehadiran
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="bg-emerald-50 rounded-3xl p-4 border-2 border-emerald-200">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-emerald-700">Hadir</span>
                    </div>
                    <p className="text-2xl font-black text-emerald-900">
                      {attendanceReport.summary.present}
                    </p>
                  </div>
                  <div className="bg-yellow-50 rounded-3xl p-4 border-2 border-yellow-200">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                      <span className="text-xs font-bold text-yellow-700">Terlambat</span>
                    </div>
                    <p className="text-2xl font-black text-yellow-900">
                      {attendanceReport.summary.late}
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-3xl p-4 border-2 border-red-200">
                    <div className="flex items-center gap-2 mb-1">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span className="text-xs font-bold text-red-700">Tidak Hadir</span>
                    </div>
                    <p className="text-2xl font-black text-red-900">
                      {attendanceReport.summary.absent}
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-3xl p-4 border-2 border-blue-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-bold text-blue-700">Akan Datang</span>
                    </div>
                    <p className="text-2xl font-black text-blue-900">
                      {attendanceReport.summary.upcoming}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-4 border-2 border-indigo-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-bold text-indigo-700">Tingkat Kehadiran</span>
                    </div>
                    <p className="text-2xl font-black text-indigo-900">
                      {attendanceReport.summary.attendanceRate}%
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Upcoming Live Classes - Responsive Grid */}
            {LiveClassAvailable && LiveClassAvailable.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg">
                      <Timer className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-gray-900">{typeLabel} Mendatang</h3>
                      <p className="text-sm text-gray-500">{LiveClassAvailable.length} kelas tersedia</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 font-bold hover:bg-blue-50"
                    onClick={() => setActiveTab('available')}
                  >
                    Lihat Semua →
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {LiveClassAvailable.slice(0, 4).map((liveClass, index) => (
                    <UpcomingCard
                      key={liveClass.id}
                      liveClass={liveClass}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6 border-2 border-gray-100 rounded-3xl shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Cari berdasarkan judul, deskripsi, atau nama tutor..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-2 rounded-3xl shadow-sm"
                    />
                  </div>
                </div>
                <Select
                  value={selectedSubject}
                  onValueChange={setSelectedSubject}
                >
                  <SelectTrigger className="w-full sm:w-[200px] border-2 rounded-3xl shadow-sm font-bold">
                    <SelectValue placeholder="Pilih mata pelajaran" />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-gray-100 rounded-3xl shadow-sm">
                    <SelectItem value="all">Semua Mata Pelajaran</SelectItem>
                    {Categories?.map((subject) => (
                      <SelectItem
                        key={subject.id}
                        value={subject.id}
                      >
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-full sm:w-[150px] border-2 rounded-3xl shadow-sm font-bold">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-gray-100 rounded-3xl shadow-sm">
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="SCHEDULED">Terjadwal</SelectItem>
                    <SelectItem value="ONGOING">Berlangsung</SelectItem>
                    <SelectItem value="COMPLETED">Selesai</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between border-t-2 border-gray-100 pt-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-gray-900">
                      Tampilan:
                    </span>
                    <div className="flex bg-gray-100 rounded-3xl p-1 border-2 border-gray-200">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`px-3 py-2 text-sm font-bold rounded-3xl transition-all ${
                          viewMode === 'grid'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          <span className="hidden sm:inline">Grid</span>
                        </div>
                      </button>
                      <button
                        onClick={() => setViewMode('calendar')}
                        className={`px-3 py-2 text-sm font-bold rounded-3xl transition-all ${
                          viewMode === 'calendar'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span className="hidden sm:inline">Calendar</span>
                        </div>
                      </button>
                    </div>
                  </div>
                  {/* <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      Urutkan:
                    </span>
                    <Select
                      value={sortBy}
                      onValueChange={(value: 'date' | 'name' | 'status') =>
                        setSortBy(value)
                      }
                    >
                      <SelectTrigger className="w-[120px] h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">Tanggal</SelectItem>
                        <SelectItem value="name">Nama</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                      </SelectContent>
                    </Select>
                    <button
                      onClick={() =>
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                      }
                      className="p-2 h-9 border rounded-3xl hover:bg-gray-50 transition-colors"
                      title={`Urutan: ${sortOrder === 'asc' ? 'Naik' : 'Turun'}`}
                    >
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                  </div> */}
                </div>
                {/* <div className="hidden lg:flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Bell className="w-4 h-4" />
                    <span>{'-'} upcoming</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{'-'} registered</span>
                  </div>
                </div> */}
              </div>
            </div>
          </CardContent>
        </Card>

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
                  <EmptyState
                    icon={Crown}
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
              <EmptyState
                icon={Users}
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
              <EmptyState
                icon={Video}
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
              <EmptyState
                icon={Clock}
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
      </div>
    </div>
  );
}

const UpcomingCard = ({ liveClass, index }: { liveClass: LiveLearningDataType; index?: number }) => {
  const timeLeft = useCountdown(liveClass.startDate);
  const colors = [
    { bg: 'from-blue-500 to-indigo-600', light: 'bg-blue-50 border-blue-200', text: 'text-blue-700' },
    { bg: 'from-purple-500 to-pink-600', light: 'bg-purple-50 border-purple-200', text: 'text-purple-700' },
    { bg: 'from-emerald-500 to-teal-600', light: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700' },
    { bg: 'from-orange-500 to-red-600', light: 'bg-orange-50 border-orange-200', text: 'text-orange-700' },
  ];
  const color = colors[(index ?? 0) % colors.length];

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 border-2 ${color.light} rounded-3xl overflow-hidden`}>
      <CardContent className="p-0">
        <div className={`h-2 bg-gradient-to-r ${color.bg}`} />
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <Badge className={`${color.light} ${color.text} border font-bold text-xs`}>
              {liveClass.status}
            </Badge>
            <span className="text-xs font-mono text-gray-400">
              #{liveClass.id.slice(-4).toUpperCase()}
            </span>
          </div>

          <h4 className="font-black text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {liveClass.title}
          </h4>

          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6 border border-gray-200">
              <AvatarImage src={liveClass.Instructor.image || undefined} />
              <AvatarFallback className="text-xs font-bold">
                {liveClass.Instructor.name.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold text-gray-700 truncate">
              {liveClass.Instructor.name}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            <span>{formatDateTime(liveClass.startDate)}</span>
          </div>

          {!timeLeft.isExpired && (
            <div className="bg-gray-50 rounded-3xl p-2 border border-gray-100">
              <div className="text-xs text-gray-500 mb-1 text-center font-semibold">Dimulai dalam</div>
              <div className="flex justify-center gap-2">
                {timeLeft.days > 0 && (
                  <div className="text-center">
                    <div className="text-lg font-black text-gray-900">{timeLeft.days}</div>
                    <div className="text-xs text-gray-500">hari</div>
                  </div>
                )}
                <div className="text-center">
                  <div className="text-lg font-black text-gray-900">{timeLeft.hours.toString().padStart(2, '0')}</div>
                  <div className="text-xs text-gray-500">jam</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-black text-gray-900">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                  <div className="text-xs text-gray-500">mnt</div>
                </div>
              </div>
            </div>
          )}

          <Link href={`/${website_sub_category_id}/user/bimlive/detail/${liveClass.id}`}>
            <Button variant="outline" size="sm" className="w-full h-9 font-bold rounded-3xl border-2 hover:bg-gray-50">
              <Eye className="h-4 w-4 mr-2" />
              Lihat Detail
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

function LiveClassCard({
  liveClass,
  onJoin,
  onRate,
  onUpgrade,
  showPlanInfo = false,
  viewMode = 'grid',
  variant = 'accessible', // NEW: Default variant
  isRegistrationStep = false,
  onFinishRegistered,
}: {
  liveClass: LiveLearningDataType;
  onJoin: (liveClass: LiveLearningDataType) => void;
  onRate: (liveClass: LiveLearningDataType) => void;
  onUpgrade?: (liveClass: any) => void;
  showPlanInfo?: boolean;
  viewMode?: 'grid' | 'calendar';
  variant?: 'accessible' | 'preview' | 'locked';
  isRegistrationStep?: boolean;
  onFinishRegistered?: () => Promise<void>;
}) {
  const liveClassWithAccess = liveClass as any;
  const timeLeft = useCountdown(liveClass.startDate);
  const isUpcoming = liveClass.status === 'Akan Datang' && !timeLeft.isExpired;
  const isLive = liveClass.status === 'Sedang Berlangsung';

  // Grid view - more compact card
  if (viewMode === 'grid') {
    return (
      <Card className="live-class-card hover:shadow-md transition-all duration-300 border-2 border-gray-100 rounded-3xl overflow-hidden group shadow-sm">
        <CardContent className="p-0">
          {/* Header with gradient and status */}
          <div className="relative p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="flex justify-between items-start mb-3">
              <Badge
                className={`status-badge ${getStatusColor(liveClass.status)} shadow-sm font-bold text-xs rounded-3xl`}
              >
                {liveClass.status}
              </Badge>
              {isLive && (
                <div className="live-indicator flex items-center gap-1 text-red-600">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <span className="text-xs font-black">LIVE</span>
                </div>
              )}
            </div>
            <h3 className="font-black text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors text-gray-900">
              {liveClass.title}
            </h3>
            {/* Countdown for upcoming classes */}
            {isUpcoming && (
              <div className="mb-3">
                <CountdownTimer timeLeft={timeLeft} />
              </div>
            )}
          </div>
          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Header with ID */}
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-black text-sm line-clamp-2 flex-1 pr-2 text-gray-900">
                {liveClass.title}
              </h4>
              <Badge
                variant="secondary"
                className="text-xs font-mono bg-gray-100 text-gray-600 border-2 border-gray-300 shrink-0 ml-2 font-bold rounded-3xl"
              >
                #{liveClass.id.slice(-6).toUpperCase()}
              </Badge>
            </div>
            {/* Instructor */}
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border-2 border-gray-100">
                <AvatarImage src={liveClass.Instructor.image || undefined} />
                <AvatarFallback className="text-xs font-black">
                  {liveClass.Instructor.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1 text-sm">
                <span className="font-black text-gray-900 line-clamp-1">
                  {liveClass.Instructor.name}
                </span>
                <div className="flex flex-wrap gap-2">
                  {liveClass.Instructor.certificate && (
                    <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-3xl border-2 border-green-200 line-clamp-1 max-w-[150px] truncate font-bold">
                      {liveClass.Instructor.certificate}
                    </span>
                  )}
                  {liveClass.Instructor.lastEducation && (
                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-3xl border-2 border-blue-200 line-clamp-1 max-w-[150px] truncate font-bold">
                      {liveClass.Instructor.lastEducation}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {/* Time info */}
            <div className="space-y-2 text-sm text-gray-500 font-medium">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 shrink-0" />
                <span className="truncate">
                  {formatDateTime(liveClass.startDate)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0" />
                <span>{formatDuration(liveClass.duration)}</span>
              </div>
            </div>

            {/* Preview Content for marketing variant */}
            {liveClassWithAccess.needsUpgrade && showPlanInfo && (
              <div className="border-t-2 border-gray-100 pt-3">
                <PreviewContent liveClass={liveClass} />
              </div>
            )}
            {/* Plan info */}
            {showPlanInfo && liveClassWithAccess.userAccess && (
              <div className="border-t-2 border-gray-100 pt-3">
                <div className="flex flex-wrap gap-1">
                  {liveClassWithAccess.requiredPlans?.length > 0 ? (
                    liveClassWithAccess.requiredPlans
                      .slice(0, 2)
                      .map((plan: any, index: number) => (
                        <Badge
                          key={index}
                          variant={
                            liveClassWithAccess.userAccess.canRegister
                              ? 'default'
                              : 'outline'
                          }
                          className={`text-xs font-bold rounded-3xl ${
                            liveClassWithAccess.userAccess.canRegister
                              ? 'bg-green-100 text-green-800 border-2 border-green-300'
                              : 'bg-orange-100 text-orange-800 border-2 border-orange-300'
                          }`}
                        >
                          <span className="mr-1">
                            {liveClassWithAccess.userAccess.canRegister
                              ? '✅'
                              : '🔒'}
                          </span>
                          {typeof plan === 'string' ? plan : plan.name}
                        </Badge>
                      ))
                  ) : (
                    <Badge
                      variant="secondary"
                      className="text-xs font-bold rounded-3xl border-2"
                    >
                      📖 Free
                    </Badge>
                  )}
                </div>
              </div>
            )}
            {/* Actions with Enhanced Layout */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t-2 border-gray-100">
              <div className="flex gap-2 flex-1">
                {liveClassWithAccess.needsUpgrade && showPlanInfo ? (
                  <MarketingCTA
                    liveClass={liveClass}
                    compact={true}
                  />
                ) : (
                  <>
                    {/* {liveClass.canJoin && (
                      <Button
                        onClick={() => onJoin(liveClass)}
                        className="flex-1 h-10 text-sm font-medium"
                        style={{
                          backgroundColor: isLive ? '#ef4444' : undefined,
                        }}
                      >
                        {isLive ? (
                          <>
                            <Video className="mr-2 h-4 w-4" />
                            Join Live Now
                          </>
                        ) : (
                          <>
                            <PlayCircle className="mr-2 h-4 w-4" />
                            Bergabung
                          </>
                        )}
                      </Button>
                    )} */}
                    {showPlanInfo &&
                      liveClassWithAccess.needsUpgrade &&
                      onUpgrade && (
                        <Button
                          variant="outline"
                          onClick={() => onUpgrade(liveClass)}
                          className="flex-1 h-10 text-sm border-2 border-orange-300 text-orange-600 hover:bg-orange-50 rounded-3xl font-bold"
                        >
                          🔒 Upgrade Plan
                        </Button>
                      )}
                  </>
                )}
              </div>
              <div className="flex gap-2">
                <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-3xl border-2 border-gray-100">
                  <div className="flex gap-2 text-xs text-gray-500 text-center">
                    <Users className="h-3 w-3 mx-auto mb-1" />
                    <div className="font-black text-gray-900">
                      {liveClass.participants?.length || 0}
                    </div>
                  </div>
                  <Link
                    href={`/${website_sub_category_id}/user/bimlive/detail/${liveClass.id}`}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 ml-2 px-4 bg-transparent border-2 rounded-3xl font-bold"
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      <span className="inline">Detail</span>
                    </Button>
                  </Link>
                  {liveClass.accessType === 'PREMIUM' && (
                    <Badge className="h-10 px-3 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border-2 border-blue-300 rounded-3xl font-black flex items-center gap-2 shadow-sm hover:shadow-md transition-all">
                      <Crown className="h-4 w-4 text-blue-600 fill-blue-600" />
                      <span>Premium</span>
                    </Badge>
                  )}
                  {liveClass.accessType !== 'PREMIUM' &&
                    isRegistrationStep &&
                    liveClass.isRegistered === false &&
                    onFinishRegistered && (
                      <DialogLiveClassRegister
                        liveClassId={liveClass.id}
                        onFinish={onFinishRegistered}
                        liveClassAccessType={liveClass.accessType}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-10 px-4 bg-transparent border-2 rounded-3xl font-bold"
                        >
                          <UserCheck className="mr-1 h-4 w-4" />
                          <span className="inline">Daftar</span>
                        </Button>
                      </DialogLiveClassRegister>
                    )}
                  {liveClass.accessType !== 'PREMIUM' &&
                    isRegistrationStep &&
                    liveClass.isRegistered === true &&
                    onFinishRegistered && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-10 px-4 bg-green-50 border-2 border-green-300 text-green-700 hover:bg-green-100 rounded-3xl font-bold"
                      >
                        <UserCheck className="mr-1 h-4 w-4" />
                        <span className="inline">Terdaftar</span>
                      </Button>
                    )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // List view - Modern redesigned layout
  return (
    <Card className="hover:shadow-md transition-all duration-500 border-2 border-gray-100 rounded-3xl overflow-hidden cursor-pointer group bg-white hover:border-blue-200 shadow-sm">
      <CardContent className="p-0">
        {/* Modern Header with Floating Elements */}
        <div className="relative bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 p-6">
          {/* Floating Status Elements */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <Badge
              className={`status-badge ${getStatusColor(liveClass.status)} shadow-sm backdrop-blur-sm font-bold text-xs rounded-3xl`}
            >
              {liveClass.status}
            </Badge>
            {isLive && (
              <div className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-3xl text-xs font-black shadow-sm animate-pulse">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                LIVE
              </div>
            )}
          </div>
          <div className="flex items-start gap-4 pr-16">
            {/* Instructor Avatar - Larger and more prominent */}
            <div className="relative shrink-0">
              <Avatar className="h-16 w-16 border-3 border-white shadow-sm ring-2 ring-blue-100">
                <AvatarImage src={liveClass.Instructor.image || undefined} />
                <AvatarFallback className="text-lg font-black bg-gradient-to-br from-blue-400 to-indigo-500 text-white">
                  {liveClass.Instructor.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              {liveClass.Instructor.certificate && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1 shadow-sm">
                  <Award className="h-3 w-3" />
                </div>
              )}
            </div>
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="mb-2">
                <Badge
                  variant="outline"
                  className="text-xs font-mono bg-white/80 text-gray-600 border-2 border-gray-300 font-bold rounded-3xl"
                >
                  #{liveClass.id.slice(-6).toUpperCase()}
                </Badge>
              </div>
              <h3 className="text-xl font-black text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors leading-tight">
                {liveClass.title}
              </h3>
              {/* Instructor Info - Elegant layout */}
              <div className="flex items-center gap-3 mb-3">
                <div>
                  <p className="font-black text-gray-900 text-base line-clamp-1">
                    {liveClass.Instructor.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {liveClass.Instructor.certificate && (
                      <span
                        className={`text-xs px-2 py-1 bg-green-100 text-green-700 rounded-3xl font-bold border-2 border-green-200 line-clamp-1 ${typeof window !== 'undefined' && window.innerWidth < 640 ? 'max-w-[150px] truncate' : ''}`}
                      >
                        ✓ {liveClass.Instructor.certificate}
                      </span>
                    )}
                    {liveClass.Instructor.lastEducation && (
                      <span
                        className={`text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-3xl font-bold border-2 border-blue-200 line-clamp-1 ${typeof window !== 'undefined' && window.innerWidth < 640 ? 'max-w-[150px] truncate' : ''}`}
                      >
                        🎓 {liveClass.Instructor.lastEducation}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {/* Time Information - Clean layout */}
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-3xl bg-blue-100 flex items-center justify-center border-2 border-blue-200">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">
                      Tanggal
                    </p>
                    <p className="font-black text-gray-900">
                      {formatDateTime(liveClass.startDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-3xl bg-purple-100 flex items-center justify-center border-2 border-purple-200">
                    <Clock className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">
                      Durasi
                    </p>
                    <p className="font-black text-gray-900">
                      {formatDuration(liveClass.duration)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Countdown Timer - Modern design */}
          {isUpcoming && !timeLeft.isExpired && (
            <div className="mt-4 bg-white/90 backdrop-blur-sm rounded-3xl p-4 border-2 border-white/50 shadow-sm">
              <div className="text-xs text-gray-600 mb-2 text-center font-black uppercase tracking-wide">
                Dimulai dalam
              </div>
              <div className="flex justify-center">
                <CountdownTimer timeLeft={timeLeft} />
              </div>
            </div>
          )}
          {/* Status Indicator for non-upcoming */}
          {!isUpcoming && (
            <div className="mt-4 flex justify-center">
              {isLive && (
                <div className="bg-red-500 text-white px-4 py-2 rounded-3xl text-sm font-black shadow-sm flex items-center gap-2 border-2 border-red-600">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  Sedang Berlangsung
                </div>
              )}
              {liveClass.status === 'Selesai' && (
                <div className="bg-gray-600 text-white px-4 py-2 rounded-3xl text-sm font-black shadow-sm flex items-center gap-2 border-2 border-gray-700">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Kelas Selesai
                </div>
              )}
            </div>
          )}
        </div>
        {/* Content Section - Cleaner layout */}
        <div className="p-6">
          <p className="text-gray-500 text-sm mb-5 line-clamp-2 leading-relaxed font-medium">
            {liveClass.description}
          </p>

          {/* Preview Content for marketing variant */}
          {liveClassWithAccess.needsUpgrade && showPlanInfo ? (
            <div className="mb-6">
              <PreviewContent liveClass={liveClass} />
            </div>
          ) : (
            <div className="grid gap-4 mb-6 lg:grid-cols-2">
              {/* Agenda Items - Modern card */}
              {liveClass.LiveClassAgenda &&
                liveClass.LiveClassAgenda.length > 0 && (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-4 border-2 border-blue-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-3xl bg-blue-500 flex items-center justify-center border-2 border-blue-600">
                        <Target className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm font-black text-blue-900">
                        Agenda Pembelajaran ({liveClass.LiveClassAgenda.length})
                      </span>
                    </div>
                    <div className="space-y-2">
                      {liveClass.LiveClassAgenda.slice(0, 2).map(
                        (agenda, index) => (
                          <div
                            key={agenda.id}
                            className="bg-white/70 rounded-3xl p-3 border-2 border-white/50 shadow-sm"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5 border-2 border-blue-600">
                                {agenda.order || index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-blue-900 font-black text-sm line-clamp-1">
                                  {agenda.title}
                                </p>
                                {agenda.description && (
                                  <p className="text-blue-700 text-xs mt-1 line-clamp-1 font-medium">
                                    {agenda.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-3xl font-bold border-2 border-blue-300">
                                    {agenda.duration} menit
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                      {liveClass.LiveClassAgenda.length > 2 && (
                        <div className="text-center py-2">
                          <span className="text-xs text-blue-700 font-black">
                            +{liveClass.LiveClassAgenda.length - 2} agenda
                            lainnya
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              {/* Reference Items - Modern card */}
              {liveClass.LiveClassReference &&
                liveClass.LiveClassReference.length > 0 && (
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl p-4 border-2 border-emerald-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-3xl bg-emerald-500 flex items-center justify-center border-2 border-emerald-600">
                        <BookOpen className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm font-black text-emerald-900">
                        Materi Referensi ({liveClass.LiveClassReference.length})
                      </span>
                    </div>
                    <div className="space-y-2">
                      {liveClass.LiveClassReference.slice(0, 2).map((ref) => (
                        <div
                          key={ref.id}
                          className="bg-white/70 rounded-3xl p-3 border-2 border-white/50 shadow-sm"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-3xl bg-emerald-100 flex items-center justify-center shrink-0 border-2 border-emerald-200">
                              {ref.urlType === 'VIDEO' && (
                                <span className="text-emerald-600">🎥</span>
                              )}
                              {ref.urlType === 'DOCUMENT' && (
                                <span className="text-emerald-600">📄</span>
                              )}
                              {ref.urlType === 'WEBSITE' && (
                                <span className="text-emerald-600">🌐</span>
                              )}
                              {ref.urlType === 'ARTICLE' && (
                                <span className="text-emerald-600">📰</span>
                              )}
                              {ref.urlType === 'AUDIO' && (
                                <span className="text-emerald-600">🎵</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-emerald-900 font-black text-base line-clamp-1 mb-1 flex items-center gap-2">
                                {/* Icon sesuai tipe materi */}
                                {ref.urlType === 'VIDEO' && (
                                  <Video className="h-4 w-4 text-emerald-600" />
                                )}
                                {ref.urlType === 'DOCUMENT' && (
                                  <BookOpen className="h-4 w-4 text-emerald-600" />
                                )}
                                {ref.urlType === 'WEBSITE' && (
                                  <Eye className="h-4 w-4 text-emerald-600" />
                                )}
                                {ref.urlType === 'ARTICLE' && (
                                  <Award className="h-4 w-4 text-emerald-600" />
                                )}
                                {ref.urlType === 'AUDIO' && (
                                  <PlayCircle className="h-4 w-4 text-emerald-600" />
                                )}
                                {ref.CourseSubChapter?.title || ref.title}
                              </p>
                              <div className="flex flex-wrap gap-2 mb-1">
                                {ref.CourseSubChapter?.spendTime && (
                                  <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-800 rounded-3xl border-2 border-emerald-200 font-bold flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {ref.CourseSubChapter.spendTime} menit
                                  </span>
                                )}
                                {ref.CourseSubChapter?.premium ? (
                                  <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-3xl border-2 border-yellow-200 font-bold flex items-center gap-1">
                                    <Star className="h-3 w-3" />
                                    Premium
                                  </span>
                                ) : (
                                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-3xl border-2 border-gray-200 font-bold flex items-center gap-1">
                                    <BookOpen className="h-3 w-3" />
                                    Gratis
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge
                                  variant="outline"
                                  className="text-xs text-emerald-800 border-2 border-emerald-300 bg-emerald-50 flex items-center gap-1 font-bold rounded-3xl"
                                >
                                  <Target className="h-3 w-3" />
                                  {ref.type}
                                </Badge>
                                {ref.url && (
                                  <a
                                    href={ref.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-emerald-700 underline hover:text-emerald-900 transition-colors flex items-center gap-1 font-bold"
                                  >
                                    <Eye className="h-3 w-3" />
                                    Lihat Materi
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {liveClass.LiveClassReference.length > 2 && (
                        <div className="text-center py-2">
                          <span className="text-xs text-emerald-700 font-black">
                            +{liveClass.LiveClassReference.length - 2} referensi
                            lainnya
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
            </div>
          )}

          {/* Plan Information - Modern design */}
          {showPlanInfo && liveClassWithAccess.userAccess && (
            <div className="mb-6">
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-3xl p-4 border-2 border-orange-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-3xl bg-orange-500 flex items-center justify-center border-2 border-orange-600">
                    <Target className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm font-black text-orange-900">
                    Status Akses
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {liveClassWithAccess.requiredPlans?.length > 0 ? (
                    liveClassWithAccess.requiredPlans
                      .slice(0, 2)
                      .map((plan: any, index: number) => (
                        <div
                          key={index}
                          className={`px-3 py-2 rounded-3xl border-2 text-sm font-black ${
                            liveClassWithAccess.userAccess.canRegister
                              ? 'bg-green-100 text-green-900 border-green-300'
                              : 'bg-orange-100 text-orange-900 border-orange-300'
                          }`}
                        >
                          <span className="mr-2">
                            {liveClassWithAccess.userAccess.canRegister
                              ? '✅'
                              : '🔒'}
                          </span>
                          {typeof plan === 'string' ? plan : plan.name}
                        </div>
                      ))
                  ) : (
                    <div className="bg-gray-100 text-gray-900 px-3 py-2 rounded-3xl border-2 border-gray-300 text-sm font-black">
                      <span className="mr-2">📖</span>
                      Gratis untuk Semua
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Modern Actions & Stats Section */}
          <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
            {/* Action Buttons */}
            <div className="flex gap-3">
              {liveClassWithAccess.needsUpgrade && showPlanInfo ? (
                <MarketingCTA
                  liveClass={liveClass}
                  compact={false}
                />
              ) : (
                <>
                  {/* {liveClass.canJoin && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onJoin(liveClass);
                      }}
                      size="lg"
                      className={`h-11 px-6 font-semibold rounded-3xl shadow-lg transition-all duration-300 ${
                        isLive
                          ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                          : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl'
                      }`}
                    >
                      {isLive ? (
                        <>
                          <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                          <Video className="mr-2 h-4 w-4" />
                          Join Live
                        </>
                      ) : (
                        <>
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Daftar Kelas
                        </>
                      )}
                    </Button>
                  )} */}
                  {showPlanInfo &&
                    liveClassWithAccess.needsUpgrade &&
                    onUpgrade && (
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpgrade(liveClass);
                        }}
                        className="h-11 px-6 border-2 border-orange-300 text-orange-800 hover:bg-orange-50 font-black rounded-3xl transition-all duration-300 hover:shadow-md"
                      >
                        <div className="w-4 h-4 bg-orange-500 rounded-full mr-2 flex items-center justify-center">
                          <span className="text-white text-xs">🔒</span>
                        </div>
                        Upgrade Plan
                      </Button>
                    )}
                  {liveClass.status === 'Selesai' && (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRate(liveClass);
                      }}
                      className="h-11 px-6 border-2 border-yellow-300 text-yellow-800 hover:bg-yellow-50 font-black rounded-3xl transition-all duration-300 hover:shadow-md"
                    >
                      <Star className="mr-2 h-4 w-4" />
                      Beri Rating
                    </Button>
                  )}
                </>
              )}
            </div>
            {/* Stats & Detail Button */}
            <div className="flex items-center gap-4">
              {/* Enhanced Stats */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-3xl border-2 border-gray-100">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-200">
                    <Users className="h-3 w-3 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold">Peserta</p>
                    <p className="text-sm font-black text-gray-900">
                      {liveClass.participants?.length || 0}
                    </p>
                  </div>
                </div>
                {/* {liveClass.ratingStats &&
                  liveClass.ratingStats.totalRatings > 0 && (
                    <div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-3xl">
                      <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
                        <Star className="h-3 w-3 text-yellow-600 fill-yellow-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">
                          Rating
                        </p>
                        <p className="text-sm font-bold text-gray-800">
                          {liveClass.ratingStats.averageRating.toFixed(1)}
                        </p>
                      </div>
                    </div>
                  )} */}
              </div>
              {/* Modern Detail Button */}
              <Link
                href={`/${website_sub_category_id}/user/bimlive/detail/${liveClass.id}`}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="h-11 px-4 border-2 border-gray-300 hover:border-blue-400 text-gray-900 hover:text-blue-600 hover:bg-blue-50 font-black rounded-3xl transition-all duration-300 hover:shadow-md group bg-transparent"
                >
                  <Eye className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">Lihat Detail</span>
                  <span className="sm:hidden">Detail</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
