// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Tambahkan ini untuk hapus console di production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    // Jika ingin mengecualikan beberapa jenis console:
    // removeConsole: {
    //   exclude: ['error', 'warn']
    // }
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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
