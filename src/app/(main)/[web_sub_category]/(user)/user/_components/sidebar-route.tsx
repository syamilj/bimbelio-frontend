'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { website_sub_category_id_params } from '@/hooks/use-web-sub-category-id';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  Bot,
  ChevronDown,
  ChevronUp,
  Crown,
  Home,
  Lock,
  Search,
  TrendingUp,
  Trophy,
  Video,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMedia } from 'use-media';

// Types
interface NavItem {
  title: string;
  url: (subCategoryId: string) => string;
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  badge?: string;
  isLocked?: boolean;
  isNew?: boolean;
  isAI?: boolean;
  showForCategory?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

// Clean navigation data organized by sections - COMPACT VERSION
const navSections: NavSection[] = [
  {
    title: 'Dashboard',
    items: [
      {
        title: 'Dashboard',
        url: (subCategoryId: string) => `/${subCategoryId}/user/dashboard`,
        icon: Home,
      },
      {
        title: 'Peringkat',
        url: (subCategoryId: string) => `/${subCategoryId}/user/leaderboard`,
        icon: Crown,
      },
    ],
  },
  {
    title: 'Learning',
    items: [
      {
        title: 'Belajar',
        url: (subCategoryId: string) => `/${subCategoryId}/user/course`,
        icon: BookOpen,
        badge: 'Soon',
        isLocked: true,
      },
      {
        title: 'Material',
        url: (subCategoryId: string) => `/${subCategoryId}/user/explore`,
        icon: Search,
      },
    ],
  },
  {
    title: 'Practice',
    items: [
      {
        title: 'Try Out',
        url: (subCategoryId: string) => `/${subCategoryId}/user/try-out`,
        icon: Trophy,
        isNew: true,
      },
      {
        title: 'Live Learning',
        url: (subCategoryId: string) => `/${subCategoryId}/user/live-learning`,
        icon: Video,
        isNew: true,
      },
    ],
  },
  {
    title: 'AI Features',
    items: [
      {
        title: 'Chat',
        url: (subCategoryId: string) => `/${subCategoryId}/user/chat`,
        icon: Bot,
        badge: 'AI',
        isAI: true,
      },
      {
        title: 'Prediksi',
        url: (subCategoryId: string) => `/${subCategoryId}/user/prediction`,
        icon: TrendingUp,
        showForCategory: 'simak-ui',
        isAI: true,
      },
    ],
  },
];

interface SidebarRouteProps {
  category?: any[];
  minimizeSidebar: boolean;
  setMinimizeSidebar: (value: boolean) => void;
  categoryColors?: {
    mainColor?: string;
    secondaryColor?: string;
  };
}

const SidebarRoute: React.FC<SidebarRouteProps> = ({
  category,
  minimizeSidebar,
  setMinimizeSidebar,
  categoryColors,
}) => {
  const pathname = usePathname();
  const [showMaterialSub, setShowMaterialSub] = useState<boolean>(false);
  const { setSidebarMobile } = useAppContext();
  const webSubCategoryId = website_sub_category_id_params;

  useEffect(() => {
    if (pathname?.includes('workspace') || pathname?.includes('explore')) {
      setShowMaterialSub(true);
    }
  }, [pathname]);

  const isMobile = useMedia({ maxWidth: '768px' });

  const handleLinkClick = () => {
    if (isMobile) {
      setSidebarMobile(false);
    }
  };

  const { mainColor = '#0091FF', secondaryColor = '#5aa4dd' } =
    categoryColors || {};

  return (
    <div
      className={cn(
        'flex flex-col gap-0.5 px-2',
        minimizeSidebar && 'px-1 items-center',
      )}
    >
      {navSections.map((section, sectionIndex) => (
        <div
          key={section.title}
          className="mb-2"
        >
          {/* Section Header - Compact */}
          {!minimizeSidebar && (
            <div className="px-2 py-1 mb-1">
              <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                {section.title}
              </h3>
              <div className="mt-0.5 h-px bg-gradient-to-r from-slate-200 via-slate-300 to-transparent opacity-60"></div>
            </div>
          )}

          {minimizeSidebar && (
            <div className="space-y-2 py-2">
              {section.items.map((item, index) => {
                const isActive = pathname?.includes(
                  item.url(webSubCategoryId ?? '').split('/user/')[1],
                );
                const showItem =
                  !item.showForCategory ||
                  item.showForCategory === webSubCategoryId;

                if (!showItem) return null;

                return (
                  <div
                    key={item.title}
                    className="relative group"
                  >
                    {/* AI glow effect - enhanced */}
                    {item.isAI && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-blue-400/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    )}

                    <Link
                      href={item.url(webSubCategoryId ?? '')}
                      onClick={handleLinkClick}
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              'flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-300 cursor-pointer relative',
                              isActive
                                ? 'shadow-lg scale-105'
                                : 'hover:shadow-md hover:scale-100 shadow-sm',
                            )}
                            style={{
                              backgroundColor: isActive ? mainColor : 'white',
                              border: isActive
                                ? `2px solid ${mainColor}`
                                : '1.5px solid #e2e8f0',
                              boxShadow: isActive
                                ? `0 6px 20px -4px ${mainColor}40, inset 0 1px 2px ${mainColor}20`
                                : '0 2px 8px -1px rgba(0,0,0,0.08)',
                            }}
                          >
                            {/* Badge indicator for new/AI items */}
                            {(item.isNew || item.isAI) && (
                              <div
                                className={cn(
                                  'absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white',
                                  item.isAI
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                                    : 'bg-emerald-500',
                                )}
                              />
                            )}

                            {/* Lock indicator */}
                            {item.isLocked && (
                              <div className="absolute -top-2 -right-2 bg-amber-500 rounded-full p-0.5">
                                <Lock className="w-2.5 h-2.5 text-white" />
                              </div>
                            )}

                            <item.icon
                              className={cn(
                                'w-5 h-5 transition-colors duration-300 shrink-0',
                                isActive ? 'text-white' : 'text-slate-600',
                              )}
                              style={{
                                color: isActive ? 'white' : mainColor,
                              }}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent
                          side="right"
                          sideOffset={12}
                          className="bg-slate-900 text-white border-2 border-slate-700 rounded-2xl shadow-sm"
                        >
                          <div className="text-sm space-y-1">
                            <p className="font-semibold">{item.title}</p>
                            <div className="flex items-center gap-2">
                              {item.badge && (
                                <Badge
                                  className={cn(
                                    'text-[10px] px-2 py-0.5 rounded-xl font-semibold',
                                    item.badge === 'AI'
                                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0'
                                      : item.badge === 'Soon'
                                        ? 'bg-amber-500 text-white border-0'
                                        : 'bg-gray-700 text-gray-200',
                                  )}
                                >
                                  {item.badge}
                                </Badge>
                              )}
                              {item.isNew && (
                                <span className="text-emerald-400 text-[10px] font-semibold">
                                  NEW
                                </span>
                              )}
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}

          {/* Section Items - Compact */}
          {!minimizeSidebar && (
            <div className="space-y-1">
              {section.items.map((item, index) => {
                const isActive = pathname?.includes(
                  item.url(webSubCategoryId ?? '').split('/user/')[1],
                );
                const showItem =
                  !item.showForCategory ||
                  item.showForCategory === webSubCategoryId;

                if (!showItem) return null;

                return (
                  <div
                    key={item.title}
                    className="relative group"
                  >
                    {/* AI glow effect - subtle */}
                    {item.isAI && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-pink-400/10 to-blue-400/10 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                    )}

                    <Link
                      href={
                        item.title !== 'Material'
                          ? item.url(webSubCategoryId ?? '')
                          : '#'
                      }
                      onClick={
                        item.title !== 'Material' ? handleLinkClick : undefined
                      }
                    >
                      <div
                        className={cn(
                          'flex items-center font-semibold ease-out group/item cursor-pointer',
                          minimizeSidebar
                            ? 'justify-center p-1.5'
                            : 'gap-2.5 mx-1 px-3 py-2 rounded-2xl',
                          isActive
                            ? minimizeSidebar
                              ? ''
                              : 'text-white shadow-sm bg-gradient-to-br border-2 border-white/30'
                            : minimizeSidebar
                              ? ''
                              : 'text-slate-700 hover:bg-white/90 hover:text-slate-900 hover:shadow-md hover:scale-[1.01] bg-white/40 backdrop-blur-sm border-2 border-slate-200/50 hover:border-slate-300/70',
                        )}
                        style={{
                          background:
                            isActive && !minimizeSidebar
                              ? `linear-gradient(135deg, ${mainColor}ee, ${secondaryColor}dd)`
                              : undefined,
                          boxShadow:
                            isActive && !minimizeSidebar
                              ? `0 4px 16px -4px ${mainColor}40`
                              : undefined,
                        }}
                      >
                        <div
                          className={cn(
                            'w-8 h-8 rounded-2xl flex items-center justify-center shadow-sm border-2',
                            isActive
                              ? 'bg-white/30 text-white border-white/40 shadow-md'
                              : 'bg-white/90 border-slate-200/50 group-hover/item:bg-white border-white/20',
                          )}
                        >
                          <item.icon
                            className="w-5 h-5"
                            style={{
                              color: !isActive ? mainColor : undefined,
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={cn(
                                'text-sm font-semibold truncate',
                                isActive ? 'text-white' : 'text-slate-800',
                              )}
                            >
                              {item.title}
                            </span>
                            {item.badge && (
                              <Badge
                                className={cn(
                                  'text-[10px] px-1.5 py-0.5 rounded-xl font-semibold',
                                  item.badge === 'AI'
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0'
                                    : item.badge === 'Soon'
                                      ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white border-0'
                                      : 'bg-gray-100 text-gray-700',
                                )}
                              >
                                {item.badge}
                              </Badge>
                            )}
                            {item.isLocked && (
                              <Lock className="w-3 h-3 text-amber-500" />
                            )}
                            {item.isNew && (
                              <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                              </span>
                            )}
                          </div>
                        </div>
                        {item.title === 'Material' && (
                          <div
                            className="w-fit h-full flex items-center justify-center"
                            onClick={() => setShowMaterialSub((prev) => !prev)}
                          >
                            {showMaterialSub ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Material Submenu - Enhanced Visibility */}
                    {showMaterialSub && item.title === 'Material' && (
                      <div className="mt-2 ml-3 space-y-1 pl-3 border-l-2 border-slate-200/60">
                        {category?.map((cat: any) => {
                          const isSubActive = pathname?.includes(
                            `category=${cat.name}`,
                          );
                          return (
                            <Link
                              key={cat.name}
                              href={`/${webSubCategoryId}/user/workspace/${cat.id}`}
                              onClick={handleLinkClick}
                            >
                              <div
                                className={cn(
                                  'flex items-center gap-2.5 p-2 rounded-2xl group cursor-pointer border-2',
                                  isSubActive
                                    ? 'bg-white/80 text-slate-800 shadow-sm border-slate-200/70'
                                    : 'hover:bg-white/70 text-slate-600 hover:text-slate-800 border-transparent',
                                )}
                              >
                                <div
                                  className={cn(
                                    'w-2 h-2 rounded-full transition-colors',
                                    isSubActive
                                      ? 'bg-slate-600'
                                      : 'bg-slate-400 group-hover:bg-slate-600',
                                  )}
                                />
                                <span className="text-xs font-semibold truncate">
                                  {cat.name}
                                </span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}

                    {item.title === 'Live Learning' && (
                      <div className="mt-2 ml-3 space-y-1 pl-3 border-l-2 border-slate-200/60">
                        {[
                          {
                            name: 'Webinar',
                            href: `/${webSubCategoryId}/user/live-learning/webinar`,
                            badge: 'Gratis',
                          },
                          {
                            name: 'Liveclass',
                            href: `/${webSubCategoryId}/user/live-learning/liveclass`,
                          },
                          {
                            name: 'Livestream',
                            href: `/${webSubCategoryId}/user/live-learning/livestream`,
                          },
                        ].map((cat) => {
                          const isSubActive = pathname?.includes(
                            `category=${cat.name}`,
                          );
                          return (
                            <Link
                              key={cat.name}
                              href={cat.href}
                              onClick={handleLinkClick}
                            >
                              <div
                                className={cn(
                                  'flex items-center gap-2.5 p-2 rounded-lg group cursor-pointer',
                                  isSubActive
                                    ? 'bg-white/80 text-slate-800 shadow-sm border border-slate-200/70'
                                    : 'hover:bg-white/70 text-slate-600 hover:text-slate-800',
                                )}
                              >
                                <div
                                  className={cn(
                                    'w-2 h-2 rounded-full transition-colors',
                                    isSubActive
                                      ? 'bg-slate-600'
                                      : 'bg-slate-400 group-hover:bg-slate-600',
                                  )}
                                />
                                <span className="text-xs font-medium truncate">
                                  {cat.name}
                                </span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SidebarRoute;
