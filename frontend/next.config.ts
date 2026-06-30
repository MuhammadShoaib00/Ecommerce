import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product images are admin-provided URLs (e.g. Unsplash in the seed data),
    // so we allow any remote https/http host to be optimized by next/image.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

export default nextConfig;
