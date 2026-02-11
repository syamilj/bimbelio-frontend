'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  ChartLegend,
  ChartLegendContent,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FetchReturnType, useGet } from '@/lib/fetch-helper/useGet';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { BookOpen, ChevronDown, ChevronUp, Target, Trophy } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts';
import { SectionTitle } from './section-title';

const ColorList = [
  '#0091FF',
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
      <SectionTitle
        icon={Target}
        title="BimArena - Tryout"
      />
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Semua</TabsTrigger>
          <TabsTrigger value="subcategory">Per Subtest</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <ByAllTab fetchingData={fetchingData} />
        </TabsContent>

        <TabsContent value="subcategory">
          <BySubCategoryTab fetchingData={fetchingData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ByAllTab = ({
  fetchingData,
}: {
  fetchingData: FetchReturnType<DataType, any>;
}) => {
  const { mainColor, secondaryColor } = useWebsiteSubCategory();
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: TryoutData } = fetchingData;

  const performanceAll = TryoutData?.overall.scoreHistory;

  const chartData = useMemo(() => {
    return performanceAll?.map((item, index) => ({
      index: index + 1,
      name: `Tryout-${index + 1}`,
      score: item.score,
      rank: item.rank,
      title: item.tryoutTitle,
      date: item.date,
      // Calculate trend line (simple linear regression)
      trend:
        performanceAll.length > 1
          ? ((performanceAll[performanceAll.length - 1].score -
              performanceAll[0].score) /
              (performanceAll.length - 1)) *
              index +
            performanceAll[0].score
          : item.score,
    }));
  }, [performanceAll]);

  if (!TryoutData || !performanceAll) return null;

  const INITIAL_ROWS = 5;
  const performanceAllStats = TryoutData.overall.stats;

  const chartConfigAll = {
    score: {
      label: 'Skor',
      color: mainColor,
    },
    trend: {
      label: 'Trend',
      color: '#94a3b8',
    },
  };

  const displayedData = isExpanded
    ? performanceAll
    : performanceAll.slice(-INITIAL_ROWS);

  return (
    <Card className="bg-white shadow-lg border-0 rounded-3xl overflow-hidden">
      <CardHeader
        className="pb-4 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
        }}
      >
        <div className="relative z-10">
          <CardTitle
            className="text-xl font-bold flex items-center gap-3"
            style={{ color: mainColor }}
          >
            <div
              className="w-10 h-10 rounded-3xl flex items-center justify-center shadow-sm"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <BookOpen
                className="w-5 h-5"
                style={{ color: mainColor }}
              />
            </div>
            Performa Tryout
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            Skor total berdasarkan masing-masing tryout
          </CardDescription>
        </div>
        <div
          className="absolute -right-6 -top-6 w-16 h-16 rounded-full opacity-10"
          style={{ backgroundColor: mainColor }}
        />
      </CardHeader>

      <CardContent className="p-6">
        {performanceAll.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-3xl border-2 border-emerald-100 bg-emerald-50">
                <div className="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-1">
                  Rata-rata
                </div>
                <div className="text-2xl font-black text-emerald-700">
                  {performanceAllStats.avg}
                </div>
              </div>
              <div className="p-4 rounded-3xl border-2 border-blue-100 bg-blue-50">
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">
                  Tertinggi
                </div>
                <div className="text-2xl font-black text-blue-700 flex items-center gap-1">
                  <Trophy className="w-5 h-5" />
                  {performanceAllStats.highest}
                </div>
              </div>
              <div className="p-4 rounded-3xl border-2 border-slate-100 bg-slate-50">
                <div className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                  Terendah
                </div>
                <div className="text-2xl font-black text-slate-700">
                  {performanceAllStats.lowest}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-700">
                Grafik Skor & Trend
              </h3>
              <ChartContainer
                config={chartConfigAll}
                className="h-[250px] w-full"
              >
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="scoreGradient"
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
                    className="stroke-slate-200"
                  />
                  <XAxis
                    dataKey="name"
                    className="text-xs"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    domain={[
                      performanceAllStats.lowest - 50,
                      performanceAllStats.highest + 50,
                    ]}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />

                  <Line
                    type="monotone"
                    dataKey="trend"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Trend"
                  />

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

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-700">
                Riwayat Skor & Peringkat
              </h3>
              <div className="w-full overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow style={{ backgroundColor: `${mainColor}08` }}>
                      <TableHead className="font-bold text-gray-800 py-3">
                        TO
                      </TableHead>
                      <TableHead className="font-bold text-gray-800 py-3">
                        Nama Tryout
                      </TableHead>
                      <TableHead className="font-bold text-gray-800 text-center py-3">
                        Tanggal
                      </TableHead>
                      <TableHead className="font-bold text-gray-800 text-center py-3">
                        Skor
                      </TableHead>
                      <TableHead className="font-bold text-gray-800 text-center py-3">
                        Peringkat
                      </TableHead>
                      <TableHead className="font-bold text-gray-800 text-center py-3">
                        Perubahan
                      </TableHead>
                      <TableHead className="font-bold text-gray-800 text-center py-3">
                        Percentile
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
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
                        <TableRow
                          key={index}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <TableCell className="font-semibold text-gray-900 py-4">
                            TO {performanceAll.length - index}
                          </TableCell>
                          <TableCell className="font-semibold text-gray-900 py-4">
                            {item.tryoutTitle}
                          </TableCell>
                          <TableCell className="text-center py-4 text-sm text-gray-600">
                            {format(new Date(item.date), 'dd MMM yyyy', {
                              locale: localeId,
                            })}
                          </TableCell>
                          <TableCell className="text-center py-4">
                            <div
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-bold"
                              style={{
                                backgroundColor: `${mainColor}15`,
                                color: mainColor,
                              }}
                            >
                              {Math.round(item.score)}
                            </div>
                          </TableCell>
                          <TableCell className="text-center py-4">
                            <div className="flex items-center justify-center gap-1">
                              <Trophy
                                className={`w-4 h-4 ${
                                  item.rank <= 3
                                    ? 'text-yellow-600'
                                    : 'text-blue-600'
                                }`}
                              />
                              <span
                                className={`font-bold ${
                                  item.rank <= 3
                                    ? 'text-yellow-600'
                                    : 'text-blue-600'
                                }`}
                              >
                                #{item.rank}
                              </span>
                              <span className="text-xs text-gray-500">
                                / {item.totalParticipants}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center py-4">
                            {item.rankChange !== 0 && (
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                                  item.rankChange > 0
                                    ? 'bg-emerald-100 text-emerald-600'
                                    : 'bg-red-100 text-red-600'
                                }`}
                              >
                                {item.rankChange > 0 ? '↑' : '↓'}
                                {Math.abs(item.rankChange)}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-center py-4">
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-sm font-bold">
                                Top {rankPercentile}%
                              </span>
                              <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
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
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              {performanceAll.length > INITIAL_ROWS && (
                <div className="mt-4 flex justify-center">
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
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">Data belum ada</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const BySubCategoryTab = ({
  fetchingData,
}: {
  fetchingData: FetchReturnType<DataType, any>;
}) => {
  const { mainColor, secondaryColor } = useWebsiteSubCategory();

  const [isExpanded, setIsExpanded] = useState(false);

  const {
    data: TryoutData,
    isLoading: TryoutDataIsLoading,
    error: TryoutDataError,
  } = fetchingData;

  const performanceAll = TryoutData?.overall.scoreHistory;
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
        label: sub.initial,
        color: ColorList[index % ColorList.length],
      };
    });

    // config['userAvg'] = {
    //   label: 'Kamu',
    //   color: '#000000',
    // };

    // config['allStudentsAvg'] = {
    //   label: 'Semua Siswa',
    //   color: '#94a3b8',
    // };

    return config;
  }, [performanceBySubCategory?.subCategories]);

  if (
    !TryoutData ||
    !performanceAll ||
    !performanceBySubCategory ||
    !SubCategory
  )
    return null;

  const INITIAL_ROWS = 5;

  const lineChartData = performanceBySubCategory.chartData;

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return { bg: 'bg-emerald-100', text: 'text-emerald-700' };
    if (score >= 60) return { bg: 'bg-blue-100', text: 'text-blue-700' };
    if (score >= 40) return { bg: 'bg-yellow-100', text: 'text-yellow-700' };
    return { bg: 'bg-red-100', text: 'text-red-700' };
  };

  const displayedData = isExpanded
    ? performanceBySubCategory.data
    : performanceBySubCategory.data.slice(0, INITIAL_ROWS);
  const hasMoreData = performanceBySubCategory.data.length > INITIAL_ROWS;
  return (
    <Card className="bg-white shadow-lg border-0 rounded-3xl overflow-hidden">
      <CardHeader
        className="pb-4 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
        }}
      >
        <div className="relative z-10">
          <CardTitle
            className="text-xl font-bold flex items-center gap-3"
            style={{ color: mainColor }}
          >
            <div
              className="w-10 h-10 rounded-3xl flex items-center justify-center shadow-sm"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <BookOpen
                className="w-5 h-5"
                style={{ color: mainColor }}
              />
            </div>
            Performa Tryout per Subkategori
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            Skor total berdasarkan masing-masing tryout dan subkategorinya
          </CardDescription>
        </div>
        <div
          className="absolute -right-6 -top-6 w-16 h-16 rounded-full opacity-10"
          style={{ backgroundColor: mainColor }}
        />
      </CardHeader>

      <CardContent className="p-6">
        <div className="relative">
          <div
            className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 pb-2 md:pb-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style>{`.filter-chips::-webkit-scrollbar { display: none; }`}</style>
            <div className="filter-chips flex gap-1.5 md:gap-2 mb-3 md:mb-4 min-w-max md:min-w-0 md:flex-wrap">
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
                    'px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold transition-all border flex-shrink-0',
                    selectedSubtests.includes(sub.id)
                      ? 'text-white border-transparent'
                      : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300',
                  )}
                  style={
                    selectedSubtests.includes(sub.id)
                      ? { backgroundColor: sub.color }
                      : {}
                  }
                >
                  {sub.initial}
                </button>
              ))}
            </div>
          </div>
        </div>
        <ChartContainer
          config={chartConfigBySub}
          className="h-[280px] md:h-[350px] w-full"
        >
          <LineChart
            data={lineChartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
            />
            <XAxis
              dataKey="tryout"
              tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis
              domain={[0, 1000]}
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />

            {SubCategory.filter((sub) => {
              return selectedSubtests.includes(sub.id);
              // return true;
            }).map((sub, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={sub.id}
                stroke={sub.color}
                strokeWidth={2}
                dot={{ r: 4, fill: sub.color }}
                activeDot={{ r: 6 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ChartContainer>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700 mb-2">
            <span className="font-semibold">Keterangan Inisial:</span>
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {SubCategory.map((subCat) => (
              <div
                key={subCat.id}
                className="text-xs"
              >
                <span
                  className="inline-block w-3 h-3 mr-2 rounded-full"
                  style={{ backgroundColor: subCat.color }}
                ></span>
                <span className="font-semibold">{subCat.initial}</span> ={' '}
                {subCat.name}
              </div>
            ))}
          </div>
        </div>
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow style={{ backgroundColor: `${mainColor}08` }}>
                <TableHead className="font-bold text-gray-800 py-3">
                  To
                </TableHead>
                <TableHead className="font-bold text-gray-800 py-3">
                  Tryout
                </TableHead>
                <TableHead className="font-bold text-gray-800 py-3 text-center">
                  Final Score
                </TableHead>
                {performanceBySubCategory.subCategories.map((subCat) => (
                  <TableHead
                    key={subCat.id}
                    className="font-bold text-gray-800 text-center py-3 hover:underline cursor-help"
                    title={subCat.name}
                  >
                    {subCat.initial}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={performanceBySubCategory.subCategories.length + 2}
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
          <div className="mt-4 flex justify-center">
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
      </CardContent>
    </Card>
  );
};

const LoadingPage = () => {
  return (
    <div>
      <SectionTitle
        icon={BookOpen}
        title="BimArena - Tryout"
      />
      <Skeleton className="w-full h-[1200px] md:h-[670px]" />
    </div>
  );
};

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
