import { adminPath } from '@/lib/track';
import {
  Activity,
  Bell,
  BookOpen,
  Brain,
  ClipboardList,
  DollarSign,
  FileText,
  FolderOpen,
  Globe,
  GraduationCap,
  Layers,
  LayoutDashboard,
  Link2,
  Receipt,
  Ticket,
  Trophy,
  Users,
  Video,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

type Role = 'ADMIN' | 'SUPER_ADMIN' | 'FINANCE';

export type AdminNavItem = {
  label: string;
  /** Path relatif terhadap /<track>/admin ('' = dashboard). */
  path: string;
  icon: LucideIcon;
  /** Role yang boleh melihat item ini. Tanpa ini: ADMIN & SUPER_ADMIN. */
  roles?: Role[];
  /** Tersedia di track bertipe CORE. */
  core?: boolean;
};

export type AdminNavSection = { title: string; items: AdminNavItem[] };

const SUPER: Role[] = ['SUPER_ADMIN'];

export const ADMIN_NAV: AdminNavSection[] = [
  {
    title: 'Ringkasan',
    items: [
      { label: 'Dashboard', path: '', icon: LayoutDashboard, core: true },
      { label: 'Pengguna online', path: 'users/online', icon: Users },
      {
        label: 'Learning analytics',
        path: 'learning-analytics',
        icon: Activity,
      },
    ],
  },
  {
    title: 'Materi',
    items: [
      {
        label: 'Kategori dokumen',
        path: 'category',
        icon: FolderOpen,
        roles: SUPER,
        core: true,
      },
      { label: 'Dokumen', path: 'document', icon: FileText, core: true },
      { label: 'Course', path: 'course', icon: BookOpen, core: true },
    ],
  },
  {
    title: 'Live',
    items: [
      { label: 'Live class', path: 'live-learning', icon: Video },
      { label: 'Tutor', path: 'tutors', icon: GraduationCap },
    ],
  },
  {
    title: 'Arena',
    items: [
      {
        label: 'Kategori try out',
        path: 'category-tryout',
        icon: Brain,
        roles: SUPER,
      },
      { label: 'Try out', path: 'tryout', icon: Trophy },
      { label: 'Kupon try out', path: 'tryout-coupon', icon: Ticket },
      { label: 'Volume quiz', path: 'quiz-volume', icon: Layers },
      { label: 'Quiz', path: 'quiz', icon: Trophy },
    ],
  },
  {
    title: 'Konten',
    items: [
      { label: 'Blog', path: 'blog', icon: FileText },
      { label: 'Link page', path: 'link-pages', icon: Link2 },
      { label: 'Short URL', path: 'short-urls', icon: Link2 },
    ],
  },
  {
    title: 'Pembayaran',
    items: [
      { label: 'Harga', path: 'pricing', icon: DollarSign },
      { label: 'Paket', path: 'plan', icon: ClipboardList },
      {
        label: 'Transaksi',
        path: 'transaction',
        icon: Receipt,
        roles: ['ADMIN', 'SUPER_ADMIN', 'FINANCE'],
      },
      { label: 'Cicilan', path: 'installment', icon: Wallet },
      { label: 'Voucher', path: 'voucher', icon: Ticket },
    ],
  },
  {
    title: 'Sistem',
    items: [
      {
        label: 'Kategori website',
        path: 'website-category',
        icon: Globe,
        roles: SUPER,
        core: true,
      },
      { label: 'Notifikasi', path: 'notification', icon: Bell },
    ],
  },
];

const DEFAULT_ROLES: Role[] = ['ADMIN', 'SUPER_ADMIN'];

/** Menu admin yang terlihat untuk role & tipe track tertentu. */
export function visibleAdminNav(
  role: string | undefined,
  isCoreTrack: boolean,
) {
  return ADMIN_NAV.map((section) => ({
    ...section,
    items: section.items.filter((item) => {
      const roles = item.roles ?? DEFAULT_ROLES;
      if (!role || !(roles as string[]).includes(role)) return false;
      if (isCoreTrack && !item.core) return false;
      return true;
    }),
  })).filter((section) => section.items.length > 0);
}

export const adminItemHref = (trackId: string | null, item: AdminNavItem) =>
  adminPath(trackId, item.path);

/**
 * Item aktif bila URL sama atau berada di bawahnya — per segmen, sehingga
 * `tryout` tidak ikut aktif di `tryout-coupon`. Dashboard hanya aktif persis.
 */
export function isAdminItemActive(
  pathname: string,
  href: string,
  isDashboard: boolean,
) {
  if (isDashboard) return pathname === href || pathname === `${href}/`;
  return pathname === href || pathname.startsWith(`${href}/`);
}
