import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useMedia } from 'use-media';

import UserAccountNav from '@/components/_shared/navbar/user-account-nav';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { LayoutDashboard, LogOut, Menu, X } from 'lucide-react';

import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import Logo from '@/components/ui/logo';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { signOut } from '@/lib/auth-helper';
import { cn } from '@/lib/utils';
import { Badge } from '../../ui/badge';

interface NavbarProps {
  showAuth: { open: boolean; redirect: string | null };
  setShowAuth: Dispatch<
    SetStateAction<{ open: boolean; redirect: string | null }>
  >;
}

interface NavItem {
  href: string;
  label: string;
  isLink?: boolean;
  separator?: boolean; // Tambahkan separator jika diperlukan
}

const navItems: NavItem[] = [
  { href: '/#hero', label: 'Beranda', isLink: true },
  // { href: "#materi", label: "Materi" },
  // { href: "#testimoni", label: "Testimoni" },
  { href: '/blog', label: 'Blog', isLink: true },
  { href: '/price', label: 'Paket', isLink: true },
  { href: '#tryout', label: 'Try Out' },
];

const GratisBadge: React.FC<{ label: string }> = ({ label }) => {
  if (label.toLowerCase() !== 'try out') return null;
  return (
    <Badge
      variant="secondary"
      className="absolute -top-3 -right-8 bg-green-500 hover:bg-green-500 px-1.5 py-0 text-[10px] font-bold text-white rounded-full"
    >
      GRATIS
    </Badge>
  );
};

/**
 * Komponen link universal untuk Desktop & Mobile.
 * Menggunakan router untuk navigasi yang lebih konsisten.
 */
const NavLink: React.FC<{
  item: NavItem;
  onClick?: () => void;
}> = ({ item, onClick }) => {
  const router = useRouter();
  const pathname = usePathname();

  const linkClasses = cn(
    'relative text-main-default transition-colors duration-300 hover:underline bg-transparent border-none cursor-pointer',
    item.separator && 'ml-4 border-l border-gray-900 pl-4',
  );

  const handleClick = () => {
    onClick?.(); // Untuk menutup sheet di mobile

    if (item.isLink) {
      // Direct navigation untuk link pages
      router.push(item.href);
    } else {
      // Scroll navigation untuk anchor links
      if (pathname !== '/') {
        // Jika tidak di homepage, navigasi ke homepage dengan hash
        router.push(`/${item.href}`);
      } else {
        // Jika di homepage, lakukan scroll
        const targetId = item.href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          const offset = 200;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        } else {
          // Fallback: navigasi ke homepage dengan hash
          router.push(`/${item.href}`);
        }
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      className={linkClasses}
    >
      {item.label}
      <GratisBadge label={item.label} />
    </button>
  );
};

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
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  return (
    <div className="fixed left-0 top-0 z-50 w-full">
      {/* Enhanced Mobile Header */}
      <Card className="mx-3 mt-3 shadow-xl border-2 border-white/20 rounded-2xl backdrop-blur-xl overflow-hidden">
        <div className="px-4 py-3 relative bg-transparent">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full -translate-y-6 translate-x-6 bg-main-default" />
            <div className="absolute bottom-0 left-0 w-12 h-12 rounded-full translate-y-3 -translate-x-3 bg-main-default" />
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <Logo
              href="/"
              className="text-xl font-bold text-main-default"
            />

            <Sheet
              open={isSheetOpen}
              onOpenChange={setIsSheetOpen}
            >
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative w-10 h-10 rounded-xl transition-all duration-300 hover:scale-105 text-main-default bg-main-default/10"
                >
                  {isSheetOpen ? <X size={20} /> : <Menu size={20} />}
                </Button>
              </SheetTrigger>

              <SheetContent
                side="bottom"
                className="h-fit max-h-[85vh] rounded-t-2xl border-none bg-white px-0 pt-0"
              >
                {/* Add hidden title for accessibility */}
                <SheetHeader className="sr-only">
                  <SheetTitle>Menu Navigasi</SheetTitle>
                  <VisuallyHidden>
                    <p>Jelajahi semua fitur yang tersedia</p>
                  </VisuallyHidden>
                </SheetHeader>

                {/* Simple Clean Header */}
                <div className="p-6 pb-4 border-b border-gray-100">
                  <div className="text-center">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">
                      Menu Navigasi
                    </h2>
                    <p className="text-sm text-gray-500">
                      Jelajahi semua fitur yang tersedia
                    </p>
                  </div>
                </div>

                {/* Clean Content */}
                <div className="px-6 pb-6 space-y-4">
                  {/* Navigation Items - Simple List */}
                  <div className="space-y-2">
                    {navItems.map((item, index) => (
                      <div
                        key={item.href}
                        className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                            {index + 1}
                          </div>
                          <NavLink
                            item={item}
                            onClick={() => setIsSheetOpen(false)}
                          />
                        </div>
                        <div className="text-gray-400">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* User Profile Section - Clean Version */}
                  <div className="border-t border-gray-100 pt-4">
                    {session ? (
                      <div className="space-y-4">
                        {/* User Info - Simple */}
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={session.user.image ?? ''}
                              alt={session.user.name ?? 'User'}
                            />
                            <AvatarFallback
                              className="text-sm font-medium text-white"
                              style={{ backgroundColor: mainColor }}
                            >
                              {session.user.name
                                ? session.user.name[0].toUpperCase()
                                : 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {session.user.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {session.user.email}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons - Simple Grid */}
                        <div className="grid grid-cols-2 gap-3">
                          <Link
                            href={`/${website_sub_category_id}/user/try-out`}
                            onClick={() => setIsSheetOpen(false)}
                            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">
                              Dashboard
                            </span>
                          </Link>

                          <button
                            onClick={() => {
                              signOut({ callbackUrl: '/' });
                              setIsSheetOpen(false);
                            }}
                            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-red-50 hover:bg-red-100 transition-colors"
                          >
                            <LogOut className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-medium text-red-700">
                              Keluar
                            </span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        className="w-full h-12 rounded-xl font-medium text-white"
                        style={{ backgroundColor: mainColor }}
                        onClick={() => {
                          setShowAuth((prev) => ({
                            ...prev,
                            open: true,
                            redirect: website_sub_category_id
                              ? `${website_sub_category_id}/user/dashboard`
                              : '/choice/user/dashboard',
                          }));
                          setIsSheetOpen(false);
                        }}
                      >
                        Daftar/Masuk
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Card>
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

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  return (
    <div className="fixed left-0 top-0 z-50 w-full bg-transparent">
      <div className="mx-auto max-w-4xl px-4 pt-4">
        <Card className="shadow-2xl border-2 border-white/30 rounded-3xl backdrop-blur-xl overflow-hidden">
          <div
            className="px-6 py-4 md:py-1 lg:py-1 relative"
            style={{
              background: `linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))`,
            }}
          >
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-12 translate-x-12"
                style={{ backgroundColor: mainColor }}
              />
              <div
                className="absolute bottom-0 left-0 w-20 h-20 rounded-full translate-y-6 -translate-x-6"
                style={{ backgroundColor: secondaryColor }}
              />
            </div>

            <div className="relative z-10 flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center">
                <Logo
                  href="/"
                  className="text-xl font-bold text-main-default"
                />
              </div>

              {/* Navigation Links */}
              <nav className="hidden md:flex items-center gap-2">
                {navItems.map((item, index) => (
                  <div
                    key={item.href}
                    className="relative group"
                  >
                    <div className="px-2 text-sm py-1 rounded-xl transition-all duration-300 hover:bg-gray-50 hover:shadow-sm">
                      <NavLink item={item} />
                    </div>
                    {/* Hover indicator */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 rounded-full transition-all duration-300 group-hover:w-8 bg-main-default" />
                  </div>
                ))}
              </nav>

              {/* Auth Section */}
              <div className="flex items-center gap-4">
                {session ? (
                  <UserAccountNav user={session.user} />
                ) : (
                  <Button
                    className="px-4 py-2.5 rounded-2xl text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 border-0 bg-gradient-default"
                    onClick={() =>
                      setShowAuth((prev) => ({
                        ...prev,
                        open: true,
                        redirect: website_sub_category_id
                          ? `${website_sub_category_id}/user/dashboard`
                          : '/choice/user/dashboard',
                      }))
                    }
                  >
                    Daftar/Masuk
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Bottom accent line */}
          <div className="h-1 bg-gradient-default" />
        </Card>
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
          }, 100); // Delay untuk memastikan page sudah render
        }
      }
    };

    // Run on mount
    handleHashScroll();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashScroll);

    return () => {
      window.removeEventListener('hashchange', handleHashScroll);
    };
  }, [pathname]);

  return isMobile ? (
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
  );
};

export default Navbar;
