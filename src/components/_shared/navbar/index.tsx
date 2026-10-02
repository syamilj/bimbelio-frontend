import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMedia } from 'use-media';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BimBot } from '@/components/ui/bim-brand';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import {
  ArrowRight,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  ShoppingBag,
  X,
} from 'lucide-react';

import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import Logo from '@/components/ui/logo';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { signOut } from '@/lib/auth-helper';
import { PLAN_CACHE_MS } from '@/lib/fetch-helper/fetch-helper';
import { useGet } from '@/lib/fetch-helper/useGet';
import { hexToRgba } from '@/lib/theme/track-theme';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { PlanDataType } from '../other/card-plan/_provider/types';

// Helper to render labels with BimBrand styling
const renderLabel = (label: string): React.ReactNode => {
  // Check for "Bimbot" patterns
  if (label === 'Bimbot AI') {
    return (
      <>
        <BimBot /> AI
      </>
    );
  }
  return label;
};

// Enhanced types untuk multi-column submenu
interface SubmenuItem {
  href: string;
  label: string;
  isLink?: boolean;
  description?: string;
  icon?: string; // Nama icon dari Lucide, e.g. 'BookOpen', 'Target'
  badge?: {
    text: string; // e.g. 'GRATIS', 'NEW', 'PREMIUM'
    variant?: 'success' | 'info' | 'warning' | 'premium'; // Color variants
  };
  // Optional action for special behaviours (e.g. open contact modal)
  action?: 'openContact';
}

interface SubmenuColumn {
  title?: string; // Column header, optional
  items: SubmenuItem[];
}

interface NavItem {
  href: string;
  label: string;
  isLink?: boolean;
  submenu?: SubmenuItem[]; // Simple single column (backward compatible)
  submenuColumns?: SubmenuColumn[]; // Advanced multi-column layout
  // Optional badge at top-level menu
  badge?: {
    text: string;
    variant?: 'success' | 'info' | 'warning' | 'premium';
  };
  // Optional action for top-level menu
  action?: 'openContact';
}

const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Fitur',
    isLink: false,
    // Multi-column submenu dengan headers dan icons
    submenuColumns: [
      {
        title: 'Metode Belajar',
        items: [
          {
            href: '#solution',
            label: 'PRINTS',
            description: 'Metode pembelajaran',
            badge: { text: 'FRAMEWORK', variant: 'success' },
            icon: 'Sparkles',
          },
          {
            href: '#timeline',
            label: 'Timeline',
            badge: { text: 'KALENDER', variant: 'info' },
            description: 'Jadwal belajar terstruktur',
            icon: 'Calendar',
          },
          {
            href: '#ecosystem',
            label: 'Ekosistem',
            description: 'Lingkungan belajar lengkap',
            icon: 'Layers',
          },
        ],
      },
      {
        title: '3-Layer System',
        items: [
          {
            href: '#3-layer',
            label: 'Tutor',
            description: 'Diajar oleh yang terbaik',
            icon: 'UserCheck',
            badge: { text: 'TOP ONLY', variant: 'warning' },
            // isLink: true,
          },
          {
            href: '#3-layer',
            label: 'Mentor',
            description: 'Dibimbing oleh yang relevan',
            icon: 'UserCheck',
            // isLink: true,
          },
          {
            href: '#3-layer',
            label: 'Bimbot AI',
            description: '24/7 AI yang membantu belajar',
            icon: 'BotMessageSquare',
            badge: { text: 'AI', variant: 'premium' },
            // isLink: true,
          },
        ],
      },
      {
        title: 'Informasi',
        items: [
          {
            href: '#tryout',
            label: 'Try Out Online',
            description: 'Simulasi ujian real-time',
            icon: 'Timer',
            badge: { text: 'GRATIS', variant: 'info' },
            // isLink: true,
          },
          {
            href: '#live-learning',
            label: 'Live Learning Online',
            description: 'Simulasi ujian real-time',
            icon: 'Timer',
            badge: { text: 'GRATIS', variant: 'info' },
            // isLink: true,
          },
          // {
          //   href: '#ecosystem',
          //   label: 'Analisis',
          //   description: 'Laporan detail kemampuan',
          //   icon: 'TrendingUp',
          //   badge: { text: 'PREMIUM', variant: 'premium' },
          //   // isLink: true,
          // },
        ],
      },
    ],
  },
  {
    href: '/price',
    label: 'Program',
    isLink: true,
    badge: { text: 'PROMO', variant: 'warning' },
    submenuColumns: [
      {
        title: 'Product',
        items: [
          {
            href: '#price-plan',
            label: 'All Program',
            description: 'Kelas eksklusif',
            badge: { text: '1-ON-1', variant: 'premium' },
            icon: 'UserPlus',
            isLink: true,
          },
          // {
          //   href: '#price-coin',
          //   label: 'Try Out',
          //   description: 'Latihan tanpa bayar',
          //   icon: 'Gift',
          //   badge: { text: 'GRATIS', variant: 'success' },
          //   isLink: true,
          // },
        ],
      },
    ],
  },
  {
    href: '/calendar',
    label: 'Kalender',
    isLink: true,
    badge: { text: 'EVENT', variant: 'info' },
    submenuColumns: [
      {
        title: 'Jadwal Event',
        items: [
          {
            href: '/calendar',
            label: 'Semua Event',
            description: 'Lihat seluruh jadwal event',
            icon: 'Calendar',
            badge: { text: 'GRATIS', variant: 'success' },
            isLink: true,
          },
          {
            href: '/calendar?type=webinar',
            label: 'Webinar',
            description: 'Sesi belajar online bersama expert',
            icon: 'Video',
            badge: { text: 'LIVE', variant: 'info' },
            isLink: true,
          },
          {
            href: '/calendar?type=live-class',
            label: 'Live Class',
            description: 'Sesi belajar langsung bersama tutor',
            icon: 'Video',
            badge: { text: 'LIVE', variant: 'info' },
            isLink: true,
          },
          {
            href: '/calendar?type=ujian',
            label: 'Try Out',
            description: 'Try Out online dengan timer',
            icon: 'Clock',
            badge: { text: 'GRATIS', variant: 'success' },
            isLink: true,
          },
        ],
      },
    ],
  },
  {
    href: '/blog',
    label: 'Lainnya',
    isLink: false,
    submenuColumns: [
      {
        title: 'Lainnya',
        items: [
          {
            href: '/blog',
            label: 'Blog',
            description: 'Insight & tips belajar',
            icon: 'Users',
            badge: { text: 'GRATIS', variant: 'success' },
            isLink: true,
          },
          {
            href: '/l/wa-grup',
            label: 'WhatsApp',
            description: 'Grup belajar online',
            icon: 'Users',
            badge: { text: 'GRATIS', variant: 'success' },
            isLink: true,
          },
          {
            href: '/#contact',
            label: 'Konsultasi',
            description: 'Hubungi tim kami untuk bantuan',
            icon: 'PhoneCall',
            badge: { text: 'GRATIS', variant: 'success' },
            isLink: true,
          },
        ],
      },
    ],
  },
];

// Helper: Get Lucide icon component by name
const getIconComponent = (iconName?: string): LucideIcon | null => {
  if (!iconName) return null;
  return (LucideIcons as any)[iconName] || null;
};

// Helper: Get badge styling based on variant
const getBadgeStyles = (variant?: string) => {
  const styles = {
    success: {
      bg: '#10b981',
      text: 'white',
    },
    info: {
      bg: '#3b82f6',
      text: 'white',
    },
    warning: {
      bg: '#f59e0b',
      text: 'white',
    },
    premium: {
      bg: 'linear-gradient(135deg, #ffd700, #ffed4e)',
      text: '#000',
    },
  };
  return styles[variant as keyof typeof styles] || styles.info;
};

// Helper: open the floating contact dialog by programmatically clicking the floating button
const openContactDialog = () => {
  try {
    const btn = document.querySelector(
      'button[aria-label="Buka menu konsultasi"]',
    ) as HTMLElement | null;
    if (btn) {
      btn.click();
      return true;
    }
    // fallback: try PhoneCall aria label
    const altBtn = document.querySelector(
      'button[role="button"]',
    ) as HTMLElement | null;
    if (altBtn) {
      altBtn.click();
      return true;
    }
    console.warn('Floating contact button not found');
    return false;
  } catch (error) {
    console.warn('Error opening contact dialog', error);
    return false;
  }
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
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  // Get dynamic colors
  const pathname = usePathname();

  // Get dynamic colors
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
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleNavigation = (
    LinkId: string,
    href: string,
    isLink?: boolean,
    action?: 'openContact',
  ) => {
    const Link = document.getElementById(LinkId);
    // Special: if href indicates contact, open floating contact dialog instead
    if (action === 'openContact' || /contact|konsultasi/i.test(href)) {
      openContactDialog();
      return;
    }
    if (isLink) {
      if (href.startsWith('#price') && pathname.toLowerCase() === '/price') {
        handleScrollToTarget(href);
      } else {
        Link?.click();
      }
    } else {
      if (pathname !== '/') {
        Link?.click();
      } else {
        handleScrollToTarget(href);
      }
    }
    setIsSheetOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 z-50 w-full">
      {/* Enhanced Mobile Header */}
      <Card className="mx-3 mt-3 overflow-hidden rounded-3xl border shadow-xl backdrop-blur-xl">
        <div className="relative bg-transparent px-4 py-3">
          {/* Background Pattern */}
          {/* <div className="absolute inset-0 opacity-5">
            <div
              className="absolute bottom-0 left-0 w-12 h-12 rounded-full translate-y-3 -translate-x-3"
              style={{
                backgroundColor: mainColor,
              }}
            />
          </div> */}

          <div className="relative z-10 flex items-center justify-between">
            <Logo
              href="/"
              className="text-xl font-bold"
              style={{
                color: mainColor,
              }}
            />

            <div className="flex items-center gap-2">
              {/* Combined Button: Shop (1/4) + Login/Dashboard (3/4) */}
              <div className="flex items-center overflow-hidden rounded-3xl shadow-lg">
                {/* Shop Button - 1/4 */}
                <Link href="/price">
                  <Button
                    className="rounded-none border-0 px-3 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:brightness-110 active:scale-95"
                    style={{
                      backgroundColor: '#f59e0b', // Yellow/amber for shopping
                    }}
                  >
                    <ShoppingBag className="h-4 w-4" />
                  </Button>
                </Link>

                {/* Divider */}
                <div className="h-8 w-px bg-white/20" />

                {/* Login/Dashboard Button - 3/4 */}
                {!session && (
                  <Button
                    className="rounded-none border-0 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:brightness-110 active:scale-95"
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
                      className="rounded-none border-0 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:brightness-110 active:scale-95"
                      style={{
                        backgroundImage: `linear-gradient(145deg, ${secondaryColor}, ${mainColor})`,
                      }}
                    >
                      Dashboard
                    </Button>
                  </Link>
                )}
              </div>
              <Sheet
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
              >
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-10 w-10 rounded-3xl transition-all duration-300 hover:scale-105"
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
                  {/* Add hidden title for accessibility */}
                  <SheetHeader className="sr-only">
                    <SheetTitle>Menu Navigasi</SheetTitle>
                    <VisuallyHidden>
                      <p>Jelajahi semua fitur yang tersedia</p>
                    </VisuallyHidden>
                  </SheetHeader>

                  {/* Simple Clean Header */}
                  <div className="border-b border-gray-100 p-6 pb-4">
                    <div className="text-center">
                      <h2 className="mb-1 text-lg font-semibold text-gray-900">
                        Menu Navigasi
                      </h2>
                      <p className="text-sm text-gray-500">
                        Jelajahi semua fitur yang tersedia
                      </p>
                    </div>
                  </div>

                  {/* Clean Content */}
                  <div className="max-h-[60vh] space-y-3 overflow-y-auto px-6 pb-6">
                    {/* Navigation Items - Expandable Accordion */}
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
                            className="overflow-hidden rounded-3xl"
                            style={{
                              backgroundColor: isExpanded
                                ? hexToRgba(mainColor, 0.05)
                                : 'transparent',
                            }}
                          >
                            {/* Top-level menu item */}
                            <Link
                              id={`mobile-nav-${index}-${item.href}`}
                              hidden
                              href={item.href}
                            ></Link>
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
                              className="flex w-full items-center justify-between rounded-3xl p-4 transition-all duration-200"
                              style={{
                                backgroundColor: isExpanded
                                  ? 'transparent'
                                  : hexToRgba(mainColor, 0.03),
                              }}
                            >
                              <div className="flex items-center gap-3">
                                {/* Number badge */}
                                <div
                                  className="flex h-8 w-8 items-center justify-center rounded-3xl text-sm font-bold text-white shadow-sm"
                                  style={{
                                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                  }}
                                >
                                  {index + 1}
                                </div>

                                {/* Label with badge */}
                                <div className="flex items-center gap-2">
                                  <span
                                    className="text-base font-semibold"
                                    style={{ color: mainColor }}
                                  >
                                    {item.label}
                                  </span>
                                  {/* Top-level badge */}
                                  {item.badge && badgeStyles && (
                                    <span
                                      className="rounded-full px-2 py-0.5 text-[9px] font-black shadow-sm"
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

                              {/* Right indicator */}
                              <div className="text-gray-400">
                                {hasSubmenu ? (
                                  <svg
                                    className={cn(
                                      'h-5 w-5 transition-transform duration-200',
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
                                    className="h-5 w-5"
                                    style={{ color: mainColor }}
                                  />
                                )}
                              </div>
                            </button>

                            {/* Submenu expansion */}
                            {hasSubmenu && isExpanded && (
                              <div className="space-y-1 px-4 pt-1 pb-3">
                                {/* Get all submenu items from either structure */}
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
                                    const IconComponent = getIconComponent(
                                      subItem.icon,
                                    );
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
                                        className="flex w-full items-start gap-3 rounded-3xl p-3 transition-all duration-200 hover:bg-white"
                                        style={{
                                          backgroundColor: hexToRgba(
                                            mainColor,
                                            0.02,
                                          ),
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
                                        ></Link>
                                        {/* Icon */}
                                        {IconComponent && (
                                          <div
                                            className="mt-0.5 shrink-0 rounded-3xl p-2"
                                            style={{
                                              backgroundColor: hexToRgba(
                                                mainColor,
                                                0.1,
                                              ),
                                            }}
                                          >
                                            <IconComponent
                                              className="h-4 w-4"
                                              style={{ color: mainColor }}
                                            />
                                          </div>
                                        )}

                                        {/* Content */}
                                        <div className="min-w-0 flex-1 text-left">
                                          <div className="mb-1 flex items-center gap-2">
                                            <span className="text-sm font-bold text-gray-900">
                                              {renderLabel(subItem.label)}
                                            </span>
                                            {/* Submenu badge */}
                                            {subItem.badge &&
                                              subBadgeStyles && (
                                                <span
                                                  className="rounded-full px-1.5 py-0.5 text-[9px] font-black"
                                                  style={{
                                                    background:
                                                      subBadgeStyles.bg,
                                                    color: subBadgeStyles.text,
                                                  }}
                                                >
                                                  {subItem.badge.text}
                                                </span>
                                              )}
                                          </div>
                                          {subItem.description && (
                                            <p className="text-xs leading-snug text-gray-500">
                                              {subItem.description}
                                            </p>
                                          )}
                                        </div>

                                        {/* Arrow */}
                                        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-gray-400" />
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

                    {/* User Profile Section - Clean Version */}
                    <div className="border-t border-gray-100 pt-4">
                      {session ? (
                        <div className="space-y-4">
                          {/* User Info - Simple */}
                          <div className="flex items-center gap-3 rounded-3xl bg-gray-50 p-4">
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
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-medium text-gray-900">
                                {session.user.name}
                              </p>
                              <p className="truncate text-sm text-gray-500">
                                {session.user.email}
                              </p>
                            </div>
                          </div>

                          {/* Action Buttons - Simple Grid */}
                          <div className="grid grid-cols-2 gap-2">
                            <Link
                              href={`/${website_sub_category_id}/user/bimarena/try-out`}
                              onClick={() => setIsSheetOpen(false)}
                              className="flex items-center justify-center gap-2 rounded-3xl bg-gray-100 p-2 transition-colors hover:bg-gray-200"
                            >
                              <LayoutDashboard className="h-4 w-4 text-gray-600" />
                              <span className="text-sm font-medium text-gray-700">
                                Dashboard
                              </span>
                            </Link>

                            <button
                              onClick={() => {
                                signOut({ callbackUrl: '/' });
                                setIsSheetOpen(false);
                              }}
                              className="flex items-center justify-center gap-2 rounded-3xl bg-red-50 p-2 transition-colors hover:bg-red-100"
                            >
                              <LogOut className="h-4 w-4 text-red-600" />
                              <span className="text-sm font-medium text-red-700">
                                Keluar
                              </span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          className="h-12 w-full rounded-3xl font-medium text-white"
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

const DesktopNav: React.FC<{
  navItems: NavItem[];
  session: any;
}> = ({ navItems, session }) => {
  const {
    useAuth: { setShowAuth },
  } = useAppContext();
  const { websiteSubCategory } = useWebsiteSubCategory();
  // const router = useRouter();
  const pathname = usePathname();

  // Get dynamic colors
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
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleNavigation = (LinkId: string, href: string, isLink?: boolean) => {
    const Link = document.getElementById(LinkId);
    console.log({ href, LinkId, isLink, Link });
    // Special: if href indicates contact, open floating contact dialog instead
    if (/contact|konsultasi/i.test(href)) {
      openContactDialog();
      return;
    }
    if (isLink) {
      if (href.startsWith('#price') && pathname.toLowerCase() === '/price') {
        handleScrollToTarget(href);
      } else {
        Link?.click();
      }
    } else {
      if (pathname !== '/') {
        Link?.click();
      } else {
        handleScrollToTarget(href);
      }
    }
  };

  return (
    <div className="pointer-events-none fixed top-0 left-0 z-50 w-full bg-transparent">
      <div className="pointer-events-auto mx-auto max-w-4xl px-4 pt-4">
        <Card className="overflow-visible rounded-3xl border bg-white shadow-md backdrop-blur-xl">
          <div
            className="relative z-[3] rounded-3xl bg-transparent px-6 py-4 md:py-1 lg:py-1"
            // style={{
            //   background: `linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))`,
            // }}
          >
            {/* Subtle background pattern */}
            <div className="absolute inset-0 overflow-hidden rounded-t-3xl opacity-5">
              <div
                className="absolute top-0 right-0 h-32 w-32 translate-x-12 -translate-y-12 rounded-full"
                style={{ backgroundColor: mainColor }}
              />
              <div
                className="absolute bottom-0 left-0 h-20 w-20 -translate-x-6 translate-y-6 rounded-full"
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
              <NavigationMenu className="hidden overflow-visible md:block">
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
                              'rounded-3xl px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-300',
                              item.isLink
                                ? 'cursor-pointer hover:bg-gray-50 hover:text-gray-900'
                                : 'cursor-default',
                            )}
                            style={{
                              color: mainColor,
                            }}
                            onClick={(e: any) => {
                              // If this top-level menu also represents a link, navigate
                              if (item.isLink) {
                                e.stopPropagation();
                                e.preventDefault();
                                // special case: open contact dialog
                                if (
                                  item.action === 'openContact' ||
                                  /contact|konsultasi/i.test(
                                    item.href || item.label,
                                  )
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
                            ></Link>
                            <span className="relative flex items-center gap-1">
                              {item.label}
                              {/* Top-level badge - superscript style */}
                              {item.badge &&
                                (() => {
                                  const bs = getBadgeStyles(
                                    item.badge!.variant,
                                  );
                                  return (
                                    <span
                                      className="absolute -top-2.5 left-full -ml-4 rounded-full px-1.5 py-0.5 text-[9px] font-black whitespace-nowrap shadow-sm"
                                      style={{
                                        background: bs.bg,
                                        color: bs.text,
                                      }}
                                    >
                                      {item.badge!.text}
                                    </span>
                                  );
                                })()}
                            </span>
                          </NavigationMenuTrigger>
                          <NavigationMenuContent className="overflow-hidden !rounded-3xl border-0 !bg-transparent p-0 shadow-none">
                            {/* Multi-column layout */}
                            {item.submenuColumns ? (
                              <div
                                className="z-50 overflow-visible bg-white p-4"
                                style={{
                                  width: `${item.submenuColumns.length * 280}px`,
                                }}
                              >
                                <div
                                  className={`grid gap-6`}
                                  style={{
                                    gridTemplateColumns: `repeat(${item.submenuColumns.length}, 1fr)`,
                                  }}
                                >
                                  {item.submenuColumns.map(
                                    (column, colIndex) => (
                                      <div
                                        key={colIndex}
                                        className={cn(
                                          'space-y-2',
                                          colIndex !==
                                            item.submenuColumns!.length - 1 &&
                                            'border-r border-gray-100 pr-6',
                                        )}
                                      >
                                        {/* Column Header */}
                                        {column.title && (
                                          <div className="border-b border-gray-100 px-3 pb-2">
                                            <h3
                                              className="text-xs font-bold tracking-wider uppercase"
                                              style={{ color: mainColor }}
                                            >
                                              {column.title}
                                            </h3>
                                          </div>
                                        )}

                                        {/* Column Items */}
                                        <div className="space-y-1">
                                          {column.items.map(
                                            (subItem, subItemIndex) => {
                                              const IconComponent =
                                                getIconComponent(subItem.icon);
                                              const badgeStyles = subItem.badge
                                                ? getBadgeStyles(
                                                    subItem.badge.variant,
                                                  )
                                                : null;

                                              const LinkId = `desktop-submenu-link-${itemIndex}-${colIndex}-${subItemIndex}-${subItem.href}`;

                                              return (
                                                <button
                                                  key={`desktop-submenu-${itemIndex}-${colIndex}-${subItemIndex}-${subItem.href}`}
                                                  onClick={() => {
                                                    handleNavigation(
                                                      LinkId,
                                                      subItem.href,
                                                      subItem.isLink,
                                                    );
                                                  }}
                                                  className="group relative w-full rounded-3xl px-3 py-2.5 text-left text-sm transition-all duration-200"
                                                  style={{
                                                    color: mainColor,
                                                  }}
                                                  onMouseEnter={(
                                                    e: React.MouseEvent<HTMLButtonElement>,
                                                  ) => {
                                                    (
                                                      e.currentTarget as any
                                                    ).style.backgroundColor =
                                                      hexToRgba(
                                                        mainColor,
                                                        0.08,
                                                      );
                                                  }}
                                                  onMouseLeave={(
                                                    e: React.MouseEvent<HTMLButtonElement>,
                                                  ) => {
                                                    (
                                                      e.currentTarget as any
                                                    ).style.backgroundColor =
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
                                                  ></Link>
                                                  <div className="flex items-start gap-3">
                                                    {/* Icon */}
                                                    {IconComponent && (
                                                      <div
                                                        className="mt-0.5 rounded-3xl p-1.5 transition-all duration-200 group-hover:scale-110"
                                                        style={{
                                                          backgroundColor:
                                                            hexToRgba(
                                                              mainColor,
                                                              0.1,
                                                            ),
                                                        }}
                                                      >
                                                        <IconComponent
                                                          className="h-4 w-4"
                                                          style={{
                                                            color: mainColor,
                                                          }}
                                                        />
                                                      </div>
                                                    )}

                                                    {/* Content */}
                                                    <div className="min-w-0 flex-1">
                                                      <div className="mb-0.5 flex items-center gap-2">
                                                        <span className="text-sm font-bold">
                                                          {renderLabel(
                                                            subItem.label,
                                                          )}
                                                        </span>
                                                        {/* Badge */}
                                                        {subItem.badge &&
                                                          badgeStyles && (
                                                            <span
                                                              className="rounded-full px-2 py-0.5 text-[10px] font-black tracking-wide"
                                                              style={{
                                                                background:
                                                                  badgeStyles.bg,
                                                                color:
                                                                  badgeStyles.text,
                                                              }}
                                                            >
                                                              {
                                                                subItem.badge
                                                                  .text
                                                              }
                                                            </span>
                                                          )}
                                                      </div>
                                                      {subItem.description && (
                                                        <p className="text-xs leading-snug text-gray-500">
                                                          {subItem.description}
                                                        </p>
                                                      )}
                                                    </div>

                                                    {/* Arrow indicator */}
                                                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100" />
                                                  </div>
                                                </button>
                                              );
                                            },
                                          )}
                                        </div>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            ) : (
                              /* Single column (backward compatible) */
                              <div
                                className="z-50 w-64 overflow-visible rounded-3xl border bg-white p-3 shadow-2xl"
                                style={{
                                  borderColor: hexToRgba(mainColor, 0.2),
                                }}
                              >
                                <div className="space-y-1">
                                  {item.submenu!.map(
                                    (subItem, singleSubIndex) => (
                                      <button
                                        key={`desktop-single-submenu-${itemIndex}-${singleSubIndex}-${subItem.href}`}
                                        onClick={() => {
                                          handleNavigation(
                                            `desktop-single-submenu-${itemIndex}-${singleSubIndex}-${subItem.href}`,
                                            subItem.href,
                                            subItem.isLink,
                                          );
                                        }}
                                        className="group w-full rounded-3xl px-4 py-3 text-left text-sm transition-all duration-200"
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
                                          ).style.backgroundColor =
                                            'transparent';
                                        }}
                                      >
                                        <Link
                                          id={`desktop-single-submenu-${itemIndex}-${singleSubIndex}-${subItem.href}`}
                                          hidden
                                          href={item.href}
                                        ></Link>
                                        <div className="flex items-center justify-between font-bold">
                                          <span>
                                            {renderLabel(subItem.label)}
                                          </span>
                                          <ArrowRight className="h-4 w-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                                        </div>
                                        {subItem.description && (
                                          <p className="mt-1 text-xs text-gray-500">
                                            {subItem.description}
                                          </p>
                                        )}
                                      </button>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}
                          </NavigationMenuContent>
                        </>
                      ) : (
                        <NavigationMenuLink
                          asChild
                          className="rounded-3xl px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-300 hover:bg-gray-50 hover:text-gray-900"
                        >
                          <Link
                            href={item.href}
                            style={{
                              color: mainColor,
                            }}
                          >
                            <span className="relative flex items-center gap-1">
                              {item.label}
                              {/* Top-level badge - superscript style */}
                              {item.badge &&
                                (() => {
                                  const bs = getBadgeStyles(
                                    item.badge!.variant,
                                  );
                                  return (
                                    <span
                                      className="absolute -top-2.5 left-full ml-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-black whitespace-nowrap shadow-sm"
                                      style={{
                                        background: bs.bg,
                                        color: bs.text,
                                      }}
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
                  /* 2-Part Combined Button: Shop + Login (Not Logged In) */
                  <div className="flex items-center overflow-hidden rounded-3xl shadow-md">
                    {/* Shop Button */}
                    <Link href="/price">
                      <Button
                        className="h-8 rounded-none border-0 px-3 py-2 text-xs font-semibold text-white transition-all duration-300 hover:brightness-110"
                        style={{
                          backgroundColor: '#f59e0b',
                        }}
                      >
                        <ShoppingBag className="h-4 w-4" />
                      </Button>
                    </Link>

                    {/* Divider */}
                    <div className="h-5 w-px bg-white/20" />

                    {/* Login Button */}
                    <Button
                      className="h-8 rounded-none border-0 px-4 py-2 text-xs font-semibold text-white transition-all duration-300 hover:brightness-110"
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
                  /* Logged In: 2-Part Combined + 1 Separate Hamburger */
                  <div className="flex items-center gap-2 p-1">
                    {/* Combined: Shop + Dashboard (2 parts) */}
                    <div className="flex items-center overflow-hidden rounded-3xl shadow-md">
                      {/* Shop Button */}
                      <Link href="/price">
                        <Button
                          className="h-8 rounded-none border-0 px-3 py-2 text-xs font-semibold text-white transition-all duration-300 hover:brightness-110"
                          style={{
                            backgroundColor: '#f59e0b',
                          }}
                        >
                          <ShoppingBag className="h-4 w-4" />
                        </Button>
                      </Link>

                      {/* Divider */}
                      <div className="h-5 w-px bg-white/20" />

                      {/* Dashboard Button */}
                      <Link href={`/${website_sub_category_id}/user/bimboard`}>
                        <Button
                          className="h-8 rounded-none border-0 px-4 py-2 text-xs font-semibold text-white transition-all duration-300 hover:brightness-110"
                          style={{
                            backgroundImage: `linear-gradient(145deg, ${secondaryColor}, ${mainColor})`,
                          }}
                        >
                          Dashboard
                        </Button>
                      </Link>
                    </div>

                    {/* Separate: Hamburger Menu (1 part) */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 rounded-3xl border-0 px-2 py-2 shadow-md transition-all duration-300 hover:brightness-110"
                          style={{
                            backgroundImage: `linear-gradient(145deg, ${secondaryColor}, ${mainColor})`,
                            color: '#ffffff',
                          }}
                        >
                          <Menu className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-80 overflow-hidden rounded-3xl border p-0 shadow-xl"
                        sideOffset={12}
                      >
                        {/* Header - User Profile Section */}
                        <div className="border-b border-gray-100 bg-white p-5">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="h-16 w-16 ring-2 ring-gray-100">
                                <AvatarImage
                                  src={session?.user?.image ?? ''}
                                  alt={session?.user?.name ?? ''}
                                  className="object-cover"
                                />
                                <AvatarFallback
                                  className="text-xl font-bold text-white"
                                  style={{
                                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                  }}
                                >
                                  {session?.user?.name
                                    ? session.user.name[0].toUpperCase()
                                    : 'U'}
                                </AvatarFallback>
                              </Avatar>
                              {/* Status indicator */}
                              <div className="absolute right-0 bottom-0 h-5 w-5 rounded-full border-2 border-white bg-green-500" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-lg font-bold text-gray-900">
                                {session?.user?.name}
                              </p>
                              <p className="truncate text-sm text-gray-500">
                                {session?.user?.email}
                              </p>
                              <div className="mt-1.5">
                                <span
                                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                                  style={{ backgroundColor: mainColor }}
                                >
                                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                  Online
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="bg-white p-2">
                          {/* Dashboard */}
                          <DropdownMenuItem
                            asChild
                            className="p-0"
                          >
                            <Link
                              href={`/${website_sub_category_id}/user/bimboard`}
                              className="group flex items-center gap-3 rounded-3xl px-4 py-3 transition-all duration-200 hover:bg-gray-50"
                            >
                              <div
                                className="flex h-11 w-11 items-center justify-center rounded-3xl"
                                style={{ backgroundColor: `${mainColor}15` }}
                              >
                                <LayoutDashboard
                                  className="h-5 w-5"
                                  style={{ color: mainColor }}
                                />
                              </div>
                              <div className="flex-1">
                                <p className="text-base font-bold text-gray-900">
                                  Dashboard
                                </p>
                                <p className="text-xs text-gray-500">
                                  Akses panel utama
                                </p>
                              </div>
                              <ChevronRight className="h-5 w-5 text-gray-400 transition-colors group-hover:text-gray-600" />
                            </Link>
                          </DropdownMenuItem>

                          {/* Admin Panel - Only for Admin/Super Admin */}
                          {(session?.user?.role === 'ADMIN' ||
                            session?.user?.role === 'SUPER_ADMIN' ||
                            session?.user.role === 'FINANCE') && (
                            <DropdownMenuItem
                              asChild
                              className="mt-1 p-0"
                            >
                              <Link
                                href={`/${website_sub_category_id}/admin`}
                                className="group flex items-center gap-3 rounded-3xl px-4 py-3 transition-all duration-200 hover:bg-gray-50"
                              >
                                <div
                                  className="flex h-11 w-11 items-center justify-center rounded-3xl"
                                  style={{ backgroundColor: `${mainColor}15` }}
                                >
                                  <LayoutDashboard
                                    className="h-5 w-5"
                                    style={{ color: mainColor }}
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="text-base font-bold text-gray-900">
                                    Admin Panel
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Kelola sistem
                                  </p>
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-400 transition-colors group-hover:text-gray-600" />
                              </Link>
                            </DropdownMenuItem>
                          )}

                          {/* Divider */}
                          <div className="my-2 h-px bg-gray-200" />

                          {/* Logout */}
                          <DropdownMenuItem
                            className="p-0"
                            onSelect={(event) => {
                              event.preventDefault();
                              signOut({ callbackUrl: '/' });
                            }}
                          >
                            <div className="group flex w-full cursor-pointer items-center gap-3 rounded-3xl px-4 py-3 transition-all duration-200 hover:bg-red-50">
                              <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-red-100">
                                <LogOut className="h-5 w-5 text-red-600" />
                              </div>
                              <div className="flex-1">
                                <p className="text-base font-bold text-red-600">
                                  Keluar
                                </p>
                                <p className="text-xs text-red-500">
                                  Logout dari akun
                                </p>
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

type PricingDataType = {
  // webSubCategory: {
  //   webSubCategoryId: string;
  //   webSubCategoryName: string;
  //   main_color: string;
  //   secondary_color: string;
  //   bundles: PlanType[];
  //   subscriptions: PlanType[];
  // }[];
  plans: PlanDataType[];
  topping: PlanDataType[];
  productCompare?: {
    subscription: PlanDataType[];
    bundles: PlanDataType[];
    listCompare: string[];
  };
};

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  // const [isNavigating, setIsNavigating] = useState(false);
  const isMobile = useMedia({ maxWidth: '768px' });

  const [navData, setNavData] = useState<NavItem[]>(navItems);

  const { data: PricingData } = useGet<PricingDataType>(
    '/plan/getAllPlanByWebCategory',
    { cacheMs: PLAN_CACHE_MS },
  );

  const plans = PricingData?.plans || [];

  useEffect(() => {
    if (plans.length === 0) return;

    setNavData((prev) =>
      prev.map((navitem) => {
        if (navitem.label === 'Program') {
          const subMenuColumns = navitem.submenuColumns || [];

          return {
            ...navitem,
            submenuColumns: [
              {
                title: 'Program',
                items: plans
                  .filter(
                    (item) =>
                      item.PlanSubscription &&
                      item.PlanSubscription?.PlanFeature.length > 0,
                  )
                  .map((plan, index) => ({
                    href: `/price/${plan.slug}`,
                    label: `Program ${index + 1}`,
                    description: plan.name,
                    // badge: { text: '1-ON-1', variant: 'premium' },
                    icon: 'UserPlus',
                    isLink: true,
                  })),
              },
              {
                title: 'Koin',
                items: plans
                  .filter(
                    (item) => !item.PlanSubscription && item.PlanLimitation,
                  )
                  .map((plan) => ({
                    href: `/price/${plan.slug}`,
                    label: plan.name,
                    description: Object.entries(plan.PlanLimitation)
                      .filter(([key, value]) => {
                        if (
                          key === 'id' ||
                          key === 'validFrom' ||
                          key === 'validUntil' ||
                          key === 'isTimebound' ||
                          key === 'planId' ||
                          key === 'expireDays'
                        ) {
                          return false;
                        }
                        if (value === 0) {
                          return false;
                        }
                        return true;
                      })
                      .map(([key, value]) => `${key}: ${value} koin`)
                      .join(', '),
                    // badge: { text: '1-ON-1', variant: 'premium' },
                    icon: 'UserPlus',
                    isLink: true,
                  })),
              },
              ...subMenuColumns,
            ],
          };
        }

        return navitem;
      }),
    );
  }, [plans]);

  // // Handle scroll to hash on page load
  // useEffect(() => {
  //   const handleHashScroll = () => {
  //     const hash = window.location.hash;
  //     console.log({ hash });
  //     if (hash && pathname === '/') {
  //       setTimeout(() => {
  //         const targetId = hash.substring(1);
  //         const targetElement = document.getElementById(targetId);

  //         if (targetElement) {
  //           const offset = 200;
  //           const elementPosition = targetElement.getBoundingClientRect().top;
  //           const offsetPosition =
  //             elementPosition + window.pageYOffset - offset;

  //           window.scrollTo({
  //             top: offsetPosition,
  //             behavior: 'smooth',
  //           });
  //         }
  //       }, 3000);
  //     }
  //   };

  //   // Run on mount
  //   handleHashScroll();

  //   // Listen for hash changes
  //   window.addEventListener('hashchange', handleHashScroll);

  //   return () => {
  //     window.removeEventListener('hashchange', handleHashScroll);
  //   };
  // }, [pathname]);

  return (
    <>
      {/* Loading Overlay */}
      {/* {isNavigating && (
        <div className="fixed inset-0 z-[9999] bg-white/90 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Spinner />
            <p className="text-sm font-semibold text-gray-800">Memuat...</p>
          </div>
        </div>
      )} */}

      {isMobile ? (
        <MobileNav
          navItems={navData}
          isSheetOpen={isSheetOpen}
          setIsSheetOpen={setIsSheetOpen}
          session={session}
          // setIsNavigating={setIsNavigating}
        />
      ) : (
        <DesktopNav
          navItems={navData}
          session={session}
        />
      )}
    </>
  );
};

export default Navbar;
