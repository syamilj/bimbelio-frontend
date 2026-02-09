'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { SelectUser } from '../_components/select-user';
import LiveClassAnalyticsAdmin from '../_components/tab-live-class';
import QuizAnalyticsAdmin from '../_components/tab-quiz';
import TryoutAnalyticsAdmin from '../_components/tab-tryout';

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
