import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Custom domain
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'agentmarketplace-kohl.vercel.app',
          },
        ],
        destination: 'https://agenthub.syncoe.com/:path*',
        permanent: true,
      },
    ];
  },
  images: {
    // Allow agent detail OG images to be served
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
};

export default nextConfig;
