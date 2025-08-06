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
  ChevronDown,
  ChevronUp,
  Crown,
  Home,
  Lock,
  MessageCircle,
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
  isCollapsible?: boolean;
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
        isCollapsible: true,
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
        title: 'Live Class',
        url: (subCategoryId: string) => `/${subCategoryId}/user/live-class`,
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
        icon: MessageCircle,
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
      className={cn('flex flex-col gap-0.5', minimizeSidebar ? 'px-1' : 'px-2')}
    >
      {navSections.map((section, sectionIndex) => (
        <div
          key={section.title}
          className="mb-2"
        >
          {/* Section Header - Compact */}
          {!minimizeSidebar && (
            <div className="px-2 py-1 mb-1">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {section.title}
              </h3>
              <div className="mt-0.5 h-px bg-gradient-to-r from-slate-200 via-slate-300 to-transparent opacity-60"></div>
            </div>
          )}

          {/* Section Items - Compact */}
          <div className="space-y-1">
            {section.items.map((item, index) => {
              const isActive =
                pathname?.includes(
                  item.url(webSubCategoryId ?? '').split('/user/')[1],
                ) ||
                (item.isCollapsible &&
                  (pathname?.includes('workspace') ||
                    pathname?.includes('explore')));
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
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-pink-400/10 to-blue-400/10 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                  )}

                  {item.isCollapsible ? (
                    // Collapsible Material Section - Compact
                    <div
                      className={cn(
                        'flex items-center font-medium transition-all duration-200 ease-out group/item',
                        minimizeSidebar
                          ? 'justify-center p-1.5'
                          : 'justify-between mx-1 rounded-xl',
                        isActive
                          ? minimizeSidebar
                            ? ''
                            : 'text-white shadow-xl bg-gradient-to-br border-2 border-white/30 ring-2 ring-white/20'
                          : minimizeSidebar
                            ? ''
                            : 'text-slate-700 hover:bg-white/90 hover:text-slate-900 hover:shadow-lg hover:scale-[1.01] bg-white/40 backdrop-blur-sm border border-slate-200/50 hover:border-slate-300/70',
                      )}
                      style={{
                        background:
                          isActive && !minimizeSidebar
                            ? `linear-gradient(135deg, ${mainColor}ee, ${secondaryColor}dd)`
                            : undefined,
                        boxShadow:
                          isActive && !minimizeSidebar
                            ? `0 8px 32px -8px ${mainColor}40, 0 0 0 1px ${mainColor}20`
                            : undefined,
                      }}
                    >
                      {minimizeSidebar ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/90 shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105 border border-slate-200/50"
                              style={{
                                backgroundColor: isActive
                                  ? mainColor
                                  : undefined,
                                boxShadow: isActive
                                  ? `0 4px 12px -2px ${mainColor}60`
                                  : undefined,
                              }}
                            >
                              <item.icon
                                className="w-4 h-4 transition-all duration-300"
                                style={{
                                  color: isActive ? 'white' : mainColor,
                                }}
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent
                            side="right"
                            sideOffset={8}
                          >
                            <div className="text-sm">
                              <p className="font-medium">{item.title}</p>
                              {item.badge && (
                                <Badge className="mt-1 text-xs">
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <>
                          <Link
                            href={`/${webSubCategoryId}/user/explore`}
                            className="flex items-center gap-2.5 flex-1 min-w-0 px-3 py-2 cursor-pointer hover:opacity-90 transition-opacity"
                          >
                            <div
                              className={cn(
                                'w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 group-hover/item:scale-105 shadow-md border',
                                isActive
                                  ? 'bg-white/30 text-white border-white/40 shadow-lg'
                                  : 'bg-white/90 border-slate-200/50 group-hover/item:bg-white border-white/20',
                              )}
                            >
                              <item.icon
                                className="w-4 h-4 transition-all duration-300"
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
                                      'text-[10px] px-1.5 py-0.5 rounded-md font-semibold',
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
                          </Link>
                          <div
                            className="flex items-center px-2 py-2 cursor-pointer hover:opacity-70 transition-opacity"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setShowMaterialSub(!showMaterialSub);
                            }}
                          >
                            {showMaterialSub ? (
                              <ChevronUp
                                className={cn(
                                  'w-4 h-4',
                                  isActive ? 'text-white' : 'text-slate-500',
                                )}
                              />
                            ) : (
                              <ChevronDown
                                className={cn(
                                  'w-4 h-4',
                                  isActive ? 'text-white' : 'text-slate-500',
                                )}
                              />
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    // Regular Menu Item - Compact
                    <Link
                      href={item.url(webSubCategoryId ?? '')}
                      onClick={handleLinkClick}
                    >
                      <div
                        className={cn(
                          'flex items-center font-medium transition-all duration-200 ease-out group/item cursor-pointer',
                          minimizeSidebar
                            ? 'justify-center p-1.5'
                            : 'gap-2.5 mx-1 px-3 py-2 rounded-xl',
                          isActive
                            ? minimizeSidebar
                              ? ''
                              : 'text-white shadow-xl bg-gradient-to-br border-2 border-white/30 ring-2 ring-white/20'
                            : minimizeSidebar
                              ? ''
                              : 'text-slate-700 hover:bg-white/90 hover:text-slate-900 hover:shadow-lg hover:scale-[1.01] bg-white/40 backdrop-blur-sm border border-slate-200/50 hover:border-slate-300/70',
                        )}
                        style={{
                          background:
                            isActive && !minimizeSidebar
                              ? `linear-gradient(135deg, ${mainColor}ee, ${secondaryColor}dd)`
                              : undefined,
                          boxShadow:
                            isActive && !minimizeSidebar
                              ? `0 8px 32px -8px ${mainColor}40, 0 0 0 1px ${mainColor}20`
                              : undefined,
                        }}
                      >
                        {minimizeSidebar ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/90 shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105 border border-slate-200/50"
                                style={{
                                  backgroundColor: isActive
                                    ? mainColor
                                    : undefined,
                                  boxShadow: isActive
                                    ? `0 4px 12px -2px ${mainColor}60`
                                    : undefined,
                                }}
                              >
                                <item.icon
                                  className="w-4 h-4 transition-all duration-300"
                                  style={{
                                    color: isActive ? 'white' : mainColor,
                                  }}
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="right"
                              sideOffset={8}
                            >
                              <div className="text-sm">
                                <p className="font-medium">{item.title}</p>
                                {item.badge && (
                                  <Badge className="mt-1 text-xs">
                                    {item.badge}
                                  </Badge>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <>
                            <div
                              className={cn(
                                'w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 group-hover/item:scale-105 shadow-md border',
                                isActive
                                  ? 'bg-white/30 text-white border-white/40 shadow-lg'
                                  : 'bg-white/90 border-slate-200/50 group-hover/item:bg-white border-white/20',
                              )}
                            >
                              <item.icon
                                className="w-4 h-4 transition-all duration-300"
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
                                      'text-[10px] px-1.5 py-0.5 rounded-md font-semibold',
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
                          </>
                        )}
                      </div>
                    </Link>
                  )}

                  {/* Material Submenu - Enhanced Visibility */}
                  {item.isCollapsible && showMaterialSub && (
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
                                'flex items-center gap-2.5 p-2 rounded-lg transition-all duration-200 group cursor-pointer',
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
        </div>
      ))}
    </div>
  );
};

export default SidebarRoute;
