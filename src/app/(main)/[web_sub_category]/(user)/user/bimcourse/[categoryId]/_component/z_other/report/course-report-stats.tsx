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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { ScrollWrapper } from '@/components/ui/scroll-wrapper';
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
import {
  Activity,
  BookOpen,
  CalendarDays,
  Clock3,
  Crown,
  Medal,
  Sigma,
  Target,
  TrendingUp,
} from 'lucide-react';
import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import useMedia from 'use-media';

type TierKey = 'unggul' | 'baik' | 'cukup' | 'rendah' | 'lemah';

interface ProgressTooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey?: string;
    value?: number;
    payload?: {
      title: string;
      score: number;
      bskIndex: number;
      benar: number;
      salah: number;
      kosong: number;
    };
  }>;
}

function ProgressTooltip({ active, payload }: ProgressTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const current = payload[0]?.payload;
  if (!current) return null;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] p-3.5 min-w-[220px]">
      <p className="text-sm font-bold text-slate-800 mb-2 line-clamp-1">
        {current.title}
      </p>
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-blue-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> Skor
          </span>
          <span className="font-bold text-slate-800">
            {current.score.toFixed(1)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> B/S/K Index
          </span>
          <span className="font-bold text-slate-800">
            {current.bskIndex.toFixed(1)}%
          </span>
        </div>
      </div>
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
        <span>Benar/Salah/Kosong</span>
        <span className="font-semibold text-slate-700">
          {current.benar}/{current.salah}/{current.kosong}
        </span>
      </div>
    </div>
  );
}

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
  unggul: {
    label: 'Unggul',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
  },
  baik: {
    label: 'Baik',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
  },
  cukup: {
    label: 'Cukup',
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
    dot: 'bg-yellow-500',
  },
  rendah: {
    label: 'Rendah',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    dot: 'bg-orange-500',
  },
  lemah: {
    label: 'Lemah',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    dot: 'bg-red-500',
  },
};

function TierBadge({ score, max = 100 }: { score: number; max?: number }) {
  const tier = scoreTier(score, max);
  const m = TIER_META[tier];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border',
        m.bg,
        m.text,
        m.border,
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', m.dot)} />
      {m.label}
    </span>
  );
}

function formatMinutes(totalMinutes: number) {
  const safe = Math.max(Math.floor(totalMinutes || 0), 0);
  const hours = Math.floor(safe / 60);
  const minutes = safe % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}j`;
  return `${hours}j ${minutes}m`;
}

type CourseReportData = {
  categoryName: string;
  totalSubChapter: number;
  finishedSubChapter: number;
  percentageProgress: number;
  tryoutResult: {
    id: string;
    title: string;
    score: number;
    averageScore: number;
    maxScore: number;
    minScore: number;
    totalParticipants: number;
    rank: number | null;
    percentile: number | null;
    benar: number;
    salah: number;
    kosong: number;
    totalQuestions: number;
  }[];
  StatisticsCategory: {
    category: string;
    session: {
      subCategory: string;
      min: number;
      q1: number;
      median: number;
      mean: number;
      stdDev: number;
      q3: number;
      max: number;
      total: number;
    }[];
  }[];
  DistributionScore: { range: string; count: number }[];
  learningOverview?: {
    totalChapter: number;
    totalSubChapter: number;
    finishedSubChapter: number;
    completionRate: number;
    totalEstimatedMinutes: number;
    completedEstimatedMinutes: number;
    remainingEstimatedMinutes: number;
    recentActivityDays7: number;
    activeLearningDays: number;
    totalByType: Record<string, number>;
    completedByType: Record<string, number>;
    chapterProgress: {
      chapterId: string;
      chapterTitle: string;
      totalSubChapter: number;
      finishedSubChapter: number;
      completionRate: number;
    }[];
  };
  courseRanking?: {
    totalParticipants: number;
    myRank: number | null;
    topLeaderboard: {
      userId: string;
      name: string;
      image: string | null;
      finishedSubChapter: number;
      completionRate: number;
      avgQuizScore: number;
      score: number;
      rank: number;
    }[];
  };
};

export function CourseReportStats({ report }: { report: CourseReportData }) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const isMobile = useMedia({ maxWidth: '768px' });

  const learningOverview = report.learningOverview;

  const avgScore = useMemo(() => {
    if (!report.tryoutResult.length) return 0;
    return (
      report.tryoutResult.reduce((sum, item) => sum + item.score, 0) /
      report.tryoutResult.length
    );
  }, [report.tryoutResult]);

  const bestScore = useMemo(
    () => Math.max(0, ...report.tryoutResult.map((item) => item.score)),
    [report.tryoutResult],
  );

  const radarData = report.tryoutResult.map((item) => ({
    name:
      item.title.length > (isMobile ? 9 : 14)
        ? `${item.title.slice(0, isMobile ? 9 : 14)}...`
        : item.title,
    myScore: Number(item.score.toFixed(1)),
    avgScore: Number(item.averageScore.toFixed(1)),
  }));

  const statRows = report.StatisticsCategory.flatMap((cat) =>
    cat.session.map((session) => ({ category: cat.category, ...session })),
  );

  const typeRows = useMemo(() => {
    const totalByType = learningOverview?.totalByType ?? {};
    const completedByType = learningOverview?.completedByType ?? {};
    const keys = Array.from(
      new Set([...Object.keys(totalByType), ...Object.keys(completedByType)]),
    );

    return keys.map((type) => {
      const total = totalByType[type] ?? 0;
      const done = completedByType[type] ?? 0;
      return {
        type,
        total,
        done,
        pct: total > 0 ? (done / total) * 100 : 0,
      };
    });
  }, [learningOverview?.completedByType, learningOverview?.totalByType]);

  const overviewCards = [
    {
      title: 'Progress Course',
      value: `${report.percentageProgress.toFixed(1)}%`,
      sub: `${report.finishedSubChapter}/${report.totalSubChapter} sub-bab`,
      icon: Target,
    },
    {
      title: 'Durasi Selesai',
      value: formatMinutes(learningOverview?.completedEstimatedMinutes ?? 0),
      sub: `Sisa ${formatMinutes(learningOverview?.remainingEstimatedMinutes ?? 0)}`,
      icon: Clock3,
    },
    {
      title: 'Konsistensi 7 Hari',
      value: `${learningOverview?.recentActivityDays7 ?? 0} hari`,
      sub: `Total aktif ${learningOverview?.activeLearningDays ?? 0} hari`,
      icon: CalendarDays,
    },
  ];

  const progressTrendData = report.tryoutResult.map((item, index) => {
    const benarPct =
      item.totalQuestions > 0 ? (item.benar / item.totalQuestions) * 100 : 0;

    return {
      label: `Q${index + 1}`,
      title: item.title,
      score: Number(item.score.toFixed(1)),
      bskIndex: Number(benarPct.toFixed(1)),
      benar: item.benar,
      salah: item.salah,
      kosong: item.kosong,
      rank: item.rank,
    };
  });

  const highestScore =
    report.tryoutResult.length > 0
      ? Math.max(...report.tryoutResult.map((item) => item.score))
      : 0;
  const lowestScore =
    report.tryoutResult.length > 0
      ? Math.min(...report.tryoutResult.map((item) => item.score))
      : 0;
  const latestScore =
    report.tryoutResult.length > 0
      ? report.tryoutResult[report.tryoutResult.length - 1].score
      : 0;
  const averageAccuracy =
    report.tryoutResult.length > 0
      ? report.tryoutResult.reduce((acc, item) => {
          const accuracy =
            item.totalQuestions > 0
              ? (item.benar / item.totalQuestions) * 100
              : 0;
          return acc + accuracy;
        }, 0) / report.tryoutResult.length
      : 0;

  const rankingData = report.courseRanking;

  return (
    <div className="space-y-4 md:space-y-5">
      {/* Stat cards — horizontal scroll on all screens */}
      <ScrollWrapper className="pb-1">
        <div className="flex gap-3 min-w-max">
          {overviewCards.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="w-[180px] shrink-0 rounded-3xl border border-slate-100 p-4 bg-white shadow-sm"
              >
                <p className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5" />
                  {item.title}
                </p>
                <p className="text-2xl font-black text-slate-800 mt-1.5">
                  {item.value}
                </p>
                <p className="text-xs text-slate-500 mt-1">{item.sub}</p>
              </div>
            );
          })}
          {/* Extra mini stats */}
          <div className="w-[180px] shrink-0 rounded-3xl border border-slate-100 p-4 bg-white shadow-sm">
            <p className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Avg Skor Kuis
            </p>
            <p className="text-2xl font-black text-slate-800 mt-1.5">
              {avgScore.toFixed(1)}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              dari {report.tryoutResult.length} kuis
            </p>
          </div>
          <div className="w-[180px] shrink-0 rounded-3xl border border-slate-100 p-4 bg-white shadow-sm">
            <p className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5" />
              Peringkat Saya
            </p>
            <p className="text-2xl font-black text-slate-800 mt-1.5">
              {rankingData?.myRank ? `#${rankingData.myRank}` : '-'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              dari {rankingData?.totalParticipants ?? 0} peserta
            </p>
          </div>
        </div>
      </ScrollWrapper>

      <Tabs
        defaultValue="overview"
        // className='w-auto'
      >
        <ScrollWrapper className="mb-4">
          <TabsList
            // Ganti w-full menjadi: w-fit max-w-full
            className="flex w-fit max-w-full justify-start gap-1 whitespace-nowrap rounded-full bg-slate-100/60 p-1.5"
          >
            <TabsTrigger
              value="overview"
              className="flex shrink-0 items-center rounded-full px-4 py-2 text-slate-600 data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
            >
              <BookOpen className="h-3.5 w-3.5 mr-1.5" /> Overview
            </TabsTrigger>

            <TabsTrigger
              value="peringkat"
              className="flex shrink-0 items-center rounded-full px-4 py-2 text-slate-600 data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
            >
              <Crown className="h-3.5 w-3.5 mr-1.5" /> Peringkat
            </TabsTrigger>

            <TabsTrigger
              value="nilai"
              className="flex shrink-0 items-center rounded-full px-4 py-2 text-slate-600 data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
            >
              <Activity className="h-3.5 w-3.5 mr-1.5" /> Nilai
            </TabsTrigger>

            <TabsTrigger
              value="statistik"
              className="flex shrink-0 items-center rounded-full px-4 py-2 text-slate-600 data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
            >
              <Sigma className="h-3.5 w-3.5 mr-1.5" /> Statistik
            </TabsTrigger>
          </TabsList>
        </ScrollWrapper>

        <TabsContent
          value="overview"
          className="mt-4 space-y-6"
        >
          {/* Progress chapter list — horizontal scroll */}
          {(learningOverview?.chapterProgress ?? []).length > 0 && (
            <div className="space-y-3">
              <p className="text-base font-bold text-slate-800 px-1">
                Progress Bab
              </p>
              <ScrollWrapper className="pb-3">
                <div className="flex gap-4 min-w-max pb-1 px-1">
                  {(learningOverview?.chapterProgress ?? []).map((chapter) => (
                    <div
                      key={chapter.chapterId}
                      className="w-[240px] shrink-0 rounded-2xl border border-slate-200/60 p-4 bg-white shadow-sm"
                    >
                      <p className="font-bold text-sm text-slate-800 line-clamp-2 leading-snug min-h-[40px]">
                        {chapter.chapterTitle}
                      </p>
                      <div className="mt-3.5 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(chapter.completionRate, 100)}%`,
                            backgroundColor: mainColor,
                          }}
                        />
                      </div>
                      <div className="mt-3.5 flex items-center justify-between">
                        <Badge
                          variant="secondary"
                          className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-700 hover:bg-slate-100 font-semibold"
                        >
                          {chapter.finishedSubChapter}/{chapter.totalSubChapter}
                        </Badge>
                        <span className="text-xs font-bold text-slate-600">
                          {chapter.completionRate.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollWrapper>
            </div>
          )}

          {/* Uji Progress chart */}
          {progressTrendData.length > 0 && (
            <div className="rounded-3xl border border-slate-100 p-5 bg-white shadow-sm">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <p className="text-base font-bold text-slate-800">
                    Performa Uji Progress
                  </p>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Perkembangan nilai & akurasi per kuis
                  </p>
                </div>
                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 shadow-none font-semibold">
                  {latestScore >= avgScore
                    ? `+${(latestScore - avgScore).toFixed(1)} dari rata-rata`
                    : `${(latestScore - avgScore).toFixed(1)} dari rata-rata`}
                </Badge>
              </div>

              {/* Mini stat chips — horizontal scroll */}
              <ScrollWrapper className="mt-5 pb-1">
                <div className="flex gap-4 min-w-max">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Tertinggi:{' '}
                    <strong className="text-slate-800">
                      {highestScore.toFixed(1)}
                    </strong>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Rata-rata:{' '}
                    <strong className="text-slate-800">
                      {avgScore.toFixed(1)}
                    </strong>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                    Akurasi:{' '}
                    <strong className="text-slate-800">
                      {averageAccuracy.toFixed(1)}%
                    </strong>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Terakhir:{' '}
                    <strong className="text-slate-800">
                      {latestScore.toFixed(1)}
                    </strong>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Terendah:{' '}
                    <strong className="text-slate-800">
                      {lowestScore.toFixed(1)}
                    </strong>
                  </div>
                </div>
              </ScrollWrapper>

              {/* Line legend */}
              <div className="mt-5 flex flex-wrap gap-5 text-sm pb-1">
                <div className="flex items-center gap-2">
                  <span className="w-4 border-t-[3px] border-blue-500 inline-block rounded-full" />
                  <span className="font-semibold text-slate-700">
                    Skor Akhir
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 border-t-[3px] border-dashed border-emerald-500 inline-block" />
                  <span className="font-semibold text-slate-700">
                    Akurasi (B/S/K)
                  </span>
                </div>
              </div>

              <div className="mt-5 h-[220px] sm:h-[280px]">
                <ChartContainer
                  config={{}}
                  className="h-full w-full"
                >
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <LineChart
                      data={progressTrendData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#f1f5f9"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="label"
                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                        axisLine={false}
                        tickLine={false}
                        tickMargin={10}
                      />
                      <YAxis
                        yAxisId="score"
                        orientation="left"
                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                        axisLine={false}
                        tickLine={false}
                        width={30}
                      />
                      <YAxis
                        yAxisId="accuracy"
                        orientation="right"
                        domain={[0, 100]}
                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                        axisLine={false}
                        tickLine={false}
                        width={30}
                      />
                      <Line
                        yAxisId="score"
                        type="monotone"
                        dataKey="score"
                        stroke={mainColor}
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                        name="Skor"
                      />
                      <Line
                        yAxisId="accuracy"
                        type="monotone"
                        dataKey="bskIndex"
                        stroke="#10b981"
                        strokeDasharray="5 5"
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }}
                        activeDot={{ r: 5, strokeWidth: 0 }}
                        name="B/S/K Index"
                      />
                      <ChartTooltip content={<ProgressTooltip />} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          )}

          {/* Riwayat Skor — horizontal scroll cards */}
          {report.tryoutResult.length > 0 && (
            <div className="space-y-3">
              <p className="text-base font-bold text-slate-800 px-1">
                Riwayat Skor
              </p>
              <ScrollWrapper className="pb-3">
                <div className="flex gap-4 min-w-max pb-1 px-1">
                  {report.tryoutResult
                    .slice()
                    .reverse()
                    .slice(0, 8)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-slate-200/60 p-4 bg-white shadow-sm w-[240px] shrink-0"
                      >
                        <p className="font-bold text-sm text-slate-800 line-clamp-2 leading-snug min-h-[40px]">
                          {item.title}
                        </p>
                        <div className="mt-4 flex items-end justify-between">
                          <div>
                            <p className="text-[11px] text-slate-500 font-medium">
                              Skor
                            </p>
                            <p className="text-2xl font-black text-blue-600 mt-0.5">
                              {item.score.toFixed(1)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[11px] text-slate-500 font-medium">
                              Rank
                            </p>
                            <p className="text-2xl font-black text-amber-500 mt-0.5">
                              {item.rank ? `#${item.rank}` : '-'}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{
                              width: `${Math.min(item.percentile || 0, 100)}%`,
                            }}
                          />
                        </div>
                        <p className="text-[11px] font-medium text-slate-400 mt-2 text-right">
                          Top {item.percentile?.toFixed(0) || 0}%
                        </p>
                      </div>
                    ))}
                </div>
              </ScrollWrapper>
            </div>
          )}

          {/* Ringkasan + Tipe Belajar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-3xl border border-slate-100 p-5 bg-white shadow-sm flex flex-col justify-center">
              <p className="text-base font-bold text-slate-800">
                Ringkasan Belajar
              </p>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">
                    Total chapter
                  </span>
                  <span className="font-bold text-slate-800">
                    {learningOverview?.totalChapter ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">
                    Total sub-bab
                  </span>
                  <span className="font-bold text-slate-800">
                    {learningOverview?.totalSubChapter ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">
                    Estimasi durasi
                  </span>
                  <span className="font-bold text-slate-800">
                    {formatMinutes(
                      learningOverview?.totalEstimatedMinutes ?? 0,
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-100 p-5 bg-white shadow-sm flex flex-col justify-center">
              <p className="text-base font-bold text-slate-800">Tipe Belajar</p>
              <div className="mt-4 space-y-3.5">
                {typeRows.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    Belum ada data tipe belajar.
                  </p>
                ) : (
                  typeRows.map((row) => (
                    <div key={row.type}>
                      <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
                        <span className="capitalize font-medium text-slate-700">
                          {row.type}
                        </span>
                        <span className="font-semibold text-slate-800">
                          {row.done}/{row.total}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(row.pct, 100)}%`,
                            backgroundColor: mainColor,
                          }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="peringkat"
          className="mt-4"
        >
          <ScrollWrapper className="pb-1 mb-4">
            <div className="flex gap-3 min-w-max">
              <div className="w-[180px] shrink-0 rounded-3xl border border-slate-100 p-4 bg-white shadow-sm">
                <p className="text-xs font-semibold text-slate-500">
                  Peserta Aktif
                </p>
                <p className="text-2xl font-black text-slate-800 mt-1.5">
                  {rankingData?.totalParticipants ?? 0}
                </p>
              </div>
              <div className="w-[180px] shrink-0 rounded-3xl border border-slate-100 p-4 bg-white shadow-sm">
                <p className="text-xs font-semibold text-slate-500">
                  Peringkat Kamu
                </p>
                <p className="text-2xl font-black text-slate-800 mt-1.5">
                  {rankingData?.myRank ? `#${rankingData.myRank}` : '-'}
                </p>
              </div>
              <div className="w-[200px] shrink-0 rounded-3xl border border-slate-100 p-4 bg-white shadow-sm">
                <p className="text-xs font-semibold text-slate-500">
                  Metode Poin
                </p>
                <p className="text-sm font-bold text-slate-800 mt-1.5 leading-tight">
                  Completion 70% <br />
                  <span className="text-slate-500 text-xs">+ Quiz 30%</span>
                </p>
              </div>
            </div>
          </ScrollWrapper>

          <div className="rounded-3xl border border-slate-100 p-5 bg-white shadow-sm">
            <p className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" /> Top Leaderboard
            </p>
            <div className="space-y-0 text-sm">
              {(rankingData?.topLeaderboard ?? []).slice(0, 10).map((row) => (
                <div
                  key={row.userId}
                  className="flex items-center justify-between border-b border-slate-100 py-3.5 last:border-0"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span
                      className={cn(
                        'inline-flex items-center justify-center rounded-full w-8 h-8 text-[13px] font-black',
                        row.rank === 1
                          ? 'bg-amber-100 text-amber-700 border border-amber-200 shadow-sm'
                          : row.rank === 2
                            ? 'bg-slate-100 text-slate-700 border border-slate-200 shadow-sm'
                            : row.rank === 3
                              ? 'bg-orange-100 text-orange-700 border border-orange-200 shadow-sm'
                              : 'bg-white text-slate-500 border border-slate-200',
                      )}
                    >
                      {row.rank <= 3 ? (
                        <Medal className="w-4 h-4" />
                      ) : (
                        `#${row.rank}`
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 truncate max-w-[160px] sm:max-w-[300px]">
                        {row.name}
                      </p>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">
                        Avg quiz {row.avgQuizScore.toFixed(1)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-slate-500">
                      Completion
                    </p>
                    <p className="font-bold text-slate-800 mt-0.5">
                      {row.completionRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
              {(rankingData?.topLeaderboard ?? []).length === 0 && (
                <p className="text-sm font-medium text-slate-500 text-center py-4">
                  Belum ada data ranking.
                </p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="nilai"
          className="mt-4 space-y-4"
        >
          <ScrollWrapper className="pb-1">
            <div className="flex gap-3 min-w-max">
              <div className="w-[180px] shrink-0 rounded-3xl border border-slate-100 p-4 bg-white shadow-sm">
                <p className="text-xs font-semibold text-slate-500">
                  Rata-rata Nilai
                </p>
                <p className="text-2xl font-black text-slate-800 mt-1.5">
                  {avgScore.toFixed(1)}
                </p>
                <div className="mt-1.5">
                  <TierBadge
                    score={avgScore}
                    max={bestScore || 100}
                  />
                </div>
              </div>
              <div className="w-[180px] shrink-0 rounded-3xl border border-slate-100 p-4 bg-white shadow-sm flex flex-col justify-center">
                <p className="text-xs font-semibold text-slate-500">
                  Nilai Tertinggi
                </p>
                <p className="text-2xl font-black text-slate-800 mt-1.5">
                  {bestScore.toFixed(1)}
                </p>
                <p className="text-xs font-medium text-slate-500 mt-1.5">
                  dari {report.tryoutResult.length} kuis
                </p>
              </div>
              <div className="w-[180px] shrink-0 rounded-3xl border border-slate-100 p-4 bg-white shadow-sm">
                <p className="text-xs font-semibold text-slate-500">
                  Nilai Terakhir
                </p>
                <p className="text-2xl font-black text-slate-800 mt-1.5">
                  {latestScore.toFixed(1)}
                </p>
                <div className="mt-1.5">
                  <TierBadge
                    score={latestScore}
                    max={100}
                  />
                </div>
              </div>
              <div className="w-[180px] shrink-0 rounded-3xl border border-slate-100 p-4 bg-white shadow-sm flex flex-col justify-center">
                <p className="text-xs font-semibold text-slate-500">
                  Akurasi Rata-rata
                </p>
                <p className="text-2xl font-black text-slate-800 mt-1.5">
                  {averageAccuracy.toFixed(1)}%
                </p>
                <p className="text-xs font-medium text-slate-500 mt-1.5">
                  B/S/K Index
                </p>
              </div>
            </div>
          </ScrollWrapper>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <Card className="rounded-3xl border border-slate-100 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold text-slate-800">
                  Radar: Kamu vs Rata-rata
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Perbandingan per kuis
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[260px] sm:h-[320px]">
                <ChartContainer
                  config={{}}
                  className="h-full w-full"
                >
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <RadarChart
                      data={radarData}
                      margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                    >
                      <PolarGrid stroke="#f1f5f9" />
                      <PolarAngleAxis
                        dataKey="name"
                        tick={{ fontSize: isMobile ? 10 : 12, fill: '#64748b' }}
                      />
                      <Radar
                        dataKey="myScore"
                        stroke={mainColor}
                        fill={mainColor}
                        fillOpacity={0.25}
                      />
                      <Radar
                        dataKey="avgScore"
                        stroke="#6366f1"
                        fill="#6366f1"
                        fillOpacity={0.16}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </RadarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border border-slate-100 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold text-slate-800">
                  Distribusi Nilai Peserta
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Sebaran akumulasi skor
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[260px] sm:h-[320px]">
                <ChartContainer
                  config={{}}
                  className="h-full w-full"
                >
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <BarChart
                      data={report.DistributionScore}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#f1f5f9"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="range"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 10, fill: '#64748b' }}
                        tickMargin={10}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 10, fill: '#64748b' }}
                        width={30}
                      />
                      <Bar
                        dataKey="count"
                        radius={[8, 8, 0, 0]}
                      >
                        {report.DistributionScore.map((item, index) => (
                          <Cell
                            key={`${item.range}-${index}`}
                            fill={
                              index % 3 === 0
                                ? mainColor
                                : index % 3 === 1
                                  ? '#8b5cf6'
                                  : '#60a5fa'
                            }
                          />
                        ))}
                      </Bar>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent
          value="statistik"
          className="mt-4"
        >
          <Card className="rounded-3xl border border-slate-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-800">
                Statistik Lengkap per Kuis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollWrapper className="pb-1 text-sm">
                <Table classNameWrapper="overflow-visible min-w-[700px]">
                  <TableHeader>
                    <TableRow className="border-b border-slate-100 bg-slate-50/50 hover:bg-slate-50/50">
                      <TableHead className="font-semibold text-slate-600 rounded-tl-xl py-3">
                        Sub Kuis
                      </TableHead>
                      <TableHead className="text-right font-semibold text-slate-600 py-3">
                        Min
                      </TableHead>
                      <TableHead className="text-right font-semibold text-slate-600 py-3">
                        Q1
                      </TableHead>
                      <TableHead className="text-right font-semibold text-slate-600 py-3">
                        Median
                      </TableHead>
                      <TableHead className="text-right font-semibold text-slate-600 py-3">
                        Mean
                      </TableHead>
                      <TableHead className="text-right font-semibold text-slate-600 py-3">
                        Std Dev
                      </TableHead>
                      <TableHead className="text-right font-semibold text-slate-600 py-3">
                        Q3
                      </TableHead>
                      <TableHead className="text-right font-semibold text-slate-600 rounded-tr-xl py-3">
                        Max
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {statRows.map((row) => (
                      <TableRow
                        key={`${row.category}-${row.subCategory}`}
                        className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors py-1 cursor-default"
                      >
                        <TableCell className="font-medium text-slate-700 py-3">
                          {row.subCategory}
                        </TableCell>
                        <TableCell className="text-right text-slate-600 py-3">
                          {row.min}
                        </TableCell>
                        <TableCell className="text-right text-slate-600 py-3">
                          {row.q1}
                        </TableCell>
                        <TableCell className="text-right text-slate-600 py-3">
                          {row.median}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-slate-800 py-3 bg-slate-50/50">
                          {row.mean}
                        </TableCell>
                        <TableCell className="text-right text-slate-600 py-3">
                          {row.stdDev}
                        </TableCell>
                        <TableCell className="text-right text-slate-600 py-3">
                          {row.q3}
                        </TableCell>
                        <TableCell className="text-right text-slate-600 py-3">
                          {row.max}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollWrapper>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
