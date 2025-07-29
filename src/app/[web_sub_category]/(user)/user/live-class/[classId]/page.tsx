'use client';

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
  PlayCircle,
  Star,
  Users,
  Video,
  Volume2,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { JoinLiveClassModal } from '../_components/join-live-class-modal';
import { LiveClassRatingsDisplay } from '../_components/live-class-ratings-display';
import { RatingModal } from '../_components/rating-modal';

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
  const { classId }: { classId: string } = useParams();
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
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
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <ErrorState onBack={() => router.back()} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 py-6">
        {/* ENHANCED HEADER - LEADERBOARD PATTERN */}
        <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden mb-8">
          <CardHeader
            className="pb-6 border-b border-gray-100 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
            }}
          >
            <div className="relative z-10">
              {/* Back Button */}
              <div className="flex items-center gap-4 mb-4">
                <Button
                  variant="ghost"
                  onClick={() => router.back()}
                  className="hover:bg-white/20 transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali
                </Button>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(liveClass.status)}>
                    {liveClass.status}
                  </Badge>
                  <Badge
                    className={getParticipantStatusColor(
                      liveClass.participantStatus,
                    )}
                  >
                    {getParticipantStatusText(liveClass.participantStatus)}
                  </Badge>
                </div>
              </div>

              <CardTitle
                className="text-3xl font-bold flex items-center gap-4"
                style={{ color: mainColor }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: `${mainColor}15` }}
                >
                  <PlayCircle
                    className="w-6 h-6"
                    style={{ color: mainColor }}
                  />
                </div>
                {liveClass.title}
              </CardTitle>
              <CardDescription className="text-lg mt-3 text-gray-600">
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

            {/* DECORATIVE ELEMENTS */}
            <div
              className="absolute -right-8 -top-8 w-20 h-20 rounded-full opacity-5"
              style={{ backgroundColor: mainColor }}
            />
            <div
              className="absolute -left-6 -bottom-6 w-16 h-16 rounded-full opacity-5"
              style={{ backgroundColor: secondaryColor }}
            />
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
            <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Tutor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={liveClass.Instructor?.image || undefined}
                    />
                    <AvatarFallback>
                      {liveClass.Instructor?.name
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('') || 'T'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">
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
            <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
              <CardHeader>
                <CardTitle>Detail Kelas</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs
                  defaultValue="agenda"
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-50 rounded-xl p-1 h-11 border-0">
                    <TabsTrigger
                      value="agenda"
                      className="rounded-lg transition-all duration-200 data-[state=active]:shadow-sm"
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
                      className="rounded-lg transition-all duration-200 data-[state=active]:shadow-sm"
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
                            className="border rounded-lg p-4"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-xs font-medium text-blue-600">
                                  {index + 1}
                                </span>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium mb-1">
                                  {agenda.title}
                                </h4>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {agenda.description}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
                      <div className="text-center py-8 text-muted-foreground">
                        <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Agenda belum tersedia</p>
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
                                href={`/${website_sub_category_id}/user/course/${liveClass.Category?.id || 'unknown'}?sub=${ref.subChapterId}`}
                                className="block w-full"
                              >
                                <div className="border rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 cursor-pointer group-hover:scale-[1.02]">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-start gap-3 flex-1">
                                      {/* Course icon */}
                                      <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                                        <BookOpen className="h-5 w-5 text-white" />
                                      </div>

                                      <div className="flex-1">
                                        <h4 className="font-semibold mb-1 text-gray-900 group-hover:text-blue-600 transition-colors">
                                          {ref.title}
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                          {ref.description ||
                                            'Klik untuk membuka materi pembelajaran terkait'}
                                        </p>

                                        {/* Reference type badge */}
                                        <div className="flex items-center gap-2">
                                          <Badge
                                            variant="outline"
                                            className="text-xs bg-blue-100 border-blue-300 text-blue-700"
                                          >
                                            Course
                                          </Badge>
                                          {ref.urlType && (
                                            <Badge
                                              variant="secondary"
                                              className="text-xs"
                                            >
                                              {ref.urlType}
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Action indicator */}
                                    <div className="flex items-center text-blue-500 group-hover:text-blue-600 transition-colors">
                                      <span className="text-sm font-medium mr-2 hidden sm:inline">
                                        Buka Materi
                                      </span>
                                      <div className="w-8 h-8 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors">
                                        <ArrowLeft className="h-4 w-4 rotate-180" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            ) : (
                              /* External Link Reference Card */
                              <div className="border rounded-xl p-4 hover:shadow-md transition-all duration-300 bg-gradient-to-r from-gray-50 to-slate-50">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start gap-3 flex-1">
                                    {/* Icon based on url type */}
                                    <div className="w-10 h-10 rounded-lg bg-gray-500 flex items-center justify-center flex-shrink-0">
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
                                      <h4 className="font-medium mb-1 text-gray-900">
                                        {ref.title}
                                      </h4>
                                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                        {ref.description ||
                                          'Referensi eksternal untuk pembelajaran tambahan'}
                                      </p>

                                      {/* Reference type badges */}
                                      <div className="flex items-center gap-2">
                                        <Badge
                                          variant="outline"
                                          className="text-xs bg-gray-100 border-gray-300 text-gray-700"
                                        >
                                          🔗{' '}
                                          {ref.type === 'URL'
                                            ? 'External Link'
                                            : 'Reference'}
                                        </Badge>
                                        {ref.urlType && (
                                          <Badge
                                            variant="secondary"
                                            className="text-xs"
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
                                      className="flex-shrink-0"
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
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Referensi belum tersedia</p>
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
            <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg">Status Partisipasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-4">
                  <Badge
                    className={getParticipantStatusColor(
                      liveClass.participantStatus,
                    )}
                    variant="outline"
                  >
                    {liveClass.participantStatus}
                  </Badge>
                </div>

                {/* Email Reminder for joining */}
                {/* {(liveClass.canJoin || liveClass.link) && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Mail className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
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
                      className="w-full hover:bg-yellow-50 hover:border-yellow-300 transition-colors"
                    >
                      <Star className="mr-2 h-4 w-4" />
                      Beri Rating
                    </Button>
                  </RatingModal>
                )}

                {liveClass.link && (
                  <JoinLiveClassModal
                    liveClass={liveClass}
                    onSuccess={() => {
                      toaster({
                        title: 'Berhasil membuka Meeting!',
                        description:
                          'Pastikan Anda login dengan email terdaftar',
                        condition: 'success',
                      });
                    }}
                  >
                    <Button
                      variant="outline"
                      className="w-full"
                    >
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Buka Meeting
                    </Button>
                  </JoinLiveClassModal>
                )}
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg">Informasi Kelas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDateTime(liveClass.startDate)}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDuration(liveClass.duration)}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {liveClass.maxParticipant
                      ? `Maks ${liveClass.maxParticipant} peserta`
                      : 'Tidak terbatas'}
                  </span>
                </div>
                {liveClass.isRecord && (
                  <div className="flex items-center gap-3 text-sm">
                    <Video className="h-4 w-4 text-muted-foreground" />
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
      className={`border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl overflow-hidden ${bgColor} ${borderColor}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 md:pb-3">
        <CardTitle className={`text-xs md:text-sm font-semibold ${textColor}`}>
          {title}
        </CardTitle>
        <div
          className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${gradient} text-white shadow-sm`}
        >
          <Icon className="w-4 h-4 md:w-5 md:h-5" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 md:mb-2">
          {value}
        </div>
        <p className={`text-xs md:text-sm font-medium opacity-80 ${textColor}`}>
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
      <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
        <CardHeader
          className="pb-6 border-b border-gray-100 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
          }}
        >
          <div className="relative z-10">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-96"></div>
          </div>
        </CardHeader>
      </Card>

      {/* Content Skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {[1, 2].map((i) => (
            <Card
              key={i}
              className="bg-white rounded-2xl"
            >
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="space-y-6">
          <Card className="bg-white rounded-2xl">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
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
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Live Class Tidak Ditemukan
      </h3>
      <p className="text-gray-600 mb-6">
        Live class yang Anda cari tidak ada atau Anda tidak memiliki akses.
      </p>
      <Button
        onClick={onBack}
        className="px-6 py-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Kembali
      </Button>
    </div>
  );
}
