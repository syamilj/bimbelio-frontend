'use client';

import { useParams } from 'next/navigation';
import { ShortUrlForm } from '../../_components/short-url-form';

export default function EditShortUrlPage() {
  const { id } = useParams<{ id: string }>();
  return <ShortUrlForm shortUrlId={id} />;
}
