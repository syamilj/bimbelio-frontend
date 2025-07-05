'use client';
import { useAppContext } from '@/components/provider/provider-app';
import { useUserLimitation } from '@/components/provider/provider-limitation';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DialogWebCategory } from '@/components/ui/choose-web-category/dialog-web-category';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Logo from '@/components/ui/logo';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { signOut } from '@/lib/auth-helper';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Crown,
  MessageSquare,
  PenTool,
  Settings,
  Trophy,
  User,
  X,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import SidebarRoute from './sidebar-route';

// Main Sidebar Component
const Sidebar = ({ category }: { category: any }) => {
  const { data: session } = useSession();
  const { userLimitation } = useUserLimitation();
  const userImage = session?.user.image || null;
  const router = useRouter();
  const { websiteSubCategory, webCategoryData } = useWebsiteSubCategory();
  const [isWebCategoryDialogOpen, setIsWebCategoryDialogOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const pathname = usePathname();

  const {
    minimizeSidebar,
    setMinimizeSidebar,
    transactionPopUp,
    setTransactionPopUp,
    transactionHistory,
    setTransactionHistory,
    setSidebarMobile,
    setPagesSetting,
  } = useAppContext();

  // Use minimizeSidebar state consistently
  const shouldMinimize = minimizeSidebar;

  // Handle body overflow based on pop-ups
  useEffect(() => {
    if (transactionPopUp || transactionHistory) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [transactionPopUp, transactionHistory]);

  // Get dynamic colors from the selected category
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  // Limitation countdown format helper
  const getLimitationStats = () => {
    const isAdmin = session?.user.role === 'ADMIN';
    if (isAdmin) return null;

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
        icon: PenTool,
        label: 'Vision',
        remaining: Math.max(
          0,
          (userLimitation?.visionLimit || 0) - (userLimitation?.vision || 0),
        ),
        total: userLimitation?.visionLimit || 0,
        color: '#06b6d4',
      },
      {
        icon: PenTool,
        label: 'Notes',
        remaining: Math.max(
          0,
          (userLimitation?.notesLimit || 0) - (userLimitation?.notes || 0),
        ),
        total: userLimitation?.notesLimit || 0,
        color: '#f59e0b',
      },
      {
        icon: Trophy,
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

    return limitations.filter((item) => item.total > 0);
  };

  const limitationStats = getLimitationStats();

  return (
    <Fragment>
      <TooltipProvider>
        {/* Desktop Sidebar */}
        <div className="hidden md:flex h-full w-full flex-col bg-white border-r border-gray-200 shadow-lg">
          {/* Header */}
          <div
            className={cn(
              'flex items-center p-4 border-b border-gray-200 transition-all duration-300 bg-gray-50/80',
              shouldMinimize ? 'justify-center px-2' : 'justify-between',
            )}
          >
            {!shouldMinimize ? (
              <>
                <Logo href={`/${website_sub_category_id}/user/dashboard`} />
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-all duration-200 shadow-sm"
                        onClick={() => setMinimizeSidebar(true)}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Minimize sidebar</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </>
            ) : (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200',
                      )}
                      style={{ backgroundColor: mainColor }}
                      onClick={() => setMinimizeSidebar(false)}
                    >
                      <ChevronRight className="w-5 h-5 text-white" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Expand sidebar</p>
                  </TooltipContent>
                </Tooltip>
              </>
            )}
          </div>

          {/* Category Selection - Always shown when expanded */}
          {!shouldMinimize && (
            <div className="p-4 border-b border-gray-200 bg-gradient-to-br from-gray-50 to-white">
              <div
                className="relative overflow-hidden rounded-xl p-4 text-white shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                }}
                onClick={() => setIsWebCategoryDialogOpen(true)}
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <BookOpen className="w-3 h-3" />
                    </div>
                    <span className="text-xs font-medium opacity-90">
                      {websiteSubCategory?.name || 'KATEGORI'}
                    </span>
                  </div>
                  <h3 className="font-bold text-base mb-1">
                    {websiteSubCategory?.name || 'Pilih Kategori'}
                  </h3>
                  <p className="text-xs text-white/80 mb-3 leading-relaxed">
                    {websiteSubCategory
                      ? 'Persiapan lengkap untuk target terbaikmu'
                      : 'Pilih kategori sesuai tujuan belajar'}
                  </p>
                  <div className="flex items-center justify-between text-white/90">
                    <span className="text-sm font-medium">Ganti Kategori</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
                {/* Enhanced decorative elements */}
                <div className="absolute -right-6 -top-6 w-20 h-20 bg-white/10 rounded-full blur-sm" />
                <div className="absolute -right-10 -bottom-10 w-24 h-24 bg-white/5 rounded-full blur-sm" />
                <div className="absolute right-2 top-2 w-12 h-12 bg-white/5 rounded-full blur-md" />
              </div>
            </div>
          )}

          {/* Minimized Quick Access */}
          {shouldMinimize && (
            <div className="p-2 border-b border-gray-200 bg-gradient-to-br from-gray-50 to-white">
              <div className="flex flex-col items-center gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="w-10 h-10 rounded-xl text-white shadow-lg transition-all duration-300 p-0 hover:shadow-xl hover:scale-105"
                      style={{ backgroundColor: mainColor }}
                      onClick={() => setIsWebCategoryDialogOpen(true)}
                    >
                      <BookOpen className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{websiteSubCategory?.name || 'Pilih Kategori'}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          )}

          {/* Sidebar Routes */}
          <div className="flex-1 overflow-y-auto py-4 bg-gradient-to-b from-white to-gray-50/50">
            <SidebarRoute
              category={category}
              minimizeSidebar={shouldMinimize}
              setMinimizeSidebar={setMinimizeSidebar}
              categoryColors={{ mainColor, secondaryColor }}
            />
          </div>

          {/* Footer - Enhanced styling */}
          <div className="border-t border-gray-200 p-4 space-y-3 flex-shrink-0 bg-gradient-to-br from-gray-50 to-white">
            {/* Upgrade Premium - Enhanced styling */}
            {!session?.user.tier && !shouldMinimize && (
              <div
                className="relative overflow-hidden rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ backgroundColor: mainColor }}
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-4 h-4" />
                    <span className="text-sm font-bold">Premium</span>
                  </div>
                  <p className="text-xs text-white/90 mb-3 leading-relaxed">
                    Unlock fitur terlengkap untuk pembelajaran optimal
                  </p>
                  <Button
                    className="w-full bg-white/20 hover:bg-white/30 border border-white/20 text-white font-semibold text-sm rounded-lg backdrop-blur-sm transition-all duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setTransactionPopUp(true);
                    }}
                  >
                    Upgrade Sekarang
                  </Button>
                </div>
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full blur-sm" />
                <div className="absolute -right-8 -bottom-8 w-20 h-20 bg-white/5 rounded-full blur-md" />
              </div>
            )}

            {/* User Profile */}
            <div
              className={cn(
                'flex items-center gap-3 p-2 rounded-xl hover:bg-white/60 transition-all duration-200 shadow-sm',
                shouldMinimize ? 'justify-center' : 'justify-between',
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {shouldMinimize ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar className="w-8 h-8 ring-2 ring-white shadow-md cursor-pointer">
                        <AvatarImage
                          src={userImage || '/placeholder.svg'}
                          alt={session?.user.name || 'User'}
                        />
                        <AvatarFallback
                          className="text-white font-bold"
                          style={{ backgroundColor: mainColor }}
                        >
                          {session?.user.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <div className="text-sm">
                        <p className="font-medium">
                          {session?.user.name || 'User'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {session?.user.tier || 'Free User'}
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <>
                    <Avatar className="w-8 h-8 ring-2 ring-white shadow-md">
                      <AvatarImage
                        src={userImage || '/placeholder.svg'}
                        alt={session?.user.name || 'User'}
                      />
                      <AvatarFallback
                        className="text-white font-bold"
                        style={{ backgroundColor: mainColor }}
                      >
                        {session?.user.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {session?.user.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {session?.user.tier || 'Free User'}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {!shouldMinimize && (
                <DropdownMenu
                  open={openMenu}
                  onOpenChange={setOpenMenu}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 rounded-lg hover:bg-white/80 flex-shrink-0 shadow-sm transition-all duration-200"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="right"
                    align="end"
                    className="w-56"
                  >
                    {session?.user.role === 'ADMIN' && (
                      <>
                        <DropdownMenuItem
                          onClick={() => {
                            setOpenMenu(false);
                            router.push(`/${website_sub_category_id}/admin`);
                          }}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Admin Panel
                        </DropdownMenuItem>
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
                      <User className="h-4 w-4 mr-2" />
                      Profil
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setOpenMenu(false);
                        setPagesSetting('account');
                        setTransactionHistory(true);
                      }}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Pengaturan
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600"
                      onClick={() => {
                        setOpenMenu(false);
                        signOut({ callbackUrl: '/' });
                      }}
                    >
                      <span className="bx bx-log-out text-[16px] mr-2" />
                      Keluar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Sidebar - Enhanced styling */}
        <div className="md:hidden h-full w-full flex flex-col bg-white shadow-xl">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0 bg-gray-50/80">
            <Logo href={`/${website_sub_category_id}/user/dashboard`} />
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9 rounded-xl hover:bg-white shadow-sm"
              onClick={() => setSidebarMobile(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Mobile User Profile Section */}
          <div className="p-4 border-b border-gray-200 flex-shrink-0 bg-gradient-to-br from-gray-50 to-white">
            <div className="flex items-center gap-3 mb-4">
              <Avatar
                className="w-12 h-12 ring-2 ring-offset-2 shadow-lg"
                style={{ '--tw-ring-color': mainColor } as React.CSSProperties}
              >
                <AvatarImage
                  src={userImage || '/placeholder.svg'}
                  alt={session?.user.name || 'User'}
                />
                <AvatarFallback
                  className="text-white font-bold"
                  style={{ backgroundColor: mainColor }}
                >
                  {session?.user.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3
                  className="font-bold text-lg truncate"
                  style={{ color: mainColor }}
                >
                  {session?.user.name || 'User'}
                </h3>
                <p className="text-sm text-gray-500">
                  {session?.user.tier || 'Free User'}
                </p>
              </div>
            </div>

            {/* Mobile Category Card */}
            <div
              className="relative overflow-hidden rounded-xl p-4 text-white shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
              onClick={() => {
                setIsWebCategoryDialogOpen(true);
                setSidebarMobile(false);
              }}
            >
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {websiteSubCategory?.name || 'Pilih Kategori'}
                  </span>
                </div>
                <p className="text-xs text-white/90 mb-3">
                  Ganti kategori belajar sesuai kebutuhanmu
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Ubah Kategori</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full blur-sm" />
              <div className="absolute -right-8 -bottom-8 w-20 h-20 bg-white/5 rounded-full blur-md" />
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex-1 overflow-y-auto py-4 bg-gradient-to-b from-white to-gray-50/50">
            <SidebarRoute
              category={category}
              minimizeSidebar={false}
              setMinimizeSidebar={setMinimizeSidebar}
              categoryColors={{ mainColor, secondaryColor }}
            />
          </div>

          {/* Mobile Footer */}
          <div className="border-t border-gray-200 p-4 flex-shrink-0 bg-gradient-to-br from-gray-50 to-white">
            {!session?.user.tier && (
              <div
                className="mb-4 relative overflow-hidden rounded-xl p-4 text-white shadow-lg transition-all duration-300"
                style={{ backgroundColor: mainColor }}
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-4 h-4" />
                    <span className="text-sm font-bold">Upgrade Premium</span>
                  </div>
                  <p className="text-xs text-white/90 mb-3">
                    Dapatkan akses unlimited ke semua fitur
                  </p>
                  <Button
                    className="w-full bg-white/20 hover:bg-white/30 border border-white/20 text-white font-semibold text-sm backdrop-blur-sm transition-all duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSidebarMobile(false);
                      setTransactionPopUp(true);
                    }}
                  >
                    Upgrade Sekarang
                  </Button>
                </div>
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full blur-sm" />
                <div className="absolute -right-8 -bottom-8 w-20 h-20 bg-white/5 rounded-full blur-md" />
              </div>
            )}
          </div>
        </div>

        {/* Web Category Dialog */}
        <DialogWebCategory
          items={webCategoryData}
          value={websiteSubCategory?.id}
          isOpen={isWebCategoryDialogOpen}
          onOpenChange={setIsWebCategoryDialogOpen}
          onSelect={(item) => {
            localStorage.setItem('website_sub_category_id', item?.id);
            const pathname = window.location.pathname;
            const pathnameArray = pathname.split('/');
            let newPathname = '';
            pathnameArray.forEach((pItem, index) => {
              if (index > 1) {
                newPathname += `/${pItem}`;
              }
            });
            window.location.pathname = `/${item.id}${newPathname}`;
            setIsWebCategoryDialogOpen(false);
          }}
        />
      </TooltipProvider>
    </Fragment>
  );
};

export default Sidebar;
