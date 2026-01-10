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
  BarChart3,
  BookOpen,
  Bot,
  ChevronDown,
  ChevronUp,
  Crown,
  Home,
  Lock,
  Search,
  Target, // Added for BimArena/TryOut
  Medal,  // Added for Leaderboard
  Users, // Added for BimLive
  Radio, // Added for BimLive
  MonitorPlay, // Added for BimLive
  Tags, // Added for Material
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
    title: 'Overview',
    items: [
      {
        title: 'BimBoard',
        url: (subCategoryId: string) => `/${subCategoryId}/user/bimboard`,
        icon: Home,
      },
      {
        title: 'BimInsight',
        url: (subCategoryId: string) => `/${subCategoryId}/user/biminsight`,
        icon: BarChart3,
      },
    ],
  },
  {
    title: 'Learning',
    items: [
      {
        title: 'BimCourse',
        url: (subCategoryId: string) => `/${subCategoryId}/user/bimcourse`,
        icon: BookOpen,
        // badge: 'Soon',
        // isLocked: true,
      },
      {
        title: 'BimLive',
        url: (subCategoryId: string) => `/${subCategoryId}/user/bimlive`,
        icon: MonitorPlay,
        isNew: true,
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
        title: 'BimArena',
        url: (subCategoryId: string) => '#', // Parent, uses submenu
        icon: Target,
      },
    ],
  },
  {
    title: 'AI Tools',
    items: [
      {
        title: 'BimBot',
        url: (subCategoryId: string) => `/${subCategoryId}/user/bimbot`,
        icon: Bot,
        badge: 'AI',
        isAI: true,
      },
      {
        title: 'BimPrediction',
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
  const [showMaterialSub, setShowMaterialSub] = useState<boolean>(true); // Always expanded by default
  const [showBimArenaSub, setShowBimArenaSub] = useState<boolean>(true); // Always expanded by default
  const { setSidebarMobile } = useAppContext();
  const webSubCategoryId = website_sub_category_id_params;

  useEffect(() => {
    // Keep it true effectively
    setShowMaterialSub(true);
    setShowBimArenaSub(true);
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
          {/* Section Header - Clean */}
          {!minimizeSidebar && (
            <div className={cn("px-3 py-1.5 mb-1", sectionIndex === 0 ? "mt-0" : "mt-2")}>
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                {section.title}
              </h3>
            </div>
          )}

          {minimizeSidebar && (
            <div className="space-y-1 py-1">
              {section.items.map((item, index) => {
                const isActive = pathname?.includes(
                  item.url(webSubCategoryId ?? '').split('/user/')[1],
                );
                const showItem =
                  !item.showForCategory ||
                  item.showForCategory === webSubCategoryId;

                if (!showItem) return null;

                return (
                  <div key={item.title} className="relative group flex justify-center">
                    <Link
                      href={item.url(webSubCategoryId ?? '')}
                      onClick={handleLinkClick}
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              'flex items-center justify-center w-10 h-10 rounded-2xl transition-colors duration-200 cursor-pointer relative',
                              isActive
                                ? 'bg-slate-100'
                                : 'hover:bg-slate-50'
                            )}
                            style={{
                              backgroundColor: isActive ? `${mainColor}15` : undefined,
                            }}
                          >
                             {/* Small Dot for Active indication */}
                             {isActive && (
                                <div
                                  className="absolute left-0 w-1 h-4 rounded-r-full"
                                  style={{ backgroundColor: mainColor }}
                                />
                             )}

                            <item.icon
                              className={cn(
                                'w-5 h-5 shrink-0 transition-opacity',
                                isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100 text-slate-600'
                              )}
                              style={{
                                color: isActive ? mainColor : undefined,
                              }}
                            />

                            {/* Simple Dot for New/AI */}
                             {(item.isNew || item.isAI) && (
                                <div
                                  className={cn(
                                    "absolute top-2 right-2 w-1.5 h-1.5 rounded-full ring-1 ring-white",
                                     item.isAI ? "bg-purple-500" : "bg-emerald-500"
                                  )}
                                />
                             )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-white text-slate-700 border border-slate-200 shadow-md">
                          <p className="text-xs font-medium">{item.title}</p>
                        </TooltipContent>
                      </Tooltip>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}


          {/* Section Items - Clean Redesign */}
          {!minimizeSidebar && (
            <div className="space-y-0.5">
              {section.items.map((item, index) => {
                const isActive = pathname?.includes(
                  item.url(webSubCategoryId ?? '').split('/user/')[1],
                );
                const showItem =
                  !item.showForCategory ||
                  item.showForCategory === webSubCategoryId;

                if (!showItem) return null;

                // Handle Submenu Toggles
                const isBimArena = item.title === 'BimArena';
                const hasSubMenu = isBimArena;

                const handleItemClick = (e: React.MouseEvent) => {
                   if (hasSubMenu) {
                     // Prevent navigation for items that just toggle submenu
                     if (isBimArena) {
                        e.preventDefault();
                        setShowBimArenaSub(prev => !prev);
                     }
                     // BimLive actually navigates AND has submenu, so we don't prevent default
                   }
                   handleLinkClick();
                };

                return (
                  <div key={item.title} className="relative">
                    <Link
                      href={(isBimArena) ? '#' : item.url(webSubCategoryId ?? '')}
                      onClick={handleItemClick}
                      className={cn(
                        'group flex items-center justify-between px-3 py-2 rounded-2xl text-sm font-semibold transition-all duration-200',
                        isActive
                          ? 'bg-slate-100 text-slate-900 shadow-sm'
                          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                      )}
                      style={{
                        backgroundColor: isActive ? `${mainColor}15` : undefined, // 10% opacity
                        color: isActive ? mainColor : undefined,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon
                          className={cn("w-4 h-4 transition-colors", isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100")}
                          style={{ color: isActive ? mainColor : undefined }}
                        />
                        <span>{item.title}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <span
                             className={cn(
                               "text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase",
                               item.badge === 'AI'
                                 ? "bg-purple-100 text-purple-600"
                                 : "bg-slate-100 text-slate-600"
                             )}
                          >
                            {item.badge}
                          </span>
                        )}

                        {hasSubMenu && (
                          <ChevronDown
                            className={cn(
                              "w-3.5 h-3.5 transition-transform duration-200 opacity-50",
                              (isBimArena && showBimArenaSub) ? "rotate-180" : ""
                            )}
                          />
                        )}
                      </div>
                    </Link>

                    {/* BimArena Submenu */}
                    {showBimArenaSub && isBimArena && (
                       <div className="mt-1 ml-4 pl-3 border-l border-slate-200 space-y-1">
                        {[
                           { name: 'Peringkat', href: `/${webSubCategoryId}/user/bimarena/leaderboard`, icon: Trophy },
                           { name: 'Try Out', href: `/${webSubCategoryId}/user/bimarena/try-out`, icon: Medal },
                        ].map((sub) => {
                           const isSubActive = pathname?.includes(sub.href);
                           return (
                              <Link
                                 key={sub.name}
                                 href={sub.href}
                                 onClick={handleLinkClick}
                                 className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 text-xs rounded-md transition-colors",
                                    isSubActive
                                      ? "text-slate-900 font-medium bg-slate-50"
                                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                  )}
                              >
                                 <sub.icon className="w-3.5 h-3.5 shrink-0 opacity-70" />
                                 <span>{sub.name}</span>
                              </Link>
                           )
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
