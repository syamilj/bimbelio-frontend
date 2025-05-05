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

// Utilitas dan API
import { cn, getDateString, getHours } from '@/lib/utils';

// Icon dari lucide-react
import {
  Activity,
  ActivityIcon,
  Award,
  Brain,
  CalendarRangeIcon,
  ChevronUp,
  Clock,
  FileText,
  Highlighter,
  LibraryBigIcon,
  Loader2Icon,
  PenTool,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';

// Komponen Chart dari recharts
import { useSession } from '@/components/provider/session-provider-auth';
import { getGeneral } from '@/lib/fetch-helper';
import { TryoutStatusEnum, UserRoleEnum } from '@/types/database';
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
  bgColour: string;
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
  bgColour,
}) => (
  <Card className={cn('overflow-hidden flex flex-col', bgColour)}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-base font-semibold">{title}</CardTitle>
      <div className="bg-white p-2 rounded-full shadow-sm">{icon}</div>
    </CardHeader>
    <CardContent className="flex flex-col items-start">
      <p className="text-3xl font-bold">{value}</p>
      <div className="mt-2 flex items-center text-sm">
        <ChevronUp className="mr-1 h-4 w-4 text-green-500" />
        <span className="font-medium text-green-500">
          +{change} {changeLabel || ''}
        </span>
        {changePercentage !== undefined && (
          <span className="ml-1 text-gray-500">
            ({changePercentage.toFixed(2)}%)
          </span>
        )}
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
}) => (
  <div className="flex flex-col items-center">
    {icon}
    <p className="mt-2 text-2xl font-bold">{value}</p>
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
}> = ({ learningReport, studyHabits, tryoutHistory }) => (
  <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
    <StatCard
      icon={<Award className="h-4 w-4" />}
      title="Nilai Total"
      value={learningReport.totalScore}
      change={learningReport.scoreIncrease}
      changePercentage={learningReport.scoreIncreasePercentage}
      bgColour="bg-blue-100 text-blue-600"
    />
    <StatCard
      icon={<Activity className="h-4 w-4" />}
      title="Peringkat"
      value={`#${learningReport.rank}`}
      change={learningReport.rankIncrease}
      changeLabel="posisi"
      bgColour="bg-green-100 text-green-600"
    />
    <StatCard
      icon={<Clock className="h-4 w-4" />}
      title="Jam Belajar"
      value={`${studyHabits.hoursThisWeek} jam`}
      change={2}
      changeLabel="jam"
      changePercentage={10}
      bgColour="bg-yellow-100 text-yellow-600"
    />
    <StatCard
      icon={<Users className="h-4 w-4" />}
      title="Tryout Selesai"
      value={tryoutHistory?.history.length}
      change={2}
      changeLabel="dari bulan lalu"
      bgColour="bg-purple-100 text-purple-600"
    />
  </div>
);

export const TryoutHistoryCard: React.FC<{
  tryoutHistory: any;
  tryoutCategory: any;
}> = ({ tryoutHistory, tryoutCategory }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center text-2xl font-bold">
        <Target className="mr-2 h-6 w-6 text-red-500" />
        Try Out
      </CardTitle>
      <CardDescription className="text-sm text-gray-500">
        Rekap dan evaluasi tryout kamu.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Tabs defaultValue="grafik">
        <TabsList className="mb-4">
          <TabsTrigger value="grafik">Grafik</TabsTrigger>
          <TabsTrigger value="detail">Detail</TabsTrigger>
        </TabsList>
        <TabsContent value="detail">
          <div className="max-h-[400px] overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Nilai Total</TableHead>
                  {tryoutCategory?.map((category: any, index: number) => (
                    <TableHead
                      key={index}
                      className="text-center"
                    >
                      {category.name}
                    </TableHead>
                  ))}
                  <TableHead className="text-center">Peringkat</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tryoutHistory?.history?.map((tryout: any, index: number) => (
                  <TableRow key={index}>
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
                      if (!tryout.show) {
                        return (
                          <TableCell
                            key={idx}
                            className="text-center"
                          >
                            ...?
                          </TableCell>
                        );
                      }
                      return (
                        <TableCell
                          key={idx}
                          className="text-center"
                        >
                          {thisSession?.totalScore || '-'}{' '}
                          {thisSession && ' / '}
                          {thisSession?.TryoutSession.thresholdValue}
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
                      >
                        <Link href={`/user/try-out/${tryout.Tryout?.id}`}>
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
            tryout SNBT/UTBK.
          </p>
        </TabsContent>
      </Tabs>
    </CardContent>
  </Card>
);

export const QuizHistoryCard: React.FC<{ quizHistory: any }> = ({
  quizHistory,
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center text-2xl font-bold">
        <Brain className="mr-2 h-6 w-6 text-green-500" />
        Quiz
      </CardTitle>
      <CardDescription className="text-sm text-gray-500">
        Statistik dan rekap quiz yang telah kamu kerjakan.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Tabs defaultValue="grafik">
        <TabsList className="mb-4">
          <TabsTrigger value="grafik">Grafik</TabsTrigger>
          <TabsTrigger value="detail">Detail</TabsTrigger>
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
            Grafik ini menunjukkan perkembangan akurasi dan perubahan dalam quiz
            SNBT/UTBK.
          </p>
        </TabsContent>
      </Tabs>
    </CardContent>
  </Card>
);

export const TestAnalysisCard: React.FC<{
  analysisByCategoryTryout: any;
  tryoutCategory: any;
}> = ({ analysisByCategoryTryout, tryoutCategory }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center text-2xl font-bold">
        <Target className="mr-2 h-6 w-6 text-red-500" />
        Analisis per Bidang Tes
      </CardTitle>
      <CardDescription className="text-sm text-gray-500">
        Analisis detail berdasarkan subtes.
      </CardDescription>
    </CardHeader>
    <CardContent className="overflow-hidden">
      <Tabs defaultValue={tryoutCategory?.[0]?.name || ''}>
        <div className="w-full overflow-x-auto pb-2">
          <TabsList className="mb-4 inline-flex w-max">
            {tryoutCategory?.map((category: any, index: number) => (
              <TabsTrigger
                key={index}
                value={category.name}
                className="whitespace-nowrap"
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
                          fill="#8884d8"
                          name="Akurasi"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                <div className="h-[400px] overflow-x-auto overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subtes</TableHead>
                        <TableHead>Akurasi</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">-</Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
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
                          fill="#8884d8"
                          name="Akurasi"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                <div className="h-[400px] overflow-x-auto overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subtes</TableHead>
                        <TableHead>Akurasi</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {category.data.map((item: any, idx: number) => (
                        <TableRow key={idx}>
                          <TableCell>{item.subCategory}</TableCell>
                          <TableCell>{item.accuracy.toFixed(2)}%</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                item.accuracy >= 80
                                  ? 'bg-green-500'
                                  : 'bg-yellow-500'
                              }
                            >
                              {item.accuracy >= 80 ? 'Sangat Baik' : 'Baik'}
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
}> = ({ scoreDevelopmentData, tryoutCategory }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center text-2xl font-bold">
        <TrendingUp className="mr-2 h-6 w-6 text-blue-500" />
        Perkembangan Nilai
      </CardTitle>
      <CardDescription className="text-sm text-gray-500">
        Grafik perkembangan nilai tryout kamu.
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
                  index === 0 ? '#8884d8' : index === 1 ? '#82ca9d' : '#ffc658'
                }
                name={category.name}
              />
            ))}
            <Line
              type="monotone"
              dataKey="total"
              stroke="#ff7300"
              name="Total"
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
export const LearningActivityCard: React.FC<{ data: LearningData }> = ({
  data,
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center text-2xl font-bold">
        <ActivityIcon className="mr-2 h-6 w-6 text-indigo-500" />
        Aktivitas Belajar
      </CardTitle>
      <CardDescription className="text-sm text-gray-500">
        Statistik kegiatan belajar kamu minggu ini.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <ActivitySummary
          icon={<FileText className="h-8 w-8 text-blue-500" />}
          value={data.documentsRead}
          label="Dokumen Dibaca"
          increase={data.documentsReadIncrease}
        />
        <ActivitySummary
          icon={<PenTool className="h-8 w-8 text-green-500" />}
          value={data.notesCreated}
          label="Catatan Dibuat"
          increase={data.notesCreatedIncrease}
        />
        <ActivitySummary
          icon={<Highlighter className="h-8 w-8 text-yellow-500" />}
          value={data.highlightsMade}
          label="Highlight Dibuat"
          increase={data.highlightsMadeIncrease}
        />
        <ActivitySummary
          icon={<Brain className="h-8 w-8 text-red-500" />}
          value={data.quizStudied}
          label="Quiz Dibuat"
          increase={data.quizStudiedIncrease}
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

export const WeeklyProgressCard: React.FC<{ data: LearningData }> = ({
  data,
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center text-2xl font-bold">
        <Loader2Icon className="mr-2 h-6 w-6 text-indigo-500" />
        Progres Mingguan
      </CardTitle>
      <CardDescription className="text-sm text-gray-500">
        Aktivitas belajar selama 7 hari terakhir.
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
              stroke="#8884d8"
              name="Dokumen Dibaca"
            />
            <Line
              type="monotone"
              dataKey="notesCreated"
              stroke="#82ca9d"
              name="Catatan Dibuat"
            />
            <Line
              type="monotone"
              dataKey="highlightsMade"
              stroke="#ffc658"
              name="Highlight Dibuat"
            />
            <Line
              type="monotone"
              dataKey="quizStudied"
              stroke="#ff7300"
              name="Quiz Dibuat"
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

export const StudyHabitsCard: React.FC<{ studyHabits: any }> = ({
  studyHabits,
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center text-2xl font-bold">
        <LibraryBigIcon className="mr-2 h-6 w-6 text-indigo-500" />
        Kebiasaan Belajar
      </CardTitle>
      <CardDescription className="text-sm text-gray-500">
        Ringkasan aktivitas dan performa belajar kamu.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StudyHabitStat
          label="Total Jam Belajar"
          value={`${studyHabits.totalHoursStudied.toFixed(2)} jam`}
        />
        <StudyHabitStat
          label="Streak Terpanjang"
          value={`${studyHabits.longestStreak} hari`}
        />
        <StudyHabitStat
          label="Rata-rata Harian"
          value={`${studyHabits.averageDailyStudyTime.toFixed(2)} jam`}
        />
        <StudyHabitStat
          label="Jam Belajar Minggu Ini"
          value={`${studyHabits.hoursThisWeek} jam`}
        />
      </div>
      <div className="mt-6 space-y-2">
        <div className="text-sm text-muted-foreground">
          Hari paling produktif:
          <Badge
            variant="outline"
            className="ml-2"
          >
            {studyHabits.mostProductiveDay}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          Waktu belajar paling efektif:
          <Badge
            variant="outline"
            className="ml-2"
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

export const CalendarComponent: React.FC = () => {
  const generateCalendarUrl = useCallback((view: string) => {
    let mode = view.toUpperCase();
    if (view === 'schedule') mode = 'AGENDA';
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    return `https://calendar.google.com/calendar/embed?src=admin%40bimbelio.com&wkst=2&bgcolor=%23ffffff&ctz=Asia%2FJakarta&hl=id&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=0&showCalendars=0&showTz=1&mode=${mode}${
      view === 'agenda' ? `&dates=${today}%2F${today}` : ''
    }`;
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <CalendarRangeIcon className="h-6 w-6" />
          Kalender
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">
          Pantau dan aktivitas kegiatan belajarmu.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="schedule">
          <TabsList>
            {calendarViews.map(({ value, label }) => (
              <TabsTrigger
                key={value}
                value={value}
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
                className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] border-0 rounded-lg"
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
  // const {
  //   data: reportData,
  //   isLoading,
  //   error,
  // } = api.report.getReportData.useQuery(undefined, {
  //   refetchOnWindowFocus: false,
  //   refetchOnMount: false,
  // });
  // const { data: learningData, isLoading: isLoadingLearningData } =
  //   api.report.getLearningReport.useQuery(undefined, {
  //     refetchOnWindowFocus: false,
  //     refetchOnMount: false,
  //   });

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
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        {/* HEADER */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-xl text-gray-600">
            Pantau kemajuan dan tingkatkan persiapan ujian kamu
          </p>
        </header>

        <section className="mb-12 space-y-8">
          <PerformanceSummary
            learningReport={reportData?.learningReport}
            studyHabits={reportData?.studyHabits}
            tryoutHistory={reportData?.tryoutHistory}
          />
        </section>

        {/* CALENDAR */}
        <section className="mb-12">
          <CalendarComponent />
        </section>

        {/* Learning Progress Card */}
        <section className="mb-12 grid gap-6 grid-cols-1 md:grid-cols-2">
          <StudyHabitsCard studyHabits={reportData?.studyHabits} />
          <LearningActivityCard data={learningData as LearningData} />
        </section>

        <section className="mb-12 grid gap-6 grid-cols-1 md:grid-cols-2">
          <WeeklyProgressCard data={learningData as LearningData} />
          <ScoreDevelopmentCard
            scoreDevelopmentData={reportData?.scoreDevelopmentData}
            tryoutCategory={reportData?.tryoutCategory}
          />
        </section>

        {/* RIWAYAT TRYOUT & QUIZ */}
        <section className="mb-12 grid gap-6 grid-cols-1 md:grid-cols-2">
          <TryoutHistoryCard
            tryoutHistory={reportData?.tryoutHistory}
            tryoutCategory={reportData?.tryoutCategory}
          />
          <QuizHistoryCard quizHistory={reportData?.quizHistory} />
        </section>

        {/* ANALISIS & PERKEMBANGAN NILAI */}
        <section className="mb-12 space-y-8">
          <TestAnalysisCard
            analysisByCategoryTryout={reportData?.analysisByCategoryTryout}
            tryoutCategory={reportData?.tryoutCategory}
          />
        </section>
      </main>
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
