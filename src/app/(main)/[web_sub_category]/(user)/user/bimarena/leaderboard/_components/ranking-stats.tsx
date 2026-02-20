'use client';

import { useLeaderboardContext } from '@/app/(main)/[web_sub_category]/(user)/user/bimarena/leaderboard/_components/provider-leaderboard';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { getSubtestLabel } from '@/lib/utils/snbt';
import {
  Activity,
  BarChart2,
  Brain,
  Sigma,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import React, { Fragment, useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

// ── helpers ──────────────────────────────────────────────────────────────

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 145, 255';
}

type TierKey = 'unggul' | 'baik' | 'cukup' | 'rendah' | 'lemah';

function scoreTier(score: number, max = 100): TierKey {
  const pct = (score / Math.max(max, 0.001)) * 100;
  if (pct >= 80) return 'unggul';
  if (pct >= 65) return 'baik';
  if (pct >= 50) return 'cukup';
  if (pct >= 35) return 'rendah';
  return 'lemah';
}

const TIER_META: Record<
  TierKey,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  unggul: { label: 'Unggul', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  baik:   { label: 'Baik',   bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',    dot: 'bg-blue-500'    },
  cukup:  { label: 'Cukup',  bg: 'bg-yellow-50',  text: 'text-yellow-700',  border: 'border-yellow-200',  dot: 'bg-yellow-500'  },
  rendah: { label: 'Rendah', bg: 'bg-orange-50',  text: 'text-orange-700',  border: 'border-orange-200',  dot: 'bg-orange-500'  },
  lemah:  { label: 'Lemah',  bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200',     dot: 'bg-red-500'     },
};

function TierBadge({ score, max = 100 }: { score: number; max?: number }) {
  const tier = scoreTier(score, max);
  const m = TIER_META[tier];
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border', m.bg, m.text, m.border)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', m.dot)} />
      {m.label}
    </span>
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}

const CustomDistTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-3 text-xs min-w-[140px]">
      <p className="font-bold text-gray-800 mb-1.5 text-sm">Rentang: {label}</p>
      <div className="flex items-center justify-between gap-4">
        <span className="text-gray-500">Peserta</span>
        <span className="font-bold text-gray-800">{payload[0]?.value}</span>
      </div>
    </div>
  );
};

export function RankingStats() {
  const { RankingTryoutIsLoading, RankingTryout, selectedTryOut } = useLeaderboardContext();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  const tabs = [
    { title: 'Ringkasan', value: 'summary',    icon: <Activity className="h-3.5 w-3.5" /> },
    { title: 'Statistik', value: 'statistics', icon: <Sigma    className="h-3.5 w-3.5" /> },
    { title: 'Analisis',  value: 'subjects',   icon: <Brain    className="h-3.5 w-3.5" /> },
  ];

  return (
    <Card className="bg-white shadow-sm border-2 border-gray-100 rounded-3xl overflow-hidden">
      <CardHeader className="pb-5 border-b-2 border-gray-100">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0"
            style={{ backgroundColor: mainColor }}
          >
            <BarChart2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-black text-gray-900">Analisis Performa</CardTitle>
            <CardDescription className="text-sm text-gray-500 font-medium mt-0.5">
              Statistik mendalam &middot; distribusi &middot; dan analisis per mata pelajaran
            </CardDescription>
          </div>
          {RankingTryout?.isIRT && (
            <Badge
              className="ml-auto text-white text-xs font-bold px-3 py-1 rounded-full flex-shrink-0"
              style={{ backgroundColor: mainColor }}
            >
              IRT 3PL
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {!selectedTryOut ? (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
            <Target className="w-12 h-12 text-gray-300" />
            <p className="font-semibold text-gray-500">Pilih Try-Out terlebih dahulu</p>
            <p className="text-sm text-gray-400">
              Pilih try-out di atas untuk melihat analisis performa
            </p>
          </div>
        ) : (
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-50 rounded-2xl p-1 h-11 border-0">
              {tabs.map((tab, i) => (
                <React.Fragment key={i}>
                  {!RankingTryoutIsLoading ? (
                    <TabsTrigger
                      value={tab.value}
                      className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all text-gray-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
                    >
                      {tab.icon}
                      <span className="hidden sm:inline">{tab.title}</span>
                    </TabsTrigger>
                  ) : (
                    <Skeleton className="h-9 w-full rounded-xl" />
                  )}
                </React.Fragment>
              ))}
            </TabsList>
            <TabsContent value="summary"    className="mt-0"><Summary /></TabsContent>
            <TabsContent value="statistics" className="mt-0"><Statistics /></TabsContent>
            <TabsContent value="subjects"   className="mt-0"><AnalysisSubject /></TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}

type InsightCard = {
  icon: React.ReactNode;
  base: string;
  header: string;
  body: string;
  title: string;
  text: string;
};

const Summary = () => {
  const { RankingTryout, RankingTryoutIsLoading } = useLeaderboardContext();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const rgb = hexToRgb(mainColor);

  const avg   = RankingTryout?.averageScore  ?? 0;
  const top   = RankingTryout?.topScore      ?? 0;
  const bot   = RankingTryout?.bottomScore   ?? 0;
  const total = RankingTryout?.totalParticipants ?? 0;
  const spread = top - bot;
  const avgPct = spread > 0 ? ((avg - bot) / spread) * 100 : 50;
  const distData = RankingTryout?.DistributionScore ?? [];

  const kpiCards = [
    { title: 'Total Peserta',   value: total.toLocaleString('id-ID') || '—', sub: 'peserta mengikuti', icon: <Users        className="w-5 h-5 text-white" />, accent: '#6366f1', badge: null as React.ReactNode },
    { title: 'Rata-rata Nilai', value: avg.toFixed(1)  || '—',               sub: 'nilai rata-rata',  icon: <Activity     className="w-5 h-5 text-white" />, accent: mainColor, badge: top > 0 ? <TierBadge score={avg} max={top} /> : null },
    { title: 'Nilai Tertinggi', value: top.toFixed(1)  || '—',               sub: 'skor terbaik',     icon: <TrendingUp   className="w-5 h-5 text-white" />, accent: '#10b981', badge: null },
    { title: 'Nilai Terendah',  value: bot.toFixed(1)  || '—',               sub: 'skor terendah',    icon: <TrendingDown className="w-5 h-5 text-white" />, accent: '#f59e0b', badge: null },
  ];

  const insights = useMemo<InsightCard[]>(() => {
    if (!RankingTryout || top === 0) return [];
    const list: InsightCard[] = [];

    // Insight 1: level rata-rata
    const t = scoreTier(avg, top);
    const m = TIER_META[t];
    list.push({
      icon: <Activity className="w-4 h-4" />,
      base: `${m.bg} ${m.border}`, header: m.text, body: m.text,
      title: `Level Rata-rata: ${m.label}`,
      text: `Skor rata-rata ${avg.toFixed(1)} dari maks ${top.toFixed(1)} (${((avg / top) * 100).toFixed(0)}%). Mayoritas peserta berada di level ${m.label}.`,
    });

    // Insight 2: spread / variasi
    const spreadPct = (spread / top) * 100;
    if (spreadPct > 50) {
      list.push({ icon: <TrendingDown className="w-4 h-4" />, base: 'bg-orange-50 border-orange-200', header: 'text-orange-700', body: 'text-orange-600', title: 'Kemampuan Sangat Bervariasi', text: `Rentang ${spread.toFixed(0)} poin (${spreadPct.toFixed(0)}% dari maks). Perbedaan kemampuan antar peserta sangat signifikan.` });
    } else if (spreadPct > 25) {
      list.push({ icon: <Activity className="w-4 h-4" />, base: 'bg-blue-50 border-blue-200', header: 'text-blue-700', body: 'text-blue-600', title: 'Kemampuan Beragam', text: `Rentang ${spread.toFixed(0)} poin, peserta memiliki kemampuan yang beragam namun tidak terlalu ekstrem.` });
    } else {
      list.push({ icon: <TrendingUp className="w-4 h-4" />, base: 'bg-emerald-50 border-emerald-200', header: 'text-emerald-700', body: 'text-emerald-600', title: 'Kemampuan Relatif Merata', text: `Rentang nilai hanya ${spread.toFixed(0)} poin. Mayoritas peserta memiliki kemampuan yang setara.` });
    }

    // Insight 3: peak distribution
    if (distData.length > 0 && total > 0) {
      const peak    = distData.reduce((a, b) => (a.count > b.count ? a : b));
      const peakPct = ((peak.count / total) * 100).toFixed(0);
      const peakIdx = distData.indexOf(peak);
      const isHigh  = peakIdx >= distData.length * 0.6;
      const isLow   = peakIdx <= distData.length * 0.35;
      if (isHigh) {
        list.push({ icon: <TrendingUp className="w-4 h-4" />, base: 'bg-emerald-50 border-emerald-200', header: 'text-emerald-700', body: 'text-emerald-600', title: 'Dominasi Nilai Tinggi', text: `${peakPct}% peserta terkonsentrasi di rentang atas (${peak.range}). Mayoritas berkemampuan tinggi.` });
      } else if (isLow) {
        list.push({ icon: <TrendingDown className="w-4 h-4" />, base: 'bg-red-50 border-red-200', header: 'text-red-700', body: 'text-red-600', title: 'Nilai Cenderung Rendah', text: `${peakPct}% peserta terkonsentrasi di rentang bawah (${peak.range}). Banyak peserta perlu peningkatan.` });
      } else {
        list.push({ icon: <Users className="w-4 h-4" />, base: 'bg-indigo-50 border-indigo-200', header: 'text-indigo-700', body: 'text-indigo-600', title: 'Distribusi Nilai Wajar', text: `Puncak di rentang menengah ${peak.range} (${peakPct}%). Distribusi nilai tergolong normal.` });
      }
    }

    return list;
  }, [RankingTryout, avg, top, spread, distData, total]);

  if (RankingTryoutIsLoading) {
    return (
      <div className="space-y-5">
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-2xl" />)}
        </div>
        <Skeleton className="w-full h-44 rounded-2xl" />
        <Skeleton className="w-full h-32 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* KPI Cards */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card, i) => (
          <div key={i} className="relative overflow-hidden rounded-2xl p-4 bg-white border-2 border-gray-100 hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-5 translate-x-6 -translate-y-6" style={{ backgroundColor: card.accent }} />
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-semibold text-gray-500 leading-tight">{card.title}</p>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm" style={{ backgroundColor: card.accent }}>{card.icon}</div>
            </div>
            <p className="text-2xl font-black text-gray-900 mb-1.5">{card.value}</p>
            {card.badge ?? <p className="text-xs text-gray-400 font-medium leading-snug">{card.sub}</p>}
          </div>
        ))}
      </div>

      {/* Range + distribution */}
      <div className="rounded-2xl border-2 border-gray-100 bg-gray-50/40 p-5 space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Target className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-bold text-gray-700">Rentang &amp; Distribusi Nilai</span>
          <span className="text-xs text-gray-400">— seberapa tersebar kemampuan peserta</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-gray-500">Min: <strong className="text-gray-700">{bot.toFixed(1)}</strong></span>
            <span className="text-gray-500">Rata-rata: <strong style={{ color: mainColor }}>{avg.toFixed(1)}</strong></span>
            <span className="text-gray-500">Max: <strong className="text-gray-700">{top.toFixed(1)}</strong></span>
          </div>
          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
            <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${Math.min(Math.max(avgPct, 4), 96)}%`, backgroundColor: mainColor, opacity: 0.75 }} />
            <div className="absolute inset-y-0 w-0.5 bg-white shadow-md" style={{ left: `${Math.min(Math.max(avgPct, 4), 96)}%` }} />
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Batas Bawah</span>
            <span>Spread: <strong className="text-gray-600">{spread.toFixed(1)}</strong> poin ({spread > 0 && top > 0 ? ((spread / top) * 100).toFixed(0) : 0}% dari maks)</span>
            <span>Batas Atas</span>
          </div>
        </div>
        {distData.length > 0 && (
          <div className="pt-3 border-t border-gray-200 space-y-1.5">
            <p className="text-xs font-semibold text-gray-500 mb-2">Berapa peserta di tiap rentang nilai?</p>
            {distData.map((d, i) => {
              const pct = total > 0 ? (d.count / total) * 100 : 0;
              const opacity = 0.30 + (i / Math.max(distData.length - 1, 1)) * 0.70;
              return (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="w-20 text-right text-gray-500 font-medium shrink-0">{d.range}</span>
                  <div className="flex-1 h-6 bg-white border border-gray-100 rounded-full overflow-hidden relative">
                    <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 flex items-center justify-end pr-2" style={{ width: `${Math.max(pct, 0)}%`, backgroundColor: `rgba(${rgb}, ${opacity})`, minWidth: pct > 0 ? '4px' : '0' }}>
                      {pct >= 10 && <span className="text-white text-[10px] font-bold">{pct.toFixed(0)}%</span>}
                    </div>
                  </div>
                  <div className="w-28 shrink-0 flex items-center gap-1">
                    <span className="font-semibold text-gray-700">{d.count} orang</span>
                    {pct < 10 && <span className="text-gray-400">({pct.toFixed(0)}%)</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Auto insights */}
      {insights.length > 0 && (
        <div className="rounded-2xl border-2 border-gray-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/80 flex items-center gap-2">
            <Brain className="w-4 h-4 text-gray-400" />
            <p className="text-sm font-bold text-gray-700">Wawasan Otomatis</p>
            <span className="text-xs text-gray-400">— interpretasi data secara ringkas</span>
          </div>
          <div className="p-4 grid gap-3 sm:grid-cols-3">
            {insights.map((ins, i) => (
              <div key={i} className={cn('rounded-xl p-3.5 border', ins.base)}>
                <div className={cn('flex items-center gap-1.5 font-bold text-xs mb-1.5', ins.header)}>
                  {ins.icon}
                  {ins.title}
                </div>
                <p className={cn('text-xs leading-relaxed', ins.body)}>{ins.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Statistics = () => {
  const { RankingTryout, RankingTryoutIsLoading } = useLeaderboardContext();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  const distChartConfig = { count: { label: 'Peserta', color: mainColor } } satisfies ChartConfig;
  const maxCount = useMemo(
    () => Math.max(...(RankingTryout?.DistributionScore?.map((d) => d.count) ?? [1])),
    [RankingTryout],
  );

  // SD color: high variance = orange→red, low = green, mid = gray
  const sdColor = (stdDev: number, mean: number): string => {
    if (mean <= 0) return '#9ca3af';
    const ratio = stdDev / mean;
    if (ratio > 0.4) return '#ef4444';
    if (ratio > 0.25) return '#f97316';
    if (ratio < 0.1) return '#10b981';
    return '#f59e0b';
  };
  const sdLabel = (stdDev: number, mean: number): string => {
    if (mean <= 0) return '';
    const ratio = stdDev / mean;
    if (ratio > 0.4) return 'Sangat bervariasi';
    if (ratio > 0.25) return 'Bervariasi';
    if (ratio < 0.1) return 'Sangat konsisten';
    return 'Cukup konsisten';
  };

  const colLegend = [
    { dot: 'bg-gray-400',    label: 'Min / Q1 / Q3 / Max', title: 'Batas bawah, kuartil, dan batas atas' },
    { dot: 'bg-indigo-500',  label: 'Median',  title: 'Nilai tengah — 50% peserta di atas ini' },
    { dot: '',               label: 'Mean',    title: 'Nilai rata-rata sub-kategori', mainColor: true },
    { dot: 'bg-orange-500',  label: 'SD',      title: 'Standar Deviasi — seberapa tersebar nilai (SD tinggi = nilai sangat bervariasi)' },
    { dot: 'bg-emerald-500', label: 'Max',     title: 'Nilai tertinggi yang dicapai peserta' },
  ];

  if (RankingTryoutIsLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="w-full h-64 rounded-2xl" />
        <Skeleton className="w-full h-72 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Table */}
      <div className="rounded-2xl border-2 border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/80">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${mainColor}18` }}>
            <Sigma className="w-3.5 h-3.5" style={{ color: mainColor }} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">Statistik Deskriptif per Sub-Kategori</p>
            <p className="text-xs text-gray-400">Ringkasan sebaran nilai peserta pada setiap komponen tes</p>
          </div>
        </div>

        {/* Column legend */}
        <div className="px-5 py-3 flex flex-wrap gap-x-5 gap-y-2 border-b border-gray-100 bg-white">
          {colLegend.map((c, i) => (
            <div key={i} className="flex items-center gap-1.5" title={c.title}>
              {c.mainColor
                ? <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: mainColor }} />
                : <span className={cn('w-2.5 h-2.5 rounded-full shrink-0', c.dot)} />
              }
              <span className="text-xs font-semibold text-gray-600">{c.label}</span>
              <span className="hidden md:inline text-xs text-gray-400">— {c.title}</span>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-200">
                <TableHead className="w-[190px] font-bold text-gray-700 text-xs py-3 pl-5">Sub Kategori</TableHead>
                <TableHead className="text-right font-bold text-gray-500 text-xs py-3">Min</TableHead>
                <TableHead className="text-right font-bold text-gray-500 text-xs py-3">Q1</TableHead>
                <TableHead className="text-right font-bold text-indigo-600 text-xs py-3">Median</TableHead>
                <TableHead className="text-right font-bold text-xs py-3" style={{ color: mainColor }}>Mean</TableHead>
                <TableHead className="text-right font-bold text-orange-500 text-xs py-3">SD</TableHead>
                <TableHead className="text-right font-bold text-gray-500 text-xs py-3">Q3</TableHead>
                <TableHead className="text-right font-bold text-emerald-600 text-xs py-3">Max</TableHead>
                <TableHead className="text-right font-bold text-gray-700 text-xs py-3">Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {RankingTryout?.StatisticsCategory?.map((cat, ci) => (
                <Fragment key={ci}>
                  <TableRow className="bg-gray-50 border-y border-gray-100">
                    <TableCell colSpan={9} className="py-2.5 px-5 text-xs font-black tracking-wider uppercase" style={{ color: mainColor }}>
                      📂 {cat.category}
                    </TableCell>
                  </TableRow>
                  {cat.session?.map((s, si) => {
                    const meanPct = s.max > 0 ? (s.mean / s.max) * 100 : 0;
                    const sdC = sdColor(s.stdDev, s.mean);
                    const sdL = sdLabel(s.stdDev, s.mean);
                    return (
                      <TableRow key={`${ci}-${si}`} className="hover:bg-gray-50/80 transition-colors border-b border-gray-50">
                        <TableCell className="pl-7 pr-3 py-3 font-semibold text-gray-700 text-xs w-[190px]">
                          <div className="flex flex-col gap-1.5">
                            <span className="leading-tight">{s.subCategory}</span>
                            <div className="flex items-center gap-1.5">
                              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${Math.min(meanPct, 100)}%`, backgroundColor: mainColor, opacity: 0.5 }} />
                              </div>
                              <span className="text-[10px] text-gray-400 shrink-0">{meanPct.toFixed(0)}%</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs text-gray-400 py-3">{s.min?.toFixed(1)}</TableCell>
                        <TableCell className="text-right font-mono text-xs text-gray-400 py-3">{s.q1?.toFixed(1)}</TableCell>
                        <TableCell className="text-right font-mono text-xs font-bold text-indigo-600 py-3">{s.median?.toFixed(1)}</TableCell>
                        <TableCell className="text-right font-mono text-xs font-bold py-3" style={{ color: mainColor }}>{s.mean?.toFixed(1)}</TableCell>
                        <TableCell className="text-right py-3">
                          <div className="flex flex-col items-end gap-0.5">
                            <span className="font-mono text-xs font-bold" style={{ color: sdC }}>{s.stdDev?.toFixed(1)}</span>
                            {sdL && <span className="text-[9px] font-medium" style={{ color: sdC }}>{sdL}</span>}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs text-gray-400 py-3">{s.q3?.toFixed(1)}</TableCell>
                        <TableCell className="text-right font-mono text-xs font-bold text-emerald-600 py-3">{s.max?.toFixed(1)}</TableCell>
                        <TableCell className="text-right py-3"><TierBadge score={s.mean} max={s.max} /></TableCell>
                      </TableRow>
                    );
                  })}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Table footnote */}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/60 flex flex-wrap gap-x-4 gap-y-1">
          <p className="text-xs text-gray-400"><strong className="text-gray-500">SD besar</strong> = nilai peserta sangat bervariasi, ada yang tinggi dan rendah</p>
          <p className="text-xs text-gray-400"><strong className="text-gray-500">Median &gt; Mean</strong> = lebih banyak peserta di atas rata-rata (distribusi miring kiri)</p>
        </div>
      </div>

      {/* Distribution Chart */}
      <div className="rounded-2xl border-2 border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/80">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${mainColor}18` }}>
            <BarChart2 className="w-3.5 h-3.5" style={{ color: mainColor }} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">Distribusi Nilai</p>
            <p className="text-xs text-gray-400">Berapa peserta mendapat nilai di setiap rentang? Bar lebih tinggi = lebih banyak peserta di rentang itu</p>
          </div>
        </div>
        <div className="p-5">
          <div className="h-72 w-full">
            <ChartContainer config={distChartConfig} className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={RankingTryout?.DistributionScore} margin={{ top: 24, right: 16, left: 0, bottom: 8 }} barCategoryGap="25%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="range" tickLine={false} axisLine={false} fontSize={11} fontWeight={500} tick={{ fill: '#9ca3af' }} />
                  <YAxis tickLine={false} axisLine={false} fontSize={11} fontWeight={500} tick={{ fill: '#9ca3af' }} width={32} label={{ value: 'Peserta', angle: -90, position: 'insideLeft', offset: 8, style: { fontSize: 10, fill: '#9ca3af' } }} />
                  <ChartTooltip content={<CustomDistTooltip />} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {RankingTryout?.DistributionScore?.map((d, i) => (
                      <Cell key={i} fill={mainColor} fillOpacity={0.30 + (d.count / maxCount) * 0.70} />
                    ))}
                    <LabelList position="top" fontSize={11} fontWeight={700} fill="#6b7280" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const AnalysisSubject = () => {
  const { RankingTryout, RankingTryoutIsLoading } = useLeaderboardContext();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const rgb = hexToRgb(mainColor);
  const isIRT = RankingTryout?.isIRT ?? false;

  const subjects = useMemo(() => {
    const items = [...(RankingTryout?.AnalisisCategory ?? [])];
    const websiteSubCategoryId = websiteSubCategory?.id;

    const names = items.map((item) => item.name);

    // Build unique short labels: use SNBT initials for snbt, else auto-truncate
    const makeShort = (name: string, len: number) =>
      name.length > len + 1 ? name.slice(0, len) + '\u2026' : name;

    const shortNames = names.map((name, i) => {
      const initials = getSubtestLabel(name, websiteSubCategoryId);
      if (initials !== name) return initials;
      let len = 13;
      while (len <= name.length) {
        const candidate = makeShort(name, len);
        const hasDuplicate = names.some(
          (other, j) => j !== i && makeShort(other, len) === candidate,
        );
        if (!hasDuplicate) return candidate;
        len++;
      }
      return name;
    });

    return items
      .map((item, i) => ({
        name: item.name,
        shortName: shortNames[i],
        value: isIRT
          ? parseFloat(item.avgTheta?.toFixed(3) || '0')
          : parseFloat(item.avgScore?.toFixed(1) || '0'),
        totalScore: parseFloat(item.totalScore?.toFixed(1) || '0'),
      }))
      .sort((a, b) => b.value - a.value);
  }, [RankingTryout, isIRT, websiteSubCategory?.id]);

  const maxValue = useMemo(
    () => Math.max(...subjects.map((s) => Math.abs(s.value)), 0.001),
    [subjects],
  );

  // min-max normalization so that the radar fills 15–90% of the chart
  // regardless of whether all values are negative (IRT) or positive (raw scores)
  const radarData = useMemo(() => {
    if (subjects.length === 0) return [];
    const vals = subjects.map((s) => s.value);
    const lo = Math.min(...vals);
    const hi = Math.max(...vals);
    const range = hi - lo;
    return subjects.map((s) => ({
      subject: s.shortName,
      fullName: s.name,
      rawValue: s.value,
      // when all subjects have the same value, render at 60%; otherwise spread 15→90
      value: range < 0.0001
        ? 60
        : Math.round(((s.value - lo) / range) * 75 + 15),
    }));
  }, [subjects]);

  const radarConfig = {
    value: { label: isIRT ? 'θ (relatif)' : 'Skor (relatif)', color: mainColor },
  } satisfies ChartConfig;

  // IRT verbal interpretation
  const irtInterpret = (theta: number): { label: string; color: string } => {
    if (theta >= 1.5)  return { label: 'Sangat Mahir',       color: '#059669' };
    if (theta >= 0.5)  return { label: 'Di Atas Rata-rata',  color: '#0891b2' };
    if (theta >= -0.5) return { label: 'Rata-rata',          color: '#6366f1' };
    if (theta >= -1.5) return { label: 'Di Bawah Rata-rata', color: '#d97706' };
    return               { label: 'Perlu Peningkatan',       color: '#dc2626' };
  };

  const medalColor = (i: number) =>
    i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : i === 2 ? '#b45309' : '#d1d5db';

  if (RankingTryoutIsLoading) return <Skeleton className="w-full h-[480px] rounded-2xl" />;

  const strengths  = subjects.slice(0, Math.min(3, subjects.length));
  const weaknesses = subjects.length > 1 ? [...subjects].reverse().slice(0, Math.min(3, subjects.length)) : [];

  return (
    <div className="space-y-6">
      {/* IRT info banner */}
      {isIRT && (
        <div className="rounded-2xl border-2 border-indigo-100 bg-indigo-50/60 p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
            <Brain className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-indigo-800">Skala IRT — Theta (θ)</p>
            <p className="text-xs text-indigo-600 mt-0.5 leading-relaxed">
              Nilai ditampilkan dalam <strong>theta (θ)</strong>, bukan skor mentah. Skala: <strong>−3 (sangat rendah)</strong> hingga <strong>+3 (sangat tinggi)</strong>.
              Nilai <strong>0 = rata-rata populasi</strong>. Interpretasi: θ ≥ +1.5 Sangat Mahir · θ ≥ +0.5 Di atas rata-rata · θ ≥ −0.5 Rata-rata · θ &lt; −0.5 Di bawah rata-rata.
            </p>
          </div>
        </div>
      )}

      {/* Strengths & Weaknesses */}
      {subjects.length >= 2 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Kekuatan */}
          <div className="rounded-2xl border-2 border-emerald-100 overflow-hidden">
            <div className="px-4 py-3 bg-emerald-50 border-b border-emerald-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <p className="text-sm font-bold text-emerald-800">Kekuatan (Top {strengths.length})</p>
            </div>
            <div className="p-4 space-y-2.5">
              {strengths.map((s, i) => {
                const interp = isIRT ? irtInterpret(s.value) : null;
                return (
                  <div key={s.name} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[11px] font-black shrink-0">{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-gray-700 truncate">{s.name}</span>
                        <span className="text-xs font-mono font-bold text-emerald-700 shrink-0">{s.value}</span>
                      </div>
                      {interp && <p className="text-[10px] font-medium mt-0.5" style={{ color: interp.color }}>{interp.label}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Kelemahan */}
          <div className="rounded-2xl border-2 border-red-100 overflow-hidden">
            <div className="px-4 py-3 bg-red-50 border-b border-red-100 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <p className="text-sm font-bold text-red-800">Perlu Ditingkatkan (Bottom {weaknesses.length})</p>
            </div>
            <div className="p-4 space-y-2.5">
              {weaknesses.map((s, i) => {
                const interp = isIRT ? irtInterpret(s.value) : null;
                return (
                  <div key={s.name} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-[11px] font-black shrink-0">{subjects.length - i}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-gray-700 truncate">{s.name}</span>
                        <span className="text-xs font-mono font-bold text-red-600 shrink-0">{s.value}</span>
                      </div>
                      {interp && <p className="text-[10px] font-medium mt-0.5" style={{ color: interp.color }}>{interp.label}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Horizontal ranked bars */}
      <div className="rounded-2xl border-2 border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/80 flex items-center gap-3">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${mainColor}18` }}>
            <Target className="w-3.5 h-3.5" style={{ color: mainColor }} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">Performa Per Mata Pelajaran</p>
            <p className="text-xs text-gray-400">
              {isIRT ? 'Diurutkan dari nilai theta (θ) tertinggi ke terendah' : 'Diurutkan dari nilai rata-rata tertinggi ke terendah'}
            </p>
          </div>
        </div>
        <div className="p-5 space-y-3">
          {isIRT && (
            <div className="flex items-center gap-2 mb-1">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-[10px] text-gray-400 font-medium px-2">garis vertikal = rata-rata populasi (θ=0)</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
          )}
          {subjects.map((s, i) => {
            const interp = isIRT ? irtInterpret(s.value) : null;
            // For IRT: diverging bar from center — each side is 0–50% of container
            const halfPct = maxValue > 0 ? (Math.abs(s.value) / maxValue) * 50 : 0;
            // For non-IRT: normal bar 0–100%
            const pct = maxValue > 0 ? (s.value / maxValue) * 100 : 0;
            const opacity = 0.30 + (1 - i / Math.max(subjects.length - 1, 1)) * 0.70;
            return (
              <div key={s.name} className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[11px] font-black"
                  style={{ backgroundColor: medalColor(i) + '22', color: medalColor(i) }}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-700 truncate max-w-[55%]">{s.name}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-xs font-mono font-bold" style={{ color: mainColor }}>{s.value}</span>
                      {interp
                        ? <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ color: interp.color, backgroundColor: interp.color + '15' }}>{interp.label}</span>
                        : <TierBadge score={s.value} max={maxValue} />
                      }
                    </div>
                  </div>
                  <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden relative">
                    {isIRT && (
                      <div className="absolute inset-y-0 left-1/2 w-px bg-gray-400/60 z-10" />
                    )}
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: isIRT ? `${halfPct}%` : `${Math.min(pct, 100)}%`,
                        backgroundColor: `rgba(${rgb}, ${opacity})`,
                        marginLeft: isIRT
                          ? s.value >= 0
                            ? '50%'
                            : `${50 - halfPct}%`
                          : undefined,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Radar Chart */}
      {radarData.length >= 3 && (
        <div className="rounded-2xl border-2 border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/80 flex items-center gap-3">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${mainColor}18` }}>
              <Activity className="w-3.5 h-3.5" style={{ color: mainColor }} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">Radar Kemampuan</p>
              <p className="text-xs text-gray-400">Nilai dinormalisasi 0–100 untuk perbandingan visual antar mata pelajaran</p>
            </div>
          </div>
          <div className="p-5">
            <ChartContainer config={radarConfig} className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} margin={{ top: 16, right: 32, bottom: 16, left: 32 }}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fontWeight: 600, fill: '#6b7280' }} />
                  <Radar dataKey="value" stroke={mainColor} fill={mainColor} fillOpacity={0.12} strokeWidth={2} dot={{ r: 4, fill: mainColor, strokeWidth: 0 }} />
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0];
                      const pl = d.payload as { fullName?: string; rawValue?: number };
                      const full = pl.fullName ?? d.payload.subject;
                      const raw = pl.rawValue;
                      return (
                        <div className="rounded-xl border border-gray-200 bg-white shadow-lg px-3 py-2 space-y-1">
                          <p className="text-xs font-semibold text-gray-700">{full}</p>
                          <p className="text-xs text-gray-500">
                            {isIRT ? 'Rata-rata θ' : 'Rata-rata skor'}:{' '}
                            <span className="font-bold" style={{ color: mainColor }}>
                              {raw !== undefined ? (isIRT ? raw.toFixed(3) : raw.toFixed(1)) : '—'}
                            </span>
                          </p>
                          <p className="text-[10px] text-gray-400">Posisi relatif terhadap mata pelajaran lain</p>
                        </div>
                      );
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      )}


    </div>
  );
};

export default RankingStats;
