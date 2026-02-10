'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import {
  Award,
  CheckCircle2,
  Flame,
  Lock,
  Star,
  Target,
  Trophy,
} from 'lucide-react';
import { EmptyState, ContentCard } from '@/components/ds';
import { DecorativePatterns } from './DecorativePatterns';

interface AchievementBadgesProps {
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    isUnlocked: boolean;
    unlockedAt: string | null;
    progress: number;
    target: number;
  }>;
}

export default function AchievementBadges({
  achievements,
}: AchievementBadgesProps) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'star':
        return Star;
      case 'flame':
        return Flame;
      case 'trophy':
        return Trophy;
      case 'target':
        return Target;
      default:
        return Award;
    }
  };

  const getColor = (iconName: string) => {
    switch (iconName) {
      case 'star':
        return { bg: 'from-amber-400 to-yellow-500', text: 'text-amber-500' };
      case 'flame':
        return { bg: 'from-orange-400 to-red-500', text: 'text-orange-500' };
      case 'trophy':
        return { bg: 'from-purple-400 to-pink-500', text: 'text-purple-500' };
      case 'target':
        return { bg: 'from-blue-400 to-indigo-500', text: 'text-blue-500' };
      default:
        return {
          bg: 'from-emerald-400 to-green-500',
          text: 'text-emerald-500',
        };
    }
  };

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;

  // Empty State
  if (achievements.length === 0 || unlockedCount === 0) {
    return (
      <ContentCard borderVariant="default" padding="lg" className="relative w-full">
        <DecorativePatterns.DotPattern />
        <div className="relative z-10">
          <EmptyState icon={Trophy} color="amber" title="Belum Ada Pencapaian 🏆" description="Mulai belajar dan selesaikan tryout untuk membuka pencapaian pertamamu!" className="py-8" />
        </div>
      </ContentCard>
    );
  }

  return (
    <ContentCard borderVariant="default" padding="md" className="relative w-full">
      <DecorativePatterns.GridPattern />
      {unlockedCount === achievements.length && <DecorativePatterns.Confetti />}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-black text-slate-800">🏆 Pencapaian</h2>
        <div className="px-3 py-1.5 rounded-full bg-slate-100">
          <span className="text-xs font-bold text-slate-700">
            {unlockedCount}/{achievements.length}
          </span>
        </div>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-hide">
        {achievements.map((achievement) => {
          const Icon = getIcon(achievement.icon);
          const colors = getColor(achievement.icon);
          const progressPercent =
            (achievement.progress / achievement.target) * 100;

          return (
            <div
              key={achievement.id}
              className={`relative overflow-hidden rounded-3xl p-4 border-2 transition-all ${
                achievement.isUnlocked
                  ? 'border-slate-200 bg-gradient-to-br from-slate-50 to-white'
                  : 'border-slate-100 bg-white'
              }`}
            >
              {/* Background Pattern for Unlocked */}
              {achievement.isUnlocked && (
                <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
                  <div
                    className={`w-full h-full rounded-full bg-gradient-to-br ${colors.bg}`}
                  />
                </div>
              )}

              <div className="relative z-10 flex items-start gap-3">
                {/* Icon */}
                <div className={`relative flex-shrink-0`}>
                  <div
                    className={`w-12 h-12 rounded-3xl flex items-center justify-center ${
                      achievement.isUnlocked
                        ? `bg-gradient-to-br ${colors.bg} shadow-lg`
                        : 'bg-slate-100'
                    }`}
                  >
                    {achievement.isUnlocked ? (
                      <Icon className="w-6 h-6 text-white" />
                    ) : (
                      <Lock className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  {/* Check Badge */}
                  {achievement.isUnlocked && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-black text-sm mb-1 ${
                      achievement.isUnlocked
                        ? 'text-slate-800'
                        : 'text-slate-500'
                    }`}
                  >
                    {achievement.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mb-2">
                    {achievement.description}
                  </p>

                  {/* Progress Bar */}
                  {!achievement.isUnlocked && (
                    <div className="space-y-1">
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${colors.bg} transition-all`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-400 font-medium">
                        {achievement.progress}/{achievement.target}
                      </p>
                    </div>
                  )}

                  {/* Unlocked Date */}
                  {achievement.isUnlocked && achievement.unlockedAt && (
                    <p className="text-xs text-slate-400 font-medium">
                      Dibuka{' '}
                      {format(new Date(achievement.unlockedAt), 'dd MMM yyyy', {
                        locale: id,
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      {unlockedCount > 0 && (
        <div className="mt-4 p-3 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
          <p className="text-xs text-center font-bold text-slate-700">
            🎉 Kamu sudah membuka {unlockedCount} pencapaian!
          </p>
        </div>
      )}
    </ContentCard>
  );
}
