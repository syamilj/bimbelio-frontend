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

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import { LearningDataType, defaultChartConfig } from './report-types';

export const WeeklyProgressCard: React.FC<{
  data: LearningDataType;
  mainColor: string;
  secondaryColor: string;
}> = ({ data, mainColor, secondaryColor }) => {
  const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  const colors = [mainColor, secondaryColor, '#ffc658', '#ff7300'];

  // Transform data for display
  const weekData = data.weeklyProgress.map((item: any, idx: number) => ({
    date: days[idx % 7],
    doc: item.documentsRead || 0,
    note: item.notesCreated || 0,
    highlight: item.highlightsMade || 0,
    quiz: item.quizStudied || 0,
  }));

  return (
    <Card className="bg-white shadow-lg border-0 rounded-3xl overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <TrendingUp
            className="w-5 h-5"
            style={{ color: mainColor }}
          />
          Progres Mingguan
        </CardTitle>
        <CardDescription>
          Aktivitas belajar selama 7 hari terakhir
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Full Week Chart */}
        <div>
          <div className="text-sm font-semibold text-gray-700 mb-3">
            Ringkasan Harian
          </div>
          <ChartContainer
            config={defaultChartConfig}
            className="min-h-[200px] max-h-[500px] w-full overflow-y-auto"
          >
            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <BarChart data={weekData}>
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="doc"
                  fill={colors[0]}
                  name="Dokumen"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="note"
                  fill={colors[1]}
                  name="Catatan"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="highlight"
                  fill={colors[2]}
                  name="Highlight"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="quiz"
                  fill={colors[3]}
                  name="Quiz"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Daily Breakdown Mini Cards */}
        <div>
          <div className="text-sm font-semibold text-gray-700 mb-3">
            Performa Per Hari
          </div>
          <div className="grid grid-cols-7 gap-2">
            {weekData.map((day: any, idx: number) => {
              const total = day.doc + day.note + day.highlight + day.quiz;
              const maxTotal = 20;
              const percentage = Math.min((total / maxTotal) * 100, 100);

              return (
                <div
                  key={idx}
                  className="text-center"
                >
                  <div className="text-xs font-semibold text-gray-700 mb-2">
                    {day.date}
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span className="font-medium">{total}</span>
                  </div>
                  <div className="h-16 relative bg-gray-100 rounded-3xl p-1 flex flex-col justify-end">
                    <div
                      className="w-full rounded transition-all"
                      style={{
                        height: `${percentage}%`,
                        background: `linear-gradient(180deg, ${mainColor}, ${secondaryColor})`,
                      }}
                    />
                  </div>
                  {percentage > 0 && (
                    <div className="text-xs text-green-600 font-bold mt-1">
                      ✓
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 rounded-3xl bg-gray-50">
          {[
            { label: 'Dokumen', color: colors[0] },
            { label: 'Catatan', color: colors[1] },
            { label: 'Highlight', color: colors[2] },
            { label: 'Quiz', color: colors[3] },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 text-xs"
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-gray-700">{item.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
