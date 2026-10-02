// Aturan akses rute berdasarkan role. Dipakai proxy (server); pure agar bisa diuji.

export const STAFF_ROLES = ['ADMIN', 'SUPER_ADMIN', 'FINANCE'] as const;

export type AccessDecision =
  { type: 'allow' } | { type: 'redirect'; to: '/' | '/404' };

export function decideAccess(
  pathname: string,
  session: { role: string } | null,
): AccessDecision {
  if (!session) return { type: 'redirect', to: '/' };

  const isAdminArea = pathname.includes('admin');
  if (
    isAdminArea &&
    !(STAFF_ROLES as readonly string[]).includes(session.role)
  ) {
    return { type: 'redirect', to: '/' };
  }

  if (pathname.includes('admin/category') && session.role !== 'SUPER_ADMIN') {
    return { type: 'redirect', to: '/404' };
  }

  return { type: 'allow' };
}
