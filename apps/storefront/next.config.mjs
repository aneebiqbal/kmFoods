/** @type {import('next').NextConfig} */
// Defaults to ".next". Set NEXT_DIST_DIR to run a production build alongside a
// dev server without the two fighting over the same build directory.
const distDir = process.env.NEXT_DIST_DIR ?? ".next";

const nextConfig = {
  distDir,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

export default nextConfig;
