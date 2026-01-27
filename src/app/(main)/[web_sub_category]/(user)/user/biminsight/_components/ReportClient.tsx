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
  Calendar,
  CalendarRangeIcon,
  ChevronUp,
  Clock,
  FileText,
  Flame,
  Highlighter,
  Home,
  LibraryBigIcon,
  LineChart as LineChartIcon,
  PenTool,
  Target,
  TrendingUp,
  Trophy,
  Zap,
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

// interface LearningData {
//   documentsRead: number;
//   documentsReadIncrease: number;
//   notesCreated: number;
//   notesCreatedIncrease: number;
//   highlightsMade: number;
//   highlightsMadeIncrease: number;
//   quizStudied: number;
//   quizStudiedIncrease: number;
//   studyTimeByCategory: { name: string; value: number }[];
//   learningStreak: number;
//   longestStreak: number;
//   dailyStreak: { date: string; completed: boolean }[];
//   weeklyProgress: {
//     date: string;
//     documentsRead: number;
//     notesCreated: number;
//     highlightsMade: number;
//     quizStudied: number;
//   }[];
//   recentDocuments: { title: string; lastAccessed: string }[];
//   mostActiveHours: { hour: number; activity: number }[];
//   quizAccuracy: number;
//   totalStudyTime: number;
//   averageSessionDuration: number;
// }

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
// KOMPONEN UTAMA DASHBOARD
// =====================================================================

export default function ReportClient() {
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
    <div className="min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Modern Header Section - Card Style */}
        <div className="mb-12 grid gap-6 grid-cols-1 md:grid-cols-3">
          {/* Welcome Card */}
          <div className="md:col-span-2 bg-white border-2 border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">
                  Selamat Datang Kembali,
                </p>
                <h1
                  className="text-3xl md:text-4xl font-black"
                  style={{ color: mainColor }}
                >
                  {session?.user?.name || 'User'}
                </h1>
              </div>
              <div
                className="w-16 h-16 rounded-3xl flex items-center justify-center text-white"
                style={{ backgroundColor: mainColor }}
              >
                <Home className="w-8 h-8" />
              </div>
            </div>
            <p className="text-gray-600 text-base">
              Pantau kemajuan belajarmu dengan data real-time dan tingkatkan
              persiapan ujianmu
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Badge className="bg-blue-50 text-blue-700 border border-blue-200 font-medium px-4 py-2">
                <Zap className="w-3 h-3 mr-2" />
                Terus Semangat!
              </Badge>
              <Badge className="bg-green-50 text-green-700 border border-green-200 font-medium px-4 py-2">
                <TrendingUp className="w-3 h-3 mr-2" />
                Progres Positif
              </Badge>
            </div>
          </div>

          {/* Rank Card */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-6 h-6 text-purple-600" />
              <p className="text-purple-700 font-bold">Peringkat Kamu</p>
            </div>
            <div className="text-4xl font-black text-purple-700 mb-2">
              #{reportData?.learningReport?.rank || '0'}
            </div>
            <p className="text-sm text-purple-600">
              {reportData?.learningReport?.rankIncrease > 0 ? '↑' : '↓'}{' '}
              {Math.abs(reportData?.learningReport?.rankIncrease || 0)} posisi
            </p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <section className="mb-12">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-3xl p-5 text-center">
              <Clock className="w-5 h-5 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700">
                {reportData?.studyHabits?.totalHoursStudied?.toFixed(0) || '0'}
              </div>
              <p className="text-xs text-blue-600 font-medium mt-1">
                Jam Belajar
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-3xl p-5 text-center">
              <Award className="w-5 h-5 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700">
                {reportData?.learningReport?.totalScore || '0'}
              </div>
              <p className="text-xs text-green-600 font-medium mt-1">
                Nilai Total
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-3xl p-5 text-center">
              <Target className="w-5 h-5 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-700">
                {reportData?.tryoutHistory?.history.length || '0'}
              </div>
              <p className="text-xs text-orange-600 font-medium mt-1">
                Try Out Selesai
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-pink-200 rounded-3xl p-5 text-center">
              <Brain className="w-5 h-5 text-pink-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-pink-700">
                {reportData?.studyHabits?.longestStreak || '0'}
              </div>
              <p className="text-xs text-pink-600 font-medium mt-1">
                Streak Terpanjang
              </p>
            </div>
          </div>
        </section>

        {/* Study Habits & Learning Activity */}
        <section className="mb-12 grid gap-6 grid-cols-1">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Clock
                className="w-6 h-6"
                style={{ color: mainColor }}
              />
              <h2
                className="text-xl md:text-2xl font-bold"
                style={{ color: mainColor }}
              >
                Kebiasaan Belajar
              </h2>
            </div>
            <StudyHabitsCard
              studyHabits={reportData?.studyHabits}
              mainColor={mainColor}
              secondaryColor={secondaryColor}
            />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-4">
              <ActivityIcon
                className="w-6 h-6"
                style={{ color: mainColor }}
              />
              <h2
                className="text-xl md:text-2xl font-bold"
                style={{ color: mainColor }}
              >
                Aktivitas Belajar
              </h2>
            </div>
            <LearningActivityCard
              data={learningData as LearningDataType}
              mainColor={mainColor}
              secondaryColor={secondaryColor}
            />
          </div>
        </section>

        {/* Progress & Score Development */}
        <section className="mb-12 grid gap-6 grid-cols-1">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <LineChartIcon
                className="w-6 h-6"
                style={{ color: mainColor }}
              />
              <h2
                className="text-xl md:text-2xl font-bold"
                style={{ color: mainColor }}
              >
                Progres Mingguan
              </h2>
            </div>
            <WeeklyProgressCard
              data={learningData as LearningDataType}
              mainColor={mainColor}
              secondaryColor={secondaryColor}
            />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp
                className="w-6 h-6"
                style={{ color: mainColor }}
              />
              <h2
                className="text-xl md:text-2xl font-bold"
                style={{ color: mainColor }}
              >
                Perkembangan Nilai
              </h2>
            </div>
            <ScoreDevelopmentCard
              scoreDevelopmentData={reportData?.scoreDevelopmentData}
              tryoutCategory={reportData?.tryoutCategory}
              mainColor={mainColor}
              secondaryColor={secondaryColor}
            />
          </div>
        </section>

        {/* Tryout & Quiz History */}
        <section className="mb-12 grid gap-6 grid-cols-1">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Target
                className="w-6 h-6"
                style={{ color: mainColor }}
              />
              <h2
                className="text-xl md:text-2xl font-bold"
                style={{ color: mainColor }}
              >
                Try Out
              </h2>
            </div>
            <TryoutHistoryCard
              tryoutHistory={reportData?.tryoutHistory}
              tryoutCategory={reportData?.tryoutCategory}
              mainColor={mainColor}
              secondaryColor={secondaryColor}
            />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Brain
                className="w-6 h-6"
                style={{ color: mainColor }}
              />
              <h2
                className="text-xl md:text-2xl font-bold"
                style={{ color: mainColor }}
              >
                Quiz
              </h2>
            </div>
            <QuizHistoryCard
              quizHistory={reportData?.quizHistory}
              mainColor={mainColor}
              secondaryColor={secondaryColor}
            />
          </div>
        </section>

        {/* Calendar Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <CalendarRangeIcon
              className="w-6 h-6"
              style={{ color: mainColor }}
            />
            <h2
              className="text-xl md:text-2xl font-bold"
              style={{ color: mainColor }}
            >
              Kalender & Jadwal
            </h2>
          </div>
          <CalendarComponent
            mainColor={mainColor}
            secondaryColor={secondaryColor}
          />
        </section>

        {/* Test Analysis */}
        {/* <section className="mb-8">
          <TestAnalysisCard
            analysisByCategoryTryout={reportData?.analysisByCategoryTryout}
            tryoutCategory={reportData?.tryoutCategory}
            mainColor={mainColor}
            secondaryColor={secondaryColor}
          />
        </section> */}
      </div>
    </div>
  );
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
  <Card className="bg-white shadow-lg border-0 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 group h-full">
    <CardHeader
      className="pb-4 relative overflow-hidden h-20"
      style={{ backgroundColor: `${mainColor}08` }}
    >
      <div className="flex items-center justify-between relative z-10">
        <CardTitle className="text-sm font-bold text-gray-700 truncate">
          {title}
        </CardTitle>
        <div
          className="w-12 h-12 rounded-3xl flex items-center justify-center shadow-md text-white flex-shrink-0 group-hover:scale-110 transition-transform"
          style={{ backgroundColor: mainColor }}
        >
          {icon}
        </div>
      </div>
      {/* Decorative element */}
      <div
        className="absolute -right-6 -top-6 w-16 h-16 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
        style={{ backgroundColor: mainColor }}
      />
    </CardHeader>
    <CardContent className="pt-6 pb-6 space-y-4">
      <div>
        <div
          className="text-3xl md:text-4xl font-black mb-2"
          style={{ color: mainColor }}
        >
          {value}
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <div className="flex items-center gap-1 text-green-600 font-semibold">
          <ChevronUp className="w-4 h-4" />
          <span>
            +{change} {changeLabel || ''}
          </span>
        </div>
        {changePercentage !== undefined && (
          <span className="text-gray-500 text-xs">
            ({changePercentage?.toFixed(1)}%)
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

// export const TestAnalysisCard: React.FC<{
//   analysisByCategoryTryout: any;
//   tryoutCategory: any;
//   mainColor: string;
//   secondaryColor: string;
// }> = ({
//   analysisByCategoryTryout,
//   tryoutCategory,
//   mainColor,
//   secondaryColor,
// }) => (
//   <Card className="bg-white shadow-lg border-0 rounded-3xl overflow-hidden">
//     <CardHeader
//       className="pb-4 relative overflow-hidden"
//       style={{
//         background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
//       }}
//     >
//       <div className="relative z-10">
//         <CardTitle
//           className="text-xl font-bold flex items-center gap-3"
//           style={{ color: mainColor }}
//         >
//           <div
//             className="w-10 h-10 rounded-3xl flex items-center justify-center shadow-sm"
//             style={{ backgroundColor: `${mainColor}15` }}
//           >
//             <Target
//               className="w-5 h-5"
//               style={{ color: mainColor }}
//             />
//           </div>
//           Analisis per Bidang Tes
//         </CardTitle>
//         <CardDescription className="text-gray-600 mt-2">
//           Analisis detail berdasarkan subtes.
//         </CardDescription>
//       </div>
//       {/* Decorative elements */}
//       <div
//         className="absolute -right-6 -top-6 w-16 h-16 rounded-full opacity-10"
//         style={{ backgroundColor: mainColor }}
//       />
//     </CardHeader>

//     <CardContent className="p-6 overflow-hidden">
//       <Tabs defaultValue={tryoutCategory?.[0]?.name || ''}>
//         <div className="w-full overflow-x-auto pb-2">
//           <TabsList className="mb-4 inline-flex w-max bg-gray-100 rounded-3xl p-1 h-12">
//             {tryoutCategory?.map((category: any, index: number) => (
//               <TabsTrigger
//                 key={index}
//                 value={category.name}
//                 className="flex items-center gap-2 rounded-3xl px-3 md:px-4 py-2 text-xs md:text-sm font-medium transition-all duration-200 text-gray-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
//                 style={
//                   {
//                     '--tw-bg-opacity': '1',
//                   } as React.CSSProperties & { [key: string]: string }
//                 }
//                 data-active-bg={mainColor}
//               >
//                 {category.name}
//               </TabsTrigger>
//             ))}
//           </TabsList>
//         </div>
//         {analysisByCategoryTryout?.map((category: any, index: number) =>
//           category.data.length === 0 ? (
//             <TabsContent
//               key={index}
//               value={category.category}
//             >
//               <div className="text-center py-8 md:py-12 text-gray-500">
//                 <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
//                   <Target className="w-6 h-6 md:w-8 md:h-8 opacity-50" />
//                 </div>
//                 <h3 className="font-semibold mb-2 text-sm md:text-base">
//                   Belum Ada Data
//                 </h3>
//                 <p className="text-xs md:text-sm">
//                   Data analisis untuk kategori ini belum tersedia
//                 </p>
//               </div>
//             </TabsContent>
//           ) : (
//             <TabsContent
//               key={index}
//               value={category.category}
//             >
//               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                 <div>
//                   <ChartContainer
//                     config={defaultChartConfig}
//                     className="min-h-[200px] w-full"
//                   >
//                     <ResponsiveContainer
//                       width="100%"
//                       height={300}
//                     >
//                       <BarChart data={category.data}>
//                         <XAxis dataKey="subCategory" />
//                         <YAxis />
//                         <ChartTooltip content={<ChartTooltipContent />} />
//                         <Bar
//                           dataKey="accuracy"
//                           fill={mainColor}
//                           name="Akurasi"
//                           radius={[4, 4, 0, 0]}
//                         />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </ChartContainer>
//                 </div>
//                 <div className="h-[400px] overflow-x-auto overflow-y-auto">
//                   <Table>
//                     <TableHeader>
//                       <TableRow style={{ backgroundColor: `${mainColor}08` }}>
//                         <TableHead className="font-bold text-gray-800">
//                           Subtes
//                         </TableHead>
//                         <TableHead className="font-bold text-gray-800">
//                           Akurasi
//                         </TableHead>
//                         <TableHead className="font-bold text-gray-800">
//                           Status
//                         </TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {category.data.map((item: any, idx: number) => (
//                         <TableRow
//                           key={idx}
//                           className="hover:bg-gray-50 transition-colors"
//                         >
//                           <TableCell className="font-medium">
//                             {item.subCategory}
//                           </TableCell>
//                           <TableCell className="font-medium">
//                             {item.accuracy?.toFixed(2)}%
//                           </TableCell>
//                           <TableCell>
//                             <Badge
//                               className={
//                                 item.accuracy >= 80
//                                   ? 'text-white border-0'
//                                   : 'bg-yellow-500 text-white border-0'
//                               }
//                               style={{
//                                 backgroundColor:
//                                   item.accuracy >= 80 ? '#10b981' : undefined,
//                               }}
//                             >
//                               {item.accuracy >= 80
//                                 ? 'Sangat Baik'
//                                 : 'Perlu Ditingkatkan'}
//                             </Badge>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </div>
//             </TabsContent>
//           ),
//         )}
//       </Tabs>
//     </CardContent>
//   </Card>
// );

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

// =====================================================================
// KOMPOEN LEARNING PROGRESS CARD (Gabungan Study Habits + Semua Sub-Komponen)
// =====================================================================
export const LearningActivityCard: React.FC<{
  data: LearningDataType;
  mainColor: string;
  secondaryColor: string;
}> = ({ data, mainColor }) => {
  const activities = [
    {
      icon: FileText,
      value: data.documentsRead,
      label: 'Dokumen',
      increase: data.documentsReadIncrease,
      color: '#3B82F6',
      lightColor: '#DBEAFE',
    },
    {
      icon: PenTool,
      value: data.notesCreated,
      label: 'Catatan',
      increase: data.notesCreatedIncrease,
      color: '#8B5CF6',
      lightColor: '#EDE9FE',
    },
    {
      icon: Highlighter,
      value: data.highlightsMade,
      label: 'Highlight',
      increase: data.highlightsMadeIncrease,
      color: '#EC4899',
      lightColor: '#FCE7F3',
    },
    {
      icon: Brain,
      value: data.quizStudied,
      label: 'Quiz',
      increase: data.quizStudiedIncrease,
      color: '#F59E0B',
      lightColor: '#FFFBEB',
    },
  ];

  return (
    <Card className="bg-white shadow-lg border-0 rounded-3xl overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <ActivityIcon
            className="w-5 h-5"
            style={{ color: mainColor }}
          />
          Aktivitas Belajar
        </CardTitle>
        <CardDescription>Statistik kegiatan belajar kamu</CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {activities.map((activity, idx) => {
            const Icon = activity.icon;
            // Calculate progress percentage (max 100 items, normalized)
            const maxValue = 100;
            const progressPercent = Math.min(
              (activity.value / maxValue) * 100,
              100,
            );
            const circumference = 2 * Math.PI * 45; // radius 45
            const offset =
              circumference - (progressPercent / 100) * circumference;

            return (
              <div
                key={idx}
                className="flex flex-col items-center p-4 rounded-3xl transition-all hover:shadow-md"
                style={{ backgroundColor: activity.lightColor }}
              >
                {/* Circular Progress */}
                <div className="relative w-24 h-24 mb-3">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="3"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={activity.color}
                      strokeWidth="3"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                  </svg>
                  {/* Center value */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Icon
                      size={20}
                      style={{ color: activity.color }}
                      className="mb-1"
                    />
                    <span
                      className="text-sm font-bold"
                      style={{ color: activity.color }}
                    >
                      {activity.value}
                    </span>
                  </div>
                </div>

                {/* Label */}
                <p className="text-sm font-semibold text-gray-700 text-center">
                  {activity.label}
                </p>

                {/* Change indicator */}
                <div
                  className={`text-xs font-medium mt-1 ${
                    activity.increase >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {activity.increase >= 0 ? '↑' : '↓'}{' '}
                  {Math.abs(activity.increase)}%
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div
          className="mt-6 p-4 rounded-3xl border-2"
          style={{
            borderColor: `${mainColor}30`,
            backgroundColor: `${mainColor}05`,
          }}
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700 font-medium">
              Total Aktivitas Minggu Ini
            </span>
            <span
              className="text-lg font-bold"
              style={{ color: mainColor }}
            >
              {data.documentsRead +
                data.notesCreated +
                data.highlightsMade +
                data.quizStudied}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const LearningConsistencyCard: React.FC<{ data: LearningDataType }> = ({
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
            className={`aspect-square w-full rounded-3xl ${
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

export const RecentDocumentsCard: React.FC<{ data: LearningDataType }> = ({
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

export const MostActiveCard: React.FC<{ data: LearningDataType }> = ({
  data,
}) => (
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
          height={300}
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
}> = ({ studyHabits, mainColor, secondaryColor }) => {
  const milestones = [
    {
      label: 'Mulai',
      value: 0,
      icon: Clock,
      color: 'text-gray-400',
    },
    {
      label: '10 Jam',
      value: 10,
      icon: Award,
      color: 'text-blue-500',
      achieved: studyHabits.totalHoursStudied >= 10,
    },
    {
      label: '30 Jam',
      value: 30,
      icon: Trophy,
      color: 'text-yellow-500',
      achieved: studyHabits.totalHoursStudied >= 30,
    },
    {
      label: studyHabits.totalHoursStudied?.toFixed(0) + ' Jam',
      value: studyHabits.totalHoursStudied,
      icon: Zap,
      color: 'text-orange-500',
      achieved: true,
    },
  ];

  const progress = Math.min((studyHabits.totalHoursStudied / 50) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Timeline Progress */}
      <Card className="bg-white shadow-lg border-0 rounded-3xl overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <LibraryBigIcon
              className="w-5 h-5"
              style={{ color: mainColor }}
            />
            Kebiasaan Belajar
          </CardTitle>
          <CardDescription>Progres perjalanan belajar kamu</CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">
                Total Jam Belajar
              </span>
              <span
                className="text-sm font-bold"
                style={{ color: mainColor }}
              >
                {studyHabits.totalHoursStudied?.toFixed(1)} / 50 jam
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-500 rounded-full"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
                }}
              />
            </div>
          </div>

          {/* Milestone Timeline */}
          <div className="flex justify-between items-start">
            {milestones.map((milestone, idx) => {
              const Icon = milestone.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center flex-1"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                      milestone.achieved ? 'shadow-lg' : 'bg-gray-200'
                    }`}
                    style={{
                      backgroundColor: milestone.achieved
                        ? `${mainColor}20`
                        : undefined,
                    }}
                  >
                    <Icon
                      size={18}
                      className={
                        milestone.achieved ? milestone.color : 'text-gray-400'
                      }
                    />
                  </div>
                  <span className="text-xs font-semibold text-center text-gray-700">
                    {milestone.label}
                  </span>
                  {milestone.achieved && (
                    <span className="text-xs text-green-600 mt-1">✓</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className="p-3 rounded-3xl"
              style={{ backgroundColor: `${mainColor}10` }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Flame
                  size={16}
                  style={{ color: mainColor }}
                />
                <span className="text-xs text-gray-600">Streak</span>
              </div>
              <div
                className="text-xl font-bold"
                style={{ color: mainColor }}
              >
                {studyHabits.longestStreak} hari
              </div>
            </div>
            <div
              className="p-3 rounded-3xl"
              style={{ backgroundColor: `${secondaryColor}10` }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Clock
                  size={16}
                  style={{ color: secondaryColor }}
                />
                <span className="text-xs text-gray-600">Rata-rata</span>
              </div>
              <div
                className="text-xl font-bold"
                style={{ color: secondaryColor }}
              >
                {studyHabits.averageDailyStudyTime?.toFixed(1)} jam
              </div>
            </div>
            <div
              className="p-3 rounded-3xl col-span-2"
              style={{ backgroundColor: `${mainColor}08` }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Calendar
                  size={16}
                  style={{ color: mainColor }}
                />
                <span className="text-xs text-gray-600">Minggu ini</span>
              </div>
              <div className="flex justify-between items-end">
                <div
                  className="text-2xl font-bold"
                  style={{ color: mainColor }}
                >
                  {studyHabits.hoursThisWeek} jam
                </div>
                <Badge
                  className="text-white border-0"
                  style={{ backgroundColor: mainColor }}
                >
                  Hari terbaik: {studyHabits.mostProductiveDay}
                </Badge>
              </div>
            </div>
          </div>

          {/* Effective Time */}
          <div
            className="p-4 rounded-3xl border-2"
            style={{
              borderColor: `${mainColor}30`,
              backgroundColor: `${mainColor}05`,
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Waktu Belajar Paling Efektif
              </span>
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
    </div>
  );
};

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
    return `https://calendar.google.com/calendar/embed?src=bimbelio.marketing%40gmail.com&wkst=2&bgcolor=%23ffffff&ctz=Asia%2FJakarta&hl=id&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=0&showCalendars=0&showTz=1&mode=${mode}${
      view === 'agenda' ? `&dates=${today}%2F${today}` : ''
    }`;
  }, []);

  return (
    <Card className="bg-white shadow-lg border-0 rounded-3xl overflow-hidden">
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
              className="w-10 h-10 rounded-3xl flex items-center justify-center shadow-sm"
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
          <TabsList
            className="grid w-full grid-cols-3 mb-6 md:mb-8 rounded-3xl p-1 h-11 md:h-12 border-0"
            style={{ backgroundColor: `${mainColor}08` }}
          >
            {calendarViews.map(({ value, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="rounded-3xl font-semibold transition-all duration-200 text-gray-700 data-[state=active]:text-white data-[state=active]:shadow-md"
                style={{
                  backgroundColor: 'transparent',
                }}
              >
                <span className="font-medium text-xs md:text-sm">{label}</span>
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
                className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] border-0 rounded-3xl"
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
