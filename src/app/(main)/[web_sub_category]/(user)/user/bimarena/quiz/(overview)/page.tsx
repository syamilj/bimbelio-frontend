'use client';

import { PageShell, PillTabs } from '@/components/ds';
import { cn } from '@/lib/utils';
import { BarChart3, BookOpen, Trophy } from 'lucide-react';
import { useState } from 'react';

// Components
import QuizOnboarding from '../_components/onboarding/quiz-onboarding';
import { QuizCardList } from '../_components/quiz-card-list';
import { QuizLeaderboard } from '../_components/quiz-leaderboard';
import { QuizProgress } from '../_components/quiz-progress';
import { QuizStats } from '../_components/quiz-stats';
import { QuizSummary } from '../_components/quiz-summary';
import { QuizTopLeaderboard } from '../_components/quiz-top-leaderboard';
import { TargetUniversityBanner } from '../_components/target-university-banner';
import { QuizProvider, useQuizProvider } from '../_provider/_provider';

const quizTabs = [
  { id: 'library', label: 'Library', icon: BookOpen },
  { id: 'progress', label: 'Progress', icon: BarChart3 },
  { id: 'leaderboard', label: 'Peringkat', icon: Trophy },
] as const;

export function BimArenaQuizPageMain() {
  const {
    useVolume: { selectedVolumeId },
    useUserStatistic: { UserStatistic },
  } = useQuizProvider();
  const userTarget = UserStatistic?.userTarget;

  const [activeTab, setActiveTab] = useState('library');

  return (
    <PageShell noPadding>
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
              <PillTabs
                tabs={quizTabs as unknown as { id: string; label: string; icon: any }[]}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
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
    </PageShell>
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
