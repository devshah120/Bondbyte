/**
 * Industry → package data.
 *
 * ⚠️ ALL PRICES ARE PLACEHOLDERS. Every package carries `isPlaceholder: true`
 * until BondByte's real rates are supplied. One data shape drives every
 * industry, so adding a new one is a data edit — never a new component.
 *
 * Yearly price is derived from monthly at a fixed discount so the toggle can
 * never drift out of sync with the advertised saving.
 */

export type PackageTier = "normal" | "exclusive" | "complete";

/** Applied to every yearly price. Change here and the UI follows. */
export const YEARLY_DISCOUNT = 0.2;

export interface FeatureGroup {
  readonly title: string;
  readonly items: readonly string[];
}

export interface Package {
  readonly tier: PackageTier;
  readonly name: string;
  readonly description: string;
  /** Monthly retainer in INR. Yearly is derived. */
  readonly monthlyPrice: number;
  readonly timeline: string;
  readonly bestFor: string;
  /** Headline features shown on the card. */
  readonly features: readonly string[];
  /** Full breakdown shown in the details drawer. */
  readonly details: readonly FeatureGroup[];
  readonly isPlaceholder: boolean;
}

export interface Industry {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly packages: Readonly<Record<PackageTier, Package>>;
}

export const TIER_LABELS: Readonly<Record<PackageTier, string>> = {
  normal: "Normal",
  exclusive: "Exclusive",
  complete: "Complete",
};

/** Yearly total for a package, after the standard discount. */
export function yearlyPrice(pkg: Package): number {
  return Math.round(pkg.monthlyPrice * 12 * (1 - YEARLY_DISCOUNT));
}

/** Formats INR without decimals, e.g. ₹1,24,999. */
export function formatINR(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

/* ── Shared feature scaffolding ────────────────────────────────────────────
   Most packages share a spine of deliverables. Composing them keeps the data
   honest and means a change to "what Normal always includes" happens once. */

const BASE_SUPPORT: FeatureGroup = {
  title: "Delivery & support",
  items: ["Deployment", "Handover documentation", "Post-launch support window"],
};

const PRO_SUPPORT: FeatureGroup = {
  title: "Delivery & support",
  items: [
    "Deployment and environment setup",
    "Handover documentation",
    "Team training session",
    "Priority support",
  ],
};

const ENTERPRISE_SUPPORT: FeatureGroup = {
  title: "Delivery & support",
  items: [
    "Dedicated deployment pipeline",
    "Full technical documentation",
    "Team training and onboarding",
    "Priority support with agreed response times",
    "Post-launch optimisation cycle",
  ],
};

export const INDUSTRIES: readonly Industry[] = [
  {
    id: "ecommerce",
    name: "E-Commerce",
    description:
      "Storefronts that load fast, convert well and stay manageable once the catalogue grows.",
    packages: {
      normal: {
        tier: "normal",
        name: "E-Commerce Starter",
        description:
          "Everything needed to sell online properly — catalogue, cart, checkout and an admin you can actually use.",
        monthlyPrice: 18999,
        timeline: "3–4 weeks",
        bestFor: "First storefronts and small catalogues",
        features: [
          "Responsive storefront",
          "Product catalogue and detail pages",
          "Cart and checkout",
          "Payment gateway",
          "Order management",
          "Basic admin panel",
        ],
        details: [
          {
            title: "Storefront",
            items: ["Homepage", "Category pages", "Product detail pages", "Cart", "Checkout"],
          },
          {
            title: "Backend",
            items: ["Product and order APIs", "Database", "Admin authentication", "Admin panel"],
          },
          { title: "Integrations", items: ["Payment gateway", "Basic analytics"] },
          BASE_SUPPORT,
        ],
        isPlaceholder: true,
      },
      exclusive: {
        tier: "exclusive",
        name: "E-Commerce Pro",
        description:
          "For stores where merchandising, retention and inventory actually matter to the numbers.",
        monthlyPrice: 39999,
        timeline: "6–8 weeks",
        bestFor: "Growing stores with real catalogue depth",
        features: [
          "Everything in Starter",
          "Advanced product management",
          "Faceted search and filtering",
          "Customer accounts and wishlists",
          "Coupons and offers",
          "Inventory management",
          "SEO and performance work",
        ],
        details: [
          {
            title: "Storefront",
            items: [
              "Everything in Starter",
              "Faceted search and filtering",
              "Customer accounts",
              "Wishlist",
              "Coupons and promotions",
            ],
          },
          {
            title: "Backend",
            items: [
              "Advanced product management",
              "Inventory management",
              "Multiple payment methods",
              "Advanced admin dashboard",
            ],
          },
          {
            title: "Integrations",
            items: ["Shipping provider", "Advanced analytics", "Email notifications"],
          },
          {
            title: "Optimisation",
            items: ["Technical SEO", "Core Web Vitals tuning", "Image and asset pipeline"],
          },
          PRO_SUPPORT,
        ],
        isPlaceholder: true,
      },
      complete: {
        tier: "complete",
        name: "E-Commerce Complete",
        description:
          "A commerce platform built to your operation — integrations, automation and architecture that scales.",
        monthlyPrice: 74999,
        timeline: "10–14 weeks",
        bestFor: "Multi-channel and high-volume operations",
        features: [
          "Everything in Starter and Pro",
          "Custom ERP/CRM integrations",
          "Workflow automation",
          "Custom dashboards",
          "Scalable architecture",
          "Advanced security",
        ],
        details: [
          {
            title: "Platform",
            items: [
              "Everything in Starter and Pro",
              "Custom storefront features",
              "Multi-channel support",
              "Custom reporting dashboards",
            ],
          },
          {
            title: "Engineering",
            items: [
              "Scalable architecture",
              "Workflow automation",
              "Third-party and ERP/CRM integrations",
              "Advanced security hardening",
            ],
          },
          ENTERPRISE_SUPPORT,
        ],
        isPlaceholder: true,
      },
    },
  },
  {
    id: "fintech",
    name: "FinTech",
    description:
      "Financial products where correctness, auditability and trust are the actual requirements.",
    packages: {
      normal: {
        tier: "normal",
        name: "FinTech Starter",
        description:
          "A secure, compliant foundation — onboarding, accounts and transactions done carefully.",
        monthlyPrice: 29999,
        timeline: "5–7 weeks",
        bestFor: "Early-stage financial products",
        features: [
          "Secure user onboarding",
          "KYC document capture",
          "Account and balance views",
          "Transaction history",
          "Admin console",
        ],
        details: [
          { title: "Product", items: ["Onboarding", "Account dashboard", "Transaction history"] },
          {
            title: "Backend",
            items: ["Secure APIs", "Encrypted data storage", "Audit logging", "Role-based access"],
          },
          { title: "Integrations", items: ["Payment gateway", "KYC document capture"] },
          BASE_SUPPORT,
        ],
        isPlaceholder: true,
      },
      exclusive: {
        tier: "exclusive",
        name: "FinTech Pro",
        description:
          "Adds the reconciliation, reporting and controls a real finance operation needs.",
        monthlyPrice: 64999,
        timeline: "8–12 weeks",
        bestFor: "Products handling live money at volume",
        features: [
          "Everything in Starter",
          "Automated reconciliation",
          "Advanced reporting",
          "Multi-account support",
          "Approval workflows",
          "Fraud checks",
        ],
        details: [
          {
            title: "Product",
            items: [
              "Everything in Starter",
              "Multi-account support",
              "Approval workflows",
              "Advanced reporting",
            ],
          },
          {
            title: "Engineering",
            items: [
              "Automated reconciliation",
              "Fraud and anomaly checks",
              "Rate limiting and abuse protection",
              "Comprehensive audit trail",
            ],
          },
          PRO_SUPPORT,
        ],
        isPlaceholder: true,
      },
      complete: {
        tier: "complete",
        name: "FinTech Complete",
        description:
          "An end-to-end financial platform with the integrations and controls of an established institution.",
        monthlyPrice: 119999,
        timeline: "14–20 weeks",
        bestFor: "Regulated and enterprise financial products",
        features: [
          "Everything in Starter and Pro",
          "Core banking / ledger integrations",
          "Custom compliance reporting",
          "High-availability architecture",
          "Advanced security review",
        ],
        details: [
          {
            title: "Platform",
            items: [
              "Everything in Starter and Pro",
              "Ledger and core system integrations",
              "Custom compliance reporting",
              "Operational dashboards",
            ],
          },
          {
            title: "Engineering",
            items: [
              "High-availability architecture",
              "Disaster recovery plan",
              "Advanced security review",
              "Performance and load testing",
            ],
          },
          ENTERPRISE_SUPPORT,
        ],
        isPlaceholder: true,
      },
    },
  },
  {
    id: "education",
    name: "Education",
    description:
      "Learning platforms that hold up when a whole cohort logs in at the same time.",
    packages: {
      normal: {
        tier: "normal",
        name: "Education Starter",
        description: "Courses, lessons and enrolment — the core of a working learning product.",
        monthlyPrice: 16999,
        timeline: "3–5 weeks",
        bestFor: "Independent educators and small institutes",
        features: [
          "Course catalogue",
          "Lesson and content pages",
          "Student enrolment",
          "Progress tracking",
          "Instructor panel",
        ],
        details: [
          {
            title: "Platform",
            items: ["Course catalogue", "Lesson delivery", "Enrolment", "Progress tracking"],
          },
          { title: "Backend", items: ["Content APIs", "User accounts", "Instructor panel"] },
          { title: "Integrations", items: ["Payment gateway", "Video hosting"] },
          BASE_SUPPORT,
        ],
        isPlaceholder: true,
      },
      exclusive: {
        tier: "exclusive",
        name: "Education Pro",
        description: "Assessment, live sessions and the analytics to see what is actually working.",
        monthlyPrice: 34999,
        timeline: "6–9 weeks",
        bestFor: "Institutes running structured programmes",
        features: [
          "Everything in Starter",
          "Quizzes and assessments",
          "Assignments and grading",
          "Live class integration",
          "Certificates",
          "Learning analytics",
        ],
        details: [
          {
            title: "Platform",
            items: [
              "Everything in Starter",
              "Quizzes and assessments",
              "Assignments and grading",
              "Certificates",
              "Discussion threads",
            ],
          },
          {
            title: "Engineering",
            items: ["Live class integration", "Learning analytics", "Bulk user management"],
          },
          PRO_SUPPORT,
        ],
        isPlaceholder: true,
      },
      complete: {
        tier: "complete",
        name: "Education Complete",
        description:
          "A full institutional platform — multi-campus, integrated and built to scale with intake.",
        monthlyPrice: 69999,
        timeline: "12–16 weeks",
        bestFor: "Universities and multi-campus institutions",
        features: [
          "Everything in Starter and Pro",
          "Multi-campus support",
          "Mobile application",
          "ERP/SIS integrations",
          "Custom dashboards",
        ],
        details: [
          {
            title: "Platform",
            items: [
              "Everything in Starter and Pro",
              "Multi-campus and multi-department",
              "Companion mobile app",
              "Custom reporting dashboards",
            ],
          },
          {
            title: "Engineering",
            items: ["ERP/SIS integration", "Scalable architecture", "Advanced access control"],
          },
          ENTERPRISE_SUPPORT,
        ],
        isPlaceholder: true,
      },
    },
  },
  {
    id: "healthcare",
    name: "Healthcare",
    description:
      "Clinical and patient-facing software where privacy and reliability are non-negotiable.",
    packages: {
      normal: {
        tier: "normal",
        name: "Healthcare Starter",
        description: "Appointments, patient records and a clean clinical interface.",
        monthlyPrice: 22999,
        timeline: "4–6 weeks",
        bestFor: "Clinics and independent practices",
        features: [
          "Appointment booking",
          "Patient records",
          "Practitioner schedules",
          "Secure messaging",
          "Admin panel",
        ],
        details: [
          {
            title: "Product",
            items: ["Appointment booking", "Patient records", "Practitioner schedules"],
          },
          {
            title: "Backend",
            items: ["Encrypted storage", "Role-based access", "Audit logging", "Admin panel"],
          },
          { title: "Integrations", items: ["Payment gateway", "SMS and email reminders"] },
          BASE_SUPPORT,
        ],
        isPlaceholder: true,
      },
      exclusive: {
        tier: "exclusive",
        name: "Healthcare Pro",
        description: "Adds telehealth, prescriptions and reporting for a busier practice.",
        monthlyPrice: 47999,
        timeline: "8–11 weeks",
        bestFor: "Multi-practitioner clinics",
        features: [
          "Everything in Starter",
          "Telehealth consultations",
          "Digital prescriptions",
          "Lab report management",
          "Billing and invoicing",
          "Clinical reporting",
        ],
        details: [
          {
            title: "Product",
            items: [
              "Everything in Starter",
              "Telehealth consultations",
              "Digital prescriptions",
              "Lab report management",
              "Billing and invoicing",
            ],
          },
          {
            title: "Engineering",
            items: ["Clinical reporting", "Multi-practitioner scheduling", "Data export"],
          },
          PRO_SUPPORT,
        ],
        isPlaceholder: true,
      },
      complete: {
        tier: "complete",
        name: "Healthcare Complete",
        description:
          "A hospital-grade platform with the integrations, security and scale a large provider needs.",
        monthlyPrice: 94999,
        timeline: "14–18 weeks",
        bestFor: "Hospitals and healthcare networks",
        features: [
          "Everything in Starter and Pro",
          "HIS/EMR integrations",
          "Patient mobile app",
          "Custom clinical dashboards",
          "Advanced security review",
        ],
        details: [
          {
            title: "Platform",
            items: [
              "Everything in Starter and Pro",
              "Patient mobile app",
              "Custom clinical dashboards",
              "Multi-facility support",
            ],
          },
          {
            title: "Engineering",
            items: [
              "HIS/EMR integration",
              "High-availability architecture",
              "Advanced security review",
            ],
          },
          ENTERPRISE_SUPPORT,
        ],
        isPlaceholder: true,
      },
    },
  },
  {
    id: "real-estate",
    name: "Real Estate",
    description:
      "Listing and property platforms where search quality decides whether enquiries happen.",
    packages: {
      normal: {
        tier: "normal",
        name: "Real Estate Starter",
        description: "Listings, search and enquiry capture, presented properly.",
        monthlyPrice: 17999,
        timeline: "3–5 weeks",
        bestFor: "Agencies and independent brokers",
        features: [
          "Property listings",
          "Search and filters",
          "Property detail pages",
          "Enquiry forms",
          "Listing admin panel",
        ],
        details: [
          {
            title: "Platform",
            items: ["Listings", "Search and filters", "Property detail pages", "Enquiry capture"],
          },
          { title: "Backend", items: ["Listing management", "Media handling", "Admin panel"] },
          { title: "Integrations", items: ["Maps", "Email notifications", "Basic analytics"] },
          BASE_SUPPORT,
        ],
        isPlaceholder: true,
      },
      exclusive: {
        tier: "exclusive",
        name: "Real Estate Pro",
        description: "Richer discovery, agent tools and a CRM that actually tracks the pipeline.",
        monthlyPrice: 36999,
        timeline: "6–9 weeks",
        bestFor: "Agencies managing large portfolios",
        features: [
          "Everything in Starter",
          "Saved searches and alerts",
          "Virtual tours",
          "Agent profiles and assignment",
          "Lead management CRM",
          "Advanced analytics",
        ],
        details: [
          {
            title: "Platform",
            items: [
              "Everything in Starter",
              "Saved searches and alerts",
              "Virtual tour embedding",
              "Agent profiles",
              "Comparison tools",
            ],
          },
          {
            title: "Engineering",
            items: ["Lead management CRM", "Advanced analytics", "Bulk listing import"],
          },
          PRO_SUPPORT,
        ],
        isPlaceholder: true,
      },
      complete: {
        tier: "complete",
        name: "Real Estate Complete",
        description:
          "A full property platform with portal integrations, automation and custom workflows.",
        monthlyPrice: 69999,
        timeline: "11–15 weeks",
        bestFor: "Developers and large networks",
        features: [
          "Everything in Starter and Pro",
          "Portal syndication",
          "Mobile application",
          "Workflow automation",
          "Custom dashboards",
        ],
        details: [
          {
            title: "Platform",
            items: [
              "Everything in Starter and Pro",
              "Companion mobile app",
              "Custom dashboards",
              "Multi-branch support",
            ],
          },
          {
            title: "Engineering",
            items: ["Property portal syndication", "Workflow automation", "Scalable architecture"],
          },
          ENTERPRISE_SUPPORT,
        ],
        isPlaceholder: true,
      },
    },
  },
  {
    id: "logistics",
    name: "Logistics",
    description:
      "Operational software for moving things — tracking, dispatch and the reporting around it.",
    packages: {
      normal: {
        tier: "normal",
        name: "Logistics Starter",
        description: "Shipment tracking and dispatch, replacing the spreadsheet.",
        monthlyPrice: 19999,
        timeline: "4–6 weeks",
        bestFor: "Regional operators",
        features: [
          "Shipment creation and tracking",
          "Customer tracking page",
          "Driver assignment",
          "Status notifications",
          "Operations panel",
        ],
        details: [
          {
            title: "Platform",
            items: ["Shipment management", "Public tracking page", "Driver assignment"],
          },
          { title: "Backend", items: ["Tracking APIs", "Status workflows", "Operations panel"] },
          { title: "Integrations", items: ["SMS and email notifications", "Maps"] },
          BASE_SUPPORT,
        ],
        isPlaceholder: true,
      },
      exclusive: {
        tier: "exclusive",
        name: "Logistics Pro",
        description: "Route planning, fleet visibility and a driver app for the field.",
        monthlyPrice: 42999,
        timeline: "8–11 weeks",
        bestFor: "Multi-fleet operations",
        features: [
          "Everything in Starter",
          "Route optimisation",
          "Live fleet tracking",
          "Driver mobile app",
          "Proof of delivery",
          "Operational reporting",
        ],
        details: [
          {
            title: "Platform",
            items: [
              "Everything in Starter",
              "Route optimisation",
              "Live fleet tracking",
              "Proof of delivery capture",
            ],
          },
          {
            title: "Engineering",
            items: ["Driver mobile app", "Operational reporting", "Warehouse and inventory views"],
          },
          PRO_SUPPORT,
        ],
        isPlaceholder: true,
      },
      complete: {
        tier: "complete",
        name: "Logistics Complete",
        description:
          "A full supply-chain platform with ERP integration, automation and custom analytics.",
        monthlyPrice: 84999,
        timeline: "13–17 weeks",
        bestFor: "National and enterprise operations",
        features: [
          "Everything in Starter and Pro",
          "ERP and WMS integrations",
          "Automated dispatch rules",
          "Custom analytics",
          "Scalable architecture",
        ],
        details: [
          {
            title: "Platform",
            items: [
              "Everything in Starter and Pro",
              "Custom analytics dashboards",
              "Multi-hub operations",
              "Client portals",
            ],
          },
          {
            title: "Engineering",
            items: ["ERP and WMS integration", "Automated dispatch rules", "Scalable architecture"],
          },
          ENTERPRISE_SUPPORT,
        ],
        isPlaceholder: true,
      },
    },
  },
  {
    id: "saas",
    name: "SaaS",
    description:
      "Subscription products — multi-tenant from day one, with billing that does not leak revenue.",
    packages: {
      normal: {
        tier: "normal",
        name: "SaaS Starter",
        description: "A working MVP: accounts, subscriptions and the core product surface.",
        monthlyPrice: 24999,
        timeline: "5–7 weeks",
        bestFor: "Founders validating a product",
        features: [
          "Marketing site",
          "Authentication and accounts",
          "Subscription billing",
          "Core application surface",
          "Admin panel",
        ],
        details: [
          {
            title: "Product",
            items: ["Marketing site", "Sign-up and onboarding", "Core application", "User settings"],
          },
          {
            title: "Backend",
            items: ["Authentication", "Subscription billing", "Database", "Admin panel"],
          },
          { title: "Integrations", items: ["Payment provider", "Transactional email", "Analytics"] },
          BASE_SUPPORT,
        ],
        isPlaceholder: true,
      },
      exclusive: {
        tier: "exclusive",
        name: "SaaS Pro",
        description: "Teams, roles, usage-based plans and the integrations customers ask for.",
        monthlyPrice: 54999,
        timeline: "9–13 weeks",
        bestFor: "Products with paying customers and a roadmap",
        features: [
          "Everything in Starter",
          "Multi-tenant workspaces",
          "Team roles and permissions",
          "Usage-based billing",
          "Public API and webhooks",
          "In-app analytics",
        ],
        details: [
          {
            title: "Product",
            items: [
              "Everything in Starter",
              "Multi-tenant workspaces",
              "Team invitations and roles",
              "In-app analytics",
              "Notification system",
            ],
          },
          {
            title: "Engineering",
            items: ["Usage-based billing", "Public API and webhooks", "Background job processing"],
          },
          PRO_SUPPORT,
        ],
        isPlaceholder: true,
      },
      complete: {
        tier: "complete",
        name: "SaaS Complete",
        description:
          "An enterprise-ready platform — SSO, audit trails, high availability and custom integrations.",
        monthlyPrice: 99999,
        timeline: "14–20 weeks",
        bestFor: "Products selling into enterprise",
        features: [
          "Everything in Starter and Pro",
          "SSO and SAML",
          "Audit logs and compliance reporting",
          "Custom integrations",
          "High-availability architecture",
        ],
        details: [
          {
            title: "Platform",
            items: [
              "Everything in Starter and Pro",
              "SSO and SAML",
              "Audit logs",
              "Custom admin dashboards",
              "White-labelling",
            ],
          },
          {
            title: "Engineering",
            items: [
              "High-availability architecture",
              "Custom integrations",
              "Load and performance testing",
              "Advanced security review",
            ],
          },
          ENTERPRISE_SUPPORT,
        ],
        isPlaceholder: true,
      },
    },
  },
  {
    id: "custom",
    name: "Custom / Other",
    description:
      "Work that does not fit a template. We scope it properly before quoting anything.",
    packages: {
      normal: {
        tier: "normal",
        name: "Discovery Sprint",
        description:
          "A short, fixed engagement that turns a rough idea into a scoped, costed plan.",
        monthlyPrice: 14999,
        timeline: "1–2 weeks",
        bestFor: "Ideas that need shaping before commitment",
        features: [
          "Stakeholder workshops",
          "Technical feasibility review",
          "Architecture outline",
          "Scoped build plan",
          "Costed roadmap",
        ],
        details: [
          {
            title: "Discovery",
            items: ["Stakeholder workshops", "User and problem definition", "Competitive review"],
          },
          {
            title: "Technical",
            items: ["Feasibility review", "Architecture outline", "Technology recommendation"],
          },
          { title: "Output", items: ["Scoped build plan", "Costed roadmap", "Risk register"] },
        ],
        isPlaceholder: true,
      },
      exclusive: {
        tier: "exclusive",
        name: "Custom Build",
        description: "A bespoke product built to a scope we agree together after discovery.",
        monthlyPrice: 59999,
        timeline: "Scoped per project",
        bestFor: "Products without an off-the-shelf shape",
        features: [
          "Everything in Discovery",
          "Custom product design",
          "Full-stack engineering",
          "Third-party integrations",
          "Deployment and handover",
        ],
        details: [
          {
            title: "Design",
            items: ["Product design", "Design system", "Prototyping", "Usability review"],
          },
          {
            title: "Engineering",
            items: [
              "Full-stack development",
              "APIs and integrations",
              "Automated testing",
              "Deployment pipeline",
            ],
          },
          PRO_SUPPORT,
        ],
        isPlaceholder: true,
      },
      complete: {
        tier: "complete",
        name: "Dedicated Team",
        description:
          "An embedded squad working continuously on your roadmap, month to month.",
        monthlyPrice: 129999,
        timeline: "Ongoing",
        bestFor: "Long-running product development",
        features: [
          "Designers and engineers on your roadmap",
          "Weekly release cadence",
          "Direct access to the team",
          "Scales up or down as needed",
          "Ongoing architecture ownership",
        ],
        details: [
          {
            title: "The team",
            items: [
              "Product manager",
              "Designer",
              "Full-stack engineers",
              "QA and release support",
            ],
          },
          {
            title: "Ways of working",
            items: [
              "Weekly releases",
              "Shared backlog",
              "Direct communication channel",
              "Monthly roadmap review",
            ],
          },
          ENTERPRISE_SUPPORT,
        ],
        isPlaceholder: true,
      },
    },
  },
];

export const TIER_ORDER: readonly PackageTier[] = ["normal", "exclusive", "complete"];
