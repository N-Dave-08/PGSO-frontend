import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: process.env.BASE_PATH || "",
  assetPrefix: process.env.NEXT_PUBLIC_API_BASE_URL || "",
};

export default nextConfig;
