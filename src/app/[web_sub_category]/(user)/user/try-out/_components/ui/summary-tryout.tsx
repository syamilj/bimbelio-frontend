'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
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
import { BarChart, Target, TrendingUp, Trophy } from 'lucide-react';
import React, { Fragment, JSX, useEffect, useState } from 'react';
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
} from 'recharts';

interface SummaryCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: JSX.Element;
  bgColor: string;
  textColor: string;
}

const SummaryTryout = () => {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors from the selected category
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

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

  const TabsItem = [
    {
      title: 'Ringkasan',
      value: 'overview',
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      title: 'Progress',
      value: 'details',
      icon: <BarChart className="h-4 w-4" />,
    },
  ];

  useEffect(() => {
    if (Summary) {
      setSummaryCards([
        {
          title: 'Try Out Selesai',
          value: Summary.TryoutResult || 0,
          description: 'Tryout yang telah diselesaikan',
          icon: (
            <IconTryOut
              active
              className="text-current"
            />
          ),
          textColor: 'text-blue-700',
          bgColor: 'bg-blue-50',
        },
        {
          title: 'Total Soal',
          value: Summary.TryoutUserAnswer || 0,
          description: 'Soal yang telah dikerjakan',
          icon: (
            <IconTabsQuiz
              active
              className="text-current"
            />
          ),
          textColor: 'text-green-700',
          bgColor: 'bg-green-50',
        },
        {
          title: 'Peringkat Terakhir',
          value: `#${Summary.LastRanking || '-'}`,
          description: 'Peringkat pada try out terakhir',
          icon: <Trophy className="text-current" />,
          textColor: 'text-yellow-700',
          bgColor: 'bg-yellow-50',
        },
        {
          title: 'Rata-rata Skor',
          value: `${Summary.AverageScore || 0}`,
          description: `Dari ${Summary.TotalTryout || 0} try out`,
          icon: <Target className="text-current" />,
          textColor: 'text-purple-700',
          bgColor: 'bg-purple-50',
        },
      ]);
    }
  }, [Summary]);

  return (
    <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
      <CardHeader
        className="pb-6 border-b border-gray-100 relative overflow-hidden text-center"
        style={{
          background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
        }}
      >
        <div className="relative z-10">
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            <Target className="w-8 h-8 text-white" />
          </div>
          <CardTitle
            className="text-2xl font-bold mb-2"
            style={{ color: mainColor }}
          >
            Try Out Dashboard
          </CardTitle>
          <CardDescription className="text-base text-gray-600">
            Ringkasan performa dan progress try out Anda
          </CardDescription>
        </div>

        {/* Decorative elements */}
        <div
          className="absolute -right-8 -top-8 w-20 h-20 rounded-full opacity-5"
          style={{ backgroundColor: mainColor }}
        />
        <div
          className="absolute -left-6 -bottom-6 w-16 h-16 rounded-full opacity-5"
          style={{ backgroundColor: secondaryColor }}
        />
      </CardHeader>

      <CardContent className="p-6">
        <Tabs
          defaultValue="overview"
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 rounded-xl p-1 h-12 border-0">
            {TabsItem.map((tab, index) => (
              <React.Fragment key={index}>
                {!isLoading ? (
                  <TabsTrigger
                    value={tab.value}
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 text-gray-600 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:bg-gradient-to-r"
                    style={
                      {
                        '--tw-gradient-from': mainColor,
                        '--tw-gradient-to': secondaryColor,
                      } as React.CSSProperties
                    }
                  >
                    {tab.icon}
                    <span className="font-semibold">{tab.title}</span>
                  </TabsTrigger>
                ) : (
                  <Skeleton className="h-10 w-full rounded-xl" />
                )}
              </React.Fragment>
            ))}
          </TabsList>

          <TabsContent
            value="overview"
            className="mt-0"
          >
            <Fragment>
              {!isLoading ? (
                <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
                  {summaryCards.map((card, index) => (
                    <Card
                      key={index}
                      className={cn(
                        'border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1',
                        card.bgColor,
                        'border-gray-200',
                      )}
                    >
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle
                          className={cn(
                            'text-sm font-semibold',
                            card.textColor,
                          )}
                        >
                          {card.title}
                        </CardTitle>
                        <div
                          className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center shadow-sm',
                            card.textColor,
                          )}
                          style={{ backgroundColor: `${mainColor}15` }}
                        >
                          {card.icon}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-gray-900 mb-2">
                          {card.value}
                        </div>
                        <p
                          className={cn(
                            'text-sm font-medium',
                            card.textColor,
                            'opacity-80',
                          )}
                        >
                          {card.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      className="h-36 w-full rounded-xl"
                    />
                  ))}
                </div>
              )}
            </Fragment>
          </TabsContent>

          <TabsContent
            value="details"
            className="mt-0"
          >
            <Card className="border-2 border-gray-100 rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${mainColor}15` }}
                  >
                    <TrendingUp
                      className="w-4 h-4"
                      style={{ color: mainColor }}
                    />
                  </div>
                  Perkembangan Nilai Try Out
                </CardTitle>
                <CardDescription className="text-base">
                  Grafik menunjukkan progress peningkatan nilai dari waktu ke
                  waktu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ChartContainer
                    className="h-full w-full"
                    config={{
                      score: {
                        label: 'Skor',
                        color: mainColor,
                      },
                    }}
                  >
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <LineChart
                        data={tryoutProgress}
                        margin={{ top: 30, left: 20, right: 30, bottom: 20 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#e5e7eb"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="name"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          fontSize={12}
                          fontWeight={500}
                        />
                        <ChartTooltip
                          content={
                            <ChartTooltipContent className="bg-white shadow-lg border border-gray-200 rounded-lg" />
                          }
                        />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke={mainColor}
                          strokeWidth={3}
                          dot={{
                            fill: mainColor,
                            strokeWidth: 3,
                            r: 5,
                            stroke: 'white',
                          }}
                          activeDot={{
                            r: 7,
                            stroke: mainColor,
                            strokeWidth: 3,
                            fill: 'white',
                          }}
                        >
                          <LabelList
                            position="top"
                            offset={12}
                            fontSize={11}
                            fontWeight={600}
                            fill={mainColor}
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
  );
};

export default SummaryTryout;
