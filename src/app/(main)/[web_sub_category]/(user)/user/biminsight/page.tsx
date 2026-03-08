'use client';

import { DashboardHero } from './_components/0-dashboard-hero';
import { CourseAnalytics } from './_components/1-course-analytics';
import { LiveClassAnalytics } from './_components/2-live-class-analytics';
import { TryoutAnalyticsTable } from './_components/3-tryout-analytics';
import { QuizAnalyticsTable } from './_components/4-quiz-analytics';
import { ScorePrediction } from './_components/5-score-prediction';
import { TopicMastery } from './_components/6-topic-mastery';

export default function BimInsight() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 py-8 space-y-10">
        <DashboardHero />
        <ScorePrediction />
        <TopicMastery />
        <TryoutAnalyticsTable />
        <QuizAnalyticsTable />
        <CourseAnalytics />
        <LiveClassAnalytics />
      </div>
    </div>
  );
}
