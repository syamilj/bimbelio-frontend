// Aturan akses rute berdasarkan role. Dipakai proxy (server) dan menu admin;
// pure agar bisa diuji.

export const STAFF_ROLES = ['ADMIN', 'SUPER_ADMIN', 'FINANCE'] as const;

export type StaffRole = (typeof STAFF_ROLES)[number];

const DEFAULT_ADMIN_ROLES: StaffRole[] = ['ADMIN', 'SUPER_ADMIN'];

/**
 * Role per seksi admin (segmen pertama setelah `/<track>/admin`, '' = dashboard).
 * Seksi yang tidak tercantum: ADMIN & SUPER_ADMIN.
 */
const ADMIN_SECTION_ROLES: Record<string, StaffRole[]> = {
  category: ['SUPER_ADMIN'],
  'category-tryout': ['SUPER_ADMIN'],
  'website-category': ['SUPER_ADMIN'],
  transaction: ['ADMIN', 'SUPER_ADMIN', 'FINANCE'],
};

/** Halaman awal FINANCE: satu-satunya seksi admin yang boleh dibukanya. */
const FINANCE_HOME = 'transaction';

/** Role yang boleh membuka seksi admin `section` (path relatif terhadap /<track>/admin). */
export const adminRolesFor = (section: string): StaffRole[] =>
  ADMIN_SECTION_ROLES[section.split('/')[0]] ?? DEFAULT_ADMIN_ROLES;

export type AccessDecision =
  | { type: 'allow' }
  /** `to`: '/' (beranda), '/404', atau path internal halaman lain. */
  | { type: 'redirect'; to: string };

export function decideAccess(
  pathname: string,
  session: { role: string } | null,
): AccessDecision {
  if (!session) return { type: 'redirect', to: '/' };

  const [track, area, section = ''] = pathname.split('/').filter(Boolean);
  if (area !== 'admin') return { type: 'allow' };

  if (!(STAFF_ROLES as readonly string[]).includes(session.role)) {
    return { type: 'redirect', to: '/' };
  }
  if ((adminRolesFor(section) as string[]).includes(session.role)) {
    return { type: 'allow' };
  }
  if (session.role === 'FINANCE') {
    return { type: 'redirect', to: `/${track}/admin/${FINANCE_HOME}` };
  }
  return { type: 'redirect', to: '/404' };
}
