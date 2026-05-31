import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/zenzi-cafe",
  assetPrefix: "/zenzi-cafe",
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
