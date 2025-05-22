// src/app/(user)/layout-user-client.tsx

'use client';

import { useParams, usePathname } from 'next/navigation';
import { ReactNode, Suspense, useEffect, useState } from 'react';
import useMedia from 'use-media';

import ButtonPayment from '@/app/[web_sub_category]/(user)/user/_components/button-payment';
import Search from '@/app/[web_sub_category]/(user)/user/_components/search';
import Sidebar from '@/app/[web_sub_category]/(user)/user/_components/sidebar';
import { useAppContext } from '@/components/provider/provider-app';

import AnimatedGradientText from '@/components/magicui/animated-gradient-text';
import ProviderCheckSubscription from '@/components/provider/provider-check-subscription';
import { useSession } from '@/components/provider/provider-session-auth';
import axiosInstance from '@/lib/axios/axiosInstance';
import { response } from '@/lib/response';
import { cn } from '@/lib/utils';
import {
  IconChat,
  IconCrown,
  IconHamburger,
  IconPen,
  IconTabsQuiz,
  IconTryOut,
  IconUnlimited,
  IconVision,
} from '@/styles/icon';
import { useUserLimitation } from '../provider/provider-limitation';

interface LayoutUserClientProps {
  children: ReactNode;
}

type CategoryType = {
  name: string;
  id: string;
  total: number;
};

export default function LayoutUserClient({ children }: LayoutUserClientProps) {
  // Next.js hooks
  const pathname = usePathname();
  const params = useParams();
  const { data: userSession } = useSession();
  const { userLimitation } = useUserLimitation();

  // Queries
  // const { data: category } = api.category.getAllCategories.useQuery(undefined, {
  //   refetchOnWindowFocus: false,
  //   refetchOnMount: false,
  // });
  // const { data: limitationUsed } = api.user.getCurrentLimitation.useQuery(
  //   undefined,
  //   { refetchOnWindowFocus: false }
  // );

  const [category, setCategory] = useState<CategoryType[]>([]);

  useEffect(() => {
    axiosInstance.get('/category/getAllCategories').then((res) => {
      const resData = response(res);
      setCategory(resData.data);
    });
  }, []);

  // Global context
  const {
    minimizeSidebar,
    showSidebar,
    sidebarMobile,
    setSidebarMobile,
    docsSearchData,
    setDocsSearchData,
    setMinimizeSidebar,
  } = useAppContext();

  // State
  const [componentName, setComponentName] = useState<string>('');
  const [hideLayout, setHideLayout] = useState<boolean>(false);
  const [inWorkspace, setInWorkspace] = useState<boolean>(false);

  // Responsive check
  const isMobile = useMedia({ maxWidth: '768px' });

  // EFFECTS ------------------------------------------------------

  // 1) Cek apakah halaman ini workspace/course => ubah inWorkspace
  //    Jika 'docsid' param ada => set componentName 'DocViewerPage'
  useEffect(() => {
    if (params?.docsid) {
      setComponentName('DocViewerPage');
    }

    const isWorkspaceRoute =
      pathname?.includes('workspace') && params?.category && params?.docsid;
    const isCourseRoute = pathname?.includes('course') && params?.categoryId;

    if (isWorkspaceRoute || isCourseRoute) {
      setComponentName('DocViewerPage');
      setInWorkspace(true);
    } else {
      setInWorkspace(false);
      setComponentName('');
    }

    // setInWorkspace(!!(isWorkspaceRoute || isCourseRoute));
  }, [pathname, params]);

  // 2) Jika route 'try-out/[id]' => hideLayout = true
  useEffect(() => {
    if (pathname?.includes('try-out') && params?.id) {
      setHideLayout(true);
    } else {
      setHideLayout(false);
    }
  }, [pathname, params]);

  // RENDER -------------------------------------------------------

  // Jika layout di-hide (misal try-out) -> Render children langsung
  if (hideLayout) {
    return <Suspense>{children}</Suspense>;
  }

  // Admin/user data
  const userTier = userSession?.user.tier; // mis. 'ADMIN' | 'USER' | 'PREMIUM'

  // UTILS --------------------------------------------------------
  // Render jumlah limit
  function renderLimitInfo(
    icon: React.ReactNode,
    used?: number,
    limit?: number,
  ) {
    if (userTier !== 'ADMIN') {
      return (
        <p className="text-[.9rem] text-main-gray-text">
          {used}/{limit}
        </p>
      );
    }
    // Jika ADMIN => unlimited
    return (
      <div className="flex items-center text-[.9rem] text-main-gray-text">
        <IconUnlimited w={15} />/<IconUnlimited w={15} />
      </div>
    );
  }

  // MAIN LAYOUT --------------------------------------------------
  return (
    <Suspense>
      <ProviderCheckSubscription>
        <div className="h-full min-h-[100vh] overflow-x-hidden bg-bg-layout pb-0">
          {/* HEADER */}
          {!inWorkspace && (
            <div
              id="header"
              className={cn(
                'fixed inset-y-0 z-[50] flex h-[80px] w-full items-center justify-between gap-[1.5rem] rounded-b-3xl border-main-gray-input bg-bg-layout px-[1.5rem] duration-300 md:gap-0 md:border-b md:bg-white/90 md:px-0 md:pl-[75px] md:pr-[1rem]',
                !minimizeSidebar && 'md:pl-[16rem]',
              )}
            >
              {/* LEFT: Greeting (desktop only) */}
              <div className="hidden items-center justify-center pl-[3rem] md:flex">
                <span className="text-main-gray">
                  Selamat Datang,{' '}
                  <AnimatedGradientText className="animate-gradient bg-gradient-to-r from-[#ffaa40] via-main to-[#ffaa40] font-medium">
                    {userSession?.user.name}
                  </AnimatedGradientText>
                </span>
              </div>

              {/* MOBILE: hamburger button */}
              <div
                className="md:hidden"
                onClick={() => setSidebarMobile(true)}
              >
                <IconHamburger
                  w={20}
                  className="text-main-gray-text"
                />
              </div>

              {/* MOBILE: search bar */}
              {isMobile && (
                <div className="flex w-full items-center justify-center md:hidden">
                  <Search
                    docsSearchData={docsSearchData}
                    setDocsSearchData={setDocsSearchData}
                  />
                </div>
              )}

              {/* RIGHT: limitation & upgrade info (desktop only) */}
              <div className="hidden items-center gap-[1rem] md:flex">
                {/* Chat limit */}
                <div className="flex items-center gap-[.5rem]">
                  <IconChat
                    w={18}
                    className="text-main-gray-text"
                  />
                  {renderLimitInfo(
                    <IconChat w={18} />,
                    userLimitation?.chat,
                    userLimitation?.chatLimit,
                  )}
                </div>

                {/* Notes limit */}
                <div className="flex items-center gap-[.5rem]">
                  <IconPen
                    w={18}
                    className="text-main-gray-text"
                  />
                  {renderLimitInfo(
                    <IconPen w={18} />,
                    userLimitation?.notes,
                    userLimitation?.notesLimit,
                  )}
                </div>

                {/* Quiz limit */}
                <div className="flex items-center gap-[.5rem]">
                  <IconTabsQuiz
                    w={18}
                    className="text-main-gray-text"
                  />
                  {renderLimitInfo(
                    <IconTabsQuiz w={18} />,
                    userLimitation?.quiz,
                    userLimitation?.quizLimit,
                  )}
                </div>

                {/* Vision limit */}
                <div className="flex items-center gap-[.5rem]">
                  <IconVision
                    active
                    w={20}
                    className="text-main-gray-text"
                  />
                  {renderLimitInfo(
                    <IconVision w={18} />,
                    userLimitation?.vision,
                    userLimitation?.visionLimit,
                  )}
                </div>

                {/* Tryout limit */}
                <div className="flex items-center gap-[.5rem]">
                  <IconTryOut
                    active
                    w={20}
                    className="text-main-gray-text"
                  />
                  {renderLimitInfo(
                    <IconTryOut w={18} />,
                    userLimitation?.tryout,
                    userLimitation?.tryoutLimit,
                  )}
                </div>

                {/* Role-based status or button */}
                {!userTier ? (
                  <ButtonPayment text="Subscription" />
                ) : userTier === 'PREMIUM' ? (
                  <div className="flex items-center gap-[.5rem] rounded-[.8rem] bg-main-yellow px-[1rem] py-[.7rem] text-[.9rem] text-white">
                    <IconCrown className="text-white" />
                    <p>Premium</p>
                  </div>
                ) : userTier === 'ADMIN' ? (
                  <div className="flex items-center gap-[.5rem] rounded-[.8rem] bg-main-yellow px-[1rem] py-[.7rem] text-[.9rem] text-white">
                    <IconCrown className="text-white" />
                    <p>Admin</p>
                  </div>
                ) : userTier ? (
                  <div className="flex items-center gap-[.5rem] rounded-[.8rem] bg-main-yellow px-[1rem] py-[.7rem] text-[.9rem] text-white">
                    <IconCrown className="text-white" />
                    <p>{userTier}</p>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* SIDEBAR (Desktop) */}
          <div
            id="border"
            className={cn(
              'fixed inset-y-0 hidden h-full w-[75px] flex-col duration-300 md:block',
              !minimizeSidebar && 'w-[16rem]',
              showSidebar && 'z-[50]',
            )}
            onMouseOver={() => setMinimizeSidebar(false)}
            onMouseLeave={() => setMinimizeSidebar(true)}
          >
            <Sidebar category={category} />
          </div>

          {/* SIDEBAR (Mobile) */}
          {isMobile && (
            <div
              className={`fixed top-0 z-[10000] block h-full overflow-hidden duration-200 md:hidden ${
                sidebarMobile ? 'left-0 w-[300px]' : 'left-[-310px] w-[300px]'
              }`}
            >
              <Sidebar category={category} />
            </div>
          )}
          {/* Overlay Mobile */}
          {sidebarMobile && (
            <div
              className="fixed left-0 top-0 z-[99] h-full w-full bg-[#00000063] backdrop-blur-[5px] duration-100 md:hidden"
              onClick={() => setSidebarMobile(false)}
            />
          )}

          {/* MAIN CONTENT */}
          <main
            className={cn(
              'relative mt-0 pr-0 pt-0 duration-300 md:pl-[75px] min-h-screen',
              // docViewer => full fixed
              componentName === 'DocViewerPage' &&
                'fixed left-0 top-0 h-full w-full',
              // not in workspace => push down margin
              !inWorkspace &&
                'mt-[80px] pt-[1rem] md:pl-[calc(75px+3rem)] md:pr-10 md:pt-12  min-h-[calc(100vh-80px)]',
            )}
          >
            {children}
          </main>
        </div>
      </ProviderCheckSubscription>
    </Suspense>
  );
}
