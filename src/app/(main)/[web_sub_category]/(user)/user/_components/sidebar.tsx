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
import {
  website_sub_category_id,
  website_sub_category_id_params,
} from '@/hooks/use-web-sub-category-id';
import { signOut } from '@/lib/auth-helper';
import { cn } from '@/lib/utils';
import {
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Coins,
  Crown,
  History,
  LayoutDashboardIcon,
  LogOut,
  Settings,
  Stars,
  User,
  Zap,
  ShoppingBag, // Added ShoppingBag
  Loader2, // Added loader
} from 'lucide-react';
import Link from 'next/link';
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
  const [isUpgrading, setIsUpgrading] = useState(false); // Added state
  const { websiteSubCategory, webCategoryData } = useWebsiteSubCategory();

  const [isWebCategoryDialogOpen, setIsWebCategoryDialogOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const pathname = usePathname();
  const {
    minimizeSidebar,
    setMinimizeSidebar,
    transactionPopUp,
    setTransactionPopUp,
    setSidebarMobile,
    setPagesSetting,
    pagesSetting,
  } = useAppContext();

  // Handle body overflow based on pop-ups
  useEffect(() => {
    if (transactionPopUp || pagesSetting) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [transactionPopUp, pagesSetting]);

  // Get dynamic colors from the selected category
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  return (
    <Fragment>
      <SidebarUI
        // variant="sidebar"
        variant="floating"
        collapsible={'icon'}
        className="hidden md:flex z-[50] rounded-2xl"
        style={
          {
            '--sidebar-width': '18rem',
            '--sidebar-width-icon': '4.5rem',
          } as React.CSSProperties
        }
        // onMouseOver={() => setMinimizeSidebar(false)}
        // onMouseLeave={() => setMinimizeSidebar(true)}
      >
        <SidebarHeader className="h-16 flex items-center justify-center pt-2 rounded-2xl">
          <div
            className={cn(
              'flex items-center justify-between gap-2 w-full px-2',
              minimizeSidebar && 'justify-center',
            )}
          >
            {!minimizeSidebar && (
              <Logo href={`/${website_sub_category_id}/user/bimboard`} />
            )}
            {/* <div
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
            </div> */}
            <button
              onClick={() => setMinimizeSidebar(!minimizeSidebar)}
              className="flex items-center justify-center h-9 w-9 rounded-2xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all active:scale-95"
            >
              {minimizeSidebar ? (
                <ChevronsRight className="w-5 h-5" />
              ) : (
                <ChevronsLeft className="w-5 h-5" />
              )}
            </button>
          </div>
        </SidebarHeader>

        <SidebarContent className="flex flex-col gap-0">
          {!minimizeSidebar && (
            <div className="px-3 pt-2 pb-1">
              <button
                className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-white border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all text-left group shadow-sm"
                onClick={() => setIsWebCategoryDialogOpen(true)}
              >
                <div className="flex items-center gap-3 w-full overflow-hidden">
                   <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-100"
                      style={{ backgroundColor: `${mainColor}10` }}
                   >
                     <Stars className="w-5 h-5" style={{ color: mainColor }} />
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-slate-800 truncate mb-0.5">
                        {websiteSubCategory?.name || 'Pilih Kategori'}
                      </p>
                      <p className="text-[10px] font-semibold text-slate-500 truncate">
                        {websiteSubCategory ? 'Platform Belajar' : 'Pilih tujuan belajar'}
                      </p>
                   </div>
                   <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                     <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
                   </div>
                </div>
              </button>
            </div>
          )}

          {/* Navigation Routes */}
          <div className="flex-1 px-2 pt-1 pb-4">
            <SidebarRoute
              category={category}
              minimizeSidebar={minimizeSidebar}
              setMinimizeSidebar={setMinimizeSidebar}
              categoryColors={{ mainColor, secondaryColor }}
            />
          </div>
        </SidebarContent>

        <SidebarFooter className="pt-2 pb-4">
          {/* Upgrade Button (Minimized) */}
          {!session?.user.tier && minimizeSidebar && (
            <div className="flex justify-center mb-3 px-2">
              <button
                onClick={() => {
                   setIsUpgrading(true);
                   router.push('/price');
                }}
                disabled={isUpgrading}
                className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-sm group relative disabled:opacity-70 disabled:cursor-not-allowed"
                title="Upgrade Plan"
              >
                {isUpgrading ? (
                   <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                   <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                )}
              </button>
            </div>
          )}

          {/* Upgrade Button (Expanded & Mobile) - Replaces Card */}
          {!session?.user.tier && !minimizeSidebar && (
            <div className="px-5 mb-3">
               <button
                  onClick={() => {
                    if (!isUpgrading) {
                      setIsUpgrading(true);
                      router.push('/price');
                    }
                  }}
                  disabled={isUpgrading}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-2xl text-sm font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all group disabled:opacity-70 disabled:cursor-not-allowed"
               >
                  {isUpgrading ? (
                     <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                     <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  )}
                  <span>Upgrade Plan</span>
               </button>
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
                  {(session?.user.role === 'ADMIN' ||
                    session?.user.role === 'SUPER_ADMIN' ||
                    session?.user.role === 'FINANCE') && (
                    <Link href={`/${website_sub_category_id_params}/admin`}>
                      <DropdownMenuItem>
                        <LayoutDashboardIcon className="w-4 h-4 mr-2" />
                        Admin Panel
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <DropdownMenuItem
                    onClick={() => {
                      setPagesSetting('account');
                    }}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setPagesSetting('installment');
                    }}
                  >
                    <Coins className="w-4 h-4 mr-2" />
                    Cicilan
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setPagesSetting('history');
                    }}
                  >
                    <History className="w-4 h-4 mr-2" />
                    Riwayat Pembelian
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
                    className="text-red-600"
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
              <Logo href={`/${website_sub_category_id}/user/bimboard`} />
            </div>

            {/* Mobile Category Selection */}
            {websiteSubCategory && (
            <div className="px-3 py-4">
              <button
                 className="w-full flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left group shadow-sm"
                 onClick={() => {
                   setIsWebCategoryDialogOpen(true);
                   setIsMobileSidebarOpen(false);
                 }}
              >
                 <div className="flex items-center gap-3 w-full overflow-hidden">
                    <div
                       className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                       style={{ backgroundColor: `${mainColor}15` }}
                    >
                      <Stars className="w-4 h-4" style={{ color: mainColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="text-sm font-bold text-slate-800 truncate">
                         {websiteSubCategory?.name || 'Pilih Kategori'}
                       </p>
                       <p className="text-[10px] text-slate-500 truncate">
                         {websiteSubCategory ? 'Platform Belajar' : 'Pilih tujuan belajar'}
                       </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
                 </div>
              </button>
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
               <div className="px-5 mb-4">
                  <button
                     onClick={() => {
                       setIsUpgrading(true);
                       router.push('/price');
                       setIsMobileSidebarOpen(false);
                     }}
                     disabled={isUpgrading}
                     className="w-full flex items-center gap-3 px-3 py-2 rounded-2xl text-sm font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all group disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                     {isUpgrading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                     ) : (
                        <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                     )}
                     <span>Upgrade Plan</span>
                  </button>
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
                      setIsMobileSidebarOpen(false);
                    }}
                    className="font-bold"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setPagesSetting('installment');
                      setIsMobileSidebarOpen(false);
                    }}
                  >
                    <Coins className="w-4 h-4 mr-2" />
                    Cicilan
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setPagesSetting('history');
                      setIsMobileSidebarOpen(false);
                    }}
                    className="font-bold"
                  >
                    <History className="w-4 h-4 mr-2" />
                    Riwayat Pembelian
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
