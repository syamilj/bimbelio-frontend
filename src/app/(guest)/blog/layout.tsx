// src/app/(user)/dashboard/page.tsx

import { METADATA_GUEST } from '@/config/metadata';
import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  ...METADATA_GUEST.blog,
};

export default function LayoutBlog({ children }: { children: ReactNode }) {
  // Di sini, tidak boleh ada state/effect
  // Hanya memanggil <DashboardClient/>:
  return <div>{children}</div>;
}
