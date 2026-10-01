'use client';

import { useRoutePathname } from '@/lib/track';
import dynamic from 'next/dynamic';
import { AppSidebar } from './app-sidebar';
import { AppTopbar } from './app-topbar';
import { MobileAppMenu, MobileTabBar } from './mobile-nav';
import { getShellMode } from './shell-mode';
import { SubscriptionChecks } from './subscription-checks';

// Chat BimBot (markdown, mermaid, katex) baru dimuat di browser setelah halaman siap.
const BimbotLauncher = dynamic(
  () =>
    import('@/app/(main)/[web_sub_category]/(user)/user/_components/dialog-bimbot-ai').then(
      (mod) => mod.DialogBimbotAI,
    ),
  { ssr: false },
);

/** Kerangka aplikasi siswa: sidebar, topbar, tab bar mobile, dan layanan latar. */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRoutePathname('app');
  const mode = getShellMode(pathname);

  // Ujian: tanpa navigasi dan tanpa sinkronisasi langganan (agar tidak mengganggu sesi).
  if (mode === 'bare') return <>{children}</>;

  if (mode === 'immersive') {
    return (
      <>
        {children}
        <MobileAppMenu />
        <SubscriptionChecks />
      </>
    );
  }

  return (
    <>
      <div className="flex min-h-dvh">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AppTopbar />
          <main
            id="konten"
            className="flex-1 px-4 pt-6 pb-24 sm:px-6 lg:px-8 lg:pt-8 lg:pb-12"
          >
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
      <MobileTabBar />
      <MobileAppMenu />
      <SubscriptionChecks />
      <BimbotLauncher />
    </>
  );
}
