import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // basePath: process.env.BASE_PATH ? process.env.BASE_PATH : "",
  // assetPrefix: process.env.URL ? process.env.URL : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://dev.pgso.bpc-bst-cd.com",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "Content-Type, Authorization, X-Session-Fingerprint, X-Session-Code, X-CSRF-Token",
          },
        ],
      },
    ];
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
