import { useLeaderboardContext } from '@/app/[web_sub_category]/(user)/user/leaderboard/_components/provider-leaderboard';
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
import {
  Award,
  BarChart2,
  BookOpen,
  School,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import React, { Fragment, useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  // Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const topSchools = [
  { name: 'SMA Negeri 1 Jakarta', avgScore: 850 },
  { name: 'SMA Negeri 3 Bandung', avgScore: 830 },
  { name: 'SMA Negeri 5 Surabaya', avgScore: 820 },
  { name: 'SMA Negeri 1 Yogyakarta', avgScore: 810 },
  { name: 'SMA Negeri 2 Medan', avgScore: 800 },
];

interface SummaryProps {
  title: string;
  value: number;
  description: string;
  icon: React.JSX.Element;
  bgColor: string;
  textColor: string;
}

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
    title: 'Analisis Tes',
    value: 'subjects',
    icon: <BookOpen className="h-4 w-4" />,
  },
];

export function RankingStats() {
  const { RankingTryoutIsLoading } = useLeaderboardContext();

  return (
    <Tabs
      defaultValue="summary"
      className="mb-6 w-full"
    >
      <TabsList className="mb-8 flex w-fit gap-2">
        {TabsItem.map((tab, index) => (
          <React.Fragment key={index}>
            {!RankingTryoutIsLoading ? (
              <TabsTrigger
                value={tab.value}
                className="flex flex-1 items-center gap-[.5rem] rounded-[.7rem] bg-white px-[1rem] py-[.6rem] text-sm text-gray data-[state=active]:bg-main data-[state=active]:text-white"
              >
                {tab.icon}
                <span>{tab.title}</span>
              </TabsTrigger>
            ) : (
              <Skeleton className="roundex-[.7rem] w-[100px] h-[40px]" />
            )}
          </React.Fragment>
        ))}
      </TabsList>
      <TabsContent value="summary">
        <Summary />
      </TabsContent>
      <TabsContent value="statistics">
        <Statistics />
      </TabsContent>
      <TabsContent value="subjects">
        <AnalysisSubject />
      </TabsContent>
      <TabsContent value="schools">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <School className="h-5 w-5" />
              <span>5 Sekolah Terbaik</span>
            </CardTitle>
            <CardDescription>
              Berdasarkan rata-rata Nilai Try Out
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {topSchools.map((school, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <Award className="h-4 w-4 text-yellow-500" />
                    {school.name}
                  </span>
                  <span className="text-muted-foreground">
                    {school.avgScore}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

const Summary = () => {
  const { RankingTryout, RankingTryoutIsLoading } = useLeaderboardContext();
  const [summary, setSummary] = useState<SummaryProps[]>([]);

  useEffect(() => {
    if (RankingTryout) {
      setSummary([
        {
          title: 'Total Peserta',
          value: RankingTryout.totalParticipants,
          description: 'Total peserta tryout',
          icon: (
            <IconUserAdmin
              active
              className="text-current"
            />
          ),
          textColor: 'text-blue-600',
          bgColor: 'bg-blue-100',
        },
        {
          title: 'Rata-rata Nilai Keseluruhan',
          value: parseFloat(RankingTryout.averageScore.toFixed(2)),
          description: 'Rata rata nilai keseluruhan',
          icon: <IconCircleLoop className="text-current" />,
          textColor: 'text-green-600',
          bgColor: 'bg-green-100',
        },
        {
          title: 'Nilai Tertinggi',
          value: parseFloat(RankingTryout.topScore.toFixed(2)),
          description: 'Nilai tryout tertinggi',
          icon: <TrendingUp className="text-current" />,
          textColor: 'text-yellow-500',
          bgColor: 'bg-yellow-50',
        },
        {
          title: 'Nilai Terendah',
          value: parseFloat(RankingTryout.bottomScore.toFixed(2)),
          description: 'Nilai tryout terendah',
          icon: <TrendingDown className="text-current" />,
          textColor: 'text-gray-500',
          bgColor: 'bg-white',
        },
      ]);
    }
  }, [RankingTryout]);
  return (
    <Fragment>
      {!RankingTryoutIsLoading ? (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {summary.map((sum, index) => (
            <Card
              key={index}
              className={cn('bg-green-100 border-none', sum.bgColor)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-semibold">
                  {sum.title}
                </CardTitle>
                <div className={cn('text-green-600', sum.textColor)}>
                  {sum.icon}
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 mt-2">
                <div className="text-2xl font-bold">{sum.value}</div>
                <p className="text-sm font-medium text-muted-foreground">
                  {sum.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-[136px] w-full"
            />
          ))}
        </div>
      )}
    </Fragment>
  );
};

const Statistics = () => {
  const { RankingTryout, RankingTryoutIsLoading } = useLeaderboardContext();

  const chartConfig = {
    count: {
      label: 'Jumlah Peserta',
      color: 'hsl(var(--chart-1))',
    },
  };

  return (
    <div className="space-y-6">
      {!RankingTryoutIsLoading ? (
        <Card className="border-none rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Statistik</span>
            </CardTitle>
            <CardDescription>
              Ringkasan statistik untuk setiap komponen tes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Tes</TableHead>
                      <TableHead className="text-right">Minimum</TableHead>
                      <TableHead className="text-right">Kuartil 1</TableHead>
                      <TableHead className="text-right">Median</TableHead>
                      <TableHead className="text-right">Mean</TableHead>
                      <TableHead className="text-right">
                        Standar Deviasi
                      </TableHead>
                      <TableHead className="text-right">Kuartil 3</TableHead>
                      <TableHead className="text-right">Maksimum</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {RankingTryout?.StatisticsCategory.map((stat, index) => (
                      <Fragment key={index}>
                        <TableRow className="bg-muted/50">
                          <TableCell
                            colSpan={8}
                            className="font-bold"
                          >
                            {index + 1}. {stat.category}
                          </TableCell>
                        </TableRow>
                        {stat.session.map((sItem, sIndex) => (
                          <TableRow key={sIndex}>
                            <TableCell className="pl-8">
                              {index + 1}. {sItem.subCategory}
                            </TableCell>
                            <TableCell className="text-right">
                              {sItem.min.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right">
                              {sItem.q1.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right">
                              {sItem.median.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right">
                              {sItem.mean.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right">
                              {sItem.stdDev.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right">
                              {sItem.q3.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right">
                              {sItem.max.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div>
                <h3 className="mb-4 text-lg font-semibold">Distribusi Nilai</h3>
                <div className="h-full max-h-[500px] w-full">
                  <ResponsiveContainer>
                    <ChartContainer config={chartConfig}>
                      <BarChart
                        accessibilityLayer
                        data={RankingTryout?.DistributionScore}
                        // margin={{
                        //   left: 12,
                        //   right: 12,
                        // }}
                      >
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="range"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={10}
                        />
                        {/* <YAxis tickLine={false} axisLine={false} tickMargin={8} /> */}
                        <ChartTooltip
                          // cursor={false}
                          content={
                            <ChartTooltipContent
                              hideLabel
                              indicator="dot"
                            />
                          }
                        />
                        <Bar
                          dataKey="count"
                          fill="#0091ff"
                          radius={8}
                        >
                          <LabelList
                            position="top"
                            offset={12}
                            className="fill-foreground"
                            fontSize={12}
                          />
                        </Bar>
                      </BarChart>
                    </ChartContainer>
                  </ResponsiveContainer>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Persebaran Nilai peserta Try Out SNBT
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Skeleton className="w-full h-[500px]" />
      )}
    </div>
  );
};

const AnalysisSubject = () => {
  const { RankingTryout, RankingTryoutIsLoading } = useLeaderboardContext();

  const subjectAnalysis = RankingTryout?.analisisCategory.map((item) => {
    return {
      subject: item.category,
      avgTheta: parseFloat(item.avgTheta.toFixed(2)),
    };
  });
  console.log({ subjectAnalysis });

  const chartConfig = {
    count: {
      label: 'Peserta',
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig;
  return (
    <Fragment>
      {!RankingTryoutIsLoading ? (
        <Card className="border-none rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Analisis Tes</span>
            </CardTitle>
            <CardDescription>Kemampuan peserta per tes</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {/* <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectAnalysis} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="subject" type="category" width={150} />
                <Tooltip />
                <Bar dataKey="avgScore" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer> */}
            <ResponsiveContainer>
              <ChartContainer config={chartConfig}>
                <LineChart
                  accessibilityLayer
                  data={subjectAnalysis}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid
                    vertical={false}
                    stroke="#b0bed3"
                  />
                  <XAxis
                    dataKey="subject"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    // tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  {/* <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel hideIndicator />}
                  /> */}
                  <Line
                    dataKey="avgTheta"
                    type="natural"
                    stroke="#0091ff"
                    strokeWidth={2}
                    dot={{
                      fill: '#0091ff',
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  >
                    <LabelList
                      position="top"
                      offset={12}
                    />
                  </Line>
                </LineChart>
              </ChartContainer>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ) : (
        <Skeleton className="w-full h-[300px]" />
      )}
    </Fragment>
  );
};

export default RankingStats;
