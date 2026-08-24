import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: `next build` emits a plain HTML/CSS/JS site into `out/`,
  // which nginx serves directly (see deploy/nginx-bondbyte.conf). No Node
  // process runs in production, so there is nothing to restart or crash.
  output: "export",

  // The default image loader needs a server to resize on demand. Static
  // export has none, so images are served as-authored from /public.
  images: { unoptimized: true },

  // Emit `about/index.html` rather than `about.html` so nginx can serve
  // clean URLs (/about) without rewrite rules.
  trailingSlash: true,
};

export default nextConfig;
