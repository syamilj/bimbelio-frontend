'use client';

import { CardTryoutProps } from '@/app/[web_sub_category]/(user)/user/try-out/_components/ui/card-tryout';
import { useGuest } from '@/components/layout/layoutGuest';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { env } from '@/env.mjs';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { cn, getDateString } from '@/lib/utils';
import { WebsiteSubCategory } from '@/types/database';
import { motion, useAnimation, useInView } from 'framer-motion';
import {
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  Clock,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  return (
    <section
      id="tryout"
      className={cn(
        'py-16 md:py-24 relative overflow-hidden',
        !isLoading && cards.length === 0 && 'hidden',
      )}
    >
      {/* Enhanced Background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: mainColor }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: secondaryColor }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full opacity-5 blur-3xl"
          style={{ backgroundColor: mainColor }}
        />
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
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span
              className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white shadow-lg bg-gradient-default"
              // style={{
              //   background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              // }}
            >
              <Award className="w-4 h-4" />
              TRY OUT TERSEDIA
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-main-default">
            Pilih Try Out Terbaikmu
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Kami menyediakan berbagai Try Out berkualitas untuk membantu
            persiapan ujian masuk PTN dan sekolah kedinasan favoritmu.
          </p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center items-center gap-8 mt-8"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-main-default">
                {cards.length}
              </div>
              <div className="text-sm text-gray-500">Try Out Aktif</div>
            </div>
            <div className="w-px h-12 bg-gray-300" />
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">GRATIS</div>
              <div className="text-sm text-gray-500">Tanpa Biaya</div>
            </div>
            <div className="w-px h-12 bg-gray-300" />
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">24/7</div>
              <div className="text-sm text-gray-500">Akses Kapan Saja</div>
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
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
              href={`${website_sub_category_id}/user/try-out`}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-bold text-lg shadow-xl transition-all duration-300 hover:shadow-2xl bg-gradient-default"
            >
              Lihat Semua Try Out
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-bold text-lg shadow-xl transition-all duration-300 hover:shadow-2xl bg-gradient-default"
              onClick={() => {
                router.push(
                  `${window.location.pathname}?href=/${website_sub_category_id}/user/try-out`,
                );
                setShowAuth((prev) => ({ ...prev, open: true }));
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

// Enhanced TryOut Card Component
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

  return (
    <div className="group h-full bg-white rounded-3xl border-2 border-gray-100 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
      {/* Enhanced Header */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={
            `${env.NEXT_PUBLIC_SUPABASE_IMG_URL || '/placeholder.svg'}/tryout/${tryOut.image}` ||
            'placeholder.svg'
          }
          alt={tryOut.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Enhanced Overlay */}
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background: `linear-gradient(135deg, ${mainColor}80, ${secondaryColor}60)`,
          }}
        />

        {/* Enhanced Badges */}
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center gap-2 rounded-2xl bg-white/95 backdrop-blur-sm px-4 py-2 text-sm font-bold shadow-lg border-2 border-white/50">
            <Award className="w-4 h-4 text-yellow-500" />
            <span style={{ color: mainColor }}>GRATIS!</span>
          </span>
        </div>

        <div className="absolute top-4 right-4 z-10">
          <span
            className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-bold text-white shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${secondaryColor}, ${mainColor})`,
            }}
          >
            {tryOut.WebsiteSubCategory.name}
          </span>
        </div>

        {/* Enhanced Title */}
        <div className="absolute bottom-4 left-4 right-4 text-center">
          <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">
            {tryOut.title}
          </h3>
        </div>
      </div>

      {/* Enhanced Body */}
      <div className="p-6 space-y-6">
        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div
            className="text-center p-3 rounded-2xl"
            style={{ backgroundColor: `${mainColor}10` }}
          >
            <Clock
              className="w-5 h-5 mx-auto mb-2"
              style={{ color: mainColor }}
            />
            <div className="text-xs text-gray-600 mb-1">Durasi</div>
            <div
              className="font-bold"
              style={{ color: mainColor }}
            >
              {tryOut.TryoutSession.reduce(
                (acc, item) => acc + item.duration,
                0,
              )}{' '}
              min
            </div>
          </div>
          <div
            className="text-center p-3 rounded-2xl"
            style={{ backgroundColor: `${mainColor}10` }}
          >
            <BookOpen
              className="w-5 h-5 mx-auto mb-2"
              style={{ color: mainColor }}
            />
            <div className="text-xs text-gray-600 mb-1">Soal</div>
            <div
              className="font-bold"
              style={{ color: mainColor }}
            >
              {tryOut.TryoutSession.reduce(
                (acc, session) => acc + session._count.TryoutQuestion,
                0,
              )}
            </div>
          </div>
          <div
            className="text-center p-3 rounded-2xl"
            style={{ backgroundColor: `${mainColor}10` }}
          >
            <Users
              className="w-5 h-5 mx-auto mb-2"
              style={{ color: mainColor }}
            />
            <div className="text-xs text-gray-600 mb-1">Peserta</div>
            <div
              className="font-bold"
              style={{ color: mainColor }}
            >
              {tryOut._count.TryoutRegistration}
            </div>
          </div>
        </div>

        {/* Enhanced Date Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-4 rounded-2xl bg-gray-50 border border-gray-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Mulai</span>
            </div>
            <div className="text-sm font-bold text-green-600">
              {getDateString(tryOut.startDate)}
            </div>
          </div>
          <div className="text-center p-4 rounded-2xl bg-gray-50 border border-gray-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-gray-700">Selesai</span>
            </div>
            <div className="text-sm font-bold text-red-600">
              {getDateString(tryOut.endDate)}
            </div>
          </div>
        </div>

        {/* Enhanced CTA Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (!session) {
              setShowAuth((prev) => ({ ...prev, open: true }));
              router.push(`${window.location.pathname}?tryoutId=${tryOut.id}`);
              return;
            }
            router.push(
              `${tryOut.WebsiteSubCategory.id}/user/try-out?id=${tryOut.id}`,
            );
          }}
          className="w-full group flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-white font-bold shadow-lg transition-all duration-300 hover:shadow-xl"
          style={{
            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
          }}
        >
          <span>Daftar Sekarang</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </div>
  );
};

export default FeaturedTryoutSection;
