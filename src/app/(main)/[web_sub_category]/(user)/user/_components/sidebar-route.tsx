'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { BimBrand } from '@/components/ui/bim-brand';
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
  FileQuestion, // Added for BimArena/Quiz
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
import { useEffect, useMemo, useState, useRef } from 'react';
import { useMedia } from 'use-media';

// Helper to render Bim* branded titles
const renderBimTitle = (title: string) => {
  // Check if it's a Bim* branded name (BimBoard, BimArena, BimCourse, etc.)
  const bimMatch = title.match(/^Bim([A-Z][a-zA-Z]*)$/);
  if (bimMatch) {
    return <BimBrand suffix={bimMatch[1]} />;
  }
  return title;
};

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
      // Material moved to BimCourse submenu
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
  const [showBimCourseSub, setShowBimCourseSub] = useState<boolean>(true); // Added for BimCourse
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [panelPosition, setPanelPosition] = useState<{ top: number; left: number } | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { setSidebarMobile } = useAppContext();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const webSubCategoryId = website_sub_category_id_params;

  // Group categories by website sub category
  const groupedCategories = useMemo(() => {
    if (!category || category.length === 0) return {};

    const groups: Record<string, { name: string; categories: any[] }> = {};

    category.forEach((cat: any) => {
      const webSubName = cat.WebsiteSubCategory?.name || 'Lainnya';
      const webSubId = cat.website_sub_category_id || 'other';

      if (!groups[webSubId]) {
        groups[webSubId] = {
          name: webSubName,
          categories: [],
        };
      }

      groups[webSubId].categories.push(cat);
    });

    return groups;
  }, [category]);

  useEffect(() => {
    // Keep it true effectively
    setShowMaterialSub(true);
    setShowBimArenaSub(true);
    setShowBimCourseSub(true);
  }, [pathname]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

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

                const isBimCourse = item.title === 'BimCourse';
                const isBimArena = item.title === 'BimArena';
                const hasSubMenu = isBimCourse || isBimArena;
                const isHovered = hoveredItem === item.title;

                return (
                  <div key={item.title} className="relative flex justify-center">
                    {hasSubMenu ? (
                      // Item with submenu - controlled hover
                      <div className="relative">
                        <div
                          onMouseEnter={(e) => {
                            // Clear any pending close timeout
                            if (closeTimeoutRef.current) {
                              clearTimeout(closeTimeoutRef.current);
                              closeTimeoutRef.current = null;
                            }
                            const rect = e.currentTarget.getBoundingClientRect();
                            setPanelPosition({ top: rect.top, left: rect.right + 12 });
                            setHoveredItem(item.title);
                          }}
                          onMouseLeave={(e) => {
                            // Delay closing to allow mouse to move to panel
                            closeTimeoutRef.current = setTimeout(() => {
                              const relatedTarget = e.relatedTarget as HTMLElement;
                              if (!relatedTarget?.closest('[data-submenu-panel]')) {
                                setHoveredItem(null);
                                setPanelPosition(null);
                              }
                            }, 150); // 150ms delay for smooth transition
                          }}
                          className={cn(
                            'flex items-center justify-center w-10 h-10 rounded-3xl transition-colors duration-200 cursor-pointer relative',
                            isActive
                              ? 'bg-slate-100'
                              : 'hover:bg-slate-50'
                          )}
                          style={{
                            backgroundColor: isActive ? `${mainColor}15` : undefined,
                          }}
                        >
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

                          {(item.isNew || item.isAI) && (
                            <div
                              className={cn(
                                "absolute top-2 right-2 w-1.5 h-1.5 rounded-full ring-1 ring-white",
                                item.isAI ? "bg-purple-500" : "bg-emerald-500"
                              )}
                            />
                          )}
                        </div>

                        {/* Hover Submenu Panel - Fixed Positioning with State Control */}
                        {isHovered && panelPosition && (
                          <div
                            data-submenu-panel
                            onMouseEnter={() => {
                              // Clear any pending close timeout when entering panel
                              if (closeTimeoutRef.current) {
                                clearTimeout(closeTimeoutRef.current);
                                closeTimeoutRef.current = null;
                              }
                              setHoveredItem(item.title);
                            }}
                            onMouseLeave={() => {
                              setHoveredItem(null);
                              setPanelPosition(null);
                            }}
                            style={{
                              top: `${panelPosition.top}px`,
                              left: `${panelPosition.left}px`,
                            }}
                            className="fixed w-72 max-h-[80vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-slate-200 z-[9999] animate-in fade-in slide-in-from-left-2 duration-200"
                          >
                          <div className="p-3">
                            {/* Header */}
                            <div className="px-2 py-2 mb-2 border-b border-slate-100">
                              <div className="flex items-center gap-2">
                                <item.icon className="w-4 h-4" style={{ color: mainColor }} />
                                <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                              </div>
                            </div>

                            {/* BimCourse Submenu */}
                            {isBimCourse && (
                              <div className="space-y-1">
                                <Link
                                  href={`/${webSubCategoryId}/user/bimcourse`}
                                  onClick={handleLinkClick}
                                  className={cn(
                                    "flex items-center gap-2 px-2 py-2 text-xs rounded-lg transition-colors",
                                    pathname === `/${webSubCategoryId}/user/bimcourse`
                                      ? "text-slate-900 font-semibold bg-slate-100"
                                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                  )}
                                >
                                  <BookOpen className="w-3.5 h-3.5 shrink-0" />
                                  <span>Semua Modul</span>
                                </Link>

                                {Object.keys(groupedCategories).length > 0 && (
                                  <>
                                    <div className="my-2 border-t border-slate-100" />
                                    <div className="space-y-3">
                                      {Object.entries(groupedCategories).map(([webSubId, group]) => (
                                        <div key={webSubId}>
                                          <p className="px-2 py-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                                            {group.name}
                                          </p>
                                          {group.categories && group.categories.length > 0 ? (
                                            <div className="space-y-0.5 mt-1">
                                              {group.categories.map((cat: any) => {
                                                const catHref = `/${webSubCategoryId}/user/bimcourse/${cat.id}`;
                                                const isCatActive = pathname?.includes(catHref);
                                                return (
                                                  <Link
                                                    key={cat.id}
                                                    href={catHref}
                                                    onClick={handleLinkClick}
                                                    className={cn(
                                                      "flex items-center gap-2 px-2 py-1.5 text-xs rounded-lg transition-colors",
                                                      isCatActive
                                                        ? "text-slate-900 font-semibold bg-slate-50"
                                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                                    )}
                                                  >
                                                    <div className={cn("w-1.5 h-1.5 rounded-full ml-1", isCatActive ? "bg-slate-600" : "bg-slate-300")} />
                                                    <span className="truncate">{cat.name}</span>
                                                  </Link>
                                                );
                                              })}
                                            </div>
                                          ) : (
                                            <p className="px-2 py-1.5 text-xs text-slate-400 italic">Tidak ada mata pelajaran</p>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </>
                                )}
                              </div>
                            )}

                            {/* BimArena Submenu */}
                            {isBimArena && (
                              <div className="space-y-0.5">
                                {[
                                  { name: 'Peringkat', href: `/${webSubCategoryId}/user/bimarena/leaderboard`, icon: Trophy },
                                  { name: 'Try Out', href: `/${webSubCategoryId}/user/bimarena/try-out`, icon: Medal },
                                  { name: 'Quiz', href: `/${webSubCategoryId}/user/bimarena/quiz`, icon: FileQuestion },
                                ].map((sub) => {
                                  const isSubActive = pathname?.includes(sub.href);
                                  return (
                                    <Link
                                      key={sub.name}
                                      href={sub.href}
                                      onClick={handleLinkClick}
                                      className={cn(
                                        "flex items-center gap-2 px-2 py-1.5 text-xs rounded-lg transition-colors",
                                        isSubActive
                                          ? "text-slate-900 font-medium bg-slate-50"
                                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                      )}
                                    >
                                      <sub.icon className="w-3.5 h-3.5 shrink-0 opacity-70" />
                                      <span>{sub.name}</span>
                                    </Link>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      // Regular item without submenu
                      <Link
                        href={item.url(webSubCategoryId ?? '')}
                        onClick={handleLinkClick}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={cn(
                                'flex items-center justify-center w-10 h-10 rounded-3xl transition-colors duration-200 cursor-pointer relative',
                                isActive
                                  ? 'bg-slate-100'
                                  : 'hover:bg-slate-50'
                              )}
                              style={{
                                backgroundColor: isActive ? `${mainColor}15` : undefined,
                              }}
                            >
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
                            <p className="text-xs font-medium">{renderBimTitle(item.title)}</p>
                          </TooltipContent>
                        </Tooltip>
                      </Link>
                    )}
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
                const isBimCourse = item.title === 'BimCourse';
                const hasSubMenu = isBimArena || isBimCourse;

                const handleItemClick = (e: React.MouseEvent) => {
                   if (hasSubMenu) {
                     // Prevent navigation for items that just toggle submenu
                     if (isBimArena) {
                        e.preventDefault();
                        setShowBimArenaSub(prev => !prev);
                     }
                      if (isBimCourse) {
                        e.preventDefault();
                        setShowBimCourseSub(prev => !prev);
                     }
                     // BimLive actually navigates AND has submenu, so we don't prevent default
                   }
                   handleLinkClick();
                };

                return (
                  <div key={item.title} className="relative">
                    <Link
                      href={(isBimArena || isBimCourse) ? '#' : item.url(webSubCategoryId ?? '')}
                      onClick={handleItemClick}
                      className={cn(
                        'group flex items-center justify-between px-3 py-2 rounded-3xl text-sm font-semibold transition-all duration-200',
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
                        <span>{renderBimTitle(item.title)}</span>
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
                              ((isBimArena && showBimArenaSub) || (isBimCourse && showBimCourseSub)) ? "rotate-180" : ""
                            )}
                          />
                        )}
                      </div>
                    </Link>

                    {/* BimCourse Submenu */}
                     {showBimCourseSub && isBimCourse && (
                         <div className="mt-1 ml-4 pl-3 border-l border-slate-200 space-y-1 relative">
                             {/* Utility Menu */}
                             <div className="space-y-1">
                                <Link
                                    key="semua"
                                    href={`/${webSubCategoryId}/user/bimcourse`}
                                    onClick={handleLinkClick}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-1.5 text-xs rounded-md transition-colors",
                                        pathname === `/${webSubCategoryId}/user/bimcourse`
                                        ? "text-slate-900 font-bold bg-slate-100"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                    )}
                                >
                                    <div className="w-4 flex justify-center"><BookOpen className="w-3.5 h-3.5 shrink-0" /></div>
                                    <span>Semua Modul</span>
                                </Link>

                                {/* <Link
                                    key="telusuri"
                                    href={`/${webSubCategoryId}/user/explore`}
                                    onClick={handleLinkClick}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-1.5 text-xs rounded-md transition-colors",
                                        pathname?.includes('/user/explore')
                                        ? "text-slate-900 font-bold bg-slate-100"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                    )}
                                >
                                    <div className="w-4 flex justify-center"><Search className="w-3.5 h-3.5 shrink-0" /></div>
                                    <span>Telusuri</span>
                                </Link> */}
                             </div>

                             {/* Divider & Categories Grouped by WebSub */}
                             {Object.keys(groupedCategories).length > 0 && (
                                <div className="pt-1">
                                   <div className="my-1.5 border-t border-slate-100 w-full" />

                                   {Object.entries(groupedCategories).map(([webSubId, group]) => (
                                     <div key={webSubId} className="mb-3 last:mb-0">
                                       {/* WebSub Name Header */}
                                       <p className="px-3 text-[10px] font-extrabold text-slate-400 uppercase mb-1.5 tracking-wider">
                                         {group.name}
                                       </p>

                                       {/* Categories under this WebSub */}
                                       <div className="space-y-0.5">
                                          {group.categories.map((cat: any) => {
                                             const catHref = `/${webSubCategoryId}/user/bimcourse/${cat.id}`;
                                             const isCatActive = pathname?.includes(catHref);
                                             return (
                                               <Link
                                                  key={cat.id}
                                                  href={catHref}
                                                  onClick={handleLinkClick}
                                                  className={cn(
                                                      "flex items-center gap-2 px-3 py-1.5 text-xs rounded-md transition-colors",
                                                      isCatActive
                                                        ? "text-slate-900 font-semibold bg-slate-50"
                                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                                  )}
                                               >
                                                  <div className="w-4 flex justify-center">
                                                    <div className={cn("w-1.5 h-1.5 rounded-full", isCatActive ? "bg-slate-600" : "bg-slate-300")} />
                                                  </div>
                                                  <span className="truncate">{cat.name}</span>
                                               </Link>
                                             );
                                          })}
                                       </div>
                                     </div>
                                   ))}
                                </div>
                             )}
                         </div>
                     )}

                    {/* BimArena Submenu */}
                    {showBimArenaSub && isBimArena && (
                       <div className="mt-1 ml-4 pl-3 border-l border-slate-200 space-y-1">
                        {[
                           { name: 'Peringkat', href: `/${webSubCategoryId}/user/bimarena/leaderboard`, icon: Trophy },
                           { name: 'Try Out', href: `/${webSubCategoryId}/user/bimarena/try-out`, icon: Medal },
                           { name: 'Quiz', href: `/${webSubCategoryId}/user/bimarena/quiz`, icon: FileQuestion },
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
