'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useGet } from '@/lib/fetch-helper/useGet';
import { Award, Crown, Medal, Star } from 'lucide-react';

interface LeaderboardItem {
  totalScore: number;
  subtestCount: number;
  User: {
    name: string;
    image: string | null;
  };
}

interface SummaryLeaderboardProps {
  mainColor: string;
  isSNBT: boolean;
}

export function SummaryLeaderboard({
  mainColor,
  isSNBT,
}: SummaryLeaderboardProps) {
  const { data: session } = useSession();
  const userId = session?.user.id;

  const { data: tryoutList, isLoading } = useGet<
    { id: string; title: string }[]
  >(`/leaderboard/getTryoutList?userId=${userId}`, {
    enabled: !!userId,
    useEffectDependencies: [userId],
  });

  const latestTryoutId = tryoutList?.[0]?.id;

  const { data: leaderboard } = useGet<LeaderboardItem[]>(
    `/leaderboard/getTopFiveTryout?tryoutId=${latestTryoutId}`,
    {
      enabled: !!latestTryoutId,
      useEffectDependencies: [latestTryoutId],
    },
  );

  const rankIcons = [Crown, Medal, Award, Star, Star];
  const rankColors = [
    'text-amber-500',
    'text-slate-400',
    'text-orange-500',
    'text-slate-400',
    'text-slate-400',
  ];

  if (isLoading || !leaderboard?.length) return null;

  return (
    <Card className="border-2 border-slate-100 rounded-3xl shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-500" />
            <CardTitle className="text-sm font-bold text-slate-700">
              Top 5 — {tryoutList?.[0]?.title || 'Try Out Terbaru'}
            </CardTitle>
          </div>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-1.5">
        {leaderboard.slice(0, 5).map((player, index) => {
          const Icon = rankIcons[index] || Star;
          const color = rankColors[index] || 'text-slate-400';
          return (
            <div
              key={index}
              className="flex items-center gap-3 p-2.5 rounded-3xl transition-colors"
              style={{
                backgroundColor: index < 3 ? `${mainColor}08` : 'transparent',
              }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor:
                    index < 3 ? `${mainColor}15` : `${mainColor}08`,
                }}
              >
                <Icon className={`w-3.5 h-3.5 ${color}`} />
              </div>
              <span className="text-xs font-bold text-slate-700 flex-1 truncate">
                {player.User?.name || 'Anonim'}
              </span>
              <span className="text-xs font-mono font-bold text-slate-500">
                {(() => {
                  const score = player.totalScore || 0;
                  const sc = player.subtestCount || 1;
                  const displayScore =
                    isSNBT && sc > 1 ? Math.round(score / sc) : score;
                  return displayScore.toLocaleString('id-ID');
                })()}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
