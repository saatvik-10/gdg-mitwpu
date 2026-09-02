import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["gsap", "lenis", "lucide-react"],
  },
  allowedDevOrigins: ['192.168.29.15', '10.20.93.40', '10.110.147.11', 'localhost'],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      {
        source: "/(.*)\\.(avif|webp|jpg|jpeg|png|svg|ico|woff|woff2)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
