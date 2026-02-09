'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Award, Crown, Medal, Star } from 'lucide-react';
import { useQuizProvider } from '../_provider/_provider';
import { formatNumber } from './quiz-dummy';

const getPlayerIcon = (iconType: string) => {
  switch (iconType) {
    case 'Crown':
      return Crown;
    case 'Medal':
      return Medal;
    case 'Award':
      return Award;
    case 'Star':
    default:
      return Star;
  }
};

const getPlayerColor = (iconType: string) => {
  switch (iconType) {
    case 'Crown':
      return 'text-amber-500';
    case 'Medal':
      return 'text-slate-400';
    case 'Award':
      return 'text-orange-500';
    default:
      return 'text-slate-400';
  }
};

export function QuizTopLeaderboard() {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const {
    useUserStatistic: { UserStatistic },
  } = useQuizProvider();

  const topFive = UserStatistic?.topFive;

  if (!topFive?.length) return null;

  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Crown className="w-4 h-4 text-amber-500" /> Top 5 Saat Ini
        </p>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      </div>
      <div className="space-y-2">
        {topFive.map((player) => {
          const type =
            player.rank === 1
              ? 'Crown'
              : player.rank === 2
                ? 'Medal'
                : player.rank === 3
                  ? 'Award'
                  : 'Star';
          const PlayerIcon = getPlayerIcon(type);
          const playerColor = getPlayerColor(type);
          return (
            <div
              key={player.rank}
              className="flex items-center gap-3 p-2 rounded-3xl"
              style={{
                backgroundColor:
                  player.rank <= 3 ? `${mainColor}05` : 'transparent',
              }}
            >
              <div
                className="w-6 h-6 rounded-3xl flex items-center justify-center"
                style={{
                  backgroundColor:
                    player.rank <= 3 ? `${mainColor}15` : `${mainColor}08`,
                }}
              >
                <PlayerIcon className={`w-3.5 h-3.5 ${playerColor}`} />
              </div>
              <span className="text-xs font-bold text-slate-700 flex-1 truncate">
                {player.name}
              </span>
              <span className="text-xs font-mono text-slate-500">
                {formatNumber(player.totalScore)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
