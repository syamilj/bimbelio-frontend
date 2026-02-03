"use client";

import { useState, useMemo } from "react";
import { useWebsiteSubCategory } from "@/components/provider/provider-website-category";
import { BimArena } from "@/components/ui/bim-brand";
import { TrendingUp, TrendingDown, Search, Trophy, Target } from "lucide-react";
import { EmptyStateIllustrations } from "./EmptyStateIllustrations";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

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

export default function BimPerformanceChart({ scoreHistory, studyTimeHistory }: BimPerformanceChartProps) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || "#0091FF";
  const isSNBT = websiteSubCategory?.name?.toUpperCase().includes("SNBT");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter score history
  const filteredScores = scoreHistory.filter(item =>
    item.tryoutTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Prepare data for charts
  const chartData = useMemo(() => {
    return filteredScores.map((item, index) => ({
      index: index + 1,
      name: `TO ${index + 1}`,
      score: item.score,
      rank: item.rank,
      title: item.tryoutTitle,
      date: item.date,
      // Calculate trend line (simple linear regression)
      trend: filteredScores.length > 1
        ? ((filteredScores[filteredScores.length - 1].score - filteredScores[0].score) / (filteredScores.length - 1)) * index + filteredScores[0].score
        : item.score,
    }));
  }, [filteredScores]);

  // Calculate stats
  const stats = useMemo(() => {
    if (filteredScores.length === 0) return { avg: 0, highest: 0, lowest: 0, trend: 0 };

    const scores = filteredScores.map(h => h.score);
    const avg = Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);

    // Calculate trend (slope) - as integer per TO
    const trend = filteredScores.length > 1
      ? Math.round(((filteredScores[filteredScores.length - 1].score - filteredScores[0].score) / filteredScores.length))
      : 0;

    return { avg, highest, lowest, trend };
  }, [filteredScores]);

  const chartConfig = {
    score: {
      label: "Skor",
      color: mainColor,
    },
    trend: {
      label: "Trend",
      color: "#94a3b8",
    },
  };

  return (
    <Card className="w-full border-2">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-black text-slate-800">Performa <BimArena /></CardTitle>
            <CardDescription>Grafik perkembangan skor tryout kamu</CardDescription>
          </div>
          {filteredScores.length > 0 && (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${stats.trend >= 0 ? 'bg-emerald-100' : 'bg-red-100'}`}>
              {stats.trend >= 0 ? (
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-xs font-bold ${stats.trend >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {stats.trend >= 0 ? '+' : ''}{stats.trend} per TO
              </span>
            </div>
          )}
        </div>

        {/* Search Bar */}
        {scoreHistory.length > 0 && (
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
      </CardHeader>

      <CardContent>
        {filteredScores.length > 0 ? (
          <div className="space-y-6">
            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-3xl border-2 border-emerald-100 bg-emerald-50">
                <div className="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-1">Rata-rata</div>
                <div className="text-2xl font-black text-emerald-700">{stats.avg}</div>
              </div>
              <div className="p-4 rounded-3xl border-2 border-blue-100 bg-blue-50">
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">Tertinggi</div>
                <div className="text-2xl font-black text-blue-700 flex items-center gap-1">
                  <Trophy className="w-5 h-5" />
                  {stats.highest}
                </div>
              </div>
              <div className="p-4 rounded-3xl border-2 border-slate-100 bg-slate-50">
                <div className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Terendah</div>
                <div className="text-2xl font-black text-slate-700">{stats.lowest}</div>
              </div>
            </div>

            {/* Score Line Chart with Trend */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-700">Grafik Skor & Trend</h3>
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={mainColor} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={mainColor} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                  <XAxis
                    dataKey="name"
                    className="text-xs"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: '#64748b', fontSize: 12 }}                    domain={[stats.lowest - 50, stats.highest + 50]}                  />
                  <ChartTooltip content={<ChartTooltipContent />} />

                  {/* Trend Line (dashed) */}
                  <Line
                    type="monotone"
                    dataKey="trend"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Trend"
                  />

                  {/* Score Area */}
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke={mainColor}
                    strokeWidth={3}
                    fill="url(#scoreGradient)"
                    name="Skor"
                  />
                </AreaChart>
              </ChartContainer>
            </div>

            {/* Combined Score & Ranking History */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-700">Riwayat Skor & Peringkat</h3>
              <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
                {filteredScores.slice(-5).reverse().map((item, index) => {
                  const rankPercentile = item.totalParticipants > 0
                    ? Math.round(((item.totalParticipants - item.rank + 1) / item.totalParticipants) * 100)
                    : 0;

                  return (
                    <div
                      key={index}
                      className="flex-shrink-0 w-[320px] p-2.5 rounded-3xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all"
                    >
                      {/* Header: Title and Date */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-slate-800 truncate">{item.tryoutTitle}</p>
                          <p className="text-xs text-slate-500">
                            {format(new Date(item.date), 'dd MMM yyyy', { locale: localeId })}
                          </p>
                        </div>
                      </div>

                      {/* Score and Ranking Row */}
                      <div className="flex items-center gap-3">
                        {/* Score */}
                        <div className="flex items-center gap-2 flex-1">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${mainColor}15` }}
                          >
                            <Target className="w-5 h-5" style={{ color: mainColor }} />
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 font-medium">Skor</div>
                            <div className="text-lg font-black" style={{ color: mainColor }}>{Math.round(item.score)}</div>
                          </div>
                        </div>

                        {/* Ranking */}
                        <div className="flex items-center gap-2 flex-1">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                              item.rank <= 3 ? 'bg-yellow-100' : 'bg-blue-50'
                            }`}
                          >
                            <Trophy className={`w-5 h-5 ${
                              item.rank <= 3 ? 'text-yellow-600' : 'text-blue-600'
                            }`} />
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 font-medium">Peringkat</div>
                            <div className="flex items-center gap-1">
                              <span className={`text-lg font-black ${
                                item.rank <= 3 ? 'text-yellow-600' : 'text-blue-600'
                              }`}>#{item.rank}</span>
                              <span className="text-xs text-slate-500">/ {item.totalParticipants}</span>
                              {item.rankChange !== 0 && (
                                <span className={`text-xs font-bold ml-1 ${
                                  item.rankChange > 0 ? 'text-emerald-600' : 'text-red-600'
                                }`}>
                                  {item.rankChange > 0 ? '↑' : '↓'}{Math.abs(item.rankChange)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Ranking Progress Bar */}
                      <div className="mt-3 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Top {rankPercentile}%</span>
                          <span className="text-slate-600 font-bold">{item.totalParticipants - item.rank} peserta dibawah Anda</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${rankPercentile}%`,
                              backgroundColor: item.rankChange > 0 ? '#10b981' : item.rankChange < 0 ? '#ef4444' : mainColor,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-32 h-32 mx-auto mb-3">
              <EmptyStateIllustrations.NoPerformance />
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-2">
              {searchQuery ? "Tidak ada hasil" : "Belum Ada Data Performa"}
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              {searchQuery ? "Coba kata kunci lain" : <>Selesaikan <BimArena /> untuk melihat grafik performa</>}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
