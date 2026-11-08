import type { MetadataRoute } from "next";
import { getContent } from "@/lib/cms/server";
import { pagePath, publishedInsights, publishedProjects } from "@/lib/cms/content";

// Pages, projects and articles change in the admin panel, so the sitemap is built on request.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getContent();
  const domain = content.settings.domain.replace(/\/+$/, "");
  const fallback = new Date(content.updatedAt);

  const pages = content.pages
    .filter((page) => page.published)
    .map((page) => ({
      url: `${domain}${page.slug ? pagePath(page) : ""}`,
      lastModified: page.updatedAt ? new Date(page.updatedAt) : fallback,
      changeFrequency: "monthly" as const,
      priority: page.slug ? 0.8 : 1,
    }));

  const projects = publishedProjects(content).map((project) => ({
    url: `${domain}/work/${project.slug}`,
    lastModified: fallback,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  const insights = publishedInsights(content).map((insight) => ({
    url: `${domain}/insights/${insight.slug}`,
    lastModified: new Date(`${insight.date}T00:00:00Z`),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...pages, ...projects, ...insights];
}
