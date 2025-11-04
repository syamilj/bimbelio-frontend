import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMedia } from 'use-media';

import UserAccountNav from '@/components/_shared/navbar/user-account-nav';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ArrowRight, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';

import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import Logo from '@/components/ui/logo';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { signOut } from '@/lib/auth-helper';
import { hexToRgba } from '@/styles/main-styles';

interface NavItem {
  href: string;
  label: string;
  isLink?: boolean;
  submenu?: Array<{
    href: string;
    label: string;
    isLink?: boolean;
    description?: string;
  }>;
}

const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Beranda',
    isLink: false,
    submenu: [
      {
        href: '#product',
        label: 'Produk',
        description: 'Lihat semua produk kami',
      },
      { href: '#tryout', label: 'Tryout', description: 'Coba gratis tryout' },
      { href: '#whyUs', label: 'Why Us', description: 'Kenapa pilih kami' },
    ],
  },
  { href: '/blog', label: 'Blog', isLink: true },
  { href: '/price', label: 'Produk', isLink: true },
  { href: '/tryout', label: 'Tryout', isLink: true },
  { href: '/tutor', label: 'Tutor', isLink: true },
  { href: '/about', label: 'About', isLink: true },
  { href: '/beasiswa', label: 'Beasiswa', isLink: true },
];

const MobileNav: React.FC<{
  navItems: NavItem[];
  isSheetOpen: boolean;
  setIsSheetOpen: (open: boolean) => void;
  session: any;
}> = ({ navItems, isSheetOpen, setIsSheetOpen, session }) => {
  const {
    useAuth: { setShowAuth },
  } = useAppContext();
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const isMainLandingPage = window.location.pathname === '/';
  const mainColor = isMainLandingPage
    ? '#0091FF'
    : (websiteSubCategory?.main_color ?? '#0091FF');
  const secondaryColor = isMainLandingPage
    ? '#5aa4dd'
    : (websiteSubCategory?.secondary_color ?? '#5aa4dd');

  return (
    <div className="fixed left-0 top-0 z-50 w-full">
      {/* Mobile Header - Full width with enhanced design */}
      <div className="relative bg-white/95 backdrop-blur-xl border-b border-white/20 shadow-2xl">
        <div className="relative z-10 w-full px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo with enhanced styling */}
            <div className="flex items-center gap-2">
              <Logo
                href="/"
                className="text-lg font-bold"
                style={{
                  color: mainColor,
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {!session && (
                <Button
                  className="px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 border-0 relative overflow-hidden group"
                  style={{
                    backgroundImage: `linear-gradient(145deg, ${secondaryColor}, ${mainColor})`,
                  }}
                  onClick={() =>
                    setShowAuth((prev) => ({
                      ...prev,
                      open: true,
                      redirect: website_sub_category_id
                        ? `/${website_sub_category_id}/user/dashboard`
                        : '/choice/user/dashboard',
                    }))
                  }
                >
                  <span className="relative z-10">Masuk</span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300" />
                </Button>
              )}
              {session && (
                <Link href={`${website_sub_category_id}/user/dashboard`}>
                  <Button
                    className="px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 border-0 relative overflow-hidden group"
                    style={{
                      backgroundImage: `linear-gradient(145deg, ${secondaryColor}, ${mainColor})`,
                    }}
                  >
                    <span className="relative z-10">Dashboard</span>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300" />
                  </Button>
                </Link>
              )}

              {/* Menu Button */}
              <Sheet
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
              >
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative w-10 h-10 rounded-lg transition-all duration-300 hover:scale-110"
                    style={{
                      backgroundColor: hexToRgba(mainColor, 0.12),
                      color: mainColor,
                    }}
                  >
                    {isSheetOpen ? <X size={20} /> : <Menu size={20} />}
                  </Button>
                </SheetTrigger>

                <SheetContent
                  side="top"
                  className="h-fit max-h-[90vh] mt-16 rounded-b-3xl border-none bg-white px-0 pt-0 overflow-y-auto shadow-2xl"
                >
                  {/* Header */}
                  <div className="sticky top-0 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 p-6 pb-4">
                    <h2 className="text-lg font-bold text-gray-900">
                      Menu Navigasi
                    </h2>
                  </div>

                  {/* Navigation Items */}
                  <div className="px-4 py-6 space-y-2">
                    {navItems.map((item, idx) => (
                      <div key={item.href}>
                        {item.submenu ? (
                          <div className="space-y-2">
                            <div
                              className="px-4 py-3 text-sm font-bold rounded-lg transition-all duration-300"
                              style={{
                                color: mainColor,
                                backgroundColor: hexToRgba(mainColor, 0.08),
                              }}
                            >
                              {item.label}
                            </div>
                            {item.submenu.map((subItem) => (
                              <button
                                key={subItem.href}
                                onClick={() => {
                                  const router = useRouter();
                                  const pathname = usePathname();

                                  if (pathname !== '/') {
                                    router.push(`/${subItem.href}`);
                                  } else {
                                    const targetId = subItem.href.substring(1);
                                    const targetElement =
                                      document.getElementById(targetId);
                                    if (targetElement) {
                                      const offset = 200;
                                      const elementPosition =
                                        targetElement.getBoundingClientRect()
                                          .top;
                                      const offsetPosition =
                                        elementPosition +
                                        window.pageYOffset -
                                        offset;
                                      window.scrollTo({
                                        top: offsetPosition,
                                        behavior: 'smooth',
                                      });
                                    }
                                  }
                                  setIsSheetOpen(false);
                                }}
                                className="flex w-full items-center justify-between text-left px-6 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                              >
                                <span>{subItem.label}</span>
                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                              </button>
                            ))}
                          </div>
                        ) : (
                          <Link
                            href={item.href}
                            onClick={() => setIsSheetOpen(false)}
                            className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                          >
                            <span>{item.label}</span>
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="mx-6 my-4 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                  {/* User Section */}
                  <div className="p-6">
                    {session ? (
                      <div className="space-y-4">
                        {/* User Info */}
                        <div
                          className="flex items-center gap-3 p-4 rounded-xl border-2"
                          style={{
                            borderColor: hexToRgba(mainColor, 0.2),
                            backgroundColor: hexToRgba(mainColor, 0.05),
                          }}
                        >
                          <Avatar
                            className="h-12 w-12 border-2"
                            style={{ borderColor: mainColor }}
                          >
                            <AvatarImage
                              src={session.user.image ?? ''}
                              alt={session.user.name ?? 'User'}
                            />
                            <AvatarFallback
                              className="text-sm font-bold text-white"
                              style={{ backgroundColor: mainColor }}
                            >
                              {session.user.name
                                ? session.user.name[0].toUpperCase()
                                : 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 truncate">
                              {session.user.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {session.user.email}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                          <Link
                            href={`/${website_sub_category_id}/user/dashboard`}
                            onClick={() => setIsSheetOpen(false)}
                            className="flex items-center justify-center gap-2 p-3 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 border border-blue-100"
                          >
                            <LayoutDashboard className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-semibold text-blue-700">
                              Dashboard
                            </span>
                          </Link>

                          <button
                            onClick={() => {
                              signOut({ callbackUrl: '/' });
                              setIsSheetOpen(false);
                            }}
                            className="flex items-center justify-center gap-2 p-3 rounded-lg bg-gradient-to-br from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 transition-all duration-200 border border-red-100"
                          >
                            <LogOut className="w-4 h-4 text-red-600" />
                            <span className="text-xs font-semibold text-red-700">
                              Keluar
                            </span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        className="w-full h-12 rounded-lg font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 relative overflow-hidden group"
                        style={{
                          backgroundImage: `linear-gradient(135deg, ${secondaryColor}, ${mainColor})`,
                        }}
                        onClick={() => {
                          setShowAuth((prev) => ({
                            ...prev,
                            open: true,
                            redirect: website_sub_category_id
                              ? `/${website_sub_category_id}/user/dashboard`
                              : '/choice/user/dashboard',
                          }));
                          setIsSheetOpen(false);
                        }}
                      >
                        <span className="relative z-10">Daftar/Masuk</span>
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300" />
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DesktopNav: React.FC<{
  navItems: NavItem[];
  session: any;
}> = ({ navItems, session }) => {
  const {
    useAuth: { setShowAuth },
  } = useAppContext();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const router = useRouter();
  const pathname = usePathname();

  // Get dynamic colors
  const isMainLandingPage = window.location.pathname === '/';
  const mainColor = isMainLandingPage
    ? '#0091FF'
    : (websiteSubCategory?.main_color ?? '#0091FF');
  const secondaryColor = isMainLandingPage
    ? '#5aa4dd'
    : (websiteSubCategory?.secondary_color ?? '#5aa4dd');

  const handleNavigation = (href: string, isLink?: boolean) => {
    if (isLink) {
      router.push(href);
    } else {
      if (pathname !== '/') {
        router.push(`/${href}`);
      } else {
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const offset = 200;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }
    }
  };

  return (
    <div className="fixed left-0 top-0 z-50 w-full">
      <div className="relative w-full bg-white/95 backdrop-blur-xl border-b border-white/20 shadow-2xl">
        <div className="relative z-10 w-full px-6 py-4">
          <div className="flex items-center justify-between gap-8 max-w-6xl mx-auto">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 gap-3">
              <Logo
                href="/"
                className="text-2xl font-bold"
                style={{ color: mainColor }}
              />
            </div>

            {/* Navigation Menu - Using NavigationMenu */}
            <NavigationMenu className="hidden lg:block">
              <NavigationMenuList className="gap-1">
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.href}>
                    {item.submenu ? (
                      <>
                        <NavigationMenuTrigger
                          className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 rounded-lg transition-all duration-300 hover:bg-gray-50"
                          style={{
                            color: mainColor,
                          }}
                        >
                          <span className="flex items-center gap-2">
                            {item.label}
                          </span>
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div
                            className="w-64 p-3 bg-white rounded-xl shadow-2xl border"
                            style={{ borderColor: hexToRgba(mainColor, 0.2) }}
                          >
                            <div className="space-y-1">
                              {item.submenu.map((subItem) => (
                                <button
                                  key={subItem.href}
                                  onClick={() => {
                                    handleNavigation(
                                      subItem.href,
                                      subItem.isLink,
                                    );
                                  }}
                                  className="group w-full text-left px-4 py-3 text-sm rounded-lg transition-all duration-200"
                                  style={{
                                    color: mainColor,
                                  }}
                                  onMouseEnter={(
                                    e: React.MouseEvent<HTMLButtonElement>,
                                  ) => {
                                    (
                                      e.currentTarget as any
                                    ).style.backgroundColor = hexToRgba(
                                      mainColor,
                                      0.08,
                                    );
                                  }}
                                  onMouseLeave={(
                                    e: React.MouseEvent<HTMLButtonElement>,
                                  ) => {
                                    (
                                      e.currentTarget as any
                                    ).style.backgroundColor = 'transparent';
                                  }}
                                >
                                  <div className="font-bold flex items-center justify-between">
                                    <span>{subItem.label}</span>
                                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                  </div>
                                  {subItem.description && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      {subItem.description}
                                    </p>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink
                        asChild
                        className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 rounded-lg transition-all duration-300 hover:bg-gray-50"
                      >
                        <Link
                          href={item.href}
                          style={{
                            color: mainColor,
                          }}
                        >
                          {item.label}
                        </Link>
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Auth Section */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {session ? (
                <UserAccountNav user={session.user} />
              ) : (
                <Button
                  className="px-7 py-2.5 rounded-lg text-sm font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 border-0 relative overflow-hidden group"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${secondaryColor}, ${mainColor})`,
                    boxShadow: `0 8px 16px ${hexToRgba(mainColor, 0.3)}`,
                  }}
                  onClick={() =>
                    setShowAuth((prev) => ({
                      ...prev,
                      open: true,
                      redirect: website_sub_category_id
                        ? `/${website_sub_category_id}/user/dashboard`
                        : '/choice/user/dashboard',
                    }))
                  }
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Masuk
                  </span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isMobile = useMedia({ maxWidth: '768px' });
  const pathname = usePathname();

  // Handle scroll to hash on page load
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash && pathname === '/') {
        const targetId = hash.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          setTimeout(() => {
            const offset = 200;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition =
              elementPosition + window.pageYOffset - offset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth',
            });
          }, 100);
        }
      }
    };

    handleHashScroll();
    window.addEventListener('hashchange', handleHashScroll);

    return () => {
      window.removeEventListener('hashchange', handleHashScroll);
    };
  }, [pathname]);

  return (
    <>
      {isMobile ? (
        <MobileNav
          navItems={navItems}
          isSheetOpen={isSheetOpen}
          setIsSheetOpen={setIsSheetOpen}
          session={session}
        />
      ) : (
        <DesktopNav
          navItems={navItems}
          session={session}
        />
      )}
      {/* Add padding to prevent content from being hidden under navbar */}
      <div className={isMobile ? 'h-20' : 'h-24'} />
    </>
  );
};

export default Navbar;
