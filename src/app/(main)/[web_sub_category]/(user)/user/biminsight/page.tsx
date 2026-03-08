'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  GraduationCap,
  Layers3,
  Sparkles,
  Target,
  Video,
} from 'lucide-react';
import { DashboardHero } from './_components/0-dashboard-hero';
import { CourseAnalytics } from './_components/1-course-analytics';
import { LiveClassAnalytics } from './_components/2-live-class-analytics';
import { TryoutAnalyticsTable } from './_components/3-tryout-analytics';
import { QuizAnalyticsTable } from './_components/4-quiz-analytics';
import { ScorePrediction } from './_components/5-score-prediction';
import { TopicMastery } from './_components/6-topic-mastery';

const tabs = [
  { value: 'overview', label: 'Overview', icon: Sparkles },
  { value: 'mastery', label: 'BimMastery', icon: Layers3 },
  { value: 'arena', label: 'BimArena', icon: Target },
  { value: 'course', label: 'BimCourse', icon: GraduationCap },
  { value: 'live', label: 'BimLive', icon: Video },
] as const;

export default function BimInsight() {
  const { mainColor } = useWebsiteSubCategory();

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-7xl px-3 py-4 md:px-4 md:py-6">
        <Tabs defaultValue="overview" className="w-full">
          {/* ── Tab navigation ─────────────────────────────────── */}
          <div
            className="overflow-x-auto -mx-3 px-3 md:mx-0 md:px-0 mb-4"
            style={{ scrollbarWidth: 'none' }}
          >
            <TabsList className="inline-flex w-max md:w-full h-11 gap-1 rounded-3xl bg-slate-100/80 p-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="rounded-3xl px-3 py-2 text-xs font-bold text-slate-500 data-[state=active]:text-white data-[state=active]:shadow-sm gap-1.5 whitespace-nowrap"
                    style={
                      { '--tab-active-bg': mainColor } as React.CSSProperties
                    }
                    isActiveClassName="!bg-[var(--tab-active-bg)]"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* ── Tab panels ──────────────────────────────────────── */}
          <TabsContent value="overview" className="space-y-6 mt-0">
            <DashboardHero />
            <ScorePrediction />
          </TabsContent>

          <TabsContent value="mastery" className="mt-0">
            <TopicMastery />
          </TabsContent>

          <TabsContent value="arena" className="space-y-6 mt-0">
            <TryoutAnalyticsTable />
            <QuizAnalyticsTable />
          </TabsContent>

          <TabsContent value="course" className="mt-0">
            <CourseAnalytics />
          </TabsContent>

          <TabsContent value="live" className="mt-0">
            <LiveClassAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
