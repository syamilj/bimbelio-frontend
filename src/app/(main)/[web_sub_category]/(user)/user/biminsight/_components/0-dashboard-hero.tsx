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
import { ScrollRow, StatPill } from "./_primitives";

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
    <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
      {/* Hero gradient */}
      <div
        className="px-5 pt-6 pb-5"
        style={{
          background: `linear-gradient(135deg, ${mainColor}08 0%, ${mainColor}18 100%)`,
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-3xl text-white"
            style={{ backgroundColor: mainColor }}
          >
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800">
              Halo, {firstName}! 👋
            </h1>
            <p className="text-xs text-slate-500">
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
      </div>

      {/* Target & choice info */}
      {(data.targetValue || data.choiceOne.univ) && (
        <div className="px-5 py-3 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs text-slate-500">
          {data.targetValue && (
            <div className="flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-amber-500" />
              <span>
                Target: <span className="font-bold text-slate-700">{data.targetValue}</span>
              </span>
            </div>
          )}
          {data.choiceOne.univ && (
            <div className="flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5 text-blue-500" />
              <span>
                Pilihan 1:{" "}
                <span className="font-bold text-slate-700">
                  {data.choiceOne.major || data.choiceOne.univ}
                </span>
              </span>
            </div>
          )}
          {data.choiceTwo.univ && (
            <div className="flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5 text-indigo-500" />
              <span>
                Pilihan 2:{" "}
                <span className="font-bold text-slate-700">
                  {data.choiceTwo.major || data.choiceTwo.univ}
                </span>
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
    <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden p-5 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-3xl" />
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-56" />
        </div>
      </div>
      <ScrollRow>
        <Skeleton className="h-16 rounded-3xl" />
        <Skeleton className="h-16 rounded-3xl" />
        <Skeleton className="h-16 rounded-3xl" />
      </ScrollRow>
    </div>
  );
}
