"use client";

import { useWebsiteSubCategory } from "@/components/provider/provider-website-category";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FetchReturnType, useGet } from "@/lib/fetch-helper/useGet";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Target,
  Trophy,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  XAxis,
  YAxis,
} from "recharts";
import { getSubtestLabel } from "@/lib/utils/subtest";
import {
  EmptyState,
  getScoreBadgeColor,
  HeroBanner,
  SectionLabel,
  StatPill,
} from "./_primitives";
import { SectionTitle } from "./section-title";

const ColorList = [
  "#0091FF",
  "#22c55e",
  "#eab308",
  "#ef4444",
  "#6366f1",
  "#a855f7",
  "#f97316",
];

export const TryoutAnalyticsTable = () => {
  const { id } = useParams<{ id: string | undefined }>();

  const fetchingData = useGet<DataType>(
    "/learningAnalytics/getUserAnalyticsTryout",
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
      <SectionTitle icon={Target} title="BimArena - Tryout" />
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
        item.tryoutTitle.length > 12
          ? `TO ${index + 1}`
          : item.tryoutTitle,
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
    score: { label: "Skor", color: mainColor },
    benar: { label: "Benar", color: "#10B981" },
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
      <HeroBanner color={mainColor}>
        <SectionLabel title="Performa Tryout" sub="Skor total berdasarkan masing-masing tryout" />
        <div className="grid grid-cols-3 gap-2 mt-3">
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
        </div>
      </HeroBanner>

      {/* Chart */}
      <div className="px-5 pt-4 pb-2">
        <SectionLabel title="Grafik Skor" sub="Klik titik untuk detail B/S/K" />
        <ChartContainer
          config={chartConfigAll}
          className="h-[240px] md:h-[280px] w-full mt-2"
        >
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 35, left: 0, bottom: 10 }}
          >
            <defs>
              <linearGradient
                id="biminsightTryoutScoreGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={mainColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={mainColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="shortName"
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={50}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 10, fill: "#10B981" }}
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
                    return p?.name || "";
                  }}
                  formatter={(value, name, item) => {
                    if (name === "score") {
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
                    if (name === "benar") {
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
              fill="url(#biminsightTryoutScoreGradient)"
              dot={{
                fill: mainColor,
                r: 4,
                strokeWidth: 2,
                stroke: "#fff",
              }}
              activeDot={{
                r: 6,
                fill: mainColor,
                stroke: "#fff",
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
                fill: "#10B981",
                r: 3,
                strokeWidth: 2,
                stroke: "#fff",
              }}
              activeDot={{
                r: 5,
                fill: "#10B981",
                stroke: "#fff",
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
      <div className="px-5 pb-5">
        <SectionLabel title="Riwayat Skor & Peringkat" />
        <div
          className="flex gap-3 overflow-x-auto pb-3 mt-3"
          style={{ scrollbarWidth: "none" }}
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
                className="flex-shrink-0 w-[300px] p-2.5 rounded-3xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-800 truncate">
                      {item.tryoutTitle}
                    </p>
                    <p className="text-xs text-slate-500">
                      {format(new Date(item.date), "dd MMM yyyy", {
                        locale: localeId,
                      })}
                    </p>
                  </div>
                </div>
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
                        item.rank <= 3 ? "bg-yellow-100" : "bg-blue-50"
                      }`}
                    >
                      <Trophy
                        className={`w-5 h-5 ${
                          item.rank <= 3
                            ? "text-yellow-600"
                            : "text-blue-600"
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
                              ? "text-yellow-600"
                              : "text-blue-600"
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
                                ? "text-emerald-600"
                                : "text-red-600"
                            }`}
                          >
                            {item.rankChange > 0 ? "\u2191" : "\u2193"}
                            {Math.abs(item.rankChange)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      Top {rankPercentile}%
                    </span>
                    <span className="text-slate-600 font-bold">
                      {item.totalParticipants - item.rank} peserta dibawah
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${rankPercentile}%`,
                        backgroundColor:
                          item.rankChange > 0
                            ? "#10b981"
                            : item.rankChange < 0
                              ? "#ef4444"
                              : mainColor,
                      }}
                    />
                  </div>
                </div>
                {item.benar != null && (
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold">
                    <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {item.benar}B
                    </span>
                    <span className="text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                      {item.salah}S
                    </span>
                    <span className="text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {item.kosong}K
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
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
  const { mainColor } = useWebsiteSubCategory();
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    data: TryoutData,
  } = fetchingData;

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

  const chartConfigBySub: ChartConfig = useMemo(() => {
    const config: ChartConfig = {};
    performanceBySubCategory?.subCategories.forEach((sub, index) => {
      config[sub.id] = {
        label: getSubtestLabel(sub.name, sub.website_sub_category_id),
        color: ColorList[index % ColorList.length],
      };
    });
    return config;
  }, [performanceBySubCategory?.subCategories]);

  if (!TryoutData || !performanceBySubCategory || !SubCategory) return null;

  const INITIAL_ROWS = 5;
  const lineChartData = performanceBySubCategory.chartData;

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
      <div className="relative">
        <div
          className="overflow-x-auto -mx-5 px-5 pb-1"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex gap-1.5 min-w-max md:min-w-0 md:flex-wrap">
            {SubCategory.map((sub, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedSubtests((prev) =>
                    prev.includes(sub.id)
                      ? prev.filter((c) => c !== sub.id)
                      : [...prev, sub.id],
                  );
                }}
                className={cn(
                  "px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold transition-all border flex-shrink-0",
                  selectedSubtests.includes(sub.id)
                    ? "text-white border-transparent"
                    : "bg-white text-slate-400 border-slate-200 hover:border-slate-300",
                )}
                style={
                  selectedSubtests.includes(sub.id)
                    ? { backgroundColor: sub.color }
                    : {}
                }
              >
                {getSubtestLabel(sub.name, sub.website_sub_category_id)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <ChartContainer
        config={chartConfigBySub}
        className="h-[260px] md:h-[300px] w-full"
      >
        <BarChart
          data={lineChartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
          barCategoryGap="20%"
          barGap={2}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f1f5f9"
            vertical={false}
          />
          <XAxis
            dataKey="tryout"
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
            interval={0}
            angle={-20}
            textAnchor="end"
            height={50}
          />
          <YAxis
            domain={["auto", "auto"]}
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(label) => String(label)}
                formatter={(value, name) => {
                  const sub = SubCategory.find((s) => s.id === name);
                  const label = sub
                    ? getSubtestLabel(sub.name, sub.website_sub_category_id)
                    : String(name);
                  const color = sub?.color ?? "#888";
                  return (
                    <>
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-muted-foreground">{label}</span>
                      <span className="ml-auto font-mono font-medium tabular-nums">
                        {value}
                      </span>
                    </>
                  );
                }}
              />
            }
          />
          <ChartLegend content={<ChartLegendContent />} />
          {SubCategory.filter((sub) =>
            selectedSubtests.includes(sub.id),
          ).map((sub, index) => (
            <Bar
              key={index}
              dataKey={sub.id}
              fill={sub.color}
              maxBarSize={18}
              radius={[3, 3, 0, 0]}
            />
          ))}
        </BarChart>
      </ChartContainer>

      {/* Legend table */}
      <div className="p-3 bg-slate-50 border border-slate-100 rounded-3xl">
        <p className="text-xs font-bold text-slate-700 mb-2">
          Keterangan Inisial:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
          {SubCategory.map((subCat) => (
            <div key={subCat.id} className="text-xs">
              <span
                className="inline-block w-3 h-3 mr-2 rounded-full"
                style={{ backgroundColor: subCat.color }}
              ></span>
              <span className="font-semibold">
                {getSubtestLabel(subCat.name, subCat.website_sub_category_id)}
              </span>{" "}
              = {subCat.name}
            </div>
          ))}
        </div>
      </div>

      {/* Score table */}
      <div className="w-full overflow-x-auto rounded-3xl border border-slate-100">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-bold text-slate-700 py-3">
                To
              </TableHead>
              <TableHead className="font-bold text-slate-700 py-3">
                Tryout
              </TableHead>
              <TableHead className="font-bold text-slate-700 py-3 text-center">
                Final Score
              </TableHead>
              {performanceBySubCategory.subCategories.map((subCat) => (
                <TableHead
                  key={subCat.id}
                  className="font-bold text-slate-700 text-center py-3 hover:underline cursor-help"
                  title={subCat.name}
                >
                  {getSubtestLabel(
                    subCat.name,
                    subCat.website_sub_category_id,
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    performanceBySubCategory.subCategories.length + 3
                  }
                  className="text-center py-8 text-gray-500"
                >
                  <p className="text-sm">Data belum ada</p>
                </TableCell>
              </TableRow>
            ) : (
              [...displayedData].reverse().map((tryout, index) => (
                <TableRow
                  key={tryout.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="font-semibold text-gray-900 py-4 whitespace-nowrap">
                    TO {displayedData.length - index}
                  </TableCell>
                  <TableCell className="font-semibold text-gray-900 py-4 whitespace-nowrap">
                    {tryout.title}
                  </TableCell>
                  <TableCell className="text-center py-4">
                    {tryout.totalScore.toFixed(2)}
                  </TableCell>
                  {performanceBySubCategory.subCategories.map((subCat) => {
                    const subCatData = tryout.subCategories.find(
                      (s) => s.id === subCat.id,
                    );
                    const score = subCatData?.totalScore || 0;
                    const badgeColor = getScoreBadgeColor(score);

                    return (
                      <TableCell
                        key={`${tryout.id}-${subCat.id}`}
                        className="text-center py-4"
                      >
                        <Badge
                          className={`${badgeColor.bg} ${badgeColor.text} border-0 font-semibold`}
                        >
                          {score.toFixed(2)}
                        </Badge>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
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
    <SectionTitle icon={Target} title="BimArena - Tryout" />
    <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-48" />
        <div className="grid grid-cols-3 gap-2">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
        <Skeleton className="h-[260px] w-full rounded-xl" />
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
