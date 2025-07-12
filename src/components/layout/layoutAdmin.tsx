'use client';

import { useAppContext } from '@/components/provider/provider-app';
import CheckSubscription from '@/components/provider/provider-check-subscription';
import { cn } from '@/lib/utils';
import { useParams, usePathname } from 'next/navigation';
import { ReactNode, Suspense, useEffect, useState } from 'react';
import Navbar from '../../app/[web_sub_category]/(admin)/admin/_components/navbar';
import Sidebar from '../../app/[web_sub_category]/(admin)/admin/_components/sidebar';

interface LayoutAdminProps {
  children: ReactNode;
}

export default function LayoutAdmin({ children }: LayoutAdminProps) {
  const params = useParams();
  const pathname = usePathname();
  const { minimizeSidebar, setMinimizeSidebar } = useAppContext();

  const [hideLayout, setHideLayout] = useState<boolean>(false);

  useEffect(() => {
    if (pathname?.includes('try-out') && params && params.id) {
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
        <div className="h-full min-h-screen bg-gray-50">
          {/* Enhanced Navbar */}
          <div
            className={cn(
              'fixed inset-x-0 top-0 z-40 h-16 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm transition-all duration-300',
              !minimizeSidebar ? 'md:pl-72' : 'md:pl-20',
            )}
          >
            <Navbar />
          </div>

          {/* Enhanced Sidebar */}
          <div
            className={cn(
              'fixed inset-y-0 left-0 z-50 transition-all duration-300',
              !minimizeSidebar ? 'w-72' : 'w-20',
            )}
            onMouseEnter={() => setMinimizeSidebar(false)}
            onMouseLeave={() => setMinimizeSidebar(true)}
          >
            <Sidebar />
          </div>

          {/* Main Content */}
          <main
            className={cn(
              'py-[6rem] min-h-screen transition-all duration-300',
              !minimizeSidebar ? 'md:pl-[21rem]' : 'md:pl-[8rem]',
              'pr-[3rem]',
            )}
          >
            {children}
          </main>
        </div>
      </CheckSubscription>
    </Suspense>
  );
}
