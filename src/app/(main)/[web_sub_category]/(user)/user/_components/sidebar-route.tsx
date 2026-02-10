'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { website_sub_category_id_params } from '@/hooks/use-web-sub-category-id';
import { cn } from '@/lib/utils';
import { BookOpen, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useMedia } from 'use-media';
import {
  getBimArenaSubItems,
  navSections,
  renderBimTitle,
  type NavItem,
} from './sidebarRoutes';

// ─── Types ──────────────────────────────────────────────────────

interface SidebarRouteProps {
  category?: any[];
  minimizeSidebar: boolean;
  setMinimizeSidebar: (value: boolean) => void;
  categoryColors?: {
    mainColor?: string;
    secondaryColor?: string;
  };
}

// ─── SidebarRoute ───────────────────────────────────────────────

const SidebarRoute: React.FC<SidebarRouteProps> = ({
  category,
  minimizeSidebar,
  categoryColors,
}) => {
  const pathname = usePathname();
  const [showBimArenaSub, setShowBimArenaSub] = useState(true);
  const [showBimCourseSub, setShowBimCourseSub] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [panelPosition, setPanelPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { setSidebarMobile } = useAppContext();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const webSubCategoryId = website_sub_category_id_params;

  const groupedCategories = useMemo(() => {
    if (!category || category.length === 0) return {};
    const groups: Record<string, { name: string; categories: any[] }> = {};
    category.forEach((cat: any) => {
      const webSubName = cat.WebsiteSubCategory?.name || 'Lainnya';
      const webSubId = cat.website_sub_category_id || 'other';
      if (!groups[webSubId]) {
        groups[webSubId] = { name: webSubName, categories: [] };
      }
      groups[webSubId].categories.push(cat);
    });
    return groups;
  }, [category]);

  useEffect(() => {
    setShowBimArenaSub(true);
    setShowBimCourseSub(true);
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const isMobile = useMedia({ maxWidth: '768px' });
  const handleLinkClick = () => {
    if (isMobile) setSidebarMobile(false);
  };

  const { mainColor = '#0091FF' } = categoryColors || {};

  const isItemActive = (item: NavItem) =>
    pathname?.includes(item.url(webSubCategoryId ?? '').split('/user/')[1]);

  const bimArenaSubItems = getBimArenaSubItems(webSubCategoryId ?? '');

  return (
    <div
      className={cn(
        'flex flex-col gap-0.5 px-2',
        minimizeSidebar && 'px-1 items-center',
      )}
    >
      {navSections.map((section, sectionIndex) => {
        const visibleItems = section.items.filter(
          (item) =>
            !item.showForCategory || item.showForCategory === webSubCategoryId,
        );
        if (visibleItems.length === 0) return null;

        return (
          <div key={section.title} className="mb-2">
            {/* Section Header */}
            {!minimizeSidebar && (
              <div
                className={cn(
                  'px-3 py-1.5 mb-1',
                  sectionIndex === 0 ? 'mt-0' : 'mt-2',
                )}
              >
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                  {section.title}
                </h3>
              </div>
            )}

            {/* Minimized Mode */}
            {minimizeSidebar && (
              <div className="space-y-1 py-1">
                {visibleItems.map((item) => (
                  <MinimizedNavItem
                    key={item.title}
                    item={item}
                    isActive={!!isItemActive(item)}
                    mainColor={mainColor}
                    hoveredItem={hoveredItem}
                    panelPosition={panelPosition}
                    closeTimeoutRef={closeTimeoutRef}
                    setHoveredItem={setHoveredItem}
                    setPanelPosition={setPanelPosition}
                    handleLinkClick={handleLinkClick}
                    webSubCategoryId={webSubCategoryId ?? ''}
                    pathname={pathname}
                    groupedCategories={groupedCategories}
                    bimArenaSubItems={bimArenaSubItems}
                  />
                ))}
              </div>
            )}

            {/* Expanded Mode */}
            {!minimizeSidebar && (
              <div className="space-y-0.5">
                {visibleItems.map((item) => (
                  <ExpandedNavItem
                    key={item.title}
                    item={item}
                    isActive={!!isItemActive(item)}
                    mainColor={mainColor}
                    showBimArenaSub={showBimArenaSub}
                    showBimCourseSub={showBimCourseSub}
                    setShowBimArenaSub={setShowBimArenaSub}
                    setShowBimCourseSub={setShowBimCourseSub}
                    handleLinkClick={handleLinkClick}
                    webSubCategoryId={webSubCategoryId ?? ''}
                    pathname={pathname}
                    groupedCategories={groupedCategories}
                    bimArenaSubItems={bimArenaSubItems}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SidebarRoute;

// ─── MinimizedNavItem ───────────────────────────────────────────

interface SubMenuItemType {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

function MinimizedNavItem({
  item,
  isActive,
  mainColor,
  hoveredItem,
  panelPosition,
  closeTimeoutRef,
  setHoveredItem,
  setPanelPosition,
  handleLinkClick,
  webSubCategoryId,
  pathname,
  groupedCategories,
  bimArenaSubItems,
}: {
  item: NavItem;
  isActive: boolean;
  mainColor: string;
  hoveredItem: string | null;
  panelPosition: { top: number; left: number } | null;
  closeTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
  setHoveredItem: (v: string | null) => void;
  setPanelPosition: (v: { top: number; left: number } | null) => void;
  handleLinkClick: () => void;
  webSubCategoryId: string;
  pathname: string | null;
  groupedCategories: Record<string, { name: string; categories: any[] }>;
  bimArenaSubItems: SubMenuItemType[];
}) {
  const isBimCourse = item.title === 'BimCourse';
  const isBimArena = item.title === 'BimArena';
  const hasSubMenu = isBimCourse || isBimArena;
  const isHovered = hoveredItem === item.title;

  const iconEl = (
    <div
      className={cn(
        'flex items-center justify-center w-10 h-10 rounded-3xl transition-colors duration-200 cursor-pointer relative',
        isActive ? 'bg-slate-100' : 'hover:bg-slate-50',
      )}
      style={{ backgroundColor: isActive ? `${mainColor}15` : undefined }}
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
          isActive
            ? 'opacity-100'
            : 'opacity-70 group-hover:opacity-100 text-slate-600',
        )}
        style={{ color: isActive ? mainColor : undefined }}
      />
      {(item.isNew || item.isAI) && (
        <div
          className={cn(
            'absolute top-2 right-2 w-1.5 h-1.5 rounded-full ring-1 ring-white',
            item.isAI ? 'bg-purple-500' : 'bg-emerald-500',
          )}
        />
      )}
    </div>
  );

  if (hasSubMenu) {
    return (
      <div className="relative flex justify-center">
        <div className="relative">
          <div
            onMouseEnter={(e) => {
              if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
                closeTimeoutRef.current = null;
              }
              const rect = e.currentTarget.getBoundingClientRect();
              setPanelPosition({ top: rect.top, left: rect.right + 12 });
              setHoveredItem(item.title);
            }}
            onMouseLeave={(e) => {
              closeTimeoutRef.current = setTimeout(() => {
                const relatedTarget = e.relatedTarget as HTMLElement;
                if (!relatedTarget?.closest('[data-submenu-panel]')) {
                  setHoveredItem(null);
                  setPanelPosition(null);
                }
              }, 150);
            }}
          >
            {iconEl}
          </div>

          {isHovered && panelPosition && (
            <div
              data-submenu-panel
              onMouseEnter={() => {
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
                <div className="px-2 py-2 mb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <item.icon
                      className="w-4 h-4"
                      style={{ color: mainColor }}
                    />
                    <h4 className="text-sm font-bold text-slate-900">
                      {item.title}
                    </h4>
                  </div>
                </div>

                {isBimCourse && (
                  <BimCourseSubmenuContent
                    webSubCategoryId={webSubCategoryId}
                    pathname={pathname}
                    groupedCategories={groupedCategories}
                    handleLinkClick={handleLinkClick}
                  />
                )}

                {isBimArena && (
                  <SubMenuLinks
                    items={bimArenaSubItems}
                    pathname={pathname}
                    handleLinkClick={handleLinkClick}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex justify-center">
      <Link href={item.url(webSubCategoryId)} onClick={handleLinkClick}>
        <Tooltip>
          <TooltipTrigger asChild>{iconEl}</TooltipTrigger>
          <TooltipContent
            side="right"
            className="bg-white text-slate-700 border border-slate-200 shadow-md"
          >
            <p className="text-xs font-medium">
              {renderBimTitle(item.title)}
            </p>
          </TooltipContent>
        </Tooltip>
      </Link>
    </div>
  );
}

// ─── ExpandedNavItem ────────────────────────────────────────────

function ExpandedNavItem({
  item,
  isActive,
  mainColor,
  showBimArenaSub,
  showBimCourseSub,
  setShowBimArenaSub,
  setShowBimCourseSub,
  handleLinkClick,
  webSubCategoryId,
  pathname,
  groupedCategories,
  bimArenaSubItems,
}: {
  item: NavItem;
  isActive: boolean;
  mainColor: string;
  showBimArenaSub: boolean;
  showBimCourseSub: boolean;
  setShowBimArenaSub: (v: boolean) => void;
  setShowBimCourseSub: (v: boolean) => void;
  handleLinkClick: () => void;
  webSubCategoryId: string;
  pathname: string | null;
  groupedCategories: Record<string, { name: string; categories: any[] }>;
  bimArenaSubItems: SubMenuItemType[];
}) {
  const isBimArena = item.title === 'BimArena';
  const isBimCourse = item.title === 'BimCourse';
  const hasSubMenu = isBimArena || isBimCourse;

  const handleItemClick = (e: React.MouseEvent) => {
    if (isBimArena) {
      e.preventDefault();
      setShowBimArenaSub(!showBimArenaSub);
    }
    if (isBimCourse) {
      e.preventDefault();
      setShowBimCourseSub(!showBimCourseSub);
    }
    handleLinkClick();
  };

  const isSubOpen =
    (isBimArena && showBimArenaSub) || (isBimCourse && showBimCourseSub);

  return (
    <div className="relative">
      <Link
        href={hasSubMenu ? '#' : item.url(webSubCategoryId)}
        onClick={handleItemClick}
        className={cn(
          'group flex items-center justify-between px-3 py-2 rounded-3xl text-sm font-semibold transition-all duration-200',
          isActive
            ? 'bg-slate-100 text-slate-900 shadow-sm'
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
        )}
        style={{
          backgroundColor: isActive ? `${mainColor}15` : undefined,
          color: isActive ? mainColor : undefined,
        }}
      >
        <div className="flex items-center gap-3">
          <item.icon
            className={cn(
              'w-4 h-4 transition-colors',
              isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100',
            )}
            style={{ color: isActive ? mainColor : undefined }}
          />
          <span>{renderBimTitle(item.title)}</span>
        </div>
        <div className="flex items-center gap-2">
          {item.badge && (
            <span
              className={cn(
                'text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase',
                item.badge === 'AI'
                  ? 'bg-purple-100 text-purple-600'
                  : 'bg-slate-100 text-slate-600',
              )}
            >
              {item.badge}
            </span>
          )}
          {hasSubMenu && (
            <ChevronDown
              className={cn(
                'w-3.5 h-3.5 transition-transform duration-200 opacity-50',
                isSubOpen ? 'rotate-180' : '',
              )}
            />
          )}
        </div>
      </Link>

      {/* BimCourse Submenu */}
      {showBimCourseSub && isBimCourse && (
        <div className="mt-1 ml-4 pl-3 border-l border-slate-200 space-y-1 relative">
          <Link
            href={`/${webSubCategoryId}/user/bimcourse`}
            onClick={handleLinkClick}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 text-xs rounded-3xl transition-colors',
              pathname === `/${webSubCategoryId}/user/bimcourse`
                ? 'text-slate-900 font-bold bg-slate-100'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50',
            )}
          >
            <div className="w-4 flex justify-center">
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
            </div>
            <span>Semua Modul</span>
          </Link>

          {Object.keys(groupedCategories).length > 0 && (
            <div className="pt-1">
              <div className="my-1.5 border-t border-slate-100 w-full" />
              {Object.entries(groupedCategories).map(([webSubId, group]) => (
                <div key={webSubId} className="mb-3 last:mb-0">
                  <p className="px-3 text-[10px] font-extrabold text-slate-400 uppercase mb-1.5 tracking-wider">
                    {group.name}
                  </p>
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
                            'flex items-center gap-2 px-3 py-1.5 text-xs rounded-3xl transition-colors',
                            isCatActive
                              ? 'text-slate-900 font-semibold bg-slate-50'
                              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50',
                          )}
                        >
                          <div className="w-4 flex justify-center">
                            <div
                              className={cn(
                                'w-1.5 h-1.5 rounded-full',
                                isCatActive ? 'bg-slate-600' : 'bg-slate-300',
                              )}
                            />
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
          <SubMenuLinks
            items={bimArenaSubItems}
            pathname={pathname}
            handleLinkClick={handleLinkClick}
          />
        </div>
      )}
    </div>
  );
}

// ─── Shared Sub-Components ──────────────────────────────────────

function SubMenuLinks({
  items,
  pathname,
  handleLinkClick,
}: {
  items: SubMenuItemType[];
  pathname: string | null;
  handleLinkClick: () => void;
}) {
  return (
    <div className="space-y-0.5">
      {items.map((sub) => {
        const isSubActive = pathname?.includes(sub.href);
        return (
          <Link
            key={sub.name}
            href={sub.href}
            onClick={handleLinkClick}
            className={cn(
              'flex items-center gap-2 px-2 py-1.5 text-xs rounded-3xl transition-colors',
              isSubActive
                ? 'text-slate-900 font-medium bg-slate-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50',
            )}
          >
            <sub.icon className="w-3.5 h-3.5 shrink-0 opacity-70" />
            <span>{sub.name}</span>
          </Link>
        );
      })}
    </div>
  );
}

function BimCourseSubmenuContent({
  webSubCategoryId,
  pathname,
  groupedCategories,
  handleLinkClick,
}: {
  webSubCategoryId: string;
  pathname: string | null;
  groupedCategories: Record<string, { name: string; categories: any[] }>;
  handleLinkClick: () => void;
}) {
  return (
    <div className="space-y-1">
      <Link
        href={`/${webSubCategoryId}/user/bimcourse`}
        onClick={handleLinkClick}
        className={cn(
          'flex items-center gap-2 px-2 py-2 text-xs rounded-3xl transition-colors',
          pathname === `/${webSubCategoryId}/user/bimcourse`
            ? 'text-slate-900 font-semibold bg-slate-100'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50',
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
                            'flex items-center gap-2 px-2 py-1.5 text-xs rounded-3xl transition-colors',
                            isCatActive
                              ? 'text-slate-900 font-semibold bg-slate-50'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50',
                          )}
                        >
                          <div
                            className={cn(
                              'w-1.5 h-1.5 rounded-full ml-1',
                              isCatActive ? 'bg-slate-600' : 'bg-slate-300',
                            )}
                          />
                          <span className="truncate">{cat.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <p className="px-2 py-1.5 text-xs text-slate-400 italic">
                    Tidak ada mata pelajaran
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
