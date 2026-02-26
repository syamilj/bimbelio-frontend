'use client';

import Navbar from '@/app/(main)/[web_sub_category]/(admin)/admin/_components/navbar';
import Sidebar from '@/app/(main)/[web_sub_category]/(admin)/admin/_components/sidebar';
import { useAppContext } from '@/components/provider/provider-app';
import CheckSubscription from '@/components/provider/provider-check-subscription';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useParams, usePathname } from 'next/navigation';
import { ReactNode, Suspense, useEffect, useState } from 'react';

interface LayoutAdminProps {
  children: ReactNode;
}

export default function LayoutAdmin({ children }: LayoutAdminProps) {
  const params = useParams();
  const pathname = usePathname();
  const {
    minimizeSidebar,
    setMinimizeSidebar,
    sidebarMobile,
    setSidebarMobile,
  } = useAppContext();

  const [hideLayout, setHideLayout] = useState<boolean>(false);

  useEffect(() => {
    if (
      (pathname?.includes('try-out') && params && params.id) ||
      pathname?.includes('/admin/tryout/edit/') ||
      pathname?.includes('/admin/tryout/new')
    ) {
      setHideLayout(true);
    } else {
      setHideLayout(false);
    }
  }, [params, pathname]);

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <Suspense>
      <CheckSubscription>
        <SidebarProvider
          open={!minimizeSidebar}
          onOpenChange={(open) => setMinimizeSidebar(!open)}
        >
          <Sidebar
            isMobileSidebarOpen={sidebarMobile}
            setIsMobileSidebarOpen={setSidebarMobile}
          />
          <SidebarInset>
            {/* Fixed Navbar */}
            <Navbar />

            {/* Main Content */}
            <main className="pt-[72px] md:pt-[100px] py-6 pl-12 pr-6 ">
              <div className="mx-auto max-w-screen-2xl">{children}</div>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </CheckSubscription>
    </Suspense>
  );
}
