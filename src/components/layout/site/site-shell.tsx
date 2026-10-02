'use client';

import dynamic from 'next/dynamic';
import { ContactProvider, FloatingContactButton } from './contact';
import { SiteHeader } from './site-header';

const OneTapLogin = dynamic(
  () =>
    import('@/components/_shared/auth/one-tap-login').then(
      (mod) => mod.OneTapLogin,
    ),
  { ssr: false },
);

/** Kerangka halaman publik: header, konten, footer, dan tombol konsultasi. */
export function SiteShell({
  children,
  footer,
}: {
  children: React.ReactNode;
  /** SiteFooter (server component) diteruskan dari layout. */
  footer: React.ReactNode;
}) {
  return (
    <ContactProvider>
      <OneTapLogin />
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main
          id="konten"
          className="relative flex-1"
        >
          {/* Sengaja tanpa <Suspense> di sini: notFound()/redirect() halaman harus
              terjadi sebelum streaming agar status HTTP (404/308) benar. Komponen
              yang membaca query string membungkus dirinya sendiri dengan Suspense. */}
          {children}
        </main>
        {footer}
      </div>
      <FloatingContactButton />
    </ContactProvider>
  );
}
