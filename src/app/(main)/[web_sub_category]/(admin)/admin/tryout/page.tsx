import { AssessmentListPage } from '@/features/admin-assessment/components/assessment-list';
import { Suspense } from 'react';

export default function TryoutListRoute() {
  return (
    <Suspense>
      <AssessmentListPage kind="tryout" />
    </Suspense>
  );
}
