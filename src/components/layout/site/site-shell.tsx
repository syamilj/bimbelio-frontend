'use client';

import { SectionLoader } from '@/components/patterns/page-loader';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import { ContactProvider, FloatingContactButton } from './contact';
import { SiteHeader } from './site-header';

const OneTapLogin = dynamic(
  () =>
    import('@/components/_shared/auth/one-tap-login').then(
      (mod) => mod.OneTapLogin,
    ),
  { ssr: false },
);

// Halaman tautan pendek (mis. /l/wa-grup) tampil tanpa header.
const isBareRoute = (pathname: string) => pathname.startsWith('/l/');

/** Kerangka halaman publik: header, konten, footer, dan tombol konsultasi. */
export function SiteShell({
  children,
  footer,
}: {
  children: React.ReactNode;
  /** SiteFooter (server component) diteruskan dari layout. */
  footer: React.ReactNode;
}) {
  const pathname = usePathname();
  const bare = isBareRoute(pathname);

  return (
    <ContactProvider>
      <OneTapLogin />
      <div className="flex min-h-dvh flex-col">
        {!bare && <SiteHeader />}
        <main
          id="konten"
          className="relative flex-1"
        >
          {/* Halaman yang membaca query string (useSearchParams) cukup menunda
              kontennya sendiri; header & footer tetap dirender di server. */}
          <Suspense fallback={<SectionLoader className="min-h-[60vh]" />}>
            {children}
          </Suspense>
        </main>
        {!bare && footer}
      </div>
      {!bare && <FloatingContactButton />}
    </ContactProvider>
  );
}
