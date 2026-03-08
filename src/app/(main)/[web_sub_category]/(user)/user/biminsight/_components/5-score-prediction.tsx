"use client";

import { useWebsiteSubCategory } from "@/components/provider/provider-website-category";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useGet } from "@/lib/fetch-helper/useGet";
import { cn } from "@/lib/utils";
import { getSubtestLabel } from "@/lib/utils/subtest";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Brain,
  CheckCircle2,
  Gauge,
  Minus,
  Rocket,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
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
} from "recharts";
import {
  ChangeCard,
  InsightCard,
  ScrollRow,
  SectionLabel,
  StatPill,
} from "./_primitives";


// --- Types -------------------------------------------------------------------

interface SubtestData {
  id: string;
  name: string;
  initial: string;
  currentAvg: number;
  recentAvg: number;
  latestScore: number;
  predicted: number;
  trend: "improving" | "declining" | "stable";
  slope: number;
  strength: "strong" | "moderate" | "weak";
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
    trend: "improving" | "declining" | "stable";
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
    label: "Kuat",
    color: "#22c55e",
    badge: "border-emerald-200 text-emerald-700 bg-emerald-50",
  },
  moderate: {
    label: "Sedang",
    color: "#f59e0b",
    badge: "border-amber-200 text-amber-700 bg-amber-50",
  },
  weak: {
    label: "Lemah",
    color: "#ef4444",
    badge: "border-red-200 text-red-600 bg-red-50",
  },
} as const;

const SUB_COLORS = [
  "#0091FF",
  "#22c55e",
  "#eab308",
  "#ef4444",
  "#6366f1",
  "#a855f7",
  "#f97316",
  "#14b8a6",
];

// --- Main export -------------------------------------------------------------

export const ScorePrediction = () => {
  const { id } = useParams<{ id: string | undefined }>();

  const { data, isLoading } = useGet<PredictionResponse>(
    "/learningAnalytics/getScorePrediction",
    {
      params: { userId: id ? id : undefined },
      useEffectDependencies: [id],
    },
  );

  if (isLoading) return <LoadingState />;
  if (!data) return null;

  if (data.insufficient) {
    return (
      <div className="space-y-3">
        <Card className="w-full border-0 shadow-lg shadow-slate-200/60">
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
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
          </CardContent>
        </Card>
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

  const scoreDiff = p.nextScore - Math.round(ins.latestScore);

  return (
    <div className="space-y-3">
      <Card className="w-full overflow-hidden border-0 shadow-lg shadow-slate-200/60">
        {/* -- 1. Hero banner -- */}
        <HeroBanner prediction={p} insights={ins} mainColor={mainColor} />

        <CardContent className="space-y-5 px-5 py-5">
          {/* -- 2. Score trend chart -- */}
          {data.history && data.history.length > 0 && (
            <ScoreTrendChart history={data.history} mainColor={mainColor} />
          )}

          {/* -- 3. Projections -- */}
          {data.projections && data.projections.length > 0 && (
            <ProjectionsRow projections={data.projections} />
          )}

          {/* -- 4. Insights grid -- */}
          <InsightsGrid prediction={p} insights={ins} />

          {/* -- 5. Per subtest -- */}
          {data.perSubtest && data.perSubtest.length > 0 && (
            <SubtestSection perSubtest={data.perSubtest} mainColor={mainColor} />
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
          {data.history && (
            <PercentileChart history={data.history} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// =============================================================================
// 1. Hero Banner
// =============================================================================

function HeroBanner({
  prediction: p,
  insights: ins,
  mainColor,
}: {
  prediction: NonNullable<PredictionResponse["prediction"]>;
  insights: NonNullable<PredictionResponse["insights"]>;
  mainColor: string;
}) {
  const scoreDiff = p.nextScore - Math.round(ins.latestScore);
  const trendLabel =
    p.trend === "improving"
      ? "Meningkat"
      : p.trend === "declining"
        ? "Menurun"
        : "Stabil";

  const gaugeData = useMemo(
    () => [
      { name: "score", value: Math.min(p.nextScore, 1000), fill: mainColor },
      {
        name: "remaining",
        value: Math.max(0, 1000 - p.nextScore),
        fill: "#e2e8f0",
      },
    ],
    [p.nextScore, mainColor],
  );

  const gaugeConfig: ChartConfig = {
    score: { label: "Prediksi", color: mainColor },
    remaining: { label: "", color: "#e2e8f0" },
  };

  return (
    <div
      className="px-5 pt-6 pb-5"
      style={{
        background: `linear-gradient(135deg, ${mainColor}08 0%, ${mainColor}18 100%)`,
      }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        {/* Score gauge */}
        <div className="flex-shrink-0">
          <ChartContainer
            config={gaugeConfig}
            className="h-[120px] w-[120px]"
          >
            <PieChart>
              <Pie
                data={gaugeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={54}
                startAngle={90}
                endAngle={-270}
                paddingAngle={0}
                stroke="none"
              >
                {gaugeData.map((d, i) => (
                  <Cell key={i} fill={d.fill} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 4}
                            className="fill-slate-800 text-xl font-black"
                          >
                            {p.nextScore}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 14}
                            className="fill-slate-400 text-[9px] font-semibold uppercase tracking-wider"
                          >
                            Prediksi
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
        </div>

        {/* Stat pills */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2.5 w-full">
          <StatPill
            label="Skor Terakhir"
            value={`${Math.round(ins.latestScore)}`}
            sub={`Rata-rata: ${ins.averageScore}`}
            icon={<Target className="w-3.5 h-3.5" />}
            color="#64748b"
          />
          <StatPill
            label="Tren"
            value={trendLabel}
            sub={`${scoreDiff > 0 ? "+" : ""}${scoreDiff} poin`}
            icon={
              p.trend === "improving" ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : p.trend === "declining" ? (
                <TrendingDown className="w-3.5 h-3.5" />
              ) : (
                <Minus className="w-3.5 h-3.5" />
              )
            }
            color={
              p.trend === "improving"
                ? "#22c55e"
                : p.trend === "declining"
                  ? "#ef4444"
                  : "#64748b"
            }
          />
          <StatPill
            label="Confidence 80%"
            value={`${p.confidence.low}\u2013${p.confidence.high}`}
            sub={`MAE: \u00b1${p.mae}`}
            icon={<Gauge className="w-3.5 h-3.5" />}
            color={mainColor}
          />
          <StatPill
            label="Total Tryout"
            value={`${ins.totalTryouts}`}
            sub={`R\u00b2 ${p.rSquared}%`}
            icon={<Zap className="w-3.5 h-3.5" />}
            color="#6366f1"
          />
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
}: {
  history: NonNullable<PredictionResponse["history"]>;
  mainColor: string;
}) {
  const chartData = useMemo(
    () =>
      history.map((h) => ({
        name: h.actual == null ? "Prediksi" : `TO-${h.index}`,
        fullName: h.tryoutTitle,
        actual: h.actual,
        predicted: h.predicted,
        ema: h.ema,
        isPrediction: h.actual == null,
      })),
    [history],
  );

  const chartConfig: ChartConfig = {
    actual: { label: "Skor Aktual", color: mainColor },
    predicted: { label: "WLS Regression", color: "#a855f7" },
    ema: { label: "EMA Smoothed", color: "#f59e0b" },
  };

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-4">
      <SectionLabel
        title="Tren Skor: Aktual vs Model"
        sub="Area = skor aktual · Ungu = regresi WLS · Kuning = EMA · Titik terakhir = prediksi"
      />
      <ChartContainer
        config={chartConfig}
        className="h-[260px] md:h-[320px] w-full mt-3"
      >
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
        >
          <defs>
            <linearGradient id="predScoreGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={mainColor} stopOpacity={0.25} />
              <stop offset="95%" stopColor={mainColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
            interval={0}
            angle={-20}
            textAnchor="end"
            height={50}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
            width={45}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(_, payload) => {
                  const d = payload?.[0]?.payload as { fullName?: string };
                  return d?.fullName || "";
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
              formatter={(v: unknown) => v != null ? String(Math.round(Number(v))) : ''}
            />
          </Area>
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
              return (
                <circle
                  key={`p-${cx}`}
                  cx={cx}
                  cy={cy}
                  r={8}
                  fill="#a855f7"
                  stroke="#fff"
                  strokeWidth={3}
                />
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
  projections: NonNullable<PredictionResponse["projections"]>;
}) {
  return (
    <div>
      <SectionLabel title="Proyeksi Skor" />
      <ScrollRow className="mt-3">
        {projections.map((proj) => {
          const diff = proj.blended - proj.wls;
          return (
            <div
              key={proj.stepsAhead}
              className="rounded-3xl border border-slate-100 bg-white p-4"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Rocket className="w-3 h-3 text-slate-400" />
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {proj.stepsAhead === 1
                    ? "TO Berikutnya"
                    : `${proj.stepsAhead} TO Lagi`}
                </p>
              </div>
              <p className="text-2xl font-black text-slate-800">
                {proj.blended}
              </p>
              <div className="mt-1 flex gap-2">
                <span className="text-[10px] text-slate-400">
                  WLS: {proj.wls}
                </span>
                <span className="text-[10px] text-slate-400">
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
  prediction: NonNullable<PredictionResponse["prediction"]>;
  insights: NonNullable<PredictionResponse["insights"]>;
}) {
  const momentumLabel =
    p.momentum > 3
      ? "Kuat Naik"
      : p.momentum > 0
        ? "Naik Perlahan"
        : p.momentum < -3
          ? "Turun Tajam"
          : p.momentum < 0
            ? "Sedikit Turun"
            : "Netral";

  const insights: {
    title: string;
    value: string;
    sub: string;
    tone: "emerald" | "amber" | "blue" | "slate";
  }[] = [
    {
      title: "Momentum",
      value: momentumLabel,
      sub: `${p.momentum > 0 ? "+" : ""}${p.momentum} poin/TO (3 terakhir)`,
      tone: p.momentum > 0 ? "emerald" : p.momentum < 0 ? "amber" : "slate",
    },
    {
      title: "Pertumbuhan",
      value: `${ins.growthPercent > 0 ? "+" : ""}${ins.growthPercent}%`,
      sub: "Paruh akhir vs paruh awal",
      tone: ins.growthPercent >= 0 ? "emerald" : "amber",
    },
    {
      title: "Konsistensi",
      value:
        ins.consistency < 10
          ? "Sangat Konsisten"
          : ins.consistency < 20
            ? "Cukup Konsisten"
            : "Berfluktuasi",
      sub: `CV = ${ins.consistency}%`,
      tone: ins.consistency < 20 ? "emerald" : "amber",
    },
    {
      title: "Performa Terbaik",
      value: `${Math.round(ins.bestPerformance.score)}`,
      sub: ins.bestPerformance.title,
      tone: "emerald",
    },
    {
      title: "Performa Terendah",
      value: `${Math.round(ins.worstPerformance.score)}`,
      sub: ins.worstPerformance.title,
      tone: "amber",
    },
  ];

  if (ins.projectedMilestone) {
    insights.push({
      title: `Target Skor ${ins.projectedMilestone.target}`,
      value: `~${ins.projectedMilestone.triesNeeded} TO lagi`,
      sub: `Dengan tren +${ins.learningVelocity}/TO`,
      tone: "blue",
    });
  }
  if (ins.strongestSubtest) {
    insights.push({
      title: "Subtes Terkuat",
      value: ins.strongestSubtest.name,
      sub: `Rata-rata: ${Math.round(ins.strongestSubtest.avgScore)}`,
      tone: "emerald",
    });
  }
  if (ins.weakestSubtest) {
    insights.push({
      title: "Perlu Ditingkatkan",
      value: ins.weakestSubtest.name,
      sub: `Rata-rata: ${Math.round(ins.weakestSubtest.avgScore)}`,
      tone: "amber",
    });
  }

  return (
    <div>
      <SectionLabel title="Insight" />
      <div
        className="overflow-x-auto -mx-4 px-4 pb-1 md:mx-0 md:px-0 md:overflow-visible mt-3"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex gap-3 min-w-max md:min-w-0 md:grid md:grid-cols-2 xl:grid-cols-3">
          {insights.map((item) => (
            <div key={item.title} className="w-[200px] flex-shrink-0 md:w-auto">
              <InsightCard {...item} />
            </div>
          ))}
        </div>
      </div>
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
  perSubtest: NonNullable<PredictionResponse["perSubtest"]>;
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
    current: { label: "Saat Ini", color: mainColor },
    predicted: { label: "Prediksi", color: "#a855f7" },
  };

  return (
    <div className="space-y-4">
      {/* Radar chart */}
      {perSubtest.length >= 3 && (
        <div className="rounded-3xl border border-slate-100 bg-white p-4">
          <SectionLabel
            title="Radar Kemampuan"
            sub="Biru = rata-rata saat ini · Ungu = prediksi"
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
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fontSize: 11, fill: "#374151", fontWeight: 700 }}
              />
              <PolarRadiusAxis
                tick={{ fontSize: 9, fill: "#9CA3AF" }}
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
    <div className="flex items-center gap-3 p-3 rounded-3xl border border-slate-100 bg-white hover:shadow-sm transition-shadow">
      <div
        className="flex h-9 w-9 items-center justify-center rounded-xl flex-shrink-0 text-xs font-black text-white"
        style={{ backgroundColor: color }}
      >
        {getSubtestLabel(sub.name, webSubId)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-800 truncate">{sub.name}</p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-xs text-slate-500">
            {Math.round(sub.currentAvg)}
          </span>
          <ArrowRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
          <span className="text-xs font-bold text-violet-600">
            {sub.predicted}
          </span>
          <span
            className={cn(
              "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
              isUp
                ? "text-emerald-700 bg-emerald-50"
                : diff < 0
                  ? "text-red-600 bg-red-50"
                  : "text-slate-500 bg-slate-100",
            )}
          >
            {isUp ? "+" : ""}
            {Math.round(diff)}
          </span>
        </div>
      </div>
      <div className="flex-shrink-0 text-right">
        <Badge
          variant="outline"
          className={cn("text-[10px] font-bold", s.badge)}
        >
          {s.label}
        </Badge>
        <div className="flex items-center gap-0.5 justify-end mt-1">
          {sub.trend === "improving" ? (
            <ArrowUp className="w-3 h-3 text-emerald-500" />
          ) : sub.trend === "declining" ? (
            <ArrowDown className="w-3 h-3 text-red-500" />
          ) : (
            <Minus className="w-3 h-3 text-slate-400" />
          )}
          <span className="text-[10px] text-slate-500">
            {sub.slope > 0 ? "+" : ""}
            {sub.slope}/TO
          </span>
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
  insights: NonNullable<PredictionResponse["insights"]>;
  bskTrend: NonNullable<PredictionResponse["bskTrend"]>;
  mainColor: string;
}) {
  const bskChartData = useMemo(
    () =>
      bskTrend.map((d) => ({
        name: `TO-${d.index}`,
        benar: d.benar,
        salah: d.salah,
        kosong: d.kosong,
      })),
    [bskTrend],
  );

  const bskConfig: ChartConfig = {
    benar: { label: "Benar", color: "#22c55e" },
    salah: { label: "Salah", color: "#ef4444" },
    kosong: { label: "Kosong", color: "#94a3b8" },
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
        name: "filled",
        value: insights.scoringEfficiency,
        fill: mainColor,
      },
      {
        name: "empty",
        value: 100 - insights.scoringEfficiency,
        fill: "#e2e8f0",
      },
    ],
    [insights.scoringEfficiency, mainColor],
  );

  const effConfig: ChartConfig = {
    filled: { label: "Efisiensi", color: mainColor },
    empty: { label: "", color: "#e2e8f0" },
  };

  return (
    <div className="space-y-4">
      <SectionLabel title="Efisiensi Jawab" />

      {/* Efficiency gauge + change cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-3xl border border-slate-100 bg-white p-3 text-center col-span-2 md:col-span-1 flex flex-col items-center justify-center">
          <ChartContainer
            config={effConfig}
            className="h-[90px] w-[90px]"
          >
            <PieChart>
              <Pie
                data={effData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={42}
                startAngle={90}
                endAngle={-270}
                paddingAngle={0}
                stroke="none"
              >
                {effData.map((d, i) => (
                  <Cell key={i} fill={d.fill} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan className="fill-slate-800 text-base font-black">
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
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
            Efisiensi
          </p>
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
          <BarChart
            data={bskChartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
            barCategoryGap="18%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#94a3b8" }}
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
                formatter={(v: unknown) => Number(v) > 0 ? String(v) : ''}
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
                formatter={(v: unknown) => Number(v) > 0 ? String(v) : ''}
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
                formatter={(v: unknown) => Number(v) > 0 ? String(v) : ''}
              />
            </Bar>
          </BarChart>
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
  history: NonNullable<PredictionResponse["history"]>;
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
        })),
    [history],
  );

  if (percentileData.length === 0) return null;

  const chartConfig: ChartConfig = {
    percentile: { label: "Persentil", color: "#22c55e" },
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
        <AreaChart
          data={percentileData}
          margin={{ top: 20, right: 20, left: -10, bottom: 10 }}
        >
          <defs>
            <linearGradient id="pctlGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
            interval={0}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
            width={35}
            tickFormatter={(v) => `${v}%`}
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
                  return `${d?.fullName || ""} · #${d?.rank}/${d?.total}`;
                }}
                formatter={(value) => (
                  <>
                    <div className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-emerald-500" />
                    <span className="text-muted-foreground">Top</span>
                    <span className="ml-auto font-mono font-medium">
                      {value}%
                    </span>
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
            dot={{
              fill: "#22c55e",
              r: 4,
              stroke: "#fff",
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
        </AreaChart>
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
