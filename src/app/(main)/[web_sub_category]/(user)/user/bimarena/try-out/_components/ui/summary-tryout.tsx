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
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { IconTabsQuiz, IconTryOut } from '@/styles/icon';
import { Target, TrendingUp, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
} from 'recharts';

const SummaryTryout = () => {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors from the selected category
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

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

  return (
    <section className="mb-12">
      {/* Header Section - Match Dashboard Style */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: mainColor }}
        >
          <Target className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-2xl font-black text-gray-900">Try Out Dashboard</h1>
      </div>

      {/* Quick Stats Grid - Match Course Style */}
      {!isLoading ? (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-8">
          {/* Try Out Selesai - Blue */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-3xl p-5 text-center">
            <div className="w-5 h-5 text-blue-600 mx-auto mb-2">
              <IconTryOut
                active
                className="text-current"
              />
            </div>
            <div className="text-2xl font-bold text-blue-700">
              {Summary?.TryoutResult || 0}
            </div>
            <p className="text-xs text-blue-600 font-medium mt-1">
              Try Out Selesai
            </p>
          </div>

          {/* Total Soal - Green */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-3xl p-5 text-center">
            <div className="w-5 h-5 text-green-600 mx-auto mb-2">
              <IconTabsQuiz
                active
                className="text-current"
              />
            </div>
            <div className="text-2xl font-bold text-green-700">
              {Summary?.TryoutUserAnswer || 0}
            </div>
            <p className="text-xs text-green-600 font-medium mt-1">
              Total Soal
            </p>
          </div>

          {/* Peringkat Terakhir - Yellow */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-3xl p-5 text-center">
            <Trophy className="w-5 h-5 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-700">
              #{Summary?.LastRanking || '-'}
            </div>
            <p className="text-xs text-yellow-600 font-medium mt-1">
              Peringkat Terakhir
            </p>
          </div>

          {/* Rata-rata Skor - Purple */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-3xl p-5 text-center">
            <Target className="w-5 h-5 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-700">
              {Summary?.AverageScore || 0}
            </div>
            <p className="text-xs text-purple-600 font-medium mt-1">
              Rata-rata Skor
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-[120px] rounded-3xl"
            />
          ))}
        </div>
      )}

      {/* Progress Chart Card */}
      <Card className="border-2 border-gray-100 rounded-3xl shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: mainColor }}
            >
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-black text-gray-900">
                Progress Try Out
              </CardTitle>
              <CardDescription className="text-sm">
                Perkembangan skor 7 try out terakhir
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-0">
          {!isLoading && tryoutProgress ? (
            <ChartContainer
              config={{
                score: {
                  label: 'Skor',
                  color: mainColor,
                },
              }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <LineChart
                  data={tryoutProgress}
                  margin={{
                    top: 20,
                    right: 20,
                    left: 10,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E5E7EB"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke={mainColor}
                    strokeWidth={3}
                    dot={{
                      fill: mainColor,
                      r: 5,
                    }}
                    activeDot={{
                      r: 7,
                      fill: mainColor,
                    }}
                  >
                    <LabelList
                      position="top"
                      offset={12}
                      className="fill-gray-700 font-bold text-xs"
                    />
                  </Line>
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <Skeleton className="h-[300px] w-full rounded-3xl" />
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default SummaryTryout;
