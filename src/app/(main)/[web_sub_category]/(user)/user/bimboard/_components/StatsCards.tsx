"use client";

import { useWebsiteSubCategory } from "@/components/provider/provider-website-category";
import { Clock, TrendingUp, Trophy, Target } from "lucide-react";

interface StatsCardsProps {
  studyHours: number;
  totalScore: number;
  rank: number;
  rankFrom: number;
  tryoutsCompleted: number;
  lastTryoutTitle: string | null;
}

export default function StatsCards({
  studyHours,
  totalScore,
  rank,
  rankFrom,
  tryoutsCompleted,
  lastTryoutTitle,
}: StatsCardsProps) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || "#0091FF";

  return (
    <div className="w-full">
      {/* Main Stats - 2x2 Grid on Mobile, 4 cols on Desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
        {/* Jam Belajar */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-3 md:p-4 border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs text-blue-600 font-medium">Jam Belajar</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl md:text-3xl font-black text-blue-700">
              {Math.floor(studyHours)}
            </span>
            <span className="text-sm text-blue-500 font-medium">jam</span>
          </div>
        </div>

        {/* Nilai Total */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-3 md:p-4 border border-amber-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs text-amber-600 font-medium">Nilai Total</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl md:text-3xl font-black text-amber-700">
              {totalScore.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Peringkat */}
        <div
          className="rounded-2xl p-3 md:p-4 border"
          style={{
            background: `linear-gradient(135deg, ${mainColor}10, ${mainColor}20)`,
            borderColor: `${mainColor}30`
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: mainColor }}
            >
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-medium" style={{ color: mainColor }}>Peringkat</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl md:text-3xl font-black" style={{ color: mainColor }}>
              #{rank || "-"}
            </span>
            <span className="text-xs font-medium opacity-70" style={{ color: mainColor }}>
              / {rankFrom}
            </span>
          </div>
          {lastTryoutTitle && (
            <p className="text-[10px] mt-1 truncate opacity-60" style={{ color: mainColor }}>
              {lastTryoutTitle}
            </p>
          )}
        </div>

        {/* TO Selesai */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-3 md:p-4 border border-emerald-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs text-emerald-600 font-medium">TO Selesai</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl md:text-3xl font-black text-emerald-700">
              {tryoutsCompleted}
            </span>
            <span className="text-sm text-emerald-500 font-medium">tryout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
