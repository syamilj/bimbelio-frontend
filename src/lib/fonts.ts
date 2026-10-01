import localFont from 'next/font/local';

// Font di-host sendiri dari repo (variable font, lisensi OFL, sumber: Fontsource).
// - Dulu dimuat lewat <link> Google Fonts yang ditulis ulang Cloudflare Fonts
//   sehingga <head> tidak cocok dengan React (hydration error #418).
// - next/font/google mengunduh font saat build dan sempat gagal di Vercel;
//   file lokal membuat build tidak bergantung jaringan.
export const inter = localFont({
  src: '../fonts/inter-latin-wght-normal.woff2',
  weight: '100 900',
  style: 'normal',
  variable: '--font-inter',
  display: 'swap',
});

export const playfair = localFont({
  src: [
    {
      path: '../fonts/playfair-display-latin-wght-normal.woff2',
      weight: '400 900',
      style: 'normal',
    },
    {
      path: '../fonts/playfair-display-latin-wght-italic.woff2',
      weight: '400 900',
      style: 'italic',
    },
  ],
  variable: '--font-playfair',
  display: 'swap',
});

/** Pasang di <html> setiap root layout. */
export const fontVariables = `${inter.variable} ${playfair.variable}`;
