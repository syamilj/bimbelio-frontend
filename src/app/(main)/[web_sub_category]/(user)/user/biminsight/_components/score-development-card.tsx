'use client';

import React from 'react';

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

import { TrendingUp } from 'lucide-react';

import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

import { defaultChartConfig } from './report-types';

export const ScoreDevelopmentCard: React.FC<{
  scoreDevelopmentData: any;
  tryoutCategory: any;
  mainColor: string;
  secondaryColor: string;
}> = ({ scoreDevelopmentData, tryoutCategory, mainColor, secondaryColor }) => {
  // Get latest and previous scores
  const getScoreStats = () => {
    if (scoreDevelopmentData.length < 2) return [];

    const stats = tryoutCategory?.map((category: any) => {
      const categoryKey = category.name.toUpperCase();
      const scores = scoreDevelopmentData
        .map((d: any) => d[categoryKey])
        .filter((s: any) => s !== undefined);

      if (scores.length === 0) return null;

      const latest = scores[scores.length - 1];
      const previous = scores[Math.max(0, scores.length - 2)];
      const trend = latest - previous;
      const trendPercent =
        previous > 0
          ? Math.round(((trend / previous) * 100 + Number.EPSILON) * 100) / 100
          : 0;

      return {
        name: category.name,
        latest,
        trend,
        trendPercent,
      };
    });

    return stats.filter((s: any) => s !== null);
  };

  const stats = getScoreStats();

  // Get total trend
  const totalScores = scoreDevelopmentData
    .map((d: any) => d.total)
    .filter((s: any) => s !== undefined);
  const totalLatest = totalScores[totalScores.length - 1];
  const totalPrevious = totalScores[Math.max(0, totalScores.length - 2)];
  const totalTrend = totalLatest - totalPrevious;

  return (
    <Card className="bg-white shadow-lg border-0 rounded-3xl overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <TrendingUp
            className="w-5 h-5"
            style={{ color: mainColor }}
          />
          Perkembangan Nilai
        </CardTitle>
        <CardDescription>
          Tren nilai tryout berdasarkan kategori
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Main Chart */}
        <div className="mb-4">
          <ChartContainer
            config={defaultChartConfig}
            className="min-h-[200px] max-h-[500px] w-full overflow-y-auto"
          >
            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <LineChart data={scoreDevelopmentData}>
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                {tryoutCategory?.map((category: any, index: number) => (
                  <Line
                    key={index}
                    type="monotone"
                    dataKey={category.name.toUpperCase()}
                    stroke={
                      index === 0
                        ? mainColor
                        : index === 1
                          ? secondaryColor
                          : '#ffc658'
                    }
                    name={category.name}
                    strokeWidth={2}
                  />
                ))}
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#ff7300"
                  name="Total"
                  strokeWidth={3}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Category Stats Cards */}
        <div>
          <div className="text-sm font-semibold text-gray-700 mb-3">
            Performa Per Kategori
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {stats.map((stat: any, idx: number) => (
              <div
                key={idx}
                className="p-4 rounded-3xl border-2 transition-all hover:shadow-md"
                style={{ borderColor: `${mainColor}20` }}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    {stat.name}
                  </span>
                  <div
                    className={`text-xs font-bold px-2 py-1 rounded-full ${
                      stat.trend >= 0
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {stat.trend >= 0 ? '↑' : '↓'} {Math.abs(stat.trendPercent)}%
                  </div>
                </div>
                <div
                  className="text-2xl font-bold"
                  style={{ color: mainColor }}
                >
                  {stat?.latest?.toFixed(0)}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {stat?.trend >= 0 ? '+' : ''}
                  {stat?.trend?.toFixed(0)} dari tryout terakhir
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total Score Highlight */}
        <div
          className="p-4 rounded-3xl border-2 md:col-span-2 lg:col-span-3"
          style={{
            borderColor: `${mainColor}40`,
            backgroundColor: `${mainColor}08`,
          }}
        >
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm font-medium text-gray-700 block mb-1">
                Total Nilai Keseluruhan
              </span>
              <div
                className="text-3xl font-bold"
                style={{ color: mainColor }}
              >
                {totalLatest?.toFixed(0)}
              </div>
            </div>
            <div className="text-right">
              <div
                className={`text-lg font-bold ${
                  totalTrend >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {totalTrend >= 0 ? '+' : ''}
                {totalTrend?.toFixed(0)}
              </div>
              <div
                className={`text-sm ${
                  totalTrend >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {totalTrend >= 0 ? 'Meningkat' : 'Menurun'}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
