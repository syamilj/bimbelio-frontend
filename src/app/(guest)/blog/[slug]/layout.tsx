'use client';

import { ReactNode } from 'react';

// 0) ISR config
// const revalidate = 259200; // 3 hari

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
