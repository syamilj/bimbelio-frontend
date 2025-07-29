// src/app/(user)/layout-user-client.tsx

'use client';

import { useParams, usePathname } from 'next/navigation';
import { ReactNode, Suspense, useEffect, useState } from 'react';
import useMedia from 'use-media';

import Sidebar from '@/app/[web_sub_category]/(user)/user/_components/sidebar';
import { useAppContext } from '@/components/provider/provider-app';

import SearchDeskstop from '@/app/[web_sub_category]/(user)/user/_components/search-dekstop';
import ProviderCheckSubscription from '@/components/provider/provider-check-subscription';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import axiosInstance from '@/lib/axios/axiosInstance';
import { response } from '@/lib/response';
import { cn } from '@/lib/utils';
import {
  Brain,
  ChevronDown,
  Crown,
  Eye,
  FileText,
  Menu,
  MessageSquare,
  Search as SearchIcon,
  Settings,
  Sparkles,
  Trophy,
  User,
} from 'lucide-react';
import ProviderCheckLimitation from '../provider/provider-check-limitation';
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
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

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
    setTransactionPopUp,
    setPagesSetting,
    setTransactionHistory,
  } = useAppContext();

  // State
  const [componentName, setComponentName] = useState<string>('');
  const [hideLayout, setHideLayout] = useState<boolean>(false);
  const [inWorkspace, setInWorkspace] = useState<boolean>(false);
  const [showMobileSearch, setShowMobileSearch] = useState<boolean>(false);

  // Responsive check
  const isMobile = useMedia({ maxWidth: '768px' });

  // EFFECTS ------------------------------------------------------

  // 1) Cek apakah halaman ini workspace/course => ubah inWorkspace
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
      // Remove forced minimize - let user control sidebar state
    } else {
      setInWorkspace(false);
      setComponentName('');
    }
  }, [pathname, params, isMobile]);

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
  const userTier = userSession?.user.tier;

  // UTILS --------------------------------------------------------
  // Render limitation with countdown format (remaining instead of used/total)
  const LimitationItem = ({
    icon: Icon,
    label,
    remaining = 0,
    total = 0,
    color,
  }: {
    icon: any;
    label: string;
    remaining?: number;
    total?: number;
    color?: string;
  }) => {
    const isAdmin = userTier === 'ADMIN';
    const percentage = isAdmin
      ? 100
      : total > 0
        ? ((total - remaining) / total) * 100
        : 0;
    const isWarning = percentage > 80 && !isAdmin;

    return (
      <div className="flex items-center gap-2 px-2 lg:px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group min-w-0">
        <div className="flex items-center justify-center flex-shrink-0">
          <Icon
            className="w-3 h-3 lg:w-4 lg:h-4"
            style={{ color: color || mainColor }}
          />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-medium text-gray-700 truncate">
            {label}
          </span>
          <div className="flex items-center gap-1">
            {isAdmin ? (
              <span className="text-xs text-green-600 font-bold">∞</span>
            ) : (
              <span
                className={cn(
                  'text-xs font-bold',
                  isWarning ? 'text-orange-600' : 'text-gray-600',
                )}
              >
                {remaining} tersisa
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Create limitations array
  const limitations = [
    {
      icon: MessageSquare,
      label: 'Chat',
      remaining: Math.max(
        0,
        (userLimitation?.chatLimit || 0) - (userLimitation?.chat || 0),
      ),
      total: userLimitation?.chatLimit || 0,
      color: '#10b981',
    },
    {
      icon: Eye,
      label: 'Vision',
      remaining: Math.max(
        0,
        (userLimitation?.visionLimit || 0) - (userLimitation?.vision || 0),
      ),
      total: userLimitation?.visionLimit || 0,
      color: '#06b6d4',
    },
    {
      icon: FileText,
      label: 'Notes',
      remaining: Math.max(
        0,
        (userLimitation?.notesLimit || 0) - (userLimitation?.notes || 0),
      ),
      total: userLimitation?.notesLimit || 0,
      color: '#f59e0b',
    },
    {
      icon: Brain,
      label: 'Quiz',
      remaining: Math.max(
        0,
        (userLimitation?.quizLimit || 0) - (userLimitation?.quiz || 0),
      ),
      total: userLimitation?.quizLimit || 0,
      color: '#8b5cf6',
    },
    {
      icon: Trophy,
      label: 'Tryout',
      remaining: Math.max(
        0,
        (userLimitation?.tryoutLimit || 0) - (userLimitation?.tryout || 0),
      ),
      total: userLimitation?.tryoutLimit || 0,
      color: '#ef4444',
    },
  ];
  // MAIN LAYOUT --------------------------------------------------
  return (
    <Suspense>
      <ProviderCheckSubscription>
        <ProviderCheckLimitation>
          <div className="h-full min-h-[100vh] overflow-x-hidden bg-gray-50">
            {/* MODERN HEADER */}
            {!inWorkspace && (
              <header
                className={cn(
                  'fixed inset-x-0 top-0 z-40 h-16 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm transition-all duration-300',
                  !minimizeSidebar ? 'md:pl-72' : 'md:pl-20',
                )}
              >
                <div className="flex items-center justify-between h-full px-3 md:px-6">
                  {/* LEFT SECTION */}
                  <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
                    {/* Mobile Menu Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden w-9 h-9 rounded-xl flex-shrink-0 hover:bg-gray-100 border border-gray-200"
                      onClick={() => setSidebarMobile(true)}
                    >
                      <Menu className="w-5 h-5 text-gray-700" />
                    </Button>

                    {/* Desktop Greeting - Responsive */}
                    <div className="hidden md:flex items-center gap-3 min-w-0 flex-1">
                      <div className="min-w-0 flex-1">
                        <h1 className="text-base lg:text-lg font-bold text-gray-900 truncate">
                          Selamat datang kembali!
                        </h1>
                        <p className="text-xs lg:text-sm text-gray-500 truncate">
                          Halo,{' '}
                          <span style={{ color: mainColor, fontWeight: '600' }}>
                            {userSession?.user.name}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Mobile Limitations Display */}
                    <div className="md:hidden flex items-center justify-center gap-1 flex-1 min-w-0 overflow-x-auto scrollbar-hide">
                      <div className="flex items-center gap-1.5 min-w-0 py-0">
                        {limitations.slice(0, 3).map((limitation, index) => {
                          const isLow =
                            limitation.remaining <= 3 &&
                            limitation.remaining > 0;
                          const isEmpty = limitation.remaining === 0;
                          const isWarning =
                            limitation.remaining <= 10 &&
                            limitation.remaining > 3;

                          return (
                            <div
                              key={index}
                              className={cn(
                                'relative flex flex-col items-center justify-center px-2 py-1 rounded-2xl flex-shrink-0 min-w-[55px] transition-all duration-200',
                                isEmpty
                                  ? 'bg-red-50 border border-red-200 shadow-sm'
                                  : isLow
                                    ? 'bg-orange-50 border border-orange-200 shadow-sm'
                                    : isWarning
                                      ? 'bg-yellow-50 border border-yellow-200'
                                      : 'bg-white border border-gray-200 shadow-sm',
                              )}
                            >
                              {/* Label */}
                              <span
                                className={cn(
                                  'text-xs font-medium truncate mb-1',
                                  isEmpty
                                    ? 'text-red-700'
                                    : isLow
                                      ? 'text-orange-700'
                                      : isWarning
                                        ? 'text-yellow-700'
                                        : 'text-gray-700',
                                )}
                              >
                                {limitation.label}
                              </span>

                              {/* Value */}
                              <span
                                className={cn(
                                  'text-sm font-bold leading-none',
                                  isEmpty
                                    ? 'text-red-600'
                                    : isLow
                                      ? 'text-orange-600'
                                      : isWarning
                                        ? 'text-yellow-600'
                                        : 'text-gray-800',
                                )}
                              >
                                {userTier === 'ADMIN'
                                  ? '∞'
                                  : limitation.remaining}
                              </span>
                            </div>
                          );
                        })}

                        {/* Show more indicator if there are more limitations */}
                        {limitations.length > 3 && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="flex items-center justify-center w-12 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex-shrink-0 transition-colors"
                              >
                                <span className="text-xs font-medium text-gray-600">
                                  +{limitations.length - 3}
                                </span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="center"
                              className="w-64 mt-2"
                            >
                              <div className="px-3 py-2 border-b">
                                <p className="text-sm font-medium text-center">
                                  Sisa Penggunaan
                                </p>
                              </div>
                              <div className="px-3 py-2 space-y-2">
                                {limitations.map((limitation, index) => (
                                  <LimitationItem
                                    key={index}
                                    icon={limitation.icon}
                                    label={limitation.label}
                                    remaining={limitation.remaining}
                                    total={limitation.total}
                                    color={limitation.color}
                                  />
                                ))}
                              </div>
                              {!userTier && (
                                <>
                                  <DropdownMenuSeparator />
                                  <div className="px-3 py-2">
                                    <Button
                                      className="w-full text-white"
                                      style={{ backgroundColor: mainColor }}
                                      onClick={() => setTransactionPopUp(true)}
                                    >
                                      <Crown className="w-4 h-4 mr-2" />
                                      Upgrade Premium
                                    </Button>
                                  </div>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* CENTER SECTION - Mobile Search Button */}
                  {isMobile && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-9 h-9 rounded-xl flex-shrink-0 border border-gray-200"
                      onClick={() => setShowMobileSearch(!showMobileSearch)}
                    >
                      <SearchIcon className="w-5 h-5 text-gray-600" />
                    </Button>
                  )}

                  {/* RIGHT SECTION */}
                  <div className="flex items-center gap-1 md:gap-3 flex-shrink-0">
                    {/* Desktop Limitations - More Compact */}
                    {!isMobile && (
                      <div className="hidden xl:flex items-center gap-1">
                        {limitations.map((limitation, index) => (
                          <LimitationItem
                            key={index}
                            icon={limitation.icon}
                            label={limitation.label}
                            remaining={limitation.remaining}
                            total={limitation.total}
                            color={limitation.color}
                          />
                        ))}
                      </div>
                    )}

                    {/* Status Badge - Compact for desktop */}
                    {userTier === 'ADMIN' ? (
                      <div
                        className="hidden md:flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-1 lg:py-1.5 rounded-xl text-white text-xs lg:text-sm font-semibold shadow-sm"
                        style={{ backgroundColor: mainColor }}
                      >
                        <Crown className="w-3 h-3 lg:w-4 lg:h-4" />
                        <span className="hidden lg:inline">Admin</span>
                      </div>
                    ) : userTier ? (
                      <div
                        className="hidden md:flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-1 lg:py-1.5 rounded-xl text-white text-xs lg:text-sm font-semibold shadow-sm"
                        style={{ backgroundColor: mainColor }}
                      >
                        <Crown className="w-3 h-3 lg:w-4 lg:h-4" />
                        <span className="hidden lg:inline">{userTier}</span>
                      </div>
                    ) : (
                      <Button
                        className="hidden md:flex items-center gap-1 lg:gap-2 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 text-xs lg:text-sm px-2 lg:px-3 py-1 lg:py-2 h-8 lg:h-auto"
                        style={{ backgroundColor: mainColor }}
                        onClick={() => setTransactionPopUp(true)}
                      >
                        <Sparkles className="w-3 h-3 lg:w-4 lg:h-4" />
                        <span className="hidden lg:inline">Upgrade</span>
                      </Button>
                    )}

                    {/* User Profile Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="flex items-center gap-2 h-9 px-2 rounded-xl hover:bg-gray-100 transition-colors flex-shrink-0"
                        >
                          <Avatar className="w-6 h-6 lg:w-7 lg:h-7 ring-2 ring-offset-1 ring-gray-200">
                            <AvatarImage
                              src={
                                userSession?.user.image || '/placeholder.svg'
                              }
                              alt={userSession?.user.name || 'User'}
                            />
                            <AvatarFallback
                              className="text-white font-bold text-xs lg:text-sm"
                              style={{ backgroundColor: mainColor }}
                            >
                              {userSession?.user.name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          {!isMobile && (
                            <>
                              <span className="text-xs lg:text-sm font-medium text-gray-700 max-w-16 lg:max-w-24 truncate">
                                {userSession?.user.name}
                              </span>
                              <ChevronDown className="w-3 h-3 lg:w-4 lg:h-4 text-gray-500" />
                            </>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-56 mt-2"
                      >
                        <div className="px-3 py-2 border-b">
                          <p className="text-sm font-medium">
                            {userSession?.user.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {userSession?.user.email}
                          </p>
                        </div>

                        {/* Mobile Limitations with Countdown Format */}
                        {isMobile && (
                          <>
                            <div className="px-3 py-2 space-y-2">
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                Sisa Penggunaan
                              </p>
                              <div className="space-y-1">
                                {limitations.map((limitation, index) => (
                                  <LimitationItem
                                    key={index}
                                    icon={limitation.icon}
                                    label={limitation.label}
                                    remaining={limitation.remaining}
                                    total={limitation.total}
                                    color={limitation.color}
                                  />
                                ))}
                              </div>
                            </div>
                            <DropdownMenuSeparator />
                          </>
                        )}

                        <DropdownMenuItem
                          onClick={() => {
                            setOpenMenu(false);
                            setPagesSetting('account');
                            setTransactionHistory(true);
                          }}
                        >
                          <User className="w-4 h-4 mr-2" />
                          Profil
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setOpenMenu(false);
                            setPagesSetting('account');
                            setTransactionHistory(true);
                          }}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Pengaturan
                        </DropdownMenuItem>
                        {!userTier && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setTransactionPopUp(true)}
                            >
                              <Crown className="w-4 h-4 mr-2" />
                              Upgrade Premium
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 focus:text-red-600">
                          Keluar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Mobile Search Dropdown */}
                {isMobile && showMobileSearch && (
                  <div className="border-t border-gray-200 p-4 bg-white">
                    <SearchDeskstop />
                  </div>
                )}
              </header>
            )}

            {/* SIDEBAR (Desktop) */}
            <div
              className={cn(
                'fixed inset-y-0 left-0 transition-all duration-300 z-50',
                // In workspace: always show sidebar (minimized or expanded)
                inWorkspace && !isMobile
                  ? minimizeSidebar
                    ? 'w-20'
                    : 'w-72'
                  : minimizeSidebar
                    ? 'w-20'
                    : 'w-72',
                'hidden md:block',
              )}
            >
              <div className="h-full">
                <Sidebar category={category} />
              </div>
            </div>

            {/* SIDEBAR (Mobile) - Fixed to slide from left */}
            {/* SIDEBAR (Mobile) */}
            {isMobile && (
              <div
                className={`fixed top-0 block h-full overflow-hidden duration-200 md:hidden ${
                  sidebarMobile
                    ? 'left-0 w-[300px] z-[10000]'
                    : 'left-[-310px] w-[300px] z-[10000]'
                }`}
              >
                <Sidebar category={category} />
              </div>
            )}
            {/* Overlay Mobile */}
            {sidebarMobile && (
              <div
                className="fixed left-0 top-0 z-[9999] h-full w-full bg-[#00000063] backdrop-blur-[5px] duration-100 md:hidden"
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
        </ProviderCheckLimitation>
      </ProviderCheckSubscription>
    </Suspense>
  );
}
