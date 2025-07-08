import { TutorDetail } from '../_components/tutor-detail';

interface TutorDetailPageProps {
  params: Promise<{
    tutorId: string;
  }>;
}

export default async function TutorDetailPage({
  params,
}: TutorDetailPageProps) {
  const { tutorId } = await params;
  return <TutorDetail tutorId={tutorId} />;
}
