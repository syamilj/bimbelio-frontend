'use client';

import { useParams } from 'next/navigation';
import { LiveClassForm } from '../../_components/live-class-form';

export default function EditLiveClassPage() {
  const { classId } = useParams<{ classId: string }>();
  return <LiveClassForm classId={classId} />;
}
