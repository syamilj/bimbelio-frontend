'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BarChart3,
  Star,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
} from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  LabelList,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

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

interface SummaryScoreChartProps {
  progressData: ProgressItem[] | undefined;
  scoreHistory: ScoreHistoryItem[];
  isLoading: boolean;
  mainColor: string;
  secondaryColor: string;
  isSNBT: boolean;
}

export function SummaryScoreChart({
  progressData,
  scoreHistory,
  isLoading,
  mainColor,
  secondaryColor,
  isSNBT,
}: SummaryScoreChartProps) {
  // For SNBT, adjust scores: score / subtestCount
  const adjustedData = useMemo(() => {
    if (!progressData?.length) return progressData;
    if (!isSNBT) return progressData;
    return progressData.map((p) => ({
      ...p,
      score:
        p.subtestCount > 1 ? Math.round(p.score / p.subtestCount) : p.score,
    }));
  }, [progressData, isSNBT]);

  const stats = useMemo(() => {
    if (!adjustedData?.length) return null;
    const scores = adjustedData.map((p) => p.score);
    const max = Math.max(...scores);
    const min = Math.min(...scores);
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const latest = scores[scores.length - 1];
    const prev = scores.length > 1 ? scores[scores.length - 2] : latest;
    const trend = latest - prev;
    const totalBenar = adjustedData.reduce((a, b) => a + b.benar, 0);
    const totalSoal = adjustedData.reduce((a, b) => a + b.totalQuestions, 0);
    const accuracy =
      totalSoal > 0 ? Math.round((totalBenar / totalSoal) * 100) : 0;
    return { max, min, avg, latest, trend, count: scores.length, accuracy };
  }, [adjustedData]);

  if (isLoading) {
    return <Skeleton className="h-[360px] w-full rounded-3xl" />;
  }

  // Empty state
  if (!adjustedData?.length) {
    return (
      <Card className="border-2 border-slate-100 rounded-3xl shadow-sm">
        <CardContent className="p-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mb-4">
            <BarChart3 className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-base font-bold text-slate-700 mb-1">
            Belum Ada Data Progress
          </h3>
          <p className="text-sm text-slate-400 max-w-xs">
            Selesaikan try out pertamamu untuk melihat grafik perkembangan skor
            kamu di sini
          </p>
        </CardContent>
      </Card>
    );
  }

  // Truncate names for mobile
  const chartData = adjustedData.map((item, i) => ({
    ...item,
    shortName: item.name.length > 12 ? `TO ${i + 1}` : item.name,
  }));

  return (
    <Card className="border-2 border-slate-100 rounded-3xl shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-3xl flex items-center justify-center"
              style={{ backgroundColor: mainColor }}
            >
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black text-gray-900">
                Progress Skor
              </CardTitle>
              <CardDescription className="text-xs">
                Perkembangan skor dari {stats?.count || 0} try out
              </CardDescription>
            </div>
          </div>

          {/* Trend indicator */}
          {stats && stats.trend !== 0 && (
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                stats.trend > 0
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-red-50 text-red-500'
              }`}
            >
              {stats.trend > 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {stats.trend > 0 ? '+' : ''}
              {stats.trend} dari sebelumnya
            </div>
          )}
        </div>

        {/* Score summary badges */}
        {stats && (
          <div
            className="flex gap-2 mt-3 overflow-x-auto pb-1"
            style={{ scrollbarWidth: 'none' }}
          >
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 flex-shrink-0">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              <span className="text-[10px] font-bold text-emerald-700">
                Tertinggi: {stats.max}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 flex-shrink-0">
              <BarChart3 className="w-3 h-3 text-blue-500" />
              <span className="text-[10px] font-bold text-blue-700">
                Rata-rata: {stats.avg}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-100 flex-shrink-0">
              <Target className="w-3 h-3 text-violet-500" />
              <span className="text-[10px] font-bold text-violet-700">
                Akurasi: {stats.accuracy}%
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 flex-shrink-0">
              <Star className="w-3 h-3 text-amber-500" />
              <span className="text-[10px] font-bold text-amber-700">
                Terakhir: {stats.latest}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 flex-shrink-0">
              <TrendingDown className="w-3 h-3 text-red-400" />
              <span className="text-[10px] font-bold text-red-600">
                Terendah: {stats.min}
              </span>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-4 md:p-6 pt-2">
        <ChartContainer
          config={{
            score: { label: 'Skor', color: mainColor },
            benar: { label: 'Benar', color: '#10B981' },
          }}
          className="h-[240px] md:h-[280px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 20, right: 35, left: -10, bottom: 10 }}
            >
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={mainColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={mainColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="shortName"
                tick={{ fontSize: 10, fill: '#6B7280' }}
                tickLine={false}
                axisLine={false}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={50}
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 10, fill: '#10B981' }}
                tickLine={false}
                axisLine={false}
                width={30}
              />
              <ChartTooltip
                trigger="click"
                content={
                  <ChartTooltipContent
                    labelFormatter={(_, payload) => {
                      const p = payload?.[0]?.payload as ProgressItem & {
                        shortName: string;
                      };
                      return p?.name || '';
                    }}
                    formatter={(value, name) => {
                      if (name === 'score') {
                        return (
                          <>
                            <div
                              className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                              style={{ backgroundColor: mainColor }}
                            />
                            <span className="text-muted-foreground">Skor</span>
                            <span className="ml-auto font-mono font-medium tabular-nums">
                              {value}
                            </span>
                          </>
                        );
                      }
                      if (name === 'benar') {
                        const p = (
                          arguments[2] as { payload: ProgressItem }
                        )?.payload;
                        return (
                          <>
                            <div className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-emerald-500" />
                            <span className="text-muted-foreground">B/S/K</span>
                            <span className="ml-auto font-mono font-medium tabular-nums">
                              <span className="text-emerald-600">
                                {p?.benar ?? value}
                              </span>
                              <span className="text-muted-foreground">/</span>
                              <span className="text-red-500">
                                {p?.salah ?? 0}
                              </span>
                              <span className="text-muted-foreground">/</span>
                              <span className="text-gray-400">
                                {p?.kosong ?? 0}
                              </span>
                            </span>
                          </>
                        );
                      }
                      return null;
                    }}
                  />
                }
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="score"
                stroke={mainColor}
                strokeWidth={3}
                fill="url(#colorScore)"
                dot={{
                  fill: mainColor,
                  r: 4,
                  strokeWidth: 2,
                  stroke: '#fff',
                }}
                activeDot={{
                  r: 6,
                  fill: mainColor,
                  stroke: '#fff',
                  strokeWidth: 2,
                }}
              >
                <LabelList
                  position="top"
                  offset={10}
                  className="fill-gray-700 font-bold text-[10px] md:text-xs"
                />
              </Area>
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="benar"
                stroke="#10B981"
                strokeWidth={2}
                strokeDasharray="5 3"
                dot={{
                  fill: '#10B981',
                  r: 3,
                  strokeWidth: 2,
                  stroke: '#fff',
                }}
                activeDot={{
                  r: 5,
                  fill: '#10B981',
                  stroke: '#fff',
                  strokeWidth: 2,
                }}
              >
                <LabelList
                  position="bottom"
                  offset={8}
                  className="fill-emerald-600 font-bold text-[9px] md:text-[10px]"
                  formatter={(v: unknown) => `✓${v}`}
                />
              </Line>
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Score History Cards */}
        {scoreHistory.length > 0 && (
          <div className="space-y-2 mt-4">
            <h3 className="text-sm font-bold text-slate-700">
              Riwayat Skor & Peringkat
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
              {scoreHistory
                .slice(-5)
                .reverse()
                .map((item: ScoreHistoryItem, index: number) => {
                  const rankPercentile =
                    item.totalParticipants > 0
                      ? Math.round(
                          ((item.totalParticipants - item.rank + 1) /
                            item.totalParticipants) *
                            100,
                        )
                      : 0;

                  return (
                    <div
                      key={index}
                      className="flex-shrink-0 w-[320px] p-2.5 rounded-3xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-slate-800 truncate">
                            {item.tryoutTitle}
                          </p>
                          <p className="text-xs text-slate-500">
                            {format(new Date(item.date), 'dd MMM yyyy', {
                              locale: localeId,
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Score and Ranking Row */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 flex-1">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${mainColor}15` }}
                          >
                            <Target
                              className="w-5 h-5"
                              style={{ color: mainColor }}
                            />
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 font-medium">
                              Skor
                            </div>
                            <div
                              className="text-lg font-black"
                              style={{ color: mainColor }}
                            >
                              {Math.round(item.score)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-1">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                              item.rank <= 3 ? 'bg-yellow-100' : 'bg-blue-50'
                            }`}
                          >
                            <Trophy
                              className={`w-5 h-5 ${
                                item.rank <= 3
                                  ? 'text-yellow-600'
                                  : 'text-blue-600'
                              }`}
                            />
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 font-medium">
                              Peringkat
                            </div>
                            <div className="flex items-center gap-1">
                              <span
                                className={`text-lg font-black ${
                                  item.rank <= 3
                                    ? 'text-yellow-600'
                                    : 'text-blue-600'
                                }`}
                              >
                                #{item.rank}
                              </span>
                              <span className="text-xs text-slate-500">
                                / {item.totalParticipants}
                              </span>
                              {item.rankChange !== 0 && (
                                <span
                                  className={`text-xs font-bold ml-1 ${
                                    item.rankChange > 0
                                      ? 'text-emerald-600'
                                      : 'text-red-600'
                                  }`}
                                >
                                  {item.rankChange > 0 ? '↑' : '↓'}
                                  {Math.abs(item.rankChange)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Ranking Progress Bar */}
                      <div className="mt-3 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">
                            Top {rankPercentile}%
                          </span>
                          <span className="text-slate-600 font-bold">
                            {item.totalParticipants - item.rank} peserta
                            dibawah Anda
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${rankPercentile}%`,
                              backgroundColor:
                                item.rankChange > 0
                                  ? '#10b981'
                                  : item.rankChange < 0
                                    ? '#ef4444'
                                    : mainColor,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
