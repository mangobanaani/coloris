/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable output standalone for optimized Docker builds
  output: 'standalone',
  
  // Security headers
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';
    const scriptSrc = isDev 
      ? "'self' 'unsafe-inline' 'unsafe-eval'" 
      : "'self' 'unsafe-inline'";
      
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self'; script-src ${scriptSrc}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:;`,
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
