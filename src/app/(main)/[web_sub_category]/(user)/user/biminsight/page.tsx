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
  ChevronRight,
} from 'lucide-react';
import { DashboardHero } from './_components/0-dashboard-hero';
import { CourseAnalytics } from './_components/1-course-analytics';
import { LiveClassAnalytics } from './_components/2-live-class-analytics';
import { TryoutAnalyticsTable } from './_components/3-tryout-analytics';
import { QuizAnalyticsTable } from './_components/4-quiz-analytics';
import { ScorePrediction } from './_components/5-score-prediction';
import { TopicMastery } from './_components/6-topic-mastery';
import { BimArena, BimCourse, BimLearn, BimLive, BimInsight as BimInsightBrand } from '@/components/ui/bim-brand';
import { useRef, useState, useEffect } from 'react';

const tabs = [
  { value: 'overview', label: <BimLearn />, icon: Sparkles },
  { value: 'mastery', label: <BimInsightBrand />, icon: Layers3 },
  { value: 'arena', label: <BimArena />, icon: Target },
  { value: 'course', label: <BimCourse />, icon: GraduationCap },
  { value: 'live', label: <BimLive />, icon: Video },
] as const;

export default function BimInsight() {
  const { mainColor } = useWebsiteSubCategory();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <Tabs defaultValue="overview" className="w-full">
          {/* ── Tab navigation ─────────────────────────────────── */}
          <div className="sticky top-0 z-30">
            <div className="relative">
              <div
                ref={scrollContainerRef}
                onScroll={checkScroll}
                className="overflow-x-auto flex pb-2"
                style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
              >
                <TabsList
                  className="inline-flex w-fit min-w-fit justify-start h-auto gap-2 p-1 rounded-full bg-slate-100"
                >
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap flex-shrink-0 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                        style={
                          { '--tw-ring-color': mainColor } as React.CSSProperties
                        }
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </div>

              {/* Right Scroll Indicator Gradient & Badge */}
              {canScrollRight && (
                <div className="absolute right-0 top-0 bottom-2 w-16 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none flex justify-end items-center pr-1">
                  <div className="bg-white text-slate-500 shadow-md border rounded-full p-1 animate-pulse">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              )}
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
