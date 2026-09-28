/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations
  swcMinify: true,
  compress: true,
  productionBrowserSourceMaps: false,
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Headers for caching (production only, to avoid caching dev assets)
  headers: async () => {
    if (process.env.NODE_ENV !== 'production') {
      return [];
    }
    return [
      {
        source: '/:path((?!api/.*))*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store',
          },
        ],
      },
    ];
  },

  // Rewrites to proxy docs and health to backend on port 3000
  rewrites: async () => {
    const backendUrl = process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:8000";
    return [
      {
        source: '/docs',
        destination: `${backendUrl}/docs`,
      },
      {
        source: '/openapi.json',
        destination: `${backendUrl}/openapi.json`,
      },
      {
        source: '/health',
        destination: `${backendUrl}/health`,
      },
    ];
  },

  // Redirects for clean URLs (optional)
  redirects: async () => {
    return [];
  },

  // Environment variables
  env: {
    ...(process.env.NEXT_PUBLIC_API_URL ? { NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL } : {}),
  },

  // Experimental features for performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/*'],
  },
};

export default nextConfig;
