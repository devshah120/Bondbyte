import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The site runs as a Node server so the admin panel and its JSON API work.
  // `standalone` emits .next/standalone with a minimal server.js and only the
  // node_modules it needs, which the deploy workflow ships to the server.
  output: "standalone",

  // Images are served as-authored from /public and /uploads (the admin's
  // media library). Turning optimisation on would need `sharp` on the server.
  images: { unoptimized: true },

  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
