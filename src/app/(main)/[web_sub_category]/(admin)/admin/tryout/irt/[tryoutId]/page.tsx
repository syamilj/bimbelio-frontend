import { IrtPage } from '@/features/admin-assessment/components/irt-page';

export default async function TryoutIrtRoute({
  params,
}: {
  params: Promise<{ tryoutId: string }>;
}) {
  const { tryoutId } = await params;
  return <IrtPage tryoutId={tryoutId} />;
}
