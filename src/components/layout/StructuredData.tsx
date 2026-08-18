import { SITE, SOCIALS } from "@/lib/constants/site";
import { SERVICES } from "@/lib/constants/company";

/**
 * Organization + LocalBusiness JSON-LD (§30).
 *
 * Only verified facts are emitted. Fields we cannot confirm (founding date,
 * employee count as a public figure, ratings) are deliberately omitted rather
 * than guessed — invented schema data is a real SEO liability.
 */
export function StructuredData() {
  const sameAs = SOCIALS.filter((s) => s.url !== null).map((s) => s.url);

  const organization = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE.domain}/#organization`,
    name: SITE.legalName,
    alternateName: SITE.name,
    url: SITE.domain,
    email: SITE.email,
    telephone: SITE.phone,
    description: SITE.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.location.city,
      addressRegion: SITE.location.region,
      addressCountry: SITE.location.countryCode,
    },
    areaServed: "Worldwide",
    knowsAbout: SERVICES.map((service) => service.title),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.domain}/#website`,
    url: SITE.domain,
    name: SITE.name,
    publisher: { "@id": `${SITE.domain}/#organization` },
  };

  return (
    <script
      type="application/ld+json"
      // Static, developer-authored JSON — no user input reaches this string.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([organization, website]),
      }}
    />
  );
}
