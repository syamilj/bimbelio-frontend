import { AssessmentListPage } from '@/features/admin-assessment/components/assessment-list';
import { Suspense } from 'react';

export default function QuizListRoute() {
  return (
    <Suspense>
      <AssessmentListPage kind="quiz" />
    </Suspense>
  );
}
