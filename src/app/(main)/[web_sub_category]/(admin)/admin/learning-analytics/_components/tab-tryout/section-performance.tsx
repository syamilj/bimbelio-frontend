'use client';

import { BookOpen, ChevronDown, ChevronUp, Trophy } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// import AbsoluteLoader from '@/components/ui/loading/absolute-loader';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import {
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FetchReturnType, useGet } from '@/lib/fetch-helper/useGet';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Area, AreaChart, CartesianGrid, Line, XAxis, YAxis } from 'recharts';

export const SectionPerformance = () => {
  const fetchingData = useGet<DataType>(
    '/learningAnalytics/getAnalyticsTryout',
    {},
  );

  const { error: TryoutDataError } = fetchingData;

  if (TryoutDataError) {
    return <div>Error: {TryoutDataError.message}</div>;
  }

  return (
    <Tabs defaultValue="all">
      <TabsList>
        <TabsTrigger value="all">Semua</TabsTrigger>
        <TabsTrigger value="subcategory">Per Subtest</TabsTrigger>
      </TabsList>
      <TabsContent value="subcategory">
        <BySubCategoryTab fetchingData={fetchingData} />
      </TabsContent>

      <TabsContent value="all">
        <ByAllTab fetchingData={fetchingData} />
      </TabsContent>
    </Tabs>
  );
};

const ByAllTab = ({
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

  const chartData = useMemo(() => {
    return performanceAll?.map((item, index) => ({
      index: index + 1,
      name: `TO ${index + 1}`,
      score: item.score,
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

  if (TryoutDataIsLoading)
    return <Skeleton className="w-full h-[1200px] md:h-[670px]" />;

  if (!TryoutData || !performanceAll) return null;

  if (TryoutDataError) {
    return <div>Error: {TryoutDataError.message}</div>;
  }

  const INITIAL_ROWS = 5;
  const performanceAllStats = TryoutData.overall.stats;

  const chartConfig = {
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
            {/* Stats Summary */}
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

            {/* Score Line Chart with Trend */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-700">
                Grafik Skor & Trend
              </h3>
              <ChartContainer
                config={chartConfig}
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...displayedData].reverse().map((item, index) => {
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
            {/* <div className="w-32 h-32 mx-auto mb-3">
                    <EmptyStateIllustrations.NoPerformance />
                  </div>
                  <h3 className="text-lg font-black text-slate-800 mb-2">
                    {searchQuery ? "Tidak ada hasil" : "Belum Ada Data Performa"}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">
                    {searchQuery ? "Coba kata kunci lain" : <>Selesaikan <BimArena /> untuk melihat grafik performa</>}
                  </p> */}
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

  if (TryoutDataIsLoading)
    return <Skeleton className="w-full h-[1200px] md:h-[670px]" />;

  if (!TryoutData) return null;

  if (TryoutDataError) {
    return <div>Error: {TryoutDataError.message}</div>;
  }

  const INITIAL_ROWS = 5;

  const performanceBySubCategory = TryoutData.bySubCategory;

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
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700 mb-2">
            <span className="font-semibold">Keterangan Inisial:</span>
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {performanceBySubCategory.subCategories.map((subCat) => (
              <div
                key={subCat.id}
                className="text-xs"
              >
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
                displayedData.map((tryout) => (
                  <TableRow
                    key={tryout.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
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
      // rank: number;
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
  };
};
