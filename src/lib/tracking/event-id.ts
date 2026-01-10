export function createEventId(prefix?: string): string {
  const base =
    typeof globalThis !== 'undefined' &&
    globalThis.crypto &&
    'randomUUID' in globalThis.crypto
      ? (globalThis.crypto as Crypto).randomUUID()
      : `${Date.now()}_${Math.random().toString(16).slice(2)}`;

  return prefix ? `${prefix}_${base}` : base;
}
