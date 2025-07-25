/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable output standalone for optimized Docker builds
  output: 'standalone',
};

module.exports = nextConfig;
