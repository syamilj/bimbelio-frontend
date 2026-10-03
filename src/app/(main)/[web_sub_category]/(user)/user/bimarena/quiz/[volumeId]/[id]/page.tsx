'use client';

import { ExamPage } from '@/features/exam/components/exam-page';
import { use } from 'react';

/** Quiz BimArena memakai mesin ujian yang sama dengan try out. */
export default function QuizExamPage({
  params,
}: {
  params: Promise<{ volumeId: string; id: string }>;
}) {
  const { volumeId, id } = use(params);
  return (
    <ExamPage
      tryoutId={id}
      mode="quiz"
      volumeId={volumeId}
    />
  );
}
