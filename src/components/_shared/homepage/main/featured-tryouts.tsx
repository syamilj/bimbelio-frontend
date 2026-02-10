'use client';

import { CardTryoutProps } from '@/app/(main)/[web_sub_category]/(user)/user/bimarena/try-out/_components/ui/card-tryout';
import { useGuest } from '@/components/layout/layoutGuest';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { env } from '@/env.mjs';
import { useGet } from '@/lib/fetch-helper/useGet';
import { getDateString } from '@/lib/utils';
import { WebsiteSubCategory } from '@/types/database';
import { motion } from 'framer-motion';
import { Award, BookOpen, Calendar, Clock, Users } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

interface TryoutData extends CardTryoutProps {
  WebsiteSubCategory: WebsiteSubCategory;
}

export default function FeaturedTryouts() {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const { data: session } = useSession();

  const mainColor = websiteSubCategory?.main_color || '#3b82f6';
  const secondaryColor = websiteSubCategory?.secondary_color || '#1e40af';

  const { data: rawTryouts, isLoading: loading } = useGet<TryoutData[]>(
    `/tryout/getTryOutCardUpcoming2?userId=${session?.user.id}`,
    {
      useEffectDependencies: [session?.user?.id],
    },
  );

  const tryouts = useMemo(() => (rawTryouts ?? []).slice(0, 3), [rawTryouts]);

  if (loading) {
    return (
      <section className="py-16 md:py-24 px-4 relative overflow-hidden bg-white">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white" />
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-3xl px-6 py-3 text-sm font-bold text-white shadow-lg animate-pulse bg-gray-300 mb-6">
              <div className="w-4 h-4 bg-gray-400 rounded"></div>
              Loading...
            </div>
            <div className="h-8 bg-gray-300 rounded mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded mb-8 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="animate-pulse bg-gray-200 rounded-3xl h-96"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!tryouts.length) {
    return (
      <section className="py-16 md:py-24 px-4 relative overflow-hidden bg-white">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white" />
        </div>
        <div className="max-w-7xl mx-auto text-center">
          <span
            className="inline-flex items-center gap-2 rounded-3xl px-6 py-3 text-sm font-bold text-white shadow-lg mb-6"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            <Calendar className="w-4 h-4" />
            🎯 TRYOUT ARENA
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Tryout Terbaru
          </h2>
          <p className="text-xl text-gray-600">
            Belum ada tryout yang tersedia saat ini
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calendar
              className="w-6 h-6"
              style={{ color: mainColor }}
            />
            <h2
              className="text-3xl font-bold"
              style={{ color: mainColor }}
            >
              Tryout Terbaru
            </h2>
          </div>
          <p className="text-lg text-gray-600">
            Uji kemampuanmu dengan tryout terbaru dan terbaik
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tryouts.map((tryout, index) => (
            <motion.div
              key={tryout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <EnhancedTryOutCard
                tryOut={tryout}
                mainColor={mainColor}
                secondaryColor={secondaryColor}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <button
            className="px-8 py-3 rounded-3xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{
              backgroundColor: mainColor,
              boxShadow: `0 4px 14px 0 ${mainColor}40`,
            }}
          >
            Lihat Semua Tryout
          </button>
        </motion.div>
      </div>
    </section>
  );
}

// Enhanced TryOut Card Component
const EnhancedTryOutCard = ({
  tryOut,
  mainColor,
  secondaryColor,
}: {
  tryOut: TryoutData;
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: mainColor }}
          >
            {tryOut.WebsiteSubCategory.name}
          </span>
        </div>
      </div>

      {/* Enhanced Body */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <h3 className="font-bold text-xl text-gray-800 line-clamp-2 group-hover:text-gray-900 transition-colors">
          {tryOut.title}
        </h3>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users
              className="w-4 h-4"
              style={{ color: mainColor }}
            />
            <span>{tryOut._count.TryoutRegistration || 0} peserta</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock
              className="w-4 h-4"
              style={{ color: mainColor }}
            />
            <span>
              {tryOut.TryoutSession.reduce(
                (acc, item) => acc + item.duration,
                0,
              )}{' '}
              menit
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <BookOpen
              className="w-4 h-4"
              style={{ color: mainColor }}
            />
            <span>
              {tryOut.TryoutSession.reduce(
                (acc, session) => acc + session._count.TryoutQuestion,
                0,
              )}{' '}
              soal
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Award
              className="w-4 h-4"
              style={{ color: mainColor }}
            />
            <span>Sertifikat</span>
          </div>
        </div>

        {/* Enhanced Date Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar
              className="w-4 h-4"
              style={{ color: mainColor }}
            />
            <span className="text-gray-600">
              Mulai: {getDateString(tryOut.startDate)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar
              className="w-4 h-4"
              style={{ color: secondaryColor }}
            />
            <span className="text-gray-600">
              Berakhir: {getDateString(tryOut.endDate)}
            </span>
          </div>
        </div>

        {/* Enhanced CTA Button */}
        <button
          onClick={() => {
            if (!session) {
              setShowAuth((prev) => ({ ...prev, open: true }));
              return;
            }
            router.push(
              `${tryOut.WebsiteSubCategory.id}/user/bimarena/try-out?id=${tryOut.id}`,
            );
          }}
          className="w-full py-3 rounded-3xl font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
          style={{
            background: `linear-gradient(135deg, ${mainColor} 0%, ${secondaryColor} 100%)`,
            boxShadow: `0 4px 14px 0 ${mainColor}40`,
          }}
        >
          {session ? 'Mulai Tryout' : 'Login untuk Mulai'}
        </button>
      </div>
    </div>
  );
};
