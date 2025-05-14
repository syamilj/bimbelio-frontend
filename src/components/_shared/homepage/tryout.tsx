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
  Award,
  BookOpen,
  Calendar,
  Clock,
  Loader2,
  Tag,
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
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300"
    >
      {/* Header */}
      <div className="relative h-[200px] w-full overflow-hidden">
        <Image
          src={
            `${env.NEXT_PUBLIC_SUPABASE_IMG_URL || '/placeholder.svg'}/tryout/${tryOut.image}` ||
            'placeholder.svg'
          }
          alt={tryOut.title}
          fill
          className="object-cover transition-transform object-[90%_20%] duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/50 via-blue-600/30 to-blue-600/20" />

        {/* Price */}
        <div className="absolute left-4 top-4 z-10">
          <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-blue-600 shadow-md flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-yellow-500" />
            Gratis!
          </span>
        </div>

        {/* Popular / New */}
        {/* <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
          {tryOut.isPopular && (
            <span className="rounded-full bg-yellow-400 px-3 py-1 text-sm font-bold text-blue-800 shadow-md flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5" />
              POPULER
            </span>
          )}
          {tryOut.isNew && (
            <span className="rounded-full bg-blue-500 px-3 py-1 text-sm font-bold text-white shadow-md flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              BARU
            </span>
          )}
        </div> */}

        {/* Category & Title */}
        <div className="absolute bottom-0 left-0 w-full p-4 text-center">
          <span className="mb-2 inline-block rounded-full bg-yellow-400 px-4 py-1 text-sm font-bold text-blue-900">
            {tryOut.WebsiteSubCategory.name}
          </span>
          <h3 className="text-xl font-bold text-white md:text-2xl">
            {tryOut.title}
          </h3>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* <p className="mb-4 text-sm text-gray-600">{tryOut.description}</p> */}

        <div className="mb-4 grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-blue-50 p-2 text-center flex flex-col items-center">
            <div className="text-xs text-gray-600 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-blue-600" />
              Durasi
            </div>
            <div className="text-sm font-bold text-blue-600">
              {tryOut.TryoutSession.reduce(
                (acc, item) => acc + item.duration,
                0,
              )}
            </div>
          </div>
          <div className="rounded-xl bg-blue-50 p-2 text-center flex flex-col items-center">
            <div className="text-xs text-gray-600 flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5 text-blue-600" />
              Soal
            </div>
            <div className="text-sm font-bold text-blue-600">
              {tryOut.TryoutSession.reduce(
                (acc, session) => acc + session._count.TryoutQuestion,
                0,
              )}
            </div>
          </div>
          <div className="rounded-xl bg-blue-50 p-2 text-center flex flex-col items-center">
            <div className="text-xs text-gray-600 flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-blue-600" />
              Peserta
            </div>
            <div className="text-sm font-bold text-blue-600">
              {tryOut._count.TryoutRegistration}
            </div>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-center flex-wrap gap-1.5">
          {['tryout'].map((tag, idx) => (
            <span
              key={idx}
              className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600 flex items-center gap-1"
            >
              <Tag className="h-2.5 w-2.5" />
              {tag}
            </span>
          ))}
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2">
          <div className="flex flex-col items-center rounded-lg bg-blue-50 p-2 text-xs">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-blue-600" />
              <span className="font-medium text-gray-700">Mulai</span>
            </div>
            <span className="mt-1 text-sm font-bold text-blue-600">
              {getDateString(tryOut.startDate)}
            </span>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-blue-50 p-2 text-xs">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-blue-600" />
              <span className="font-medium text-gray-700">Selesai</span>
            </div>
            <span className="mt-1 text-sm font-bold text-blue-600">
              {getDateString(tryOut.endDate)}
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            if (!session) {
              setShowAuth((prev) => ({ ...prev, login: true }));
              router.push(`${window.location.pathname}?tryoutId=${tryOut.id}`);
              return;
            }
            router.push(
              `${tryOut.WebsiteSubCategory.id}/user/try-out?id=${tryOut.id}`,
            );
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-default px-4 py-2 text-sm font-bold text-white transition-colors hover:opacity-85"
        >
          Daftar Sekarang
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};
