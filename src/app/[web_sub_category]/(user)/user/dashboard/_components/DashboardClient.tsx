'use client';

import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';

// Komponen UI
import { Badge } from '@/components/ui/badge';
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
import { LoadingRetro } from '@/components/ui/loading-retro';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Provider dan Hooks
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { getDateString, getHours } from '@/lib/utils';
import { TryoutStatusEnum, UserRoleEnum } from '@/types/database';

// Icon dari lucide-react
import {
  ActivityIcon,
  Award,
  Brain,
  CalendarRangeIcon,
  ChevronUp,
  Clock,
  FileText,
  Highlighter,
  Home,
  LibraryBigIcon,
  Loader2Icon,
  PenTool,
  Target,
  TrendingUp,
  Trophy,
} from 'lucide-react';

// Komponen Chart dari recharts
import {
  Bar,
  BarChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

// =====================================================================
// CONSTANTS & INTERFACES
// =====================================================================

const defaultChartConfig = {
  documentsRead: { label: 'Dokumen Dibaca', color: 'var(--chart-1)' },
  notesCreated: { label: 'Catatan Dibuat', color: 'var(--chart-2)' },
  highlightsMade: { label: 'Highlight Dibuat', color: 'var(--chart-3)' },
  quizStudied: { label: 'Quiz Dibuat', color: 'var(--chart-4)' },
  NilaiTotal: { label: 'Nilai Total', color: 'var(--chart-5)' },
  peringkat: { label: 'Peringkat', color: 'var(--chart-2)' },
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  change: number;
  changePercentage?: number;
  changeLabel?: string;
  bgColour?: string;
  mainColor?: string;
}

interface StudyHabitStatProps {
  label: string;
  value: string;
}

interface LearningData {
  documentsRead: number;
  documentsReadIncrease: number;
  notesCreated: number;
  notesCreatedIncrease: number;
  highlightsMade: number;
  highlightsMadeIncrease: number;
  quizStudied: number;
  quizStudiedIncrease: number;
  studyTimeByCategory: { name: string; value: number }[];
  learningStreak: number;
  longestStreak: number;
  dailyStreak: { date: string; completed: boolean }[];
  weeklyProgress: {
    date: string;
    documentsRead: number;
    notesCreated: number;
    highlightsMade: number;
    quizStudied: number;
  }[];
  recentDocuments: { title: string; lastAccessed: string }[];
  mostActiveHours: { hour: number; activity: number }[];
  quizAccuracy: number;
  totalStudyTime: number;
  averageSessionDuration: number;
}

interface ActivitySummaryProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  increase: number;
  mainColor?: string;
}

interface CalendarView {
  value: string;
  label: string;
}

// =====================================================================
// KOMPOEN DASAR
// =====================================================================

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  changePercentage,
  changeLabel,
  mainColor = '#0091FF',
}) => (
  <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group">
    <CardHeader
      className="pb-3 relative overflow-hidden"
      style={{ backgroundColor: `${mainColor}08` }}
    >
      <div className="flex items-center justify-between relative z-10">
        <CardTitle className="text-sm font-semibold text-gray-700">
          {title}
        </CardTitle>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm text-white"
          style={{ backgroundColor: mainColor }}
        >
          {icon}
        </div>
      </div>
      {/* Decorative element */}
      <div
        className="absolute -right-4 -top-4 w-12 h-12 rounded-full opacity-10"
        style={{ backgroundColor: mainColor }}
      />
    </CardHeader>
    <CardContent className="pt-4">
      <div className="space-y-3">
        <div
          className="text-2xl md:text-3xl font-bold"
          style={{ color: mainColor }}
        >
          {value}
        </div>
        <div className="flex items-center text-sm">
          <div className="flex items-center gap-1 text-green-600">
            <ChevronUp className="w-4 h-4" />
            <span className="font-medium">
              +{change} {changeLabel || ''}
            </span>
          </div>
          {changePercentage !== undefined && (
            <span className="ml-2 text-gray-500 text-xs">
              ({changePercentage.toFixed(1)}%)
            </span>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

export const StudyHabitStat: React.FC<StudyHabitStatProps> = ({
  label,
  value,
}) => (
  <div className="text-center">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>
);

export const ActivitySummary: React.FC<ActivitySummaryProps> = ({
  icon,
  value,
  label,
  increase,
  mainColor = '#0091FF',
}) => (
  <div className="flex flex-col items-center">
    {icon}
    <p
      className="mt-2 text-2xl font-bold"
      style={{ color: mainColor }}
    >
      {value}
    </p>
    <p className="text-sm text-muted-foreground">{label}</p>
    <p
      className={`text-xs ${increase >= 0 ? 'text-green-500' : 'text-red-500'}`}
    >
      {increase >= 0 ? '+' : ''}
      {increase}%
    </p>
  </div>
);

// =====================================================================
// BAGIAN OVERVIEW
// =====================================================================

export const PerformanceSummary: React.FC<{
  learningReport: any;
  studyHabits: any;
  tryoutHistory: any;
  mainColor: string;
}> = ({ learningReport, studyHabits, tryoutHistory, mainColor }) => (
  <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
    <StatCard
      icon={<Award className="h-5 w-5" />}
      title="Nilai Total"
      value={learningReport.totalScore}
      change={learningReport.scoreIncrease}
      changePercentage={learningReport.scoreIncreasePercentage}
      mainColor={mainColor}
    />
    <StatCard
      icon={<Trophy className="h-5 w-5" />}
      title="Peringkat"
      value={`#${learningReport.rank}`}
      change={learningReport.rankIncrease}
      changeLabel="posisi"
      mainColor={mainColor}
    />
    <StatCard
      icon={<Clock className="h-5 w-5" />}
      title="Jam Belajar"
      value={`${studyHabits.hoursThisWeek} jam`}
      change={2}
      changeLabel="jam"
      changePercentage={10}
      mainColor={mainColor}
    />
    <StatCard
      icon={<Target className="h-5 w-5" />}
      title="Tryout Selesai"
      value={tryoutHistory?.history.length || 0}
      change={2}
      changeLabel="dari bulan lalu"
      mainColor={mainColor}
    />
  </div>
);

export const TryoutHistoryCard: React.FC<{
  tryoutHistory: any;
  tryoutCategory: any;
  mainColor: string;
  secondaryColor: string;
}> = ({ tryoutHistory, tryoutCategory, mainColor, secondaryColor }) => (
  <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
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
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
            style={{ backgroundColor: `${mainColor}15` }}
          >
            <Target
              className="w-5 h-5"
              style={{ color: mainColor }}
            />
          </div>
          Try Out
        </CardTitle>
        <CardDescription className="text-gray-600 mt-2">
          Rekap dan evaluasi tryout kamu.
        </CardDescription>
      </div>
      {/* Decorative elements */}
      <div
        className="absolute -right-6 -top-6 w-16 h-16 rounded-full opacity-10"
        style={{ backgroundColor: mainColor }}
      />
    </CardHeader>

    <CardContent className="p-6">
      <Tabs defaultValue="grafik">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 rounded-xl p-1 h-12">
          <TabsTrigger
            value="grafik"
            className="rounded-xl data-[state=active]:text-white data-[state=active]:shadow-sm"
            style={
              {
                '--tw-gradient-from': mainColor,
                '--tw-gradient-to': secondaryColor,
              } as React.CSSProperties
            }
          >
            Grafik
          </TabsTrigger>
          <TabsTrigger
            value="detail"
            className="rounded-xl data-[state=active]:text-white data-[state=active]:shadow-sm"
            style={
              {
                '--tw-gradient-from': mainColor,
                '--tw-gradient-to': secondaryColor,
              } as React.CSSProperties
            }
          >
            Detail
          </TabsTrigger>
        </TabsList>

        <TabsContent value="detail">
          <div className="max-h-[400px] overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow style={{ backgroundColor: `${mainColor}08` }}>
                  <TableHead className="font-bold text-gray-800">
                    Judul
                  </TableHead>
                  <TableHead className="font-bold text-gray-800">
                    Tanggal
                  </TableHead>
                  <TableHead className="font-bold text-gray-800">
                    Nilai Total
                  </TableHead>
                  {tryoutCategory?.map((category: any, index: number) => (
                    <TableHead
                      key={index}
                      className="text-center font-bold text-gray-800"
                    >
                      {category.name}
                    </TableHead>
                  ))}
                  <TableHead className="text-center font-bold text-gray-800">
                    Peringkat
                  </TableHead>
                  <TableHead className="text-center font-bold text-gray-800">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tryoutHistory?.history?.map((tryout: any, index: number) => (
                  <TableRow
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="font-medium">
                      {tryout.Tryout.title}
                    </TableCell>
                    <TableCell>
                      {getDateString(tryout.startTryout)},{' '}
                      {getHours(tryout.startTryout)}
                    </TableCell>
                    <TableCell>
                      {tryout.show ? `${tryout.totalScore} poin` : '...?'}
                    </TableCell>
                    {tryoutCategory?.map((category: any, idx: number) => {
                      const thisSession = tryout.TryoutSessionResult.find(
                        (item: any) => item.categoryId === category.id,
                      );
                      return (
                        <TableCell
                          key={idx}
                          className="text-center"
                        >
                          {!tryout.show
                            ? '...?'
                            : thisSession
                              ? `${thisSession.totalScore} / ${thisSession.TryoutSession.thresholdValue}`
                              : '-'}
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-center">
                      {tryout.show ? tryout.rank : '...?'}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        asChild
                        size="sm"
                        className="rounded-xl"
                        style={{ backgroundColor: mainColor }}
                      >
                        <Link
                          href={`/${website_sub_category_id}/user/try-out/${tryout.Tryout?.id}`}
                        >
                          Lihat Pembahasan
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="grafik">
          <ChartContainer
            config={defaultChartConfig}
            className="min-h-[200px] w-full"
          >
            <ResponsiveContainer
              width="100%"
              height={400}
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
                  stroke="#8884d8"
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#82ca9d"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="NilaiTotal"
                  stroke="#8884d8"
                  name="Nilai Total"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="peringkat"
                  stroke="#82ca9d"
                  name="Peringkat"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
          <p className="mt-4 text-sm text-muted-foreground">
            Grafik ini menunjukkan perkembangan nilai total dan peringkat dalam
            tryout.
          </p>
        </TabsContent>
      </Tabs>
    </CardContent>
  </Card>
);

export const QuizHistoryCard: React.FC<{
  quizHistory: any;
  mainColor: string;
  secondaryColor: string;
}> = ({ quizHistory, mainColor, secondaryColor }) => (
  <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
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
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
            style={{ backgroundColor: `${mainColor}15` }}
          >
            <Brain
              className="w-5 h-5"
              style={{ color: mainColor }}
            />
          </div>
          Quiz
        </CardTitle>
        <CardDescription className="text-gray-600 mt-2">
          Statistik dan rekap quiz yang telah kamu kerjakan.
        </CardDescription>
      </div>
      {/* Decorative elements */}
      <div
        className="absolute -right-6 -top-6 w-16 h-16 rounded-full opacity-10"
        style={{ backgroundColor: mainColor }}
      />
    </CardHeader>

    <CardContent className="p-6">
      <Tabs defaultValue="grafik">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 rounded-xl p-1 h-12">
          <TabsTrigger
            value="grafik"
            className="rounded-xl data-[state=active]:text-white data-[state=active]:shadow-sm"
            style={
              {
                '--tw-gradient-from': mainColor,
                '--tw-gradient-to': secondaryColor,
              } as React.CSSProperties
            }
          >
            Grafik
          </TabsTrigger>
          <TabsTrigger
            value="detail"
            className="rounded-xl data-[state=active]:text-white data-[state=active]:shadow-sm"
            style={
              {
                '--tw-gradient-from': mainColor,
                '--tw-gradient-to': secondaryColor,
              } as React.CSSProperties
            }
          >
            Detail
          </TabsTrigger>
        </TabsList>
        <TabsContent value="detail">
          <div className="max-h-[400px] overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-center">Akurasi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quizHistory?.history?.map((quiz: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      {getDateString(quiz.createAt)}, {getHours(quiz.createAt)}
                    </TableCell>
                    <TableCell className="text-center">
                      {quiz.accuracy.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="grafik">
          <ChartContainer
            config={defaultChartConfig}
            className="min-h-[200px] w-full"
          >
            <ResponsiveContainer
              width="100%"
              height={400}
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
                  stroke="#8884d8"
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#82ca9d"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#8884d8"
                  name="Akurasi"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="perubahan"
                  stroke="#82ca9d"
                  name="Perubahan"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
          <p className="mt-4 text-sm text-muted-foreground">
            Grafik ini menunjukkan perkembangan akurasi dan perubahan dalam
            quiz.
          </p>
        </TabsContent>
      </Tabs>
    </CardContent>
  </Card>
);

export const TestAnalysisCard: React.FC<{
  analysisByCategoryTryout: any;
  tryoutCategory: any;
  mainColor: string;
  secondaryColor: string;
}> = ({
  analysisByCategoryTryout,
  tryoutCategory,
  mainColor,
  secondaryColor,
}) => (
  <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
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
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
            style={{ backgroundColor: `${mainColor}15` }}
          >
            <Target
              className="w-5 h-5"
              style={{ color: mainColor }}
            />
          </div>
          Analisis per Bidang Tes
        </CardTitle>
        <CardDescription className="text-gray-600 mt-2">
          Analisis detail berdasarkan subtes.
        </CardDescription>
      </div>
      {/* Decorative elements */}
      <div
        className="absolute -right-6 -top-6 w-16 h-16 rounded-full opacity-10"
        style={{ backgroundColor: mainColor }}
      />
    </CardHeader>

    <CardContent className="p-6 overflow-hidden">
      <Tabs defaultValue={tryoutCategory?.[0]?.name || ''}>
        <div className="w-full overflow-x-auto pb-2">
          <TabsList className="mb-4 inline-flex w-max bg-gray-100 rounded-xl p-1 h-12">
            {tryoutCategory?.map((category: any, index: number) => (
              <TabsTrigger
                key={index}
                value={category.name}
                className="whitespace-nowrap rounded-xl data-[state=active]:text-white data-[state=active]:shadow-sm"
                style={
                  {
                    '--tw-gradient-from': mainColor,
                    '--tw-gradient-to': secondaryColor,
                  } as React.CSSProperties
                }
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {analysisByCategoryTryout?.map((category: any, index: number) =>
          category.data.length === 0 ? (
            <TabsContent
              key={index}
              value={category.category}
            >
              <div className="text-center py-8 md:py-12 text-gray-500">
                <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Target className="w-6 h-6 md:w-8 md:h-8 opacity-50" />
                </div>
                <h3 className="font-semibold mb-2 text-sm md:text-base">
                  Belum Ada Data
                </h3>
                <p className="text-xs md:text-sm">
                  Data analisis untuk kategori ini belum tersedia
                </p>
              </div>
            </TabsContent>
          ) : (
            <TabsContent
              key={index}
              value={category.category}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <ChartContainer
                    config={defaultChartConfig}
                    className="min-h-[200px] w-full"
                  >
                    <ResponsiveContainer
                      width="100%"
                      height={300}
                    >
                      <BarChart data={category.data}>
                        <XAxis dataKey="subCategory" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                          dataKey="accuracy"
                          fill={mainColor}
                          name="Akurasi"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                <div className="h-[400px] overflow-x-auto overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow style={{ backgroundColor: `${mainColor}08` }}>
                        <TableHead className="font-bold text-gray-800">
                          Subtes
                        </TableHead>
                        <TableHead className="font-bold text-gray-800">
                          Akurasi
                        </TableHead>
                        <TableHead className="font-bold text-gray-800">
                          Status
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {category.data.map((item: any, idx: number) => (
                        <TableRow
                          key={idx}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <TableCell className="font-medium">
                            {item.subCategory}
                          </TableCell>
                          <TableCell className="font-medium">
                            {item.accuracy.toFixed(2)}%
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                item.accuracy >= 80
                                  ? 'text-white border-0'
                                  : 'bg-yellow-500 text-white border-0'
                              }
                              style={{
                                backgroundColor:
                                  item.accuracy >= 80 ? '#10b981' : undefined,
                              }}
                            >
                              {item.accuracy >= 80
                                ? 'Sangat Baik'
                                : 'Perlu Ditingkatkan'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
          ),
        )}
      </Tabs>
    </CardContent>
  </Card>
);

export const ScoreDevelopmentCard: React.FC<{
  scoreDevelopmentData: any;
  tryoutCategory: any;
  mainColor: string;
  secondaryColor: string;
}> = ({ scoreDevelopmentData, tryoutCategory, mainColor, secondaryColor }) => (
  <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
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
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
            style={{ backgroundColor: `${mainColor}15` }}
          >
            <TrendingUp
              className="w-5 h-5"
              style={{ color: mainColor }}
            />
          </div>
          Perkembangan Nilai
        </CardTitle>
        <CardDescription className="text-gray-600 mt-2">
          Grafik perkembangan nilai tryout kamu.
        </CardDescription>
      </div>
      {/* Decorative elements */}
      <div
        className="absolute -right-6 -top-6 w-16 h-16 rounded-full opacity-10"
        style={{ backgroundColor: mainColor }}
      />
    </CardHeader>

    <CardContent className="p-6">
      <ChartContainer
        config={defaultChartConfig}
        className="min-h-[200px] w-full"
      >
        <ResponsiveContainer
          width="100%"
          height={400}
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
                strokeWidth={3}
              />
            ))}
            <Line
              type="monotone"
              dataKey="total"
              stroke="#ff7300"
              name="Total"
              strokeWidth={4}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </CardContent>
  </Card>
);

// =====================================================================
// KOMPOEN LEARNING PROGRESS CARD (Gabungan Study Habits + Semua Sub-Komponen)
// =====================================================================
export const LearningActivityCard: React.FC<{
  data: LearningData;
  mainColor: string;
  secondaryColor: string;
}> = ({ data, mainColor, secondaryColor }) => (
  <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
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
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
            style={{ backgroundColor: `${mainColor}15` }}
          >
            <ActivityIcon
              className="w-5 h-5"
              style={{ color: mainColor }}
            />
          </div>
          Aktivitas Belajar
        </CardTitle>
        <CardDescription className="text-gray-600 mt-2">
          Statistik kegiatan belajar kamu minggu ini.
        </CardDescription>
      </div>
      {/* Decorative elements */}
      <div
        className="absolute -right-6 -top-6 w-16 h-16 rounded-full opacity-10"
        style={{ backgroundColor: mainColor }}
      />
    </CardHeader>

    <CardContent className="p-6">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <ActivitySummary
          icon={
            <FileText
              className="h-8 w-8"
              style={{ color: mainColor }}
            />
          }
          value={data.documentsRead}
          label="Dokumen Dibaca"
          increase={data.documentsReadIncrease}
          mainColor={mainColor}
        />
        <ActivitySummary
          icon={
            <PenTool
              className="h-8 w-8"
              style={{ color: mainColor }}
            />
          }
          value={data.notesCreated}
          label="Catatan Dibuat"
          increase={data.notesCreatedIncrease}
          mainColor={mainColor}
        />
        <ActivitySummary
          icon={
            <Highlighter
              className="h-8 w-8"
              style={{ color: mainColor }}
            />
          }
          value={data.highlightsMade}
          label="Highlight Dibuat"
          increase={data.highlightsMadeIncrease}
          mainColor={mainColor}
        />
        <ActivitySummary
          icon={
            <Brain
              className="h-8 w-8"
              style={{ color: mainColor }}
            />
          }
          value={data.quizStudied}
          label="Quiz Dibuat"
          increase={data.quizStudiedIncrease}
          mainColor={mainColor}
        />
      </div>
    </CardContent>
  </Card>
);

export const LearningConsistencyCard: React.FC<{ data: LearningData }> = ({
  data,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Konsistensi Belajar</CardTitle>
      <CardDescription className="text-sm text-gray-500">
        Streak belajar harian kamu.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex items-center space-x-2">
        <TrendingUp className="h-8 w-8 text-green-500" />
        <div>
          <p className="text-2xl font-bold">{data.learningStreak} hari</p>
          <p className="text-sm text-muted-foreground">Streak saat ini</p>
        </div>
      </div>
      <p className="text-sm">Streak terpanjang: {data.longestStreak} hari</p>
      <Progress
        value={(data.learningStreak / data.longestStreak) * 100}
        className="h-2"
      />
      <div className="mt-4 grid grid-cols-7 gap-1">
        {data.dailyStreak.map((day, index) => (
          <div
            key={index}
            className={`aspect-square w-full rounded-sm ${
              day.completed ? 'bg-green-500' : 'bg-gray-200'
            }`}
            title={`${day.date}: ${
              day.completed ? 'Completed' : 'Not completed'
            }`}
          />
        ))}
      </div>
    </CardContent>
  </Card>
);

export const WeeklyProgressCard: React.FC<{
  data: LearningData;
  mainColor: string;
  secondaryColor: string;
}> = ({ data, mainColor, secondaryColor }) => (
  <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
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
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
            style={{ backgroundColor: `${mainColor}15` }}
          >
            <Loader2Icon
              className="w-5 h-5"
              style={{ color: mainColor }}
            />
          </div>
          Progres Mingguan
        </CardTitle>
        <CardDescription className="text-gray-600 mt-2">
          Aktivitas belajar selama 7 hari terakhir.
        </CardDescription>
      </div>
      {/* Decorative elements */}
      <div
        className="absolute -right-6 -top-6 w-16 h-16 rounded-full opacity-10"
        style={{ backgroundColor: mainColor }}
      />
    </CardHeader>

    <CardContent className="p-6">
      <ChartContainer
        config={defaultChartConfig}
        className="min-h-[200px] w-full"
      >
        <ResponsiveContainer
          width="100%"
          height={400}
        >
          <LineChart data={[...data.weeklyProgress]}>
            <XAxis
              dataKey="date"
              tickFormatter={(date) => {
                const parsedDate = new Date(date);
                return new Intl.DateTimeFormat('id', {
                  day: 'numeric',
                  month: 'short',
                }).format(parsedDate);
              }}
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="documentsRead"
              stroke={mainColor}
              name="Dokumen Dibaca"
              strokeWidth={3}
            />
            <Line
              type="monotone"
              dataKey="notesCreated"
              stroke={secondaryColor}
              name="Catatan Dibuat"
              strokeWidth={3}
            />
            <Line
              type="monotone"
              dataKey="highlightsMade"
              stroke="#ffc658"
              name="Highlight Dibuat"
              strokeWidth={3}
            />
            <Line
              type="monotone"
              dataKey="quizStudied"
              stroke="#ff7300"
              name="Quiz Dibuat"
              strokeWidth={3}
            />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </CardContent>
  </Card>
);

export const RecentDocumentsCard: React.FC<{ data: LearningData }> = ({
  data,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Dokumen Terbaru</CardTitle>
      <CardDescription className="text-sm text-gray-500">
        Dokumen terakhir yang kamu pelajari.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2">
        {data.recentDocuments.map((doc, index) => (
          <li
            key={index}
            className="flex items-center justify-between"
          >
            <span>{doc.title}</span>
            <span className="text-sm text-muted-foreground">
              {new Date(doc.lastAccessed).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

export const MostActiveCard: React.FC<{ data: LearningData }> = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Jam Belajar Paling Aktif</CardTitle>
      <CardDescription className="text-sm text-gray-500">
        Waktu di mana kamu paling sering belajar.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ChartContainer
        config={defaultChartConfig}
        className="min-h-[200px] w-full"
      >
        <ResponsiveContainer
          width="100%"
          height={400}
        >
          <BarChart data={data.mostActiveHours}>
            <XAxis dataKey="hour" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="activity"
              fill="#8884d8"
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </CardContent>
  </Card>
);

export const StudyHabitsCard: React.FC<{
  studyHabits: any;
  mainColor: string;
  secondaryColor: string;
}> = ({ studyHabits, mainColor, secondaryColor }) => (
  <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
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
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
            style={{ backgroundColor: `${mainColor}15` }}
          >
            <LibraryBigIcon
              className="w-5 h-5"
              style={{ color: mainColor }}
            />
          </div>
          Kebiasaan Belajar
        </CardTitle>
        <CardDescription className="text-gray-600 mt-2">
          Ringkasan aktivitas dan performa belajar kamu.
        </CardDescription>
      </div>
      {/* Decorative elements */}
      <div
        className="absolute -right-6 -top-6 w-16 h-16 rounded-full opacity-10"
        style={{ backgroundColor: mainColor }}
      />
    </CardHeader>

    <CardContent className="p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center space-y-2">
          <div
            className="text-2xl font-bold"
            style={{ color: mainColor }}
          >
            {studyHabits.totalHoursStudied.toFixed(1)} jam
          </div>
          <div className="text-sm text-gray-600">Total Jam Belajar</div>
        </div>
        <div className="text-center space-y-2">
          <div
            className="text-2xl font-bold"
            style={{ color: mainColor }}
          >
            {studyHabits.longestStreak} hari
          </div>
          <div className="text-sm text-gray-600">Streak Terpanjang</div>
        </div>
        <div className="text-center space-y-2">
          <div
            className="text-2xl font-bold"
            style={{ color: mainColor }}
          >
            {studyHabits.averageDailyStudyTime.toFixed(1)} jam
          </div>
          <div className="text-sm text-gray-600">Rata-rata Harian</div>
        </div>
        <div className="text-center space-y-2">
          <div
            className="text-2xl font-bold"
            style={{ color: mainColor }}
          >
            {studyHabits.hoursThisWeek} jam
          </div>
          <div className="text-sm text-gray-600">Minggu Ini</div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Hari paling produktif:</span>
          <Badge
            className="text-white border-0"
            style={{ backgroundColor: mainColor }}
          >
            {studyHabits.mostProductiveDay}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Waktu belajar efektif:</span>
          <Badge
            className="text-white border-0"
            style={{ backgroundColor: mainColor }}
          >
            {studyHabits.mostEffectiveTime}
          </Badge>
        </div>
      </div>
    </CardContent>
  </Card>
);

// =====================================================================
// BAGIAN CALENDAR
// =====================================================================

const calendarViews: CalendarView[] = [
  { value: 'schedule', label: 'Jadwal' },
  { value: 'week', label: 'Mingguan' },
  { value: 'month', label: 'Bulanan' },
];

export const CalendarComponent: React.FC<{
  mainColor?: string;
  secondaryColor?: string;
}> = ({ mainColor = '#0091FF', secondaryColor = '#5aa4dd' }) => {
  const generateCalendarUrl = useCallback((view: string) => {
    let mode = view.toUpperCase();
    if (view === 'schedule') mode = 'AGENDA';
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    return `https://calendar.google.com/calendar/embed?src=admin%40bimbelio.com&wkst=2&bgcolor=%23ffffff&ctz=Asia%2FJakarta&hl=id&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=0&showCalendars=0&showTz=1&mode=${mode}${
      view === 'agenda' ? `&dates=${today}%2F${today}` : ''
    }`;
  }, []);

  return (
    <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
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
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <CalendarRangeIcon
                className="w-5 h-5"
                style={{ color: mainColor }}
              />
            </div>
            Kalender
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            Pantau dan aktivitas kegiatan belajarmu.
          </CardDescription>
        </div>
        {/* Decorative elements */}
        <div
          className="absolute -right-6 -top-6 w-16 h-16 rounded-full opacity-10"
          style={{ backgroundColor: mainColor }}
        />
      </CardHeader>

      <CardContent className="p-6">
        <Tabs defaultValue="schedule">
          <TabsList className="grid grid-cols-3 mb-6 bg-gray-100 gap-2 rounded-xl p-1 h-12">
            {calendarViews.map(({ value, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="rounded-xl data-[state=active]:text-white data-[state=active]:shadow-sm"
                style={
                  {
                    '--tw-gradient-from': mainColor,
                    '--tw-gradient-to': secondaryColor,
                  } as React.CSSProperties
                }
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          {calendarViews.map(({ value }) => (
            <TabsContent
              key={value}
              value={value}
            >
              <iframe
                src={generateCalendarUrl(value)}
                className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] border-0 rounded-xl"
                style={{ border: 0 }}
              />
            </TabsContent>
          ))}
        </Tabs>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-3">Keterangan:</h3>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-blue-50 text-blue-700 border border-blue-200 py-1.5 px-4 rounded-full hover:bg-white">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
              Kelas Online
            </Badge>
            <Badge className="bg-green-50 text-green-700 border border-green-200 py-1.5 px-4 rounded-full hover:bg-white">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              Try Out
            </Badge>
            <Badge className="bg-yellow-50 text-yellow-700 border border-yellow-200 py-1.5 px-4 rounded-full hover:bg-white">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2" />
              Webinar
            </Badge>
            <Badge className="bg-red-50 text-red-700 border border-red-200 py-1.5 px-4 rounded-full hover:bg-white">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
              Tanggal Penting
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// =====================================================================
// KOMPONEN UTAMA DASHBOARD
// =====================================================================

export default function DashboardClient() {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  // ...existing state and useEffect code...
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [reportData, setReportData] = useState<ReportDataType | undefined>();
  const [isLoadingLearningData, setIsLoadingLearningData] =
    useState<boolean>(true);
  const [learningData, setLearningData] = useState<
    LearningDataType | undefined
  >();

  const getLearningReport = async () => {
    await getGeneral(`/report/getLearningReport?userId=${session?.user.id}`, {
      setData: setLearningData,
      setLoading: setIsLoadingLearningData,
      onError({ message }) {
        setError(message);
      },
    });
  };

  useEffect(() => {
    getLearningReport();
    getGeneral(`/report/getReportData?userId=${session?.user.id}`, {
      setData: setReportData,
      setLoading: setIsLoading,
    });
  }, []);

  if (isLoading || isLoadingLearningData) {
    return (
      <div className="absolute left-0 top-0 w-full h-[calc(100vh-80px)]">
        <LoadingRetro />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-[-80px] flex h-screen items-center justify-center">
        Error: {error}
      </div>
    );
  }

  if (!reportData || !learningData) {
    return (
      <div className="mt-[-80px] flex h-screen items-center justify-center">
        Tidak ada data yang ditemukan
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 py-6">
        {/* Enhanced Header Section */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            <Home className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
          <h1
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ color: mainColor }}
          >
            Dashboard
          </h1>
          <p className="text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto text-sm md:text-base">
            Pantau kemajuan dan tingkatkan persiapan ujian kamu
          </p>
        </div>

        {/* Performance Summary */}
        <section className="mb-8">
          <PerformanceSummary
            learningReport={reportData?.learningReport}
            studyHabits={reportData?.studyHabits}
            tryoutHistory={reportData?.tryoutHistory}
            mainColor={mainColor}
          />
        </section>

        {/* Calendar Section */}
        <section className="mb-8">
          <CalendarComponent
            mainColor={mainColor}
            secondaryColor={secondaryColor}
          />
        </section>

        {/* Study Habits & Learning Activity */}
        <section className="mb-8 grid gap-6 grid-cols-1 lg:grid-cols-2">
          <StudyHabitsCard
            studyHabits={reportData?.studyHabits}
            mainColor={mainColor}
            secondaryColor={secondaryColor}
          />
          <LearningActivityCard
            data={learningData as LearningData}
            mainColor={mainColor}
            secondaryColor={secondaryColor}
          />
        </section>

        {/* Progress & Score Development */}
        <section className="mb-8 grid gap-6 grid-cols-1 lg:grid-cols-2">
          <WeeklyProgressCard
            data={learningData as LearningData}
            mainColor={mainColor}
            secondaryColor={secondaryColor}
          />
          <ScoreDevelopmentCard
            scoreDevelopmentData={reportData?.scoreDevelopmentData}
            tryoutCategory={reportData?.tryoutCategory}
            mainColor={mainColor}
            secondaryColor={secondaryColor}
          />
        </section>

        {/* Tryout & Quiz History */}
        <section className="mb-8 grid gap-6 grid-cols-1 lg:grid-cols-2">
          <TryoutHistoryCard
            tryoutHistory={reportData?.tryoutHistory}
            tryoutCategory={reportData?.tryoutCategory}
            mainColor={mainColor}
            secondaryColor={secondaryColor}
          />
          <QuizHistoryCard
            quizHistory={reportData?.quizHistory}
            mainColor={mainColor}
            secondaryColor={secondaryColor}
          />
        </section>

        {/* Test Analysis */}
        <section className="mb-8">
          <TestAnalysisCard
            analysisByCategoryTryout={reportData?.analysisByCategoryTryout}
            tryoutCategory={reportData?.tryoutCategory}
            mainColor={mainColor}
            secondaryColor={secondaryColor}
          />
        </section>
      </div>
    </div>
  );
}

type LearningDataType = {
  documentsRead: number;
  notesCreated: number;
  highlightsMade: number;
  quizStudied: number;
  studyTimeByCategory: {
    name: string;
    value: number;
  }[];
  documentsReadIncrease: number;
  notesCreatedIncrease: number;
  highlightsMadeIncrease: number;
  quizStudiedIncrease: number;
  learningStreak: number;
  longestStreak: number;
  topCategories: {
    name: string;
    count: number;
  }[];
  recentDocuments: {
    title: string;
    lastAccessed: string;
  }[];
  mostActiveHours: {
    hour: number;
    activity: number;
  }[];
  quizAccuracy: number;
  totalStudyTime: number;
  averageSessionDuration: number;
  dailyStreak: {
    date: string;
    completed: boolean;
  }[];
  weeklyProgress: {
    documentsRead: number;
    notesCreated: number;
    highlightsMade: number;
    quizStudied: number;
    date: string;
  }[];
};

type ReportDataType = {
  userHeader: {
    name: string;
    status: UserRoleEnum;
    daysLeft: number;
    avatarUrl: string | null;
  };
  studyHabits: {
    totalHoursStudied: number;
    hoursThisWeek: number;
    longestStreak: number;
    averageDailyStudyTime: number;
    mostProductiveDay: string;
    mostEffectiveTime: string;
  };
  learningReport: {
    totalScore: any;
    scoreIncrease: number;
    scoreIncreasePercentage: number;
    rank: number;
    rankIncrease: number;
    documentsRead: number;
    notesCreated: number;
    highlightsMade: number;
    quizStudied: number;
  };
  tryoutCategory: {
    id: string;
    name: string;
    TryoutSessionResult: {
      id: string;
      totalScore: number;
      categoryId: string;
      tryoutResultId: string;
      sessionId: string;
      startSession: Date;
      endSession: Date;
      theta: number | null;
    }[];
  }[];
  scoreDevelopmentData: {
    total: number;
    date: string;
  }[];
  dataScoreDistribution: {
    scoreRange: string;
    totalParticipants: number;
    highestScore: number;
    lowestScore: number;
    averageScore: number;
    percentage: number;
  }[];
  analysisByCategoryTryout: {
    data: {
      subCategory: string;
      accuracy: number;
    }[];
    category: string;
  }[];
  tryoutHistory: {
    history: {
      rank: number;
      duration: string;
      show: boolean;
      change: number;
      Tryout: {
        id: string;
        image: string | null;
        createAt: Date;
        updateAt: Date;
        title: string;
        restTime: number;
        status: TryoutStatusEnum;
        startDate: Date;
        endDate: Date;
        resultDate: Date;
      };
      TryoutSessionResult: ({
        TryoutSession: {
          thresholdValue: number | null;
        };
        TryoutCategory: {
          id: string;
          name: string;
        };
      } & {
        id: string;
        totalScore: number;
        categoryId: string;
        tryoutResultId: string;
        sessionId: string;
        startSession: Date;
        endSession: Date;
        theta: number | null;
      })[];
      userId: string;
      id: string;
      tryoutId: string;
      totalScore: number;
      startTryout: Date;
      endTryout: Date;
    }[];
    chart: {
      tanggal: Date;
      skorTotal: number;
      peringkat: number;
      perubahan: number;
    }[];
  };
  quizHistory: {
    history: {
      userId: string;
      id: string;
      createAt: Date;
      accuracy: number;
    }[];
    chart: {
      tanggal: Date;
      accuracy: number;
      perubahan: number;
    }[];
  };
};
