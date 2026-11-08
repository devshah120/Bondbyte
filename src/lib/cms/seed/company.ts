import { PROJECTS } from "./work";

/** Team — names, roles and photos verified from the legacy site. */
export interface TeamMember {
  readonly name: string;
  readonly role: string;
  readonly image: string;
  /** Real profile URL, or null to render no link. */
  readonly linkedin: string | null;
}

export const TEAM: readonly TeamMember[] = [
  { name: "Devarsh Shah", role: "Project Manager", image: "/images/team/devarsh.jpeg", linkedin: null },
  { name: "Ishan Trivedi", role: "Full Stack Developer", image: "/images/team/ishan.jpeg", linkedin: null },
  { name: "Dev Shah", role: "Full Stack Developer", image: "/images/team/dev.jpeg", linkedin: null },
  { name: "Shailesh Prajapati", role: "Designer", image: "/images/team/shailesh.jpeg", linkedin: null },
  { name: "Parshw Patel", role: "Flutter Developer", image: "/images/team/parshw.jpeg", linkedin: null },
  { name: "Bhavesh Balani", role: "Flutter Developer", image: "/images/team/bhavesh.jpeg", linkedin: null },
];

/** Services (§13) — grounded in what BondByte actually offers. */
export interface Service {
  readonly index: string;
  readonly title: string;
  readonly description: string;
  readonly capabilities: readonly string[];
}

export const SERVICES: readonly Service[] = [
  {
    index: "01",
    title: "Product Strategy",
    description:
      "We pressure-test the idea before anyone writes code — scope, users, constraints and the shortest path to something real.",
    capabilities: ["Discovery", "Scoping", "Roadmapping", "Technical planning"],
  },
  {
    index: "02",
    title: "UI/UX Design",
    description:
      "Interface systems built from real flows, not decoration. Every screen earns its place before it ships.",
    capabilities: ["Product design", "Design systems", "Prototyping", "User flows"],
  },
  {
    index: "03",
    title: "Web Development",
    description:
      "Fast, accessible, maintainable web products — from marketing sites to logged-in application surfaces.",
    capabilities: ["React", "Next.js", "Laravel", "WordPress"],
  },
  {
    index: "04",
    title: "Mobile Development",
    description:
      "Cross-platform applications that behave like native ones, shipped to both stores from one codebase.",
    capabilities: ["Flutter", "iOS", "Android", "Release management"],
  },
  {
    index: "05",
    title: "Backend & API Engineering",
    description:
      "The layer nobody sees and everybody depends on — data models, APIs and integrations built to hold up.",
    capabilities: ["Node.js", "PHP", "Python", "REST APIs"],
  },
  {
    index: "06",
    title: "Brand & Identity",
    description:
      "Marks, systems and visual language — including identity work for Gujarat 75 Years and Indian Railway.",
    capabilities: ["Logo design", "Identity systems", "Brand guidelines"],
  },
  {
    index: "07",
    title: "Cloud & DevOps",
    description:
      "Deployment that is boring on purpose: reproducible environments, sane pipelines, predictable releases.",
    capabilities: ["AWS", "Docker", "CI/CD", "Monitoring"],
  },
  {
    index: "08",
    title: "Product Growth",
    description:
      "What happens after launch — measurement, iteration and the social surface around the product.",
    capabilities: ["Analytics", "Iteration", "Social media management"],
  },
];

/** Process (§18). */
export const PROCESS_STEPS = [
  {
    index: "01",
    title: "Discover",
    description:
      "We start with the business, not the feature list — the users, the goals, the constraints, and what would make this fail.",
  },
  {
    index: "02",
    title: "Strategize",
    description:
      "Scope becomes concrete: product strategy, architecture, technology choices and a build order that gets something usable in front of people early.",
  },
  {
    index: "03",
    title: "Design & Build",
    description:
      "Interfaces are designed as systems and engineered in short, reviewable increments. You see working software throughout, not at the end.",
  },
  {
    index: "04",
    title: "Launch & Scale",
    description:
      "Deploy, measure and keep going. We stay involved once it is live, optimising against real usage rather than assumptions.",
  },
] as const;

/** Principles (§19). */
export const PRINCIPLES = [
  {
    index: "01",
    title: "Think beyond the brief.",
    description:
      "The requested feature is rarely the whole problem. We say so when we see a better route.",
  },
  {
    index: "02",
    title: "Design before we decorate.",
    description:
      "Structure, hierarchy and flow come first. Visual polish is applied to something that already works.",
  },
  {
    index: "03",
    title: "Engineer for what's next.",
    description:
      "Code is written for the version after this one — readable, typed and cheap to change.",
  },
  {
    index: "04",
    title: "Stay involved after launch.",
    description:
      "Shipping is a milestone, not an exit. We keep supporting what we build.",
  },
] as const;

/**
 * Statistics (§20) — VERIFIED VALUES ONLY.
 *
 * Deliberately excluded: the legacy site's "500 projects / 200 clients /
 * 50 team / 15 years" figures were unmodified template placeholders (the live
 * site renders them as 0) and are NOT real BondByte data.
 *
 * To add a metric, append it here only once the number is confirmed.
 */
export interface Stat {
  readonly value: number;
  readonly suffix: string;
  readonly label: string;
  readonly caption: string;
}

export const STATS: readonly Stat[] = [
  {
    value: PROJECTS.length,
    suffix: "+",
    label: "Projects shipped",
    caption: "Products, interfaces and identities delivered to date.",
  },
  {
    value: TEAM.length,
    suffix: "",
    label: "Specialists",
    caption: "Strategy, design and engineering under one roof.",
  },
  {
    value: 4,
    suffix: "",
    label: "Disciplines",
    caption: "Mobile, web, interface design and brand identity.",
  },
  {
    value: 1,
    suffix: "",
    label: "Product of our own",
    caption: "Kindify — built, launched and maintained in-house.",
  },
];

/**
 * Testimonials (§21) — structure only.
 *
 * No verified client testimonials exist yet, so this array is intentionally
 * empty and the section does not render. Add real, attributable quotes here
 * and the section appears automatically. Never populate with sample text.
 */
export interface Testimonial {
  readonly quote: string;
  readonly author: string;
  readonly role: string;
  readonly company: string;
}

export const TESTIMONIALS: readonly Testimonial[] = [];
