// src/app/(user)/layout-user-client.tsx

'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import {
  ReactNode,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import useMedia from 'use-media';

import Sidebar from '@/app/(main)/[web_sub_category]/(user)/user/_components/sidebar';
import { useAppContext } from '@/components/provider/provider-app';

import SidebarUser from '@/app/(main)/[web_sub_category]/(user)/user/_components/sidebar';
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
import { useGet } from '@/lib/fetch-helper/useGet';
import { response } from '@/lib/response';
import { cn } from '@/lib/utils';
import { TypeCourseEnum } from '@/types/database';
import {
  BookOpenIcon,
  Brain,
  ChevronDown,
  Coins,
  Crown,
  Eye,
  FileQuestionIcon,
  FileText,
  LayoutDashboardIcon,
  Menu,
  MessageSquare,
  PlayCircleIcon,
  Search as SearchIcon,
  Settings,
  Sparkles,
  Trophy,
  User,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { Notification } from '../_shared/notification';
import { BadgeSubsInfo } from '../_shared/subs/badge-subs-info';
import ProviderCheckLimitation from '../provider/provider-check-limitation';
import ProviderCheckSubscriptionInstallment from '../provider/provider-check-subscription-installment';
import ProviderCheckSubscriptionPending from '../provider/provider-check-subscription-pending';
import { useUserLimitation } from '../provider/provider-limitation';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { SidebarInset, SidebarProvider } from '../ui/sidebar';

interface LayoutUserClientProps {
  children: ReactNode;
}

type SubChapterSearchResult = {
  id: string;
  title: string;
  description: string;
  type: TypeCourseEnum;
  spendTime: number;
  number: number;
  categoryName: string;
  categoryId: string;
  chapterTitle: string;
  isCompleted: boolean;
  video: string | null;
  document: string | null;
  materi: string | null;
};

type CourseDataType = {
  id: string;
  name: string;
  CourseChapter: {
    isDone: boolean;
    title: string;
    CourseSubChapter: ({
      CourseProgress: {
        website_sub_category_id: string;
        id: string;
        createdAt: Date;
        userId: string;
        courseSubChapterId: string;
        totalScore: number | null;
      }[];
    } & {
      number: number;
      website_sub_category_id: string;
      id: string;
      title: string;
      description: string;
      courseChapterId: string;
      spendTime: number;
      type: TypeCourseEnum;
      premium: boolean;
      tryoutSessionId: string | null;
      video: string | null;
      document: string | null;
      materi: string | null;
    })[];
  }[];
  totalChapters: number;
  completedChapters: number;
  percentageProgress: number;
  totalSpendTime: number;
  totalTryout: number;
}[];

type CategoryType = {
  name: string;
  id: string;
  total: number;
};

export default function LayoutUserClient({ children }: LayoutUserClientProps) {
  // Next.js hooks
  const pathname = usePathname();
  const params = useParams();
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const [category, setCategory] = useState<CategoryType[]>([]);
  // const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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

  // Global context
  const {
    minimizeSidebar,
    sidebarMobile,
    setSidebarMobile,
    setMinimizeSidebar,
    setPagesSetting,
  } = useAppContext();

  // State
  const [componentName, setComponentName] = useState<string>('');
  const [hideLayout, setHideLayout] = useState<boolean>(false);
  const [inWorkspace, setInWorkspace] = useState<boolean>(false);

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
    // Only treat as workspace (immersive) if it's the study/player page
    const isCourseRoute =
      pathname?.includes('course') &&
      params?.categoryId &&
      pathname?.includes('/study');

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

                {/* MAIN CONTENT */}
                <SidebarInset className="flex flex-col h-screen overflow-hidden">
                  {!inWorkspace && <HeaderUser />}
                  <div
                    className={cn(
                      'flex-1 overflow-y-auto overflow-x-hidden',
                      !inWorkspace && 'pt-[80px]', // Space for fixed header
                    )}
                  >
                    <main
                      className={cn(
                        'relative mt-0 pr-0 pt-0 duration-300 md:pl-22 w-full ',
                        // docViewer => full fixed
                        componentName === 'DocViewerPage' &&
                          'fixed left-0 top-0 h-full w-full',
                        // not in workspace => add padding
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

const HeaderUser = () => {
  const { data: userSession } = useSession();
  const { userLimitation } = useUserLimitation();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const router = useRouter();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const {
    minimizeSidebar,
    setSidebarMobile,
    setTransactionPopUp,
    setPagesSetting,
  } = useAppContext();

  const [showMobileSearch, setShowMobileSearch] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Responsive check
  const isMobile = useMedia({ maxWidth: '768px' });

  // Fetch course data for search
  const { data: CourseData } = useGet<CourseDataType>(
    '/course/getCategoryForCard',
  );

  // Flatten all sub chapters for search
  const allSubChapters = useMemo<SubChapterSearchResult[]>(() => {
    if (!CourseData) return [];
    return CourseData.flatMap((category) =>
      category.CourseChapter.flatMap((chapter) =>
        chapter.CourseSubChapter.map((subChapter) => ({
          id: subChapter.id,
          title: subChapter.title,
          description: subChapter.description,
          type: subChapter.type,
          spendTime: subChapter.spendTime,
          number: subChapter.number,
          categoryName: category.name,
          categoryId: category.id,
          chapterTitle: chapter.title,
          isCompleted: subChapter.CourseProgress.length > 0,
          video: subChapter.video,
          document: subChapter.document,
          materi: subChapter.materi,
        })),
      ),
    );
  }, [CourseData]);

  // Search filter
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const query = searchQuery.toLowerCase().trim();
    return allSubChapters.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.categoryName.toLowerCase().includes(query) ||
        item.chapterTitle.toLowerCase().includes(query),
    );
  }, [searchQuery, allSubChapters]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update search open state
  useEffect(() => {
    setIsSearchOpen(searchQuery.length >= 2 && searchResults.length > 0);
    setSelectedIndex(0);
  }, [searchQuery, searchResults.length]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isSearchOpen || searchResults.length === 0) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : prev,
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (searchResults[selectedIndex]) {
          handleResultClick(searchResults[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
        inputRef.current?.blur();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, searchResults, selectedIndex]);

  const handleResultClick = (result: SubChapterSearchResult) => {
    router.push(
      `/${website_sub_category_id_params}/user/bimcourse/${result.categoryId}/study?sub=${result.id}&tab=chat`,
    );
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const getTypeIcon = (type: TypeCourseEnum) => {
    switch (type) {
      case 'VIDEO':
        return <PlayCircleIcon className="w-4 h-4" />;
      case 'DOCUMENT':
        return <FileText className="w-4 h-4" />;
      case 'MATERI':
        return <BookOpenIcon className="w-4 h-4" />;
      case 'TRYOUT':
        return <FileQuestionIcon className="w-4 h-4" />;
      default:
        return <BookOpenIcon className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: TypeCourseEnum) => {
    switch (type) {
      case 'VIDEO':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'DOCUMENT':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'MATERI':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'TRYOUT':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const highlightMatch = (text: string) => {
    if (!searchQuery) return text;
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === searchQuery.toLowerCase() ? (
            <mark
              key={i}
              className="bg-yellow-200 text-gray-900 rounded px-0.5"
            >
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </>
    );
  };

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
      <div className="flex items-center gap-2 px-2 lg:px-3 py-1.5 rounded-3xl bg-gray-50 hover:bg-gray-100 transition-colors group min-w-0">
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

  console.log({ userTier });
  // MAIN LAYOUT --------------------------------------------------
  return (
    <header
      className={cn(
        'fixed left-2 md:left-0 right-2 md:right-2 top-2 z-40 h-14 md:h-16 bg-white/95 backdrop-blur-lg border rounded-3xl border-gray-200 shadow-sm transition-all duration-300',
        !minimizeSidebar ? 'md:left-[18rem]' : 'md:left-[6rem]',
      )}
    >
      <div className="flex items-center justify-between h-full px-3 md:px-6 gap-2">
        {/* LEFT SECTION */}
        <div className="flex items-center gap-2 md:gap-4 min-w-0">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden w-9 h-9 rounded-3xl shrink-0 hover:bg-gray-100 border border-gray-200"
            onClick={() => {
              setSidebarMobile(true);
            }}
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </Button>

          {/* Desktop Greeting - Modern Design */}
          <div className="hidden md:flex items-center gap-4 min-w-0 flex-1">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-10 h-10 rounded-3xl flex items-center justify-center shadow-sm"
                style={{ backgroundColor: `${mainColor}15` }}
              >
                <span className="text-lg">👋</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  Selamat datang kembali!
                </p>
                <p className="text-xs text-gray-500 truncate">
                  Halo,{' '}
                  <span
                    style={{ color: mainColor }}
                    className="font-semibold"
                  >
                    {userSession?.user.name?.split(' ')[0]}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Mobile - Compact Greeting */}
          <div className="md:hidden flex items-center gap-1.5 min-w-0 flex-1">
            <span className="text-base">👋</span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">
                Halo,{' '}
                <span style={{ color: mainColor }}>
                  {userSession?.user.name?.split(' ')[0]}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-1.5 md:gap-3 shrink-0">
          {/* Mobile Search Icon */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden w-9 h-9 rounded-3xl hover:bg-gray-100 border border-gray-200"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
            >
              <SearchIcon className="w-4 h-4 text-gray-600" />
            </Button>
          )}

          {/* Mobile Limitations Dropdown */}
          {isMobile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-1.5 h-9 px-2 rounded-3xl hover:bg-gray-100 border border-gray-200"
                >
                  <Coins
                    className="w-4 h-4"
                    style={{ color: mainColor }}
                  />
                  <span className="text-xs font-bold text-gray-700">
                    {userTier === 'ADMIN'
                      ? '∞'
                      : limitations[0]?.remaining || 0}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-72 mt-2"
              >
                <div className="px-3 py-2.5 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                  <p className="text-sm font-bold text-center text-gray-900">
                    💎 Sisa Penggunaan
                  </p>
                  {!userTier && (
                    <p className="text-xs text-center text-gray-500 mt-0.5">
                      Upgrade untuk unlimited akses
                    </p>
                  )}
                </div>
                <div className="px-3 py-3 space-y-2 max-h-[60vh] overflow-y-auto">
                  {limitations.map((limitation, index) => {
                    const Icon = limitation.icon;
                    const isLow =
                      limitation.remaining <= 3 && limitation.remaining > 0;
                    const isEmpty = limitation.remaining === 0;
                    const percentage =
                      userTier === 'ADMIN'
                        ? 100
                        : limitation.total > 0
                          ? ((limitation.total - limitation.remaining) /
                              limitation.total) *
                            100
                          : 0;

                    return (
                      <div
                        key={index}
                        className={cn(
                          'p-2.5 rounded-3xl border-2 transition-all duration-200',
                          isEmpty
                            ? 'bg-red-50 border-red-200'
                            : isLow
                              ? 'bg-orange-50 border-orange-200'
                              : 'bg-white border-gray-100 hover:border-gray-200',
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-8 h-8 rounded-3xl flex items-center justify-center"
                              style={{
                                backgroundColor: `${limitation.color}15`,
                              }}
                            >
                              <Icon
                                className="w-4 h-4"
                                style={{ color: limitation.color }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-gray-900">
                              {limitation.label}
                            </span>
                          </div>
                          {userTier === 'ADMIN' ? (
                            <span className="text-lg font-bold text-green-600">
                              ∞
                            </span>
                          ) : (
                            <span
                              className={cn(
                                'text-sm font-bold',
                                isEmpty
                                  ? 'text-red-600'
                                  : isLow
                                    ? 'text-orange-600'
                                    : 'text-gray-900',
                              )}
                            >
                              {limitation.remaining}/{limitation.total}
                            </span>
                          )}
                        </div>
                        {userTier !== 'ADMIN' && (
                          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={cn(
                                'h-full rounded-full transition-all duration-300',
                                isEmpty
                                  ? 'bg-red-500'
                                  : isLow
                                    ? 'bg-orange-500'
                                    : 'bg-green-500',
                              )}
                              style={{ width: `${100 - percentage}%` }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {!userTier && (
                  <>
                    <DropdownMenuSeparator />
                    <div className="px-3 py-3">
                      <Button
                        className="w-full text-white shadow-lg hover:shadow-xl transition-all"
                        style={{ backgroundColor: mainColor }}
                        onClick={() => {
                          setTransactionPopUp(true);
                        }}
                      >
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade ke Premium
                      </Button>
                    </div>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Desktop Search - Interactive Input */}
          {!isMobile && (
            <div
              ref={searchRef}
              className="hidden md:block relative"
            >
              <div className="relative">
                <div
                  className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors z-10"
                  style={{ color: isSearchOpen ? mainColor : '#9ca3af' }}
                >
                  <SearchIcon className="w-4 h-4" />
                </div>
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Cari materi pembelajaran..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 h-10 w-64 rounded-3xl border-2 border-gray-200 focus:border-transparent text-sm font-medium transition-all"
                  style={{
                    boxShadow: isSearchOpen
                      ? `0 0 0 3px ${mainColor}20`
                      : undefined,
                  }}
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchOpen(false);
                    }}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-3xl hover:bg-gray-100 z-10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}

                {/* Search Results Dropdown */}
                {isSearchOpen && (
                  <div
                    className="absolute top-full mt-2 w-[500px] right-0 bg-white border-2 rounded-3xl shadow-2xl z-50 overflow-hidden"
                    style={{ borderColor: `${mainColor}40` }}
                  >
                    {/* Results Header */}
                    <div
                      className="px-4 py-2.5 border-b flex items-center justify-between"
                      style={{ backgroundColor: `${mainColor}08` }}
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles
                          className="w-4 h-4"
                          style={{ color: mainColor }}
                        />
                        <span className="text-sm font-bold text-gray-700">
                          {searchResults.length} hasil
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <kbd className="px-2 py-0.5 text-[10px] font-semibold bg-gray-100 border border-gray-200 rounded">
                          ↑↓
                        </kbd>
                        <span>navigasi</span>
                        <kbd className="px-2 py-0.5 text-[10px] font-semibold bg-gray-100 border border-gray-200 rounded">
                          Enter
                        </kbd>
                      </div>
                    </div>

                    {/* Results List */}
                    <div className="max-h-[400px] overflow-y-auto">
                      <div className="p-2">
                        {searchResults.map((result, index) => (
                          <div
                            key={result.id}
                            onClick={() => handleResultClick(result)}
                            className={`p-3 rounded-3xl transition-all mb-1 group cursor-pointer ${
                              index === selectedIndex
                                ? 'ring-2 ring-offset-1'
                                : 'hover:bg-gray-50'
                            }`}
                            style={{
                              backgroundColor:
                                index === selectedIndex
                                  ? `${mainColor}08`
                                  : undefined,
                              ...(index === selectedIndex
                                ? ({
                                    '--tw-ring-color': mainColor,
                                  } as React.CSSProperties)
                                : {}),
                            }}
                          >
                            <div className="flex items-start gap-3">
                              {/* Icon */}
                              <div
                                className="w-10 h-10 rounded-3xl flex items-center justify-center shrink-0"
                                style={{
                                  backgroundColor: `${mainColor}15`,
                                  color: mainColor,
                                }}
                              >
                                {getTypeIcon(result.type)}
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                                    {highlightMatch(result.title)}
                                  </h4>
                                  <Badge
                                    className={`text-[10px] px-1.5 py-0.5 shrink-0 ${getTypeColor(result.type)}`}
                                  >
                                    {result.type}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-600 line-clamp-1 mb-1.5">
                                  {highlightMatch(result.description)}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <span className="font-medium">
                                    {result.categoryName}
                                  </span>
                                  <span>•</span>
                                  <span>{result.chapterTitle}</span>
                                  {result.isCompleted && (
                                    <>
                                      <span>•</span>
                                      <span className="text-green-600 font-medium">
                                        ✓ Selesai
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Desktop Limitations Dropdown - Single Clean Button */}
          {!isMobile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="hidden md:flex items-center gap-2 h-10 px-3 rounded-3xl hover:bg-gray-50 border border-gray-200 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-3xl flex items-center justify-center"
                      style={{ backgroundColor: `${mainColor}15` }}
                    >
                      <Coins
                        className="w-4 h-4"
                        style={{ color: mainColor }}
                      />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-[10px] font-medium text-gray-500 leading-none">
                        Sisa Coin
                      </span>
                      <span className="text-sm font-bold text-gray-900 leading-tight">
                        {userTier === 'ADMIN'
                          ? '∞'
                          : `${limitations[0]?.remaining || 0}`}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-80 mt-2"
              >
                <div className="px-4 py-3 border-b">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900">
                      Sisa Penggunaan
                    </p>
                    {userTier && (
                      <Badge
                        className="text-white text-xs font-medium"
                        style={{ backgroundColor: mainColor }}
                      >
                        {userTier}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="p-3 space-y-2 max-h-[70vh] overflow-y-auto">
                  {limitations.map((limitation, index) => {
                    const Icon = limitation.icon;
                    const isLow =
                      limitation.remaining <= 3 && limitation.remaining > 0;
                    const isEmpty = limitation.remaining === 0;
                    const percentage =
                      userTier === 'ADMIN'
                        ? 100
                        : limitation.total > 0
                          ? ((limitation.total - limitation.remaining) /
                              limitation.total) *
                            100
                          : 0;

                    return (
                      <div
                        key={index}
                        className="p-3 rounded-3xl border bg-white hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-8 h-8 rounded-3xl flex items-center justify-center"
                              style={{
                                backgroundColor: `${limitation.color}15`,
                              }}
                            >
                              <Icon
                                className="w-4 h-4"
                                style={{ color: limitation.color }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {limitation.label}
                            </span>
                          </div>
                          {userTier === 'ADMIN' ? (
                            <span className="text-lg font-bold text-green-600">
                              ∞
                            </span>
                          ) : (
                            <span
                              className={cn(
                                'text-base font-bold',
                                isEmpty
                                  ? 'text-red-600'
                                  : isLow
                                    ? 'text-orange-600'
                                    : 'text-gray-900',
                              )}
                            >
                              {limitation.remaining}
                            </span>
                          )}
                        </div>
                        {userTier !== 'ADMIN' && (
                          <div className="space-y-1">
                            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={cn(
                                  'h-full rounded-full transition-all duration-300',
                                  isEmpty
                                    ? 'bg-red-500'
                                    : isLow
                                      ? 'bg-orange-500'
                                      : 'bg-green-500',
                                )}
                                style={{ width: `${100 - percentage}%` }}
                              />
                            </div>
                            <div className="flex justify-between items-center text-xs text-gray-500">
                              <span>0</span>
                              <span>{limitation.total}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {!userTier && (
                  <div className="p-3 pt-2 border-t">
                    <Button
                      className="w-full text-white h-9 text-sm font-medium"
                      style={{ backgroundColor: mainColor }}
                      onClick={() => {
                        setTransactionPopUp(true);
                      }}
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade ke Premium
                    </Button>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Status Badge - Premium Design */}
          <BadgeSubsInfo />

          {/* Notification Icon */}
          <Notification />

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2.5 h-10 px-2 pr-3 rounded-3xl hover:bg-gray-50 transition-all duration-200 shrink-0 border border-gray-100"
              >
                <Avatar className="w-7 h-7 ring-2 ring-offset-1 ring-gray-100">
                  <AvatarImage
                    src={userSession?.user.image || '/placeholder.svg'}
                    alt={userSession?.user.name || 'User'}
                  />
                  <AvatarFallback
                    className="text-white font-bold text-xs"
                    style={{ backgroundColor: mainColor }}
                  >
                    {userSession?.user.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                {!isMobile && (
                  <>
                    <span className="text-sm font-semibold text-gray-700 max-w-24 truncate">
                      {userSession?.user.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 mt-2"
            >
              <div className="px-3 py-2 border-b">
                <p className="text-sm font-medium">{userSession?.user.name}</p>
                <p className="text-xs text-gray-500">
                  {userSession?.user.email}
                </p>
              </div>

              {/* Mobile Limitations with Countdown Format */}
              {isMobile && (
                <>
                  <div className="px-3 py-2 space-y-2">
                    <Link
                      href={`/${website_sub_category_id_params}/user/subscription`}
                      className="md:hidden block"
                    >
                      <div
                        className="flex items-center gap-2.5 h-12 px-3 rounded-3xl border-2 transition-all duration-200"
                        style={{
                          borderColor: `${mainColor}30`,
                          backgroundColor: `${mainColor}05`
                        }}
                      >
                        <div
                          className="w-9 h-9 rounded-3xl flex items-center justify-center"
                          style={{ backgroundColor: `${mainColor}20` }}
                        >
                          <Crown
                            className="w-4.5 h-4.5"
                            style={{ color: mainColor }}
                          />
                        </div>
                        <div className="flex flex-col items-start flex-1">
                          <span className="text-[10px] font-semibold text-gray-600 leading-none uppercase tracking-wide">
                            Status
                          </span>
                          <span className="text-sm font-bold leading-tight" style={{ color: mainColor }}>
                            {userSession?.user.subsList && userSession.user.subsList.length > 0
                              ? `${userSession.user.subsList.length} Active`
                              : userTier || 'Free'}
                          </span>
                        </div>
                        <ChevronDown className="w-4 h-4" style={{ color: mainColor }} />
                      </div>
                    </Link>
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

              {(userSession?.user.role === 'ADMIN' ||
                userSession?.user.role === 'SUPER_ADMIN' ||
                userSession?.user.role === 'FINANCE') && (
                <Link href={`/${website_sub_category_id_params}/admin`}>
                  <DropdownMenuItem>
                    <LayoutDashboardIcon className="w-4 h-4 mr-2" />
                    Admin Panel
                  </DropdownMenuItem>
                </Link>
              )}
              <DropdownMenuItem
                onClick={() => {
                  // setOpenMenu(false);
                  setPagesSetting('account');
                }}
              >
                <User className="w-4 h-4 mr-2" />
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  // setOpenMenu(false);
                  setPagesSetting('account');
                }}
              >
                <Settings className="w-4 h-4 mr-2" />
                Pengaturan
              </DropdownMenuItem>
              {!userTier && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setTransactionPopUp(true)}>
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

      {/* Mobile Search - Interactive */}
      {isMobile && showMobileSearch && (
        <div className="border-t border-gray-200 p-3 bg-white">
          <div
            ref={searchRef}
            className="relative"
          >
            <div className="relative">
              <div
                className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors z-10"
                style={{ color: isSearchOpen ? mainColor : '#9ca3af' }}
              >
                <SearchIcon className="w-5 h-5" />
              </div>
              <Input
                ref={inputRef}
                type="text"
                placeholder="Cari materi, video, tryout, atau dokumen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="pl-12 pr-12 h-12 rounded-3xl border-2 border-gray-200 focus:border-transparent text-sm font-medium transition-all"
                style={{
                  boxShadow: isSearchOpen
                    ? `0 0 0 3px ${mainColor}20`
                    : undefined,
                }}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchOpen(false);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-3xl hover:bg-gray-100 z-10"
                >
                  <X className="w-5 h-5" />
                </Button>
              )}

              {/* Search Results Dropdown */}
              {isSearchOpen && (
                <div
                  className="absolute top-full mt-2 w-full left-0 bg-white border-2 rounded-3xl shadow-2xl z-50 overflow-hidden"
                  style={{ borderColor: `${mainColor}40` }}
                >
                  {/* Results Header */}
                  <div
                    className="px-4 py-2.5 border-b flex items-center justify-between"
                    style={{ backgroundColor: `${mainColor}08` }}
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles
                        className="w-4 h-4"
                        style={{ color: mainColor }}
                      />
                      <span className="text-sm font-bold text-gray-700">
                        {searchResults.length} hasil
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-gray-100 border border-gray-200 rounded">
                        ↑↓
                      </kbd>
                    </div>
                  </div>

                  {/* Results List */}
                  <div className="max-h-[60vh] overflow-y-auto">
                    <div className="p-2">
                      {searchResults.map((result, index) => (
                        <div
                          key={result.id}
                          onClick={() => {
                            handleResultClick(result);
                            setShowMobileSearch(false);
                          }}
                          className={`p-3 rounded-3xl transition-all mb-1.5 group cursor-pointer ${
                            index === selectedIndex
                              ? 'ring-2 ring-offset-1'
                              : 'active:bg-gray-100'
                          }`}
                          style={{
                            backgroundColor:
                              index === selectedIndex
                                ? `${mainColor}08`
                                : undefined,
                            ...(index === selectedIndex
                              ? ({
                                  '--tw-ring-color': mainColor,
                                } as React.CSSProperties)
                              : {}),
                          }}
                        >
                          <div className="flex items-start gap-3">
                            {/* Icon */}
                            <div
                              className="w-10 h-10 rounded-3xl flex items-center justify-center shrink-0"
                              style={{
                                backgroundColor: `${mainColor}15`,
                                color: mainColor,
                              }}
                            >
                              {getTypeIcon(result.type)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">
                                  {highlightMatch(result.title)}
                                </h4>
                                <Badge
                                  className={`text-[10px] px-1.5 py-0.5 shrink-0 ${getTypeColor(result.type)}`}
                                >
                                  {result.type}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-600 line-clamp-2 mb-1.5">
                                {highlightMatch(result.description)}
                              </p>
                              <div className="flex items-center gap-1.5 text-xs text-gray-500 flex-wrap">
                                <span className="font-medium">
                                  {result.categoryName}
                                </span>
                                <span>•</span>
                                <span className="line-clamp-1">
                                  {result.chapterTitle}
                                </span>
                                {result.isCompleted && (
                                  <>
                                    <span>•</span>
                                    <span className="text-green-600 font-medium">
                                      ✓ Selesai
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
