// src/app/(user)/layout.tsx (SERVER layout)
import { cn } from '@/lib/utils';
import { Metadata } from 'next';
import { ReactNode } from 'react';
import LayoutUserClient from '../../../components/layout/layoutUser'; // <--- Komponen client

export const metadata: Metadata = {
  title: 'Belajar',
  description: 'Siswa belajar di Bimbelio',
  openGraph: {
    title: 'Belajar',
    description: 'Siswa belajar di Bimbelio',
  },
};

export default function LayoutUser({ children }: { children: ReactNode }) {
  return (
    <div className={cn('min-h-screen bg-background font-sans antialiased')}>
      <LayoutUserClient>{children}</LayoutUserClient>
    </div>
  );
}
