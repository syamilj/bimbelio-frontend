import { Inter, Playfair_Display } from 'next/font/google';

// Font di-host sendiri saat build (next/font). Dulu dimuat lewat <link> Google
// Fonts yang ditulis ulang oleh Cloudflare Fonts sehingga <head> hasil server
// tidak cocok dengan React (hydration error #418 di bimbelio.com).
export const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
});

export const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

/** Pasang di <html> setiap root layout. */
export const fontVariables = `${inter.variable} ${playfair.variable}`;
