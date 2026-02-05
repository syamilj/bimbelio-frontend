'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import LiveClassAnalyticsAdmin from '../_components/1-live-class-analytics-admin';
import TryoutAnalyticsAdmin from '../_components/2-tryout-analytics-admin';
import QuizAnalyticsAdmin from '../_components/3-quiz-analytics-admin';
import { SelectUser } from '../_components/select-user';

export default function LearningAnalyticsAdmin() {
  const [tabValue, setTabValue] = useState<string>('tryout');

  return (
    <div className="mx-auto max-w-7xl">
      <div className="relative">
        <SelectUser />
      </div>
      <Tabs
        value={tabValue}
        onValueChange={setTabValue}
      >
        <TabsList>
          <TabsTrigger value="bimlive">BimLive</TabsTrigger>
          <TabsTrigger value="tryout">BimArena - Tryout</TabsTrigger>
          <TabsTrigger value="quiz">BimArena - Quiz</TabsTrigger>
        </TabsList>
        <TabsContent value="bimlive">
          <LiveClassAnalyticsAdmin />
        </TabsContent>
        <TabsContent value="tryout">
          <TryoutAnalyticsAdmin />
        </TabsContent>
        <TabsContent value="quiz">
          <QuizAnalyticsAdmin />
        </TabsContent>
      </Tabs>
    </div>
  );
}
