import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMedia } from 'use-media';

import UserAccountNav from '@/components/_shared/navbar/user-account-nav';
import AnimatedGradientText from '@/components/magicui/animated-gradient-text';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LayoutDashboard, LogOut, Menu } from 'lucide-react';

import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import Logo from '@/components/ui/logo';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { signOut } from '@/lib/auth-helper';
import { cn } from '@/lib/utils';
import { Badge } from '../../ui/badge';

interface NavbarProps {
  showAuth: { signUp: boolean; login: boolean };
  setShowAuth: (show: { signUp: boolean; login: boolean }) => void;
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
  // { href: "/blog", label: "Blog", isLink: true },
  { href: '/price', label: 'Paket', isLink: true },
  { href: '#tryout', label: 'Try Out' },
];

const GratisBadge: React.FC<{ label: string }> = ({ label }) => {
  if (label.toLowerCase() !== 'try out') return null;
  return (
    <Badge
      variant="secondary"
      className={cn(
        'absolute -top-2 -right-10 bg-yellow-400 hover:bg-yellow-400 px-1 py-0 text-xs font-bold text-blue-800',
      )}
    >
      Gratis!
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
  setShowAuth: NavbarProps['setShowAuth'];
}> = ({ navItems, isSheetOpen, setIsSheetOpen, session, setShowAuth }) => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  return (
    <div className="fixed left-0 top-0 z-50 w-full rounded-b-3xl bg-white/70">
      <div className="mx-auto flex items-center justify-between px-4 py-3">
        <Logo
          href="/"
          className="text-main-default"
        />

        {/* Tombol Menu */}
        <Sheet
          open={isSheetOpen}
          onOpenChange={setIsSheetOpen}
        >
          <SheetTrigger asChild>
            <button
              className="rounded-xl p-2 text-main-default transition-colors duration-300s"
              aria-label="Open menu"
            >
              <Menu size={28} />
            </button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="h-fit max-h-[90vh] rounded-t-xl border-none bg-white px-4 pt-6"
          >
            <div className="space-y-4 pb-4">
              <h2 className="text-center text-2xl font-bold">
                <AnimatedGradientText>Menu</AnimatedGradientText>
              </h2>
              <Card className="shadow-m border-none bg-white">
                <CardContent className="p-4">
                  <motion.div
                    className="flex w-full flex-col items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AnimatePresence>
                      {navItems.map((item, index) => (
                        <motion.div
                          key={item.href}
                          className="w-full"
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div
                            className="block w-full rounded-xl py-3 text-center transition-colors duration-300 hover:bg-main/20"
                            onClick={() => setIsSheetOpen(false)}
                          >
                            <NavLink item={item} />
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </CardContent>
              </Card>
              <Card className="shadow-m border-none bg-white">
                <CardContent className="p-4">
                  {session ? (
                    <motion.div
                      className="space-y-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center justify-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-blue-500">
                          <AvatarImage
                            src={session.user.image ?? ''}
                            alt={session.user.name ?? 'User'}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-lg font-bold text-white">
                            {session.user.name
                              ? session.user.name[0].toUpperCase()
                              : 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <p className="font-bold text-gray-800">
                            {session.user.name}
                          </p>
                          <p className="max-w-[200px] truncate text-sm text-gray-500">
                            {session.user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3 pt-2">
                        <Link
                          href={`/${website_sub_category_id}/user/try-out`}
                          className="flex flex-1 items-center justify-center gap-2 rounded-3xl border-2 border-blue-500 bg-white px-4 py-2.5 text-blue-500 transition-colors duration-300 hover:bg-blue-50"
                          onClick={() => setIsSheetOpen(false)}
                        >
                          <LayoutDashboard className="h-5 w-5" />
                          <span className="font-medium">Dashboard2</span>
                        </Link>
                        <button
                          className="flex flex-1 items-center justify-center gap-2 rounded-3xl bg-red-500 px-4 py-2.5 text-white transition-colors duration-300 hover:bg-red-600"
                          onClick={() => {
                            signOut({ callbackUrl: '/' });
                            setIsSheetOpen(false);
                          }}
                          aria-label="Keluar"
                        >
                          <LogOut className="h-5 w-5" />
                          <span className="font-medium">Keluar</span>
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <Button
                      className="mx-auto flex w-full justify-center rounded-full py-3 text-base font-medium text-white transition-all duration-300 bg-gradient-default"
                      onClick={() => {
                        setShowAuth({ signUp: false, login: true });
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
  );
};

const DesktopNav: React.FC<{
  navItems: NavItem[];
  session: any;
  setShowAuth: NavbarProps['setShowAuth'];
}> = ({ navItems, session, setShowAuth }) => {
  useWebsiteSubCategory();
  return (
    <div className="fixed left-0 top-4 z-50 w-full bg-transparent">
      <div className="mx-auto flex max-w-4xl items-center justify-between rounded-3xl bg-white/80 p-2 shadow-sm backdrop-blur-sm">
        <Logo
          href="/"
          className="text-main-default"
        />
        <nav className="flex items-center justify-center gap-4 text-sm font-medium">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
            />
          ))}
        </nav>
        {session ? (
          <UserAccountNav user={session.user} />
        ) : (
          <button
            className="rounded-full px-4 py-2 text-sm text-white transition-colors duration-300 hover:opacity-85 bg-gradient-default"
            onClick={() => setShowAuth({ signUp: false, login: true })}
          >
            Daftar/Masuk
          </button>
        )}
      </div>
    </div>
  );
};

const Navbar: React.FC<NavbarProps> = ({ setShowAuth }) => {
  const { data: session } = useSession();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isMobile = useMedia({ maxWidth: '768px' });

  return isMobile ? (
    <MobileNav
      navItems={navItems}
      isSheetOpen={isSheetOpen}
      setIsSheetOpen={setIsSheetOpen}
      session={session}
      setShowAuth={setShowAuth}
    />
  ) : (
    <DesktopNav
      navItems={navItems}
      session={session}
      setShowAuth={setShowAuth}
    />
  );
};

export default Navbar;
