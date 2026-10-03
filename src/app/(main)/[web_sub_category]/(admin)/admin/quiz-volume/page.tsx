import { QuizVolumeListPage } from '@/features/admin-assessment/components/quiz-volume-list';
import { Suspense } from 'react';

export default function QuizVolumeListRoute() {
  return (
    <Suspense>
      <QuizVolumeListPage />
    </Suspense>
  );
}
