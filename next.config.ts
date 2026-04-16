import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '1ummahng.org',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
};

export default nextConfig;
