'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
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
import { FetchReturnType, useGet } from '@/lib/fetch-helper/useGet';
import { getSubtestLabel } from '@/lib/utils/subtest';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { BookOpen, ChevronDown, ChevronUp, Target, Trophy } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  LabelList,
  Line,
  XAxis,
  YAxis,
} from 'recharts';
import {
  EmptyState,
  FilterChip,
  HeatmapCell,
  HeroBanner,
  InsightBanner,
  ScrollRow,
  ScrollWrapper,
  SectionLabel,
  StatPill,
  SubtestTooltipHeader,
} from './_primitives';

const ColorList = [
  '#0066FF',
  '#22c55e',
  '#eab308',
  '#ef4444',
  '#6366f1',
  '#a855f7',
  '#f97316',
];

export const TryoutAnalyticsTable = () => {
  const { id } = useParams<{ id: string | undefined }>();

  const fetchingData = useGet<DataType>(
    '/learningAnalytics/getUserAnalyticsTryout',
    {
      params: {
        userId: id ? id : undefined,
      },
      useEffectDependencies: [id],
    },
  );

  const {
    data: TryoutData,
    isLoading: TryoutDataIsLoading,
    error: TryoutDataError,
  } = fetchingData;

  if (TryoutDataIsLoading) return <LoadingPage />;
  if (!TryoutData) return null;

  if (TryoutDataError) {
    return <div>Error: {TryoutDataError.message}</div>;
  }

  return (
    <div>
      <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <OverallSection fetchingData={fetchingData} />
        <div className="border-t border-slate-100" />
        <SubtestSection fetchingData={fetchingData} />
      </div>
    </div>
  );
};

// =============================================================================
// 1. Overall Section (hero + chart + rank cards)
// =============================================================================

const OverallSection = ({
  fetchingData,
}: {
  fetchingData: FetchReturnType<DataType, any>;
}) => {
  const { mainColor } = useWebsiteSubCategory();
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: TryoutData } = fetchingData;

  const performanceAll = TryoutData?.overall.scoreHistory;

  const chartData = useMemo(() => {
    return performanceAll?.map((item, index) => ({
      index: index + 1,
      name: item.tryoutTitle,
      shortName:
        item.tryoutTitle.length > 12 ? `TO ${index + 1}` : item.tryoutTitle,
      score: item.score,
      rank: item.rank,
      date: item.date,
      benar: item.benar,
      salah: item.salah,
      kosong: item.kosong,
    }));
  }, [performanceAll]);

  if (!TryoutData || !performanceAll) return null;

  const INITIAL_ROWS = 5;
  const stats = TryoutData.overall.stats;

  const chartConfigAll: ChartConfig = {
    score: { label: 'Skor', color: mainColor },
    benar: { label: 'Benar', color: '#10B981' },
  };

  const displayedData = isExpanded
    ? performanceAll
    : performanceAll.slice(-INITIAL_ROWS);

  if (performanceAll.length === 0) {
    return (
      <div className="p-6">
        <EmptyState
          icon={BookOpen}
          title="Belum Ada Data"
          description="Belum ada tryout yang dikerjakan"
        />
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <HeroBanner>
        <SectionLabel
          title="Performa Tryout"
          sub="Skor total berdasarkan masing-masing tryout"
        />
        <ScrollRow className="mt-3">
          <StatPill
            label="Rata-rata"
            value={String(stats.avg)}
            sub="keseluruhan"
            icon={<Target className="h-3.5 w-3.5" />}
            color={mainColor}
          />
          <StatPill
            label="Tertinggi"
            value={String(stats.highest)}
            sub="best score"
            icon={<Trophy className="h-3.5 w-3.5" />}
            color="#22c55e"
          />
          <StatPill
            label="Terendah"
            value={String(stats.lowest)}
            sub="worst score"
            icon={<ChevronDown className="h-3.5 w-3.5" />}
            color="#ef4444"
          />
        </ScrollRow>
      </HeroBanner>

      {/* Insight */}
      <div className="px-5 pt-3">
        <InsightBanner
          tone={
            stats.trend > 0
              ? 'success'
              : stats.trend < 0
                ? 'warning'
                : 'neutral'
          }
        >
          {stats.trend > 0
            ? `Skor rata-rata ${stats.avg.toFixed(0)} dengan tren naik +${stats.trend.toFixed(0)} — pertahankan momentum!`
            : stats.trend < 0
              ? `Skor rata-rata ${stats.avg.toFixed(0)} dengan tren turun ${stats.trend.toFixed(0)} — evaluasi strategi belajarmu.`
              : `Skor rata-rata ${stats.avg.toFixed(0)} — konsistensi stabil, coba tingkatkan di area yang lemah.`}
        </InsightBanner>
      </div>

      {/* Chart */}
      <div className="px-5 pt-3 pb-0 w-full min-w-0">
        <SectionLabel
          title="Grafik Skor"
          sub="Klik titik untuk detail B/S/K"
        />
        <ChartContainer
          config={chartConfigAll}
          className="aspect-auto h-[200px] md:h-[240px] w-full mt-2"
        >
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 45, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="biminsightTryoutScoreGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={mainColor}
                  stopOpacity={0.3}
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
              dataKey="shortName"
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
              interval={0}
              angle={-25}
              textAnchor="end"
              height={30}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 10, fill: '#94a3b8' }}
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
                    const p = payload?.[0]?.payload as {
                      name?: string;
                    };
                    return p?.name || '';
                  }}
                  formatter={(value, name, item) => {
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
                        item as {
                          payload: {
                            benar?: number;
                            salah?: number;
                            kosong?: number;
                          };
                        }
                      )?.payload;
                      return (
                        <>
                          <div className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-emerald-500" />
                          <span className="text-muted-foreground font-semibold">
                            B/S/K
                          </span>
                          <span className="ml-auto font-mono font-medium flex items-center gap-1">
                            <span className="text-emerald-600 dark:text-emerald-500">
                              {p?.benar ?? value}
                            </span>
                            <span className="text-slate-400">/</span>
                            <span className="text-red-500 dark:text-red-400">
                              {p?.salah ?? 0}
                            </span>
                            <span className="text-slate-400">/</span>
                            <span className="text-slate-400 dark:text-slate-500">
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
              fill="url(#biminsightTryoutScoreGradient)"
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
                formatter={(v: unknown) => `\u2713${v}`}
              />
            </Line>
          </AreaChart>
        </ChartContainer>
      </div>

      {/* Rank cards */}
      <div className="px-5 pb-5 w-full min-w-0 flex flex-col relative">
        <SectionLabel title="Riwayat Skor & Peringkat" />
        <ScrollRow
          className="mt-3"
          noGrid
        >
          {[...displayedData].reverse().map((item, index) => {
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
                className="w-[260px] flex-[0_0_auto] rounded-3xl border border-slate-200/80 bg-white p-3 shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-2 flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-800">
                      {item.tryoutTitle}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {format(new Date(item.date), 'dd MMM yyyy', {
                        locale: localeId,
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex flex-1 items-center gap-2">
                    <div
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-3xl"
                      style={{ backgroundColor: `${mainColor}15` }}
                    >
                      <Target
                        className="h-4 w-4"
                        style={{ color: mainColor }}
                      />
                    </div>
                    <div>
                      <div className="text-[10px] font-medium text-slate-400">
                        Skor
                      </div>
                      <div
                        className="text-base font-black"
                        style={{ color: mainColor }}
                      >
                        {Math.round(item.score)}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-1 items-center gap-2">
                    <div
                      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-3xl ${
                        item.rank <= 3 ? 'bg-yellow-100' : 'bg-blue-50'
                      }`}
                    >
                      <Trophy
                        className={`h-4 w-4 ${
                          item.rank <= 3 ? 'text-yellow-600' : 'text-blue-600'
                        }`}
                      />
                    </div>
                    <div>
                      <div className="text-[10px] font-medium text-slate-400">
                        Peringkat
                      </div>
                      <div className="flex items-center gap-1">
                        <span
                          className={`text-base font-black ${
                            item.rank <= 3 ? 'text-yellow-600' : 'text-blue-600'
                          }`}
                        >
                          #{item.rank}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          / {item.totalParticipants}
                        </span>
                        {item.rankChange !== 0 && (
                          <span
                            className={`ml-0.5 text-[10px] font-bold ${
                              item.rankChange > 0
                                ? 'text-emerald-600'
                                : 'text-red-600'
                            }`}
                          >
                            {item.rankChange > 0 ? '\u2191' : '\u2193'}
                            {Math.abs(item.rankChange)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-2.5 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">
                      Top {rankPercentile}%
                    </span>
                    <span className="font-bold text-slate-500">
                      {item.totalParticipants - item.rank} peserta dibawah
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
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
                {item.benar != null && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] font-bold">
                    <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-emerald-600">
                      {item.benar}B
                    </span>
                    <span className="rounded-full bg-red-50 px-1.5 py-0.5 text-red-500">
                      {item.salah}S
                    </span>
                    <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-slate-400">
                      {item.kosong}K
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </ScrollRow>
        {performanceAll.length > INITIAL_ROWS && (
          <div className="mt-2 flex justify-center">
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              variant="outline"
              className="gap-2"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Tampilkan Lebih Sedikit
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Lihat Semua ({performanceAll.length})
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// =============================================================================
// 2. Subtest Section (filter chips + bar chart + table)
// =============================================================================

const SubtestSection = ({
  fetchingData,
}: {
  fetchingData: FetchReturnType<DataType, any>;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: TryoutData } = fetchingData;

  const performanceBySubCategory = TryoutData?.bySubCategory;

  const SubCategory = useMemo(
    () =>
      performanceBySubCategory?.subCategories.map((sub, index) => ({
        ...sub,
        color: ColorList[index % ColorList.length],
      })),
    [performanceBySubCategory?.subCategories],
  );
  const [selectedSubtests, setSelectedSubtests] = useState<string[]>([]);

  useEffect(() => {
    if (SubCategory) {
      setSelectedSubtests(SubCategory.map((sub) => sub.id));
    }
  }, [SubCategory]);

  if (!TryoutData || !performanceBySubCategory || !SubCategory) return null;

  const INITIAL_ROWS = 5;

  const displayedData = isExpanded
    ? performanceBySubCategory.data
    : performanceBySubCategory.data.slice(0, INITIAL_ROWS);
  const hasMoreData = performanceBySubCategory.data.length > INITIAL_ROWS;

  return (
    <div className="px-5 py-5 space-y-4">
      <SectionLabel
        title="Performa per Subtest"
        sub="Skor berdasarkan masing-masing tryout dan subkategorinya"
      />

      {/* Filter chips */}
      <ScrollWrapper className="-mx-5 px-5 pb-1">
        <div className="flex min-w-max gap-1.5 md:min-w-0 md:flex-wrap">
          {SubCategory.map((sub, index) => (
            <FilterChip
              key={index}
              label={getSubtestLabel(sub.name, sub.website_sub_category_id)}
              active={selectedSubtests.includes(sub.id)}
              color={sub.color}
              onClick={() => {
                setSelectedSubtests((prev) =>
                  prev.includes(sub.id)
                    ? prev.filter((c) => c !== sub.id)
                    : [...prev, sub.id],
                );
              }}
            />
          ))}
        </div>
      </ScrollWrapper>

      {/* Heatmap score table */}
      <ScrollWrapper className="w-full rounded-3xl border border-slate-200/80">
        <Table
          className="min-w-max"
          classNameWrapper="overflow-visible"
        >
          <TableHeader>
            <TableRow className="bg-slate-50/80">
              <TableHead className="py-3 font-bold text-slate-700">
                TO
              </TableHead>
              <TableHead className="py-3 font-bold text-slate-700">
                Tryout
              </TableHead>
              <TableHead className="py-3 text-center font-bold text-slate-700">
                Total
              </TableHead>
              {performanceBySubCategory.subCategories
                .filter((s) => selectedSubtests.includes(s.id))
                .map((subCat) => (
                  <SubtestTooltipHeader
                    key={subCat.id}
                    initial={getSubtestLabel(
                      subCat.name,
                      subCat.website_sub_category_id,
                    )}
                    fullName={subCat.name}
                  />
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={selectedSubtests.length + 3}
                  className="py-8 text-center text-gray-500"
                >
                  <p className="text-sm">Data belum ada</p>
                </TableCell>
              </TableRow>
            ) : (
              [...displayedData].reverse().map((tryout, index) => (
                <TableRow
                  key={tryout.id}
                  className="transition-colors hover:bg-slate-50/50"
                >
                  <TableCell className="whitespace-nowrap py-3 font-semibold text-slate-800">
                    TO {displayedData.length - index}
                  </TableCell>
                  <TableCell className="max-w-[140px] truncate py-3 text-sm text-slate-600">
                    {tryout.title}
                  </TableCell>
                  <HeatmapCell score={tryout.totalScore} />
                  {performanceBySubCategory.subCategories
                    .filter((s) => selectedSubtests.includes(s.id))
                    .map((subCat) => {
                      const subCatData = tryout.subCategories.find(
                        (s) => s.id === subCat.id,
                      );
                      return (
                        <HeatmapCell
                          key={`${tryout.id}-${subCat.id}`}
                          score={subCatData?.totalScore || 0}
                        />
                      );
                    })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollWrapper>
      {hasMoreData && (
        <div className="flex justify-center">
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="outline"
            className="gap-2"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Tampilkan Lebih Sedikit
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Lihat Semua ({performanceBySubCategory.data.length})
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// Loading
// =============================================================================

const LoadingPage = () => (
  <div>
    <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-48" />
        <ScrollRow>
          <Skeleton className="h-16 rounded-3xl" />
          <Skeleton className="h-16 rounded-3xl" />
          <Skeleton className="h-16 rounded-3xl" />
        </ScrollRow>
        <Skeleton className="h-[260px] w-full rounded-3xl" />
      </div>
    </div>
  </div>
);

// =============================================================================
// Types
// =============================================================================

type DataType = {
  overall: {
    stats: {
      avg: number;
      highest: number;
      lowest: number;
      trend: number;
    };
    scoreHistory: {
      date: Date;
      score: number;
      tryoutTitle: string;
      rank: number;
      totalParticipants: number;
      rankChange: number;
      benar: number;
      salah: number;
      kosong: number;
    }[];
  };
  bySubCategory: {
    subCategories: {
      initial: string;
      id: string;
      name: string;
      website_sub_category_id: string;
      categoryId: string;
    }[];
    data: {
      id: string;
      title: string;
      totalScore: number;
      subCategories: {
        id: string;
        name: string;
        initial: string;
        totalScore: number;
        averageScore: number;
      }[];
    }[];
    chartData: Record<string, string | number>[];
  };
};
