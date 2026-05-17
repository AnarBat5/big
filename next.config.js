/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'api.qrserver.com' },
      { protocol: 'https', hostname: '*.qpay.mn' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000,
  },
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  experimental: {
    // Tree-shake large icon packages — cuts bundle significantly
    optimizePackageImports: ['lucide-react'],
  },
};
module.exports = nextConfig;
