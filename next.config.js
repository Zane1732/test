/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'gg.asuracomic.net',
      'asuracomic.net',
      'asurascans.com', 
      'img.asurascans.com',
      'asuratoon.com',
      'asura-panel.vercel.app',
      'manhwa-panel.com',
      'flamescans.org',
      'i.imgur.com',
      'imgur.com'
    ],
    unoptimized: true,
  },
  experimental: {
    serverMinification: true,
  },
  // Configure redirects if needed
  async redirects() {
    return [
      {
        source: '/manga',
        destination: '/',
        permanent: true,
      },
    ];
  },
  // Configure headers for better security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];
  },
  // Ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig; 