'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Skeleton } from '@/components/ui/skeleton';
import { useGet } from '@/lib/fetch-helper/useGet';
import { Award, BookOpen, Clock, Flame, Target, TrendingUp } from 'lucide-react';

type CourseHeading = {
  id: number;
  title: string;
  description: string;
  completedSubChapters: number;
  totalSubChapters: number;
  streak: number;
  totalHours: number;
  tryoutResults: {
    score: number;
    rank: number;
    previousRank: number | null;
  } | null;
  targetValue: number | null;
  gapFromTarget: number | null;
};

export default function CourseSummary() {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const { data: headingData, isLoading } = useGet<CourseHeading>('/course/getCourseHeading');

  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  const overallProgress =
    headingData && headingData.totalSubChapters > 0
      ? Math.min(100, Math.round((headingData.completedSubChapters / headingData.totalSubChapters) * 100))
      : 0;

  const statCards = [
    {
      title: 'Sub Chapter',
      value: headingData ? `${headingData.completedSubChapters}/${headingData.totalSubChapters}` : '0/0',
      subtitle: `${overallProgress}% selesai`,
      icon: BookOpen,
      bg: 'from-blue-50 to-blue-100',
      iconBg: 'bg-blue-500',
    },
    {
      title: 'Nilai TO Terakhir',
      value: headingData?.tryoutResults?.score ?? '-',
      subtitle: headingData?.targetValue ? `Target: ${headingData.targetValue}` : 'Belum ada data',
      icon: TrendingUp,
      bg: 'from-purple-50 to-purple-100',
      iconBg: 'bg-purple-500',
      extra:
        headingData?.gapFromTarget !== null && headingData?.gapFromTarget !== undefined
          ? {
              label: `${headingData.gapFromTarget >= 0 ? '+' : ''}${headingData.gapFromTarget}`,
              positive: headingData.gapFromTarget >= 0,
            }
          : null,
    },
    {
      title: 'Peringkat TO',
      value: headingData?.tryoutResults?.rank ? `#${headingData.tryoutResults.rank}` : '-',
      subtitle: headingData?.tryoutResults?.previousRank
        ? `Sebelumnya: #${headingData.tryoutResults.previousRank}`
        : 'Belum ada data',
      icon: Award,
      bg: 'from-amber-50 to-amber-100',
      iconBg: 'bg-amber-500',
    },
    {
      title: 'Hari Streak',
      value: headingData?.streak ?? 0,
      subtitle: '🔥 Keep it up!',
      icon: Flame,
      bg: 'from-orange-50 to-orange-100',
      iconBg: 'bg-orange-500',
    },
    {
      title: 'Jam Belajar',
      value: headingData ? `${headingData.totalHours.toFixed(1)}` : '0',
      subtitle: 'Jam total tercatat',
      icon: Clock,
      bg: 'from-emerald-50 to-emerald-100',
      iconBg: 'bg-emerald-500',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Welcome + Progress Hero Card */}
      <div
        className="relative bg-white border border-slate-200/80 rounded-3xl p-4 md:p-6 shadow-sm overflow-hidden"
      >
        <div
          className="absolute top-0 right-0 w-2/5 h-full"
          style={{
            background: `linear-gradient(135deg, transparent 0%, transparent 50%, ${mainColor}08 50%, ${mainColor}12 100%)`,
          }}
        />
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-slate-400 text-xs font-semibold mb-0.5">Selamat Belajar,</p>
            <h1 className="text-xl md:text-2xl font-black text-slate-800 truncate">
              {session?.user?.name || 'User'}
            </h1>
            <p className="text-slate-500 text-xs md:text-sm mt-1">
              Lanjutkan perjalanan belajarmu dan raih impianmu!
            </p>
          </div>

          {/* Circular Progress */}
          <div className="relative flex-shrink-0">
            <svg className="w-20 h-20 md:w-24 md:h-24 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="#e2e8f0" strokeWidth="8" fill="none" />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke={mainColor}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${overallProgress * 2.51}, 251`}
                style={{ filter: `drop-shadow(0 2px 6px ${mainColor}40)` }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-xl md:text-2xl font-black" style={{ color: mainColor }}>
                {overallProgress}<span className="text-xs">%</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      {!isLoading ? (
        <>
          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-5 gap-3">
            {statCards.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className={`relative overflow-hidden rounded-3xl p-4 bg-gradient-to-br ${stat.bg} border border-white/50 shadow-sm hover:shadow-md transition-all group hover:scale-[1.03]`}
                >
                  <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full opacity-10 group-hover:opacity-20 blur-xl bg-current transition-opacity" />
                  <div className={`relative z-10 w-10 h-10 rounded-3xl ${stat.iconBg} flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="relative z-10 space-y-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-slate-800">{stat.value}</span>
                      {'extra' in stat && stat.extra && (
                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${stat.extra.positive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {stat.extra.label}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{stat.title}</p>
                    <p className="text-xs text-slate-400 font-medium">{stat.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Horizontal Scroll */}
          <div className="md:hidden flex gap-3 overflow-x-auto pb-1 -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
            {statCards.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className={`relative overflow-hidden rounded-3xl p-4 bg-gradient-to-br ${stat.bg} border border-white/50 shadow-sm flex-shrink-0 w-36 snap-start`}
                >
                  <div className={`w-9 h-9 rounded-3xl ${stat.iconBg} flex items-center justify-center mb-2.5 shadow-sm`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xl font-black text-slate-800 block">{stat.value}</span>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">{stat.title}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{stat.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <div className="hidden md:grid grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-3xl" />
            ))}
          </div>
          <div className="md:hidden flex gap-3 overflow-x-auto pb-1 -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-36 flex-shrink-0 rounded-3xl" />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
