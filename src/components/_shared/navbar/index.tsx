import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import { useMedia } from 'use-media';

import UserAccountNav from '@/components/_shared/navbar/user-account-nav';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
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

const ScrollOffsetLink: React.FC<{
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ href, children, onClick }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClick?.(); // Misalnya untuk menutup sheet di mobile

    if (pathname?.includes('blog') || pathname?.includes('tryout')) {
      router.push(`/${href}`);
      return;
    }

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
  };

  return (
    <a
      href={pathname === '/' ? href : `/${href}`}
      onClick={handleClick}
      className="relative text-main-default duration-300 hover:underline"
      aria-label={`Scroll to ${children}`}
    >
      {children}
    </a>
  );
};

/**
 * Komponen link universal untuk Desktop & Mobile.
 * Jika `item.isLink` true, akan langsung <Link href>.
 * Jika tidak, menggunakan <ScrollOffsetLink>.
 */
const NavLink: React.FC<{
  item: NavItem;
  onClick?: () => void;
}> = ({ item, onClick }) => {
  const linkClasses = cn(
    'relative text-main-default transition-colors duration-300 hover:underline',
    item.separator && 'ml-4 border-l border-gray-900 pl-4',
  );

  if (item.isLink) {
    return (
      <Link
        href={item.href}
        onClick={onClick}
        className={linkClasses}
      >
        {item.label}
        <GratisBadge label={item.label} />
      </Link>
    );
  }

  return (
    <ScrollOffsetLink
      href={item.href}
      onClick={onClick}
    >
      {item.label}
      <GratisBadge label={item.label} />
    </ScrollOffsetLink>
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
        <div
          className="px-4 py-3 relative"
          style={{
            background: `linear-gradient(135deg, ${mainColor}05, ${secondaryColor}05)`,
          }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute top-0 right-0 w-20 h-20 rounded-full -translate-y-6 translate-x-6"
              style={{ backgroundColor: mainColor }}
            />
            <div
              className="absolute bottom-0 left-0 w-12 h-12 rounded-full translate-y-3 -translate-x-3"
              style={{ backgroundColor: secondaryColor }}
            />
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <Logo
              href="/"
              className="text-xl font-bold"
              style={{ color: mainColor }}
            />

            <Sheet
              open={isSheetOpen}
              onOpenChange={setIsSheetOpen}
            >
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative w-10 h-10 rounded-xl transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: `${mainColor}10`,
                    color: mainColor,
                  }}
                >
                  <motion.div
                    animate={isSheetOpen ? { rotate: 90 } : { rotate: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isSheetOpen ? <X size={20} /> : <Menu size={20} />}
                  </motion.div>
                </Button>
              </SheetTrigger>

              <SheetContent
                side="bottom"
                className="h-fit max-h-[85vh] rounded-t-3xl border-none bg-white/95 backdrop-blur-xl px-0 pt-0"
              >
                {/* Elegant Header */}
                <div className="relative overflow-hidden">
                  <div
                    className="p-6 pb-4 relative"
                    style={{
                      background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
                    }}
                  >
                    {/* Decorative Elements */}
                    <div
                      className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-10"
                      style={{ backgroundColor: mainColor }}
                    />
                    <div
                      className="absolute -bottom-2 -left-2 w-8 h-8 rounded-full opacity-15"
                      style={{ backgroundColor: secondaryColor }}
                    />

                    <div className="relative z-10 text-center">
                      <div
                        className="w-12 h-12 mx-auto mb-3 rounded-2xl flex items-center justify-center shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                        }}
                      >
                        <Menu className="w-6 h-6 text-white" />
                      </div>
                      <h2
                        className="text-xl font-bold mb-1"
                        style={{ color: mainColor }}
                      >
                        Menu Navigasi
                      </h2>
                      <p className="text-sm text-gray-600">
                        Jelajahi semua fitur yang tersedia
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 space-y-4">
                  {/* Navigation Items */}
                  <Card className="border-2 border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                    <CardContent className="p-0">
                      {navItems.map((item, index) => (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-b border-gray-100 last:border-b-0"
                        >
                          <div
                            className="flex items-center justify-between px-6 py-4 transition-all duration-300 hover:bg-gray-50"
                            onClick={() => setIsSheetOpen(false)}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white"
                                style={{
                                  background: `linear-gradient(135deg, ${mainColor}80, ${secondaryColor}80)`,
                                }}
                              >
                                {index + 1}
                              </div>
                              <NavLink item={item} />
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
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* User Profile Section */}
                  <Card className="border-2 border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                    <CardContent className="p-6">
                      {session ? (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-4"
                        >
                          {/* User Info Card */}
                          <div
                            className="p-4 rounded-2xl relative overflow-hidden"
                            style={{ backgroundColor: `${mainColor}08` }}
                          >
                            <div className="relative z-10 flex items-center gap-3">
                              <div className="relative">
                                <Avatar className="h-12 w-12 border-2 border-white shadow-lg">
                                  <AvatarImage
                                    src={session.user.image ?? ''}
                                    alt={session.user.name ?? 'User'}
                                  />
                                  <AvatarFallback
                                    className="text-lg font-bold text-white"
                                    style={{
                                      background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                    }}
                                  >
                                    {session.user.name
                                      ? session.user.name[0].toUpperCase()
                                      : 'U'}
                                  </AvatarFallback>
                                </Avatar>
                                <div
                                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center"
                                  style={{ backgroundColor: '#10B981' }}
                                >
                                  <div className="w-2 h-2 bg-white rounded-full" />
                                </div>
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-900 truncate">
                                  {session.user.name}
                                </p>
                                <p className="text-sm text-gray-600 truncate">
                                  {session.user.email}
                                </p>
                              </div>
                            </div>

                            {/* Decorative dots */}
                            <div className="absolute top-2 right-2 flex gap-1">
                              <div className="w-1 h-1 rounded-full bg-white/30" />
                              <div className="w-1 h-1 rounded-full bg-white/20" />
                              <div className="w-1 h-1 rounded-full bg-white/10" />
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-2 gap-3">
                            <Link
                              href={`/${website_sub_category_id}/user/try-out`}
                              onClick={() => setIsSheetOpen(false)}
                              className="group"
                            >
                              <Card className="border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-md">
                                <CardContent className="p-4 text-center">
                                  <div
                                    className="w-10 h-10 mx-auto mb-2 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                                    style={{
                                      backgroundColor: `${mainColor}15`,
                                    }}
                                  >
                                    <LayoutDashboard
                                      className="w-5 h-5"
                                      style={{ color: mainColor }}
                                    />
                                  </div>
                                  <p className="text-sm font-medium text-gray-700">
                                    Dashboard
                                  </p>
                                </CardContent>
                              </Card>
                            </Link>

                            <button
                              onClick={() => {
                                signOut({ callbackUrl: '/' });
                                setIsSheetOpen(false);
                              }}
                              className="group"
                            >
                              <Card className="border-2 border-red-200 hover:border-red-300 transition-all duration-300 hover:shadow-md">
                                <CardContent className="p-4 text-center">
                                  <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-red-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <LogOut className="w-5 h-5 text-red-600" />
                                  </div>
                                  <p className="text-sm font-medium text-red-700">
                                    Keluar
                                  </p>
                                </CardContent>
                              </Card>
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        <Button
                          className="w-full h-12 rounded-xl text-base font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
                          style={{
                            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                          }}
                          onClick={() => {
                            setShowAuth((prev) => ({ ...prev, open: true }));
                            setIsSheetOpen(false);
                          }}
                        >
                          Daftar/Masuk
                        </Button>
                      )}
                    </CardContent>
                  </Card>
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
                  className="text-xl font-bold"
                  style={{ color: mainColor }}
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
                    <div
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 rounded-full transition-all duration-300 group-hover:w-8"
                      style={{ backgroundColor: mainColor }}
                    />
                  </div>
                ))}
              </nav>

              {/* Auth Section */}
              <div className="flex items-center gap-4">
                {session ? (
                  <UserAccountNav user={session.user} />
                ) : (
                  <Button
                    className="px-4 py-2.5 rounded-2xl text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 border-0"
                    style={{
                      background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                    }}
                    onClick={() =>
                      setShowAuth((prev) => ({ ...prev, open: true }))
                    }
                  >
                    Daftar/Masuk
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Bottom accent line */}
          <div
            className="h-1"
            style={{
              background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
            }}
          />
        </Card>
      </div>
    </div>
  );
};

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isMobile = useMedia({ maxWidth: '768px' });

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
