/** @type {import('next').NextConfig} */
// Defaults to ".next". Set NEXT_DIST_DIR to run a production build alongside a
// dev server without the two fighting over the same build directory.
const distDir = process.env.NEXT_DIST_DIR ?? ".next";

/**
 * Fail loudly rather than silently calling a local backend. This is a warning,
 * not a build failure: a storefront that cannot reach Medusa should still be
 * deployable, but the misconfiguration must be impossible to miss.
 */
const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "";
if (!backendUrl) {
  console.warn(
    "\n[next.config] NEXT_PUBLIC_MEDUSA_BACKEND_URL is not set.\n" +
      "  The storefront will not be able to reach Medusa. Set it to the public\n" +
      "  backend URL, e.g. https://api.kmfoods.store\n"
  );
} else if (/^(https?:\/\/)?(localhost|127\.0\.0\.1|\[::1\])(:|\/|$)/i.test(backendUrl)) {
  console.warn(
    `\n[next.config] NEXT_PUBLIC_MEDUSA_BACKEND_URL is "${backendUrl}".\n` +
      "  A production storefront must not call a local backend — use the public Medusa URL.\n"
  );
}

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
