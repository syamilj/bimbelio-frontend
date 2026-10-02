// Tema per track (web_sub_category): warna utama & sekunder dari database
// dipasang sebagai CSS variable; semua turunan dihitung di tokens.css.

export const DEFAULT_BRAND = '#0091ff';
export const DEFAULT_BRAND_2 = '#5aa4dd';

const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Nilai dari database hanya dipakai bila benar-benar hex (mencegah injeksi CSS). */
export const safeHex = (value: string | null | undefined, fallback: string) =>
  value && HEX.test(value.trim()) ? value.trim().toLowerCase() : fallback;

const expand = (hex: string) =>
  hex.length === 4 ? `#${[...hex.slice(1)].map((c) => c + c).join('')}` : hex;

const channel = (v: number) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

/** Luminans relatif WCAG. */
export const luminance = (hex: string) => {
  const n = parseInt(expand(hex).slice(1), 16);
  return (
    0.2126 * channel((n >> 16) & 255) +
    0.7152 * channel((n >> 8) & 255) +
    0.0722 * channel(n & 255)
  );
};

/**
 * Warna teks di atas tombol brand. Tombol memakai --brand-strong (brand 80% +
 * hitam), jadi luminans dihitung dari versi yang lebih gelap itu.
 */
export const brandInk = (hex: string) =>
  luminance(hex) * 0.62 > 0.32 ? '#1b2230' : '#ffffff';

export const trackThemeCss = (
  main: string | null | undefined,
  secondary: string | null | undefined,
) => {
  const brand = safeHex(main, DEFAULT_BRAND);
  const brand2 = safeHex(secondary, DEFAULT_BRAND_2);
  return `:root{--brand:${brand};--brand-2:${brand2};--brand-ink:${brandInk(brand)};}`;
};

/** @deprecated Pakai token (`bg-brand/10`) — hanya untuk kode lama yang belum dimigrasi. */
export const hexToRgba = (hex?: string, opacity = 1) => {
  if (!hex) return undefined;
  const n = parseInt(expand(hex).replace('#', ''), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${opacity})`;
};
