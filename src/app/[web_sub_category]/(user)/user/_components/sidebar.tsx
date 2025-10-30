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
import { Sheet, SheetContent } from '@/components/ui/sheet';
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  Sidebar as SidebarUI,
} from '@/components/ui/sidebar';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { signOut } from '@/lib/auth-helper';
import { cn } from '@/lib/utils';
import {
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Crown,
  LogOut,
  MessageSquare,
  PenTool,
  Settings,
  Stars,
  Trophy,
  User,
  Zap,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react';
import SidebarRoute from './sidebar-route';

// Main Sidebar Component
const SidebarUser = ({
  category,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
}: {
  category: any;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: Dispatch<SetStateAction<boolean>>;
}) => {
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
    const isAdmin =
      session?.user.role === 'ADMIN' || session?.user.role === 'SUPER_ADMIN';
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
      <SidebarUI
        // variant="sidebar"
        variant="floating"
        collapsible={'icon'}
        className="hidden md:flex z-[50]"
        style={
          {
            '--sidebar-width': '16rem',
            '--sidebar-width-icon': '5rem',
          } as React.CSSProperties
        }
      >
        <SidebarHeader className="border-b-2 border-slate-200/50 bg-white/80 backdrop-blur-xl h-20 flex items-center rounded-2xl">
          <div
            className={cn(
              'flex items-center justify-between gap-2 w-full px-2',
              minimizeSidebar && 'justify-center',
            )}
          >
            {!minimizeSidebar && (
              <Logo href={`/${website_sub_category_id}/user/dashboard`} />
            )}
            <div
              onClick={() => setMinimizeSidebar(!minimizeSidebar)}
              className={cn(
                'h-12 w-12 rounded-2xl transition-all duration-300 ease-in-out',
                'bg-gradient-to-br from-blue-50 to-blue-100',
                'border-2 border-blue-400 hover:border-blue-500',
                'text-blue-600 hover:text-blue-700',
                'shadow-sm hover:shadow-md',
                'flex items-center justify-center',
                'hover:bg-gradient-to-br hover:from-blue-100 hover:to-blue-200',
                'active:scale-95',
                'group cursor-pointer',
              )}
            >
              <div className="relative w-6 h-6 flex items-center justify-center">
                {minimizeSidebar ? (
                  <ChevronsRight className="w-6 h-6 transition-all duration-300 group-hover:translate-x-0.5 text-blue-600 group-hover:text-blue-700" />
                ) : (
                  <ChevronsLeft className="w-6 h-6 transition-all duration-300 group-hover:-translate-x-0.5 text-blue-600 group-hover:text-blue-700" />
                )}
              </div>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="flex flex-col gap-0">
          {!minimizeSidebar && (
            <div className="p-4 border-b-2 border-slate-200/50 bg-linear-to-br from-white/60 to-slate-50/80 backdrop-blur-sm">
              <div
                className="relative overflow-hidden rounded-2xl p-5 text-white shadow-sm cursor-pointer hover:shadow-md group border-2 border-white/20"
                style={{
                  background: `linear-gradient(135deg, ${mainColor} 0%, ${secondaryColor} 50%, ${mainColor} 100%)`,
                }}
                onClick={() => setIsWebCategoryDialogOpen(true)}
              >
                <div className="relative z-10">
                  <h3 className="font-black text-lg mb-2 group-hover:scale-[1.01] transition-transform">
                    {websiteSubCategory?.name || 'Pilih Kategori'}
                  </h3>
                  <p className="text-sm text-white/90 mb-4 leading-relaxed font-medium">
                    {websiteSubCategory
                      ? 'Persiapan terbaik untuk mencapai target impianmu'
                      : 'Pilih kategori sesuai dengan tujuan belajar kamu'}
                  </p>
                  <div className="flex items-center justify-between text-white/95 group-hover:text-white transition-colors">
                    <span className="text-sm font-bold flex items-center gap-2">
                      <Stars className="w-4 h-4" />
                      Ganti Kategori
                    </span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Routes */}
          <div className="flex-1 px-2 py-4">
            <SidebarRoute
              category={category}
              minimizeSidebar={minimizeSidebar}
              setMinimizeSidebar={setMinimizeSidebar}
              categoryColors={{ mainColor, secondaryColor }}
            />
          </div>
        </SidebarContent>

        <SidebarFooter className="border-t-2 border-slate-200/50 bg-white/80 backdrop-blur-xl rounded-2xl">
          {/* Premium Card */}
          {!session?.user.tier && !minimizeSidebar && (
            <div
              className="p-4 rounded-2xl text-white shadow-sm cursor-pointer hover:shadow-md mb-4 border-2 border-white/20"
              style={{
                backgroundImage: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
              onClick={() => setTransactionPopUp(true)}
            >
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-yellow-300" />
                <span className="font-black text-sm">Upgrade Premium</span>
              </div>
              <p className="text-xs text-white/90 mb-3 font-medium">
                Dapatkan akses unlimited ke semua fitur
              </p>
              <Button
                size="sm"
                className="w-full bg-white/20 hover:bg-white/30 text-white border-2 border-white/30 text-xs font-bold rounded-xl shadow-sm hover:shadow-md"
              >
                Upgrade Sekarang
              </Button>
            </div>
          )}

          {/* User Profile */}
          <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-100 transition-colors">
            <Avatar
              className="h-10 w-10 border-2"
              style={{ borderColor: mainColor }}
            >
              <AvatarImage
                src={userImage || '/placeholder.svg'}
                alt={session?.user.name || 'User'}
              />
              <AvatarFallback
                className="text-white font-black"
                style={{ backgroundColor: mainColor }}
              >
                {session?.user.name ? session?.user.name[0].toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-gray-900 truncate">
                {session?.user.name}
              </p>
              <p className="text-xs text-gray-500 truncate font-medium">
                {session?.user.email}
              </p>
            </div>
            {!minimizeSidebar && (
              <DropdownMenu
                open={openMenu}
                onOpenChange={setOpenMenu}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-2xl"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 border-2 border-gray-100 rounded-2xl shadow-sm"
                >
                  <DropdownMenuItem
                    onClick={() => {
                      setPagesSetting('account');
                      setTransactionHistory(true);
                    }}
                    className="font-bold"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setPagesSetting('account');
                      setTransactionHistory(true);
                    }}
                    className="font-bold"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Pengaturan
                  </DropdownMenuItem>
                  {!session?.user.tier && (
                    <>
                      <DropdownMenuSeparator className="bg-gray-100" />
                      <DropdownMenuItem
                        onClick={() => setTransactionPopUp(true)}
                        className="font-bold"
                      >
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator className="bg-gray-100" />
                  <DropdownMenuItem
                    className="text-red-600 font-bold"
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </SidebarFooter>
        <SidebarRail />
      </SidebarUI>

      {/* Mobile Sidebar - Using Sheet */}
      <Sheet
        open={isMobileSidebarOpen}
        onOpenChange={setIsMobileSidebarOpen}
      >
        {/* <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-40 bg-white/80 backdrop-blur-xl border border-slate-200/50 hover:bg-white"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger> */}
        <SheetContent
          side="left"
          className="w-80 bg-white backdrop-blur-xl border-r border-slate-200/60"
        >
          <div className="flex flex-col h-full gap-0">
            {/* Mobile Header */}
            <div className="pb-4 border-b-2 border-slate-200/50">
              <Logo href={`/${website_sub_category_id}/user/dashboard`} />
            </div>

            {/* Mobile Category Selection */}
            {websiteSubCategory && (
              <div
                className="p-4 m-2 rounded-2xl border-2 border-slate-200/50 bg-gradient-to-br cursor-pointer hover:shadow-md shadow-sm"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${mainColor}15, ${secondaryColor}10)`,
                  borderColor: `${mainColor}30`,
                }}
                onClick={() => {
                  setIsWebCategoryDialogOpen(true);
                  setIsMobileSidebarOpen(false);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-black text-gray-900 mb-1">
                      {websiteSubCategory?.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      Klik untuk ganti kategori
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            )}

            {/* Mobile Navigation Routes */}
            <div className="flex-1 px-2 py-4 overflow-y-auto">
              <SidebarRoute
                category={category}
                minimizeSidebar={false}
                setMinimizeSidebar={setMinimizeSidebar}
                categoryColors={{ mainColor, secondaryColor }}
              />
            </div>

            {/* Mobile Premium Card */}
            {!session?.user.tier && (
              <div
                className="p-4 rounded-2xl text-white shadow-sm mb-4 mx-2 border-2 border-white/20"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                }}
                onClick={() => {
                  setTransactionPopUp(true);
                  setIsMobileSidebarOpen(false);
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-yellow-300" />
                  <span className="font-black text-sm">Upgrade Premium</span>
                </div>
                <p className="text-xs text-white/90 mb-3 font-medium">
                  Dapatkan akses unlimited ke semua fitur
                </p>
                <Button
                  size="sm"
                  className="w-full bg-white/20 hover:bg-white/30 text-white border-2 border-white/30 text-xs font-bold rounded-xl"
                >
                  Upgrade Sekarang
                </Button>
              </div>
            )}

            {/* Mobile User Profile */}
            <div className="border-t-2 border-slate-200/50 p-4">
              <div className="flex items-center gap-3 mb-4">
                <Avatar
                  className="h-10 w-10 border-2"
                  style={{ borderColor: mainColor }}
                >
                  <AvatarImage
                    src={userImage || '/placeholder.svg'}
                    alt={session?.user.name || 'User'}
                  />
                  <AvatarFallback
                    className="text-white font-black"
                    style={{ backgroundColor: mainColor }}
                  >
                    {session?.user.name
                      ? session?.user.name[0].toUpperCase()
                      : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-gray-900 truncate">
                    {session?.user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate font-medium">
                    {session?.user.email}
                  </p>
                </div>
              </div>
              <DropdownMenu
                open={openMenu}
                onOpenChange={setOpenMenu}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start font-bold rounded-2xl border-2"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Menu
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-full border-2 border-gray-100 rounded-2xl shadow-sm"
                >
                  <DropdownMenuItem
                    onClick={() => {
                      setPagesSetting('account');
                      setTransactionHistory(true);
                      setIsMobileSidebarOpen(false);
                    }}
                    className="font-bold"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setPagesSetting('account');
                      setTransactionHistory(true);
                      setIsMobileSidebarOpen(false);
                    }}
                    className="font-bold"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Pengaturan
                  </DropdownMenuItem>
                  {!session?.user.tier && (
                    <>
                      <DropdownMenuSeparator className="bg-gray-100" />
                      <DropdownMenuItem
                        onClick={() => {
                          setTransactionPopUp(true);
                          setIsMobileSidebarOpen(false);
                        }}
                        className="font-bold"
                      >
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator className="bg-gray-100" />
                  <DropdownMenuItem
                    className="text-red-600 font-bold"
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </SheetContent>
      </Sheet>
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

export default SidebarUser;
