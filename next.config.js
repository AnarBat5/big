/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/big',
  images: {
    unoptimized: true,
  },
};
module.exports = nextConfig;
