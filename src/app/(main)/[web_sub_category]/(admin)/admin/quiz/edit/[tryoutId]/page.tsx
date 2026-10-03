import { AssessmentEditor } from '@/features/admin/assessment-editor/components/assessment-editor';

export default async function EditQuizRoute({
  params,
}: {
  params: Promise<{ tryoutId: string }>;
}) {
  const { tryoutId } = await params;
  return (
    <AssessmentEditor
      key={tryoutId}
      kind="quiz"
      id={tryoutId}
    />
  );
}
