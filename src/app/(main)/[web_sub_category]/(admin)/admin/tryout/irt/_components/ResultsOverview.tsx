'use client';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Activity,
  BarChart3,
  BookOpen,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import { DataIRTProps, OverallStatsProps } from '../[tryoutId]/page';

// ─── Types ─────────────────────────────────────────────────────────────────────

type Props = {
  result: DataIRTProps & { overallStats: OverallStatsProps };
  sessionLabel: string;
};

// ─── Math helpers ──────────────────────────────────────────────────────────────

function stdDev(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const variance =
    values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function quantile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = p * (sorted.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

function buildDistribution(
  values: number[],
  bucketCount = 10,
): { label: string; count: number; pct: number }[] {
  if (values.length === 0) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = range / bucketCount;
  const buckets: { lo: number; hi: number; count: number }[] = Array.from(
    { length: bucketCount },
    (_, i) => ({ lo: min + i * step, hi: min + (i + 1) * step, count: 0 }),
  );
  values.forEach((v) => {
    const id = Math.min(
      Math.floor(((v - min) / range) * bucketCount),
      bucketCount - 1,
    );
    buckets[id].count++;
  });
  const maxCount = Math.max(...buckets.map((b) => b.count), 1);
  return buckets.map((b) => ({
    label: `${b.lo.toFixed(0)}\u2013${b.hi.toFixed(0)}`,
    count: b.count,
    pct: (b.count / maxCount) * 100,
  }));
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  accent,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'default';
  icon?: React.ElementType;
}) {
  const accentMap: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-100',
    green: 'bg-green-50 border-green-100',
    orange: 'bg-orange-50 border-orange-100',
    purple: 'bg-purple-50 border-purple-100',
    red: 'bg-red-50 border-red-100',
    default: 'bg-muted/30',
  };
  const iconMap: Record<string, string> = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    orange: 'text-orange-500',
    purple: 'text-purple-500',
    red: 'text-red-500',
    default: 'text-muted-foreground',
  };
  const cls = accentMap[accent ?? 'default'];
  const iconCls = iconMap[accent ?? 'default'];
  return (
    <div className={`rounded-3xl border p-4 ${cls} space-y-1.5`}>
      {Icon && <Icon className={`h-4 w-4 ${iconCls}`} />}
      <p className="text-2xl font-bold tracking-tight leading-none">{value}</p>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

function DistributionBar({
  buckets,
  title,
  subtitle,
  barColor = 'bg-blue-500',
}: {
  buckets: { label: string; count: number; pct: number }[];
  title: string;
  subtitle?: string;
  barColor?: string;
}) {
  const max = Math.max(...buckets.map((b) => b.count));
  return (
    <div className="space-y-3">
      <div>
        <h3 className="font-semibold text-sm">{title}</h3>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
      <div className="space-y-1.5">
        {buckets.map((b, i) => (
          <div
            key={i}
            className="flex items-center gap-3"
          >
            <span className="w-24 text-right text-xs text-muted-foreground shrink-0">
              {b.label}
            </span>
            <div className="flex-1 h-5 bg-muted/40 rounded-3xl overflow-hidden">
              <div
                className={`h-full ${barColor} rounded-3xl transition-all duration-500`}
                style={{ width: `${b.pct}%` }}
              />
            </div>
            <span className="w-6 text-xs font-medium text-muted-foreground shrink-0">
              {b.count}
            </span>
          </div>
        ))}
      </div>
      {max === 0 && (
        <p className="text-xs text-muted-foreground italic">
          Tidak ada data distribusi
        </p>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function ResultsOverview({ result, sessionLabel }: Props) {
  const { participants, question, overallStats } = result;

  // Compute additional stats from raw participant data
  const scores = participants.map((p) => p.score);
  const thetas = participants.map((p) => p.theta);
  const sorted = [...scores].sort((a, b) => a - b);
  const sortedTheta = [...thetas].sort((a, b) => a - b);
  const n = sorted.length;

  const sd = stdDev(scores);
  const q1 = quantile(sorted, 0.25);
  const q3 = quantile(sorted, 0.75);
  const iqr = q3 - q1;

  // Item parameter analysis (filter nulls)
  const validQuestions = question.filter(
    (q) => q.a !== null && q.b !== null && q.c !== null,
  );
  const aValues = validQuestions.map((q) => q.a as number);
  const bValues = validQuestions.map((q) => q.b as number);
  const cValues = validQuestions.map((q) => q.c as number);

  const avgA = aValues.length
    ? aValues.reduce((s, v) => s + v, 0) / aValues.length
    : null;
  const avgB = bValues.length
    ? bValues.reduce((s, v) => s + v, 0) / bValues.length
    : null;
  const avgC = cValues.length
    ? cValues.reduce((s, v) => s + v, 0) / cValues.length
    : null;

  // Difficulty tiers by b parameter
  const easyItems = bValues.filter((b) => b < -1).length;
  const mediumItems = bValues.filter((b) => b >= -1 && b <= 1).length;
  const hardItems = bValues.filter((b) => b > 1).length;

  // Discrimination tiers by a parameter
  const lowDiscrim = aValues.filter((a) => a < 0.5).length;
  const goodDiscrim = aValues.filter((a) => a >= 0.5 && a <= 2).length;
  const highDiscrim = aValues.filter((a) => a > 2).length;

  // Score distribution
  const scoreBuckets = buildDistribution(scores, 10);
  const thetaBuckets = buildDistribution(thetas, 8);

  // SNBT bracket categories
  const categories = [
    {
      label: '< 400',
      count: scores.filter((s) => s < 400).length,
      color: 'bg-red-400',
    },
    {
      label: '400\u2013450',
      count: scores.filter((s) => s >= 400 && s < 450).length,
      color: 'bg-orange-400',
    },
    {
      label: '450\u2013500',
      count: scores.filter((s) => s >= 450 && s < 500).length,
      color: 'bg-yellow-400',
    },
    {
      label: '500\u2013550',
      count: scores.filter((s) => s >= 500 && s < 550).length,
      color: 'bg-lime-500',
    },
    {
      label: '550\u2013600',
      count: scores.filter((s) => s >= 550 && s < 600).length,
      color: 'bg-green-500',
    },
    {
      label: '\u2265 600',
      count: scores.filter((s) => s >= 600).length,
      color: 'bg-emerald-600',
    },
  ];
  const catMax = Math.max(...categories.map((c) => c.count), 1);

  function discriminationLabel(a: number | null): {
    text: string;
    variant: string;
  } {
    if (a === null) return { text: '\u2014', variant: 'secondary' };
    if (a < 0.5) return { text: 'Rendah', variant: 'red' };
    if (a <= 2) return { text: 'Baik', variant: 'green' };
    return { text: 'Sangat Tinggi', variant: 'purple' };
  }

  function difficultyLabel(b: number | null): {
    text: string;
    variant: string;
  } {
    if (b === null) return { text: '\u2014', variant: 'secondary' };
    if (b < -1) return { text: 'Mudah', variant: 'green' };
    if (b <= 1) return { text: 'Sedang', variant: 'yellow' };
    return { text: 'Sulit', variant: 'red' };
  }

  const getBadgeCls = (variant: string) => {
    const map: Record<string, string> = {
      green: 'bg-green-100 text-green-700 border-green-200',
      red: 'bg-red-100 text-red-700 border-red-200',
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      secondary: 'bg-muted text-muted-foreground',
    };
    return map[variant] ?? map.secondary;
  };

  return (
    <div className="space-y-5">
      {/* Section title */}
      <div className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-blue-500 shrink-0" />
        <h2 className="font-bold text-base truncate">
          Hasil IRT: {sessionLabel}
        </h2>
        <span className="ml-auto text-xs text-muted-foreground shrink-0">
          {n} peserta
        </span>
      </div>

      {/* ── Primary Score Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="Total Peserta"
          value={overallStats.totalParticipants}
          icon={Users}
          accent="blue"
        />
        <StatCard
          label="Rata-rata"
          value={overallStats.averageScores.toFixed(1)}
          icon={Activity}
          accent="purple"
          sub="Skor SNBT"
        />
        <StatCard
          label="Tertinggi"
          value={overallStats.maxScores.toFixed(1)}
          icon={TrendingUp}
          accent="green"
        />
        <StatCard
          label="Terendah"
          value={overallStats.minScores.toFixed(1)}
          icon={TrendingDown}
          accent="red"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="Median"
          value={overallStats.medianScores.toFixed(1)}
          accent="orange"
        />
        <StatCard
          label="Std. Deviasi"
          value={sd.toFixed(1)}
          sub="Sebaran skor"
          accent="default"
        />
        <StatCard
          label="Q1 (P25)"
          value={q1.toFixed(1)}
          sub={`IQR: ${iqr.toFixed(1)}`}
          accent="default"
        />
        <StatCard
          label="Q3 (P75)"
          value={q3.toFixed(1)}
          sub="Kuartil atas"
          accent="default"
        />
      </div>

      {/* ── Theta Stats ── */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          label="Rata-rata θ"
          value={overallStats.averageTheta.toFixed(3)}
          icon={Target}
          accent="purple"
          sub="Kemampuan rata-rata"
        />
        <StatCard
          label="θ Tertinggi"
          value={overallStats.maxTheta.toFixed(3)}
          accent="green"
        />
        <StatCard
          label="θ Terendah"
          value={overallStats.minTheta.toFixed(3)}
          accent="red"
        />
      </div>

      <Separator />

      {/* ── Score Distribution ── */}
      <Card className="border-0 bg-muted/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-blue-500" />
            Distribusi Skor (Skala SNBT)
          </CardTitle>
          <CardDescription className="text-xs">
            {n} peserta · Mean {overallStats.averageScores.toFixed(0)} · SD{' '}
            {sd.toFixed(1)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Bracket categories */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              Kategori Nilai
            </p>
            <div className="space-y-1.5">
              {categories.map((cat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3"
                >
                  <span className="w-16 text-right text-xs text-muted-foreground shrink-0">
                    {cat.label}
                  </span>
                  <div className="flex-1 h-5 bg-muted/40 rounded-3xl overflow-hidden">
                    <div
                      className={`h-full ${cat.color} rounded-3xl transition-all duration-500`}
                      style={{ width: `${(cat.count / catMax) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 text-xs font-medium text-muted-foreground shrink-0">
                    {cat.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Fine-grained distribution histogram */}
          {scoreBuckets.length > 0 && (
            <DistributionBar
              buckets={scoreBuckets}
              title="Distribusi Detail (10 Bucket)"
              barColor="bg-blue-500"
            />
          )}
        </CardContent>
      </Card>

      {/* ── Item Parameter Analysis ── */}
      {validQuestions.length > 0 && (
        <Card className="border-0 bg-muted/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-purple-500" />
              Analisis Parameter Butir (Model 3PL)
            </CardTitle>
            <CardDescription className="text-xs">
              {validQuestions.length} / {question.length} soal berhasil
              diestimasi
              {question.length - validQuestions.length > 0
                ? ` \u00b7 ${question.length - validQuestions.length} tidak valid (tanpa variasi)`
                : ''}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Average params */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-3xl border bg-background p-3 text-center space-y-1.5">
                <p className="text-2xl font-bold text-purple-600">
                  {avgA !== null ? avgA.toFixed(3) : '\u2014'}
                </p>
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  Avg a
                </p>
                <p className="text-xs text-muted-foreground">Diskriminasi</p>
                {avgA !== null && (
                  <Badge
                    className={`text-xs ${getBadgeCls(discriminationLabel(avgA).variant)}`}
                  >
                    {discriminationLabel(avgA).text}
                  </Badge>
                )}
              </div>
              <div className="rounded-3xl border bg-background p-3 text-center space-y-1.5">
                <p className="text-2xl font-bold text-yellow-600">
                  {avgB !== null ? avgB.toFixed(3) : '\u2014'}
                </p>
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  Avg b
                </p>
                <p className="text-xs text-muted-foreground">Kesulitan</p>
                {avgB !== null && (
                  <Badge
                    className={`text-xs ${getBadgeCls(difficultyLabel(avgB).variant)}`}
                  >
                    {difficultyLabel(avgB).text}
                  </Badge>
                )}
              </div>
              <div className="rounded-3xl border bg-background p-3 text-center space-y-1.5">
                <p className="text-2xl font-bold text-blue-600">
                  {avgC !== null ? avgC.toFixed(3) : '\u2014'}
                </p>
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  Avg c
                </p>
                <p className="text-xs text-muted-foreground">
                  Guessing (pseudo-chance)
                </p>
              </div>
            </div>

            {/* Difficulty & Discrimination breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Tingkat Kesulitan (b)
                </p>
                <div className="space-y-1.5">
                  {[
                    {
                      label: 'Mudah  (b < \u22121)',
                      count: easyItems,
                      color: 'bg-green-500',
                    },
                    {
                      label: 'Sedang (\u22121 \u2264 b \u2264 1)',
                      count: mediumItems,
                      color: 'bg-yellow-500',
                    },
                    {
                      label: 'Sulit  (b > 1)',
                      count: hardItems,
                      color: 'bg-red-500',
                    },
                  ].map((row, i) => {
                    const mx = Math.max(easyItems, mediumItems, hardItems, 1);
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-2"
                      >
                        <span className="text-xs text-muted-foreground w-36 shrink-0">
                          {row.label}
                        </span>
                        <div className="flex-1 h-4 bg-muted/40 rounded-3xl overflow-hidden">
                          <div
                            className={`h-full ${row.color} rounded-3xl`}
                            style={{ width: `${(row.count / mx) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium w-5 shrink-0 text-right">
                          {row.count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Daya Diskriminasi (a)
                </p>
                <div className="space-y-1.5">
                  {[
                    {
                      label: 'Rendah (a < 0.5)',
                      count: lowDiscrim,
                      color: 'bg-red-500',
                    },
                    {
                      label: 'Baik (0.5 \u2013 2)',
                      count: goodDiscrim,
                      color: 'bg-green-500',
                    },
                    {
                      label: 'Sangat tinggi (> 2)',
                      count: highDiscrim,
                      color: 'bg-purple-500',
                    },
                  ].map((row, i) => {
                    const mx = Math.max(
                      lowDiscrim,
                      goodDiscrim,
                      highDiscrim,
                      1,
                    );
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-2"
                      >
                        <span className="text-xs text-muted-foreground w-36 shrink-0">
                          {row.label}
                        </span>
                        <div className="flex-1 h-4 bg-muted/40 rounded-3xl overflow-hidden">
                          <div
                            className={`h-full ${row.color} rounded-3xl`}
                            style={{ width: `${(row.count / mx) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium w-5 shrink-0 text-right">
                          {row.count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Theta distribution */}
            {thetaBuckets.length > 0 && (
              <>
                <Separator />
                <DistributionBar
                  buckets={thetaBuckets}
                  title="Distribusi Theta (θ)"
                  subtitle="Estimasi kemampuan peserta via EAP · Prior N(0, 25)"
                  barColor="bg-purple-500"
                />
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-1">
                  <span>
                    SD θ:{' '}
                    <span className="font-semibold text-foreground">
                      {stdDev(thetas).toFixed(3)}
                    </span>
                  </span>
                  <span>
                    Q1:{' '}
                    <span className="font-semibold text-foreground">
                      {quantile(sortedTheta, 0.25).toFixed(3)}
                    </span>
                  </span>
                  <span>
                    Q3:{' '}
                    <span className="font-semibold text-foreground">
                      {quantile(sortedTheta, 0.75).toFixed(3)}
                    </span>
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
