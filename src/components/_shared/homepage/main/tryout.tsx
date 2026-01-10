'use client';

import { CardTryoutProps } from '@/app/(main)/[web_sub_category]/(user)/user/bimarena/try-out/_components/ui/card-tryout';
import { useGuest } from '@/components/layout/layoutGuest';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { env } from '@/env.mjs';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { cn } from '@/lib/utils';
import { WebsiteSubCategory } from '@/types/database';
import { motion, useAnimation, useInView } from 'framer-motion';
import {
  ArrowRight,
  Award,
  BookOpen,
  Bot,
  Calendar,
  Clock,
  Crown,
  FileText,
  MessageCircle,
  TrendingUp,
  Trophy,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const FeaturedTryoutSection = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const { data: session } = useSession();
  const { setShowAuth } = useGuest();
  const searchParams = useSearchParams();
  const router = useRouter();
  const href = searchParams?.get('href');
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

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
      id="tryout"
      className={cn(
        'py-16 md:py-24 relative overflow-hidden',
        !isLoading && cards.length === 0 && 'hidden',
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
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.8 } },
          }}
          className="text-center mb-12"
        >
          <Badge
            variant="outline"
            className="mb-4 px-4 py-1.5 text-xs font-semibold text-white border-none items-center gap-2 mx-auto"
            style={{ backgroundColor: mainColor }}
          >
            <Crown className="w-3 h-3" />
            Arena Battle
          </Badge>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Arena Perang{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
              }}
            >
              Heroes
            </span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed mb-6"
            style={{ color: `${mainColor}90` }}
          >
            Transform dari hopeless warrior jadi hero yang siap hancurin ujian!
            <br />
            <span
              className="font-semibold"
              style={{ color: mainColor }}
            >
              Mental kuat + Strategy tepat = Victory guaranteed!
            </span>
          </p>

          {/* Compact Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center items-center gap-6 text-sm"
          >
            <div className="flex items-center gap-1">
              <div
                className="text-2xl font-bold"
                style={{ color: mainColor }}
              >
                {cards.length}
              </div>
              <span className="text-gray-500">Arena</span>
            </div>
            <div className="w-px h-6 bg-gray-300" />
            <div className="flex items-center gap-1">
              <div className="text-2xl font-bold text-green-600">FREE</div>
              <span className="text-gray-500">Gratis</span>
            </div>
            <div className="w-px h-6 bg-gray-300" />
            <div className="flex items-center gap-1">
              <div
                className="text-2xl font-bold"
                style={{ color: secondaryColor }}
              >
                24/7
              </div>
              <span className="text-gray-500">Akses</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Cards Grid */}
        <motion.div
          animate={controls}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { duration: 0.8, staggerChildren: 0.1 },
            },
          }}
          className={cn(
            cards.length === 1 && !isLoading
              ? 'flex justify-center gap-6 mb-8'
              : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8',
          )}
        >
          {/* Loading State */}
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <motion.div
                  key={index}
                  className="h-96 bg-white rounded-3xl border-2 border-gray-100 animate-pulse"
                />
              ))
            : cards?.map((tryOut, index) => (
                <motion.div
                  key={tryOut.id}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.6 },
                    },
                  }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="h-full"
                >
                  <EnhancedTryOutCard
                    tryOut={tryOut}
                    mainColor={mainColor}
                    secondaryColor={secondaryColor}
                  />
                </motion.div>
              ))}
        </motion.div>

        {/* Enhanced CTA */}
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, delay: 0.8 },
            },
          }}
          className="text-center"
        >
          {session ? (
            <Link
              href={`${website_sub_category_id}/user/bimarena/try-out`}
              className="group inline-flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 hover:shadow-xl text-white"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
            >
              Lihat Semua Try Out
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center gap-3 px-6 py-3 rounded-xl cursor-pointer font-bold text-lg shadow-lg transition-all duration-300 hover:shadow-xl text-white"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
              onClick={() => {
                setShowAuth({
                  redirect: `/${website_sub_category_id ? website_sub_category_id : 'chosee'}/user/bimarena/try-out`,
                  open: true,
                });
              }}
            >
              Lihat Semua Try Out
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          )}
        </motion.div>
      </div>
    </section>
  );
};

// Enhanced TryOut Card Component - Plan Card Style
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
        `${tryOut.WebsiteSubCategory.id}/user/bimarena/try-out?id=${tryoutId}`,
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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="w-full group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl border-0 transition-all duration-500"
      style={{
        boxShadow: isPopular
          ? `0 8px 32px ${mainColor}30`
          : `0 4px 24px ${mainColor}15`,
      }}
    >
      {/* Status Bar - Plan Card Style */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-white/50 to-transparent">
        {isPopular && (
          <div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse"
            style={{ width: '70%' }}
          />
        )}
      </div>

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
          <div className="relative w-full h-52 rounded-2xl overflow-hidden border border-gray-200 bg-gradient-to-br from-gray-100 to-gray-200 group-hover:shadow-xl transition-all duration-500">
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
              <h3 className="text-lg text-center font-bold text-white leading-tight backdrop-blur-sm bg-black/20 rounded-lg p-2">
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
                className="text-center p-3 rounded-xl border border-gray-200 bg-white"
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
                className="text-center p-3 rounded-xl border border-gray-200 bg-white"
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
                className="text-center p-3 rounded-xl border border-gray-200 bg-white"
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
          <div className="text-center p-4 rounded-xl bg-gray-50 border border-gray-200">
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
          <div className="text-center p-4 rounded-xl bg-gray-50 border border-gray-200">
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

        {/* Plan Card Style CTA Section */}
        <div className="space-y-3">
          {/* Compact Features Section */}
          <div className="bg-gray-50 rounded-xl p-3 space-y-3">
            {/* Feature Chips - 2 rows */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5 bg-white rounded-lg p-2">
                <Trophy
                  size={12}
                  className="text-blue-600 flex-shrink-0"
                />
                <span className="font-medium text-gray-800">
                  Peringkat Nasional
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-white rounded-lg p-2">
                <FileText
                  size={12}
                  className="text-green-600 flex-shrink-0"
                />
                <span className="font-medium text-gray-800">Format Resmi</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white rounded-lg p-2">
                <Bot
                  size={12}
                  className="text-purple-600 flex-shrink-0"
                />
                <span className="font-medium text-gray-800">Bimbot AI</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white rounded-lg p-2">
                <TrendingUp
                  size={12}
                  className="text-orange-600 flex-shrink-0"
                />
                <span className="font-medium text-gray-800">Laporan Skor</span>
              </div>
            </div>

            {/* Grup Belajar - Compact */}
            <div className="flex items-center justify-center gap-2 bg-white rounded-lg p-2">
              <MessageCircle
                size={12}
                className="text-blue-600"
              />
              <span className="text-xs font-medium text-gray-800">Grup:</span>
              <a
                href="https://www.bimbelio.com/link/komunitas"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 font-medium underline"
              >
                discord.com/invite/5Fy3fnVaE9
              </a>
            </div>
          </div>

          {/* Primary CTA */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-14 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 text-white border-0 relative overflow-hidden group rounded-xl"
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
                `${tryOut.WebsiteSubCategory.id}/user/bimarena/try-out?id=${tryOut.id}`,
              );
            }}
          >
            <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span>Daftar Sekarang</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedTryoutSection;
