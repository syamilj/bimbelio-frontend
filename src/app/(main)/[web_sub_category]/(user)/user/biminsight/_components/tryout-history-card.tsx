'use client';

import Link from 'next/link';
import React from 'react';

import { Button } from '@/components/ui/button';
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

import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { getDateString, getHours } from '@/lib/utils';

import { Target } from 'lucide-react';

import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

import { defaultChartConfig } from './report-types';

export const TryoutHistoryCard: React.FC<{
  tryoutHistory: any;
  tryoutCategory: any;
  mainColor: string;
  secondaryColor: string;
}> = ({ tryoutHistory, tryoutCategory, mainColor, secondaryColor }) => {
  // Get badge color based on score
  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return { bg: 'bg-green-100', text: 'text-green-700' };
    if (score >= 60) return { bg: 'bg-blue-100', text: 'text-blue-700' };
    if (score >= 40) return { bg: 'bg-yellow-100', text: 'text-yellow-700' };
    return { bg: 'bg-red-100', text: 'text-red-700' };
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank <= 3) return { bg: '#FFD700', text: '#333' }; // Gold
    if (rank <= 10) return { bg: '#C0C0C0', text: '#333' }; // Silver
    if (rank <= 30) return { bg: '#CD7F32', text: '#fff' }; // Bronze
    return { bg: mainColor, text: '#fff' };
  };

  return (
    <Card className="bg-white shadow-lg border-0 rounded-3xl overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Target
            className="w-5 h-5"
            style={{ color: mainColor }}
          />
          Try Out
        </CardTitle>
        <CardDescription>Rekap dan evaluasi tryout kamu</CardDescription>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        {/* Chart Section */}
        <div className="mb-6">
          <div className="text-sm font-semibold text-gray-700 mb-3">
            Tren Nilai & Peringkat
          </div>
          <ChartContainer
            config={defaultChartConfig}
            className="min-h-[200px] max-h-[500px] w-full overflow-y-auto"
          >
            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <LineChart data={tryoutHistory?.chart}>
                <XAxis
                  dataKey="tanggal"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                    })
                  }
                />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  stroke={mainColor}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke={secondaryColor}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="NilaiTotal"
                  stroke={mainColor}
                  name="Nilai Total"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="peringkat"
                  stroke={secondaryColor}
                  name="Peringkat"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* List View */}
        <div>
          <div className="text-sm font-semibold text-gray-700 mb-3">
            Daftar Try Out
          </div>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {tryoutHistory?.history?.length > 0 ? (
              tryoutHistory.history.map((tryout: any, index: number) => {
                const scoreBadge = getScoreBadgeColor(
                  tryout.show ? tryout.totalScore : 0,
                );
                const rankBadge = getRankBadgeColor(
                  tryout.show ? tryout.rank : 999,
                );

                return (
                  <div
                    key={index}
                    className="p-3 rounded-3xl border border-gray-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-sm">
                          {tryout.Tryout.title}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {getDateString(tryout.startTryout)},{' '}
                          {getHours(tryout.startTryout)}
                        </p>
                      </div>
                      {tryout.show && (
                        <div
                          className="px-2 py-1 rounded-3xl text-white text-xs font-bold"
                          style={{
                            backgroundColor: rankBadge.bg,
                            color: rankBadge.text,
                          }}
                        >
                          #{tryout.rank}
                        </div>
                      )}
                    </div>

                    {/* Score and Categories */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">
                          Nilai Total
                        </span>
                        <div
                          className={`${scoreBadge.bg} ${scoreBadge.text} px-2 py-1 rounded-3xl text-xs font-bold`}
                        >
                          {tryout.show
                            ? `${tryout.totalScore} poin`
                            : 'Proses...'}
                        </div>
                      </div>

                      {/* Category Scores */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {tryoutCategory?.map((category: any, idx: number) => {
                          const session = tryout.TryoutSessionResult.find(
                            (item: any) => item.categoryId === category.id,
                          );
                          return (
                            <div
                              key={idx}
                              className="p-2 bg-gray-50 rounded-3xl"
                            >
                              <span className="text-gray-600">
                                {category.name}
                              </span>
                              <div
                                className="font-bold"
                                style={{ color: mainColor }}
                              >
                                {!tryout.show
                                  ? '...?'
                                  : session
                                    ? `${session.totalScore}/${session.TryoutSession.thresholdValue}`
                                    : '-'}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      asChild
                      size="sm"
                      className="w-full mt-3 rounded-3xl text-white"
                      style={{ backgroundColor: mainColor }}
                    >
                      <Link
                        href={`/${website_sub_category_id}/user/bimarena/try-out/${tryout.Tryout?.id}`}
                      >
                        Lihat Pembahasan
                      </Link>
                    </Button>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p className="text-sm">Belum ada data try out</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
