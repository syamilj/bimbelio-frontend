'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Gift,
  Star,
  Zap,
  Trophy,
  Medal,
  Crown,
  Flame,
  Target,
  BookOpen,
  Award,
  Lock,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Reward, Achievement, UserStats } from './quiz-types';

interface QuizRewardsProps {
  userStats: UserStats;
  rewards: Reward[];
  achievements: Achievement[];
}

export function QuizRewards({ userStats, rewards, achievements }: QuizRewardsProps) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const getRewardIcon = (tier: Reward['tier']) => {
    switch (tier) {
      case 'bronze':
        return <Medal className="w-6 h-6" />;
      case 'silver':
        return <Award className="w-6 h-6" />;
      case 'gold':
        return <Trophy className="w-6 h-6" />;
      case 'platinum':
        return <Crown className="w-6 h-6" />;
      default:
        return <Star className="w-6 h-6" />;
    }
  };

  const getRewardGradient = (tier: Reward['tier']) => {
    switch (tier) {
      case 'bronze':
        return 'from-orange-400 to-orange-600';
      case 'silver':
        return 'from-slate-300 to-slate-500';
      case 'gold':
        return 'from-yellow-400 to-amber-500';
      case 'platinum':
        return 'from-indigo-400 to-purple-600';
      default:
        return 'from-slate-400 to-slate-600';
    }
  };

  const getAchievementIcon = (id: string) => {
    const icons: Record<string, React.ReactNode> = {
      streak_7: <Flame className="w-5 h-5" />,
      streak_30: <Zap className="w-5 h-5" />,
      perfect_10: <Target className="w-5 h-5" />,
      quiz_master: <BookOpen className="w-5 h-5" />,
      top_10: <Crown className="w-5 h-5" />,
      all_subjects: <Star className="w-5 h-5" />,
    };
    return icons[id] || <Award className="w-5 h-5" />;
  };

  const unlockedRewards = rewards.filter(r => r.isUnlocked);
  const lockedRewards = rewards.filter(r => !r.isUnlocked);

  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const lockedAchievements = achievements.filter(a => !a.isUnlocked);

  // Calculate total points
  const totalPoints = userStats.totalScore;
  const nextReward = lockedRewards[0];
  const pointsToNextReward = nextReward ? nextReward.pointsRequired - totalPoints : 0;

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      {/* Points Summary */}
      <div
        className="relative overflow-hidden p-4 md:p-6 rounded-3xl md:rounded-3xl text-white shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-24 md:w-48 h-24 md:h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-16 md:w-32 h-16 md:h-32 bg-white/5 rounded-full blur-2xl" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-3xl md:rounded-3xl bg-white/20 flex items-center justify-center shadow-lg flex-shrink-0">
              <Gift className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div>
              <p className="text-[10px] md:text-xs text-white/70 font-bold uppercase tracking-wider">Total Poin</p>
              <p className="text-3xl md:text-5xl font-black">{totalPoints.toLocaleString()}</p>
              <p className="text-xs md:text-sm text-white/80 mt-0.5 md:mt-1">
                {unlockedRewards.length} hadiah terbuka
              </p>
            </div>
          </div>

          {nextReward && (
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl md:rounded-3xl p-3 md:p-5 w-full md:w-auto border border-white/20">
              <div className="flex items-center gap-2 md:gap-3">
                <div className={cn('w-10 h-10 md:w-12 md:h-12 rounded-3xl md:rounded-3xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg', getRewardGradient(nextReward.tier))}>
                  {getRewardIcon(nextReward.tier)}
                </div>
                <div>
                  <p className="text-[10px] md:text-xs text-white/70">Hadiah Berikutnya</p>
                  <p className="font-bold text-sm md:text-base">{nextReward.name}</p>
                  <p className="text-[10px] md:text-xs text-white/80">
                    {pointsToNextReward.toLocaleString()} poin lagi
                  </p>
                </div>
              </div>
              <div className="mt-3 md:mt-4 h-2 md:h-2.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all"
                  style={{
                    width: `${(totalPoints / nextReward.pointsRequired) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="bg-white rounded-3xl md:rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 md:p-6 border-b border-slate-100">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-3xl md:rounded-3xl bg-amber-100 flex items-center justify-center shadow-sm">
              <Trophy className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-sm md:text-lg">Hadiah</h3>
              <p className="text-[10px] md:text-sm text-slate-500">
                Kumpulkan poin untuk membuka
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6">
          {/* Horizontal scroll on mobile */}
          <div className="relative">
            <div
              className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 pb-2 md:pb-0"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <style>{`.rewards-grid::-webkit-scrollbar { display: none; }`}</style>
              <div className="rewards-grid flex md:grid md:grid-cols-4 gap-3 md:gap-4 min-w-max md:min-w-0">
              {rewards.map((reward, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'relative rounded-3xl md:rounded-3xl p-3 md:p-5 text-center transition-all hover:shadow-lg flex-shrink-0 w-[130px] md:w-auto',
                    reward.isUnlocked
                      ? 'bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200'
                      : 'bg-slate-50 border border-slate-200 hover:border-slate-300'
                  )}
                >
                  {reward.isUnlocked && (
                    <div className="absolute -top-1.5 -right-1.5 md:-top-2 md:-right-2 w-5 h-5 md:w-7 md:h-7 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
                      <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-white" />
                    </div>
                  )}
                  {!reward.isUnlocked && (
                    <div className="absolute -top-1.5 -right-1.5 md:-top-2 md:-right-2 w-5 h-5 md:w-7 md:h-7 bg-slate-300 rounded-full flex items-center justify-center">
                      <Lock className="w-2 h-2 md:w-3 md:h-3 text-slate-500" />
                    </div>
                  )}

                  <div
                    className={cn(
                      'w-12 h-12 md:w-16 md:h-16 mx-auto rounded-3xl md:rounded-3xl bg-gradient-to-br flex items-center justify-center text-white mb-2 md:mb-3 shadow-md',
                      reward.isUnlocked ? getRewardGradient(reward.tier) : 'from-slate-300 to-slate-400'
                    )}
                  >
                    {getRewardIcon(reward.tier)}
                  </div>

                  <p className={cn('font-bold text-xs md:text-sm line-clamp-1', reward.isUnlocked ? 'text-slate-900' : 'text-slate-400')}>
                    {reward.name}
                  </p>
                  <p className="text-[9px] md:text-[10px] text-slate-500 mt-0.5 md:mt-1 line-clamp-2">{reward.description}</p>

                  <div className={cn('mt-2 md:mt-3 text-[10px] md:text-xs font-bold', reward.isUnlocked ? 'text-emerald-600' : 'text-slate-400')}>
                    {reward.isUnlocked ? 'Terbuka' : `${reward.pointsRequired.toLocaleString()} poin`}
                  </div>
                </div>
              ))}
              </div>
            </div>
            {/* Scroll fade indicator */}

          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-3xl md:rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 md:p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-3xl md:rounded-3xl bg-purple-100 flex items-center justify-center shadow-sm">
                <Award className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-sm md:text-lg">Achievement</h3>
                <p className="text-[10px] md:text-sm text-slate-500">
                  {unlockedAchievements.length}/{achievements.length} terbuka
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="font-bold px-2 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs">
              {unlockedAchievements.length} / {achievements.length}
            </Badge>
          </div>
        </div>

        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {achievements.map((achievement, idx) => (
              <div
                key={idx}
                className={cn(
                  'flex items-center gap-3 md:gap-4 p-3 md:p-5 rounded-3xl md:rounded-3xl transition-all hover:shadow-md',
                  achievement.isUnlocked
                    ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200'
                    : 'bg-slate-50 border border-slate-200 hover:border-slate-300'
                )}
              >
                <div
                  className={cn(
                    'w-10 h-10 md:w-14 md:h-14 rounded-3xl md:rounded-3xl flex items-center justify-center shadow-sm flex-shrink-0',
                    achievement.isUnlocked
                      ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white'
                      : 'bg-slate-200 text-slate-400'
                  )}
                >
                  {getAchievementIcon(achievement.id)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={cn('font-bold text-xs md:text-sm truncate', achievement.isUnlocked ? 'text-slate-900' : 'text-slate-400')}>
                    {achievement.name}
                  </p>
                  <p className="text-[10px] md:text-xs text-slate-500 mt-0.5 line-clamp-1">{achievement.description}</p>
                  {!achievement.isUnlocked && (
                    <div className="mt-2 md:mt-2.5">
                      <div className="h-1.5 md:h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                          style={{ width: `${achievement.progress}%` }}
                        />
                      </div>
                      <p className="text-[9px] md:text-[10px] text-slate-400 mt-0.5 md:mt-1">{achievement.progress}%</p>
                    </div>
                  )}
                </div>

                {achievement.isUnlocked && (
                  <div className="flex items-center gap-1 text-emerald-600 flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Streak Bonus */}
      <div
        className="relative overflow-hidden p-4 md:p-6 rounded-3xl md:rounded-3xl shadow-sm"
        style={{
          background: `linear-gradient(135deg, ${mainColor}10 0%, ${secondaryColor}08 100%)`,
          border: `1px solid ${mainColor}15`,
        }}
      >
        {/* Decorative */}
        <div
          className="absolute top-0 right-0 w-24 md:w-40 h-24 md:h-40 opacity-20 blur-3xl rounded-full"
          style={{ backgroundColor: mainColor }}
        />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <div
              className="w-12 h-12 md:w-16 md:h-16 rounded-3xl md:rounded-3xl flex items-center justify-center text-white shadow-lg flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})` }}
            >
              <Flame className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-sm md:text-lg">Streak Bonus Aktif</h3>
              <p className="text-xs md:text-sm text-slate-600">
                Pertahankan streak untuk bonus 2x
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <div className="text-center">
              <p className="text-2xl md:text-4xl font-black" style={{ color: mainColor }}>
                {userStats.currentStreak}
              </p>
              <p className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase">Hari</p>
            </div>
            <Button
              className="font-bold text-white rounded-3xl md:rounded-3xl shadow-md hover:opacity-90 text-xs md:text-sm h-9 md:h-10"
              style={{ backgroundColor: mainColor }}
            >
              Klaim
              <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4 ml-0.5 md:ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
