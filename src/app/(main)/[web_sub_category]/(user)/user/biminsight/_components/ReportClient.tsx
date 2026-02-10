'use client';

import React, { useEffect, useState } from 'react';

// UI Components
import { Badge } from '@/components/ui/badge';
import { LoadingRetro } from '@/components/ui/loading-retro';
import { PageShell, SectionHeader, StatCard, StatCardGrid, StatCardGridItem, HeroSummaryCard } from '@/components/ds';

// Provider & Hooks
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';

// Icons
import {
  ActivityIcon,
  Award,
  Brain,
  CalendarRangeIcon,
  Clock,
  Home,
  LineChart as LineChartIcon,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from 'lucide-react';

// Decomposed sub-components
import { CalendarComponent } from './calendar-component';
import { LearningActivityCard } from './learning-activity-card';
import { QuizHistoryCard } from './quiz-history-card';
import type { LearningDataType, ReportDataType } from './report-types';
import { ScoreDevelopmentCard } from './score-development-card';
import { StudyHabitsCard } from './study-habits-card';
import { TryoutHistoryCard } from './tryout-history-card';
import { WeeklyProgressCard } from './weekly-progress-card';

// =====================================================================
// KOMPONEN UTAMA DASHBOARD
// =====================================================================

export default function ReportClient() {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();

  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

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
    <PageShell className="py-8">
      {/* Modern Header Section - Card Style */}
      <div className="mb-12 grid gap-6 grid-cols-1 md:grid-cols-3">
        {/* Welcome Card */}
        <HeroSummaryCard
          accentBar={false}
          className="md:col-span-2 p-8"
          titleStyle={{ color: mainColor }}
          badge={
            <p className="text-gray-600 text-sm font-medium">
              Selamat Datang Kembali,
            </p>
          }
          title={session?.user?.name || 'User'}
          subtitle="Pantau kemajuan belajarmu dengan data real-time dan tingkatkan persiapan ujianmu"
          trailing={
            <div
              className="w-16 h-16 rounded-3xl flex items-center justify-center text-white"
              style={{ backgroundColor: mainColor }}
            >
              <Home className="w-8 h-8" />
            </div>
          }
        >
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
        </HeroSummaryCard>

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
        <StatCardGrid cols={4}>
          <StatCardGridItem>
            <StatCard
              icon={Clock}
              color="blue"
              value={reportData?.studyHabits?.totalHoursStudied?.toFixed(0) || '0'}
              label="Jam Belajar"
            />
          </StatCardGridItem>
          <StatCardGridItem>
            <StatCard
              icon={Award}
              color="emerald"
              value={reportData?.learningReport?.totalScore || '0'}
              label="Nilai Total"
            />
          </StatCardGridItem>
          <StatCardGridItem>
            <StatCard
              icon={Target}
              color="orange"
              value={reportData?.tryoutHistory?.history.length || '0'}
              label="Try Out Selesai"
            />
          </StatCardGridItem>
          <StatCardGridItem>
            <StatCard
              icon={Brain}
              color="pink"
              value={reportData?.studyHabits?.longestStreak || '0'}
              label="Streak Terpanjang"
            />
          </StatCardGridItem>
        </StatCardGrid>
      </section>

      {/* Study Habits & Learning Activity */}
      <section className="mb-12 grid gap-6 grid-cols-1">
        <div>
          <SectionHeader icon={Clock} iconColor="blue" title="Kebiasaan Belajar" size="lg" className="mb-4" />
          <StudyHabitsCard
            studyHabits={reportData?.studyHabits}
            mainColor={mainColor}
            secondaryColor={secondaryColor}
          />
        </div>
        <div>
          <SectionHeader icon={ActivityIcon} iconColor="blue" title="Aktivitas Belajar" size="lg" className="mb-4" />
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
          <SectionHeader icon={LineChartIcon} iconColor="purple" title="Progres Mingguan" size="lg" className="mb-4" />
          <WeeklyProgressCard
            data={learningData as LearningDataType}
            mainColor={mainColor}
            secondaryColor={secondaryColor}
          />
        </div>
        <div>
          <SectionHeader icon={TrendingUp} iconColor="emerald" title="Perkembangan Nilai" size="lg" className="mb-4" />
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
          <SectionHeader icon={Target} iconColor="orange" title="Try Out" size="lg" className="mb-4" />
          <TryoutHistoryCard
            tryoutHistory={reportData?.tryoutHistory}
            tryoutCategory={reportData?.tryoutCategory}
            mainColor={mainColor}
            secondaryColor={secondaryColor}
          />
        </div>
        <div>
          <SectionHeader icon={Brain} iconColor="purple" title="Quiz" size="lg" className="mb-4" />
          <QuizHistoryCard
            quizHistory={reportData?.quizHistory}
            mainColor={mainColor}
            secondaryColor={secondaryColor}
          />
        </div>
      </section>

      {/* Calendar Section */}
      <section className="mb-12">
        <SectionHeader icon={CalendarRangeIcon} iconColor="blue" title="Kalender & Jadwal" size="lg" className="mb-4" />
        <CalendarComponent
          mainColor={mainColor}
          secondaryColor={secondaryColor}
        />
      </section>
    </PageShell>
  );
}
