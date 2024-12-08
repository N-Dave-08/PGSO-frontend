import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  distDir: 'dist',
  basePath: '',
  assetPrefix: 'https://dev.pgso.bpc-bsis4d.com',
  // basePath: process.env.BASE_PATH ? process.env.BASE_PATH : "",
  // assetPrefix: process.env.URL ? process.env.URL : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
