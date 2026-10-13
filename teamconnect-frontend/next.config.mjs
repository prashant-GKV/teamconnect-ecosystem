/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  swcMinify: true,
  transpilePackages: [
    "@teamconnect/shared-types",
    "@teamconnect/api-contracts",
    "@teamconnect/validation",
    "@teamconnect/shared-config",
  ],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "http",  hostname: "localhost" },
    ],
  },
  // experimental: {
  //   optimizePackageImports: [
  //     "lucide-react",
  //     "date-fns",
  //     "@radix-ui/react-dialog",
  //     "@radix-ui/react-toast",
  //     "@radix-ui/react-alert-dialog",
  //     "@radix-ui/react-select",
  //     "@tanstack/react-query",
  //   ],
  // },
  compiler: {
    // Drop console.log/debug in production; keep error and warn for visibility
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  async headers() {
    return [
      {
        // HTML documents — allow bfcache (no no-store)
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            // private, no-cache allows bfcache; no-store would block it
            value: "private, no-cache, must-revalidate",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
      {
        // Static assets — immutable long-cache
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
