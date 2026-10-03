'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { ScrollWrapper } from '@/components/ui/scroll-wrapper';
import { cn, formatTwoDecimals } from '@/lib/utils';
import {
  CheckCircle2,
  Swords,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  Zap,
} from 'lucide-react';
import { useQuizProvider } from '../_provider/_provider';
import {
  calculateBeatenPercentage,
  calculateCompletionPercentage,
  formatNumber,
} from './quiz-dummy';

export function QuizStats() {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0066FF';
  const {
    useUserStatistic: { UserStatistic },
  } = useQuizProvider();

  const userStats = UserStatistic?.userStatistic;

  const rankChange = 0;
  const beatenCount = userStats?.userEliminate || 0;

  const completedQuizzes = userStats?.totalTryoutFinished || 0;
  const totalQuizzes = userStats?.totalTryout || 0;

  const accuracy = userStats?.accuracy || 0;

  const stats = [
    {
      title: 'Peringkat Battle',
      value: `#${userStats?.rank || '-'}`,
      change:
        rankChange > 0
          ? `+${rankChange}`
          : rankChange < 0
            ? `${rankChange}`
            : null,
      changeType: rankChange > 0 ? 'positive' : 'negative',
      icon: Trophy,
      color: '#f59e0b',
      bgColor: '#fef3c7',
      subtitle: `dari ${userStats?.totalParticipant || '-'} pejuang`,
    },
    {
      title: 'Pejuang Dikalahkan',
      value: formatNumber(beatenCount),
      icon: Swords,
      color: '#ec4899',
      bgColor: '#fce7f3',
      subtitle: `${calculateBeatenPercentage(beatenCount)}% peserta`,
    },
    {
      title: 'Total Skor',
      value: formatTwoDecimals(userStats?.totalScore || 0),
      subtitle: `Gap rank atas: -`,
      icon: Zap,
      color: mainColor,
      bgColor: `${mainColor}15`,
    },
    // {
    //   title: 'Battle Streak',
    //   value: `- hari`,
    //   icon: Flame,
    //   color: '#f97316',
    //   bgColor: '#ffedd5',
    //   subtitle:
    //     (userStats?.rank || 10000) <= 5 ? '🔥 On Fire!' : 'Pertahankan!',
    // },
    {
      title: 'Quiz Selesai',
      value: `${completedQuizzes}/${totalQuizzes}`,
      subtitle: `${calculateCompletionPercentage(completedQuizzes, totalQuizzes)}% complete`,
      icon: Target,
      color: '#10b981',
      bgColor: '#d1fae5',
    },
    {
      title: 'Akurasi Tempur',
      value: `${formatTwoDecimals(accuracy)}%`,
      subtitle: `${accuracy} hit`,
      icon: CheckCircle2,
      color: '#22c55e',
      bgColor: '#dcfce7',
    },
  ];

  return (
    <div className="relative">
      {/* Stats - Horizontal scroll on mobile with hidden scrollbar */}
      <ScrollWrapper
        className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 pb-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`.stats-scroll::-webkit-scrollbar { display: none; }`}</style>
        <div className="stats-scroll flex md:grid md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3 min-w-max md:min-w-0">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="relative overflow-hidden rounded-3xl md:rounded-3xl p-3 md:p-4 bg-gradient-to-br border border-white/50 shadow-sm hover:shadow-md transition-all group flex-shrink-0 w-[120px] md:w-auto"
                style={{
                  background: `linear-gradient(to bottom right, ${stat.bgColor}, ${stat.bgColor})`,
                }}
              >
                {/* Decorative Glow */}
                <div
                  className="absolute -bottom-6 -right-6 w-16 h-16 md:w-20 md:h-20 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
                  style={{ backgroundColor: stat.color, filter: 'blur(20px)' }}
                />

                {/* Icon */}
                <div
                  className="relative z-10 w-7 h-7 md:w-10 md:h-10 rounded-3xl md:rounded-3xl flex items-center justify-center mb-1.5 md:mb-3 shadow-sm"
                  style={{ backgroundColor: 'white' }}
                >
                  <Icon
                    className="w-3.5 h-3.5 md:w-5 md:h-5"
                    style={{ color: stat.color }}
                  />
                </div>

                {/* Value */}
                <div className="relative z-10 space-y-0.5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg md:text-2xl lg:text-3xl font-black text-slate-800">
                      {stat.value}
                    </span>
                    {stat.change && (
                      <span
                        className={cn(
                          'text-[9px] md:text-xs font-bold flex items-center gap-0.5',
                          stat.changeType === 'positive'
                            ? 'text-emerald-600'
                            : 'text-red-600',
                        )}
                      >
                        {stat.changeType === 'positive' ? (
                          <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3" />
                        ) : (
                          <TrendingDown className="w-2.5 h-2.5 md:w-3 md:h-3" />
                        )}
                        {stat.change}
                      </span>
                    )}
                  </div>
                  <p className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-wider line-clamp-1">
                    {stat.title}
                  </p>
                  {stat.subtitle && (
                    <p className="text-[9px] md:text-xs text-slate-400 font-medium line-clamp-1">
                      {stat.subtitle}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollWrapper>
    </div>
  );
}
