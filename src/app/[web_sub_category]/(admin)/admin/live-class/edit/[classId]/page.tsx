import { Metadata } from 'next';
import { EditLiveClassForm } from '../../_components/edit-live-class-form';

export const metadata: Metadata = {
  title: 'Edit Live Class - Admin Dashboard',
  description: 'Edit live class yang sudah ada',
};

interface EditLiveClassPageProps {
  params: Promise<{
    classId: string;
  }>;
}

export default async function EditLiveClassPage({
  params,
}: EditLiveClassPageProps) {
  const { classId } = await params;
  return <EditLiveClassForm classId={classId} />;
}
