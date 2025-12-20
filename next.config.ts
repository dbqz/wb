import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.qzwb.asia",
      },
      {
        protocol: "https",
        hostname: "7ltkyoqwkp7ntmjm.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
