'use client';

import { LoadingRetro } from '@/components/ui/loading-retro';
import { PageShell } from '@/components/ds';

// Bim Components
import BimAchievementBadges from './new/AchievementBadges';
import BimLearningProgress from './new/BimLearningProgress';
import BimPerformanceChart from './new/BimPerformanceChart';
import BimQuickAccessMenu from './new/BimQuickAccessMenu';
import BimQuickStatsOverview from './new/BimQuickStatsOverview';
import BimRecentActivity from './new/RecentActivity';
import BimRecommendedContent from './new/RecommendedContent';
import BimUpcomingSchedule from './new/UpcomingSchedule';
import { useDashboardData } from './new/useDashboardData';

// Re-export for consumers
export type { DashboardData } from './new/dashboard-types';

export default function DashboardClientNew() {
  const { data, loading, refetch } = useDashboardData();

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <LoadingRetro />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-slate-500">Gagal memuat data dashboard</p>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-blue-500 text-white rounded-3xl hover:bg-blue-600 transition-colors"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  return (
    <PageShell className="pb-6">
      <div className="flex flex-col gap-4 lg:gap-6 min-w-0">
        {/* Quick Access Menu */}
        <BimQuickAccessMenu />

        {/* Stats Overview Grid */}
        <BimQuickStatsOverview stats={data.stats} />

        {/* Main Content - 2 Columns on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 flex flex-col gap-4 lg:gap-6">
            <BimLearningProgress
              courses={data.learningProgress.courses}
              tryouts={data.learningProgress.tryouts}
              liveClasses={data.upcomingSchedule.liveClasses}
            />

            <BimPerformanceChart
              scoreHistory={data.performanceData.scoreHistory}
              studyTimeHistory={data.performanceData.studyTimeHistory}
            />

            <BimRecommendedContent
              courses={data.recommendations.courses}
              tryouts={data.recommendations.tryouts}
              documents={data.recommendations.documents}
            />
          </div>

          {/* Right Column - 1/3 width */}
          <div className="flex flex-col gap-4 lg:gap-6">
            <BimAchievementBadges achievements={data.achievements} />

            <BimUpcomingSchedule
              tryouts={data.upcomingSchedule.tryouts}
              liveClasses={data.upcomingSchedule.liveClasses}
            />

            <BimRecentActivity activities={data.recentActivity} />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
