'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

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
import { ArrowRight, LayoutDashboard, LogOut, Menu, ShoppingBag, X } from 'lucide-react';

import { useAppContext } from '@/components/provider/provider-app';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import Logo from '@/components/ui/logo';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { signOut } from '@/lib/auth-helper';
import { cn } from '@/lib/utils';
import { hexToRgba } from '@/styles/main-styles';

import type { NavItem, SubmenuItem } from './navbar-types';
import {
  getBadgeStyles,
  getIconComponent,
  openContactDialog,
  renderLabel,
} from './navbar-types';

interface MobileNavProps {
  navItems: NavItem[];
  isSheetOpen: boolean;
  setIsSheetOpen: (open: boolean) => void;
  session: any;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  navItems,
  isSheetOpen,
  setIsSheetOpen,
  session,
}) => {
  const {
    useAuth: { setShowAuth },
  } = useAppContext();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

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

  const handleNavigation = (
    LinkId: string,
    href: string,
    isLink?: boolean,
    action?: 'openContact',
  ) => {
    const link = document.getElementById(LinkId);
    if (action === 'openContact' || /contact|konsultasi/i.test(href)) {
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
    setIsSheetOpen(false);
  };

  return (
    <div className="fixed left-0 top-0 z-50 w-full">
      <Card className="mx-3 mt-3 shadow-xl border rounded-3xl backdrop-blur-xl overflow-hidden">
        <div className="px-4 py-3 relative bg-transparent">
          <div className="relative z-10 flex items-center justify-between">
            <Logo
              href="/"
              className="text-xl font-bold"
              style={{ color: mainColor }}
            />

            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-3xl shadow-lg overflow-hidden">
                <Link href="/price">
                  <Button
                    className="px-3 py-2.5 rounded-none text-sm font-semibold text-white border-0 transition-all duration-300 hover:brightness-110 active:scale-95"
                    style={{ backgroundColor: '#f59e0b' }}
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </Button>
                </Link>
                <div className="w-px h-8 bg-white/20" />
                {!session && (
                  <Button
                    className="px-6 py-2.5 rounded-none text-sm font-semibold text-white border-0 transition-all duration-300 hover:brightness-110 active:scale-95"
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
                    Masuk
                  </Button>
                )}
                {session && (
                  <Link href={`/${website_sub_category_id}/user/bimboard`}>
                    <Button
                      className="px-6 py-2.5 rounded-none text-sm font-semibold text-white border-0 transition-all duration-300 hover:brightness-110 active:scale-95"
                      style={{
                        backgroundImage: `linear-gradient(145deg, ${secondaryColor}, ${mainColor})`,
                      }}
                    >
                      Dashboard
                    </Button>
                  </Link>
                )}
              </div>
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative w-10 h-10 rounded-3xl transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: hexToRgba(mainColor, 0.1),
                      color: mainColor,
                    }}
                  >
                    {isSheetOpen ? <X size={20} /> : <Menu size={20} />}
                  </Button>
                </SheetTrigger>

                <SheetContent
                  side="bottom"
                  className="h-fit max-h-[85vh] rounded-t-2xl border-none bg-white px-0 pt-0"
                >
                  <SheetHeader className="sr-only">
                    <SheetTitle>Menu Navigasi</SheetTitle>
                    <VisuallyHidden>
                      <p>Jelajahi semua fitur yang tersedia</p>
                    </VisuallyHidden>
                  </SheetHeader>

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

                  <div className="px-6 pb-6 space-y-3 max-h-[60vh] overflow-y-auto">
                    <div className="space-y-2">
                      {navItems.map((item, index) => {
                        const hasSubmenu = item.submenu || item.submenuColumns;
                        const isExpanded = expandedItem === index;
                        const badgeStyles = item.badge
                          ? getBadgeStyles(item.badge.variant)
                          : null;

                        return (
                          <div
                            key={`mobile-nav-${index}-${item.href}`}
                            className="rounded-3xl overflow-hidden"
                            style={{
                              backgroundColor: isExpanded
                                ? hexToRgba(mainColor, 0.05)
                                : 'transparent',
                            }}
                          >
                            <Link
                              id={`mobile-nav-${index}-${item.href}`}
                              hidden
                              href={item.href}
                            />
                            <button
                              onClick={() => {
                                if (hasSubmenu) {
                                  setExpandedItem(isExpanded ? null : index);
                                } else {
                                  handleNavigation(
                                    `mobile-nav-${index}-${item.href}`,
                                    item.href,
                                    item.isLink,
                                    item.action,
                                  );
                                }
                              }}
                              className="w-full flex items-center justify-between p-4 rounded-3xl transition-all duration-200"
                              style={{
                                backgroundColor: isExpanded
                                  ? 'transparent'
                                  : hexToRgba(mainColor, 0.03),
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-8 h-8 rounded-3xl flex items-center justify-center text-sm font-bold text-white shadow-sm"
                                  style={{
                                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                  }}
                                >
                                  {index + 1}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span
                                    className="font-semibold text-base"
                                    style={{ color: mainColor }}
                                  >
                                    {item.label}
                                  </span>
                                  {item.badge && badgeStyles && (
                                    <span
                                      className="text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm"
                                      style={{
                                        background: badgeStyles.bg,
                                        color: badgeStyles.text,
                                      }}
                                    >
                                      {item.badge.text}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-gray-400">
                                {hasSubmenu ? (
                                  <svg
                                    className={cn(
                                      'w-5 h-5 transition-transform duration-200',
                                      isExpanded && 'rotate-180',
                                    )}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                ) : (
                                  <ArrowRight
                                    className="w-5 h-5"
                                    style={{ color: mainColor }}
                                  />
                                )}
                              </div>
                            </button>

                            {hasSubmenu && isExpanded && (
                              <div className="px-4 pb-3 pt-1 space-y-1">
                                {(() => {
                                  const allItems: SubmenuItem[] = [];
                                  if (item.submenuColumns) {
                                    item.submenuColumns.forEach((col) => {
                                      allItems.push(...col.items);
                                    });
                                  } else if (item.submenu) {
                                    allItems.push(...item.submenu);
                                  }

                                  return allItems.map((subItem, subIndex) => {
                                    const IconComponent = getIconComponent(subItem.icon);
                                    const subBadgeStyles = subItem.badge
                                      ? getBadgeStyles(subItem.badge.variant)
                                      : null;

                                    return (
                                      <button
                                        key={`mobile-sub-menu-${subItem.href}-${subIndex}`}
                                        onClick={() =>
                                          handleNavigation(
                                            `mobile-sub-menu-${subItem.href}-${subIndex}`,
                                            subItem.href,
                                            subItem.isLink,
                                            subItem.action,
                                          )
                                        }
                                        className="w-full flex items-start gap-3 p-3 rounded-3xl transition-all duration-200 hover:bg-white"
                                        style={{
                                          backgroundColor: hexToRgba(mainColor, 0.02),
                                        }}
                                      >
                                        <Link
                                          id={`mobile-sub-menu-${subItem.href}-${subIndex}`}
                                          href={
                                            subItem.href.startsWith('/price/')
                                              ? `${subItem.href}`
                                              : `${item.href}`
                                          }
                                          hidden
                                        />
                                        {IconComponent && (
                                          <div
                                            className="mt-0.5 p-2 rounded-3xl shrink-0"
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
                                        <div className="flex-1 text-left min-w-0">
                                          <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-sm text-gray-900">
                                              {renderLabel(subItem.label)}
                                            </span>
                                            {subItem.badge && subBadgeStyles && (
                                              <span
                                                className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
                                                style={{
                                                  background: subBadgeStyles.bg,
                                                  color: subBadgeStyles.text,
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
                                        <ArrowRight className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
                                      </button>
                                    );
                                  });
                                })()}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* User Profile Section */}
                    <div className="border-t border-gray-100 pt-4">
                      {session ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 p-4 rounded-3xl bg-gray-50">
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
                          <div className="grid grid-cols-2 gap-2">
                            <Link
                              href={`/${website_sub_category_id}/user/bimarena/try-out`}
                              onClick={() => setIsSheetOpen(false)}
                              className="flex items-center justify-center gap-2 p-2 rounded-3xl bg-gray-100 hover:bg-gray-200 transition-colors"
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
                              className="flex items-center justify-center gap-2 p-2 rounded-3xl bg-red-50 hover:bg-red-100 transition-colors"
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
                          className="w-full h-12 rounded-3xl font-medium text-white"
                          style={{ backgroundColor: mainColor }}
                          onClick={() => {
                            setShowAuth((prev) => ({
                              ...prev,
                              open: true,
                              redirect: website_sub_category_id
                                ? `/${website_sub_category_id}/user/bimboard`
                                : '/choice/user/bimboard',
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
        </div>
      </Card>
    </div>
  );
};
