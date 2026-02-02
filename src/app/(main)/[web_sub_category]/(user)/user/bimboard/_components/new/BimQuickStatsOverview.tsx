"use client";

import { useWebsiteSubCategory } from "@/components/provider/provider-website-category";
import { BimArena, BimCourse } from "@/components/ui/bim-brand";
import {
  BookOpen,
  Target,
  Clock,
  Trophy,
  TrendingUp,
  Award,
  FileText,
  Video
} from "lucide-react";
import { DecorativePatterns } from "./DecorativePatterns";

interface BimQuickStatsOverviewProps {
  stats: {
    studyHours: number;
    studyHoursThisWeek: number;
    totalScore: number;
    averageScore: number;
    rank: number;
    rankFrom: number;
    previousRank: number;
    rankChange: number;
    tryoutsCompleted: number;
    coursesCompleted: number;
    coursesInProgress: number;
    documentsRead: number;
    liveClassesAttended: number;
  };
}

export default function BimQuickStatsOverview({ stats }: BimQuickStatsOverviewProps) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || "#0091FF";

  // Ensure we have valid data with fallbacks
  const safeStats = {
    studyHours: stats?.studyHours || 0,
    studyHoursThisWeek: stats?.studyHoursThisWeek || 0,
    totalScore: stats?.totalScore || 0,
    averageScore: stats?.averageScore || 0,
    rank: stats?.rank || 0,
    rankFrom: stats?.rankFrom || 0,
    previousRank: stats?.previousRank || 0,
    rankChange: stats?.rankChange || 0,
    tryoutsCompleted: stats?.tryoutsCompleted || 0,
    coursesCompleted: stats?.coursesCompleted || 0,
    coursesInProgress: stats?.coursesInProgress || 0,
    documentsRead: stats?.documentsRead || 0,
    liveClassesAttended: stats?.liveClassesAttended || 0,
  };

  const statCards = [
    {
      title: "Jam Belajar",
      value: Math.floor(safeStats.studyHours),
      unit: "jam",
      subtitle: `+${safeStats.studyHoursThisWeek}j minggu ini`,
      icon: Clock,
      gradient: "from-blue-500 to-blue-600",
      bg: "from-blue-50 to-blue-100",
      iconBg: "bg-blue-500",
    },
    {
      title: <><BimArena /> Selesai</>,
      value: safeStats.tryoutsCompleted,
      unit: "tryout",
      subtitle: safeStats.rank > 0 ? `Peringkat #${safeStats.rank}` : "Yuk mulai!",
      icon: Target,
      gradient: "from-emerald-500 to-emerald-600",
      bg: "from-emerald-50 to-emerald-100",
      iconBg: "bg-emerald-500",
    },
    {
      title: "Rata-rata Skor",
      value: safeStats.averageScore > 0 ? Math.round(safeStats.averageScore) : 0,
      unit: "",
      subtitle: safeStats.totalScore > 0 ? `Total ${safeStats.totalScore} poin` : "Belum ada data",
      icon: TrendingUp,
      gradient: "from-purple-500 to-purple-600",
      bg: "from-purple-50 to-purple-100",
      iconBg: "bg-purple-500",
    },
    {
      title: <><BimCourse /> Aktif</>,
      value: safeStats.coursesInProgress,
      unit: "kursus",
      subtitle: `${safeStats.coursesCompleted} selesai`,
      icon: BookOpen,
      gradient: "from-amber-500 to-amber-600",
      bg: "from-amber-50 to-amber-100",
      iconBg: "bg-amber-500",
    },
    {
      title: "Peringkat",
      value: safeStats.rank > 0 ? safeStats.rank : "-",
      unit: "",
      subtitle: safeStats.rankFrom > 0
        ? `dari ${safeStats.rankFrom} • ${safeStats.rankChange > 0 ? `↑${safeStats.rankChange}` : safeStats.rankChange < 0 ? `↓${Math.abs(safeStats.rankChange)}` : '='}`
        : "Belum ada ranking",
      icon: Trophy,
      gradient: "from-pink-500 to-pink-600",
      bg: "from-pink-50 to-pink-100",
      iconBg: "bg-pink-500",
    },
    {
      title: "Total Prestasi",
      value: safeStats.liveClassesAttended + safeStats.documentsRead,
      unit: "",
      subtitle: `${safeStats.liveClassesAttended} live class`,
      icon: Award,
      gradient: "from-rose-500 to-rose-600",
      bg: "from-rose-50 to-rose-100",
      iconBg: "bg-rose-500",
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-slate-800">Statistik Belajar</h2>
      </div>

      {/* Desktop: Grid Layout */}
      <div className="hidden md:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`relative overflow-hidden rounded-3xl p-4 bg-gradient-to-br ${stat.bg} border border-white/50 shadow-sm hover:shadow-md transition-all group hover:scale-105`}
            >
              {/* Decorative Glow */}
              <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
                style={{ backgroundColor: typeof stat.iconBg === 'string' && !stat.iconBg.startsWith('bg-') ? stat.iconBg : '#0091FF', filter: 'blur(20px)' }}
              />

              {/* Icon */}
              <div className={`relative z-10 w-10 h-10 rounded-3xl ${typeof stat.iconBg === 'string' && stat.iconBg.startsWith('bg-') ? stat.iconBg : ''} flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform`}
                style={typeof stat.iconBg === 'string' && !stat.iconBg.startsWith('bg-') ? { backgroundColor: stat.iconBg } : {}}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>

              {/* Value */}
              <div className="relative z-10 space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl md:text-3xl font-black text-slate-800">
                    {stat.value}
                  </span>
                  {stat.unit && (
                    <span className="text-xs font-semibold text-slate-500">
                      {stat.unit}
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">
                  {stat.title}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  {stat.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile: Horizontal Scroll */}
      <div className="md:hidden flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`relative overflow-hidden rounded-3xl p-4 bg-gradient-to-br ${stat.bg} border border-white/50 shadow-sm flex-shrink-0 w-40 snap-start`}
            >
              {/* Icon */}
              <div className={`w-10 h-10 rounded-3xl ${stat.iconBg} flex items-center justify-center mb-3 shadow-sm`}>
                <Icon className="w-5 h-5 text-white" />
              </div>

              {/* Value */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-800">
                    {stat.value}
                  </span>
                  {stat.unit && (
                    <span className="text-xs font-semibold text-slate-500">
                      {stat.unit}
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">
                  {stat.title}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  {stat.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
