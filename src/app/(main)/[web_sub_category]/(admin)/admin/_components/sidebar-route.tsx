'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import ChooseWebCategory from '@/components/ui/choose-web-category';
import { usePathname } from 'next/navigation';
import { FC } from 'react';
import ActiveLink from './active-link';
import {
  CATEGORY_COLORS,
  filterRoutesByRole,
  getAdminRoutes,
  type RouteItem,
} from './sidebar-routes-config';

interface SidebarRouteProps {
  minimizeSidebar?: boolean;
}

const SidebarRoute: FC<SidebarRouteProps> = ({
  minimizeSidebar: propMinimizeSidebar,
}) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { minimizeSidebar: contextMinimizeSidebar } = useAppContext();
  const minimizeSidebar =
    propMinimizeSidebar !== undefined
      ? propMinimizeSidebar
      : contextMinimizeSidebar;
  const {
    websiteSubCategory,
    type: { isCore },
  } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  // Get and filter routes
  const allRoutes = getAdminRoutes(websiteSubCategory?.id || '');
  const routes = filterRoutesByRole(allRoutes, session?.user.role, isCore);

  // Group routes by category
  const groupedRoutes = routes.reduce(
    (acc, route) => {
      if (!acc[route.category]) {
        acc[route.category] = [];
      }
      acc[route.category].push(route);
      return acc;
    },
    {} as Record<string, RouteItem[]>,
  );

  return (
    <div className="space-y-4">
      {/* Website Category Selector - Only show when expanded */}
      {!minimizeSidebar && (
        <div className="px-1 mb-2">
          <ChooseWebCategory minimizeSidebar={false} />
        </div>
      )}

      {/* Navigation Groups */}
      <div className="space-y-4">
        {Object.entries(groupedRoutes).map(([category, categoryRoutes]) => (
          <div
            key={category}
            className="space-y-1"
          >
            {/* Category Header - Only show when expanded */}
            {!minimizeSidebar && (
              <div className="px-2 mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor:
                        CATEGORY_COLORS[
                          category as keyof typeof CATEGORY_COLORS
                        ] || mainColor,
                    }}
                  />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {category}
                  </span>
                </div>
              </div>
            )}

            {/* Category Routes */}
            <div className="space-y-0.5">
              {categoryRoutes.map((route, index) => {
                const isActive = pathname
                  ?.toLowerCase()
                  .includes(route.href.split('/').pop()?.toLowerCase() || '');

                return (
                  <ActiveLink
                    key={index}
                    icon={route.icon}
                    href={route.href}
                    label={route.label}
                    description={route.description}
                    isActive={isActive}
                    minimized={minimizeSidebar}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarRoute;
