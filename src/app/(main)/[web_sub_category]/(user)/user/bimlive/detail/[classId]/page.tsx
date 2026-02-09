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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toaster } from '@/components/ui/toaster';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { useGet } from '@/lib/fetch-helper/useGet';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { trackUnifiedEvent } from '@/lib/tracking/track';
import {
  formatDateTime,
  formatDuration,
  getParticipantStatusColor,
  getParticipantStatusText,
  getStatusColor,
} from '@/lib/utils/live-class';
import {
  Category,
  CourseSubChapter,
  Instructor,
  LiveClass,
  LiveClassAgenda,
  LiveClassReference,
  Pivot_LiveClass_Plan,
  Plan,
} from '@/types/database';
import {
  AlertTriangle,
  ArrowLeft,
  Award,
  BookOpen,
  Calendar,
  Clock,
  ExternalLink,
  FileText,
  Link as LinkIcon,
  Loader2,
  PlayCircle,
  Star,
  UserCheck,
  Users,
  Video,
  Volume2,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DialogLiveClassRegister } from '../../_components/dialog-live-class-register';
import { JoinLiveClassModal } from '../../_components/join-live-class-modal';
import { LiveClassRatingsDisplay } from '../../_components/live-class-ratings-display';
import { RatingModal } from '../../_components/rating-modal';

export type LiveClassType = LiveClass & {
  Category: Category;
  Instructor: Instructor;
  LiveClassAgenda: LiveClassAgenda[];
  LiveClassReference: (LiveClassReference & {
    CourseSubChapter: CourseSubChapter;
  })[];
  Pivot_LiveClass_Plan: (Pivot_LiveClass_Plan & {
    Plan: Plan;
  })[];
  status: string;
  participantStatus: 'Diundang' | 'Tidak Terdaftar' | 'Terdaftar';
};

export default function LiveClassStudentDetail() {
  const { data: session } = useSession();
  const { classId }: { classId: string } = useParams();
  const searchParams = useSearchParams();
  const liveLearningId = searchParams.get('liveLearningId');
  // === DESIGN SYSTEM FROM LEADERBOARD ===
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const router = useRouter();

  const {
    data: liveClass,
    isLoading,
    error,
    refetch: liveClassRefetch,
  } = useGet<LiveClassType>('/liveClass/getSingleLiveClass', {
    params: {
      id: classId,
    },
  });

  const { data: attendanceInData, refetch: attendanceInDataRefetch } = useGet<{
    IN: boolean;
    OUT: boolean;
  }>('/liveClass/getIsAttendanceIn', {
    params: {
      liveClassId: liveClass?.id,
    },
    useEffectDependencies: [liveClass],
    enabled: !!liveClass,
  });

  const isAlreadyJoined = attendanceInData?.IN || false;

  const isAlreadyAttendanceOut = attendanceInData?.OUT || false;

  const { mutate: AddAttendance, isLoading: AddAttendanceIsLoading } =
    useMutation('/liveClass/addLiveClassAttendance', 'post', {
      payload: {
        liveClassId: liveClass?.id,
        status: 'PRESENT',
        type: 'OUT',
      },
      onSuccess() {
        attendanceInDataRefetch();
      },
    });

  console.log({ liveClass });

  const [isShowAttendance, setIsShowAttendance] = useState<boolean>(false);

  const handleShowAttendance = () => {
    if (!liveClass) return false;
    const currentDate = new Date();
    const endDateMin = new Date(liveClass?.endDate);
    endDateMin.setMinutes(endDateMin.getMinutes() - 5);
    const endDatePlus = new Date(liveClass?.endDate);
    endDatePlus.setMinutes(endDatePlus.getMinutes() + 5);

    if (currentDate > endDateMin && currentDate < endDatePlus) {
      setIsShowAttendance(true);
      return;
    }

    setIsShowAttendance(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleShowAttendance();
    }, 1000);

    return () => clearInterval(interval);
  }, [liveClass]);

  useEffect(() => {
    trackUnifiedEvent({
      eventName: 'ViewContent',
      customData: {
        content_name: 'Live Class Detail',
        content_type: 'page',
        content_id: `live_class_detail_${classId}`,
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
  }, [session, classId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <LoadingSkeleton
            mainColor={mainColor}
            secondaryColor={secondaryColor}
          />
        </div>
      </div>
    );
  }

  if (error || !liveClass) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <ErrorState onBack={() => router.back()} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto max-w-7xl px-4 py-6">
        {/* ENHANCED HEADER - LEADERBOARD PATTERN */}
        <Card className="bg-white shadow-sm border-2 border-gray-100 rounded-3xl overflow-hidden mb-8">
          <CardHeader
            className="pb-6 border-b-2 border-gray-100 relative"
            style={{
              background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
            }}
          >
            <div className="relative z-10">
              {/* Back Button */}
              <div className="flex items-center gap-4 mb-4">
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (liveLearningId && liveLearningId?.length > 0) {
                      router.push(`/${website_sub_category_id}/user/bimlive`);
                    } else {
                      router.back();
                    }
                  }}
                  className="hover:bg-white/20 transition-colors font-bold rounded-3xl relative z-20"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali
                </Button>
                <div className="flex items-center gap-2">
                  <Badge
                    className={`${getStatusColor(liveClass.status)} font-bold rounded-3xl`}
                  >
                    {liveClass.status}
                  </Badge>
                  <Badge
                    className={`${getParticipantStatusColor(
                      liveClass.participantStatus,
                    )} font-bold rounded-3xl`}
                  >
                    {getParticipantStatusText(liveClass.participantStatus)}
                  </Badge>
                </div>
              </div>

              <CardTitle className="text-3xl font-bold flex items-center gap-4 text-gray-900">
                <div
                  className="w-12 h-12 rounded-3xl flex items-center justify-center shadow-sm border-2"
                  style={{
                    backgroundColor: `${mainColor}15`,
                    borderColor: `${mainColor}30`,
                  }}
                >
                  <PlayCircle
                    className="w-6 h-6"
                    style={{ color: mainColor }}
                  />
                </div>
                {liveClass.title}
              </CardTitle>
              <CardDescription className="text-lg mt-3 text-gray-500 font-medium">
                {liveClass.description}
              </CardDescription>

              {/* Live status indicator */}
              {/* {liveClass.canJoin && (
                <div className="flex items-center gap-2 mt-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-700">
                      Siap untuk bergabung
                    </span>
                  </div>
                </div>
              )} */}
            </div>
          </CardHeader>

          {/* STATS CARDS - LEADERBOARD PATTERN */}
          <CardContent className="p-6">
            <div className="grid gap-4 md:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Durasi"
                value={formatDuration(liveClass.duration)}
                description="Total waktu kelas"
                icon={Clock}
                gradient="from-blue-500 to-blue-600"
                bgColor="bg-blue-50"
                borderColor="border-blue-200"
                textColor="text-blue-700"
              />
              <StatsCard
                title="Jadwal"
                value={formatDateTime(liveClass.startDate).split(' ')[1]}
                description={formatDateTime(liveClass.startDate).split(' ')[0]}
                icon={Calendar}
                gradient="from-green-500 to-green-600"
                bgColor="bg-green-50"
                borderColor="border-green-200"
                textColor="text-green-700"
              />
              <StatsCard
                title="Peserta"
                value={liveClass.maxParticipant?.toString() || '∞'}
                description="Maksimal peserta"
                icon={Users}
                gradient="from-yellow-500 to-yellow-600"
                bgColor="bg-yellow-50"
                borderColor="border-yellow-200"
                textColor="text-yellow-700"
              />
              <StatsCard
                title="Status"
                value={liveClass.participantStatus}
                description="Status partisipasi"
                icon={Award}
                gradient="from-purple-500 to-purple-600"
                bgColor="bg-purple-50"
                borderColor="border-purple-200"
                textColor="text-purple-700"
              />
            </div>
          </CardContent>
        </Card>

        {/* MAIN CONTENT */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Instructor Info */}
            <Card className="bg-white shadow-sm border-2 border-gray-100 rounded-3xl overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 font-bold text-gray-900">
                  <Users className="h-5 w-5" />
                  Tutor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-gray-100">
                    <AvatarImage
                      src={liveClass.Instructor?.image || undefined}
                    />
                    <AvatarFallback className="font-semibold">
                      {liveClass.Instructor?.name
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('') || 'T'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {liveClass.Instructor?.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {liveClass.Category?.name}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {liveClass.Instructor?.email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Class Details */}
            <Card className="bg-white shadow-sm border-2 border-gray-100 rounded-3xl overflow-hidden">
              <CardHeader className="border-b-2 border-gray-100">
                <CardTitle className="font-bold text-gray-900">
                  Detail Kelas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs
                  defaultValue="agenda"
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-50 rounded-3xl p-1 h-11 border-2 border-gray-100">
                    <TabsTrigger
                      value="agenda"
                      className="rounded-3xl transition-all duration-200 data-[state=active]:shadow-sm font-bold"
                      style={
                        { '--tw-bg-opacity': '1' } as React.CSSProperties & {
                          [key: string]: string;
                        }
                      }
                    >
                      Agenda
                    </TabsTrigger>
                    <TabsTrigger
                      value="references"
                      className="rounded-3xl transition-all duration-200 data-[state=active]:shadow-sm font-bold"
                      style={
                        { '--tw-bg-opacity': '1' } as React.CSSProperties & {
                          [key: string]: string;
                        }
                      }
                    >
                      Referensi
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent
                    value="agenda"
                    className="space-y-4"
                  >
                    {liveClass.LiveClassAgenda &&
                    liveClass.LiveClassAgenda.length > 0 ? (
                      <div className="space-y-3">
                        {liveClass.LiveClassAgenda.map((agenda, index) => (
                          <div
                            key={agenda.id}
                            className="border-2 border-gray-100 rounded-3xl p-4 hover:shadow-sm transition-shadow"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-1 border-2 border-blue-200">
                                <span className="text-xs font-bold text-blue-600">
                                  {index + 1}
                                </span>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900 mb-1">
                                  {agenda.title}
                                </h4>
                                <p className="text-sm text-gray-500 font-medium mb-2">
                                  {agenda.description}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {agenda.duration} menit
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="font-medium">Agenda belum tersedia</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent
                    value="references"
                    className="space-y-4"
                  >
                    {liveClass.LiveClassReference &&
                    liveClass.LiveClassReference.length > 0 ? (
                      <div className="space-y-3">
                        {liveClass.LiveClassReference.map((ref) => (
                          <div
                            key={ref.id}
                            className="group"
                          >
                            {/* Course Reference Card - Navigate to course/subchapter */}
                            {ref.type === 'COURSE' && ref.subChapterId ? (
                              <Link
                                href={`/${website_sub_category_id}/user/bimcourse/${liveClass.Category?.id || 'unknown'}/study?sub=${ref.subChapterId}`}
                                className="block w-full"
                              >
                                <div className="border-2 border-blue-100 rounded-3xl p-4 hover:shadow-md transition-all duration-300 hover:border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 cursor-pointer group-hover:scale-[1.02]">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-start gap-3 flex-1">
                                      {/* Course icon */}
                                      <div className="w-10 h-10 rounded-3xl bg-blue-500 flex items-center justify-center shrink-0 border-2 border-blue-600 shadow-sm">
                                        <BookOpen className="h-5 w-5 text-white" />
                                      </div>

                                      <div className="flex-1">
                                        <h4 className="font-bold mb-1 text-gray-900 group-hover:text-blue-600 transition-colors">
                                          {ref.title}
                                        </h4>
                                        <p className="text-sm text-gray-500 font-medium mb-2 line-clamp-2">
                                          {ref.description ||
                                            'Klik untuk membuka materi pembelajaran terkait'}
                                        </p>

                                        {/* Reference type badge */}
                                        <div className="flex items-center gap-2">
                                          <Badge
                                            variant="outline"
                                            className="text-xs bg-blue-100 border-2 border-blue-300 text-blue-700 font-bold rounded-3xl"
                                          >
                                            Course
                                          </Badge>
                                          {ref.urlType && (
                                            <Badge
                                              variant="secondary"
                                              className="text-xs font-bold rounded-3xl"
                                            >
                                              {ref.urlType}
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Action indicator */}
                                    <div className="flex items-center text-blue-500 group-hover:text-blue-600 transition-colors">
                                      <span className="text-sm font-bold mr-2 hidden sm:inline">
                                        Buka Materi
                                      </span>
                                      <div className="w-8 h-8 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors border-2 border-blue-200">
                                        <ArrowLeft className="h-4 w-4 rotate-180" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            ) : (
                              /* External Link Reference Card */
                              <div className="border-2 border-gray-100 rounded-3xl p-4 hover:shadow-sm transition-all duration-300 bg-gradient-to-r from-gray-50 to-slate-50">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start gap-3 flex-1">
                                    {/* Icon based on url type */}
                                    <div className="w-10 h-10 rounded-3xl bg-gray-500 flex items-center justify-center shrink-0 border-2 border-gray-600 shadow-sm">
                                      {ref.urlType === 'VIDEO' && (
                                        <Video className="h-5 w-5 text-white" />
                                      )}
                                      {ref.urlType === 'DOCUMENT' && (
                                        <FileText className="h-5 w-5 text-white" />
                                      )}
                                      {ref.urlType === 'WEBSITE' && (
                                        <ExternalLink className="h-5 w-5 text-white" />
                                      )}
                                      {ref.urlType === 'ARTICLE' && (
                                        <BookOpen className="h-5 w-5 text-white" />
                                      )}
                                      {ref.urlType === 'AUDIO' && (
                                        <Volume2 className="h-5 w-5 text-white" />
                                      )}
                                      {!ref.urlType && (
                                        <LinkIcon className="h-5 w-5 text-white" />
                                      )}
                                    </div>

                                    <div className="flex-1">
                                      <h4 className="font-bold mb-1 text-gray-900">
                                        {ref.title}
                                      </h4>
                                      <p className="text-sm text-gray-500 font-medium mb-2 line-clamp-2">
                                        {ref.description ||
                                          'Referensi eksternal untuk pembelajaran tambahan'}
                                      </p>

                                      {/* Reference type badges */}
                                      <div className="flex items-center gap-2">
                                        <Badge
                                          variant="outline"
                                          className="text-xs bg-gray-100 border-2 border-gray-300 text-gray-700 font-bold rounded-3xl"
                                        >
                                          🔗{' '}
                                          {ref.type === 'URL'
                                            ? 'External Link'
                                            : 'Reference'}
                                        </Badge>
                                        {ref.urlType && (
                                          <Badge
                                            variant="secondary"
                                            className="text-xs font-bold rounded-3xl"
                                          >
                                            {ref.urlType}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* External link button */}
                                  {ref.url && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      asChild
                                      className="shrink-0 rounded-3xl font-bold border-2"
                                    >
                                      <Link
                                        href={ref.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <ExternalLink className="h-4 w-4 mr-1" />
                                        <span className="hidden sm:inline">
                                          Buka
                                        </span>
                                      </Link>
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="font-medium">Referensi belum tersedia</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            {/* Action Card */}
            <Card className="bg-white shadow-sm border-2 border-gray-100 rounded-3xl overflow-hidden">
              <CardHeader className="border-b-2 border-gray-100">
                <CardTitle className="text-lg font-bold text-gray-900">
                  Status Partisipasi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-4">
                  <Badge
                    className={`${getParticipantStatusColor(
                      liveClass.participantStatus,
                    )} font-bold rounded-3xl border-2`}
                    variant="outline"
                  >
                    {liveClass.participantStatus}
                  </Badge>
                </div>

                {/* Email Reminder for joining */}
                {/* {(liveClass.canJoin || liveClass.link) && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-3xl">
                    <div className="flex items-start gap-2">
                      <Mail className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium text-blue-900 mb-1">
                          Siap bergabung ke Meeting?
                        </p>
                        <p className="text-blue-700 text-xs">
                          Klik tombol di bawah untuk reminder email dan akses
                        </p>
                      </div>
                    </div>
                  </div>
                )} */}

                {/* {liveClass.canJoin && (
                  <Button
                    onClick={handleJoinClass}
                    className="w-full"
                    style={{ backgroundColor: mainColor }}
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Bergabung ke Live Class
                  </Button>
                )} */}

                {liveClass.status === 'Selesai' && (
                  <RatingModal
                    liveClass={liveClass}
                    onSuccess={liveClassRefetch}
                  >
                    <Button
                      variant="outline"
                      className="w-full hover:bg-yellow-50 hover:border-yellow-300 transition-colors rounded-3xl font-bold border-2"
                    >
                      <Star className="mr-2 h-4 w-4" />
                      Beri Rating
                    </Button>
                  </RatingModal>
                )}

                {liveClass.accessType !== 'PREMIUM' &&
                  liveClass.participantStatus === 'Tidak Terdaftar' && (
                    <DialogLiveClassRegister
                      liveClassId={liveClass.id}
                      onFinish={async () => {
                        await liveClassRefetch();
                      }}
                      liveClassAccessType={liveClass.accessType}
                    >
                      <Button
                        variant="outline"
                        className="w-full rounded-3xl font-bold border-2"
                      >
                        <UserCheck className="mr-2 h-4 w-4" />
                        Daftar
                      </Button>
                    </DialogLiveClassRegister>
                  )}

                {liveClass.link && (
                  <JoinLiveClassModal
                    liveClass={liveClass}
                    refetchAttendanceData={attendanceInDataRefetch}
                    onSuccess={() => {
                      toaster({
                        title: 'Berhasil membuka Meeting!',
                        description:
                          'Pastikan Kamu login dengan email terdaftar',
                        condition: 'success',
                      });
                    }}
                  >
                    <Button
                      variant="outline"
                      className="w-full rounded-3xl font-bold border-2"
                    >
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Buka Meeting
                    </Button>
                  </JoinLiveClassModal>
                )}

                {isAlreadyJoined &&
                  !isAlreadyAttendanceOut &&
                  isShowAttendance && (
                    <Button
                      className="w-full rounded-3xl font-bold border-2"
                      disabled={AddAttendanceIsLoading}
                      onClick={() => {
                        AddAttendance();
                      }}
                    >
                      {/* <LinkIcon className="mr-2 h-4 w-4" /> */}
                      {AddAttendanceIsLoading ? (
                        <Loader2 className="animate-spin w-4 h-4" />
                      ) : (
                        'Klik untuk absensi keluar'
                      )}
                    </Button>
                  )}
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="bg-white shadow-sm border-2 border-gray-100 rounded-3xl overflow-hidden">
              <CardHeader className="border-b-2 border-gray-100">
                <CardTitle className="text-lg font-bold text-gray-900">
                  Informasi Kelas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-sm font-medium text-gray-900">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{formatDateTime(liveClass.startDate)}</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-gray-900">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{formatDuration(liveClass.duration)}</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-gray-900">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>
                    {liveClass.maxParticipant
                      ? `Maks ${liveClass.maxParticipant} peserta`
                      : 'Tidak terbatas'}
                  </span>
                </div>
                {liveClass.isRecord && (
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-900">
                    <Video className="h-4 w-4 text-gray-500" />
                    <span>Akan direkam</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <LiveClassRatingsDisplay liveClassId={classId} />
          </div>
        </div>
      </div>
    </div>
  );
}

// === COMPONENT DEFINITIONS ===

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  gradient,
  bgColor,
  borderColor,
  textColor,
}: StatsCardProps) {
  return (
    <Card
      className={`border-2 transition-all duration-300 hover:shadow-md hover:scale-105 rounded-3xl overflow-hidden shadow-sm ${bgColor} ${borderColor}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 md:pb-3">
        <CardTitle className={`text-xs md:text-sm font-bold ${textColor}`}>
          {title}
        </CardTitle>
        <div
          className={`w-8 h-8 md:w-10 md:h-10 rounded-3xl flex items-center justify-center bg-gradient-to-br ${gradient} text-white shadow-sm border-2 border-white`}
        >
          <Icon className="w-4 h-4 md:w-5 md:h-5" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 md:mb-2">
          {value}
        </div>
        <p className={`text-xs md:text-sm font-bold opacity-80 ${textColor}`}>
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton({
  mainColor,
  secondaryColor,
}: {
  mainColor: string;
  secondaryColor: string;
}) {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <Card className="bg-white shadow-sm border-2 border-gray-100 rounded-3xl overflow-hidden">
        <CardHeader
          className="pb-6 border-b-2 border-gray-100 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
          }}
        >
          <div className="relative z-10">
            <div className="h-8 bg-gray-200 rounded-3xl animate-pulse w-48 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded-3xl animate-pulse w-96"></div>
          </div>
        </CardHeader>
      </Card>

      {/* Content Skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {[1, 2].map((i) => (
            <Card
              key={i}
              className="bg-white rounded-3xl border-2 border-gray-100 shadow-sm"
            >
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded-3xl animate-pulse w-32"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded-3xl animate-pulse w-full"></div>
                  <div className="h-4 bg-gray-200 rounded-3xl animate-pulse w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded-3xl animate-pulse w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="space-y-6">
          <Card className="bg-white rounded-3xl border-2 border-gray-100 shadow-sm">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded-3xl animate-pulse w-32"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-10 bg-gray-200 rounded-3xl animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded-3xl animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ onBack }: { onBack: () => void }) {
  return (
    <div className="text-center py-12">
      <AlertTriangle className="h-16 w-16 mx-auto text-red-500 mb-4" />
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Live Class Tidak Ditemukan
      </h3>
      <p className="text-gray-500 mb-6 font-medium">
        Live class yang Kamu cari tidak ada atau Kamu tidak memiliki akses.
      </p>
      <Button
        onClick={onBack}
        className="px-6 py-2 rounded-3xl font-bold border-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Kembali
      </Button>
    </div>
  );
}
