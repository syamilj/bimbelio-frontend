'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Award,
  Clock,
  Crown,
  GraduationCap,
  Medal,
  Star,
  Swords,
  Timer,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useQuizProvider } from '../_provider/_provider';
import { DecorativePatterns } from './DecorativePatterns';
import { COUNTDOWN_INTERVAL_MS, formatNumber } from './quiz-dummy';
import { TargetUniversity, UserStats } from './quiz-types';

interface QuizHeroProps {
  userStats: UserStats;
  targetUniversity?: TargetUniversity;
}
const DEFAULT_COUNTDOWN = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

// Internal countdown hook
function useCountdown(endTime: Date | undefined) {
  if (!endTime) return DEFAULT_COUNTDOWN;
  const [countdown, setCountdown] = useState(DEFAULT_COUNTDOWN);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = endTime.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    }, COUNTDOWN_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [endTime]);

  return countdown;
}
// Get icon component based on type
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

// Get icon color based on rank
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

export function QuizSummary() {
  const { websiteSubCategory } = useWebsiteSubCategory();

  const {
    useVolume: {
      setSelectedVolumeId,
      selectedVolumeId,
      QuizVolumeList,
      SingleQuizVolume,
      isVolumeEnded,
      isVolumeStarted,
    },
    useUserStatistic: { UserStatistic },
  } = useQuizProvider();

  const userStats = UserStatistic?.userStatistic;
  const userTarget = UserStatistic?.userTarget;

  const targetUniversity = {
    name: userTarget?.univChoiceOne || '-',
    major: userTarget?.univStudyChoiceOne || '-',
  };

  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  console.log({ isVolumeStarted, SingleQuizVolume });

  const countdown = isVolumeStarted
    ? useCountdown(
        (SingleQuizVolume?.endDate && new Date(SingleQuizVolume.endDate)) ||
          undefined,
      )
    : useCountdown(
        (SingleQuizVolume?.startDate && new Date(SingleQuizVolume.startDate)) ||
          undefined,
      );

  const rankChange = 0;

  return (
    <div
      className="relative overflow-hidden rounded-3xl"
      style={{
        background: `linear-gradient(135deg, ${mainColor}15 0%, ${secondaryColor}10 100%)`,
      }}
    >
      {/* Decorative Background */}
      <DecorativePatterns.GradientMesh colors={[mainColor, secondaryColor]} />
      <DecorativePatterns.DotPattern id="quiz-hero-dots" />

      {/* Live Competition Banner */}
      <div
        className="relative border-b"
        style={{
          backgroundColor: `${mainColor}15`,
          borderColor: `${mainColor}20`,
        }}
      >
        <div className="flex items-center justify-between px-4 md:px-6 py-2.5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-slate-700">
                LIVE COMPETITION
              </span>
            </div>
            {/* <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500">
              <Users className="w-3 h-3" />
              <span className="font-mono font-bold text-slate-700">
                {liveOnline.toLocaleString()}
              </span>
              <span>peserta aktif</span>
            </div> */}
          </div>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs text-white font-bold"
              style={{ backgroundColor: mainColor }}
            >
              <Swords className="w-3 h-3" />
              <span>Battle Mode</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Left: Title & Competition Stats */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-5">
              <div
                className="w-14 h-14 rounded-3xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: mainColor }}
              >
                <Swords className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-800">
                  BimArena Quiz
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                  Bertarung untuk menjadi yang terbaik! 🔥
                </p>
              </div>
            </div>

            {/* Your Battle Stats - Horizontal scroll on mobile */}
            <div className="relative mt-4">
              <div
                className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <style>{`.hero-stats::-webkit-scrollbar { display: none; }`}</style>
                <div className="hero-stats flex md:grid md:grid-cols-4 gap-2 md:gap-3 min-w-max md:min-w-0">
                  <div
                    className="flex-shrink-0 w-[130px] md:w-auto rounded-3xl md:rounded-3xl p-3 md:p-4 border"
                    style={{
                      backgroundColor: `${mainColor}08`,
                      borderColor: `${mainColor}15`,
                    }}
                  >
                    <div className="flex items-center gap-1.5 md:gap-2 mb-1">
                      <Trophy
                        className="w-3.5 h-3.5 md:w-4 md:h-4"
                        style={{ color: mainColor }}
                      />
                      <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase">
                        Peringkat
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl md:text-2xl font-black text-slate-800">
                        #{userStats?.rank || '-'}
                      </span>
                      {rankChange > 0 && (
                        <span className="text-[10px] md:text-xs text-emerald-600 font-bold flex items-center">
                          <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3" />+
                          {rankChange}
                        </span>
                      )}
                    </div>
                  </div>

                  <div
                    className="flex-shrink-0 w-[130px] md:w-auto rounded-3xl md:rounded-3xl p-3 md:p-4 border"
                    style={{
                      backgroundColor: `${mainColor}08`,
                      borderColor: `${mainColor}15`,
                    }}
                  >
                    <div className="flex items-center gap-1.5 md:gap-2 mb-1">
                      <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-500" />
                      <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase">
                        Total Skor
                      </span>
                    </div>
                    <span className="text-xl md:text-2xl font-black text-slate-800">
                      {userStats?.totalScore || '-'}
                    </span>
                  </div>

                  <div
                    className="flex-shrink-0 w-[130px] md:w-auto rounded-3xl md:rounded-3xl p-3 md:p-4 border"
                    style={{
                      backgroundColor: `${mainColor}08`,
                      borderColor: `${mainColor}15`,
                    }}
                  >
                    <div className="flex items-center gap-1.5 md:gap-2 mb-1">
                      <GraduationCap className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500" />
                      <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase">
                        Target PTN
                      </span>
                    </div>
                    <p
                      className="text-sm md:text-base font-black text-slate-800 line-clamp-1"
                      title={targetUniversity?.name}
                    >
                      {targetUniversity?.name || 'Pilih PTN'}
                    </p>
                    {targetUniversity?.major && (
                      <p className="text-[9px] md:text-[10px] text-slate-500 line-clamp-1">
                        {targetUniversity.major}
                      </p>
                    )}
                  </div>

                  {/* <div
                    className="flex-shrink-0 w-[130px] md:w-auto rounded-3xl md:rounded-3xl p-3 md:p-4 border"
                    style={{
                      backgroundColor: `${mainColor}08`,
                      borderColor: `${mainColor}15`,
                    }}
                  >
                    <div className="flex items-center gap-1.5 md:gap-2 mb-1">
                      <Flame className="w-3.5 h-3.5 md:w-4 md:h-4 text-orange-500" />
                      <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase">
                        Streak
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl md:text-2xl font-black text-slate-800">
                        -
                      </span>
                      <span className="text-xs md:text-sm font-bold text-slate-600">
                        hari 🔥
                      </span>
                    </div>
                  </div> */}
                </div>
              </div>
              {/* Scroll fade indicator */}
              <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white/80 to-transparent pointer-events-none md:hidden" />
            </div>

            {/* Competition Pills - Horizontal scroll on mobile */}
            <div className="relative mt-4 md:mt-5">
              <div
                className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <style>{`.hero-pills::-webkit-scrollbar { display: none; }`}</style>
                <div className="hero-pills flex gap-2 min-w-max">
                  {SingleQuizVolume?.totalUserSubscribed && (
                    <div
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border flex-shrink-0"
                      style={{
                        backgroundColor: `${mainColor}10`,
                        borderColor: `${mainColor}20`,
                        color: mainColor,
                      }}
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>
                        {SingleQuizVolume?.totalUserSubscribed.toLocaleString()}{' '}
                        Peserta Terdaftar
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {/* Scroll fade indicator */}
              <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white/80 to-transparent pointer-events-none md:hidden" />
            </div>

            {/* Mini Live Leaderboard */}
            <div className="mt-5 bg-white rounded-3xl p-4 border border-slate-200 shadow-sm">
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
                {UserStatistic?.topFive?.map((player) => {
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
                            player.rank <= 3
                              ? `${mainColor}15`
                              : `${mainColor}08`,
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
          </div>

          {/* Right: Volume Selector & Countdown */}
          <div className="flex flex-col gap-4 lg:items-end">
            {/* Volume Selector */}
            <div
              className="flex items-center gap-3 p-1.5 rounded-3xl border"
              style={{
                backgroundColor: `${mainColor}08`,
                borderColor: `${mainColor}15`,
              }}
            >
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-3">
                Volume:
              </span>
              <Select
                value={selectedVolumeId || undefined}
                onValueChange={(value) => setSelectedVolumeId(value)}
              >
                <SelectTrigger
                  className="w-[160px] border-none shadow-none font-bold bg-transparent focus:ring-0"
                  style={{ color: mainColor }}
                >
                  <SelectValue placeholder="Pilih Volume" />
                </SelectTrigger>
                <SelectContent>
                  {QuizVolumeList?.map((vol) => (
                    <SelectItem
                      key={vol.id}
                      value={vol.id}
                      disabled={vol.status === 'DRAFT'}
                    >
                      <div className="flex items-center justify-between w-full gap-2">
                        <span>{vol.title}</span>
                        {vol.status === 'DRAFT' && (
                          <Clock className="w-3 h-3 text-amber-500" />
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Countdown */}
            <div
              className="rounded-3xl p-4 border bg-white shadow-sm"
              style={{ borderColor: `${mainColor}15` }}
            >
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-3 flex items-center gap-1.5">
                <Timer className="w-3 h-3" />{' '}
                {isVolumeEnded
                  ? 'Kompetisi Sudah Berakhir'
                  : isVolumeStarted
                    ? 'Kompetisi Berakhir Dalam'
                    : 'Kompetisi Dimulai Dalam'}
              </p>
              <div className="flex gap-2">
                {[
                  { value: countdown.days, label: 'Hari' },
                  { value: countdown.hours, label: 'Jam' },
                  { value: countdown.minutes, label: 'Menit' },
                  { value: countdown.seconds, label: 'Detik' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="text-center"
                  >
                    <div
                      className="rounded-3xl px-3 py-2 min-w-[48px] border"
                      style={{
                        backgroundColor: `${mainColor}10`,
                        borderColor: `${mainColor}20`,
                      }}
                    >
                      <span
                        className="text-xl font-black font-mono"
                        style={{ color: mainColor }}
                      >
                        {String(item.value).padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase mt-1 block">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
