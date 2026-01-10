'use client';

import { useLeaderboardContext } from '@/app/(main)/[web_sub_category]/(user)/user/bimarena/leaderboard/_components/provider-leaderboard';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { cn } from '@/lib/utils';
import { Award, Crown, Medal, Star, Trophy } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export type TopWinnersProp = '1' | '2' | '3' | '4';

type TryoutTop3Type = {
  rank: number;
  totalScore: number;
  averageScore: number;
  name: string;
  school: string | undefined;
  image: string | null;
};

export function TopWinners() {
  const { selectedTryOut: tryoutId, RankingTryout } = useLeaderboardContext();
  const { websiteSubCategory } = useWebsiteSubCategory();

  const isIrt = RankingTryout?.isIRT || false;

  // Get dynamic colors from the selected category
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const [TryoutTop3, setTryoutTop3] = useState<TryoutTop3Type[]>([]);
  const [TryoutTop3IsLoading, setTryoutTop3IsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!tryoutId) return;
    getGeneral(`/leaderboard/getTryoutRankingTop3?tryoutId=${tryoutId}`, {
      setData: setTryoutTop3,
      setLoading: setTryoutTop3IsLoading,
    });
  }, [tryoutId]);

  const getRankConfig = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          bgGradient: 'from-yellow-400 via-yellow-500 to-amber-500',
          ringGradient: 'from-yellow-300 to-yellow-500',
          icon: Crown,
          iconBg: 'bg-linear-to-br from-yellow-400 to-yellow-600',
          textColor: 'text-yellow-700',
          shadowColor: 'shadow-yellow-500/30',
          position: 'top-0',
          size: 'w-24 h-24 md:w-28 md:h-28',
          rankSize: 'w-12 h-12',
          glowEffect: true,
        };
      case 2:
        return {
          bgGradient: 'from-slate-300 via-slate-400 to-slate-500',
          ringGradient: 'from-slate-300 to-slate-500',
          icon: Medal,
          iconBg: 'bg-linear-to-br from-slate-300 to-slate-500',
          textColor: 'text-slate-700',
          shadowColor: 'shadow-slate-500/30',
          position: 'top-8',
          size: 'w-20 h-20 md:w-24 md:h-24',
          rankSize: 'w-10 h-10',
          glowEffect: false,
        };
      case 3:
        return {
          bgGradient: 'from-orange-400 via-orange-500 to-orange-600',
          ringGradient: 'from-orange-300 to-orange-500',
          icon: Award,
          iconBg: 'bg-linear-to-br from-orange-400 to-orange-600',
          textColor: 'text-orange-700',
          shadowColor: 'shadow-orange-500/30',
          position: 'top-8',
          size: 'w-20 h-20 md:w-24 md:h-24',
          rankSize: 'w-10 h-10',
          glowEffect: false,
        };
      default:
        return {
          bgGradient: 'from-gray-400 to-gray-500',
          ringGradient: 'from-gray-300 to-gray-500',
          icon: Trophy,
          iconBg: 'bg-gray-400',
          textColor: 'text-gray-700',
          shadowColor: 'shadow-gray-500/30',
          position: 'top-8',
          size: 'w-20 h-20',
          rankSize: 'w-10 h-10',
          glowEffect: false,
        };
    }
  };

  return (
    <Card className="h-full bg-white shadow-sm border-2 border-gray-100 rounded-3xl overflow-hidden">
      <CardHeader className="pb-6 text-center border-b-2 border-gray-100">
        <div>
          <CardTitle className="text-xl font-black text-gray-900 flex items-center justify-center gap-2 mb-2">
            <Trophy
              className="w-6 h-6"
              style={{ color: mainColor }}
            />
            Hall of Fame
          </CardTitle>
          <p className="text-sm text-gray-500 font-medium">
            Peraih skor terbaik dalam try out ini
          </p>
        </div>
      </CardHeader>

      <CardContent className="p-8">
        {!TryoutTop3IsLoading ? (
          TryoutTop3 && TryoutTop3.length > 0 ? (
            <div className="relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-4 left-4 w-1 h-1 bg-yellow-400 rounded-full animate-pulse" />
                <div className="absolute top-8 right-8 w-1 h-1 bg-blue-400 rounded-full animate-pulse animation-delay-200" />
                <div className="absolute bottom-8 left-8 w-1 h-1 bg-green-400 rounded-full animate-pulse animation-delay-500" />
              </div>

              {/* Winners Layout - Responsive */}
              <div className="flex items-end justify-center gap-4 md:gap-8 lg:gap-12 relative min-h-[250px] md:min-h-[300px]">
                {TryoutTop3.map((winner) => {
                  const config = getRankConfig(winner.rank);
                  const IconComponent = config.icon;

                  return (
                    <div
                      key={winner.rank}
                      className={cn(
                        'flex flex-col items-center relative transition-all duration-500 group',
                        config.position,
                        winner.rank === 1
                          ? 'order-2 z-30'
                          : winner.rank === 2
                            ? 'order-1 z-20'
                            : 'order-3 z-10',
                      )}
                    >
                      {/* Winner Crown for 1st place */}
                      {winner.rank === 1 && (
                        <div className="absolute -top-6 md:-top-8 left-1/2 transform -translate-x-1/2 z-40">
                          <div className="relative">
                            <Crown className="w-6 h-6 md:w-8 md:h-8 text-yellow-500 animate-bounce" />
                            <div className="absolute inset-0 bg-yellow-400 blur-sm opacity-30 animate-pulse" />
                          </div>
                        </div>
                      )}

                      {/* Rank Badge */}
                      <div
                        className={cn(
                          'absolute -top-2 md:-top-3 -right-1 md:-right-2 z-40 rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm shadow-lg border-2 border-white',
                          'w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12',
                          `bg-linear-to-br ${config.bgGradient}`,
                          config.shadowColor,
                        )}
                      >
                        {winner.rank}
                      </div>

                      {/* Avatar Container */}
                      <div className="relative mb-3 md:mb-4">
                        {/* Glow Effect for Winner */}
                        {config.glowEffect && (
                          <div
                            className="absolute inset-0 rounded-full opacity-40 animate-pulse"
                            style={{
                              boxShadow: `0 0 30px ${mainColor}, 0 0 60px ${mainColor}40`,
                            }}
                          />
                        )}

                        {/* Outer Ring */}
                        <div
                          className={cn(
                            'relative rounded-full p-1 shadow-xl',
                            `bg-linear-to-br ${config.ringGradient}`,
                            config.shadowColor,
                            'group-hover:scale-105 transition-transform duration-300',
                          )}
                        >
                          {/* Inner Ring */}
                          <div className="bg-white rounded-full p-1">
                            {/* Avatar */}
                            <div
                              className={cn(
                                'rounded-full overflow-hidden shadow-lg',
                                winner.rank === 1
                                  ? 'w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24'
                                  : 'w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20',
                              )}
                            >
                              <Image
                                src={winner.image || '/placeholder-avatar.png'}
                                alt={`Foto ${winner.name}`}
                                width={96}
                                height={96}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Achievement Icon */}
                        <div
                          className={cn(
                            'absolute -bottom-1 md:-bottom-2 -right-1 md:-right-2 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white',
                            'w-6 h-6 md:w-8 md:h-8',
                            config.iconBg,
                            'group-hover:scale-110 transition-transform duration-300',
                          )}
                        >
                          <IconComponent className="w-3 h-3 md:w-4 md:h-4" />
                        </div>
                      </div>

                      {/* Winner Info */}
                      <div className="text-center space-y-2 md:space-y-3 max-w-[100px] md:max-w-[140px]">
                        {/* Name */}
                        <h3
                          className={cn(
                            'font-bold leading-tight text-gray-900',
                            winner.rank === 1
                              ? 'text-sm md:text-lg'
                              : 'text-xs md:text-base',
                          )}
                        >
                          {winner.name.length > 12
                            ? winner.name.substring(0, 12) + '...'
                            : winner.name}
                        </h3>

                        {/* School */}
                        <p className="text-xs text-gray-500 truncate">
                          {winner.school || 'Sekolah tidak diketahui'}
                        </p>

                        {/* Score Badge */}
                        <div
                          className={cn(
                            'inline-flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-2 rounded-xl font-bold text-white shadow-lg relative overflow-hidden',
                            'group-hover:shadow-xl transition-all duration-300',
                          )}
                          style={{
                            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                          }}
                        >
                          <Star className="w-3 h-3 md:w-4 md:h-4" />
                          <span className="text-xs md:text-sm">
                            {isIrt
                              ? winner.averageScore.toFixed(0)
                              : winner.totalScore.toFixed(0)}
                          </span>

                          {/* Animated background for winner */}
                          {winner.rank === 1 && (
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
                          )}
                        </div>

                        {/* Special Winner Badge */}
                        {winner.rank === 1 && (
                          <div className="mt-1 md:mt-2">
                            <div className="inline-flex items-center gap-1 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs font-bold text-white bg-linear-to-r from-yellow-400 to-amber-500 shadow-md">
                              <Crown className="w-2 h-2 md:w-3 md:h-3" />
                              <span className="text-xs">JUARA</span>
                            </div>
                          </div>
                        )}

                        {winner.rank === 2 && (
                          <div className="mt-1 md:mt-2">
                            <div className="inline-flex items-center gap-1 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs font-bold text-white bg-linear-to-r from-slate-400 to-slate-500 shadow-md">
                              <Medal className="w-2 h-2 md:w-3 md:h-3" />
                              <span className="text-xs">KEDUA</span>
                            </div>
                          </div>
                        )}

                        {winner.rank === 3 && (
                          <div className="mt-1 md:mt-2">
                            <div className="inline-flex items-center gap-1 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs font-bold text-white bg-linear-to-r from-orange-400 to-orange-500 shadow-md">
                              <Award className="w-2 h-2 md:w-3 md:h-3" />
                              <span className="text-xs">KETIGA</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Floating particles for winner */}
                      {winner.rank === 1 && (
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 pointer-events-none">
                          <div className="w-1 h-1 bg-yellow-400 rounded-full animate-float absolute -top-4 -left-6" />
                          <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full animate-float absolute -top-2 right-6 animation-delay-200" />
                          <div className="w-1 h-1 bg-amber-400 rounded-full animate-float absolute top-2 -right-4 animation-delay-500" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom Statistics - Mobile Responsive */}
              <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-100">
                <div className="grid grid-cols-3 gap-2 md:gap-4 text-center">
                  <div className="space-y-1">
                    <div
                      className="text-lg md:text-2xl font-bold"
                      style={{ color: mainColor }}
                    >
                      {TryoutTop3.length}
                    </div>
                    <div className="text-xs text-gray-500">Peraih Terbaik</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-lg md:text-2xl font-bold text-yellow-600">
                      {isIrt
                        ? TryoutTop3[0]?.averageScore.toFixed(0) || 0
                        : TryoutTop3[0]?.totalScore.toFixed(0) || 0}
                    </div>
                    <div className="text-xs text-gray-500">Skor Tertinggi</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-lg md:text-2xl font-bold text-green-600">
                      {TryoutTop3.length > 0
                        ? Math.round(
                            TryoutTop3.reduce(
                              (acc, w) =>
                                acc + (isIrt ? w.averageScore : w.totalScore),
                              0,
                            ) / TryoutTop3.length,
                          )
                        : 0}
                    </div>
                    <div className="text-xs text-gray-500">Rata-rata</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 md:py-12 text-gray-500">
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Trophy className="w-6 h-6 md:w-8 md:h-8 opacity-50" />
              </div>
              <h3 className="font-semibold mb-2 text-sm md:text-base">
                Belum Ada Pemenang
              </h3>
              <p className="text-xs md:text-sm">
                Pilih try out untuk melihat hall of fame
              </p>
            </div>
          )
        ) : (
          <div className="flex items-end justify-center gap-4 md:gap-8 lg:gap-12 min-h-[250px] md:min-h-[300px]">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-center space-y-3 md:space-y-4"
              >
                <Skeleton className="w-12 h-12 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full" />
                <Skeleton className="h-3 md:h-4 w-16 md:w-24" />
                <Skeleton className="h-2 md:h-3 w-12 md:w-20" />
                <Skeleton className="h-6 md:h-8 w-12 md:w-16 rounded-xl" />
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        .animation-delay-500 {
          animation-delay: 500ms;
        }
      `}</style>
    </Card>
  );
}

export default TopWinners;
