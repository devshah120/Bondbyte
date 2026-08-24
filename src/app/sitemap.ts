import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants/site";
import { PROJECTS } from "@/lib/constants/work";
import { PUBLISHED_INSIGHTS } from "@/lib/constants/insights";

// Static export has no server to regenerate these at request time, so they are
// baked into out/ at build time.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    { path: "", priority: 1 },
    { path: "/work", priority: 0.9 },
    { path: "/services", priority: 0.9 },
    { path: "/products", priority: 0.8 },
    { path: "/about", priority: 0.8 },
    { path: "/pricing", priority: 0.9 },
    { path: "/insights", priority: 0.7 },
    { path: "/contact", priority: 0.8 },
  ].map((route) => ({
    url: `${SITE.domain}${route.path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: route.priority,
  }));

  const projectRoutes = PROJECTS.map((project) => ({
    url: `${SITE.domain}/work/${project.slug}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  const insightRoutes = PUBLISHED_INSIGHTS.map((insight) => ({
    url: `${SITE.domain}/insights/${insight.slug}`,
    lastModified: new Date(`${insight.date}T00:00:00Z`),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...projectRoutes, ...insightRoutes];
}
