"use client";

import { useWebsiteSubCategory } from "@/components/provider/provider-website-category";
import { Skeleton } from "@/components/ui/skeleton";
import { useGet } from "@/lib/fetch-helper/useGet";
import {
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Sparkles,
  Target,
  Video,
} from "lucide-react";
import { useParams } from "next/navigation";
import { InsightBanner, ScrollRow, StatPill } from "./_primitives";

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
    "/learningAnalytics/getUserData",
    {
      params: { website_sub_category_id: web_sub_category },
    },
  );

  if (isLoading) return <LoadingState />;
  if (!data) return null;

  const firstName = data.name?.split(" ")[0] || "Siswa";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm mb-4">
      {/* Hero header */}
      <div className="flex items-center gap-4 mb-5">
        <div
          className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-3xl"
          style={{ backgroundColor: `${mainColor}15`, color: mainColor }}
        >
          <Sparkles className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800">
            Halo, {firstName}!
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Berikut ringkasan perjalanan belajarmu
          </p>
        </div>
      </div>

      {/* Quick stats */}
      <ScrollRow>
        <StatPill
          label="Tryout"
          value={String(data.summaryCount.tryout)}
          sub="total dikerjakan"
          icon={<ClipboardCheck className="h-3.5 w-3.5" />}
          color={mainColor}
        />
        <StatPill
          label="Kuis"
          value={String(data.summaryCount.quiz)}
          sub="total dikerjakan"
          icon={<BookOpen className="h-3.5 w-3.5" />}
          color="#6366f1"
        />
        <StatPill
          label="Live Class"
          value={String(data.summaryCount.liveClass)}
          sub="kehadiran"
          icon={<Video className="h-3.5 w-3.5" />}
          color="#22c55e"
        />
      </ScrollRow>

      {/* Insight */}
      <div className="mt-4">
        <InsightBanner tone="info">
          {data.summaryCount.tryout + data.summaryCount.quiz > 0
            ? `Kamu sudah mengerjakan ${data.summaryCount.tryout} tryout dan ${data.summaryCount.quiz} quiz. Terus berlatih untuk hasil terbaik!`
            : "Belum ada aktivitas tercatat. Mulai kerjakan tryout atau quiz pertamamu!"}
        </InsightBanner>
      </div>

      {/* Target & choice info pills */}
      {(data.targetValue || data.choiceOne.univ) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {data.targetValue && (
            <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-50 text-xs font-bold shadow-sm border border-slate-200/60">
              <Target className="h-4 w-4 text-amber-500" />
              <span className="text-slate-700">Target: {data.targetValue}</span>
            </div>
          )}
          {data.choiceOne.univ && (
            <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-50 text-xs font-bold shadow-sm border border-slate-200/60">
              <GraduationCap className="h-4 w-4 text-blue-500" />
              <span className="text-slate-700">
                Pilihan 1: {data.choiceOne.major || data.choiceOne.univ}
              </span>
            </div>
          )}
          {data.choiceTwo.univ && (
            <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-50 text-xs font-bold shadow-sm border border-slate-200/60">
              <GraduationCap className="h-4 w-4 text-indigo-500" />
              <span className="text-slate-700">
                Pilihan 2: {data.choiceTwo.major || data.choiceTwo.univ}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div
      className="rounded-3xl p-5 md:p-6 space-y-4"
      style={{ background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)" }}
    >
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-3xl" />
        <div className="space-y-1.5">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>
      <ScrollRow>
        <Skeleton className="h-20 rounded-3xl" />
        <Skeleton className="h-20 rounded-3xl" />
        <Skeleton className="h-20 rounded-3xl" />
      </ScrollRow>
    </div>
  );
}
