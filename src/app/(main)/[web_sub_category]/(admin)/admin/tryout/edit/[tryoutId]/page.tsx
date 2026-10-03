import { AssessmentEditor } from '@/features/admin/assessment-editor/components/assessment-editor';

export default async function EditTryoutRoute({
  params,
}: {
  params: Promise<{ tryoutId: string }>;
}) {
  const { tryoutId } = await params;
  return (
    <AssessmentEditor
      key={tryoutId}
      kind="tryout"
      id={tryoutId}
    />
  );
}
