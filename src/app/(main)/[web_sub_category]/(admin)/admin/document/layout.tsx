// src/app/(admin)/admin/layout.tsx (SERVER layout, no 'use client')

import Provider from './provider';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Provider>{children}</Provider>;
}
