/**
 * Shape of the content stored in data/content.json.
 *
 * Everything the admin panel edits lives in one SiteContent object. The
 * schema in ./schema.ts describes the same shape for forms and validation;
 * keep the two in step when adding a field.
 */

export type Tone = "indigo" | "amber" | "rose" | "emerald" | "slate";
export type PackageTier = "normal" | "exclusive" | "complete";

export interface Link {
  id: string;
  label: string;
  href: string;
}

export interface Social {
  id: string;
  label: string;
  url: string;
}

export interface Settings {
  name: string;
  legalName: string;
  description: string;
  email: string;
  phone: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  registration: string;
  domain: string;
  titleSuffix: string;
  keywords: string[];
  shareImage: string;
  yearlyDiscount: number;
  tierNormal: string;
  tierExclusive: string;
  tierComplete: string;
  techCategories: string[];
  insightCategories: string[];
  disciplines: string[];
}

export interface Header {
  leftLinks: Link[];
  rightLinks: Link[];
  ctaLabel: string;
  ctaHref: string;
  mobileExtraLinks: Link[];
  mobileCtaLabel: string;
}

export interface Footer {
  blurb: string;
  navTitle: string;
  navLinks: Link[];
  servicesTitle: string;
  servicesCount: number;
  contactTitle: string;
  socials: Social[];
  showUdyamMark: boolean;
  wordmark: string;
}

export interface Brand {
  logo: string;
  wordFirst: string;
  wordSecond: string;
  favicon: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  discipline: string;
  summary: string;
  description: string;
  year: string;
  stack: string[];
  metrics: { id: string; value: string; label: string }[];
  image: string;
  tone: Tone;
  featured: boolean;
  published: boolean;
}

export type InsightBlockType = "p" | "h2" | "quote" | "list";

export interface InsightBlock {
  id: string;
  type: InsightBlockType;
  text: string;
  items: string[];
}

export interface Insight {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  featured: boolean;
  published: boolean;
  body: InsightBlock[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  capabilities: string[];
}

export interface Capability {
  id: string;
  title: string;
  description: string;
  examples: string[];
  tone: Tone;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  linkedin: string;
}

export interface Technology {
  id: string;
  name: string;
  category: string;
  weight: string;
}

export interface Step {
  id: string;
  title: string;
  description: string;
}

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  ctaHref: string;
  note: string;
  featured: boolean;
}

export interface ComparisonRow {
  id: string;
  label: string;
  template: string;
  freelancer: string;
  inHouse: string;
  bondbyte: string;
}

export interface Package {
  name: string;
  description: string;
  monthlyPrice: number;
  timeline: string;
  bestFor: string;
  features: string[];
  details: { id: string; title: string; items: string[] }[];
}

export interface Industry {
  id: string;
  slug: string;
  name: string;
  description: string;
  normal: Package;
  exclusive: Package;
  complete: Package;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  problem: string;
  solution: string;
  features: string[];
  stack: string[];
  status: string;
  caseStudy: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
}

export interface Client {
  id: string;
  name: string;
}

export interface Section {
  id: string;
  type: string;
  visible: boolean;
  data: Record<string, unknown>;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  seoTitle: string;
  seoDescription: string;
  sections: Section[];
  updatedAt?: string;
}

export interface Collections {
  projects: Project[];
  insights: Insight[];
  services: Service[];
  capabilities: Capability[];
  team: TeamMember[];
  technologies: Technology[];
  processSteps: Step[];
  principles: Step[];
  pricingTiers: PricingTier[];
  comparisonRows: ComparisonRow[];
  industries: Industry[];
  products: Product[];
  testimonials: Testimonial[];
  clients: Client[];
}

export interface Objects {
  settings: Settings;
  header: Header;
  footer: Footer;
  brand: Brand;
}

export type CollectionKey = keyof Collections;
export type ObjectKey = keyof Objects;

export interface SiteContent extends Objects, Collections {
  schemaVersion: number;
  updatedAt: string;
  /** Save counter per part, used to stop two devices overwriting each other. */
  revisions: Record<string, number>;
  pages: Page[];
}

export type InquiryStatus = "new" | "read" | "archived";

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  file: string;
  url: string;
  name: string;
  type: string;
  size: number;
  width: number | null;
  height: number | null;
  uploadedAt: string;
}

export interface HistoryEntry {
  id: string;
  savedAt: string;
  summary: string;
  key: string | null;
  restoredFrom?: string;
}

/** Heading fields most page sections share. */
export interface HeadingData {
  eyebrow?: string;
  heading: string[];
  description?: string;
}
