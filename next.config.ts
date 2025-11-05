// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // OPTIMASI: Production build optimizations
  swcMinify: true,
  productionBrowserSourceMaps: false,

  // OPTIMASI: Disable unused libraries
  experimental: {
    optimizePackageImports: [
      '@radix-ui/react-select',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-tabs',
      'lucide-react',
    ],
  },

  // OPTIMASI: Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    removeDebugger: process.env.NODE_ENV === 'production',
  },

  // async rewrites() {
  //   return [
  //     {
  //       source: '/explore',
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
  //     {
  //       source: '/dashboard',
  //       destination: '/user/dashboard',
  //     },
  //   ];
  // },

  images: {
    // OPTIMASI: Modern image formats untuk reduce file size (50% lebih kecil dari PNG/JPG)
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // OPTIMASI: Device sizes untuk responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // OPTIMASI: Minimize cumulative layout shift (CLS)
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  eslint: {
    ignoreDuringBuilds: true,
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
