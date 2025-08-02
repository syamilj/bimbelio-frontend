'use client';
import { pixel } from '@/lib/pixel/_core';
import { usePathname } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

export default function ProviderPixel({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    pixel.meta.init();
    pixel.tiktok.init();
  }, []);

  useEffect(() => {
    pixel.meta.track('PageView');
    pixel.tiktok.track('ViewContent', { page_path: pathname });
  }, [pathname]);

  return <>{children}</>;
}
