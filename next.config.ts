import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['dev.pgso.bpc-bsis4d.com'],
  },
  output: "export",
  basePath: process.env.BASE_PATH ? process.env.BASE_PATH : "",
  assetPrefix: process.env.URL ? process.env.URL : undefined,
};

export default nextConfig;
