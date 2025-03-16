import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // basePath: process.env.BASE_PATH ? process.env.BASE_PATH : "",
  // assetPrefix: process.env.URL ? process.env.URL : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: "/categories/@admin/:path*",
  //       destination: "/categories/admin/:path*",
  //     },
  //   ];
  // },
};

export default nextConfig;
