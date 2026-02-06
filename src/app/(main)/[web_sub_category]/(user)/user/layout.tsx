// src/app/(user)/layout.tsx (SERVER layout)
import LayoutUserClient from '@/components/layout/layoutUser';
import ProviderOnBoarding from '@/components/provider/provider-on-boarding';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Metadata } from 'next';
import { ReactNode } from 'react';
import { BimbotController } from './_components/bimbot-controller';
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
      <ProviderOnBoarding>
        <TooltipProvider>
          <LayoutUserClient>{children}</LayoutUserClient>
          <BimbotController>
            <DialogBimbotAI />
          </BimbotController>
        </TooltipProvider>
      </ProviderOnBoarding>
    </div>
  );
}
