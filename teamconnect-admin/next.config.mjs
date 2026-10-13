/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@teamconnect/shared-types",
    "@teamconnect/api-contracts",
    "@teamconnect/validation",
    "@teamconnect/shared-config",
  ],
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
};
export default nextConfig;