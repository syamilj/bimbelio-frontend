'use client';

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
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGet } from '@/lib/fetch-helper/useGet';
import { cn } from '@/lib/utils';
import { getSubtestLabel } from '@/lib/utils/subtest';
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Brain,
  CheckCircle2,
  Flame,
  Gauge,
  Minus,
  Rocket,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  XCircle,
  Zap,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  ComposedChart,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { SectionTitle } from './section-title';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SubtestData {
  id: string;
  name: string;
  initial: string;
  currentAvg: number;
  recentAvg: number;
  latestScore: number;
  predicted: number;
  trend: 'improving' | 'declining' | 'stable';
  slope: number;
  strength: 'strong' | 'moderate' | 'weak';
  dataPoints: number;
  history: { index: number; score: number }[];
}

interface PredictionResponse {
  insufficient: boolean;
  totalTryouts?: number;
  minimumRequired?: number;
  prediction?: {
    nextScore: number;
    confidence: { low: number; high: number };
    trend: 'improving' | 'declining' | 'stable';
    trendSlope: number;
    rSquared: number;
    mae: number;
    momentum: number;
    acceleration: number;
  };
  projections?: {
    stepsAhead: number;
    wls: number;
    ema: number;
    blended: number;
  }[];
  zones?: {
    excellence: { min: number; label: string };
    target: { min: number; max: number; label: string };
    risk: { max: number; label: string };
  };
  perSubtest?: SubtestData[];
  bskTrend?: {
    index: number;
    benar: number;
    salah: number;
    kosong: number;
    efficiency: number;
  }[];
  insights?: {
    strongestSubtest: { name: string; avgScore: number; initial: string } | null;
    weakestSubtest: { name: string; avgScore: number; initial: string } | null;
    consistency: number;
    learningVelocity: number;
    scoringEfficiency: number;
    growthPercent: number;
    projectedMilestone: { target: number; triesNeeded: number } | null;
    totalTryouts: number;
    latestScore: number;
    averageScore: number;
    bestPerformance: { index: number; score: number; title: string };
    worstPerformance: { index: number; score: number; title: string };
  };
  history?: {
    index: number;
    date: string | null;
    tryoutTitle: string;
    actual: number | null;
    predicted: number;
    ema: number | null;
    benar: number | null;
    salah: number | null;
    kosong: number | null;
    rank: number | null;
    totalParticipants: number | null;
    percentile: number | null;
  }[];
}

// ─── Colors ───────────────────────────────────────────────────────────────────

const SUB_COLORS = [
  '#0091FF', '#22c55e', '#eab308', '#ef4444',
  '#6366f1', '#a855f7', '#f97316', '#14b8a6',
];

// ─── Main Component ───────────────────────────────────────────────────────────

export const ScorePrediction = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const { mainColor } = useWebsiteSubCategory();

  const { data, isLoading } = useGet<PredictionResponse>(
    '/learningAnalytics/getScorePrediction',
    {
      params: { userId: id ? id : undefined },
      useEffectDependencies: [id],
    },
  );

  if (isLoading) return <LoadingState />;
  if (!data) return null;

  if (data.insufficient) {
    return (
      <div>
        <SectionTitle icon={Brain} title="Prediksi Skor" />
        <Card className="w-full border-2">
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Brain className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-black text-slate-800 mb-1">Data Belum Cukup</h3>
              <p className="text-sm text-slate-500 max-w-md">
                Dibutuhkan minimal {data.minimumRequired ?? 2} tryout untuk prediksi.
                Saat ini baru {data.totalTryouts ?? 0} tryout selesai.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-full max-w-[200px] bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-violet-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, ((data.totalTryouts ?? 0) / (data.minimumRequired ?? 2)) * 100)}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-500">
                  {data.totalTryouts ?? 0}/{data.minimumRequired ?? 2}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const p = data.prediction!;
  const ins = data.insights!;

  const trendLabel = p.trend === 'improving' ? 'Meningkat' : p.trend === 'declining' ? 'Menurun' : 'Stabil';
  const scoreDiff = p.nextScore - Math.round(ins.latestScore);

  return (
    <div>
      <SectionTitle icon={Brain} title="Prediksi Skor" />

      <Card className="w-full border-2">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-3xl"
                style={{ backgroundColor: mainColor }}
              >
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-black text-slate-800">
                  Prediksi Skor Tryout
                </CardTitle>
                <CardDescription>
                  Analisis tren &amp; prediksi berbasis Weighted Regression + EMA
                </CardDescription>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 flex-shrink-0">
                <Target className="w-3 h-3 text-slate-500" />
                <span className="text-[10px] font-bold text-slate-700">Prediksi: {p.nextScore}</span>
              </div>
              <div className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full border flex-shrink-0',
                p.trend === 'improving' ? 'bg-emerald-50 border-emerald-100' : p.trend === 'declining' ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-200',
              )}>
                {p.trend === 'improving' ? <TrendingUp className="w-3 h-3 text-emerald-500" /> : p.trend === 'declining' ? <TrendingDown className="w-3 h-3 text-red-500" /> : <Minus className="w-3 h-3 text-slate-500" />}
                <span className={cn(
                  'text-[10px] font-bold',
                  p.trend === 'improving' ? 'text-emerald-700' : p.trend === 'declining' ? 'text-red-700' : 'text-slate-700',
                )}>
                  {trendLabel} ({scoreDiff > 0 ? '+' : ''}{scoreDiff})
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-100 flex-shrink-0">
                <span className="text-[10px] font-bold text-violet-700">R² {p.rSquared}%</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <Tabs defaultValue="overview">
            <div className="space-y-3">
              <h3 className="text-sm font-black text-slate-800">Detail Analisis</h3>
              <div className="overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <TabsList className="inline-flex h-auto w-max min-w-max justify-start gap-1.5 rounded-full bg-slate-100 p-1">
                  <TabsTrigger value="overview" className="shrink-0 rounded-full px-3 py-2 text-xs font-bold sm:px-4">
                    Prediksi
                  </TabsTrigger>
                  <TabsTrigger value="trend" className="shrink-0 rounded-full px-3 py-2 text-xs font-bold sm:px-4">
                    Tren Skor
                  </TabsTrigger>
                  <TabsTrigger value="subtest" className="shrink-0 rounded-full px-3 py-2 text-xs font-bold sm:px-4">
                    Per Subtes
                  </TabsTrigger>
                  <TabsTrigger value="efficiency" className="shrink-0 rounded-full px-3 py-2 text-xs font-bold sm:px-4">
                    Efisiensi
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <TabsContent value="overview" className="mt-4 space-y-4">
              <OverviewTab prediction={p} insights={ins} projections={data.projections!} />
            </TabsContent>
            <TabsContent value="trend" className="mt-4 space-y-4">
              <TrendTab history={data.history!} />
            </TabsContent>
            <TabsContent value="subtest" className="mt-4 space-y-4">
              <SubtestTab perSubtest={data.perSubtest!} />
            </TabsContent>
            <TabsContent value="efficiency" className="mt-4 space-y-4">
              <EfficiencyTab insights={ins} bskTrend={data.bskTrend!} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 1: OVERVIEW
// ═══════════════════════════════════════════════════════════════════════════════

function OverviewTab({
  prediction: p,
  insights: ins,
  projections,
}: {
  prediction: NonNullable<PredictionResponse['prediction']>;
  insights: NonNullable<PredictionResponse['insights']>;
  projections: NonNullable<PredictionResponse['projections']>;
}) {
  const { mainColor } = useWebsiteSubCategory();

  const scoreDiff = p.nextScore - Math.round(ins.latestScore);

  const momentumLabel =
    p.momentum > 3 ? 'Kuat Naik' : p.momentum > 0 ? 'Naik Perlahan'
      : p.momentum < -3 ? 'Turun Tajam' : p.momentum < 0 ? 'Sedikit Turun' : 'Netral';

  return (
    <>
      {/* Summary stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryCard label="Prediksi Berikutnya">
          <span className="text-2xl font-black" style={{ color: mainColor }}>{p.nextScore}</span>
          <span className={cn(
            'text-xs font-bold',
            scoreDiff > 0 ? 'text-emerald-600' : scoreDiff < 0 ? 'text-red-500' : 'text-slate-500',
          )}>
            {scoreDiff > 0 ? '+' : ''}{scoreDiff} dari terakhir
          </span>
        </SummaryCard>
        <SummaryCard label="Skor Terakhir">
          <span className="text-2xl font-black text-slate-800">{Math.round(ins.latestScore)}</span>
          <span className="text-xs text-slate-500">Rata-rata: {ins.averageScore}</span>
        </SummaryCard>
        <SummaryCard label="Confidence 80%">
          <span className="text-2xl font-black text-slate-800">{p.confidence.low} – {p.confidence.high}</span>
          <span className="text-xs text-slate-500">MAE: ±{p.mae}</span>
        </SummaryCard>
        <SummaryCard label="Total Tryout">
          <span className="text-2xl font-black text-slate-800">{ins.totalTryouts}</span>
          <span className="text-xs text-slate-500">Efisiensi: {ins.scoringEfficiency}%</span>
        </SummaryCard>
      </div>

      {/* Projections */}
      <div>
        <h4 className="text-sm font-black text-slate-800 mb-2">Proyeksi Skor</h4>
        <div className="grid grid-cols-3 gap-3">
          {projections.map((proj) => (
            <div key={proj.stepsAhead} className="rounded-3xl border border-slate-200 bg-white p-4">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                {proj.stepsAhead === 1 ? 'TO Berikutnya' : `${proj.stepsAhead} TO Lagi`}
              </p>
              <p className="mt-1 text-2xl font-black text-slate-800">{proj.blended}</p>
              <div className="mt-1 flex gap-2">
                <span className="text-[10px] text-slate-400">WLS: {proj.wls}</span>
                <span className="text-[10px] text-slate-400">EMA: {proj.ema}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights grid */}
      <div>
        <h4 className="text-sm font-black text-slate-800 mb-2">Insight</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          <InsightCard
            title="Momentum"
            value={momentumLabel}
            subtitle={`${p.momentum > 0 ? '+' : ''}${p.momentum} poin/TO (3 terakhir)`}
            tone={p.momentum > 0 ? 'emerald' : p.momentum < 0 ? 'amber' : 'slate'}
          />
          <InsightCard
            title="Pertumbuhan"
            value={`${ins.growthPercent > 0 ? '+' : ''}${ins.growthPercent}%`}
            subtitle="Paruh akhir vs paruh awal"
            tone={ins.growthPercent >= 0 ? 'emerald' : 'amber'}
          />
          <InsightCard
            title="Konsistensi"
            value={ins.consistency < 10 ? 'Sangat Konsisten' : ins.consistency < 20 ? 'Cukup Konsisten' : 'Berfluktuasi'}
            subtitle={`CV = ${ins.consistency}%`}
            tone={ins.consistency < 10 ? 'emerald' : ins.consistency < 20 ? 'amber' : 'amber'}
          />
          <InsightCard
            title="Performa Terbaik"
            value={`${Math.round(ins.bestPerformance.score)}`}
            subtitle={ins.bestPerformance.title}
            tone="emerald"
          />
          <InsightCard
            title="Performa Terendah"
            value={`${Math.round(ins.worstPerformance.score)}`}
            subtitle={ins.worstPerformance.title}
            tone="amber"
          />
          {ins.projectedMilestone && (
            <InsightCard
              title={`Target Skor ${ins.projectedMilestone.target}`}
              value={`~${ins.projectedMilestone.triesNeeded} TO lagi`}
              subtitle={`Dengan tren +${ins.learningVelocity}/TO`}
              tone="blue"
            />
          )}
          {ins.strongestSubtest && (
            <InsightCard
              title="Subtes Terkuat"
              value={ins.strongestSubtest.name}
              subtitle={`Rata-rata: ${Math.round(ins.strongestSubtest.avgScore)}`}
              tone="emerald"
            />
          )}
          {ins.weakestSubtest && (
            <InsightCard
              title="Perlu Ditingkatkan"
              value={ins.weakestSubtest.name}
              subtitle={`Rata-rata: ${Math.round(ins.weakestSubtest.avgScore)}`}
              tone="amber"
            />
          )}
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 2: TREND
// ═══════════════════════════════════════════════════════════════════════════════

function TrendTab({
  history,
}: {
  history: NonNullable<PredictionResponse['history']>;
}) {
  const { mainColor } = useWebsiteSubCategory();

  const chartData = useMemo(() => {
    return history.map((h) => ({
      name: h.actual == null ? 'Prediksi' : `TO-${h.index}`,
      fullName: h.tryoutTitle,
      actual: h.actual,
      predicted: h.predicted,
      ema: h.ema,
      isPrediction: h.actual == null,
    }));
  }, [history]);

  const percentileData = useMemo(() => {
    return history
      .filter((h) => h.percentile != null && h.actual != null)
      .map((h) => ({
        name: `TO-${h.index}`,
        fullName: h.tryoutTitle,
        percentile: h.percentile,
        rank: h.rank,
        total: h.totalParticipants,
      }));
  }, [history]);

  const scoreChartConfig: ChartConfig = {
    actual: { label: 'Skor Aktual', color: mainColor },
    predicted: { label: 'WLS Regression', color: '#a855f7' },
    ema: { label: 'EMA Smoothed', color: '#f59e0b' },
  };

  const percentileChartConfig: ChartConfig = {
    percentile: { label: 'Persentil', color: '#22c55e' },
  };

  return (
    <>
      {/* Score trend chart */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4">
        <div className="mb-3">
          <h3 className="text-sm font-black text-slate-800">Tren Skor: Aktual vs Model</h3>
          <p className="text-xs text-slate-500">
            Area = skor aktual · Ungu = regresi WLS · Kuning = EMA · Titik terakhir = prediksi
          </p>
        </div>
        <ChartContainer config={scoreChartConfig} className="h-[260px] md:h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 10 }}>
              <defs>
                <linearGradient id="predScoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={mainColor} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={mainColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: '#6B7280' }}
                tickLine={false}
                axisLine={false}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={50}
              />
              <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false} width={45} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(_, payload) => {
                      const d = payload?.[0]?.payload as { fullName?: string };
                      return d?.fullName || '';
                    }}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="actual"
                stroke={mainColor}
                strokeWidth={2.5}
                fill="url(#predScoreGrad)"
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  if (payload.isPrediction || payload.actual == null) return <g key={`a-${cx}`} />;
                  return <circle key={`a-${cx}`} cx={cx} cy={cy} r={5} fill={mainColor} stroke="#fff" strokeWidth={2} />;
                }}
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="ema"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="3 3"
                dot={false}
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#a855f7"
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  if (!payload.isPrediction) return <g key={`p-${cx}`} />;
                  return <circle key={`p-${cx}`} cx={cx} cy={cy} r={8} fill="#a855f7" stroke="#fff" strokeWidth={3} />;
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Percentile chart */}
      {percentileData.length > 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-4">
          <div className="mb-3">
            <h3 className="text-sm font-black text-slate-800">Tren Peringkat (Persentil)</h3>
            <p className="text-xs text-slate-500">
              Persentil = posisi dibanding peserta lain. Semakin tinggi = semakin baik.
            </p>
          </div>
          <ChartContainer config={percentileChartConfig} className="h-[200px] md:h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={percentileData} margin={{ top: 20, right: 20, left: -10, bottom: 10 }}>
                <defs>
                  <linearGradient id="pctlGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6B7280' }} tickLine={false} axisLine={false} interval={0} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false} width={35} tickFormatter={(v) => `${v}%`} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(_, payload) => {
                        const d = payload?.[0]?.payload as { fullName?: string; rank?: number; total?: number };
                        return `${d?.fullName || ''} · #${d?.rank}/${d?.total}`;
                      }}
                      formatter={(value) => (
                        <>
                          <div className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-emerald-500" />
                          <span className="text-muted-foreground">Top</span>
                          <span className="ml-auto font-mono font-medium">{value}%</span>
                        </>
                      )}
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="percentile"
                  stroke="#22c55e"
                  strokeWidth={2.5}
                  fill="url(#pctlGrad)"
                  dot={{ fill: '#22c55e', r: 4, stroke: '#fff', strokeWidth: 2 }}
                >
                  <LabelList
                    position="top"
                    offset={8}
                    className="fill-emerald-700 font-bold text-[10px]"
                    formatter={(v: unknown) => `${Math.round(Number(v))}%`}
                  />
                </Area>
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 3: PER SUBTEST
// ═══════════════════════════════════════════════════════════════════════════════

function SubtestTab({
  perSubtest,
}: {
  perSubtest: NonNullable<PredictionResponse['perSubtest']>;
}) {
  const { mainColor, id: webSubId } = useWebsiteSubCategory();

  const radarData = useMemo(() => {
    return perSubtest.map((sub) => ({
      subject: getSubtestLabel(sub.name, webSubId),
      fullName: sub.name,
      current: Math.round(sub.currentAvg),
      predicted: sub.predicted,
    }));
  }, [perSubtest, webSubId]);

  if (perSubtest.length === 0) return null;

  return (
    <>
      {/* Radar chart */}
      {perSubtest.length >= 3 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-4">
          <div className="mb-3">
            <h3 className="text-sm font-black text-slate-800">Radar Kemampuan</h3>
            <p className="text-xs text-slate-500">Biru = rata-rata saat ini · Ungu = prediksi</p>
          </div>
          <div className="h-[280px] md:h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#374151', fontWeight: 700 }} />
                <PolarRadiusAxis tick={{ fontSize: 9, fill: '#9CA3AF' }} orientation="middle" angle={90} />
                <Radar name="Saat Ini" dataKey="current" stroke={mainColor} fill={mainColor} fillOpacity={0.2} strokeWidth={2} />
                <Radar name="Prediksi" dataKey="predicted" stroke="#a855f7" fill="#a855f7" fillOpacity={0.1} strokeWidth={2} strokeDasharray="4 4" />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Subtest detail cards */}
      <div>
        <h4 className="text-sm font-black text-slate-800 mb-2">Detail Per Subtes</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {perSubtest.map((sub, i) => {
            const color = SUB_COLORS[i % SUB_COLORS.length];
            const diff = sub.predicted - Math.round(sub.currentAvg);
            const isUp = diff > 0;

            return (
              <div
                key={sub.id}
                className="flex items-center gap-3 p-3 rounded-3xl border border-slate-200 bg-white hover:shadow-sm transition-shadow"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-black text-white"
                  style={{ backgroundColor: color }}
                >
                  {getSubtestLabel(sub.name, webSubId)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{sub.name}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-xs text-slate-500">{Math.round(sub.currentAvg)}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span className="text-xs font-bold text-violet-600">{sub.predicted}</span>
                    <span className={cn(
                      'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                      isUp ? 'text-emerald-700 bg-emerald-50' : diff < 0 ? 'text-red-600 bg-red-50' : 'text-slate-500 bg-slate-100',
                    )}>
                      {isUp ? '+' : ''}{Math.round(diff)}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-[10px] font-bold',
                      sub.strength === 'strong'
                        ? 'border-emerald-200 text-emerald-700 bg-emerald-50'
                        : sub.strength === 'weak'
                          ? 'border-red-200 text-red-600 bg-red-50'
                          : 'border-slate-200 text-slate-600 bg-slate-50',
                    )}
                  >
                    {sub.strength === 'strong' ? 'Kuat' : sub.strength === 'weak' ? 'Lemah' : 'Sedang'}
                  </Badge>
                  <div className="flex items-center gap-0.5 justify-end mt-1">
                    {sub.trend === 'improving' ? (
                      <ArrowUp className="w-3 h-3 text-emerald-500" />
                    ) : sub.trend === 'declining' ? (
                      <ArrowDown className="w-3 h-3 text-red-500" />
                    ) : (
                      <Minus className="w-3 h-3 text-slate-400" />
                    )}
                    <span className="text-[10px] text-slate-500">
                      {sub.slope > 0 ? '+' : ''}{sub.slope}/TO
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 4: EFFICIENCY
// ═══════════════════════════════════════════════════════════════════════════════

function EfficiencyTab({
  insights,
  bskTrend,
}: {
  insights: NonNullable<PredictionResponse['insights']>;
  bskTrend: NonNullable<PredictionResponse['bskTrend']>;
}) {
  const { mainColor } = useWebsiteSubCategory();

  const bskChartData = useMemo(() => {
    return bskTrend.map((d) => ({
      name: `TO-${d.index}`,
      benar: d.benar,
      salah: d.salah,
      kosong: d.kosong,
    }));
  }, [bskTrend]);

  const bskConfig: ChartConfig = {
    benar: { label: 'Benar', color: '#22c55e' },
    salah: { label: 'Salah', color: '#ef4444' },
    kosong: { label: 'Kosong', color: '#94a3b8' },
  };

  const latestBsk = bskTrend[bskTrend.length - 1];
  const firstBsk = bskTrend[0];
  const benarChange = latestBsk && firstBsk ? latestBsk.benar - firstBsk.benar : 0;
  const salahChange = latestBsk && firstBsk ? latestBsk.salah - firstBsk.salah : 0;
  const kosongChange = latestBsk && firstBsk ? latestBsk.kosong - firstBsk.kosong : 0;

  return (
    <>
      {/* Efficiency summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 text-center col-span-2 md:col-span-1">
          <div className="relative w-20 h-20 mx-auto mb-2">
            <svg viewBox="0 0 36 36" className="w-full h-full">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={mainColor}
                strokeWidth="3"
                strokeDasharray={`${insights.scoringEfficiency}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-black text-slate-800">{Math.round(insights.scoringEfficiency)}%</span>
            </div>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Efisiensi Jawab</p>
        </div>

        <ChangeCard
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          label="Benar"
          current={latestBsk?.benar ?? 0}
          change={benarChange}
          inverseGood={false}
        />
        <ChangeCard
          icon={<XCircle className="w-4 h-4 text-red-500" />}
          label="Salah"
          current={latestBsk?.salah ?? 0}
          change={salahChange}
          inverseGood
        />
        <ChangeCard
          icon={<Minus className="w-4 h-4 text-slate-400" />}
          label="Kosong"
          current={latestBsk?.kosong ?? 0}
          change={kosongChange}
          inverseGood
        />
      </div>

      {/* BSK Stacked bar chart */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4">
        <div className="mb-3">
          <h3 className="text-sm font-black text-slate-800">Tren Benar / Salah / Kosong</h3>
          <p className="text-xs text-slate-500">Distribusi jawaban per tryout. Idealnya hijau naik, merah &amp; abu turun.</p>
        </div>
        <ChartContainer config={bskConfig} className="h-[220px] md:h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bskChartData} margin={{ top: 10, right: 10, left: -10, bottom: 10 }} barCategoryGap="18%">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6B7280' }} tickLine={false} axisLine={false} interval={0} />
              <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false} width={35} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="benar" fill="#22c55e" radius={[3, 3, 0, 0]} stackId="bsk" />
              <Bar dataKey="salah" fill="#ef4444" radius={[0, 0, 0, 0]} stackId="bsk" />
              <Bar dataKey="kosong" fill="#94a3b8" radius={[3, 3, 0, 0]} stackId="bsk" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function SummaryCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <div className="mt-1 flex flex-col">{children}</div>
    </div>
  );
}

function InsightCard({
  title,
  value,
  subtitle,
  tone,
}: {
  title: string;
  value: string;
  subtitle: string;
  tone: 'emerald' | 'amber' | 'blue' | 'slate';
}) {
  const toneClass =
    tone === 'emerald' ? 'border-emerald-200 bg-emerald-50/60 text-emerald-900'
      : tone === 'amber' ? 'border-amber-200 bg-amber-50/60 text-amber-900'
        : tone === 'blue' ? 'border-blue-200 bg-blue-50/60 text-blue-900'
          : 'border-slate-200 bg-slate-50/60 text-slate-900';

  return (
    <div className={cn('rounded-3xl border p-4', toneClass)}>
      <p className="text-[10px] font-bold uppercase tracking-wide opacity-70">{title}</p>
      <p className="mt-1 text-xl font-black">{value}</p>
      <p className="mt-1 text-xs opacity-80">{subtitle}</p>
    </div>
  );
}

function ChangeCard({
  icon,
  label,
  current,
  change,
  inverseGood,
}: {
  icon: React.ReactNode;
  label: string;
  current: number;
  change: number;
  inverseGood: boolean;
}) {
  const isGood = inverseGood ? change <= 0 : change >= 0;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-[10px] font-bold text-slate-500 uppercase">{label}</span>
      </div>
      <div className="text-2xl font-black text-slate-800">{current}</div>
      <div className="flex items-center gap-1 mt-1">
        {change !== 0 ? (
          <>
            {isGood ? <ArrowUp className="w-3 h-3 text-emerald-500" /> : <ArrowDown className="w-3 h-3 text-red-500" />}
            <span className={cn('text-[10px] font-bold', isGood ? 'text-emerald-600' : 'text-red-500')}>
              {change > 0 ? '+' : ''}{change} vs awal
            </span>
          </>
        ) : (
          <span className="text-[10px] text-slate-400">Tidak berubah</span>
        )}
      </div>
    </div>
  );
}

// ─── Loading State ────────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <div>
      <SectionTitle icon={Brain} title="Prediksi Skor" />
      <Skeleton className="h-[640px] w-full rounded-3xl" />
    </div>
  );
}
