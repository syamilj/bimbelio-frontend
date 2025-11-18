// src/app/(guest)/layout.tsx (SERVER layout)
'use client';

import { ReactNode } from 'react';
import LayoutGuest from '@/components/layout/layoutGuest';

export default function GuestLayout({ children }: { children: ReactNode }) {
  // For all other guest routes, use LayoutGuest with navbar/footer
  return <LayoutGuest>{children}</LayoutGuest>;
}
