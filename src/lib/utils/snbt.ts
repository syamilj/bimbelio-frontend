/**
 * SNBT / UTBK subtest utilities
 *
 * Single source of truth for full-name ↔ initials mapping.
 * Use `getSnbtShortName` wherever a compact label is needed (charts, tables, badges).
 * Use `getSnbtFullName` to go back from initials to the full name (tooltips, exports).
 */

export const SNBT_SUBTEST_INITIALS: Record<string, string> = {
  'Penalaran Umum': 'PU',
  'Pengetahuan dan Pemahaman Umum': 'PPU',
  'Pemahaman Bacaan dan Menulis': 'PBM',
  'Pengetahuan Kuantitatif': 'PK',
  'Literasi Bahasa Indonesia': 'LBI',
  'Literasi Bahasa Inggris': 'LBE',
  'Penalaran Matematika': 'PM',
};

/** Reverse map: initials → full name */
export const SNBT_SUBTEST_FULL_NAMES: Record<string, string> = Object.fromEntries(
  Object.entries(SNBT_SUBTEST_INITIALS).map(([full, short]) => [short, full]),
);

/** Ordered list of all SNBT subtests for consistent display order */
export const SNBT_SUBTEST_ORDER = [
  'Penalaran Umum',
  'Pengetahuan dan Pemahaman Umum',
  'Pemahaman Bacaan dan Menulis',
  'Pengetahuan Kuantitatif',
  'Literasi Bahasa Indonesia',
  'Literasi Bahasa Inggris',
  'Penalaran Matematika',
] as const;

/**
 * Returns the SNBT initials for a subtest name (e.g. "Penalaran Umum" → "PU").
 * Falls back to the original name if not found.
 */
export function getSnbtShortName(name: string): string {
  return SNBT_SUBTEST_INITIALS[name] ?? name;
}

/**
 * Returns the full subtest name from initials (e.g. "PU" → "Penalaran Umum").
 * Falls back to the original string if not found.
 */
export function getSnbtFullName(initials: string): string {
  return SNBT_SUBTEST_FULL_NAMES[initials] ?? initials;
}

/**
 * Returns the initials if `websiteSubCategoryId === 'snbt'`, otherwise returns `name` as-is.
 * Useful for components shared across multiple websubs.
 */
export function getSubtestLabel(name: string, websiteSubCategoryId?: string): string {
  if (websiteSubCategoryId === 'snbt') return getSnbtShortName(name);
  return name;
}
