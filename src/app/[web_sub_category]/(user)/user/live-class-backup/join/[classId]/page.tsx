import { LiveClassJoin } from '../../_components/live-class-join';

interface PageProps {
  params: {
    classId: string;
  };
}

export default function LiveClassJoinPage({ params }: PageProps) {
  return <LiveClassJoin classId={params.classId} />;
}
