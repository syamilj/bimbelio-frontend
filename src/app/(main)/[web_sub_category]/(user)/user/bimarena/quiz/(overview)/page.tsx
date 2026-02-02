'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { BarChart3, BookOpen, Trophy } from 'lucide-react';
import { useState } from 'react';

// Components
import { QuizCardList } from '../_components/quiz-card-list';
import { QuizLeaderboard } from '../_components/quiz-leaderboard';
import { QuizProgress } from '../_components/quiz-progress';
import { QuizStats } from '../_components/quiz-stats';
import { QuizSummary } from '../_components/quiz-summary';
import { QuizTopLeaderboard } from '../_components/quiz-top-leaderboard';
import { TargetUniversityBanner } from '../_components/target-university-banner';
import QuizOnboarding from '../_components/onboarding/quiz-onboarding';
import { QuizProvider, useQuizProvider } from '../_provider/_provider';

export function BimArenaQuizPageMain() {
  const { websiteSubCategory } = useWebsiteSubCategory();

  const {
    useVolume: { selectedVolumeId },
    useUserStatistic: { UserStatistic },
  } = useQuizProvider();
  const userTarget = UserStatistic?.userTarget;
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  const [activeTab, setActiveTab] = useState('library');

  const tabItems = [
    { id: 'library', label: 'Library', icon: BookOpen },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'leaderboard', label: 'Peringkat', icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      {/* Hero Section */}
      <div className="p-4 md:p-6">
        <QuizSummary />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-6">
        {/* Target University Banner */}
        {userTarget && <TargetUniversityBanner userTarget={userTarget} />}

        {/* Top Leaderboard */}
        <QuizTopLeaderboard />

        {selectedVolumeId && <QuizStats />}

        {/* Tab Card: pills + content in one card */}
        {selectedVolumeId && (
          <div className="bg-white rounded-3xl border-2 border-slate-100 shadow-sm overflow-hidden">
            {/* Tab Pills */}
            <div className="p-2 md:p-3 border-b border-slate-100">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList
                  className="inline-flex h-auto gap-1 md:gap-1.5 bg-slate-100/80 p-1 rounded-full overflow-x-auto"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {tabItems.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className={cn(
                          'flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 rounded-full font-bold text-xs md:text-sm transition-all whitespace-nowrap flex-shrink-0',
                          isActive
                            ? 'text-white shadow-md'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-white/50',
                        )}
                        style={
                          isActive
                            ? { backgroundColor: mainColor }
                            : {}
                        }
                      >
                        <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        <span>{tab.label}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </Tabs>
            </div>

            {/* Tab Content - Keep all mounted, hide with CSS */}
            <div className="relative">
              <div className={cn(activeTab !== 'library' && 'hidden')}>
                <QuizCardList />
              </div>
              <div className={cn(activeTab !== 'progress' && 'hidden')}>
                <QuizProgress />
              </div>
              <div className={cn(activeTab !== 'leaderboard' && 'hidden')}>
                <QuizLeaderboard />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BimArenaQuizPage() {
  return (
    <QuizProvider>
      <QuizOnboarding />
      <BimArenaQuizPageMain />
    </QuizProvider>
  );
}
