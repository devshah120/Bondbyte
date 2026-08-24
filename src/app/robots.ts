import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants/site";

// Static export has no server to regenerate these at request time, so they are
// baked into out/ at build time.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `${SITE.domain}/sitemap.xml`,
  };
}
