'use client';

import { useSession } from '@/components/provider/provider-session-auth';
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
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { cn } from '@/lib/utils';
import { IconTabsQuiz, IconTryOut } from '@/styles/icon';
// import { api } from '@/trpc/react';
import { BarChart, TrendingUp, Trophy } from 'lucide-react';
import React, { Fragment, JSX, useEffect, useState } from 'react';
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
} from 'recharts';

// const tryoutProgress = [
//   { name: 'TO #1', score: 620 },
//   { name: 'TO #2', score: 645 },
//   { name: 'TO #3', score: 660 },
// ];

interface SummaryCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: JSX.Element;
  bgColor: string;
  textColor: string;
}

const TabsItem = [
  {
    title: 'Ringkasan',
    value: 'overview',
    icon: <TrendingUp className="h-4 w-4" />,
  },
  {
    title: 'Detail',
    value: 'details',
    icon: <BarChart className="h-4 w-4" />,
  },
];

const SummaryTryout = () => {
  const { data: session } = useSession();
  // const { data: Summary, isLoading } = api.tryout.getSummaryTryout.useQuery(
  //   undefined,
  //   {
  //     refetchOnWindowFocus: false,
  //     refetchOnMount: false,
  //   }
  // );

  // const { data: tryoutProgress } = api.tryout.getTryoutUserProgress.useQuery(
  //   undefined,
  //   {
  //     refetchOnWindowFocus: false,
  //     refetchOnMount: false,
  //   }
  // );

  const [Summary, setSummary] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tryoutProgress, setTryoutProgress] = useState<any>();

  useEffect(() => {
    getGeneral(`/tryout/getSummaryTryout?userId=${session?.user.id}`, {
      setData: setSummary,
      setLoading: setIsLoading,
    });
    getGeneral(`/tryout/getTryoutUserProgress?userId=${session?.user.id}`, {
      setData: setTryoutProgress,
    });
  }, [session]);

  const [summaryCards, setSummaryCards] = useState<SummaryCardProps[]>([]);

  useEffect(() => {
    if (Summary) {
      setSummaryCards([
        {
          title: 'Try Out Selesai',
          value: Summary.TryoutResult || 0,
          description: 'Tryout Diselesaikan',
          icon: (
            <IconTryOut
              active
              className="text-current"
            />
          ),
          textColor: 'text-blue-600',
          bgColor: 'bg-blue-100',
        },
        {
          title: 'Total Soal',
          value: Summary.TryoutUserAnswer || 0,
          description: 'Soal Dikerjakan',
          icon: (
            <IconTabsQuiz
              active
              className="text-current"
            />
          ),
          textColor: 'text-green-600',
          bgColor: 'bg-green-100',
        },
        {
          title: 'Peringkat',
          value: `${Summary.LastRanking}`,
          description: 'Peringkat Terakhir',
          icon: <Trophy className="text-current" />,
          textColor: 'text-yellow-500',
          bgColor: 'bg-yellow-50',
        },
        {
          title: 'Rata-rata Skor',
          value: `${Summary.AverageScore}`,
          description: `Dari ${Summary.TotalTryout} tryout`,
          icon: <BarChart className="text-current" />,
          textColor: 'text-gray-500',
          bgColor: 'bg-white',
        },
      ]);
    }
  }, [Summary]);

  //
  return (
    <div className="p-0">
      <Card className="w-full h-full bg-transparent border-none shadow-none">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Try Out</h1>
          <p className="text-muted-foreground">
            Ringkasan dan detail performa dalam tryout.
          </p>
        </div>
        <CardContent className="p-0 pt-6">
          <Tabs
            defaultValue="overview"
            className="w-full"
          >
            <TabsList className="mb-8 flex w-fit gap-2">
              {TabsItem.map((tab, index) => (
                <React.Fragment key={index}>
                  {!isLoading ? (
                    <TabsTrigger
                      value={tab.value}
                      className="flex flex-1 items-center gap-[.5rem] rounded-[.7rem] bg-white px-[1rem] py-[.6rem] text-sm text-gray data-[state=active]:text-white"
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
            <TabsContent value="overview">
              <Fragment>
                {!isLoading ? (
                  <div className="grid gap-4  grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                    {summaryCards.map((card, index) => (
                      <Card
                        key={index}
                        className={cn('bg-green-100 border-none', card.bgColor)}
                      >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-base font-semibold">
                            {card.title}
                          </CardTitle>
                          <div className={cn('text-green-600', card.textColor)}>
                            {card.icon}
                          </div>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2 mt-2">
                          <div className="text-2xl font-bold">{card.value}</div>
                          <p className="text-sm font-medium text-muted-foreground">
                            {card.description}
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
            </TabsContent>
            <TabsContent value="details">
              <Card className="border-none rounded-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>Perkembangan Nilai Try Out</span>
                  </CardTitle>
                  <CardDescription>
                    Grafik perkembangan nilai dalam tryout.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-full w-full">
                    <ChartContainer
                      className="h-full w-full max-h-[400px]"
                      config={{
                        score: {
                          label: 'Skor',
                          color: 'hsl(var(--chart-1))',
                        },
                      }}
                    >
                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                      >
                        <LineChart
                          data={tryoutProgress}
                          accessibilityLayer
                          margin={{
                            top: 40,
                            left: 16,
                            right: 12,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="name"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                          />
                          {/* <YAxis domain={[500, 800]} /> */}
                          <ChartTooltip
                            content={<ChartTooltipContent indicator="line" />}
                          />
                          <Line
                            type="monotone"
                            dataKey="score"
                            stroke="var(--color-score)"
                            strokeWidth={2}
                            dot={{ r: 2 }}
                            activeDot={{ r: 6 }}
                          >
                            <LabelList
                              position="top"
                              offset={12}
                              className="fill-main-gray-text"
                              fontSize={12}
                            />
                          </Line>
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryTryout;
