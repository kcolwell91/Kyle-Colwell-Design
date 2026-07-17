import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/minimal',
        destination: '/classic',
        permanent: true,
      },
      {
        source: '/signature',
        destination: '/classic',
        permanent: true,
      },
      {
        source: '/signature/:path*',
        destination: '/classic/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
