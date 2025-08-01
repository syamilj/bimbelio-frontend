import { LiveClassJoin } from '../../_components/live-class-join';

interface PageProps {
  params: Promise<{
    classId: string;
  }>;
}

export default async function LiveClassJoinPage({ params }: PageProps) {
  const { classId } = await params;
  return <LiveClassJoin classId={classId} />;
}
