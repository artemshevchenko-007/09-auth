import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
    remotePatterns: [
      {
        hostname: 'ac.goit.global',
      },
    ],
  },
};

export default nextConfig;