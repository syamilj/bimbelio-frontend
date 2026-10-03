'use client';

import { ExamPage } from '@/features/exam/components/exam-page';
import { usePathname } from 'next/navigation';
import { use } from 'react';

export interface TryoutPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Ruang ujian try out BimArena. Juga dipakai halaman uji admin
 * (`/admin/tryout/testing/try-out/[id]`) — mode uji dikenali dari URL.
 */
export default function TryoutPage({ params }: TryoutPageProps) {
  const { id } = use(params);
  const pathname = usePathname();
  return (
    <ExamPage
      tryoutId={id}
      mode="try-out"
      testing={pathname.toLowerCase().includes('/testing/')}
    />
  );
}
