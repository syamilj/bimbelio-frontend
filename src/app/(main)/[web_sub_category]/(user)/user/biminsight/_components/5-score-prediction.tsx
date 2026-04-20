'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { useGet } from '@/lib/fetch-helper/useGet';
import { cn } from '@/lib/utils';
import { getSubtestLabel } from '@/lib/utils/subtest';
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Brain,
  CheckCircle2,
  Minus,
  Rocket,
  XCircle,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import {
  Area,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Label,
  LabelList,
  Line,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ChangeCard,
  InsightBanner,
  InsightCard,
  ScrollRow,
  SectionLabel,
} from './_primitives';

// --- Types -------------------------------------------------------------------

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
    strongestSubtest: {
      name: string;
      avgScore: number;
      initial: string;
    } | null;
    weakestSubtest: {
      name: string;
      avgScore: number;
      initial: string;
    } | null;
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

// --- Strength palette --------------------------------------------------------

const STRENGTH = {
  strong: {
    label: 'Kuat',
    color: '#22c55e',
    badge: 'border-emerald-200 text-emerald-700 bg-emerald-50',
  },
  moderate: {
    label: 'Sedang',
    color: '#f59e0b',
    badge: 'border-amber-200 text-amber-700 bg-amber-50',
  },
  weak: {
    label: 'Lemah',
    color: '#ef4444',
    badge: 'border-red-200 text-red-600 bg-red-50',
  },
} as const;

const SUB_COLORS = [
  '#0091FF',
  '#22c55e',
  '#eab308',
  '#ef4444',
  '#6366f1',
  '#a855f7',
  '#f97316',
  '#14b8a6',
];

// --- Main export -------------------------------------------------------------

export const ScorePrediction = () => {
  const { id } = useParams<{ id: string | undefined }>();

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
        <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 mb-4">
              <Brain className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-1">
              Data Belum Cukup
            </h3>
            <p className="text-sm text-slate-500 max-w-md">
              Dibutuhkan minimal {data.minimumRequired ?? 2} tryout untuk
              prediksi. Saat ini baru {data.totalTryouts ?? 0} tryout selesai.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-full max-w-[200px] bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-violet-500 rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, ((data.totalTryouts ?? 0) / (data.minimumRequired ?? 2)) * 100)}%`,
                  }}
                />
              </div>
              <span className="text-xs font-bold text-slate-500">
                {data.totalTryouts ?? 0}/{data.minimumRequired ?? 2}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <PredictionCard data={data} />;
};

// =============================================================================
// PredictionCard --- single scrollable flow (no tabs)
// =============================================================================

function PredictionCard({ data }: { data: PredictionResponse }) {
  const { mainColor } = useWebsiteSubCategory();
  const p = data.prediction!;
  const ins = data.insights!;

  return (
    <div>
      <div className="rounded-3xl border border-slate-200/60 bg-white shadow-xl shadow-slate-200/20 overflow-hidden mb-4">
        <div className="space-y-5 px-5 py-5 md:px-7 md:py-6">
          {/* Insight */}
          <InsightBanner
            tone={
              p.trend === 'improving'
                ? 'success'
                : p.trend === 'declining'
                  ? 'warning'
                  : 'info'
            }
          >
            {`Prediksi skor ${p.nextScore.toFixed(0)} (interval ${p.confidence.low.toFixed(0)}–${p.confidence.high.toFixed(0)}) dengan tren ${
              p.trend === 'improving'
                ? 'naik — momentum belajarmu sedang bagus!'
                : p.trend === 'declining'
                  ? 'menurun — perlu strategi baru.'
                  : 'stabil — tetap konsisten untuk peningkatan.'
            }`}
          </InsightBanner>

          {/* -- 2. Score trend chart -- */}
          {data.history && data.history.length > 0 && (
            <ScoreTrendChart
              history={data.history}
              projections={data.projections}
              mainColor={mainColor}
            />
          )}

          {/* -- 3. Projections -- */}
          {data.projections && data.projections.length > 0 && (
            <ProjectionsRow projections={data.projections} />
          )}

          {/* -- 4. Insights grid -- */}
          <InsightsGrid
            prediction={p}
            insights={ins}
          />

          {/* -- 5. Per subtest -- */}
          {data.perSubtest && data.perSubtest.length > 0 && (
            <SubtestSection
              perSubtest={data.perSubtest}
              mainColor={mainColor}
            />
          )}

          {/* -- 6. Efficiency -- */}
          {data.bskTrend && data.bskTrend.length > 0 && (
            <EfficiencySection
              insights={ins}
              bskTrend={data.bskTrend}
              mainColor={mainColor}
            />
          )}

          {/* -- 7. Percentile chart -- */}
          {data.history && <PercentileChart history={data.history} />}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// 2. Score trend chart
// =============================================================================

function ScoreTrendChart({
  history,
  mainColor,
  projections,
}: {
  history: NonNullable<PredictionResponse['history']>;
  mainColor: string;
  projections?: PredictionResponse['projections'];
}) {
  const chartData = useMemo(() => {
    const projEma =
      projections && projections.length > 0 ? projections[0].ema : null;

    return history.map((h) => ({
      name: h.actual == null ? 'Prediksi' : `TO-${h.index}`,
      fullName: h.tryoutTitle,
      actual: h.actual,
      predicted: h.predicted,
      ema: h.ema ?? (h.actual == null ? (projEma ?? h.predicted) : null),
      isPrediction: h.actual == null,
    }));
  }, [history, projections]);

  const chartConfig: ChartConfig = {
    actual: { label: 'Skor Aktual', color: mainColor },
    predicted: { label: 'Prediksi V1', color: '#a855f7' },
    ema: { label: 'Prediksi V2', color: '#f59e0b' },
  };

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-4">
      <SectionLabel
        title="Tren Skor: Aktual vs Model"
        sub="Area = skor aktual · Ungu = proyeksi tren belajar"
      />
      <ChartContainer
        config={chartConfig}
        className="h-[260px] md:h-[320px] w-full mt-5"
      >
        <ComposedChart
          data={chartData}
          margin={{ top: 15, right: 45, left: -15, bottom: 0 }}
        >
          <defs>
            <linearGradient
              id="predScoreGrad"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor={mainColor}
                stopOpacity={0.25}
              />
              <stop
                offset="95%"
                stopColor={mainColor}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f1f5f9"
          />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            interval={0}
            angle={-30}
            textAnchor="end"
            height={40}
          />
          <YAxis
            domain={['dataMin - 50', 'dataMax + 50']}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            width={35}
          />
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
              if (payload.isPrediction || payload.actual == null)
                return <g key={`a-${cx}`} />;
              return (
                <circle
                  key={`a-${cx}`}
                  cx={cx}
                  cy={cy}
                  r={5}
                  fill={mainColor}
                  stroke="#fff"
                  strokeWidth={2}
                />
              );
            }}
            connectNulls={false}
          >
            <LabelList
              position="top"
              offset={10}
              className="fill-slate-700 font-bold text-[10px]"
              formatter={(v: unknown) =>
                v != null ? String(Math.round(Number(v))) : ''
              }
            />
          </Area>
          <Line
            type="monotone"
            dataKey="ema"
            stroke="#f59e0b"
            strokeWidth={2}
            strokeDasharray="3 3"
            connectNulls={false}
            dot={(props: any) => {
              const { cx, cy, payload } = props;
              if (!payload.isPrediction || payload.ema == null)
                return <g key={`e-${cx}`} />;
              const pVal = Math.round(payload.ema);
              return (
                <g
                  key={`e-${cx}`}
                  className="overflow-visible"
                >
                  {/* Glowing/pulsing ring */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={6}
                    fill="#f59e0b"
                    stroke="none"
                  >
                    <animate
                      attributeName="r"
                      values="6;20"
                      dur="2.2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.6;0"
                      dur="2.2s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  {/* Solid inner dot */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={6}
                    fill="#f59e0b"
                    stroke="#fff"
                    strokeWidth={2}
                  />

                  {/* Floating animated badge below the dot (to avoid overlapping WLS) */}
                  <g>
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="0,0; 0,4; 0,0"
                      dur="2.2s"
                      repeatCount="indefinite"
                    />
                    {/* Tail pointing up */}
                    <path
                      d={`M${cx - 6} ${cy + 12} L${cx + 6} ${cy + 12} L${cx} ${cy + 5} Z`}
                      fill="#d97706"
                    />
                    {/* Tooltip box */}
                    <rect
                      x={cx - 30}
                      y={cy + 12}
                      width={60}
                      height={24}
                      rx={12}
                      fill="#d97706"
                      className="drop-shadow-md"
                    />
                    {/* Text value */}
                    <text
                      x={cx}
                      y={cy + 28}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="11"
                      fontWeight="900"
                      className="drop-shadow-sm"
                    >
                      ✨ {pVal}
                    </text>
                  </g>
                </g>
              );
            }}
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
              const pVal = Math.round(payload.predicted);
              return (
                <g
                  key={`p-${cx}`}
                  className="overflow-visible"
                >
                  {/* Glowing/pulsing ring */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={6}
                    fill="#a855f7"
                    stroke="none"
                  >
                    <animate
                      attributeName="r"
                      values="6;20"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.6;0"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  {/* Solid inner dot */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={6}
                    fill="#a855f7"
                    stroke="#fff"
                    strokeWidth={2}
                  />

                  {/* Floating animated badge above the dot */}
                  <g>
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="0,0; 0,-4; 0,0"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    {/* Tail of the tooltip */}
                    <path
                      d={`M${cx - 6} ${cy - 12} L${cx + 6} ${cy - 12} L${cx} ${cy - 5} Z`}
                      fill="#9333ea"
                    />
                    {/* Tooltip box */}
                    <rect
                      x={cx - 30}
                      y={cy - 36}
                      width={60}
                      height={24}
                      rx={12}
                      fill="#9333ea"
                      className="drop-shadow-md"
                    />
                    {/* Text value */}
                    <text
                      x={cx}
                      y={cy - 19}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="11"
                      fontWeight="900"
                      className="drop-shadow-sm"
                    >
                      🎯 {pVal}
                    </text>
                  </g>
                </g>
              );
            }}
          />
        </ComposedChart>
      </ChartContainer>
    </div>
  );
}

// =============================================================================
// 3. Projections row
// =============================================================================

function ProjectionsRow({
  projections,
}: {
  projections: NonNullable<PredictionResponse['projections']>;
}) {
  return (
    <div>
      <SectionLabel title="Proyeksi Skor" />
      <ScrollRow className="mt-3">
        {projections.map((proj) => {
          return (
            <div
              key={proj.stepsAhead}
              className="rounded-3xl p-4 bg-white border border-slate-200 shadow-sm"
            >
              <div className="w-7 h-7 rounded-3xl bg-purple-500 text-white flex items-center justify-center mb-2">
                <Rocket className="w-3.5 h-3.5" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {proj.stepsAhead === 1
                  ? 'TO Berikutnya'
                  : `${proj.stepsAhead} TO Lagi`}
              </p>
              <p className="text-2xl font-black text-slate-800">
                {proj.blended}
              </p>
              <div className="mt-1 flex gap-2">
                <span className="text-[10px] text-slate-500">
                  WLS: {proj.wls}
                </span>
                <span className="text-[10px] text-slate-500">
                  EMA: {proj.ema}
                </span>
              </div>
            </div>
          );
        })}
      </ScrollRow>
    </div>
  );
}

// =============================================================================
// 4. Insights grid
// =============================================================================

function InsightsGrid({
  prediction: p,
  insights: ins,
}: {
  prediction: NonNullable<PredictionResponse['prediction']>;
  insights: NonNullable<PredictionResponse['insights']>;
}) {
  const momentumLabel =
    p.momentum > 3
      ? 'Kuat Naik'
      : p.momentum > 0
        ? 'Naik Perlahan'
        : p.momentum < -3
          ? 'Turun Tajam'
          : p.momentum < 0
            ? 'Sedikit Turun'
            : 'Netral';

  const insights: {
    title: string;
    value: string;
    sub: string;
    tone: 'emerald' | 'amber' | 'blue' | 'slate';
  }[] = [
    {
      title: 'Momentum',
      value: momentumLabel,
      sub: `${p.momentum > 0 ? '+' : ''}${p.momentum} poin/TO (3 terakhir)`,
      tone: p.momentum > 0 ? 'emerald' : p.momentum < 0 ? 'amber' : 'slate',
    },
    {
      title: 'Pertumbuhan',
      value: `${ins.growthPercent > 0 ? '+' : ''}${ins.growthPercent}%`,
      sub: 'Paruh akhir vs paruh awal',
      tone: ins.growthPercent >= 0 ? 'emerald' : 'amber',
    },
    {
      title: 'Konsistensi',
      value:
        ins.consistency < 10
          ? 'Sangat Konsisten'
          : ins.consistency < 20
            ? 'Cukup Konsisten'
            : 'Berfluktuasi',
      sub: `CV = ${ins.consistency}%`,
      tone: ins.consistency < 20 ? 'emerald' : 'amber',
    },
    {
      title: 'Performa Terbaik',
      value: `${Math.round(ins.bestPerformance.score)}`,
      sub: ins.bestPerformance.title,
      tone: 'emerald',
    },
    {
      title: 'Performa Terendah',
      value: `${Math.round(ins.worstPerformance.score)}`,
      sub: ins.worstPerformance.title,
      tone: 'amber',
    },
  ];

  if (ins.projectedMilestone) {
    insights.push({
      title: `Target Skor ${ins.projectedMilestone.target}`,
      value: `~${ins.projectedMilestone.triesNeeded} TO lagi`,
      sub: `Dengan tren +${ins.learningVelocity}/TO`,
      tone: 'blue',
    });
  }
  if (ins.strongestSubtest) {
    insights.push({
      title: 'Subtes Terkuat',
      value: ins.strongestSubtest.name,
      sub: `Rata-rata: ${Math.round(ins.strongestSubtest.avgScore)}`,
      tone: 'emerald',
    });
  }
  if (ins.weakestSubtest) {
    insights.push({
      title: 'Perlu Ditingkatkan',
      value: ins.weakestSubtest.name,
      sub: `Rata-rata: ${Math.round(ins.weakestSubtest.avgScore)}`,
      tone: 'amber',
    });
  }

  return (
    <div>
      <SectionLabel title="Insight" />
      <ScrollRow
        className="mt-3"
        cols={3}
      >
        {insights.map((item) => (
          <div
            key={item.title}
            className="w-[200px] flex-shrink-0 md:w-auto"
          >
            <InsightCard {...item} />
          </div>
        ))}
      </ScrollRow>
    </div>
  );
}

// =============================================================================
// 5. Per subtest section
// =============================================================================

function SubtestSection({
  perSubtest,
  mainColor,
}: {
  perSubtest: NonNullable<PredictionResponse['perSubtest']>;
  mainColor: string;
}) {
  const { id: webSubId } = useWebsiteSubCategory();

  const radarData = useMemo(
    () =>
      perSubtest.map((sub) => ({
        subject: getSubtestLabel(sub.name, webSubId),
        fullName: sub.name,
        current: Math.round(sub.currentAvg),
        predicted: sub.predicted,
      })),
    [perSubtest, webSubId],
  );

  const radarConfig: ChartConfig = {
    current: { label: 'Saat Ini', color: mainColor },
    predicted: { label: 'Prediksi', color: '#a855f7' },
  };

  return (
    <div className="space-y-4">
      {/* Radar chart */}
      {perSubtest.length >= 3 && (
        <div className="rounded-3xl border border-slate-100 bg-white p-4">
          <SectionLabel
            title="Radar Kemampuan"
            sub="Area Biru = Rata-rata skor saat ini · Garis Ungu = Proyeksi ke depan"
          />
          <ChartContainer
            config={radarConfig}
            className="h-[280px] md:h-[340px] w-full mt-2"
          >
            <RadarChart
              data={radarData}
              cx="50%"
              cy="50%"
              outerRadius="70%"
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fontSize: 11, fill: '#374151', fontWeight: 700 }}
              />
              <PolarRadiusAxis
                tick={{ fontSize: 9, fill: '#9CA3AF' }}
                orientation="middle"
                angle={90}
              />
              <Radar
                name="Saat Ini"
                dataKey="current"
                stroke={mainColor}
                fill={mainColor}
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Radar
                name="Prediksi"
                dataKey="predicted"
                stroke="#a855f7"
                fill="#a855f7"
                fillOpacity={0.1}
                strokeWidth={2}
                strokeDasharray="4 4"
              />
            </RadarChart>
          </ChartContainer>
        </div>
      )}

      {/* Subtest detail cards */}
      <div>
        <SectionLabel title="Detail Per Subtes" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
          {perSubtest.map((sub, i) => (
            <SubtestCard
              key={sub.id}
              sub={sub}
              color={SUB_COLORS[i % SUB_COLORS.length]}
              webSubId={webSubId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SubtestCard({
  sub,
  color,
  webSubId,
}: {
  sub: SubtestData;
  color: string;
  webSubId: string | undefined;
}) {
  const diff = sub.predicted - Math.round(sub.currentAvg);
  const isUp = diff > 0;
  const s = STRENGTH[sub.strength];

  return (
    <div className="flex flex-col gap-3 p-4 rounded-3xl border border-slate-100 bg-white hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-2xl flex-shrink-0 text-[10px] font-black text-white"
          style={{ backgroundColor: color }}
        >
          {getSubtestLabel(sub.name, webSubId)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800 leading-tight">
            {sub.name}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <Badge
              variant="outline"
              className={cn(
                'text-[9px] px-1.5 py-0 uppercase tracking-widest',
                s.badge,
              )}
            >
              {s.label}
            </Badge>
            <div className="flex items-center gap-0.5 text-slate-500">
              {sub.trend === 'improving' ? (
                <ArrowUp className="w-3 h-3 text-emerald-500" />
              ) : sub.trend === 'declining' ? (
                <ArrowDown className="w-3 h-3 text-red-500" />
              ) : (
                <Minus className="w-3 h-3 text-slate-400" />
              )}
              <span className="text-[10px] font-medium">
                {sub.slope > 0 ? '+' : ''}
                {sub.slope % 1 === 0 ? sub.slope : sub.slope.toFixed(1)} Poin/TO
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center bg-slate-50/70 p-2.5 rounded-2xl gap-3">
        <div className="flex-1">
          <p className="text-[10px] font-bold text-slate-400 mb-0.5 uppercase tracking-wider">
            Rata-rata
          </p>
          <p className="text-base font-bold text-slate-700">
            {Math.round(sub.currentAvg)}
          </p>
        </div>
        <div className="flex items-center justify-center text-slate-300">
          <ArrowRight className="w-4 h-4" />
        </div>
        <div className="flex-1 text-right">
          <p className="text-[10px] font-bold text-violet-500/70 mb-0.5 uppercase tracking-wider">
            Prediksi
          </p>
          <div className="flex items-center justify-end gap-1.5">
            <span className="text-base font-black text-violet-600">
              {sub.predicted}
            </span>
            <span
              className={cn(
                'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                isUp
                  ? 'text-emerald-700 bg-emerald-100/50'
                  : diff < 0
                    ? 'text-red-700 bg-red-100/50'
                    : 'text-slate-500 bg-slate-200/50',
              )}
            >
              {isUp ? '+' : ''}
              {Math.round(diff)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// 6. Efficiency section
// =============================================================================

function EfficiencySection({
  insights,
  bskTrend,
  mainColor,
}: {
  insights: NonNullable<PredictionResponse['insights']>;
  bskTrend: NonNullable<PredictionResponse['bskTrend']>;
  mainColor: string;
}) {
  const bskChartData = useMemo(
    () =>
      bskTrend.map((d) => ({
        name: `TO-${d.index}`,
        benar: d.benar,
        salah: d.salah,
        kosong: d.kosong,
        benarLine: d.benar,
      })),
    [bskTrend],
  );

  const bskConfig: ChartConfig = {
    benar: { label: 'Benar', color: '#22c55e' },
    salah: { label: 'Salah', color: '#ef4444' },
    kosong: { label: 'Kosong', color: '#94a3b8' },
  };

  const latestBsk = bskTrend[bskTrend.length - 1];
  const firstBsk = bskTrend[0];
  const benarChange =
    latestBsk && firstBsk ? latestBsk.benar - firstBsk.benar : 0;
  const salahChange =
    latestBsk && firstBsk ? latestBsk.salah - firstBsk.salah : 0;
  const kosongChange =
    latestBsk && firstBsk ? latestBsk.kosong - firstBsk.kosong : 0;

  // Efficiency gauge data
  const effData = useMemo(
    () => [
      {
        name: 'filled',
        value: insights.scoringEfficiency,
        fill: mainColor,
      },
      {
        name: 'empty',
        value: 100 - insights.scoringEfficiency,
        fill: '#e2e8f0',
      },
    ],
    [insights.scoringEfficiency, mainColor],
  );

  const effConfig: ChartConfig = {
    filled: { label: 'Efisiensi', color: mainColor },
    empty: { label: '', color: '#e2e8f0' },
  };

  return (
    <div className="rounded-[1.5rem] border border-slate-100 bg-white p-4 space-y-5">
      <SectionLabel title="Efisiensi Jawab" />

      {/* Efficiency gauge + change cards */}
      <ScrollRow
        cols={4}
        className="mt-4"
      >
        {/* Gauge Card */}
        <div className="w-[150px] md:w-auto rounded-3xl border border-slate-100 bg-white shadow-sm p-4 shrink-0 flex flex-col items-center justify-center">
          <ChartContainer
            config={effConfig}
            className="h-[80px] w-[80px] drop-shadow-sm mb-1"
          >
            <PieChart>
              <Pie
                data={effData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={28}
                outerRadius={40}
                startAngle={90}
                endAngle={-270}
                paddingAngle={0}
                stroke="none"
              >
                {effData.map((d, i) => (
                  <Cell
                    key={i}
                    fill={d.fill}
                  />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            className="fill-slate-800 text-lg font-black tracking-tight"
                            dy="2"
                          >
                            {Math.round(insights.scoringEfficiency)}%
                          </tspan>
                        </text>
                      );
                    }
                    return null;
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-2">
            Efisiensi
          </p>
        </div>

        <div className="w-[150px] md:w-auto h-full [&>div]:h-full">
          <ChangeCard
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            label="BENAR"
            current={latestBsk?.benar ?? 0}
            change={benarChange}
            inverseGood={false}
          />
        </div>
        <div className="w-[150px] md:w-auto h-full [&>div]:h-full">
          <ChangeCard
            icon={<XCircle className="w-5 h-5 text-red-500" />}
            label="SALAH"
            current={latestBsk?.salah ?? 0}
            change={salahChange}
            inverseGood
          />
        </div>
        <div className="w-[150px] md:w-auto h-full [&>div]:h-full">
          <ChangeCard
            icon={
              <div className="w-4 h-4 rounded-full border-[2.5px] border-slate-300" />
            }
            label="KOSONG"
            current={latestBsk?.kosong ?? 0}
            change={kosongChange}
            inverseGood
          />
        </div>
      </ScrollRow>

      {/* BSK stacked bar chart */}
      <div className="rounded-3xl border border-slate-100 bg-white p-4">
        <SectionLabel
          title="Tren Benar / Salah / Kosong"
          sub="Distribusi jawaban per tryout. Idealnya hijau naik, merah & abu turun."
        />
        <ChartContainer
          config={bskConfig}
          className="h-[220px] md:h-[280px] w-full mt-3"
        >
          <ComposedChart
            data={bskChartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
            barCategoryGap="18%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="benar"
              fill="#22c55e"
              radius={[3, 3, 0, 0]}
              stackId="bsk"
            >
              <LabelList
                position="center"
                className="fill-white font-bold text-[9px]"
                formatter={(v: unknown) => (Number(v) > 0 ? String(v) : '')}
              />
            </Bar>
            <Bar
              dataKey="salah"
              fill="#ef4444"
              radius={[0, 0, 0, 0]}
              stackId="bsk"
            >
              <LabelList
                position="center"
                className="fill-white font-bold text-[9px]"
                formatter={(v: unknown) => (Number(v) > 0 ? String(v) : '')}
              />
            </Bar>
            <Bar
              dataKey="kosong"
              fill="#94a3b8"
              radius={[3, 3, 0, 0]}
              stackId="bsk"
            >
              <LabelList
                position="center"
                className="fill-white font-bold text-[9px]"
                formatter={(v: unknown) => (Number(v) > 0 ? String(v) : '')}
              />
            </Bar>
            <Line
              type="monotone"
              dataKey="benarLine"
              stroke="#16a34a"
              strokeWidth={2}
              dot={{ r: 3, fill: '#16a34a', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 5 }}
              tooltipType="none"
            />
          </ComposedChart>
        </ChartContainer>
      </div>
    </div>
  );
}

// =============================================================================
// 7. Percentile chart
// =============================================================================

function PercentileChart({
  history,
}: {
  history: NonNullable<PredictionResponse['history']>;
}) {
  const percentileData = useMemo(
    () =>
      history
        .filter((h) => h.percentile != null && h.actual != null)
        .map((h) => ({
          name: `TO-${h.index}`,
          fullName: h.tryoutTitle,
          percentile: h.percentile,
          rank: h.rank,
          total: h.totalParticipants,
          rankLabel: `#${h.rank}/${h.totalParticipants}`,
        })),
    [history],
  );

  if (percentileData.length === 0) return null;

  const chartConfig: ChartConfig = {
    percentile: { label: 'Persentil', color: '#22c55e' },
    rank: { label: 'Peringkat', color: '#6366f1' },
  };

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-4">
      <SectionLabel
        title="Tren Peringkat (Persentil)"
        sub="Persentil = posisi dibanding peserta lain. Semakin tinggi = semakin baik."
      />
      <ChartContainer
        config={chartConfig}
        className="h-[200px] md:h-[260px] w-full mt-3"
      >
        <ComposedChart
          data={percentileData}
          margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient
              id="pctlGrad"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="#22c55e"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="#22c55e"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f1f5f9"
          />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            interval={0}
          />
          <YAxis
            yAxisId="left"
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            width={35}
            tickFormatter={(v) => `${v}%`}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={['dataMin', 'dataMax']}
            reversed={true}
            tick={{ fontSize: 10, fill: '#a5b4fc' }}
            tickLine={false}
            axisLine={false}
            width={24}
            tickFormatter={(v) => `#${v}`}
            allowDecimals={false}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(_, payload) => {
                  const d = payload?.[0]?.payload as {
                    fullName?: string;
                    rank?: number;
                    total?: number;
                  };
                  return `${d?.fullName || ''} · #${d?.rank}/${d?.total}`;
                }}
                formatter={(value, name) => {
                  if (name === 'rank') {
                    const entry = percentileData.find((d) => d.rank === value);
                    return (
                      <>
                        <div className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-indigo-500" />
                        <span className="text-muted-foreground">Peringkat</span>
                        <span className="ml-auto font-mono font-medium">
                          #{value}/{entry?.total}
                        </span>
                      </>
                    );
                  }
                  return (
                    <>
                      <div className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-emerald-500" />
                      <span className="text-muted-foreground">Top</span>
                      <span className="ml-auto font-mono font-medium">
                        {value}%
                      </span>
                    </>
                  );
                }}
              />
            }
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="percentile"
            stroke="#22c55e"
            strokeWidth={2.5}
            fill="url(#pctlGrad)"
            dot={{
              fill: '#22c55e',
              r: 4,
              stroke: '#fff',
              strokeWidth: 2,
            }}
          >
            <LabelList
              position="top"
              offset={8}
              className="fill-emerald-700 font-bold text-[10px]"
              formatter={(v: unknown) => `${Math.round(Number(v))}%`}
            />
          </Area>
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="rank"
            stroke="#6366f1"
            strokeWidth={2}
            strokeDasharray="5 3"
            dot={{
              fill: '#6366f1',
              r: 3.5,
              stroke: '#fff',
              strokeWidth: 2,
            }}
          >
            <LabelList
              dataKey="rankLabel"
              position="bottom"
              offset={8}
              className="fill-indigo-600 font-bold text-[10px]"
            />
          </Line>
        </ComposedChart>
      </ChartContainer>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-3">
      <div className="space-y-4">
        <Skeleton className="h-[180px] w-full rounded-3xl" />
        <Skeleton className="h-[320px] w-full rounded-3xl" />
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="h-[100px] rounded-3xl" />
          <Skeleton className="h-[100px] rounded-3xl" />
          <Skeleton className="h-[100px] rounded-3xl" />
        </div>
        <Skeleton className="h-[260px] w-full rounded-3xl" />
      </div>
    </div>
  );
}
