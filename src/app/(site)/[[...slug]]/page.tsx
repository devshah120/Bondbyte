import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/cms/server";
import { fillTokens, fillTokensDeep, findPage, pagePath, tokenValues } from "@/lib/cms/content";
import { HOME_PAGE_ID } from "@/lib/cms/schema";
import { SectionView } from "@/components/site/SectionView";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug?: string[] }> };

/** Every page made in the admin panel: / for the home page, /<address> for the rest. */
async function load(params: Props["params"]) {
  const { slug = [] } = await params;
  if (slug.length > 1) return null;
  const content = await getContent();
  const page = findPage(content, slug[0] ?? "");
  return page ? { content, page } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await load(params);
  if (!found) return {};
  const { content, page } = found;
  const tokens = tokenValues(content);
  const description = fillTokens(page.seoDescription, tokens) || content.settings.description;
  const { settings } = content;
  const isHome = page.id === HOME_PAGE_ID;
  const homeTitle = settings.titleSuffix ? `${settings.name} — ${settings.titleSuffix}` : settings.name;
  const shareTitle = isHome ? page.seoTitle || homeTitle : `${page.seoTitle || page.title} — ${settings.name}`;

  return {
    // The home page keeps the layout's "<name> — <tagline>" title unless it has its own.
    ...(isHome ? (page.seoTitle ? { title: { absolute: page.seoTitle } } : {}) : { title: page.seoTitle || page.title }),
    description,
    alternates: { canonical: pagePath(page) },
    // Metadata objects replace the layout's rather than merging, so these are complete.
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: settings.name,
      title: shareTitle,
      description,
      url: pagePath(page),
      ...(settings.shareImage ? { images: [settings.shareImage] } : {}),
    },
    twitter: { card: "summary_large_image", title: shareTitle, description, ...(settings.shareImage ? { images: [settings.shareImage] } : {}) },
  };
}

export default async function CmsPage({ params }: Props) {
  const found = await load(params);
  if (!found) notFound();
  const { content, page } = found;
  const tokens = tokenValues(content);

  return (
    <>
      {page.sections
        .filter((section) => section.visible)
        .map((section) => (
          <SectionView key={section.id} section={{ ...section, data: fillTokensDeep(section.data, tokens) }} content={content} />
        ))}
    </>
  );
}
