/**
 * SNBT / UTBK subtest utilities
 *
 * Single source of truth for full-name ↔ initials mapping.
 * Use `getSnbtShortName` / `getKedinasanShortName` wherever a compact label is needed
 * (charts, tables, badges).
 * Use `getSubtestLabel(name, websiteSubCategoryId)` for components shared across websubs.
 */

// ─── SNBT ────────────────────────────────────────────────────────────────────

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
export const SNBT_SUBTEST_FULL_NAMES: Record<string, string> =
  Object.fromEntries(
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

// ─── KEDINASAN ───────────────────────────────────────────────────────────────

export const KEDINASAN_SUBTEST_INITIALS: Record<string, string> = {
  // SKD subtests
  'Seleksi Kompetensi Dasar': 'SKD',
  'Tes Wawasan Kebangsaan': 'TWK',
  'Tes Intelegensi Umum': 'TIU',
  'Tes Karakteristik Pribadi': 'TKP',
  // Bahasa Inggris variants
  'Tes Bahasa Inggris': 'TBI',
  'Bahasa Inggris': 'BI',
};

/** Reverse map: initials → full name */
export const KEDINASAN_SUBTEST_FULL_NAMES: Record<string, string> =
  Object.fromEntries(
    Object.entries(KEDINASAN_SUBTEST_INITIALS).map(([full, short]) => [
      short,
      full,
    ]),
  );

/** Ordered list of Kedinasan subtests for consistent display order */
export const KEDINASAN_SUBTEST_ORDER = [
  'Seleksi Kompetensi Dasar',
  'Tes Wawasan Kebangsaan',
  'Tes Intelegensi Umum',
  'Tes Karakteristik Pribadi',
  'Tes Bahasa Inggris',
  'Bahasa Inggris',
] as const;

/**
 * Returns the Kedinasan initials for a subtest name
 * (e.g. "Tes Wawasan Kebangsaan" → "TWK").
 * Falls back to the original name if not found.
 */
export function getKedinasanShortName(name: string): string {
  return KEDINASAN_SUBTEST_INITIALS[name] ?? name;
}

/**
 * Returns the full subtest name from Kedinasan initials
 * (e.g. "TWK" → "Tes Wawasan Kebangsaan").
 * Falls back to the original string if not found.
 */
export function getKedinasanFullName(initials: string): string {
  return KEDINASAN_SUBTEST_FULL_NAMES[initials] ?? initials;
}

/**
 * SKD/Kedinasan passing thresholds (ambang batas) per subtest.
 * Source: BKN passing grade regulation.
 */
export const KEDINASAN_PASSING_THRESHOLDS: Record<string, number> = {
  'Tes Wawasan Kebangsaan': 65,
  'Tes Intelegensi Umum': 80,
  'Tes Karakteristik Pribadi': 156,
};

/**
 * Returns the passing threshold for a Kedinasan subtest, or null if none defined.
 */
export function getKedinasanThreshold(subCategory: string): number | null {
  return KEDINASAN_PASSING_THRESHOLDS[subCategory] ?? null;
}

// ─── Shared ───────────────────────────────────────────────────────────────────

/**
 * Returns the initials for the given websub's subtest name.
 * - snbt / SNBT → SNBT initials
 * - kedinasan / KEDINASAN → Kedinasan initials
 * Falls back to `name` as-is for any other websub.
 */
export function getSubtestLabel(
  name: string,
  websiteSubCategoryId?: string,
): string {
  const id = (websiteSubCategoryId ?? '').toLowerCase();
  if (id.includes('snbt')) return getSnbtShortName(name);
  if (id.includes('kedinasan')) return getKedinasanShortName(name);
  return name;
}
