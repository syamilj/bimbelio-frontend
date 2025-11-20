'use client';

import { useParams } from 'next/navigation';
import LinkPageForm from '../../_components/LinkPageForm';

export default function EditLinkPagePage() {
  const params = useParams();
  const linkPageId = params.id as string;

  return <LinkPageForm mode="edit" linkPageId={linkPageId} />;
}
