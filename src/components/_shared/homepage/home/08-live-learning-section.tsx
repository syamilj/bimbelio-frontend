'use client';

import { useCountdown } from '@/app/(main)/[web_sub_category]/(user)/user/bimlive/_components/live-class-hooks';
import {
  CountdownTimer,
  MarketingCTA,
  PreviewContent,
} from '@/app/(main)/[web_sub_category]/(user)/user/bimlive/_components/live-class-shared-components';
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
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  Clock,
  Eye,
  PlayCircle,
  Star,
  Target,
  Users,
  Video,
  Zap,
} from 'lucide-react';
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
  const { setShowAuth } = useGuest();
  const searchParams = useSearchParams();
  const router = useRouter();
  const href = searchParams?.get('href');

  const ref = useRef(null);

  // const [cards, setCards] = useState<
  //   (CardTryoutProps & { WebsiteSubCategory: WebsiteSubCategory })[]
  // >([]);
  // const [isLoading, setIsLoading] = useState<boolean>(true);

  const {
    data: cards,
    isLoading,
    error: LiveClassAvailableError,
    totalData: LiveClassAvailableTotalData,
    refetch: LiveClassAvailableRefetch,
  } = useGet<LiveLearningDataType[]>(
    '/liveClass/getAllLiveClassForLandingPage',
    {
      params: { take: 3, page: 1 },
    },
  );

  // const getData = async () => {
  //   await getGeneral(
  //     `/tryout/getTryOutCardUpcoming2?userId=${session?.user.id}`,
  //     {
  //       setData: setCards,
  //       setLoading: setIsLoading,
  //     },
  //   );
  // };

  // useEffect(() => {
  //   getData();
  // }, [session]);

  useEffect(() => {
    if (href && href?.length > 0) {
      router.push(href);
    }
  }, [href]);

  // Get dynamic colors
  const pathname = usePathname();

  // Get dynamic colors
  const isMainLandingPage = pathname === '/';
  const mainColor = isMainLandingPage
    ? '#0091FF'
    : (websiteSubCategory?.main_color ?? '#0091FF');
  const secondaryColor = isMainLandingPage
    ? '#5aa4dd'
    : (websiteSubCategory?.secondary_color ?? '#5aa4dd');

  return (
    <section
      id="live-learning"
      className={cn(
        'py-16 md:py-24 relative overflow-hidden',
        !isLoading && cards?.length === 0 && 'hidden',
      )}
    >
      {/* Simplified consistent background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white" />
      </div>

      <div
        className="container mx-auto px-4 max-w-7xl"
        ref={ref}
      >
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <Badge
            className="mb-6 px-6 py-2 text-sm font-bold text-white border-none"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            <Target className="w-4 h-4 mr-2 inline" />
            Live Learning
          </Badge>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Btw —{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
              }}
            >
              Kamu Juga Dapet Bonus Ini Loh
            </span>
          </h2>

          <p className="text-base max-w-2xl mx-auto leading-relaxed mb-6 text-gray-600">
            Try Out IRT-based udah{' '}
            <span className="font-bold">included di paket kamu</span>, nggak
            perlu bayar lagi!
            <br />
            Latihan rutin, track progress, dan siap tempur di hari H.
            <span className="font-semibold text-gray-900">
              Mental kuat + Strategy tepat = Victory guaranteed!
            </span>
          </p>

          {/* Info Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full shadow-md"
              style={{
                backgroundColor: `${mainColor}15`,
                border: `1.5px solid ${mainColor}30`,
              }}
            >
              <Target
                className="w-4 h-4"
                style={{ color: mainColor }}
              />
              <span
                className="text-sm font-semibold"
                style={{ color: mainColor }}
              >
                {cards?.length} Live Learning Tersedia
              </span>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full shadow-md"
              style={{
                backgroundColor: '#00C85315',
                border: '1.5px solid #00C85330',
              }}
            >
              <Award className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-600">
                100% Gratis
              </span>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full shadow-md"
              style={{
                backgroundColor: '#9C27B015',
                border: '1.5px solid #9C27B030',
              }}
            >
              <Zap className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-600">
                Akses 24/7
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Cards Grid */}
        <div
          className={cn(
            cards?.length === 1 && !isLoading
              ? 'flex justify-center gap-6 mb-8'
              : cards?.length === 2 && !isLoading
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 mb-8 justify-items-center mx-auto w-fit'
                : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8',
          )}
        >
          {/* Loading State */}
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-96 bg-white rounded-3xl border-2 border-gray-100 animate-pulse overflow-hidden"
                >
                  {/* Top accent bar */}
                  <div
                    className="h-1.5 bg-gray-200 mb-6"
                    style={{
                      background: `linear-gradient(135deg, #e5e7eb, #d1d5db)`,
                    }}
                  />
                  <div className="p-6 space-y-4">
                    <div className="h-48 bg-gray-200 rounded-3xl" />
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded" />
                      <div className="h-4 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              ))
            : cards?.map((liveLearning) => (
                <div
                  key={liveLearning.id}
                  className={cn(
                    'h-full max-w-[400px]',
                    cards.length === 1 && 'w-full max-w-[600px]',
                    cards.length === 2 && 'w-full',
                  )}
                >
                  <EnhancedLiveLearningCard
                    key={liveLearning.id}
                    liveLearning={liveLearning}
                    onJoin={() => {}}
                    onRate={() => {}}
                    viewMode={'grid'}
                    isRegistrationStep={true}
                    onFinishRegistered={async () => {}}
                  />
                </div>
              ))}
        </div>

        {/* Enhanced CTA */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-md p-8">
            {/* Icon Header */}
            <div className="mb-4 flex items-center justify-center gap-3">
              <div
                className="h-12 w-12 rounded-3xl flex items-center justify-center shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                }}
              >
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Siap Tempur di Arena?
              </h3>
            </div>

            <p className="text-center text-gray-600 mb-6 max-w-2xl mx-auto">
              Akses semua try out gratis dan buktikan kemampuanmu bersama ribuan
              peserta lainnya
            </p>

            {/* CTA Button */}
            {session ? (
              <Link
                href={`${website_sub_category_id}/user/bimlive`}
                className="group inline-flex items-center justify-center gap-3 w-full px-8 py-6 rounded-3xl font-bold text-lg shadow-lg transition-all duration-300 hover:shadow-md text-white"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                }}
              >
                <Target className="w-5 h-5" />
                Lihat Semua Live Learning
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <button
                className="group inline-flex items-center justify-center gap-3 w-full px-8 py-6 rounded-3xl cursor-pointer font-bold text-lg shadow-lg transition-all duration-300 hover:shadow-md text-white"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                }}
                onClick={() => {
                  setShowAuth({
                    open: true,
                    redirect: `/${website_sub_category_id}/user/bimlive`,
                  });
                }}
              >
                <Target className="w-5 h-5" />
                Lihat Semua Live Learning
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            {/* Trust Indicators */}
            <div className="mt-6 pt-6 border-t-2 border-gray-100 flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="font-semibold text-gray-700">100% Gratis</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="font-semibold text-gray-700">
                  Peringkat Real-time
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-500" />
                <span className="font-semibold text-gray-700">
                  Pembahasan Lengkap
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Enhanced Live Learning Card Component - Plan Card Style
const EnhancedLiveLearningCard = ({
  liveLearning,
  onJoin,
  onRate,
  onUpgrade,
  showPlanInfo = false,
  viewMode = 'list',
  variant = 'accessible', // NEW: Default variant
  isRegistrationStep = false,
  onFinishRegistered,
}: {
  liveLearning: LiveLearningDataType;
  onJoin: (liveClass: LiveLearningDataType) => void;
  onRate: (liveClass: LiveLearningDataType) => void;
  onUpgrade?: (liveClass: any) => void;
  showPlanInfo?: boolean;
  viewMode?: 'list' | 'grid' | 'calendar';
  variant?: 'accessible' | 'preview' | 'locked';
  isRegistrationStep?: boolean;
  onFinishRegistered?: () => Promise<void>;
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { setShowAuth } = useGuest();
  const searchParams = useSearchParams();
  const liveLearningId = searchParams?.get('liveLearningId');

  useEffect(() => {
    if (!liveLearning || !liveLearningId || !session) return;
    if (liveLearningId === liveLearning.id) {
      router.push(
        `${liveLearning.websiteSubCategoryId}/user/bimlive?id=${liveLearningId}`,
      );
    }
  }, [liveLearning, liveLearningId, session]);

  const liveClass = liveLearning;

  const liveClassWithAccess = liveClass as any;
  const timeLeft = useCountdown(liveClass.startDate);
  const isUpcoming = liveClass.status === 'Akan Datang' && !timeLeft.isExpired;
  const isLive = liveClass.status === 'Sedang Berlangsung';

  return (
    <Card className="hover:shadow-md transition-all duration-500 border-2 border-gray-100 rounded-3xl overflow-hidden cursor-pointer group bg-white hover:border-blue-200 shadow-sm">
      <CardContent className="p-0">
        {/* Modern Header with Floating Elements */}
        <div className="relative bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 p-6">
          {/* Floating Status Elements */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <Badge
              className={`status-badge ${getStatusColor(liveClass.status)} shadow-sm backdrop-blur-sm font-bold text-xs rounded-xl`}
            >
              {liveClass.status}
            </Badge>
            {isLive && (
              <div className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-xl text-xs font-black shadow-sm animate-pulse">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                LIVE
              </div>
            )}
          </div>
          <div className="flex flex-col items-start gap-4 pr-16 pt-4">
            {/* Instructor Avatar - Larger and more prominent */}
            <div className="relative shrink-0 flex gap-4">
              <Avatar className="h-16 w-16 border-3 border-white shadow-sm ring-2 ring-blue-100">
                <AvatarImage src={liveClass.Instructor.image || undefined} />
                <AvatarFallback className="text-lg font-black bg-gradient-to-br from-blue-400 to-indigo-500 text-white">
                  {liveClass.Instructor.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className="pt-2">
                <p className="font-black text-gray-900 text-base line-clamp-1">
                  {liveClass.Instructor.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {liveClass.Instructor.certificate && (
                    <span
                      className={`text-xs px-2 py-1 bg-green-100 text-green-700 rounded-xl font-bold border-2 border-green-200 line-clamp-1 ${typeof window !== 'undefined' && window.innerWidth < 640 ? 'max-w-[150px] truncate' : ''}`}
                    >
                      ✓ {liveClass.Instructor.certificate}
                    </span>
                  )}
                  {liveClass.Instructor.lastEducation && (
                    <span
                      className={`text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-xl font-bold border-2 border-blue-200 line-clamp-1 ${typeof window !== 'undefined' && window.innerWidth < 640 ? 'max-w-[150px] truncate' : ''}`}
                    >
                      🎓 {liveClass.Instructor.lastEducation}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="mb-2">
                <Badge
                  variant="outline"
                  className="text-xs font-mono bg-white/80 text-gray-600 border-2 border-gray-300 font-bold rounded-xl"
                >
                  #{liveClass.id.slice(-6).toUpperCase()}
                </Badge>
              </div>
              <h3 className="text-xl font-black text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors leading-tight">
                {liveClass.title}
              </h3>

              {/* Time Information - Clean layout */}
              <div className="flex flex-col items-start gap-6 text-sm text-gray-600">
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
            <div className="grid gap-4 mb-6 grid-cols-1">
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
                                  <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-xl font-bold border-2 border-blue-300">
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
                                  <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-800 rounded-xl border-2 border-emerald-200 font-bold flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {ref.CourseSubChapter.spendTime} menit
                                  </span>
                                )}
                                {ref.CourseSubChapter?.premium ? (
                                  <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-xl border-2 border-yellow-200 font-bold flex items-center gap-1">
                                    <Star className="h-3 w-3" />
                                    Premium
                                  </span>
                                ) : (
                                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-xl border-2 border-gray-200 font-bold flex items-center gap-1">
                                    <BookOpen className="h-3 w-3" />
                                    Gratis
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge
                                  variant="outline"
                                  className="text-xs text-emerald-800 border-2 border-emerald-300 bg-emerald-50 flex items-center gap-1 font-bold rounded-xl"
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
                      className={`h-11 px-6 font-semibold rounded-xl shadow-lg transition-all duration-300 ${
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
                    <div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-lg">
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
              {session && (
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
              )}
              {!session && (
                <Button
                  variant="outline"
                  size="lg"
                  className="h-11 px-4 border-2 border-gray-300 hover:border-blue-400 text-gray-900 hover:text-blue-600 hover:bg-blue-50 font-black rounded-3xl transition-all duration-300 hover:shadow-md group bg-transparent"
                  onClick={() => {
                    setShowAuth({
                      open: true,
                      redirect: `/${website_sub_category_id}/user/bimlive/detail/${liveClass.id}?liveLearningId=${liveClass.id}`,
                    });
                  }}
                >
                  <Eye className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">Lihat Detail</span>
                  <span className="sm:hidden">Detail</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveLearningSection;
export { LiveLearningSection };
