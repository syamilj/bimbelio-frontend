'use client';

import { CardTryoutProps } from '@/app/(main)/[web_sub_category]/(user)/user/try-out/_components/ui/card-tryout';
import { useGuest } from '@/components/layout/layoutGuest';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { env } from '@/env.mjs';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { cn } from '@/lib/utils';
import { WebsiteSubCategory } from '@/types/database';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Crown,
  Shield,
  Target,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { autoScroll } from '../autoscroll';

const TryoutSection: React.FC = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const href = searchParams?.get('href');

  const ref = useRef(null);

  const [cards, setCards] = useState<
    (CardTryoutProps & { WebsiteSubCategory: WebsiteSubCategory })[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getData = async () => {
    await getGeneral(
      `/tryout/getTryOutCardUpcoming2?userId=${session?.user.id}`,
      {
        setData: setCards,
        setLoading: setIsLoading,
      },
    );
  };

  useEffect(() => {
    getData();
  }, [session]);

  useEffect(() => {
    if (href && href?.length > 0) {
      router.push(href);
    }
  }, [href]);

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color ?? '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color ?? '#5aa4dd';

  autoScroll('tryout');

  return (
    <section
      id="tryout"
      className={cn(
        'py-16 md:py-24 relative overflow-hidden',
        !isLoading && cards.length === 0 && 'hidden',
      )}
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-white" />
      </div>

      <div
        className="container mx-auto px-4 max-w-7xl"
        ref={ref}
      >
        {/* Header */}
        <div className="text-center mb-10">
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white mb-4"
            style={{ backgroundColor: mainColor }}
          >
            <Target className="w-4 h-4" />
            Try Out Gratis
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Latihan <span style={{ color: mainColor }}>Sebelum Hari H</span>
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto">
            Try Out IRT-based dengan format resmi UTBK. Gratis untuk semua
            member. Track progress dan raih peringkat nasional!
          </p>
        </div>

        {/* Cards Grid */}
        <div
          className={cn(
            'grid gap-5 mb-8',
            cards.length === 1 && !isLoading
              ? 'grid-cols-1 max-w-md mx-auto'
              : cards.length === 2 && !isLoading
                ? 'grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto'
                : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
          )}
        >
          {/* Loading State */}
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl border-2 border-gray-100 animate-pulse overflow-hidden"
                >
                  <div className="h-48 lg:h-56 bg-gray-100" />
                  <div className="p-4 lg:p-6 space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-20 bg-gray-100 rounded-2xl"
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[1, 2].map((i) => (
                        <div
                          key={i}
                          className="h-16 bg-gray-100 rounded-2xl"
                        />
                      ))}
                    </div>
                    <div className="h-12 bg-gray-100 rounded-xl" />
                  </div>
                </div>
              ))
            : cards?.map((tryOut) => (
                <div
                  key={tryOut.id}
                  className={cn(
                    'h-full',
                    cards.length === 2 && 'w-full md:max-w-sm',
                  )}
                >
                  <EnhancedTryOutCard
                    tryOut={tryOut}
                    mainColor={mainColor}
                    secondaryColor={secondaryColor}
                  />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default TryoutSection;
export { TryoutSection };

const EnhancedTryOutCard = ({
  tryOut,
  mainColor,
  secondaryColor,
}: {
  tryOut: CardTryoutProps & { WebsiteSubCategory: WebsiteSubCategory };
  mainColor: string;
  secondaryColor: string;
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { setShowAuth } = useGuest();
  const searchParams = useSearchParams();
  const tryoutId = searchParams?.get('tryoutId');

  useEffect(() => {
    if (!tryOut || !tryoutId || !session) return;
    if (tryoutId === tryOut.id) {
      router.push(
        `${tryOut.WebsiteSubCategory.id}/user/try-out?id=${tryoutId}`,
      );
    }
  }, [tryOut, tryoutId, session]);

  // Calculate stats
  const totalQuestions = tryOut.TryoutSession.reduce(
    (acc, session) => acc + session._count.TryoutQuestion,
    0,
  );
  const totalDuration = tryOut.TryoutSession.reduce(
    (acc, item) => acc + item.duration,
    0,
  );
  const totalParticipants = tryOut._count.TryoutRegistration;

  const isTrending = totalParticipants > 50;
  const isPopular = totalParticipants > 100;

  return (
    <div
      className="w-full group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-gray-100 transition-all duration-500"
      style={{
        boxShadow: isPopular
          ? `0 8px 32px ${mainColor}30`
          : `0 4px 24px ${mainColor}15`,
      }}
    >
      {/* Top Accent Bar - Consistent Style */}
      <div
        className="h-1.5"
        style={{
          background: isPopular
            ? 'linear-gradient(135deg, #00C853, #10B981)'
            : `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
        }}
      />

      {/* Header Section - Plan Card Style */}
      <div className="relative p-6 bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-sm">
        {/* Top Badges Row */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-20">
          {/* Left badges */}
          <div className="flex flex-col gap-1">
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg border-0 font-bold text-xs">
              <Award
                size={10}
                className="mr-1"
              />
              GRATIS
            </Badge>
            {isTrending && (
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg border-0">
                <Crown
                  size={10}
                  className="mr-1"
                />
                TRENDING
              </Badge>
            )}
          </div>

          {/* Right badges */}
          <div className="flex flex-col gap-1 items-end">
            <Badge
              className="text-white shadow-lg border-0 font-bold text-xs"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
            >
              {tryOut.WebsiteSubCategory.name}
            </Badge>
          </div>
        </div>

        {/* Enhanced Hero Image Section */}
        <div className="relative mt-12 mb-4">
          <div className="relative w-full h-52 rounded-2xl overflow-hidden border border-gray-200 bg-gradient-to-br from-gray-100 to-gray-200 group-hover:shadow-md transition-all duration-500">
            <Image
              src={
                `${env.NEXT_PUBLIC_SUPABASE_IMG_URL || '/placeholder.svg'}/tryout/${tryOut.image}` ||
                'placeholder.svg'
              }
              alt={tryOut.title}
              fill
              className="object-cover object-top transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
              sizes="(max-width: 768px) 100vw, 400px"
              priority
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback =
                  e.currentTarget.parentElement?.querySelector(
                    '.fallback-icon',
                  );
                if (fallback) {
                  (fallback as HTMLElement).style.display = 'flex';
                }
              }}
            />

            {/* Enhanced Overlay */}
            <div
              className="absolute inset-0 opacity-60"
              style={{
                background: `linear-gradient(135deg, ${mainColor}80, ${secondaryColor}60)`,
              }}
            />

            {/* Marketplace Overlay Effects */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

            {/* Enhanced Fallback */}
            <div
              className={`fallback-icon absolute inset-0 flex flex-col items-center justify-center ${tryOut.image ? 'hidden' : 'flex'}`}
              style={{
                background: `linear-gradient(135deg, ${mainColor}20, ${secondaryColor}15)`,
              }}
            >
              <BookOpen
                size={40}
                style={{ color: `${mainColor}80` }}
                className="mb-2"
              />
              <span
                className="text-sm font-medium"
                style={{ color: `${mainColor}70` }}
              >
                Tryout Preview
              </span>
            </div>

            {/* Live indicator */}
            {isPopular && (
              <div className="absolute top-3 right-3">
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/90 backdrop-blur-sm text-white text-xs font-medium">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  POPULAR
                </div>
              </div>
            )}

            {/* Enhanced Title Overlay */}
            <div className="absolute bottom-4 left-4 right-4 text-center opacity-0 group-hover:opacity-100 transition-all duration-500">
              <h3 className="text-lg text-center font-bold text-white leading-tight backdrop-blur-sm bg-black/20 rounded-2xl p-2">
                {tryOut.title}
              </h3>
            </div>
          </div>
        </div>

        {/* Product Title & Stats */}
        <div className="space-y-3">
          <h3 className="text-xl text-center font-black justify-center items-center leading-tight text-gray-900 line-clamp-2 group-hover:text-gray-700 transition-colors">
            {tryOut.title}
          </h3>

          {/* Quick Stats Preview */}
          <div className="flex flex-wrap justify-center items-center gap-1.5">
            <Badge
              variant="secondary"
              className="text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              ⏱️ {totalDuration} menit
            </Badge>
            <Badge
              variant="secondary"
              className="text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              📚 {totalQuestions} soal
            </Badge>
            {/* <Badge
              variant="secondary"
              className="text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              👥 {totalParticipants} peserta
            </Badge> */}
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        {/* Enhanced Stats Section - Plan Card Style */}
        <div className="mb-6 p-4 rounded-2xl border-2 border-dashed border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Info Tryout
              </span>
              <div className="flex items-center gap-1 text-green-600">
                <Award size={12} />
                <span className="text-xs font-bold">GRATIS</span>
              </div>
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div
                className="text-center p-3 rounded-2xl border border-gray-200 bg-white"
                style={{ borderColor: `${mainColor}30` }}
              >
                <Clock
                  className="w-5 h-5 mx-auto mb-2"
                  style={{ color: mainColor }}
                />
                <div className="text-xs text-gray-600 mb-1">Durasi</div>
                <div
                  className="font-bold text-sm"
                  style={{ color: mainColor }}
                >
                  {totalDuration} min
                </div>
              </div>
              <div
                className="text-center p-3 rounded-2xl border border-gray-200 bg-white"
                style={{ borderColor: `${mainColor}30` }}
              >
                <BookOpen
                  className="w-5 h-5 mx-auto mb-2"
                  style={{ color: mainColor }}
                />
                <div className="text-xs text-gray-600 mb-1">Soal</div>
                <div
                  className="font-bold text-sm"
                  style={{ color: mainColor }}
                >
                  {totalQuestions}
                </div>
              </div>
              {/* <div
                className="text-center p-3 rounded-2xl border border-gray-200 bg-white"
                style={{ borderColor: `${mainColor}30` }}
              >
                <Users
                  className="w-5 h-5 mx-auto mb-2"
                  style={{ color: mainColor }}
                />
                <div className="text-xs text-gray-600 mb-1">Peserta</div>
                <div
                  className="font-bold text-sm"
                  style={{ color: mainColor }}
                >
                  {totalParticipants}
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Enhanced Date Info */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <div className="text-center p-4 rounded-2xl bg-white border border-gray-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Pelaksanaan
              </span>
            </div>
            <div className="text-xs font-bold text-blue-600">
              {new Date(tryOut.startDate).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
              })}{' '}
              -{' '}
              {new Date(tryOut.endDate).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </div>
          </div>
          <div className="text-center p-4 rounded-2xl bg-white border border-gray-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">
                Pembahasan
              </span>
            </div>
            <div className="text-xs font-bold text-purple-600">
              {new Date(tryOut.resultDate).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </div>
          </div>
        </div>

        {/* Enhanced Features Section */}
        <div className="space-y-3">
          {/* Features with checkmarks */}
          <div className="bg-white rounded-2xl p-4 space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle2
                className="w-4 h-4 flex-shrink-0 mt-0.5"
                style={{ color: mainColor }}
              />
              <span className="text-xs font-medium text-gray-700">
                Peringkat Nasional Real-time
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2
                className="w-4 h-4 flex-shrink-0 mt-0.5"
                style={{ color: mainColor }}
              />
              <span className="text-xs font-medium text-gray-700">
                Format Ujian Resmi PTN
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2
                className="w-4 h-4 flex-shrink-0 mt-0.5"
                style={{ color: mainColor }}
              />
              <span className="text-xs font-medium text-gray-700">
                Pembahasan AI & Expert
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2
                className="w-4 h-4 flex-shrink-0 mt-0.5"
                style={{ color: mainColor }}
              />
              <span className="text-xs font-medium text-gray-700">
                Laporan Analisis Lengkap
              </span>
            </div>
          </div>

          {/* Community Badge */}
          <div
            className="flex items-center justify-center gap-2 rounded-2xl p-3 shadow-sm"
            style={{
              backgroundColor: `${mainColor}08`,
              border: `1.5px solid ${mainColor}20`,
            }}
          >
            <Users
              className="w-4 h-4"
              style={{ color: mainColor }}
            />
            <span
              className="text-xs font-semibold"
              style={{ color: mainColor }}
            >
              Grup Belajar:
            </span>
            <a
              href="https://www.bimbelio.com/link/komunitas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold underline hover:opacity-80 transition-opacity"
              style={{ color: mainColor }}
            >
              JOIN SEKARANG!
            </a>
          </div>

          {/* Trust Badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
            <Shield className="w-3 h-3 text-green-600" />
            <span className="font-medium">100% Gratis & Terpercaya</span>
          </div>

          {/* Primary CTA */}
          <button
            className="w-full h-14 text-lg font-bold shadow-md hover:shadow-sm transition-all duration-300 text-white border-0 relative overflow-hidden group rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 20px 40px ${mainColor}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 10px 30px ${mainColor}30`;
            }}
            onClick={() => {
              if (!session) {
                setShowAuth((prev) => ({ ...prev, open: true }));
                router.push(
                  `${window.location.pathname}?tryoutId=${tryOut.id}`,
                );
                return;
              }
              router.push(
                `${tryOut.WebsiteSubCategory.id}/user/try-out?id=${tryOut.id}`,
              );
            }}
          >
            <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span>Daftar Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  );
};
