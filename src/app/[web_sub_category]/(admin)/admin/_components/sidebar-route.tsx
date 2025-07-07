'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import ChooseWebCategory from '@/components/ui/choose-web-category';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  Brain,
  CreditCard,
  FileText,
  FolderOpen,
  Globe,
  Receipt,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { FC } from 'react';
import ActiveLink from './active-link';

const SidebarRoute: FC = () => {
  const pathname = usePathname();
  const { minimizeSidebar } = useAppContext();
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  const routes = [
    {
      icon: Users,
      href: `/${website_sub_category_id}/admin/`,
      label: 'Users',
      description: 'Manajemen pengguna',
      category: 'Dashboard',
    },
    {
      icon: Globe,
      href: `/${website_sub_category_id}/admin/website-category`,
      label: 'Web Category',
      description: 'Kelola kategori website',
      category: 'System',
    },
    {
      icon: CreditCard,
      href: `/${website_sub_category_id}/admin/pricing`,
      label: 'Pricing',
      description: 'Pengaturan harga',
      category: 'User Management',
    },
    {
      icon: Receipt,
      href: `/${website_sub_category_id}/admin/plan`,
      label: 'Plans',
      description: 'Paket berlangganan',
      category: 'User Management',
    },
    {
      icon: CreditCard,
      href: `/${website_sub_category_id}/admin/transaction`,
      label: 'Transactions',
      description: 'Riwayat transaksi',
      category: 'User Management',
    },
    {
      icon: FileText,
      href: `/${website_sub_category_id}/admin/blog`,
      label: 'Blog',
      description: 'Kelola artikel blog',
      category: 'Content',
    },
    {
      icon: FolderOpen,
      href: `/${website_sub_category_id}/admin/category`,
      label: 'Document Categories',
      description: 'Kategori dokumen',
      category: 'Content',
    },
    {
      icon: FileText,
      href: `/${website_sub_category_id}/admin/document`,
      label: 'Documents',
      description: 'Kelola dokumen',
      category: 'Content',
    },
    {
      icon: Brain,
      href: `/${website_sub_category_id}/admin/category-tryout`,
      label: 'Tryout Categories',
      description: 'Kategori try out',
      category: 'Education',
    },
    {
      icon: Trophy,
      href: `/${website_sub_category_id}/admin/tryout`,
      label: 'Tryouts',
      description: 'Kelola try out',
      category: 'Education',
    },
    {
      icon: BookOpen,
      href: `/${website_sub_category_id}/admin/course`,
      label: 'Courses',
      description: 'Kelola kursus',
      category: 'Education',
    },
    {
      icon: Zap,
      href: `/${website_sub_category_id}/admin/token`,
      label: 'Tokens',
      description: 'Manajemen token',
      category: 'System',
    },
  ];

  // Group routes by category
  const groupedRoutes = routes.reduce(
    (acc, route) => {
      if (!acc[route.category]) {
        acc[route.category] = [];
      }
      acc[route.category].push(route);
      return acc;
    },
    {} as Record<string, typeof routes>,
  );

  const categoryColors = {
    System: '#6366f1',
    'User Management': '#10b981',
    Content: '#f59e0b',
    Education: '#ef4444',
  };

  return (
    <div className="space-y-6">
      {/* Website Category Selector - Only show when expanded */}
      {!minimizeSidebar && (
        <div className="px-3">
          <ChooseWebCategory minimizeSidebar={false} />
        </div>
      )}

      {/* Navigation Groups */}
      <div className="space-y-6">
        {Object.entries(groupedRoutes).map(([category, categoryRoutes]) => (
          <div
            key={category}
            className="space-y-2"
          >
            {/* Category Header - Only show when expanded */}
            {!minimizeSidebar && (
              <div className="px-3">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor:
                        categoryColors[
                          category as keyof typeof categoryColors
                        ] || mainColor,
                    }}
                  />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {category}
                  </span>
                </div>
              </div>
            )}

            {/* Category Routes */}
            <div className="space-y-1">
              {categoryRoutes.map((route, index) => {
                const isActive = pathname
                  ?.toLowerCase()
                  .includes(route.href.split('/').pop()?.toLowerCase() || '');

                return (
                  <ActiveLink
                    key={index}
                    icon={
                      <route.icon
                        className={cn(
                          'w-5 h-5 transition-colors duration-200',
                          isActive ? 'text-white' : 'text-gray-600',
                        )}
                      />
                    }
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
