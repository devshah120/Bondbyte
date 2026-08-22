/**
 * Portfolio data — all projects verified from bondbyte.in.
 *
 * IMPORTANT: no metrics, results, revenue figures or user counts are recorded
 * here, because none are published or verified. `metrics` stays empty until
 * real figures are supplied; the UI renders nothing when it is empty.
 */

export type Discipline =
  | "Mobile Application"
  | "Web Development"
  | "UI/UX Design"
  | "Logo Design";

export interface Project {
  /** URL-safe id, also used as the case-study route segment. */
  readonly slug: string;
  readonly title: string;
  readonly discipline: Discipline;
  /** One-line editorial summary. */
  readonly summary: string;
  /** Longer description — verified copy only. */
  readonly description: string | null;
  readonly year: string | null;
  readonly stack: readonly string[];
  /** Verified outcome metrics. Empty until real numbers are provided. */
  readonly metrics: readonly { readonly value: string; readonly label: string }[];
  /**
   * Real screenshot path under /public/images. Null renders the designed
   * abstract visual instead — drop a file in and set the path to swap it.
   */
  readonly image: string | null;
  /** Accent used by the generated visual, keeps each case study distinct. */
  readonly tone: "indigo" | "amber" | "rose" | "emerald" | "slate";
  readonly featured: boolean;
}

export const PROJECTS: readonly Project[] = [
  {
    slug: "kindify",
    title: "Kindify",
    discipline: "Mobile Application",
    summary: "A single place for NGOs to register, receive and route donations.",
    description:
      "Kindify is a platform where NGOs register and take donations, with payment routing handling the flow of funds to the right organisation.",
    year: null,
    stack: ["Flutter", "Node.js", "MongoDB"],
    metrics: [],
    image: "/images/kindify.webp",
    tone: "indigo",
    featured: true,
  },
  {
    slug: "padhaku",
    title: "Padhaku",
    discipline: "Mobile Application",
    summary: "A learning platform that keeps students moving through the material.",
    description:
      "Padhaku brings courses, lessons and student progress into one place, so educators can publish material and track how learners are actually doing without stitching together separate tools.",
    year: null,
    stack: ["React", "Node.js", "MongoDB"],
    metrics: [],
    image: "/images/padhaku.png",
    tone: "amber",
    featured: true,
  },
  {
    slug: "furmart",
    title: "Furmart",
    discipline: "UI/UX Design",
    summary: "An end-to-end interface system for a furniture retail experience.",
    description: null,
    year: null,
    stack: ["Figma", "Design System"],
    metrics: [],
    image: "/images/furmart.webp",
    tone: "emerald",
    featured: true,
  },
  {
    slug: "monginis-bakery",
    title: "Monginis Bakery",
    discipline: "UI/UX Design",
    summary: "A warm, appetite-led ordering experience for a bakery chain.",
    description: null,
    year: null,
    stack: ["Figma", "Prototyping"],
    metrics: [],
    image: "/images/monginis.webp",
    tone: "rose",
    featured: true,
  },
  {
    slug: "gujarat-75-years",
    title: "Gujarat 75 Years",
    discipline: "Logo Design",
    summary: "A commemorative identity marking 75 years of Gujarat.",
    description: null,
    year: null,
    stack: ["Identity", "Illustration"],
    metrics: [],
    image: "/images/75-years-gujarat.webp",
    tone: "slate",
    featured: false,
  },
  {
    slug: "indian-railway-digital-clock",
    title: "Indian Railway Digital Clock",
    discipline: "Logo Design",
    summary: "An identity for a digital clock system built for Indian Railway.",
    description: null,
    year: null,
    stack: ["Identity"],
    metrics: [],
    image: "/images/indian-rail-logo-design.webp",
    tone: "slate",
    featured: false,
  },
  {
    slug: "kindify-logo",
    title: "Kindify Identity",
    discipline: "Logo Design",
    summary: "The mark and identity system behind the Kindify platform.",
    description: null,
    year: null,
    stack: ["Identity"],
    metrics: [],
    image: "/images/kindify-logo-design.webp",
    tone: "indigo",
    featured: false,
  },
];

export const FEATURED_PROJECTS = PROJECTS.filter((p) => p.featured);

/** Clients named on the existing BondByte site. */
export const CLIENTS: readonly string[] = ["Padhaku", "DeepPockets Investments"];

/**
 * Products BondByte owns, as distinct from client work (§16).
 */
export interface Product {
  readonly name: string;
  readonly tagline: string;
  readonly problem: string;
  readonly solution: string;
  readonly features: readonly string[];
  readonly stack: readonly string[];
  readonly status: string;
}

export const PRODUCTS: readonly Product[] = [
  {
    name: "Kindify",
    tagline: "Donations, routed to the organisations that need them.",
    problem:
      "Smaller NGOs rarely have the engineering budget to run trustworthy online donations, so giving stays offline and hard to track.",
    solution:
      "A shared platform where NGOs register once and receive donations through built-in payment routing, without building any of it themselves.",
    features: [
      "NGO registration and verification",
      "Donation collection",
      "Payment routing to the receiving organisation",
      "Mobile-first giving experience",
    ],
    stack: ["Flutter", "Node.js", "MongoDB"],
    status: "Live",
  },
];
