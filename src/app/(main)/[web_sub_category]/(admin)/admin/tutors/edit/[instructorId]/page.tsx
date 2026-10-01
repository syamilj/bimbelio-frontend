'use client';

import { useParams } from 'next/navigation';
import { TutorForm } from '../../_components/tutor-form';

export default function EditTutorPage() {
  const { instructorId } = useParams<{ instructorId: string }>();
  return <TutorForm instructorId={instructorId} />;
}
