// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: false,
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@radix-ui/react-icons',
      'date-fns',
      'lodash',
    ],
  },

  // Tambahkan ini untuk hapus console di production
  compiler: {
    // Keep console.error / console.warn so production errors stay visible.
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? { exclude: ['error', 'warn'] }
        : false,
  },

  async rewrites() {
    return [
      {
        source: '/l/:code',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/l/:code`,
      },
      // {
      //   source: '/explore',
      //       destination: '/user/explore',
      //     },
      //     {
      //       source: '/course',
      //       destination: '/user/course',
      //     },
      //     {
      //       source: '/try-out',
      //       destination: '/user/try-out',
      //     },
      //     {
      //       source: '/try-out/:path*',
      //       destination: '/user/try-out/:path*',
      //     },
      //     {
      //       source: '/workspace',
      //       destination: '/user/workspace',
      //     },
      //     {
      //       source: '/workspace/:path*',
      //       destination: '/user/workspace/:path*',
      //     },
      //     {
      //       source: '/workspace/:path*/:path*',
      //       destination: '/user/workspace/:path*/:path*',
      //     },
      //     {
      //       source: '/course',
      //       destination: '/user/course',
      //     },
      //     {
      //       source: '/course/:path*',
      //       destination: '/user/course/:path*',
      //     },
      //     {
      //       source: '/search',
      //       destination: '/user/search',
      //     },
      //     {
      //       source: '/leaderboard',
      //       destination: '/user/leaderboard',
      //     },
      // {
      //   source: '/dashboard',
      //   destination: '/user/dashboard',
      // },
    ];
  },

  images: {
    // Tambah format modern untuk mengurangi ukuran transfer LCP image
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    // Next.js 16 defaults to [75], so we need to add the others used in the app
    qualities: [30, 50, 60, 75, 100],
    remotePatterns: [
      // Supabase storage (NEXT_PUBLIC_SUPABASE_*_URL)
      { protocol: 'https', hostname: 'vxouccslsjuycviqqllb.supabase.co' },
      { protocol: 'https', hostname: 'bimbelio.com' },
      { protocol: 'https', hostname: 'www.bimbelio.com' },
      // Google account avatars
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'storage.googleapis.com' },
    ],
  },
  // Tambah headers caching aset statis untuk meningkatkan FCP / repeat views
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Gambar & ikon di root/public (gunakan wildcard multi level)
        source: '/:path*.(svg|jpg|jpeg|png|webp|gif|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Video hero
        source: '/hero/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // JS & CSS di public (bila ada) - catatan: next build assets sudah diatur di _next/static
        source: '/:path*.(js|css)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
