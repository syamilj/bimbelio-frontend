'use client';
import { useAppContext } from '@/components/provider/provider-app';
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
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { signOut } from '@/lib/auth-helper';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  ChevronRight,
  Crown,
  PanelLeft,
  Settings,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import SidebarRoute from './sidebar-route';

// Main Sidebar Component
const Sidebar = ({ category }: { category: any }) => {
  const { data: session } = useSession();
  const userImage = session?.user.image || null;
  const router = useRouter();
  const { websiteSubCategory, webCategoryData } = useWebsiteSubCategory();
  const [isWebCategoryDialogOpen, setIsWebCategoryDialogOpen] = useState(false);

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

  const [openMenu, setOpenMenu] = useState<boolean>(false);

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

  return (
    <Fragment>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          'relative hidden h-full flex-col bg-background shadow-xl transition-all duration-300 ease-in-out md:flex border-r border-gray-200 dark:border-gray-800',
          minimizeSidebar ? 'w-[4.5rem]' : 'w-[18rem]',
        )}
      >
        {/* Header */}
        <div
          className={cn(
            'flex items-center p-4 transition-all duration-300 ease-in-out border-b border-gray-200 dark:border-gray-800',
            minimizeSidebar ? 'justify-center px-2' : 'justify-between',
          )}
        >
          {!minimizeSidebar ? (
            <>
              <Logo href={`/${website_sub_category_id}/user/dashboard`} />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                onClick={() => setMinimizeSidebar(true)}
              >
                <PanelLeft className="w-4 h-4" />
                <span className="sr-only">Minimize Sidebar</span>
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => setMinimizeSidebar(false)}
            >
              <PanelLeft className="w-5 h-5 rotate-180" />
              <span className="sr-only">Expand Sidebar</span>
            </Button>
          )}
        </div>

        {/* Minimized Quick Access */}
        {minimizeSidebar && (
          <div className="p-2 border-b border-gray-200 dark:border-gray-800">
            <div className="flex flex-col items-center gap-3">
              <Button
                className="w-10 h-10 rounded-xl text-white shadow-lg transition-all duration-300 p-0 hover:shadow-xl hover:scale-105"
                style={{ backgroundColor: mainColor }}
                onClick={() => setIsWebCategoryDialogOpen(true)}
              >
                <BookOpen className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* User Profile & Featured Section (Desktop) - Only when expanded */}
        {!minimizeSidebar && (
          <div
            className="p-4 border-b border-gray-200 dark:border-gray-800"
            style={{ backgroundColor: `${mainColor}08` }}
          >
            {/* Featured Card with integrated category selection */}
            <div
              className="relative overflow-hidden rounded-2xl p-4 text-white shadow-xl cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
              style={{ backgroundColor: mainColor }}
              onClick={() => setIsWebCategoryDialogOpen(true)}
            >
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-medium opacity-90">
                    {websiteSubCategory?.name || 'KATEGORI'}
                  </span>
                </div>
                <h3 className="font-bold text-base mb-1">
                  {websiteSubCategory?.name || 'Pilih Kategori Bimbelio'}
                </h3>
                <p className="text-xs text-white/80 mb-3 leading-relaxed">
                  {websiteSubCategory
                    ? 'Persiapan lengkap untuk mencapai target terbaikmu'
                    : 'Pilih kategori yang sesuai dengan tujuan belajarmu'}
                </p>
                <div className="flex items-center justify-between text-white/90">
                  <span className="text-sm font-medium">Mulai Sekarang</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -right-6 -top-6 w-20 h-20 bg-white/10 rounded-full blur-[1px]" />
              <div className="absolute -right-10 -bottom-10 w-24 h-24 bg-white/5 rounded-full blur-[1px]" />
              <div className="absolute right-4 top-4 w-2 h-2 bg-white/30 rounded-full" />
              <div className="absolute right-8 top-8 w-1 h-1 bg-white/40 rounded-full" />
            </div>
          </div>
        )}

        {/* Sidebar Routes */}
        <div
          className={cn(
            'flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700',
            minimizeSidebar ? 'py-2' : 'py-4 mt-2',
          )}
        >
          <SidebarRoute
            category={category}
            minimizeSidebar={minimizeSidebar}
            setMinimizeSidebar={setMinimizeSidebar}
            categoryColors={{ mainColor, secondaryColor }}
          />
        </div>

        {/* Footer */}
        <div className="border-t bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-3">
          {/* Upgrade Premium (Conditionally Rendered) */}
          {!session?.user.tier && !minimizeSidebar && (
            <div className="flex flex-col gap-2 bg-white dark:bg-gray-800 rounded-xl p-4 mb-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <h1 className="font-semibold text-base">Subscription</h1>
              <p className="text-xs text-muted-foreground">
                Beli subscription sekarang untuk meningkatkan akses layanan
                terbaik dan terlengkap dari Bimbelio
              </p>
              <Button
                className="flex w-fit items-center gap-2 rounded-lg px-4 py-2 text-white shadow-md hover:opacity-90 transition-opacity"
                style={{ backgroundColor: mainColor }}
                onClick={() => setTransactionPopUp(true)}
              >
                <Crown className="w-4 h-4" />
                <p className="text-sm font-medium">Subscription</p>
              </Button>
            </div>
          )}

          {/* User Profile & Settings */}
          <div
            className={cn(
              'relative flex items-center gap-2 p-2 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-colors duration-200',
              minimizeSidebar ? 'justify-center' : 'justify-between',
            )}
          >
            <div className="flex items-center gap-2">
              <Avatar
                className={cn(
                  'ring-1 ring-gray-200 dark:ring-gray-700',
                  minimizeSidebar ? 'h-10 w-10' : 'h-8 w-8',
                )}
              >
                <AvatarImage
                  src={userImage || '/placeholder.svg'}
                  alt={session?.user.name || 'User'}
                />
                <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-foreground">
                  {session?.user.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              {!minimizeSidebar && (
                <span className="font-semibold text-sm capitalize">
                  {session?.user.name || 'Pengguna'}
                </span>
              )}
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
                    className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-full"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="sr-only">Settings</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="right"
                  align="end"
                  className="w-[14rem]"
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
                        <span>Admin Panel</span>
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
                    <span>Profil</span>
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
                    <span>Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="relative flex h-full flex-col bg-background shadow-xl md:hidden border-r border-gray-200 dark:border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <Logo href={`/${website_sub_category_id}/user/dashboard`} />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-full"
            onClick={() => setSidebarMobile(false)}
          >
            <PanelLeft className="w-4 h-4" />
            <span className="sr-only">Close Sidebar</span>
          </Button>
        </div>

        {/* User Profile & Featured Section (Mobile) */}
        <div
          className="p-4 border-b border-gray-200 dark:border-gray-800"
          style={{ backgroundColor: `${mainColor}08` }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Avatar
              className="h-12 w-12 ring-2 ring-offset-2 ring-offset-background ring-opacity-50"
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
            <div className="flex flex-col">
              <span
                className="font-bold text-lg"
                style={{ color: mainColor }}
              >
                {session?.user.name || 'Pengguna'}
              </span>
              <span className="text-xs text-muted-foreground">
                Selamat Belajar!
              </span>
            </div>
          </div>

          {/* Featured Card with integrated category selection */}
          <div
            className="relative overflow-hidden rounded-2xl p-4 text-white shadow-xl"
            style={{ backgroundColor: mainColor }}
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-3 h-3" />
                </div>
                <span className="text-xs font-medium opacity-90">
                  {websiteSubCategory?.name || 'KATEGORI'}
                </span>
              </div>
              <h3 className="font-bold text-base mb-1">
                {websiteSubCategory?.name || 'Pilih Kategori Bimbelio'}
              </h3>
              <p className="text-xs text-white/80 mb-3 leading-relaxed">
                {websiteSubCategory
                  ? 'Persiapan lengkap untuk mencapai target terbaikmu'
                  : 'Pilih kategori yang sesuai dengan tujuan belajarmu'}
              </p>
              <Button
                className="w-full justify-between bg-white/20 hover:bg-white/30 text-white text-sm font-semibold rounded-lg px-3 py-2 h-auto transition-colors duration-200"
                onClick={() => setIsWebCategoryDialogOpen(true)}
              >
                <span>Mulai Sekarang</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            {/* Decorative elements */}
            <div className="absolute -right-6 -top-6 w-20 h-20 bg-white/10 rounded-full blur-[1px]" />
            <div className="absolute -right-10 -bottom-10 w-24 h-24 bg-white/5 rounded-full blur-[1px]" />
            <div className="absolute right-4 top-4 w-2 h-2 bg-white/30 rounded-full" />
            <div className="absolute right-8 top-8 w-1 h-1 bg-white/40 rounded-full" />
          </div>
        </div>

        {/* Sidebar Routes */}
        <div className="flex-1 overflow-y-auto pb-4 mt-4 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
          <SidebarRoute
            category={category}
            minimizeSidebar={false}
            setMinimizeSidebar={setMinimizeSidebar}
            categoryColors={{ mainColor, secondaryColor }}
          />
        </div>

        {/* Footer (Mobile) */}
        <div className="border-t bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-3">
          {!session?.user.tier && (
            <div className="flex flex-col gap-2 bg-white dark:bg-gray-800 rounded-xl p-4 mb-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <h1 className="font-semibold text-base">Subscription</h1>
              <p className="text-xs text-muted-foreground">
                Upgrade akunmu sekarang untuk meningkatkan akses layanan terbaik
                dan terlengkap dari Bimbelio
              </p>
              <Button
                className="flex w-fit items-center gap-2 rounded-lg px-4 py-2 text-white shadow-md hover:opacity-90 transition-opacity"
                style={{ backgroundColor: mainColor }}
                onClick={() => setTransactionPopUp(true)}
              >
                <Crown className="w-4 h-4" />
                <p className="text-sm font-medium">Upgrade akun</p>
              </Button>
            </div>
          )}
          <div className="relative flex items-center justify-between gap-2 p-2 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-colors duration-200">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={userImage || '/placeholder.svg'}
                  alt={session?.user.name || 'User'}
                />
                <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-foreground">
                  {session?.user.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="font-semibold text-sm capitalize">
                {session?.user.name || 'Pengguna'}
              </span>
            </div>
            <DropdownMenu
              open={openMenu}
              onOpenChange={setOpenMenu}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-full"
                >
                  <Settings className="w-4 h-4" />
                  <span className="sr-only">Settings</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                align="end"
                className="w-[14rem]"
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
                      <span>Admin Panel</span>
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
                  <span>Profil</span>
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
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
    </Fragment>
  );
};

export default Sidebar;
