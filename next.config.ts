import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // basePath: process.env.BASE_PATH ? process.env.BASE_PATH : "",
  // assetPrefix: process.env.URL ? process.env.URL : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL 
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`
          : 'https://server.pgso.bpc-bsis4d.com/public/api/:path*'
      }
    ]
  }
};

export default nextConfig;