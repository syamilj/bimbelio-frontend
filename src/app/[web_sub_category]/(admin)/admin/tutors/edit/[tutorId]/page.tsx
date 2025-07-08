import { EditTutorForm } from '../../_components/edit-tutor-form';

interface EditTutorPageProps {
  params: Promise<{
    tutorId: string;
  }>;
}

export default async function EditTutorPage({ params }: EditTutorPageProps) {
  const { tutorId } = await params;
  return <EditTutorForm tutorId={tutorId} />;
}
