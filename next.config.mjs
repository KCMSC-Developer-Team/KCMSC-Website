/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    // Legacy public URLs that have a verified equivalent in the new site.
    // Keep these explicit. Do not redirect unrelated legacy content to the homepage.
    return [
      {
        source: "/contact-us",
        destination: "/en/contact",
        permanent: true,
      },
      {
        source: "/chairmans-message",
        destination: "/en/leadership-messages",
        permanent: true,
      },
      {
        source: "/vice-chairmans-message",
        destination: "/en/leadership-messages",
        permanent: true,
      },
      {
        source: "/chief-advisors-message",
        destination: "/en/leadership-messages",
        permanent: true,
      },
      {
        source: "/principals-message",
        destination: "/en/leadership-messages",
        permanent: true,
      },
      {
        source: "/kcmsc-2026/our-team/junior-teacher",
        destination: "/en/teachers?wing=Junior%20Wing",
        permanent: true,
      },
      {
        source: "/kcmsc-2026/our-team/senior-teacher",
        destination: "/en/teachers?wing=Senior%20Wing",
        permanent: true,
      },
      {
        source: "/kcmsc-2026/our-team/administration",
        destination: "/en/teachers?wing=Administration",
        permanent: true,
      },
      {
        source: "/notice",
        destination: "/en/notices",
        permanent: true,
      },
      {
        source: "/category/notice",
        destination: "/en/notices",
        permanent: true,
      },
      {
        source: "/career-2026",
        destination: "/en/careers",
        permanent: true,
      },
      {
        source: "/events",
        destination: "/en/events",
        permanent: true,
      },
      {
        source: "/admission",
        destination: "/en/admissions",
        permanent: true,
      },
    ];
  },
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
