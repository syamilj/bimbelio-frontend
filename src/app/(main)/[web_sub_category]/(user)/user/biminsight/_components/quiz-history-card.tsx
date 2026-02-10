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

import { getDateString, getHours } from '@/lib/utils';

import { Brain } from 'lucide-react';

import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

import { defaultChartConfig } from './report-types';

export const QuizHistoryCard: React.FC<{
  quizHistory: any;
  mainColor: string;
  secondaryColor: string;
}> = ({ quizHistory, mainColor, secondaryColor }) => {
  // Get badge based on accuracy
  const getAccuracyBadge = (accuracy: number) => {
    if (accuracy >= 90)
      return {
        bg: 'bg-emerald-100',
        text: 'text-emerald-700',
        label: 'Sempurna',
      };
    if (accuracy >= 75)
      return { bg: 'bg-green-100', text: 'text-green-700', label: 'Bagus' };
    if (accuracy >= 60)
      return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Cukup' };
    if (accuracy >= 40)
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        label: 'Perlu Latihan',
      };
    return {
      bg: 'bg-red-100',
      text: 'text-red-700',
      label: 'Tingkatkan',
    };
  };

  return (
    <Card className="bg-white shadow-lg border-0 rounded-3xl overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Brain
            className="w-5 h-5"
            style={{ color: mainColor }}
          />
          Quiz
        </CardTitle>
        <CardDescription>
          Statistik dan rekap quiz yang telah kamu kerjakan
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        {/* Chart Section */}
        <div className="mb-4">
          <div className="text-sm font-semibold text-gray-700 mb-3">
            Tren Akurasi
          </div>
          <ChartContainer
            config={defaultChartConfig}
            className="min-h-[200px] max-h-[500px] w-full overflow-y-auto"
          >
            <ResponsiveContainer
              width="100%"
              height={250}
            >
              <LineChart data={quizHistory?.chart}>
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
                  domain={[0, 100]}
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
                  dataKey="accuracy"
                  stroke={mainColor}
                  name="Akurasi (%)"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="perubahan"
                  stroke={secondaryColor}
                  name="Perubahan"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Quiz List */}
        <div>
          <div className="text-sm font-semibold text-gray-700 mb-3">
            Riwayat Quiz
          </div>
          <div className="space-y-2 max-h-[350px] overflow-y-auto">
            {quizHistory?.history && quizHistory.history.length > 0 ? (
              quizHistory.history.map((quiz: any, index: number) => {
                const badge = getAccuracyBadge(quiz.accuracy);
                const trend =
                  index > 0
                    ? quiz.accuracy - quizHistory.history[index - 1].accuracy
                    : 0;

                return (
                  <div
                    key={index}
                    className="p-3 rounded-3xl border border-gray-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">
                          {getDateString(quiz.createAt)},{' '}
                          {getHours(quiz.createAt)}
                        </p>
                      </div>
                      <div
                        className={`${badge.bg} ${badge.text} px-2 py-1 rounded-3xl text-xs font-bold`}
                      >
                        {quiz.accuracy?.toFixed(1)}%
                      </div>
                    </div>

                    {/* Accuracy Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-600">{badge.label}</span>
                        {trend !== 0 && (
                          <span
                            className={
                              trend >= 0
                                ? 'text-green-600 font-bold'
                                : 'text-red-600 font-bold'
                            }
                          >
                            {trend >= 0 ? '↑' : '↓'}{' '}
                            {Math.abs(trend)?.toFixed(1)}%
                          </span>
                        )}
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all rounded-full"
                          style={{
                            width: `${quiz.accuracy}%`,
                            background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p className="text-sm">Belum ada data quiz</p>
              </div>
            )}
          </div>
        </div>

        {/* Statistics Summary */}
        {quizHistory?.history && quizHistory.history.length > 0 && (
          <div
            className="p-3 rounded-3xl border-2"
            style={{
              borderColor: `${mainColor}30`,
              backgroundColor: `${mainColor}05`,
            }}
          >
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <span className="text-gray-600 block mb-1">Total Quiz</span>
                <span
                  className="text-lg font-bold"
                  style={{ color: mainColor }}
                >
                  {quizHistory.history.length}
                </span>
              </div>
              <div className="text-center">
                <span className="text-gray-600 block mb-1">Rata-rata</span>
                <span
                  className="text-lg font-bold"
                  style={{ color: mainColor }}
                >
                  {(
                    quizHistory.history.reduce(
                      (sum: number, q: any) => sum + q.accuracy,
                      0,
                    ) / quizHistory.history.length
                  )?.toFixed(1)}
                  %
                </span>
              </div>
              <div className="text-center">
                <span className="text-gray-600 block mb-1">Tertinggi</span>
                <span
                  className="text-lg font-bold"
                  style={{ color: mainColor }}
                >
                  {Math.max(
                    ...quizHistory.history.map((q: any) => q.accuracy),
                  )?.toFixed(1)}
                  %
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
