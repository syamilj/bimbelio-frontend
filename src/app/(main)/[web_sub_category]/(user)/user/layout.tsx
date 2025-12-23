// src/app/(user)/layout.tsx (SERVER layout)
import LayoutUserClient from '@/components/layout/layoutUser';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Metadata } from 'next';
import { ReactNode } from 'react';
import { DialogBimbotAI } from './_components/dialog-bimbot-ai';

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
      <TooltipProvider>
        <LayoutUserClient>{children}</LayoutUserClient>
        <DialogBimbotAI />
      </TooltipProvider>
    </div>
  );
}
