import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
