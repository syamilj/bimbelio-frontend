'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  ArrowRight,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  ShoppingBag,
} from 'lucide-react';

import { useAppContext } from '@/components/provider/provider-app';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import Logo from '@/components/ui/logo';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { signOut } from '@/lib/auth-helper';
import { cn } from '@/lib/utils';
import { hexToRgba } from '@/styles/main-styles';

import type { NavItem } from './navbar-types';
import {
  getBadgeStyles,
  getIconComponent,
  openContactDialog,
  renderLabel,
} from './navbar-types';

interface DesktopNavProps {
  navItems: NavItem[];
  session: any;
}

export const DesktopNav: React.FC<DesktopNavProps> = ({ navItems, session }) => {
  const {
    useAuth: { setShowAuth },
  } = useAppContext();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const pathname = usePathname();

  const isMainLandingPage = pathname === '/';
  const mainColor = isMainLandingPage
    ? '#0091FF'
    : (websiteSubCategory?.main_color ?? '#0091FF');
  const secondaryColor = isMainLandingPage
    ? '#5aa4dd'
    : (websiteSubCategory?.secondary_color ?? '#5aa4dd');

  const handleScrollToTarget = (href: string) => {
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const offset = 200;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const handleNavigation = (LinkId: string, href: string, isLink?: boolean) => {
    const link = document.getElementById(LinkId);
    if (/contact|konsultasi/i.test(href)) {
      openContactDialog();
      return;
    }
    if (isLink) {
      if (href.startsWith('#price') && pathname.toLowerCase() === '/price') {
        handleScrollToTarget(href);
      } else {
        link?.click();
      }
    } else {
      if (pathname !== '/') {
        link?.click();
      } else {
        handleScrollToTarget(href);
      }
    }
  };

  return (
    <div className="fixed left-0 top-0 z-50 w-full bg-transparent pointer-events-none">
      <div className="mx-auto max-w-4xl px-4 pt-4 pointer-events-auto">
        <Card className=" shadow-md border rounded-3xl backdrop-blur-xl overflow-visible bg-white">
          <div className="px-6 py-4 md:py-1 lg:py-1 relative rounded-3xl z-[3] bg-transparent">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5 overflow-hidden rounded-t-3xl">
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-12 translate-x-12"
                style={{ backgroundColor: mainColor }}
              />
              <div
                className="absolute bottom-0 left-0 w-20 h-20 rounded-full translate-y-6 -translate-x-6"
                style={{ backgroundColor: secondaryColor }}
              />
            </div>

            <div className="relative z-10 flex items-center justify-between overflow-visible">
              {/* Logo */}
              <div className="flex items-center">
                <Logo
                  href="/"
                  className="text-xl font-bold"
                  style={{ color: mainColor }}
                />
              </div>

              {/* Navigation Links */}
              <NavigationMenu className="hidden md:block overflow-visible">
                <NavigationMenuList className="gap-0 overflow-visible">
                  {navItems.map((item, itemIndex) => (
                    <NavigationMenuItem
                      key={`desktop-nav-${itemIndex}-${item.href}`}
                      className="overflow-visible"
                    >
                      {item.submenu || item.submenuColumns ? (
                        <>
                          <NavigationMenuTrigger
                            className={cn(
                              'px-4 py-2 text-sm font-semibold text-gray-700 rounded-3xl transition-all duration-300',
                              item.isLink
                                ? 'hover:text-gray-900 hover:bg-gray-50 cursor-pointer'
                                : 'cursor-default',
                            )}
                            style={{ color: mainColor }}
                            onClick={(e: any) => {
                              if (item.isLink) {
                                e.stopPropagation();
                                e.preventDefault();
                                if (
                                  item.action === 'openContact' ||
                                  /contact|konsultasi/i.test(item.href || item.label)
                                ) {
                                  openContactDialog();
                                } else {
                                  handleNavigation(
                                    `desktop-toplink-${itemIndex}-${item.href}`,
                                    item.href,
                                    item.isLink,
                                  );
                                }
                              }
                            }}
                          >
                            <Link
                              id={`desktop-toplink-${itemIndex}-${item.href}`}
                              hidden
                              href={item.href}
                            />
                            <span className="flex items-center gap-1 relative">
                              {item.label}
                              {item.badge &&
                                (() => {
                                  const bs = getBadgeStyles(item.badge!.variant);
                                  return (
                                    <span
                                      className="absolute -top-2.5 left-full -ml-4 text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-sm whitespace-nowrap"
                                      style={{ background: bs.bg, color: bs.text }}
                                    >
                                      {item.badge!.text}
                                    </span>
                                  );
                                })()}
                            </span>
                          </NavigationMenuTrigger>
                          <NavigationMenuContent className="overflow-hidden border-0 p-0 shadow-none !rounded-3xl !bg-transparent">
                            {item.submenuColumns ? (
                              <div
                                className="p-4 bg-white z-50 overflow-visible"
                                style={{
                                  width: `${item.submenuColumns.length * 280}px`,
                                }}
                              >
                                <div
                                  className="grid gap-6"
                                  style={{
                                    gridTemplateColumns: `repeat(${item.submenuColumns.length}, 1fr)`,
                                  }}
                                >
                                  {item.submenuColumns.map((column, colIndex) => (
                                    <div
                                      key={colIndex}
                                      className={cn(
                                        'space-y-2',
                                        colIndex !== item.submenuColumns!.length - 1 &&
                                          'border-r border-gray-100 pr-6',
                                      )}
                                    >
                                      {column.title && (
                                        <div className="px-3 pb-2 border-b border-gray-100">
                                          <h3
                                            className="text-xs font-bold uppercase tracking-wider"
                                            style={{ color: mainColor }}
                                          >
                                            {column.title}
                                          </h3>
                                        </div>
                                      )}

                                      <div className="space-y-1">
                                        {column.items.map((subItem, subItemIndex) => {
                                          const IconComponent = getIconComponent(subItem.icon);
                                          const badgeStyles = subItem.badge
                                            ? getBadgeStyles(subItem.badge.variant)
                                            : null;
                                          const LinkId = `desktop-submenu-link-${itemIndex}-${colIndex}-${subItemIndex}-${subItem.href}`;

                                          return (
                                            <button
                                              key={`desktop-submenu-${itemIndex}-${colIndex}-${subItemIndex}-${subItem.href}`}
                                              onClick={() => {
                                                handleNavigation(LinkId, subItem.href, subItem.isLink);
                                              }}
                                              className="group w-full text-left px-3 py-2.5 text-sm rounded-3xl transition-all duration-200 relative"
                                              style={{ color: mainColor }}
                                              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                                                (e.currentTarget as any).style.backgroundColor =
                                                  hexToRgba(mainColor, 0.08);
                                              }}
                                              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                                                (e.currentTarget as any).style.backgroundColor =
                                                  'transparent';
                                              }}
                                            >
                                              <Link
                                                id={LinkId}
                                                href={
                                                  column.title === 'Program'
                                                    ? `${subItem.href}`
                                                    : `${item.href}`
                                                }
                                                hidden
                                              />
                                              <div className="flex items-start gap-3">
                                                {IconComponent && (
                                                  <div
                                                    className="mt-0.5 p-1.5 rounded-3xl transition-all duration-200 group-hover:scale-110"
                                                    style={{
                                                      backgroundColor: hexToRgba(mainColor, 0.1),
                                                    }}
                                                  >
                                                    <IconComponent
                                                      className="w-4 h-4"
                                                      style={{ color: mainColor }}
                                                    />
                                                  </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                  <div className="flex items-center gap-2 mb-0.5">
                                                    <span className="font-bold text-sm">
                                                      {renderLabel(subItem.label)}
                                                    </span>
                                                    {subItem.badge && badgeStyles && (
                                                      <span
                                                        className="px-2 py-0.5 rounded-full text-[10px] font-black tracking-wide"
                                                        style={{
                                                          background: badgeStyles.bg,
                                                          color: badgeStyles.text,
                                                        }}
                                                      >
                                                        {subItem.badge.text}
                                                      </span>
                                                    )}
                                                  </div>
                                                  {subItem.description && (
                                                    <p className="text-xs text-gray-500 leading-snug">
                                                      {subItem.description}
                                                    </p>
                                                  )}
                                                </div>
                                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 shrink-0 mt-1" />
                                              </div>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div
                                className="w-64 p-3 bg-white rounded-3xl shadow-2xl border z-50 overflow-visible"
                                style={{ borderColor: hexToRgba(mainColor, 0.2) }}
                              >
                                <div className="space-y-1">
                                  {item.submenu!.map((subItem, singleSubIndex) => (
                                    <button
                                      key={`desktop-single-submenu-${itemIndex}-${singleSubIndex}-${subItem.href}`}
                                      onClick={() => {
                                        handleNavigation(
                                          `desktop-single-submenu-${itemIndex}-${singleSubIndex}-${subItem.href}`,
                                          subItem.href,
                                          subItem.isLink,
                                        );
                                      }}
                                      className="group w-full text-left px-4 py-3 text-sm rounded-3xl transition-all duration-200"
                                      style={{ color: mainColor }}
                                      onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                                        (e.currentTarget as any).style.backgroundColor =
                                          hexToRgba(mainColor, 0.08);
                                      }}
                                      onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                                        (e.currentTarget as any).style.backgroundColor =
                                          'transparent';
                                      }}
                                    >
                                      <Link
                                        id={`desktop-single-submenu-${itemIndex}-${singleSubIndex}-${subItem.href}`}
                                        hidden
                                        href={item.href}
                                      />
                                      <div className="font-bold flex items-center justify-between">
                                        <span>{renderLabel(subItem.label)}</span>
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
                            )}
                          </NavigationMenuContent>
                        </>
                      ) : (
                        <NavigationMenuLink
                          asChild
                          className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 rounded-3xl transition-all duration-300 hover:bg-gray-50"
                        >
                          <Link href={item.href} style={{ color: mainColor }}>
                            <span className="flex items-center gap-1 relative">
                              {item.label}
                              {item.badge &&
                                (() => {
                                  const bs = getBadgeStyles(item.badge!.variant);
                                  return (
                                    <span
                                      className="absolute -top-2.5 left-full ml-0.5 text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-sm whitespace-nowrap"
                                      style={{ background: bs.bg, color: bs.text }}
                                    >
                                      {item.badge!.text}
                                    </span>
                                  );
                                })()}
                            </span>
                          </Link>
                        </NavigationMenuLink>
                      )}
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>

              {/* Auth Section */}
              <div className="flex items-center gap-2 p-2">
                {!session ? (
                  <div className="flex items-center rounded-3xl shadow-md overflow-hidden">
                    <Link href="/price">
                      <Button
                        className="px-3 py-2 rounded-none text-xs font-semibold text-white border-0 transition-all duration-300 hover:brightness-110 h-8"
                        style={{ backgroundColor: '#f59e0b' }}
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </Button>
                    </Link>
                    <div className="w-px h-5 bg-white/20" />
                    <Button
                      className="px-4 py-2 rounded-none text-xs font-semibold text-white border-0 transition-all duration-300 hover:brightness-110 h-8"
                      style={{
                        backgroundImage: `linear-gradient(145deg, ${secondaryColor}, ${mainColor})`,
                      }}
                      onClick={() =>
                        setShowAuth((prev) => ({
                          ...prev,
                          open: true,
                          redirect: website_sub_category_id
                            ? `/${website_sub_category_id}/user/bimboard`
                            : '/choice/user/bimboard',
                        }))
                      }
                    >
                      Daftar/Masuk
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-1">
                    <div className="flex items-center rounded-3xl shadow-md overflow-hidden">
                      <Link href="/price">
                        <Button
                          className="px-3 py-2 rounded-none text-xs font-semibold text-white border-0 transition-all duration-300 hover:brightness-110 h-8"
                          style={{ backgroundColor: '#f59e0b' }}
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </Button>
                      </Link>
                      <div className="w-px h-5 bg-white/20" />
                      <Link href={`/${website_sub_category_id}/user/bimboard`}>
                        <Button
                          className="px-4 py-2 rounded-none text-xs font-semibold text-white border-0 transition-all duration-300 hover:brightness-110 h-8"
                          style={{
                            backgroundImage: `linear-gradient(145deg, ${secondaryColor}, ${mainColor})`,
                          }}
                        >
                          Dashboard
                        </Button>
                      </Link>
                    </div>

                    {/* Hamburger Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="px-2 py-2 rounded-3xl border-0 transition-all duration-300 hover:brightness-110 h-8 shadow-md"
                          style={{
                            backgroundImage: `linear-gradient(145deg, ${secondaryColor}, ${mainColor})`,
                            color: '#ffffff',
                          }}
                        >
                          <Menu className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-80 p-0 border shadow-xl rounded-3xl overflow-hidden"
                        sideOffset={12}
                      >
                        {/* Header - User Profile Section */}
                        <div className="p-5 bg-white border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="h-16 w-16 ring-2 ring-gray-100">
                                <AvatarImage
                                  src={session?.user?.image ?? ''}
                                  alt={session?.user?.name ?? ''}
                                  className="object-cover"
                                />
                                <AvatarFallback
                                  className="text-white text-xl font-bold"
                                  style={{
                                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                  }}
                                >
                                  {session?.user?.name
                                    ? session.user.name[0].toUpperCase()
                                    : 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-lg font-bold text-gray-900 truncate">
                                {session?.user?.name}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {session?.user?.email}
                              </p>
                              <div className="mt-1.5">
                                <span
                                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold text-white"
                                  style={{ backgroundColor: mainColor }}
                                >
                                  <span className="w-1.5 h-1.5 bg-white rounded-full" />
                                  Online
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2 bg-white">
                          <DropdownMenuItem asChild className="p-0">
                            <Link
                              href={`/${website_sub_category_id}/user/bimboard`}
                              className="flex items-center gap-3 px-4 py-3 rounded-3xl transition-all duration-200 group hover:bg-gray-50"
                            >
                              <div
                                className="w-11 h-11 rounded-3xl flex items-center justify-center"
                                style={{ backgroundColor: `${mainColor}15` }}
                              >
                                <LayoutDashboard
                                  className="h-5 w-5"
                                  style={{ color: mainColor }}
                                />
                              </div>
                              <div className="flex-1">
                                <p className="text-base font-bold text-gray-900">Dashboard</p>
                                <p className="text-xs text-gray-500">Akses panel utama</p>
                              </div>
                              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                            </Link>
                          </DropdownMenuItem>

                          {(session?.user?.role === 'ADMIN' ||
                            session?.user?.role === 'SUPER_ADMIN' ||
                            session?.user.role === 'FINANCE') && (
                            <DropdownMenuItem asChild className="p-0 mt-1">
                              <Link
                                href={`/${website_sub_category_id}/admin`}
                                className="flex items-center gap-3 px-4 py-3 rounded-3xl transition-all duration-200 group hover:bg-gray-50"
                              >
                                <div
                                  className="w-11 h-11 rounded-3xl flex items-center justify-center"
                                  style={{ backgroundColor: `${mainColor}15` }}
                                >
                                  <LayoutDashboard
                                    className="h-5 w-5"
                                    style={{ color: mainColor }}
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="text-base font-bold text-gray-900">Admin Panel</p>
                                  <p className="text-xs text-gray-500">Kelola sistem</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                              </Link>
                            </DropdownMenuItem>
                          )}

                          <div className="my-2 h-px bg-gray-200" />

                          <DropdownMenuItem
                            className="p-0"
                            onSelect={(event) => {
                              event.preventDefault();
                              signOut({ callbackUrl: '/' });
                            }}
                          >
                            <div className="flex items-center gap-3 px-4 py-3 rounded-3xl transition-all duration-200 group hover:bg-red-50 cursor-pointer w-full">
                              <div className="w-11 h-11 rounded-3xl bg-red-100 flex items-center justify-center">
                                <LogOut className="h-5 w-5 text-red-600" />
                              </div>
                              <div className="flex-1">
                                <p className="text-base font-bold text-red-600">Keluar</p>
                                <p className="text-xs text-red-500">Logout dari akun</p>
                              </div>
                            </div>
                          </DropdownMenuItem>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
