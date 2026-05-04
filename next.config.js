/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS === 'true';

const nextConfig = {
  output: 'export',
  basePath: isGithubActions ? '/big' : '',
  images: {
    unoptimized: true,
  },
};
module.exports = nextConfig;
