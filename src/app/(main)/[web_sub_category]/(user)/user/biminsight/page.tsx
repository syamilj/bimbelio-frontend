'use client';

import { UserDataOverview } from './_components/1-user-data-overview';
import { LiveClassAnalytics } from './_components/2-live-class-analytics';
import { TryoutAnalyticsTable } from './_components/3-tryout-analytics';
import { QuizAnalyticsTable } from './_components/4-quiz-analytics';
import { CalenderView } from './_components/5-calender-view';

export default function BimInsight() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <section className="mb-12">
          <UserDataOverview />
        </section>

        <section className="mb-12">
          <LiveClassAnalytics />
        </section>

        <section className="mb-12">
          <TryoutAnalyticsTable />
        </section>

        <section className="mb-12">
          <QuizAnalyticsTable />
        </section>

        <section className="mb-12">
          <CalenderView />
        </section>
      </div>
    </div>
  );
}
