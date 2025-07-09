import { LiveClassStudentDetail } from '../_components/live-class-student-detail';

interface PageProps {
  params: {
    classId: string;
  };
}

export default function LiveClassDetailPage({ params }: PageProps) {
  return <LiveClassStudentDetail classId={params.classId} />;
}
