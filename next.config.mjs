/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      // The admission certificate validator allows files up to 5 MB.
      bodySizeLimit: "6mb",
    },
  },
  images: {
    // Phase 1: no real media host configured yet. Add the eventual
    // blob/CDN storage domain here in Phase 3 when media upload lands.
    remotePatterns: []
  }
};

export default nextConfig;
