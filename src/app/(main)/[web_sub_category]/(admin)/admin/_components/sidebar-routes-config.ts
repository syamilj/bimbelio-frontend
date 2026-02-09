import type { LucideIcon } from 'lucide-react';
import {
  Bell,
  BookOpen,
  Brain,
  ClipboardList,
  DollarSign,
  FileText,
  FolderOpen,
  Globe,
  GraduationCap,
  LayoutDashboard,
  Link2,
  Receipt,
  Ticket,
  Trophy,
  Users,
  Video,
  Wallet,
  Zap,
} from 'lucide-react';

export interface RouteItem {
  icon: LucideIcon;
  href: string;
  label: string;
  description: string;
  category: string;
}

export const ROUTE_CATEGORIES = {
  DASHBOARD: 'Dashboard',
  USERS: 'Users & Roles',
  BIMCOURSE: 'BimcCourse',
  BIMLIVE: 'BimLive',
  BIMARENA: 'BimArena',
  MARKETING: 'Content Management',
  EDUCATION: 'Education',
  PAYMENTS: 'Payments & Billing',
  SYSTEM: 'System Settings',
} as const;

export const CATEGORY_COLORS = {
  [ROUTE_CATEGORIES.DASHBOARD]: '#6366f1',
  [ROUTE_CATEGORIES.USERS]: '#8b5cf6',
  [ROUTE_CATEGORIES.BIMCOURSE]: '#ef4444',
  [ROUTE_CATEGORIES.BIMLIVE]: '#ef4444',
  [ROUTE_CATEGORIES.BIMARENA]: '#ef4444',
  [ROUTE_CATEGORIES.MARKETING]: '#f59e0b',
  [ROUTE_CATEGORIES.EDUCATION]: '#ef4444',
  [ROUTE_CATEGORIES.PAYMENTS]: '#10b981',
  [ROUTE_CATEGORIES.SYSTEM]: '#64748b',
} as const;

/**
 * Build route href with website_sub_category_id
 * @param path - Route path without leading slash
 * @param website_sub_category_id - Current website subcategory ID
 */
export const buildRouteHref = (
  path: string,
  website_sub_category_id: string,
) => {
  return `/${website_sub_category_id}/admin/${path}`;
};

/**
 * Get all admin routes with website_sub_category_id
 * @param website_sub_category_id - Current website subcategory ID
 */
export const getAdminRoutes = (
  website_sub_category_id: string,
): RouteItem[] => [
    // DASHBOARD
    {
      icon: LayoutDashboard,
      href: buildRouteHref('', website_sub_category_id),
      label: 'Dashboard',
      description: 'Overview & Analytics',
      category: ROUTE_CATEGORIES.DASHBOARD,
    },

    // USERS & ROLES
    {
      icon: Users,
      href: buildRouteHref('users', website_sub_category_id),
      label: 'Users',
      description: 'Manajemen pengguna',
      category: ROUTE_CATEGORIES.USERS,
    },
    // EDUCATION
    {
      icon: Brain,
      href: buildRouteHref('learning-analytics', website_sub_category_id),
      label: 'Learning Analytics',
      description: 'Learning analytics dashboard',
      category: ROUTE_CATEGORIES.EDUCATION,
    },

    // BIMCOURSE
    {
      icon: FolderOpen,
      href: buildRouteHref('category', website_sub_category_id),
      label: 'Document Categories',
      description: 'Kategori dokumen',
      category: ROUTE_CATEGORIES.BIMCOURSE,
    },
    {
      icon: FileText,
      href: buildRouteHref('document', website_sub_category_id),
      label: 'Documents',
      description: 'Kelola dokumen',
      category: ROUTE_CATEGORIES.BIMCOURSE,
    },
    {
      icon: BookOpen,
      href: buildRouteHref('course', website_sub_category_id),
      label: 'Courses',
      description: 'Kelola kursus',
      category: ROUTE_CATEGORIES.BIMCOURSE,
    },

    // BIMLIVE
    {
      icon: Video,
      href: buildRouteHref('live-learning', website_sub_category_id),
      label: 'Live Learning',
      description: 'Kelas live',
      category: ROUTE_CATEGORIES.BIMLIVE,
    },
    {
      icon: GraduationCap,
      href: buildRouteHref('tutors', website_sub_category_id),
      label: 'Tutors',
      description: 'Kelola tutor',
      category: ROUTE_CATEGORIES.BIMLIVE,
    },

    // BIMARENA
    {
      icon: Brain,
      href: buildRouteHref('category-tryout', website_sub_category_id),
      label: 'Tryout Categories',
      description: 'Kategori tryout',
      category: ROUTE_CATEGORIES.BIMARENA,
    },
    {
      icon: Trophy,
      href: buildRouteHref('tryout', website_sub_category_id),
      label: 'Tryouts',
      description: 'Kelola tryout',
      category: ROUTE_CATEGORIES.BIMARENA,
    },
    {
      icon: Ticket,
      href: buildRouteHref('tryout-coupon', website_sub_category_id),
      label: 'Tryout Coupons',
      description: 'Kupon tryout',
      category: ROUTE_CATEGORIES.BIMARENA,
    },
    {
      icon: Trophy,
      href: buildRouteHref('quiz-volume', website_sub_category_id),
      label: 'Quiz Volumes',
      description: 'Volume quiz',
      category: ROUTE_CATEGORIES.BIMARENA,
    },
    {
      icon: Trophy,
      href: buildRouteHref('quiz', website_sub_category_id),
      label: 'Quiz',
      description: 'Kelola quiz',
      category: ROUTE_CATEGORIES.BIMARENA,
    },

    // MARKETING & CONTENT MANAGEMENT
    {
      icon: FileText,
      href: buildRouteHref('blog', website_sub_category_id),
      label: 'Blog',
      description: 'Kelola artikel blog',
      category: ROUTE_CATEGORIES.MARKETING,
    },
    {
      icon: Link2,
      href: buildRouteHref('link-pages', website_sub_category_id),
      label: 'Link Pages',
      description: 'Link-in-bio pages',
      category: ROUTE_CATEGORIES.MARKETING,
    },
    {
      icon: Link2,
      href: buildRouteHref('short-urls', website_sub_category_id),
      label: 'Short URLs',
      description: 'URL shortener',
      category: ROUTE_CATEGORIES.MARKETING,
    },

    // PAYMENTS & BILLING
    {
      icon: DollarSign,
      href: buildRouteHref('pricing', website_sub_category_id),
      label: 'Pricing',
      description: 'Pengaturan harga',
      category: ROUTE_CATEGORIES.PAYMENTS,
    },
    {
      icon: ClipboardList,
      href: buildRouteHref('plan', website_sub_category_id),
      label: 'Plans',
      description: 'Paket berlangganan',
      category: ROUTE_CATEGORIES.PAYMENTS,
    },
    {
      icon: Receipt,
      href: buildRouteHref('transaction', website_sub_category_id),
      label: 'Transactions',
      description: 'Riwayat transaksi',
      category: ROUTE_CATEGORIES.PAYMENTS,
    },
    {
      icon: Wallet,
      href: buildRouteHref('installment', website_sub_category_id),
      label: 'Installments',
      description: 'Cicilan user',
      category: ROUTE_CATEGORIES.PAYMENTS,
    },
    {
      icon: Ticket,
      href: buildRouteHref('voucher', website_sub_category_id),
      label: 'Vouchers',
      description: 'Voucher management',
      category: ROUTE_CATEGORIES.PAYMENTS,
    },

    // SYSTEM SETTINGS
    {
      icon: Globe,
      href: buildRouteHref('website-category', website_sub_category_id),
      label: 'Web Categories',
      description: 'Kategori website',
      category: ROUTE_CATEGORIES.SYSTEM,
    },
    {
      icon: Zap,
      href: buildRouteHref('token', website_sub_category_id),
      label: 'API Tokens',
      description: 'Manajemen token',
      category: ROUTE_CATEGORIES.SYSTEM,
    },
    {
      icon: Bell,
      href: buildRouteHref('notification', website_sub_category_id),
      label: 'Notifications',
      description: 'Kelola notifikasi',
      category: ROUTE_CATEGORIES.SYSTEM,
    },
  ];

/**
 * Filter routes based on user role and website type
 */
export const filterRoutesByRole = (
  routes: RouteItem[],
  userRole?: string,
  isCore?: boolean,
): RouteItem[] => {
  return routes.filter((item) => {
    // Super admin restrictions
    if (userRole === 'ADMIN') {
      if (
        item.label === 'Document Categories' ||
        item.label === 'Tryout Categories' ||
        item.label === 'Web Categories'
      ) {
        return false;
      }
    }

    // Finance role - only Transactions & Users
    if (userRole === 'FINANCE') {
      if (item.label !== 'Transactions' && item.label !== 'Users') {
        return false;
      }
    }

    // Core website mode - limited features
    if (isCore) {
      const allowedLabels = [
        'Courses',
        'Documents',
        'Document Categories',
        'Web Categories',
        'Dashboard',
      ];
      if (!allowedLabels.includes(item.label)) {
        return false;
      }
    }

    return true;
  });
};
