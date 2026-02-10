'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { BimArena } from '@/components/ui/bim-brand';
import { Skeleton } from '@/components/ui/skeleton';
import { useGet } from '@/lib/fetch-helper/useGet';
import { useMemo } from 'react';
import { SummaryQuickStats } from './SummaryQuickStats';
import { SummaryLeaderboard } from './SummaryLeaderboard';
import { SummaryScoreChart } from './SummaryScoreChart';

// --- Types ---
interface SummaryData {
  TryoutResult: number;
  TryoutUserAnswer: number;
  LastRanking: number;
  AverageScore: number;
  TotalTryout: number;
  AverageSubtestCount: number;
}

interface ProgressItem {
  name: string;
  score: number;
  subtestCount: number;
  benar: number;
  salah: number;
  kosong: number;
  totalQuestions: number;
}

interface ScoreHistoryItem {
  date: string;
  score: number;
  tryoutTitle: string;
  rank: number;
  totalParticipants: number;
  rankChange: number;
}

// --- Main Component ---
const SummaryTryout = () => {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();

  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';
  const isSNBT =
    websiteSubCategory?.name?.toUpperCase().includes('SNBT') || false;

  const userId = session?.user.id;

  const { data: summary, isLoading } = useGet<SummaryData>(
    `/tryout/getSummaryTryout?userId=${userId}`,
    {
      enabled: !!userId,
      useEffectDependencies: [userId],
    },
  );

  const { data: tryoutProgress } = useGet<ProgressItem[]>(
    `/tryout/getTryoutUserProgress?userId=${userId}`,
    {
      enabled: !!userId,
      useEffectDependencies: [userId],
    },
  );

  const { data: reportData } = useGet<any>(
    `/report/getReportData?userId=${userId}`,
    {
      enabled: !!userId,
      useEffectDependencies: [userId, websiteSubCategory?.id],
    },
  );

  const scoreHistory = useMemo<ScoreHistoryItem[]>(() => {
    if (!reportData?.tryoutHistory?.history) return [];
    const history = reportData.tryoutHistory.history;
    const filtered = history.filter(
      (item: any) => item.show && item.totalScore > 0,
    );
    return filtered.map(
      (item: any, index: number, arr: any[]): ScoreHistoryItem => {
        let score = item.totalScore || 0;
        if (isSNBT && item.TryoutSessionResult?.length > 0) {
          const subtestScores = item.TryoutSessionResult.map(
            (s: any) => s.totalScore || 0,
          );
          score = Math.round(
            subtestScores.reduce((a: number, b: number) => a + b, 0) /
              subtestScores.length,
          );
        }
        const prevRank = index > 0 ? arr[index - 1].rank : item.rank;
        return {
          date: item.startTryout || item.createdAt,
          score,
          tryoutTitle: item.Tryout?.title || 'Try Out',
          rank: item.rank || 0,
          totalParticipants: item.totalParticipants || 0,
          rankChange: index > 0 ? prevRank - item.rank : 0,
        };
      },
    );
  }, [reportData, isSNBT]);

  // Compute adjusted stats from progress data for consistent values
  const adjustedProgressStats = useMemo(() => {
    if (!tryoutProgress?.length) return null;
    const scores = tryoutProgress.map((p) =>
      isSNBT && p.subtestCount > 1
        ? Math.round(p.score / p.subtestCount)
        : p.score,
    );
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const latest = scores[scores.length - 1];
    return { avg, latest };
  }, [tryoutProgress, isSNBT]);

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Hero Card — Clean White */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-sm">
        {/* Top accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
          }}
        />

        <div className="relative z-10 p-5 md:p-6 pt-4">
          {/* Top row: Badge + websub name */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
                style={{
                  backgroundColor: `${mainColor}10`,
                  borderColor: `${mainColor}30`,
                }}
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ backgroundColor: mainColor }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-2 w-2"
                    style={{ backgroundColor: mainColor }}
                  />
                </span>
                <span
                  className="text-[10px] md:text-xs font-bold"
                  style={{ color: mainColor }}
                >
                  BimArena
                </span>
              </div>
              {websiteSubCategory?.name && (
                <div
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full border"
                  style={{
                    backgroundColor: `${mainColor}08`,
                    borderColor: `${mainColor}20`,
                  }}
                >
                  <span className="text-[10px] md:text-xs font-bold text-slate-600">
                    {websiteSubCategory.name}
                  </span>
                </div>
              )}
            </div>
            {isSNBT && (
              <div
                className="px-2 py-0.5 rounded-full border"
                style={{
                  backgroundColor: `${mainColor}10`,
                  borderColor: `${mainColor}25`,
                }}
              >
                <span
                  className="text-[9px] font-black tracking-wider"
                  style={{ color: mainColor }}
                >
                  SNBT MODE
                </span>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-xl md:text-2xl font-black text-slate-800 leading-tight mb-1">
            <BimArena style={{ fontWeight: 'extra-bold' }} /> - Try Out
          </h1>
          <p className="text-xs md:text-sm text-slate-400 font-medium mb-4">
            Simulasi ujian realistis untuk persiapan maksimal
          </p>

          {/* Stats Row */}
          {!isLoading && summary ? (
            <div className="grid grid-cols-3 gap-2">
              <div
                className="rounded-3xl border p-3 text-center"
                style={{
                  backgroundColor: `${mainColor}08`,
                  borderColor: `${mainColor}15`,
                }}
              >
                <p className="text-xl md:text-2xl font-black text-slate-800 leading-none">
                  {summary.TryoutResult || 0}
                </p>
                <p className="text-[9px] md:text-[10px] font-bold uppercase mt-1 tracking-wide text-slate-400">
                  TO Selesai
                </p>
              </div>
              <div
                className="rounded-3xl border p-3 text-center"
                style={{
                  backgroundColor: `${mainColor}08`,
                  borderColor: `${mainColor}15`,
                }}
              >
                <p className="text-xl md:text-2xl font-black text-slate-800 leading-none">
                  {summary.LastRanking ? `#${summary.LastRanking}` : '-'}
                </p>
                <p className="text-[9px] md:text-[10px] font-bold uppercase mt-1 tracking-wide text-slate-400">
                  Peringkat
                </p>
              </div>
              <div
                className="rounded-3xl border p-3 text-center"
                style={{
                  backgroundColor: `${mainColor}08`,
                  borderColor: `${mainColor}15`,
                }}
              >
                <p className="text-xl md:text-2xl font-black text-slate-800 leading-none">
                  {adjustedProgressStats?.avg ??
                    (() => {
                      const raw =
                        summary.TotalTryout > 0
                          ? Math.round(
                              summary.AverageScore / summary.TotalTryout,
                            )
                          : 0;
                      const sc = summary.AverageSubtestCount || 1;
                      return isSNBT && sc > 1 ? Math.round(raw / sc) : raw;
                    })()}
                </p>
                <p className="text-[9px] md:text-[10px] font-bold uppercase mt-1 tracking-wide text-slate-400">
                  {isSNBT ? 'Avg/Subtes' : 'Rata-rata'}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-[68px] rounded-3xl bg-slate-100"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats Cards */}
      <SummaryQuickStats
        summary={summary ?? undefined}
        isLoading={isLoading}
        isSNBT={isSNBT}
      />

      {/* Progress Chart + Mini Leaderboard */}
      <div
        className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible md:pb-0"
        style={{ scrollbarWidth: 'none' }}
      >
        <div className="min-w-[85vw] md:min-w-0 md:col-span-2 flex-shrink-0">
          <SummaryScoreChart
            progressData={tryoutProgress ?? undefined}
            scoreHistory={scoreHistory}
            isLoading={isLoading}
            mainColor={mainColor}
            secondaryColor={secondaryColor}
            isSNBT={isSNBT}
          />
        </div>
        <div className="min-w-[85vw] md:min-w-0 md:col-span-1 flex-shrink-0">
          <SummaryLeaderboard mainColor={mainColor} isSNBT={isSNBT} />
        </div>
      </div>
    </div>
  );
};

export default SummaryTryout;
