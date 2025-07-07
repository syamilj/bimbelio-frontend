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
  TooltipTrigger,
} from '@/components/ui/tooltip'; // Added TooltipProvider here
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { signOut } from '@/lib/auth-helper';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Crown,
  Heart,
  MessageSquare,
  PenTool,
  Settings,
  Stars,
  Trophy,
  User,
  X,
  Zap,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import type React from 'react';
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
      {/* TooltipProvider Wrapper */}
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full w-full flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100 border-r border-slate-200/60 shadow-2xl backdrop-blur-xl">
        {/* Enhanced Header with glassmorphism */}
        <div
          className={cn(
            'flex items-center p-4 border-b border-slate-200/50 transition-all duration-300 bg-white/80 backdrop-blur-xl',
            shouldMinimize ? 'justify-center px-2' : 'justify-between',
          )}
        >
          {!shouldMinimize ? (
            <>
              <div className="transition-all duration-300 ">
                <Logo href={`/${website_sub_category_id}/user/dashboard`} />
              </div>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-slate-500 hover:text-slate-700 hover:bg-white/80 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md border border-slate-200/50"
                      onClick={() => setMinimizeSidebar(true)}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    sideOffset={8}
                  >
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
                      'w-11 h-11 rounded-2xl flex items-center justify-center shadow-xl cursor-pointer hover:shadow-2xl transition-all duration-300  bg-gradient-to-br from-white to-slate-50 border border-slate-200/50',
                    )}
                    onClick={() => setMinimizeSidebar(false)}
                  >
                    <ChevronRight
                      className="w-5 h-5"
                      style={{ color: mainColor }}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  sideOffset={8}
                >
                  <p>Expand sidebar</p>
                </TooltipContent>
              </Tooltip>
            </>
          )}
        </div>
        {/* Enhanced Category Selection */}
        {!shouldMinimize && (
          <div className="p-4 border-b border-slate-200/50 bg-gradient-to-br from-white/60 to-slate-50/80 backdrop-blur-sm">
            <div
              className="relative overflow-hidden rounded-2xl p-5 text-white shadow-xl cursor-pointer transition-all duration-300 hover:shadow-2xl group border border-white/20"
              style={{
                background: `linear-gradient(135deg, ${mainColor} 0%, ${secondaryColor} 50%, ${mainColor} 100%)`,
              }}
              onClick={() => setIsWebCategoryDialogOpen(true)}
            >
              {/* Enhanced background patterns */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10" />
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse" />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/5 rounded-full blur-xl" />
              <div className="absolute top-4 right-4 w-16 h-16 bg-white/5 rounded-full blur-lg" />
              <div className="relative z-10">
                {/* <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/30 group- transition-transform duration-300">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold opacity-90 tracking-wide">
                        {websiteSubCategory?.name || 'KATEGORI'}
                      </span>
                    </div> */}
                <h3 className="font-bold text-lg mb-2 group- transition-transform duration-300">
                  {websiteSubCategory?.name || 'Pilih Kategori'}
                </h3>
                <p className="text-sm text-white/90 mb-4 leading-relaxed">
                  {websiteSubCategory
                    ? 'Persiapan terbaik untuk mencapai target impianmu'
                    : 'Pilih kategori sesuai dengan tujuan belajar kamu'}
                </p>
                <div className="flex items-center justify-between text-white/95 group-hover:text-white transition-colors duration-300">
                  <span className="text-sm font-semibold flex items-center gap-2">
                    <Stars className="w-4 h-4" />
                    Ganti Kategori
                  </span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Enhanced Minimized Quick Access */}
        {shouldMinimize && (
          <div className="p-3 border-b border-slate-200/50 bg-gradient-to-br from-white/60 to-slate-50/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="w-12 h-12 rounded-2xl text-white shadow-xl transition-all duration-300 p-0 hover:shadow-2xl  bg-gradient-to-br border border-white/20"
                    style={{
                      background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                    }}
                    onClick={() => setIsWebCategoryDialogOpen(true)}
                  >
                    <BookOpen className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  sideOffset={8}
                >
                  <div className="text-sm">
                    <p className="font-medium">
                      {websiteSubCategory?.name || 'Pilih Kategori'}
                    </p>
                    <p className="text-xs text-slate-500">
                      Ganti kategori belajar
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        )}
        {/* Enhanced Sidebar Routes */}
        <div className="flex-1 overflow-y-auto py-4 bg-gradient-to-b from-white/40 to-slate-50/60 backdrop-blur-sm">
          <SidebarRoute
            category={category}
            minimizeSidebar={shouldMinimize}
            setMinimizeSidebar={setMinimizeSidebar}
            categoryColors={{ mainColor, secondaryColor }}
          />
        </div>
        {/* Enhanced Footer */}
        <div className="border-t border-slate-200/50 p-4 space-y-1 flex-shrink-0 bg-gradient-to-br from-white/80 to-slate-50/90 backdrop-blur-xl">
          {/* Enhanced Premium Card */}
          {!session?.user.tier && !shouldMinimize && (
            <div
              className="relative overflow-hidden rounded-2xl p-4 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group border border-white/20 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${mainColor} 0%, ${secondaryColor} 100%)`,
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setTransactionPopUp(true);
              }}
            >
              {/* Premium background effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10" />
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse" />
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/5 rounded-full blur-xl" />
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg group- transition-transform duration-300">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm text-white/95 leading-relaxed">
                    Unlock fitur premium!
                  </p>
                </div>
                <Button
                  className="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-bold text-sm rounded-xl backdrop-blur-md transition-all duration-300  shadow-lg"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setTransactionPopUp(true);
                  }}
                >
                  <Stars className="w-4 h-4 mr-2" />
                  Upgrade Sekarang
                </Button>
              </div>
            </div>
          )}
          {/* Enhanced User Profile */}
          <div
            className={cn(
              'flex items-center gap-3 p-3 rounded-2xl hover:bg-white/80 transition-all duration-300 shadow-sm hover:shadow-md border border-slate-200/50 bg-white/60 backdrop-blur-sm overflow-hidden',
              shouldMinimize ? 'justify-center' : 'justify-between',
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={cn(
                shouldMinimize
                  ? 'flex items-center justify-center w-10 h-10'
                  : 'flex items-center gap-3 flex-1 min-w-0',
              )}
            >
              {shouldMinimize ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative group w-8 h-8 flex items-center justify-center bg-white/90 rounded-2xl shadow-lg">
                      <Avatar className="w-8 h-8 ring-2 ring-white border-2 border-slate-200/50 shadow-md overflow-hidden">
                        <AvatarImage
                          src={userImage || '/placeholder.svg'}
                          alt={session?.user.name || 'User'}
                          className="object-cover w-full h-full rounded-full"
                        />
                        <AvatarFallback
                          className="text-white font-bold bg-gradient-to-br"
                          style={{
                            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                          }}
                        >
                          {session?.user.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm animate-pulse" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    sideOffset={8}
                  >
                    <div className="text-sm">
                      <p className="font-medium">
                        {session?.user.name || 'User'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {session?.user.tier || 'Free User'}
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <>
                  <div className="relative">
                    <Avatar className="w-10 h-10 ring-2 ring-white shadow-xl border-2 border-slate-200/50 transition-all duration-300 overflow-hidden">
                      <AvatarImage
                        src={userImage || '/placeholder.svg'}
                        alt={session?.user.name || 'User'}
                        className="rounded-full object-cover"
                      />
                      <AvatarFallback
                        className="text-white font-bold bg-gradient-to-br"
                        style={{
                          background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                        }}
                      >
                        {session?.user.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm animate-pulse" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {session?.user.name || 'User'}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-slate-500">
                        {session?.user.tier || 'Free User'}
                      </p>
                      {session?.user.tier === 'PREMIUM' && (
                        <Crown className="w-3 h-3 text-yellow-500" />
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            {/* Dropdown hanya muncul kalau sidebar tidak minimize */}
            {!shouldMinimize && (
              <DropdownMenu
                open={openMenu}
                onOpenChange={setOpenMenu}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-9 h-9 rounded-xl hover:bg-white/80 flex-shrink-0 shadow-sm transition-all duration-300 hover:shadow-md border border-slate-200/50"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="right"
                  align="end"
                  className="w-64 bg-white/95 backdrop-blur-xl border border-slate-200/50 shadow-2xl"
                >
                  {session?.user.role === 'ADMIN' && (
                    <>
                      <DropdownMenuItem
                        className="focus:bg-slate-50 rounded-lg m-1"
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
                    className="focus:bg-slate-50 rounded-lg m-1"
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
                    className="focus:bg-slate-50 rounded-lg m-1"
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
                    className="text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600 rounded-lg m-1"
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
      {/* Enhanced Mobile Sidebar */}
      <div className="md:hidden h-full w-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100 shadow-2xl backdrop-blur-xl">
        {/* Enhanced Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200/50 flex-shrink-0 bg-white/80 backdrop-blur-xl">
          <div className="transition-all duration-300 ">
            <Logo href={`/${website_sub_category_id}/user/dashboard`} />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-xl hover:bg-white shadow-sm border border-slate-200/50 transition-all duration-300"
            onClick={() => setSidebarMobile(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        {/* Enhanced Mobile User Profile Section */}
        <div className="p-4 border-b border-slate-200/50 flex-shrink-0 bg-gradient-to-br from-white/60 to-slate-50/80 backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-5">
            <div className="relative">
              <Avatar
                className="w-14 h-14 ring-4 ring-offset-2 shadow-xl border-2 border-slate-200/50"
                style={{ '--tw-ring-color': mainColor } as React.CSSProperties}
              >
                <AvatarImage
                  src={userImage || '/placeholder.svg'}
                  alt={session?.user.name || 'User'}
                />
                <AvatarFallback
                  className="text-white font-bold bg-gradient-to-br"
                  style={{
                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                  }}
                >
                  {session?.user.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-sm animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className="font-bold text-xl truncate"
                style={{ color: mainColor }}
              >
                {session?.user.name || 'User'}
              </h3>
              <div className="flex items-center gap-2">
                <p className="text-sm text-slate-500">
                  {session?.user.tier || 'Free User'}
                </p>
                {session?.user.tier === 'PREMIUM' && (
                  <Crown className="w-4 h-4 text-yellow-500" />
                )}
                <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              </div>
            </div>
          </div>
          {/* Enhanced Mobile Category Card */}
          <div
            className="relative overflow-hidden rounded-2xl p-5 text-white shadow-xl cursor-pointer transition-all duration-300 hover:shadow-2xl border border-white/20 group"
            style={{
              background: `linear-gradient(135deg, ${mainColor} 0%, ${secondaryColor} 50%, ${mainColor} 100%)`,
            }}
            onClick={() => {
              setIsWebCategoryDialogOpen(true);
              setSidebarMobile(false);
            }}
          >
            {/* Enhanced background patterns */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10" />
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/5 rounded-full blur-xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/30">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold">
                  {websiteSubCategory?.name || 'Pilih Kategori'}
                </span>
              </div>
              <p className="text-sm text-white/95 mb-4">
                Ganti kategori belajar sesuai dengan kebutuhan dan target kamu
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold flex items-center gap-2">
                  <Stars className="w-4 h-4" />
                  Ubah Kategori
                </span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </div>
        {/* Enhanced Mobile Navigation */}
        <div className="flex-1 overflow-y-auto py-4 bg-gradient-to-b from-white/40 to-slate-50/60 backdrop-blur-sm">
          <SidebarRoute
            category={category}
            minimizeSidebar={false}
            setMinimizeSidebar={setMinimizeSidebar}
            categoryColors={{ mainColor, secondaryColor }}
          />
        </div>
        {/* Enhanced Mobile Footer */}
        <div className="border-t border-slate-200/50 p-4 flex-shrink-0 bg-gradient-to-br from-white/80 to-slate-50/90 backdrop-blur-xl">
          {!session?.user.tier && (
            <div
              className="mb-4 relative overflow-hidden rounded-2xl p-5 text-white shadow-xl transition-all duration-300 border border-white/20 group cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${mainColor} 0%, ${secondaryColor} 100%)`,
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSidebarMobile(false);
                setTransactionPopUp(true);
              }}
            >
              {/* Enhanced background effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10" />
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse" />
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/5 rounded-full blur-xl" />
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-bold">Upgrade Premium</span>
                  <Zap className="w-4 h-4 text-yellow-300 animate-pulse" />
                </div>
                <p className="text-sm text-white/95 mb-4">
                  Dapatkan akses unlimited ke semua fitur pembelajaran premium
                </p>
                <Button
                  className="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-bold text-sm backdrop-blur-md transition-all duration-300 rounded-xl shadow-lg"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSidebarMobile(false);
                    setTransactionPopUp(true);
                  }}
                >
                  <Stars className="w-4 h-4 mr-2" />
                  Upgrade Sekarang
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Enhanced Web Category Dialog */}
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
    </Fragment>
  );
};

export default Sidebar;
