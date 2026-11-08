import type { SiteContent } from "@/lib/cms/types";

/**
 * Organization + WebSite JSON-LD (§30), built from General settings.
 *
 * Only verified facts are emitted. Fields we cannot confirm (founding date,
 * employee count as a public figure, ratings) are deliberately omitted rather
 * than guessed — invented schema data is a real SEO liability.
 */
export function StructuredData({ content }: { content: SiteContent }) {
  const { settings, footer, services } = content;
  const domain = settings.domain.replace(/\/+$/, "");
  const sameAs = footer.socials.map((social) => social.url);

  const organization = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${domain}/#organization`,
    name: settings.legalName,
    alternateName: settings.name,
    url: domain,
    email: settings.email,
    ...(settings.phone ? { telephone: settings.phone } : {}),
    description: settings.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: settings.city,
      addressRegion: settings.region,
      addressCountry: settings.countryCode,
    },
    areaServed: "Worldwide",
    knowsAbout: services.map((service) => service.title),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${domain}/#website`,
    url: domain,
    name: settings.name,
    publisher: { "@id": `${domain}/#organization` },
  };

  return (
    <script
      type="application/ld+json"
      // Text comes from the admin panel, so `<` is escaped: it can never close the script element.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([organization, website]).replace(/</g, "\\u003c"),
      }}
    />
  );
}
