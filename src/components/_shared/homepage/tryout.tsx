'use client';

import { CardTryoutProps } from '@/app/[web_sub_category]/(user)/user/try-out/_components/ui/card-tryout';
import { useGuest } from '@/components/layout/layoutGuest';
import AnimatedGradientText from '@/components/magicui/animated-gradient-text';
import { useSession } from '@/components/provider/session-provider-auth';
import { env } from '@/env.mjs';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { getGeneral } from '@/lib/fetch-helper';
import { cn, getDateString } from '@/lib/utils';
import { WebsiteSubCategory } from '@/types/database';
import { motion, useAnimation, useInView } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  Clock,
  FileText,
  Loader2,
  Star,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const FeaturedTryoutSection = () => {
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

  // if(cards.length === 0) {
  //   return (
  //     <div>awdwad</div>
  //   )
  // }

  return (
    <section
      id="tryout"
      className={cn(
        'relative overflow-hidden py-16 md:py-20',
        !isLoading && cards.length === 0 && 'hidden',
      )}
    >
      {/* Decorative Elements */}
      <div className="absolute left-0 top-1/3 -z-10 h-64 w-64 rounded-full bg-blue-100 opacity-30 blur-3xl"></div>
      <div className="absolute right-0 top-2/3 -z-10 h-64 w-64 rounded-full bg-yellow-100 opacity-30 blur-3xl"></div>
      <div className="absolute left-1/4 bottom-1/4 -z-10 h-32 w-32 rounded-full bg-purple-100 opacity-30 blur-2xl"></div>

      <div
        className="container mx-auto px-4"
        ref={ref}
      >
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.5 } },
          }}
          className="mb-4 text-center"
        >
          <span className="inline-block rounded-full bg-main-default/10 px-4 py-1 text-sm font-medium text-main-default">
            TRY OUT TERSEDIA
          </span>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, delay: 0.1 },
            },
          }}
          className="mb-8 text-center"
        >
          <h2 className="text-center text-[1.5rem] font-bold md:text-[2.5rem]">
            <AnimatedGradientText>Pilih Try Out Terbaikmu</AnimatedGradientText>
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Kami menyediakan berbagai Try Out berkualitas untuk membantu
            persiapan ujian masuk PTN dan sekolah kedinasan favoritmu.(
            {cards.length})
          </p>
        </motion.div>

        <motion.div
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, delay: 0.2, staggerChildren: 0.1 },
            },
          }}
          className="flex justify-center gap-6  max-w-7xl mx-auto flex-wrap"
        >
          {isLoading ? (
            <div>
              <Loader2 className="animate-spin w-4 h-4 text-main-default" />
            </div>
          ) : (
            cards?.map((tryOut) => (
              <motion.div
                key={tryOut.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                className="w-full max-w-[320px]"
              >
                <FeaturedTryOutCard tryOut={tryOut} />
              </motion.div>
            ))
          )}
        </motion.div>
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, delay: 0.6 },
            },
          }}
          className="mt-12 flex justify-center"
        >
          {session ? (
            <Link
              href={`${website_sub_category_id}/user/try-out`}
              className="rounded-xl bg-gradient-default px-6 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              Lihat Semua Try Out
            </Link>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-xl bg-gradient-default px-6 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
              onClick={() => {
                router.push(
                  `${window.location.pathname}?href=/${website_sub_category_id}/user/try-out`,
                );
                setShowAuth((prev) => ({ ...prev, login: true }));
              }}
            >
              Lihat Semua Try Out
            </motion.button>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedTryoutSection;

const FeaturedTryOutCard = ({
  tryOut,
}: {
  tryOut: CardTryoutProps & { WebsiteSubCategory: WebsiteSubCategory };
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
    // Card biasa tetap sama seperti sebelumnya
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
    >
      {/* Card konten tetap sama */}
      <div className="relative h-[200px] w-full overflow-hidden md:h-[240px]">
        {tryOut.image && (
          <Image
            src={`${env.NEXT_PUBLIC_SUPABASE_IMG_URL}/tryout/${tryOut.image}`}
            alt={tryOut.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

        {/* Status Badges */}
        <div className="absolute left-0 top-0 flex flex-col gap-2 p-3">
          {/* {tryOut.isFree && (
            <span className="rounded-lg bg-green-500 px-2 py-0.5 text-xs font-bold text-white shadow-lg md:py-1">
              GRATIS
            </span>
          )} */}
          {/* {!tryOut.isFree && tryOut.price && (
            <span className="rounded-lg bg-main px-2 py-0.5 text-xs font-bold text-white shadow-lg md:py-1">
              Rp{tryOut.price.toLocaleString("id-ID")}
            </span>
          )} */}
        </div>

        <div className="absolute right-0 top-0 flex flex-col gap-2 p-3">
          {/* {tryOut.isPopular && (
            <span className="rounded-lg bg-yellow-400 px-2 py-0.5 text-xs font-bold text-blue-800 shadow-lg md:py-1">
              POPULER
            </span>
          )} */}
          {/* {tryOut.isNew && (
            <span className="rounded-lg bg-blue-400 px-2 py-0.5 text-xs font-bold text-white shadow-lg md:py-1">
              BARU
            </span>
          )} */}
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-4 left-4">
          <span
            className="inline-block rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white md:px-3 md:py-1"
            style={{ backgroundColor: tryOut.WebsiteSubCategory.main_color }}
          >
            {tryOut.WebsiteSubCategory.name}
          </span>
        </div>

        {/* Difficulty Badge */}
        {/* <div className="absolute bottom-4 right-4">
          <span
            key={idx}
            className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1 rounded-lg bg-blue-50 p-2 text-xs">
          <Calendar className="h-3 w-3 text-blue-600" />
          <span className="font-medium text-gray-700">
            Mulai: {tryOut.startDate}
          </span>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-blue-50 p-2 text-xs">
          <Calendar className="h-3 w-3 text-blue-600" />
          <span className="font-medium text-gray-700">
            Selesai: {tryOut.endDate}
          </span>
        </div> */}
      </div>

      <div className="p-4 md:p-5">
        <h3 className="mb-2 text-lg font-bold text-gray-900 md:text-xl">
          {tryOut.title}
        </h3>
        {/* <p className="mb-3 text-xs text-gray-600 line-clamp-2 md:text-sm">{tryOut.description}</p> */}

        {/* Tags */}
        {/* <div className="mb-3 flex flex-wrap gap-1">
          {tryOut.tags.map((tag, idx) => (
            <span key={idx} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
              #{tag}
            </span>
          ))}
        </div> */}

        {/* Rating */}
        <div className="mb-3 flex items-center">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Star
              key={idx}
              className={cn(
                'h-3 w-3 md:h-4 md:w-4',
                idx < Math.floor(4)
                  ? 'fill-yellow-400 text-yellow-400'
                  : idx < 4
                    ? 'fill-yellow-400 text-yellow-400 opacity-50'
                    : 'text-gray-300',
              )}
            />
          ))}
          <span className="ml-1 text-xs font-medium text-gray-700 md:text-sm">
            {(4).toFixed(1)}
          </span>
        </div>

        <div className="mb-4 max-w-[300px] grid grid-cols-2 gap-2 text-xs md:text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <Clock className="h-3 w-3 text-blue-600 md:h-4 md:w-4" />
            <span>
              {tryOut.TryoutSession.reduce(
                (acc, item) => acc + item.duration,
                0,
              )}{' '}
              menit
            </span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <FileText className="h-3 w-3 text-blue-600 md:h-4 md:w-4" />
            <span>
              {tryOut.TryoutSession.reduce(
                (acc, session) => acc + session._count.TryoutQuestion,
                0,
              )}{' '}
              Soal
            </span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Calendar className="h-3 w-3 text-blue-600 md:h-4 md:w-4" />
            <span>{getDateString(tryOut.startDate)}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Users className="h-3 w-3 text-blue-600 md:h-4 md:w-4" />
            <span>{tryOut._count.TryoutRegistration} Peserta</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {/* <div className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
              <Percent className="h-3 w-3" />
              <span>Kelulusan: {tryOut.passingRate}%</span>
            </div> */}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-medium text-white md:gap-2 md:px-4 md:py-2 md:text-sm bg-gradient-default',
            )}
            onClick={() => {
              if (!session) {
                setShowAuth((prev) => ({ ...prev, login: true }));
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
            Daftar
            <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
