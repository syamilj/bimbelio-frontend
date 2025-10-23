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
import { website_sub_category_id_params } from '@/hooks/use-web-sub-category-id';
import { signOut } from '@/lib/auth-helper';
import axiosInstance from '@/lib/axios/axiosInstance';
import { response } from '@/lib/response';
import { cn } from '@/lib/utils';
import { formatDateRange } from '@/lib/utils/date';
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
import Link from 'next/link';
import ProviderCheckLimitation from '../provider/provider-check-limitation';
import ProviderCheckSubscriptionPending from '../provider/provider-check-subscription-pending';
import { useUserLimitation } from '../provider/provider-limitation';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

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
        <div className="flex items-center justify-center shrink-0">
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
      <ProviderCheckSubscriptionPending>
        <ProviderCheckSubscription>
          <ProviderCheckLimitation>
            <div className="h-full min-h-screen overflow-x-hidden bg-gray-50">
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
                        className="md:hidden w-9 h-9 rounded-xl shrink-0 hover:bg-gray-100 border border-gray-200"
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
                            <span
                              style={{ color: mainColor, fontWeight: '600' }}
                            >
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
                                  'relative flex flex-col items-center justify-center px-2 py-1 rounded-2xl shrink-0 min-w-[55px] transition-all duration-200',
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
                                  className="flex items-center justify-center w-12 h-8 bg-gray-100 hover:bg-gray-200 rounded-full shrink-0 transition-colors"
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
                                        onClick={() =>
                                          setTransactionPopUp(true)
                                        }
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
                        className="w-9 h-9 rounded-xl shrink-0 border border-gray-200"
                        onClick={() => setShowMobileSearch(!showMobileSearch)}
                      >
                        <SearchIcon className="w-5 h-5 text-gray-600" />
                      </Button>
                    )}

                    {/* RIGHT SECTION */}
                    <div className="flex items-center gap-1 md:gap-3 shrink-0">
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
                      {userTier === 'ADMIN' ||
                      userTier === 'SUPER_ADMIN' ||
                      userTier === 'PREMIUM' ? (
                        <div
                          className="hidden md:flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-1 lg:py-1.5 rounded-xl text-white text-xs lg:text-sm font-semibold shadow-sm"
                          style={{ backgroundColor: mainColor }}
                        >
                          <Crown className="w-3 h-3 lg:w-4 lg:h-4" />
                          <span className="hidden lg:inline">{userTier}</span>
                        </div>
                      ) : (
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger className="cursor-pointer">
                            <div
                              className="hidden md:flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-1 lg:py-1.5 rounded-xl text-white text-xs lg:text-sm font-semibold shadow-sm"
                              style={{ backgroundColor: mainColor }}
                            >
                              <Crown className="w-3 h-3 lg:w-4 lg:h-4" />
                              <span className="hidden lg:inline">
                                {userTier || 'Free Tier'}
                              </span>
                              <ChevronDown className="w-3 h-3 lg:w-4 lg:h-4" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent
                            className="min-w-xs max-w-[350px] p-3"
                            side="bottom"
                            align="end"
                          >
                            <div className="space-y-3">
                              {/* Subscription Aktif */}
                              <div className="space-y-2">
                                <p className="text-sm font-semibold text-center">
                                  Subscription Aktif
                                </p>
                                {userSession?.user.subsList &&
                                userSession.user.subsList.length > 0 ? (
                                  <div className="space-y-2">
                                    {userSession.user.subsList.map(
                                      (sub, index) => (
                                        <div
                                          key={sub.id}
                                          className="p-2 rounded-lg bg-green-50 border border-green-200"
                                        >
                                          <div className="flex flex-col items-start justify-center mb-1 gap-1">
                                            <span
                                              className="text-[9px] px-2 py-0.5 rounded-full text-white font-medium flex items-center justify-center"
                                              style={{
                                                backgroundColor: mainColor,
                                              }}
                                            >
                                              {sub.planTier}
                                            </span>
                                            <span className="text-xs font-semibold text-gray-900 truncate">
                                              {sub.planName}
                                            </span>
                                          </div>
                                          <p className="text-xs text-gray-600 mb-1 line-clamp-2">
                                            {sub.planDescription}
                                          </p>
                                          {sub.SubscriptionFeature &&
                                            sub.SubscriptionFeature.length >
                                              0 && (
                                              <div className="mb-2">
                                                <p className="text-xs font-medium text-gray-700 mb-1">
                                                  Fitur:
                                                </p>
                                                <div className="flex flex-wrap gap-1">
                                                  {sub.SubscriptionFeature.map(
                                                    (feature, featureIndex) => (
                                                      <span
                                                        key={feature.id}
                                                        className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-700 font-medium"
                                                      >
                                                        {feature.type ===
                                                          'DOCUMENT' &&
                                                          '📄 Document'}
                                                        {feature.type ===
                                                          'COURSE' &&
                                                          '📚 Course'}
                                                        {feature.type ===
                                                          'LIVECLASS' &&
                                                          '🎥 Live Class'}
                                                      </span>
                                                    ),
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                          <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-500">
                                              Expired:{' '}
                                              {new Date(
                                                sub.planExpire,
                                              ).toLocaleDateString('id-ID')}
                                            </span>
                                          </div>
                                          <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                            className="w-full mt-2 h-7 text-xs"
                                          >
                                            <Link href={`/price/${sub.planId}`}>
                                              Lihat Detail
                                            </Link>
                                          </Button>
                                        </div>
                                      ),
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-xs text-gray-500 text-center">
                                    Tidak ada subscription aktif
                                  </p>
                                )}
                                {userSession?.user.role !== 'USER' && (
                                  <div className="flex justify-center w-full">
                                    <Badge className="bg-amber-400 text-white">
                                      {userTier}
                                    </Badge>
                                  </div>
                                )}
                              </div>

                              {/* Subscription Pending */}
                              {userSession?.user.subsPendingList &&
                                userSession.user.subsPendingList.length > 0 && (
                                  <div className="space-y-2 pt-2 border-t border-gray-200">
                                    <p className="text-sm font-semibold text-center text-orange-600">
                                      Subscription Pending
                                    </p>
                                    <div className="space-y-2">
                                      {userSession.user.subsPendingList.map(
                                        (subPending, index) => (
                                          <div
                                            key={subPending.id}
                                            className="p-2 rounded-lg bg-orange-50 border border-orange-200"
                                          >
                                            <div className="flex flex-col items-start justify-center mb-1 gap-1">
                                              <div className="flex items-center gap-2">
                                                <span
                                                  className="text-[9px] px-2 py-0.5 rounded-full text-white font-medium flex items-center justify-center"
                                                  style={{
                                                    backgroundColor: '#f59e0b',
                                                  }}
                                                >
                                                  {subPending.planTier}
                                                </span>
                                                <span className="text-[8px] px-1.5 py-0.5 rounded-md bg-orange-100 text-orange-700 font-medium">
                                                  PENDING
                                                </span>
                                              </div>
                                              <span className="text-xs font-semibold text-gray-900 truncate">
                                                {subPending.planName}
                                              </span>
                                            </div>
                                            <p className="text-xs text-gray-600 mb-1 line-clamp-2">
                                              {subPending.planDescription}
                                            </p>

                                            {/* Subscription Pending Features dengan Timeline */}
                                            {subPending.SubscriptionPendingFeature &&
                                              subPending
                                                .SubscriptionPendingFeature
                                                .length > 0 && (
                                                <div className="mb-2">
                                                  <p className="text-xs font-medium text-gray-700 mb-1">
                                                    Fitur:
                                                  </p>
                                                  <div className="space-y-1">
                                                    {subPending.SubscriptionPendingFeature.map(
                                                      (
                                                        feature,
                                                        featureIndex,
                                                      ) => (
                                                        <div
                                                          key={feature.id}
                                                          className="p-1.5 rounded-md bg-yellow-50 border border-yellow-200"
                                                        >
                                                          <div className="flex items-center justify-between mb-1">
                                                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-yellow-200 text-yellow-800 font-medium">
                                                              {feature.type ===
                                                                'DOCUMENT' &&
                                                                '📄 Document'}
                                                              {feature.type ===
                                                                'COURSE' &&
                                                                '📚 Course'}
                                                              {feature.type ===
                                                                'LIVECLASS' &&
                                                                '🎥 Live Class'}
                                                            </span>
                                                          </div>
                                                          {/* Timeline untuk pending feature */}
                                                          <div className="text-[10px] text-green-600 pt-1 border-t border-yellow-300">
                                                            Aktif pada{' '}
                                                            {formatDateRange(
                                                              feature.validFrom,
                                                              feature.validUntil,
                                                            )}
                                                          </div>
                                                        </div>
                                                      ),
                                                    )}
                                                  </div>
                                                </div>
                                              )}

                                            {/* Subscription Pending Limitation */}
                                            {subPending.SubscriptionPendingLimitation && (
                                              <div className="mb-2">
                                                <p className="text-xs font-medium text-gray-700 mb-1">
                                                  Coin :
                                                </p>
                                                <div className="p-1.5 rounded-md bg-yellow-50 border border-yellow-200">
                                                  <div className="grid grid-cols-2 gap-1 mb-1">
                                                    <div className="text-[10px] text-yellow-800">
                                                      <span className="font-medium">
                                                        Chat:
                                                      </span>{' '}
                                                      {
                                                        subPending
                                                          .SubscriptionPendingLimitation
                                                          .chat
                                                      }
                                                    </div>
                                                    <div className="text-[10px] text-yellow-800">
                                                      <span className="font-medium">
                                                        Notes:
                                                      </span>{' '}
                                                      {
                                                        subPending
                                                          .SubscriptionPendingLimitation
                                                          .notes
                                                      }
                                                    </div>
                                                    <div className="text-[10px] text-yellow-800">
                                                      <span className="font-medium">
                                                        Vision:
                                                      </span>{' '}
                                                      {
                                                        subPending
                                                          .SubscriptionPendingLimitation
                                                          .vision
                                                      }
                                                    </div>
                                                    <div className="text-[10px] text-yellow-800">
                                                      <span className="font-medium">
                                                        Quiz:
                                                      </span>{' '}
                                                      {
                                                        subPending
                                                          .SubscriptionPendingLimitation
                                                          .quiz
                                                      }
                                                    </div>
                                                    <div className="text-[10px] text-yellow-800 col-span-2">
                                                      <span className="font-medium">
                                                        Tryout:
                                                      </span>{' '}
                                                      {
                                                        subPending
                                                          .SubscriptionPendingLimitation
                                                          .tryout
                                                      }
                                                    </div>
                                                  </div>
                                                  <div className="text-[10px] text-green-600 pt-1 border-t border-yellow-300">
                                                    Aktif pada{' '}
                                                    {formatDateRange(
                                                      subPending
                                                        .SubscriptionPendingLimitation
                                                        .validFrom,
                                                      subPending
                                                        .SubscriptionPendingLimitation
                                                        .validUntil,
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-2 mt-4 pt-3 border-t border-gray-200">
                              {/* Button Lihat Detail Subscription */}
                              <Button
                                asChild
                                variant="outline"
                                className="w-full items-center gap-2 rounded-xl border-2 hover:bg-gray-50 transition-all duration-200 text-xs lg:text-sm px-2 lg:px-3 py-1 lg:py-2 h-8 lg:h-auto"
                                style={{
                                  borderColor: mainColor,
                                  color: mainColor,
                                }}
                              >
                                <Link
                                  href={`/${website_sub_category_id_params}/user/subscription`}
                                >
                                  <Settings className="w-3 h-3 lg:w-4 lg:h-4" />
                                  <span>Kelola Subscription</span>
                                </Link>
                              </Button>

                              {/* Button Beli Subscription */}
                              <Button
                                className="w-full items-center gap-1 lg:gap-2 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 text-xs lg:text-sm px-2 lg:px-3 py-1 lg:py-2 h-8 lg:h-auto"
                                style={{ backgroundColor: mainColor }}
                                onClick={() => setTransactionPopUp(true)}
                              >
                                <Sparkles className="w-3 h-3 lg:w-4 lg:h-4" />
                                <span className="hidden lg:inline">
                                  Beli Subscription
                                </span>
                                <span className="lg:hidden">Beli</span>
                              </Button>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      )}

                      {/* User Profile Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="flex items-center gap-2 h-9 px-2 rounded-xl hover:bg-gray-100 transition-colors shrink-0"
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
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => {
                              signOut({ callbackUrl: '/' });
                            }}
                          >
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
                      ? 'left-0 w-[300px] z-10000'
                      : 'left-[-310px] w-[300px] z-10000'
                  }`}
                >
                  <Sidebar category={category} />
                </div>
              )}
              {/* Overlay Mobile */}
              {sidebarMobile && (
                <div
                  className="fixed left-0 top-0 z-9999 h-full w-full bg-[#00000063] backdrop-blur-[5px] duration-100 md:hidden"
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
                    'mt-[80px] pt-4 md:pl-[calc(75px+3rem)] md:pr-10 md:pt-12  min-h-[calc(100vh-80px)]',
                )}
              >
                {children}
              </main>
            </div>
          </ProviderCheckLimitation>
        </ProviderCheckSubscription>
      </ProviderCheckSubscriptionPending>
    </Suspense>
  );
}
