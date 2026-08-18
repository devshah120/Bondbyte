/**
 * Pricing tiers and the delivery-model comparison.
 *
 * ⚠️ PRICES ARE PLACEHOLDERS — every `price` below is marked with
 * `isPlaceholder: true` and must be replaced with BondByte's real rates before
 * this section goes live. The UI renders a "from" qualifier while the flag is
 * set so no exact figure is presented as final.
 */

export interface PricingTier {
  readonly name: string;
  readonly description: string;
  /** Display string. Replace with the real rate. */
  readonly price: string;
  readonly period: string | null;
  /** TODO: set false once the real price is confirmed. */
  readonly isPlaceholder: boolean;
  readonly features: readonly string[];
  readonly cta: string;
  readonly ctaHref: string;
  readonly note: string;
  readonly featured: boolean;
}

export const PRICING_TIERS: readonly PricingTier[] = [
  {
    name: "Landing Page",
    description: "A single high-converting page, designed and built end to end.",
    price: "₹24,999",
    period: "project",
    isPlaceholder: true,
    features: [
      "Custom design — no templates",
      "Built in Next.js",
      "Mobile-first and responsive",
      "Basic SEO setup",
      "Delivered in 48 hours",
      "One month of support",
    ],
    cta: "Start a Project",
    ctaHref: "/contact",
    note: "Fixed scope, fixed price",
    featured: false,
  },
  {
    name: "Website",
    description: "A complete marketing site with the pages your business needs.",
    price: "₹74,999",
    period: "project",
    isPlaceholder: true,
    features: [
      "Everything in Landing Page",
      "Up to 8 custom pages",
      "CMS so you can edit content",
      "Contact forms and integrations",
      "Analytics and search console",
      "Three months of support",
    ],
    cta: "Start a Project",
    ctaHref: "/contact",
    note: "Most projects land here",
    featured: false,
  },
  {
    name: "Product Build",
    description:
      "A real application — web or mobile — with users, data and logic.",
    price: "₹2,49,999",
    period: "from",
    isPlaceholder: true,
    features: [
      "Product strategy and scoping",
      "Full UI/UX design system",
      "Web app or Flutter mobile app",
      "Backend, APIs and database",
      "Authentication and payments",
      "Deployment and handover",
    ],
    cta: "Get a Proposal",
    ctaHref: "/contact",
    note: "Scoped after a discovery call",
    featured: true,
  },
  {
    name: "Dedicated Team",
    description:
      "An embedded squad working alongside you, month to month.",
    price: "Custom",
    period: null,
    isPlaceholder: false,
    features: [
      "Designers and engineers on your roadmap",
      "Weekly release cadence",
      "Direct access to the team",
      "Scales up or down as needed",
    ],
    cta: "Talk to Us",
    ctaHref: "/contact",
    note: "We reply within 24 hours",
    featured: false,
  },
];

/**
 * Delivery-model comparison.
 *
 * Rows describe *structural* differences between ways of getting software
 * built — how ownership, custom logic and support work in each model. It
 * deliberately avoids claims about the quality or price of any named agency,
 * which we cannot verify and should not assert.
 */
export interface ComparisonRow {
  readonly label: string;
  readonly template: string;
  readonly freelancer: string;
  readonly inHouse: string;
  readonly bondbyte: string;
}

export const COMPARISON_COLUMNS = [
  "Website builder",
  "Freelancer",
  "In-house hire",
  "BondByte",
] as const;

export const COMPARISON_ROWS: readonly ComparisonRow[] = [
  {
    label: "Who does the work",
    template: "you",
    freelancer: "one person",
    inHouse: "you recruit and manage",
    bondbyte: "a full team",
  },
  {
    label: "Design",
    template: "pick a theme",
    freelancer: "varies by person",
    inHouse: "another hire",
    bondbyte: "custom, in-house",
  },
  {
    label: "Custom logic",
    template: "plugin limits",
    freelancer: "possible",
    inHouse: "yes",
    bondbyte: "yes — built from scratch",
  },
  {
    label: "You own the code",
    template: "no — platform locked",
    freelancer: "usually",
    inHouse: "yes",
    bondbyte: "yes, always",
  },
  {
    label: "Mobile app too",
    template: "no",
    freelancer: "rarely",
    inHouse: "another hire",
    bondbyte: "same team, Flutter",
  },
  {
    label: "If someone leaves",
    template: "n/a",
    freelancer: "project stalls",
    inHouse: "you re-hire",
    bondbyte: "the team continues",
  },
  {
    label: "After launch",
    template: "your problem",
    freelancer: "often gone",
    inHouse: "ongoing salary",
    bondbyte: "we stay involved",
  },
];
