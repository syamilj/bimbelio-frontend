'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

/**
 * BimbotController - Conditionally renders BimBot based on current route
 * BimBot should NOT appear on:
 * - Try-out execution pages
 * - Quiz execution pages
 */
export function BimbotController({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Hide BimBot on tryout/quiz execution pages
  const shouldHideBimbot =
    pathname?.includes('/try-out/') ||
    pathname?.includes('/testing/') ||
    (pathname?.includes('/quiz/') && pathname?.split('/').length > 6); // quiz detail pages

  if (shouldHideBimbot) {
    return null;
  }

  return <>{children}</>;
}
