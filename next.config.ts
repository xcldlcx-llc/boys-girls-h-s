import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.edl.io" },
      { protocol: "https", hostname: "schools.nyc.gov" },
      { protocol: "https", hostname: "www.schools.nyc.gov" },
      { protocol: "https", hostname: "www.boysandgirlshs.org" },
      { protocol: "https", hostname: "cdn-blob-prd.azureedge.net" },
      { protocol: "https", hostname: "d3id26kdqbehod.cloudfront.net" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
