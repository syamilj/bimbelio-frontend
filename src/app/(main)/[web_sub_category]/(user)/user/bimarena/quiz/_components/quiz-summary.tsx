'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  Calendar,
  ChevronRight,
  Clock,
  GraduationCap,
  Play,
  Sparkles,
  Swords,
  Target,
  Timer,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useQuizProvider } from '../_provider/_provider';
import { COUNTDOWN_INTERVAL_MS } from './quiz-dummy';

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
    <div className="space-y-4">
      {/* Hero Card with Illustration */}
      <div
        className="relative overflow-hidden rounded-3xl md:rounded-3xl"
        style={{
          background: `linear-gradient(135deg, ${mainColor} 0%, ${secondaryColor} 100%)`,
        }}
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-40 h-40 md:w-64 md:h-64 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 md:w-48 md:h-48 rounded-full bg-white/5 blur-xl" />
          <div className="absolute top-1/2 right-0 w-20 h-20 md:w-32 md:h-32 rounded-full bg-white/5" />
        </div>

        <div className="relative z-10 p-4 md:p-6 lg:p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            {/* Left: Content */}
            <div className="flex-1 space-y-3 md:space-y-4">
              {/* Badge */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                  </span>
                  <span className="text-[10px] md:text-xs font-bold text-white/90">
                    LIVE
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm">
                  <Swords className="w-3 h-3 text-white/80" />
                  <span className="text-[10px] md:text-xs font-bold text-white/90">
                    Battle Mode
                  </span>
                </div>
                {SingleQuizVolume && SingleQuizVolume?.totalUserSubscribed > 0 && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm">
                    <Users className="w-3 h-3 text-white/80" />
                    <span className="text-[10px] md:text-xs font-bold text-white/90">
                      {SingleQuizVolume.totalUserSubscribed.toLocaleString()} Peserta
                    </span>
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-white mb-1">
                  BimArena Quiz
                </h1>
                <p className="text-xs md:text-sm text-white/70 font-medium">
                  Bertarung untuk menjadi yang terbaik! 🔥
                </p>
              </div>

              {/* Quick Stats - Mobile horizontal scroll */}
              <div className="flex gap-3 md:gap-4 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0" style={{ scrollbarWidth: 'none' }}>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-3xl bg-white/20 flex items-center justify-center">
                    <Trophy className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/60 font-medium">Rank</p>
                    <p className="text-sm md:text-base font-black text-white flex items-center gap-1">
                      #{userStats?.rank || '-'}
                      {rankChange > 0 && (
                        <span className="text-[10px] text-emerald-300 flex items-center">
                          <TrendingUp className="w-2.5 h-2.5" />+{rankChange}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="w-px h-8 bg-white/20 flex-shrink-0 self-center" />
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-3xl bg-white/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 md:w-5 md:h-5 text-amber-300" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/60 font-medium">Skor</p>
                    <p className="text-sm md:text-base font-black text-white">
                      {userStats?.totalScore?.toLocaleString() || '-'}
                    </p>
                  </div>
                </div>
                <div className="w-px h-8 bg-white/20 flex-shrink-0 self-center" />
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-3xl bg-white/20 flex items-center justify-center">
                    <Target className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/60 font-medium">Target</p>
                    <p className="text-sm md:text-base font-black text-white line-clamp-1 max-w-[100px] md:max-w-[140px]">
                      {targetUniversity?.name || 'Pilih PTN'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Illustration Placeholder */}
            <div className="hidden md:flex items-center justify-center">
              <div className="relative w-[180px] h-[180px] lg:w-[220px] lg:h-[220px]">
                {/* Placeholder with gradient */}
                <div className="absolute inset-0 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                  {/* Decorative illustration elements */}
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-3xl bg-white/20 flex items-center justify-center">
                      <Swords className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                    </div>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-3xl bg-white/15 flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-amber-300" />
                      </div>
                      <div className="w-8 h-8 rounded-3xl bg-white/15 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div className="w-8 h-8 rounded-3xl bg-white/15 flex items-center justify-center">
                        <GraduationCap className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Glow effect */}
                <div className="absolute -inset-4 bg-white/5 rounded-3xl blur-2xl -z-10" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Volume & Countdown Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {/* Volume Selector Card */}
        <div
          className="rounded-3xl p-4 border bg-white"
          style={{ borderColor: `${mainColor}20` }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-3xl flex items-center justify-center"
                style={{ backgroundColor: `${mainColor}15` }}
              >
                <Calendar className="w-5 h-5" style={{ color: mainColor }} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Volume Aktif
                </p>
                <Select
                  value={selectedVolumeId || undefined}
                  onValueChange={(value) => setSelectedVolumeId(value)}
                >
                  <SelectTrigger
                    className="p-0 h-auto border-none shadow-none font-bold text-base bg-transparent focus:ring-0"
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
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300" />
          </div>
        </div>

        {/* Countdown Card */}
        <div
          className={cn(
            'rounded-3xl p-4 border',
            isVolumeEnded ? 'bg-slate-50' : 'bg-white'
          )}
          style={{ borderColor: isVolumeEnded ? '#e2e8f0' : `${mainColor}20` }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className={cn(
                'w-10 h-10 rounded-3xl flex items-center justify-center',
                isVolumeEnded ? 'bg-slate-100' : ''
              )}
              style={{ backgroundColor: isVolumeEnded ? undefined : `${mainColor}15` }}
            >
              {isVolumeEnded ? (
                <Clock className="w-5 h-5 text-slate-400" />
              ) : isVolumeStarted ? (
                <Play className="w-5 h-5" style={{ color: mainColor }} />
              ) : (
                <Timer className="w-5 h-5" style={{ color: mainColor }} />
              )}
            </div>
            <p className={cn(
              'text-xs font-bold uppercase tracking-wider',
              isVolumeEnded ? 'text-slate-400' : 'text-slate-500'
            )}>
              {isVolumeEnded
                ? 'Kompetisi Berakhir'
                : isVolumeStarted
                  ? 'Berakhir Dalam'
                  : 'Dimulai Dalam'}
            </p>
          </div>
          <div className="flex gap-2">
            {[
              { value: countdown.days, label: 'Hari' },
              { value: countdown.hours, label: 'Jam' },
              { value: countdown.minutes, label: 'Menit' },
              { value: countdown.seconds, label: 'Detik' },
            ].map((item, i) => (
              <div key={item.label} className="flex-1 text-center">
                <div
                  className={cn(
                    'rounded-3xl py-2 px-1',
                    isVolumeEnded ? 'bg-slate-100' : ''
                  )}
                  style={{
                    backgroundColor: isVolumeEnded ? undefined : `${mainColor}10`,
                  }}
                >
                  <span
                    className={cn(
                      'text-lg md:text-xl font-black font-mono',
                      isVolumeEnded ? 'text-slate-400' : ''
                    )}
                    style={{ color: isVolumeEnded ? undefined : mainColor }}
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
  );
}
