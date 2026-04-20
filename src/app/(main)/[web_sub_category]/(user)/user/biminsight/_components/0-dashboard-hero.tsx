'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Skeleton } from '@/components/ui/skeleton';
import { useGet } from '@/lib/fetch-helper/useGet';
import {
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Sparkles,
  Target,
  Video,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { InsightBanner, ScrollRow, StatPill } from './_primitives';

interface UserData {
  name: string;
  email: string;
  targetValue: number | null;
  choiceOne: { univ: string | null; major: string | null };
  choiceTwo: { univ: string | null; major: string | null };
  summaryCount: {
    tryout: number;
    quiz: number;
    liveClass: number;
  };
  program: { planId: string; name: string; expire: string }[];
}

export function DashboardHero() {
  const { web_sub_category } = useParams();
  const { mainColor } = useWebsiteSubCategory();

  const { data, isLoading } = useGet<UserData>(
    '/learningAnalytics/getUserData',
    {
      params: { website_sub_category_id: web_sub_category },
    },
  );

  if (isLoading) return <LoadingState />;
  if (!data) return null;

  const firstName = data.name?.split(' ')[0] || 'Siswa';

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white p-5 md:p-7 shadow-xl shadow-slate-200/20 mb-4 transition-all hover:shadow-2xl hover:shadow-slate-200/30">
      {/* Decorative Background Elements */}
      <div
        className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 rounded-full opacity-[0.04] blur-3xl pointer-events-none"
        style={{ backgroundColor: mainColor }}
      />
      <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-48 h-48 rounded-full bg-blue-500 opacity-[0.03] blur-2xl pointer-events-none" />

      <div className="relative z-10">
        {/* Hero header */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className="flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-[1.25rem] shadow-sm transform transition-transform hover:scale-105"
            style={{ backgroundColor: `${mainColor}15`, color: mainColor }}
          >
            <Sparkles className="h-6 w-6 md:h-7 md:w-7 drop-shadow-sm" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
              Halo, <span style={{ color: mainColor }}>{firstName}</span>!
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5 md:mt-1">
              Berikut ringkasan perjalanan belajarmu hari ini 🚀
            </p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="bg-slate-50/50 -mx-2 px-2 py-3 rounded-2xl mb-4 md:-mx-4 md:px-4">
          <ScrollRow>
            <StatPill
              label="Tryout"
              value={String(data.summaryCount.tryout)}
              sub="total dikerjakan"
              icon={<ClipboardCheck className="h-4 w-4" />}
              color={mainColor}
            />
            <StatPill
              label="Kuis"
              value={String(data.summaryCount.quiz)}
              sub="total dikerjakan"
              icon={<BookOpen className="h-4 w-4" />}
              color="#6366f1"
            />
            <StatPill
              label="Live Class"
              value={String(data.summaryCount.liveClass)}
              sub="kehadiran"
              icon={<Video className="h-4 w-4" />}
              color="#22c55e"
            />
          </ScrollRow>
        </div>

        {/* Insight */}
        <div>
          <InsightBanner tone="info">
            {data.summaryCount.tryout + data.summaryCount.quiz > 0
              ? `Kamu sudah mengerjakan ${data.summaryCount.tryout} tryout dan ${data.summaryCount.quiz} quiz. Terus berlatih untuk hasil terbaik!`
              : 'Belum ada aktivitas tercatat. Mulai kerjakan tryout atau quiz pertamamu!'}
          </InsightBanner>
        </div>

        {/* Target & choice info pills */}
        {(data.targetValue || data.choiceOne.univ) && (
          <div className="mt-5 flex flex-wrap gap-2.5">
            {data.targetValue && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 text-xs font-bold text-amber-900 shadow-sm transition-transform hover:-translate-y-0.5">
                <Target className="h-4 w-4 text-amber-500" />
                <span>
                  Target:{' '}
                  <span className="text-amber-600">{data.targetValue}</span>
                </span>
              </div>
            )}
            {data.choiceOne.univ && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/50 text-xs font-bold text-blue-900 shadow-sm transition-transform hover:-translate-y-0.5">
                <GraduationCap className="h-4 w-4 text-blue-500" />
                <span className="truncate max-w-[200px] md:max-w-none">
                  Pilihan 1:{' '}
                  <span className="text-blue-600">
                    {data.choiceOne.major || data.choiceOne.univ}
                  </span>
                </span>
              </div>
            )}
            {data.choiceTwo.univ && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/50 text-xs font-bold text-indigo-900 shadow-sm transition-transform hover:-translate-y-0.5">
                <GraduationCap className="h-4 w-4 text-indigo-500" />
                <span className="truncate max-w-[200px] md:max-w-none">
                  Pilihan 2:{' '}
                  <span className="text-indigo-600">
                    {data.choiceTwo.major || data.choiceTwo.univ}
                  </span>
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div
      className="rounded-3xl p-5 md:p-7 space-y-5 border border-slate-200/60 shadow-xl shadow-slate-200/20"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      }}
    >
      <div className="flex items-center gap-4">
        <Skeleton className="h-14 w-14 md:h-16 md:w-16 rounded-[1.25rem]" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <ScrollRow>
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </ScrollRow>
      <Skeleton className="h-12 w-full rounded-2xl" />
    </div>
  );
}
