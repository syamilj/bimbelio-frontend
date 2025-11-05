import { useLeaderboardContext } from '@/app/[web_sub_category]/(user)/user/leaderboard/_components/provider-leaderboard';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
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
import { IconCircleLoop, IconUserAdmin } from '@/styles/icon';
import { BarChart2, BookOpen, TrendingDown, TrendingUp } from 'lucide-react';
import React, { Fragment } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

export function RankingStats() {
  const { RankingTryoutIsLoading } = useLeaderboardContext();
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors from the selected category
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  // const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const TabsItem = [
    {
      title: 'Ringkasan',
      value: 'summary',
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      title: 'Statistik',
      value: 'statistics',
      icon: <BarChart2 className="h-4 w-4" />,
    },
    {
      title: 'Analisis',
      value: 'subjects',
      icon: <BookOpen className="h-4 w-4" />,
    },
  ];

  return (
    <Card className="bg-white shadow-sm border-2 border-gray-100 rounded-3xl overflow-hidden">
      <CardHeader className="pb-6 border-b-2 border-gray-100">
        <div>
          <CardTitle className="text-xl font-black text-gray-900 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm"
              style={{ backgroundColor: mainColor }}
            >
              <BarChart2 className="w-5 h-5 text-white" />
            </div>
            Analisis Performa
          </CardTitle>
          <CardDescription className="text-sm mt-2 text-gray-500 font-medium">
            Statistik dan analisis mendalam dari hasil try out
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <Tabs
          defaultValue="summary"
          className="w-full"
        >
          {/* Clean Simple Tabs */}
          <TabsList className="grid w-full grid-cols-3 mb-6 md:mb-8 bg-gray-50 rounded-xl p-1 h-11 md:h-12 border-0">
            {TabsItem.map((tab, index) => (
              <React.Fragment key={index}>
                {!RankingTryoutIsLoading ? (
                  <TabsTrigger
                    value={tab.value}
                    className="flex items-center gap-2 rounded-lg px-3 md:px-4 py-2 text-xs md:text-sm font-medium transition-all duration-200 text-gray-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
                    style={
                      {
                        '--tw-bg-opacity': '1',
                      } as React.CSSProperties & { [key: string]: string }
                    }
                    data-active-bg={mainColor}
                  >
                    {tab.icon}
                    <span className="hidden sm:inline font-medium">
                      {tab.title}
                    </span>
                  </TabsTrigger>
                ) : (
                  <Skeleton className="h-9 md:h-10 w-full rounded-lg" />
                )}
              </React.Fragment>
            ))}
          </TabsList>

          {/* Tab Contents */}
          <TabsContent
            value="summary"
            className="mt-0"
          >
            <Summary />
          </TabsContent>
          <TabsContent
            value="statistics"
            className="mt-0"
          >
            <Statistics />
          </TabsContent>
          <TabsContent
            value="subjects"
            className="mt-0"
          >
            <AnalysisSubject />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

const Summary = () => {
  const { RankingTryout, RankingTryoutIsLoading } = useLeaderboardContext();
  // const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  // const mainColor = websiteSubCategory?.main_color || '#0091FF';

  const summaryCards = [
    {
      title: 'Total Peserta',
      value: RankingTryout?.totalParticipants || 0,
      description: 'Peserta yang mengikuti try out',
      icon: <IconUserAdmin className="w-6 h-6" />,
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
    },
    {
      title: 'Rata-rata Nilai',
      value: RankingTryout?.averageScore?.toFixed(1) || '0',
      description: 'Nilai rata-rata semua peserta',
      icon: <IconCircleLoop className="w-6 h-6" />,
      gradient: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
    },
    {
      title: 'Nilai Tertinggi',
      value: RankingTryout?.topScore?.toFixed(1) || '0',
      description: 'Nilai terbaik yang dicapai',
      icon: <TrendingUp className="w-6 h-6" />,
      gradient: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-700',
    },
    {
      title: 'Nilai Terendah',
      value: RankingTryout?.bottomScore?.toFixed(1) || '0',
      description: 'Nilai terendah yang dicapai',
      icon: <TrendingDown className="w-6 h-6" />,
      gradient: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      textColor: 'text-gray-700',
    },
  ];

  return (
    <Fragment>
      {!RankingTryoutIsLoading ? (
        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((card, index) => (
            <Card
              key={index}
              className={cn(
                'border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl overflow-hidden',
                card.bgColor,
                card.borderColor,
              )}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 md:pb-3">
                <CardTitle
                  className={cn(
                    'text-xs md:text-sm font-semibold',
                    card.textColor,
                  )}
                >
                  {card.title}
                </CardTitle>
                <div
                  className={cn(
                    'w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center bg-linear-to-br text-white shadow-sm',
                    card.gradient,
                  )}
                >
                  {card.icon}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 md:mb-2">
                  {card.value}
                </div>
                <p
                  className={cn(
                    'text-xs md:text-sm font-medium opacity-80',
                    card.textColor,
                  )}
                >
                  {card.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-28 md:h-36 w-full rounded-xl"
            />
          ))}
        </div>
      )}
    </Fragment>
  );
};

const Statistics = () => {
  const { RankingTryout, RankingTryoutIsLoading } = useLeaderboardContext();
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  const chartConfig = {
    count: {
      label: 'Jumlah Peserta',
      color: mainColor,
    },
  };

  return (
    <div className="space-y-8">
      {!RankingTryoutIsLoading ? (
        <div className="grid grid-cols-1 gap-8">
          {/* Statistics Table */}
          <Card className="border-2 border-gray-100 rounded-2xl shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${mainColor}15` }}
                >
                  <BarChart2
                    className="w-4 h-4"
                    style={{ color: mainColor }}
                  />
                </div>
                Statistik Detail
              </CardTitle>
              <CardDescription className="text-base">
                Ringkasan statistik untuk setiap komponen tes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow
                      className="border-b-2"
                      style={{ backgroundColor: `${mainColor}08` }}
                    >
                      <TableHead className="w-[200px] font-bold text-gray-800">
                        Mata Pelajaran
                      </TableHead>
                      <TableHead className="text-right font-bold text-gray-800">
                        Min
                      </TableHead>
                      <TableHead className="text-right font-bold text-gray-800">
                        Q1
                      </TableHead>
                      <TableHead className="text-right font-bold text-gray-800">
                        Median
                      </TableHead>
                      <TableHead className="text-right font-bold text-gray-800">
                        Mean
                      </TableHead>
                      <TableHead className="text-right font-bold text-gray-800">
                        Std Dev
                      </TableHead>
                      <TableHead className="text-right font-bold text-gray-800">
                        Q3
                      </TableHead>
                      <TableHead className="text-right font-bold text-gray-800">
                        Max
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {RankingTryout?.StatisticsCategory?.map((stat, index) => (
                      <Fragment key={index}>
                        <TableRow className="bg-gray-50/80 font-medium border-b-2 border-gray-100">
                          <TableCell
                            className="font-bold py-4"
                            style={{ color: mainColor }}
                          >
                            {stat.category}
                          </TableCell>
                          <TableCell
                            colSpan={7}
                            className="text-center text-sm text-gray-600 font-medium"
                          >
                            Sub Kategori ↓
                          </TableCell>
                        </TableRow>
                        {stat.session?.map((sItem, sIndex) => (
                          <TableRow
                            key={`${index}-${sIndex}`}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <TableCell className="pl-8 font-semibold text-gray-700">
                              {sItem.subCategory}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {sItem.min?.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {sItem.q1?.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right font-mono font-bold text-blue-600">
                              {sItem.median?.toFixed(2)}
                            </TableCell>
                            <TableCell
                              className="text-right font-mono font-bold"
                              style={{ color: mainColor }}
                            >
                              {sItem.mean?.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right font-mono text-orange-600">
                              {sItem.stdDev?.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {sItem.q3?.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {sItem.max?.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Distribution Chart */}
          <Card className="border-2 border-gray-100 rounded-2xl shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${mainColor}15` }}
                >
                  <BarChart2
                    className="w-4 h-4"
                    style={{ color: mainColor }}
                  />
                </div>
                Distribusi Nilai
              </CardTitle>
              <CardDescription className="text-base">
                Persebaran nilai peserta try out dalam rentang tertentu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 w-full">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <ChartContainer config={chartConfig}>
                    <BarChart
                      data={RankingTryout?.DistributionScore}
                      margin={{ top: 30, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e5e7eb"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="range"
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}
                        fontWeight={500}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}
                        fontWeight={500}
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent className="bg-white shadow-lg border border-gray-200 rounded-lg" />
                        }
                      />
                      <Bar
                        dataKey="count"
                        fill={mainColor}
                        radius={[6, 6, 0, 0]}
                        fillOpacity={0.8}
                      >
                        <LabelList
                          position="top"
                          fontSize={11}
                          fontWeight={600}
                          fill="#374151"
                        />
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-8">
          <Skeleton className="w-full h-80 rounded-2xl" />
          <Skeleton className="w-full h-96 rounded-2xl" />
        </div>
      )}
    </div>
  );
};

const AnalysisSubject = () => {
  const { RankingTryout, RankingTryoutIsLoading } = useLeaderboardContext();
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  // const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const subjectAnalysis = RankingTryout?.AnalisisCategory?.map((item) => ({
    subject: item.name,
    avgTheta: parseFloat(item.avgTheta?.toFixed(2) || '0'),
    avgScore: parseFloat(item.avgScore?.toFixed(2) || '0'),
    totalScore: parseFloat(item.totalScore?.toFixed(2) || '0'),
  }));

  const chartConfig = {
    avgScore: {
      label: 'Rata-rata Skor',
      color: mainColor,
    },
  } satisfies ChartConfig;

  return (
    <Fragment>
      {!RankingTryoutIsLoading ? (
        <Card className="border-2 border-gray-100 rounded-2xl shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${mainColor}15` }}
              >
                <BookOpen
                  className="w-4 h-4"
                  style={{ color: mainColor }}
                />
              </div>
              Analisis Per Mata Pelajaran
            </CardTitle>
            <CardDescription className="text-base">
              Performa rata-rata peserta untuk setiap mata pelajaran
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96 w-full">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <ChartContainer config={chartConfig}>
                  <LineChart
                    data={subjectAnalysis}
                    margin={{ top: 30, right: 30, left: 20, bottom: 80 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="subject"
                      tickLine={false}
                      axisLine={false}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={11}
                      fontWeight={500}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                      fontWeight={500}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent className="bg-white shadow-lg border border-gray-200 rounded-lg" />
                      }
                    />
                    <Line
                      dataKey={RankingTryout?.isIRT ? 'avgTheta' : 'avgScore'}
                      type="monotone"
                      stroke={mainColor}
                      strokeWidth={4}
                      dot={{
                        fill: mainColor,
                        strokeWidth: 3,
                        r: 6,
                        stroke: 'white',
                      }}
                      activeDot={{
                        r: 8,
                        stroke: mainColor,
                        strokeWidth: 3,
                        fill: 'white',
                      }}
                    >
                      <LabelList
                        position="top"
                        fontSize={11}
                        fontWeight={700}
                        fill={mainColor}
                        offset={10}
                      />
                    </Line>
                  </LineChart>
                </ChartContainer>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Skeleton className="w-full h-[500px] rounded-2xl" />
      )}
    </Fragment>
  );
};

export default RankingStats;
