import type { Metadata } from "next";
import { getContent } from "@/lib/cms/server";
import { SiteProvider } from "@/components/site/SiteProvider";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Navbar } from "@/components/navigation/Navbar";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Footer } from "@/components/footer/Footer";
import { StructuredData } from "@/components/layout/StructuredData";
import { PageTransition } from "@/components/layout/PageTransition";

// Content comes from data/content.json and changes whenever the admin saves,
// so every page is rendered on request rather than baked in at build time.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { settings, brand } = await getContent();
  const homeTitle = settings.titleSuffix ? `${settings.name} — ${settings.titleSuffix}` : settings.name;
  let metadataBase: URL | undefined;
  try {
    metadataBase = new URL(settings.domain);
  } catch {
    metadataBase = undefined;
  }

  return {
    metadataBase,
    title: { default: homeTitle, template: `%s — ${settings.name}` },
    description: settings.description,
    keywords: settings.keywords,
    authors: [{ name: settings.legalName }],
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: settings.domain,
      siteName: settings.name,
      title: homeTitle,
      description: settings.description,
      ...(settings.shareImage ? { images: [settings.shareImage] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: homeTitle,
      description: settings.description,
      ...(settings.shareImage ? { images: [settings.shareImage] } : {}),
    },
    robots: { index: true, follow: true },
    ...(brand.favicon ? { icons: { icon: brand.favicon } } : {}),
  };
}

export default async function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const content = await getContent();
  const { settings, brand, header } = content;

  return (
    <SiteProvider value={{ name: settings.name, email: settings.email, city: settings.city, region: settings.region, brand, header }}>
      <StructuredData content={content} />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-fg focus:px-5 focus:py-2 focus:text-sm focus:text-bg"
      >
        Skip to content
      </a>
      <SmoothScroll>
        <CustomCursor />
        <Navbar />
        <div id="main">
          <PageTransition>{children}</PageTransition>
        </div>
        <Footer content={content} />
      </SmoothScroll>
    </SiteProvider>
  );
}
