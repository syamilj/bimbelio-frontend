// Tema per track (web_sub_category), merek Bimbelio 2.1.
//
// Warna UI selalu Biru Bimbelio (--brand, tokens.css). Track hanya memberi
// warna PROGRAM: titik i logo & label nama program, satu program per tampilan
// (brand book hlm. 31). Warna program diambil dari peta merek, bukan dari
// main_color di database — nilai DB lama (Kedinasan hijau, SIMAK oranye, …)
// bertentangan dengan pedoman merek. Lihat docs/redesign/BRAND-2.1.md §10.1.

export const BRAND = '#0066ff';
/** Pengganti secondary_color lama untuk kode yang belum dimigrasi. */
export const BRAND_2 = '#4c94ff';

export const PROGRAM_COLORS = {
  utbk: '#0066ff',
  kedinasan: '#e0263b',
  campus: '#0a8fd6',
  language: '#0a9468',
} as const;

export type Program = keyof typeof PROGRAM_COLORS;

/** Program merek untuk sebuah track. Track tak dikenal → UTBK (Biru). */
export const trackProgram = (trackId: string | null | undefined): Program => {
  const id = trackId?.toLowerCase() ?? '';
  if (id.includes('kedinasan') || id.includes('stan') || id.includes('ipdn'))
    return 'kedinasan';
  if (id.includes('simak') || id.includes('ugm') || id.includes('mandiri'))
    return 'campus';
  if (id.includes('toefl') || id.includes('ielts') || id.includes('language'))
    return 'language';
  return 'utbk';
};

export const programColor = (trackId: string | null | undefined) =>
  PROGRAM_COLORS[trackProgram(trackId)];

const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Nilai dari luar hanya dipakai bila benar-benar hex (mencegah injeksi CSS). */
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

/** Rasio kontras WCAG antara dua warna hex. */
export const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

export const trackThemeCss = (trackId: string | null | undefined) =>
  `:root{--program:${programColor(trackId)};}`;

/** @deprecated Pakai token (`bg-brand/10`) — hanya untuk kode lama yang belum dimigrasi. */
export const hexToRgba = (hex?: string, opacity = 1) => {
  if (!hex) return undefined;
  const n = parseInt(expand(hex).replace('#', ''), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${opacity})`;
};
