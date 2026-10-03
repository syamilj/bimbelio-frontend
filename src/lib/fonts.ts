import localFont from 'next/font/local';

// Semua huruf merek Bimbelio 2.1 di-host sendiri dari repo (OFL, lisensi di
// src/fonts/licenses). Subset Latin, woff2.
// - <link> Google Fonts dulu ditulis ulang Cloudflare → hydration error #418.
// - next/font/google mengunduh saat build dan sempat gagal di Vercel.

/** UI, isi, soal & pembahasan. */
export const jakarta = localFont({
  src: '../fonts/plus-jakarta-sans-latin-wght-normal.woff2',
  weight: '200 800',
  style: 'normal',
  variable: '--font-jakarta',
  display: 'swap',
  adjustFontFallback: 'Arial',
});

/** Judul & angka besar (skor, hitung mundur, harga). Tidak di bawah 16px. */
export const parkinsans = localFont({
  src: '../fonts/parkinsans-latin-wght-normal.woff2',
  weight: '300 800',
  style: 'normal',
  variable: '--font-parkinsans',
  display: 'swap',
  adjustFontFallback: 'Arial',
});

/** Coretan Lio & mentor, stiker. Jarang dipakai → tidak di-preload. */
export const shantell = localFont({
  src: '../fonts/shantell-sans-latin-wght-normal.woff2',
  weight: '500 800',
  style: 'normal',
  variable: '--font-shantell',
  display: 'swap',
  preload: false,
  adjustFontFallback: false,
});

/** Data ujian: nomor soal, timer, skor di tabel, kode, label subtes. */
export const dmMono = localFont({
  src: '../fonts/dm-mono-latin-500-normal.woff2',
  weight: '500',
  style: 'normal',
  variable: '--font-dm-mono',
  display: 'swap',
  preload: false,
  adjustFontFallback: false,
});

/** Dipasang sekali di <html> pada root layout. */
export const fontVariables = [
  jakarta.variable,
  parkinsans.variable,
  shantell.variable,
  dmMono.variable,
].join(' ');
