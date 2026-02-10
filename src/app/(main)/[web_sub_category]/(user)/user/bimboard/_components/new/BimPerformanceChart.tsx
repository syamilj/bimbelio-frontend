'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { BimArena } from '@/components/ui/bim-brand';
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
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import {
  BarChart3,
  Search,
  Star,
  Target,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
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
import { EmptyState } from '@/components/ds';
import { PerformanceScoreHistory } from './PerformanceScoreHistory';

// Progress data from /tryout/getTryoutUserProgress
interface ProgressItem {
  name: string;
  score: number;
  subtestCount: number;
  benar: number;
  salah: number;
  kosong: number;
  totalQuestions: number;
}

interface BimPerformanceChartProps {
  scoreHistory: Array<{
    date: string;
    score: number;
    tryoutTitle: string;
    rank: number;
    totalParticipants: number;
    rankChange: number;
  }>;
  studyTimeHistory: Array<{
    date: string;
    hours: number;
  }>;
}

export default function BimPerformanceChart({
  scoreHistory,
  studyTimeHistory,
}: BimPerformanceChartProps) {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const isSNBT = websiteSubCategory?.name?.toUpperCase().includes('SNBT');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch progress data (with benar/salah/kosong)
  const [progressData, setProgressData] = useState<ProgressItem[]>();
  const [progressLoading, setProgressLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;
    getGeneral(`/tryout/getTryoutUserProgress?userId=${session.user.id}`, {
      setData: setProgressData,
      setLoading: setProgressLoading,
    });
  }, [session?.user?.id]);

  // For SNBT, adjust scores: score / subtestCount
  const adjustedData = useMemo(() => {
    if (!progressData?.length) return progressData;
    if (!isSNBT) return progressData;
    return progressData.map((p) => ({
      ...p,
      score: p.subtestCount > 1 ? Math.round(p.score / p.subtestCount) : p.score,
    }));
  }, [progressData, isSNBT]);

  // Filter by search query
  const filteredData = useMemo(() => {
    if (!adjustedData?.length) return adjustedData;
    if (!searchQuery.trim()) return adjustedData;
    return adjustedData.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [adjustedData, searchQuery]);

  // Stats from progress data
  const stats = useMemo(() => {
    if (!filteredData?.length) return null;
    const scores = filteredData.map((p) => p.score);
    const max = Math.max(...scores);
    const min = Math.min(...scores);
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const latest = scores[scores.length - 1];
    const prev = scores.length > 1 ? scores[scores.length - 2] : latest;
    const trend = latest - prev;
    const totalBenar = filteredData.reduce((a, b) => a + b.benar, 0);
    const totalSoal = filteredData.reduce((a, b) => a + b.totalQuestions, 0);
    const accuracy = totalSoal > 0 ? Math.round((totalBenar / totalSoal) * 100) : 0;
    return { max, min, avg, latest, trend, count: scores.length, accuracy };
  }, [filteredData]);

  // Filter riwayat by search too
  const filteredScores = scoreHistory.filter((item) =>
    item.tryoutTitle?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Truncate names for chart
  const chartData = useMemo(() => {
    if (!filteredData?.length) return [];
    return filteredData.map((item, i) => ({
      ...item,
      shortName: item.name.length > 12 ? `TO ${i + 1}` : item.name,
    }));
  }, [filteredData]);

  return (
    <Card className="w-full border-2">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-3xl flex items-center justify-center"
              style={{ backgroundColor: mainColor }}
            >
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-black text-slate-800">
                Performa <BimArena />
              </CardTitle>
              <CardDescription>
                Grafik perkembangan skor tryout kamu
              </CardDescription>
            </div>
          </div>
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

        {/* Search Bar */}
        {(scoreHistory.length > 0 || (progressData?.length ?? 0) > 0) && (
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Cari BimArena..."
              className="pl-10 h-10 rounded-full border-slate-200 bg-slate-50 focus:bg-white transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        {/* Score summary badges */}
        {stats && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 flex-shrink-0">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              <span className="text-[10px] font-bold text-emerald-700">Tertinggi: {stats.max}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 flex-shrink-0">
              <BarChart3 className="w-3 h-3 text-blue-500" />
              <span className="text-[10px] font-bold text-blue-700">Rata-rata: {stats.avg}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-100 flex-shrink-0">
              <Target className="w-3 h-3 text-violet-500" />
              <span className="text-[10px] font-bold text-violet-700">Akurasi: {stats.accuracy}%</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 flex-shrink-0">
              <Star className="w-3 h-3 text-amber-500" />
              <span className="text-[10px] font-bold text-amber-700">Terakhir: {stats.latest}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 flex-shrink-0">
              <TrendingDown className="w-3 h-3 text-red-400" />
              <span className="text-[10px] font-bold text-red-600">Terendah: {stats.min}</span>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {progressLoading ? (
          <Skeleton className="h-[300px] w-full rounded-3xl" />
        ) : filteredData && filteredData.length > 0 ? (
          <div className="space-y-4">
            {/* Chart: Dual Y-axis — Score area + Benar line */}
            <ChartContainer
              config={{
                score: {
                  label: 'Skor',
                  color: mainColor,
                },
                benar: {
                  label: 'Benar',
                  color: '#10B981',
                },
              }}
              className="h-[240px] md:h-[280px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 20, right: 35, left: -10, bottom: 10 }}
                >
                  <defs>
                    <linearGradient id="bimboardScoreGradient" x1="0" y1="0" x2="0" y2="1">
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
                          const p = payload?.[0]?.payload as ProgressItem & { shortName: string };
                          return p?.name || '';
                        }}
                        formatter={(value, name) => {
                          if (name === 'score') {
                            return (
                              <>
                                <div className="h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: mainColor }} />
                                <span className="text-muted-foreground">Skor</span>
                                <span className="ml-auto font-mono font-medium tabular-nums">{value}</span>
                              </>
                            );
                          }
                          if (name === 'benar') {
                            const p = (arguments[2] as { payload: ProgressItem })?.payload;
                            return (
                              <>
                                <div className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-emerald-500" />
                                <span className="text-muted-foreground">B/S/K</span>
                                <span className="ml-auto font-mono font-medium tabular-nums">
                                  <span className="text-emerald-600">{p?.benar ?? value}</span>
                                  <span className="text-muted-foreground">/</span>
                                  <span className="text-red-500">{p?.salah ?? 0}</span>
                                  <span className="text-muted-foreground">/</span>
                                  <span className="text-gray-400">{p?.kosong ?? 0}</span>
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
                    fill="url(#bimboardScoreGradient)"
                    dot={{ fill: mainColor, r: 4, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, fill: mainColor, stroke: '#fff', strokeWidth: 2 }}
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
                    dot={{ fill: '#10B981', r: 3, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 5, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }}
                  >
                    <LabelList
                      position="bottom"
                      offset={8}
                      className="fill-emerald-600 font-bold text-[9px] md:text-[10px]"
                      formatter={(v: any) => `✓${v}`}
                    />
                  </Line>
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* Riwayat Skor & Peringkat */}
            <PerformanceScoreHistory
              scores={filteredScores}
              mainColor={mainColor}
            />
          </div>
        ) : (
          <EmptyState
            icon={BarChart3}
            color="purple"
            title={searchQuery ? 'Tidak ada hasil' : 'Belum Ada Data Performa'}
            description={searchQuery ? 'Coba kata kunci lain' : 'Selesaikan try out untuk melihat grafik performa'}
            className="py-8"
          />
        )}
      </CardContent>
    </Card>
  );
}
