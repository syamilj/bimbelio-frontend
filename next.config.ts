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
    styledComponents: true, // Optimize CSS-in-JS
  },

  // OPTIMASI: Reduce initial JS bundle
  webpack: (config: any, { isServer }: any) => {
    if (!isServer) {
      config.optimization.splitChunks.chunks = 'all';
    }
    return config;
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
        // OPTIMASI: Next.js compiled assets - cache aggressive di browser
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        // OPTIMASI: Static images & media - permanent cache
        source: '/:path*.(svg|jpg|jpeg|png|webp|gif|ico|woff2|woff|ttf)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        // OPTIMASI: Hero video assets - permanent cache
        source: '/hero/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // OPTIMASI: Reduce redirect chains - preload resource hints
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Link',
            value:
              '</fonts/Inter.woff2>;rel=preload;as=font;type=font/woff2;crossorigin, </hero/hero-bg-web.webp>;rel=preload;as=image;type=image/webp',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
