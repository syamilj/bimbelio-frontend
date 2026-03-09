'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
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
    <div className="min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <Tabs defaultValue="overview" className="w-full">
          {/* ── Tab navigation ─────────────────────────────────── */}
          <div className="sticky top-0 z-30 py-3 bg-white/90 backdrop-blur-md">
            <div className="overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              <TabsList
                className="inline-flex w-fit min-w-fit justify-start h-auto gap-1 p-1 rounded-[2rem]"
              >
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-[2rem] font-bold text-xs md:text-sm whitespace-nowrap flex-shrink-0"
                      style={
                        // Inject active styling directly via CSS var if they rely on mainColor
                        { '--tw-ring-color': mainColor } as React.CSSProperties
                      }
                    >
                    <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <span>{tab.label}</span>
                  </TabsTrigger>
                );
              })}
              </TabsList>
            </div>
          </div>

          {/* ── Tab panels ──────────────────────────────────────── */}
          <div className="mt-2 text-left">
            <TabsContent value="overview" className="space-y-4 m-0">
              <DashboardHero />
              <ScorePrediction />
            </TabsContent>

            <TabsContent value="mastery" className="m-0">
              <TopicMastery />
            </TabsContent>

            <TabsContent value="arena" className="space-y-4 m-0">
              <TryoutAnalyticsTable />
              <QuizAnalyticsTable />
            </TabsContent>

            <TabsContent value="course" className="m-0">
              <CourseAnalytics />
            </TabsContent>

            <TabsContent value="live" className="m-0">
              <LiveClassAnalytics />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
