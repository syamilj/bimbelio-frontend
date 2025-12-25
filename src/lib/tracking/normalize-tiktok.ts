export type TikTokContentType =
  | 'product'
  | 'product_group'
  | 'destination'
  | 'hotel'
  | 'flight'
  | 'vehicle';

const ALLOWED_TIKTOK_CONTENT_TYPES = new Set<TikTokContentType>([
  'product',
  'product_group',
  'destination',
  'hotel',
  'flight',
  'vehicle',
]);

const COMMERCE_ALIASES = new Set<string>([
  'product',
  'product_group',
  'plan',
  'pricing',
  'subscription',
  'payment',
  'purchase',
]);

export function normalizeTikTokContentType(input: unknown): TikTokContentType | undefined {
  if (typeof input !== 'string') return undefined;

  const value = input.trim().toLowerCase();
  if (!value) return undefined;

  if (ALLOWED_TIKTOK_CONTENT_TYPES.has(value as TikTokContentType)) {
    return value as TikTokContentType;
  }

  // Our app uses many semantic content_type values (page, course, tryout, etc).
  // TikTok strictly validates content_type, so map unknowns to a safe allowed type.
  if (COMMERCE_ALIASES.has(value)) return 'product';

  return 'destination';
}

export function normalizeTikTokCustomData(customData: Record<string, any>) {
  const normalized = { ...(customData || {}) };

  if ('content_type' in normalized) {
    const next = normalizeTikTokContentType(normalized.content_type);
    if (next) normalized.content_type = next;
    else delete normalized.content_type;
  }

  return normalized;
}
