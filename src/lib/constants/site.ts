/**
 * Canonical company data.
 *
 * SOURCE OF TRUTH: every value below is verified from the existing BondByte
 * website (bondbyte.in) or the legacy portfolio source. Nothing here is
 * invented. Fields that could not be verified are typed as `null` and are
 * skipped by the UI rather than filled with a guess.
 */

export const SITE = {
  name: "BondByte",
  legalName: "BondByte Technologies",
  domain: "https://bondbyte.in",
  description:
    "BondByte partners with ambitious companies to design, engineer and scale high-performance digital products.",
  email: "support@bondbyte.in",
  phone: "+91 91063 15912",
  phoneHref: "tel:+919106315912",
  location: {
    city: "Ahmedabad",
    region: "Gujarat",
    country: "India",
    countryCode: "IN",
  },
} as const;

/**
 * Social profiles. The legacy site rendered icons pointing at "#" — no real
 * URLs existed. Add real URLs here and they appear automatically; entries
 * left null are not rendered.
 */
export const SOCIALS: readonly { label: string; url: string | null }[] = [
  { label: "LinkedIn", url: null },
  { label: "Instagram", url: null },
  { label: "GitHub", url: null },
];

/* Split either side of the centred wordmark in the header. */
export const NAV_LEFT = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
] as const;

export const NAV_RIGHT = [
  { label: "Insights", href: "/insights" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
] as const;

/** Flat list for the mobile menu, footer and sitemap. */
export const NAV_LINKS = [
  ...NAV_LEFT,
  ...NAV_RIGHT,
  { label: "Products", href: "/products" },
] as const;
