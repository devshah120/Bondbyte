/**
 * "What we build" — the product categories BondByte takes on.
 *
 * These describe capability, not a claim to have shipped in every category.
 * `tone` drives the hover preview colour so each row stays distinguishable.
 */

export interface Capability {
  readonly index: string;
  readonly title: string;
  readonly description: string;
  readonly examples: readonly string[];
  readonly tone: "indigo" | "amber" | "rose" | "emerald" | "slate";
}

export const CAPABILITIES: readonly Capability[] = [
  {
    index: "01",
    title: "SaaS Platforms",
    description:
      "Multi-tenant products with subscriptions, teams and permissions built in from the start.",
    examples: ["Billing", "Workspaces", "Roles & permissions", "Usage analytics"],
    tone: "indigo",
  },
  {
    index: "02",
    title: "Web Applications",
    description:
      "Logged-in product surfaces that stay fast as the data and the feature set grow.",
    examples: ["Dashboards", "Admin panels", "Portals", "Internal tools"],
    tone: "emerald",
  },
  {
    index: "03",
    title: "Mobile Applications",
    description:
      "Cross-platform apps from one codebase, shipped to both stores and maintained after.",
    examples: ["Flutter", "iOS", "Android", "Release management"],
    tone: "rose",
  },
  {
    index: "04",
    title: "AI & Automation",
    description:
      "Practical automation on top of your existing data — where it removes real manual work.",
    examples: ["Workflow automation", "Document processing", "Assistants", "Integrations"],
    tone: "amber",
  },
  {
    index: "05",
    title: "Enterprise Software",
    description:
      "Systems that carry operational weight, with the access control and auditing to match.",
    examples: ["ERP integration", "SSO", "Audit trails", "Reporting"],
    tone: "slate",
  },
  {
    index: "06",
    title: "APIs & Backend Systems",
    description:
      "The layer nobody sees and everything depends on — modelled properly and documented.",
    examples: ["REST APIs", "Data modelling", "Background jobs", "Third-party integrations"],
    tone: "indigo",
  },
  {
    index: "07",
    title: "FinTech & Trading Technology",
    description:
      "Money-handling software where correctness, reconciliation and auditability come first.",
    examples: ["Payments", "Reconciliation", "KYC flows", "Reporting"],
    tone: "emerald",
  },
  {
    index: "08",
    title: "Custom Digital Products",
    description:
      "Work that does not fit a category. Scoped properly, then built to that scope.",
    examples: ["Discovery", "Prototyping", "Bespoke builds", "Ongoing development"],
    tone: "rose",
  },
];
