'use client';

import { useParams, usePathname } from 'next/navigation';
import { ReactNode, Suspense, useEffect, useState } from 'react';
import useMedia from 'use-media';

import Sidebar from '@/app/(main)/[web_sub_category]/(user)/user/_components/sidebar';
import { useAppContext } from '@/components/provider/provider-app';
import SidebarUser from '@/app/(main)/[web_sub_category]/(user)/user/_components/sidebar';
import ProviderCheckSubscription from '@/components/provider/provider-check-subscription';
import ProviderCheckLimitation from '@/components/provider/provider-check-limitation';
import ProviderCheckSubscriptionInstallment from '@/components/provider/provider-check-subscription-installment';
import ProviderCheckSubscriptionPending from '@/components/provider/provider-check-subscription-pending';
import { cn } from '@/lib/utils';
import axiosInstance from '@/lib/axios/axiosInstance';
import { response } from '@/lib/response';
import { website_sub_category_id_params } from '@/hooks/use-web-sub-category-id';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { HeaderUser } from './HeaderUser';
import type { CategoryType, LayoutUserClientProps } from './layout-user-types';

export default function LayoutUserClient({ children }: LayoutUserClientProps) {
  const pathname = usePathname();
  const params = useParams();

  const [category, setCategory] = useState<CategoryType[]>([]);

  useEffect(() => {
    if (website_sub_category_id_params) {
      axiosInstance
        .get('/category/getAllCategories', {
          params: { website_sub_category_id: website_sub_category_id_params },
        })
        .then((res) => {
          const resData = response(res);
          setCategory(resData.data);
        });
    }
  }, [website_sub_category_id_params]);

  const {
    minimizeSidebar,
    sidebarMobile,
    setSidebarMobile,
    setMinimizeSidebar,
  } = useAppContext();

  const [componentName, setComponentName] = useState('');
  const [hideLayout, setHideLayout] = useState(false);
  const [inWorkspace, setInWorkspace] = useState(false);

  const isMobile = useMedia({ maxWidth: '768px' });

  // Detect workspace / course immersive mode
  useEffect(() => {
    if (params?.docsid) {
      setComponentName('DocViewerPage');
    }

    const isWorkspaceRoute =
      pathname?.includes('workspace') && params?.category && params?.docsid;
    const isCourseRoute =
      pathname?.includes('course') &&
      params?.categoryId &&
      pathname?.includes('/study');

    if (isWorkspaceRoute || isCourseRoute) {
      setComponentName('DocViewerPage');
      setInWorkspace(true);
    } else {
      setInWorkspace(false);
      setComponentName('');
    }
  }, [pathname, params, isMobile]);

  // Hide layout for try-out / quiz active sessions
  useEffect(() => {
    if (
      (pathname?.includes('try-out') || pathname?.includes('quiz')) &&
      params?.id
    ) {
      setHideLayout(true);
    } else {
      setHideLayout(false);
    }
  }, [pathname, params]);

  if (hideLayout) {
    return <Suspense>{children}</Suspense>;
  }

  return (
    <SidebarProvider
      open={!minimizeSidebar}
      onOpenChange={(open) => setMinimizeSidebar(!open)}
    >
      <Suspense>
        <ProviderCheckSubscriptionPending>
          <ProviderCheckSubscription>
            <ProviderCheckSubscriptionInstallment>
              <ProviderCheckLimitation>
                <SidebarUser
                  category={category}
                  isMobileSidebarOpen={sidebarMobile}
                  setIsMobileSidebarOpen={setSidebarMobile}
                />

                {isMobile && (
                  <div
                    className={`fixed top-0 block h-full overflow-hidden duration-200 md:hidden ${
                      sidebarMobile
                        ? 'left-0 w-[300px] z-10000'
                        : 'left-[-310px] w-[300px] z-10000'
                    }`}
                  >
                    <Sidebar
                      category={category}
                      isMobileSidebarOpen={sidebarMobile}
                      setIsMobileSidebarOpen={setSidebarMobile}
                    />
                  </div>
                )}

                <SidebarInset className="flex flex-col h-screen overflow-hidden">
                  {!inWorkspace && <HeaderUser />}
                  <div
                    className={cn(
                      'flex-1 overflow-y-auto overflow-x-hidden',
                      !inWorkspace && 'pt-[80px]',
                    )}
                  >
                    <main
                      className={cn(
                        'relative mt-0 pr-0 pt-0 duration-300 md:pl-22 w-full ',
                        componentName === 'DocViewerPage' &&
                          'fixed left-0 top-0 h-full w-full',
                        !inWorkspace &&
                          'pt-4 md:pl-12 md:pr-10 md:pt-12 min-h-[calc(100vh-80px)]',
                      )}
                    >
                      {children}
                    </main>
                  </div>
                </SidebarInset>
              </ProviderCheckLimitation>
            </ProviderCheckSubscriptionInstallment>
          </ProviderCheckSubscription>
        </ProviderCheckSubscriptionPending>
      </Suspense>
    </SidebarProvider>
  );
}
