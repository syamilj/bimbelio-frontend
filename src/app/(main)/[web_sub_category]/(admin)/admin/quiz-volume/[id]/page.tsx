import { QuizVolumeFormPage } from '@/features/admin-assessment/components/quiz-volume-form';

/** `/quiz-volume/new` = buat, `/quiz-volume/<id>` = ubah (satu route). */
export default async function QuizVolumeRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <QuizVolumeFormPage
      key={id}
      id={id}
    />
  );
}
