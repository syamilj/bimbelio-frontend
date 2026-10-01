import localFont from 'next/font/local';

// Plus Jakarta Sans (variable, subset latin, OFL) di-host sendiri dari repo.
// - <link> Google Fonts dulu ditulis ulang Cloudflare → hydration error #418.
// - next/font/google mengunduh saat build dan sempat gagal di Vercel.
export const jakarta = localFont({
  src: '../fonts/plus-jakarta-sans-latin-wght-normal.woff2',
  weight: '200 800',
  style: 'normal',
  variable: '--font-jakarta',
  display: 'swap',
  adjustFontFallback: 'Arial',
});

/** Dipasang sekali di <html> pada root layout. */
export const fontVariables = jakarta.variable;
