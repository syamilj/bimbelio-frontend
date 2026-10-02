import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Subdomain lokal untuk uji mode domain terpisah (E2E project `domains`).
  allowedDevOrigins: ['www.localhost', 'app.localhost', 'admin.localhost'],
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'date-fns',
      'recharts',
    ],
  },
  compiler: {
    // console.error / console.warn tetap ada di produksi agar error terlihat.
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? { exclude: ['error', 'warn'] }
        : false,
  },
  images: {
    // Optimasi gambar Vercel sengaja dimatikan: keputusan pemilik, tanpa biaya
    // tambahan Vercel (lihat docs/redesign/PLAN.md §8).
    unoptimized: true,
    qualities: [50, 60, 75, 90],
    remotePatterns: [
      { protocol: 'https', hostname: 'storage.bimbelio.com' },
      { protocol: 'https', hostname: 'storage-upload.bimbelio.com' },
      { protocol: 'https', hostname: 'vxouccslsjuycviqqllb.supabase.co' },
      { protocol: 'https', hostname: 'bimbelio.com' },
      { protocol: 'https', hostname: 'www.bimbelio.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'storage.googleapis.com' },
    ],
  },
  // URL publik distandarkan ke bahasa Inggris; URL lama dialihkan permanen agar
  // tautan di iklan, WhatsApp, mesin pencari, dan bookmark tetap berfungsi.
  async redirects() {
    return [
      { source: '/beasiswa', destination: '/scholarship', permanent: true },
      { source: '/tutor', destination: '/#tutors', permanent: true },
      // Tautan pendek: backend mencatat klik lalu mengalihkan ke tujuan.
      {
        source: '/l/:code',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/l/:code`,
        permanent: false,
      },
      {
        source: '/:track/user/paket-belajar',
        destination: '/:track/user/plans',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // Video hero berversi lewat nama berkas.
        source: '/hero/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Aset publik di-cache browser setahun (sama seperti produksi lama) agar
        // tidak menambah Edge Request Vercel. Mengganti gambar = ganti nama berkas.
        source: '/:path*.(svg|jpg|jpeg|png|webp|gif|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Service worker push notification harus selalu versi terbaru.
        source: '/sw.js',
        headers: [{ key: 'Cache-Control', value: 'no-cache' }],
      },
    ];
  },
};

export default nextConfig;
