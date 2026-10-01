'use client';

import { ConfirmProvider } from '@/components/patterns/confirm-dialog';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { createQueryClient } from '@/lib/api/query-client';
import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

/** Provider yang berlaku di seluruh aplikasi (dipasang sekali di root layout). */
export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={200}>
        <ConfirmProvider>{children}</ConfirmProvider>
      </TooltipProvider>
      <Toaster />
    </QueryClientProvider>
  );
}
