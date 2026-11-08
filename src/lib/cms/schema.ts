/**
 * Content schema: every editable field, described once.
 *
 * The admin panel builds its forms from these definitions and the server
 * validates every save against them, so adding a field here (plus its type in
 * ./types.ts and its use in a component) is all a new field needs.
 *
 * This module runs in the browser and on the server — no Node imports.
 */

import type { CollectionKey, ObjectKey } from "./types";

export const SCHEMA_VERSION = 1;

export type FieldType =
  | "text"
  | "textarea"
  | "email"
  | "url"
  | "link"
  | "slug"
  | "date"
  | "image"
  | "select"
  | "number"
  | "checkbox"
  | "lines"
  | "list"
  | "group";

export type Option = string | { value: string; label: string };
type Values = Record<string, unknown>;

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  placeholder?: string;
  /** Takes the full row in the form grid. */
  full?: boolean;
  /** Longest text (characters), or the largest number. */
  max?: number;
  min?: number;
  default?: unknown;
  options?: Option[];
  /** Select options read from a list in General settings. */
  optionsFrom?: "disciplines" | "insightCategories" | "techCategories";
  /** For `list` and `group`. */
  fields?: Field[];
  itemLabel?: string;
  labelKey?: string;
  maxItems?: number;
  /** Shows the field only when this returns true for the current values. */
  when?: (values: Values) => boolean;
}

export interface Group {
  title?: string;
  description?: string;
  fields: Field[];
}

export const TOKENS_HELP =
  "Automatic values: {company}, {legalName}, {email}, {phone}, {city}, {region}, {country}, {year}, {teamCount}, {projectCount}.";

const TONES: Option[] = [
  { value: "indigo", label: "Indigo" },
  { value: "amber", label: "Amber" },
  { value: "rose", label: "Rose" },
  { value: "emerald", label: "Emerald" },
  { value: "slate", label: "Slate" },
];

/* ── Reusable field builders ─────────────────────────────────────────────── */

const text = (key: string, label: string, extra: Partial<Field> = {}): Field => ({ key, label, type: "text", max: 200, ...extra });
const area = (key: string, label: string, extra: Partial<Field> = {}): Field => ({ key, label, type: "textarea", max: 2000, ...extra });
const lines = (key: string, label: string, extra: Partial<Field> = {}): Field => ({ key, label, type: "lines", max: 400, maxItems: 40, ...extra });
const link = (key: string, label: string, extra: Partial<Field> = {}): Field => ({ key, label, type: "link", max: 300, ...extra });
const check = (key: string, label: string, extra: Partial<Field> = {}): Field => ({ key, label, type: "checkbox", ...extra });
const image = (key: string, label: string, extra: Partial<Field> = {}): Field => ({ key, label, type: "image", max: 500, ...extra });

const eyebrow = text("eyebrow", "Small title above", { max: 80 });
const heading = lines("heading", "Heading", {
  help: "One line per row — each row animates in on its own.",
  maxItems: 4,
  max: 120,
  required: true,
});
const description = area("description", "Intro text", { max: 600 });

const linkList = (key: string, label: string): Field => ({
  key,
  label,
  type: "list",
  itemLabel: "link",
  labelKey: "label",
  maxItems: 12,
  fields: [text("label", "Text", { required: true, max: 60 }), link("href", "Link", { required: true })],
});

/* ── Singletons: General settings, Header, Footer, Brand ────────────────── */

export interface ObjectDef {
  key: ObjectKey;
  title: string;
  description: string;
  groups: Group[];
}

export const OBJECTS: Record<ObjectKey, ObjectDef> = {
  settings: {
    key: "settings",
    title: "General settings",
    description: "Company details used across the site, search engine texts, and shared option lists.",
    groups: [
      {
        title: "Company",
        fields: [
          text("name", "Short name", { required: true, max: 60 }),
          text("legalName", "Legal name", { required: true, max: 120 }),
          { key: "email", label: "Contact email", type: "email", required: true, max: 200 },
          text("phone", "Phone", { max: 40, help: "Shown as typed; the call link is made from the digits." }),
          text("city", "City", { max: 60 }),
          text("region", "State / region", { max: 60 }),
          text("country", "Country", { max: 60 }),
          text("countryCode", "Country code", { max: 2, help: "Two letters, e.g. IN." }),
          text("registration", "Registration number", { max: 80, help: "Shown in the footer, e.g. the UDYAM number." }),
        ],
      },
      {
        title: "Search engines and sharing",
        fields: [
          { key: "domain", label: "Website address", type: "url", required: true, max: 200, help: "Used for canonical links and the sitemap, e.g. https://bondbyte.in" },
          text("titleSuffix", "Home page title line", { max: 80, help: 'Shown after the name on the home page title, e.g. "Digital Product Studio".' }),
          area("description", "Default description", { max: 300, full: true, required: true }),
          lines("keywords", "Keywords", { maxItems: 30, max: 80 }),
          image("shareImage", "Share image", { help: "Shown when a page is shared on social media. 1200 × 630 works best." }),
        ],
      },
      {
        title: "Industry packages",
        description: "Labels and the yearly discount used by the industry package picker.",
        fields: [
          { key: "yearlyDiscount", label: "Yearly discount (%)", type: "number", min: 0, max: 90, default: 20 },
          text("tierNormal", "First tier label", { max: 30, required: true }),
          text("tierExclusive", "Second tier label", { max: 30, required: true }),
          text("tierComplete", "Third tier label", { max: 30, required: true }),
        ],
      },
      {
        title: "Option lists",
        description: "Choices offered when editing projects, articles and technologies.",
        fields: [
          lines("disciplines", "Project disciplines", { maxItems: 20, max: 60, required: true }),
          lines("insightCategories", "Article categories", { maxItems: 20, max: 40, required: true }),
          lines("techCategories", "Technology categories", { maxItems: 20, max: 40, required: true }),
        ],
      },
    ],
  },
  header: {
    key: "header",
    title: "Header",
    description: "The menu at the top of every page. The logo sits in the middle, with links on either side.",
    groups: [
      { title: "Menu links", fields: [linkList("leftLinks", "Left of the logo"), linkList("rightLinks", "Right of the logo")] },
      {
        title: "Button",
        fields: [text("ctaLabel", "Button text", { max: 40, required: true }), link("ctaHref", "Button link", { required: true })],
      },
      {
        title: "Phone menu",
        description: "The full-screen menu on phones shows the links above, then these.",
        fields: [linkList("mobileExtraLinks", "Extra links"), text("mobileCtaLabel", "Button text", { max: 40 })],
      },
    ],
  },
  footer: {
    key: "footer",
    title: "Footer",
    description: "The bottom of every page.",
    groups: [
      { title: "About", fields: [area("blurb", "Short text", { max: 300, full: true, help: TOKENS_HELP }), text("wordmark", "Large background word", { max: 30 })] },
      { title: "Columns", fields: [text("navTitle", "Links column title", { max: 40 }), linkList("navLinks", "Links"), text("servicesTitle", "Services column title", { max: 40 }), { key: "servicesCount", label: "Services shown", type: "number", min: 0, max: 12, default: 6 }, text("contactTitle", "Contact column title", { max: 40 })] },
      {
        title: "Social profiles",
        fields: [
          {
            key: "socials",
            label: "Profiles",
            type: "list",
            itemLabel: "profile",
            labelKey: "label",
            maxItems: 10,
            fields: [text("label", "Name", { required: true, max: 40 }), { key: "url", label: "Address", type: "url", required: true, max: 300 }],
          },
        ],
      },
      { title: "Legal strip", fields: [check("showUdyamMark", "Show the UDYAM registration mark")] },
    ],
  },
  brand: {
    key: "brand",
    title: "Brand",
    description: "The logo in the header and the browser tab icon.",
    groups: [
      {
        fields: [
          image("logo", "Logo mark", { required: true }),
          text("wordFirst", "Name, first part", { max: 30, required: true }),
          text("wordSecond", "Name, second part (in blue)", { max: 30 }),
          image("favicon", "Browser tab icon", { help: "Leave empty to keep the built-in icon." }),
        ],
      },
    ],
  },
};

/* ── Collections: lists with their own screens ──────────────────────────── */

export interface CollectionDef {
  key: CollectionKey;
  title: string;
  singular: string;
  description: string;
  labelKey: string;
  /** Short details shown under each row in the list. */
  summaryKeys?: string[];
  groups: Group[];
  /** Fields that must be different for every item. */
  unique?: string[];
  /** Checkbox shown as a live/hidden switch in the list. */
  toggleKey?: string;
  nav: "work" | "company" | "pricing";
}

const packageFields = (): Field[] => [
  text("name", "Package name", { required: true, max: 80 }),
  area("description", "Description", { max: 400, full: true }),
  { key: "monthlyPrice", label: "Monthly price (₹)", type: "number", min: 0, max: 100000000 },
  text("timeline", "Timeline", { max: 60 }),
  text("bestFor", "Best for", { max: 120 }),
  lines("features", "Headline features", { maxItems: 12, max: 120, full: true }),
  {
    key: "details",
    label: "Full breakdown",
    type: "list",
    itemLabel: "group",
    labelKey: "title",
    maxItems: 10,
    full: true,
    fields: [text("title", "Group title", { required: true, max: 80 }), lines("items", "Items", { maxItems: 15, max: 120 })],
  },
];

export const COLLECTIONS: Record<CollectionKey, CollectionDef> = {
  projects: {
    key: "projects",
    title: "Projects",
    singular: "project",
    description: "Case studies shown on the work page and the home page. Each one gets its own page at /work/<address>.",
    labelKey: "title",
    summaryKeys: ["discipline", "slug"],
    unique: ["slug"],
    toggleKey: "published",
    nav: "work",
    groups: [
      {
        title: "Project",
        fields: [
          text("title", "Title", { required: true, max: 100 }),
          { key: "slug", label: "Page address", type: "slug", required: true, max: 80, help: "Shown as /work/<address>." },
          { key: "discipline", label: "Discipline", type: "select", optionsFrom: "disciplines", required: true, max: 60 },
          text("year", "Year", { max: 20 }),
          check("featured", "Featured (shown as a full case study and on the home page)"),
          check("published", "Live on the website", { default: true }),
        ],
      },
      {
        title: "Story",
        fields: [
          area("summary", "One-line summary", { required: true, max: 300, full: true }),
          area("description", "Overview", { max: 3000, full: true, help: "Leave empty to show the summary with a note that a full write-up is coming." }),
        ],
      },
      {
        title: "Details",
        fields: [
          lines("stack", "Stack", { maxItems: 12, max: 40 }),
          {
            key: "metrics",
            label: "Results",
            type: "list",
            itemLabel: "result",
            labelKey: "label",
            maxItems: 6,
            help: "Only add verified numbers.",
            fields: [text("value", "Number", { required: true, max: 30 }), text("label", "What it measures", { required: true, max: 80 })],
          },
          image("image", "Screenshot", { help: "Leave empty to show a designed placeholder." }),
          { key: "tone", label: "Accent colour", type: "select", options: TONES, required: true },
        ],
      },
    ],
  },
  insights: {
    key: "insights",
    title: "Insights",
    singular: "article",
    description: "Articles on the insights page. Each one gets its own page at /insights/<address>.",
    labelKey: "title",
    summaryKeys: ["category", "date"],
    unique: ["slug"],
    toggleKey: "published",
    nav: "work",
    groups: [
      {
        title: "Article",
        fields: [
          text("title", "Title", { required: true, max: 140, full: true }),
          { key: "slug", label: "Page address", type: "slug", required: true, max: 100, help: "Shown as /insights/<address>." },
          { key: "category", label: "Category", type: "select", optionsFrom: "insightCategories", required: true, max: 40 },
          { key: "date", label: "Date", type: "date", required: true },
          text("readTime", "Reading time", { max: 30, placeholder: "5 min read" }),
          text("author", "Author", { max: 80 }),
          area("excerpt", "Excerpt", { required: true, max: 400, full: true }),
          check("featured", "Featured article"),
          check("published", "Live on the website", { default: true }),
        ],
      },
      {
        title: "Text",
        description: "Wrap words in `backticks` to show them as code.",
        fields: [
          {
            key: "body",
            label: "Blocks",
            type: "list",
            itemLabel: "block",
            labelKey: "text",
            maxItems: 120,
            full: true,
            fields: [
              {
                key: "type",
                label: "Kind",
                type: "select",
                required: true,
                options: [
                  { value: "p", label: "Paragraph" },
                  { value: "h2", label: "Heading" },
                  { value: "quote", label: "Quote" },
                  { value: "list", label: "Bullet list" },
                ],
              },
              area("text", "Text", { max: 4000, full: true, when: (v) => v.type !== "list" }),
              lines("items", "Bullets", { maxItems: 30, max: 400, full: true, when: (v) => v.type === "list" }),
            ],
          },
        ],
      },
    ],
  },
  products: {
    key: "products",
    title: "Products",
    singular: "product",
    description: "Software the studio owns and runs, shown on the products page.",
    labelKey: "name",
    summaryKeys: ["status"],
    nav: "work",
    groups: [
      {
        fields: [
          text("name", "Name", { required: true, max: 80 }),
          text("status", "Status", { max: 30, placeholder: "Live" }),
          text("tagline", "Tagline", { max: 200, full: true }),
          area("problem", "The problem", { max: 1000, full: true }),
          area("solution", "What we built", { max: 1000, full: true }),
          lines("features", "Capabilities", { maxItems: 16, max: 120 }),
          lines("stack", "Stack", { maxItems: 12, max: 40 }),
          { key: "caseStudy", label: "Case study address", type: "slug", max: 80, help: "Address of a project to link to, e.g. kindify. Leave empty for no link." },
        ],
      },
    ],
  },
  testimonials: {
    key: "testimonials",
    title: "Testimonials",
    singular: "testimonial",
    description: "Client quotes. The first one is shown in the testimonial section. Only add real, attributable quotes.",
    labelKey: "author",
    summaryKeys: ["company"],
    nav: "work",
    groups: [
      {
        fields: [
          area("quote", "Quote", { required: true, max: 600, full: true }),
          text("author", "Name", { required: true, max: 80 }),
          text("role", "Role", { max: 80 }),
          text("company", "Company", { max: 80 }),
        ],
      },
    ],
  },
  clients: {
    key: "clients",
    title: "Clients",
    singular: "client",
    description: "Client names shown in the clients strip.",
    labelKey: "name",
    nav: "work",
    groups: [{ fields: [text("name", "Name", { required: true, max: 80 })] }],
  },
  services: {
    key: "services",
    title: "Services",
    singular: "service",
    description: "The service list on the home and services pages. Also listed in the footer.",
    labelKey: "title",
    nav: "company",
    groups: [
      {
        fields: [
          text("title", "Title", { required: true, max: 80 }),
          area("description", "Description", { max: 400, full: true }),
          lines("capabilities", "Capabilities", { maxItems: 10, max: 40 }),
        ],
      },
    ],
  },
  capabilities: {
    key: "capabilities",
    title: "What we build",
    singular: "category",
    description: "Product categories in the “What we build” list.",
    labelKey: "title",
    nav: "company",
    groups: [
      {
        fields: [
          text("title", "Title", { required: true, max: 80 }),
          area("description", "Description", { max: 300, full: true }),
          lines("examples", "Examples", { maxItems: 8, max: 40 }),
          { key: "tone", label: "Preview colour", type: "select", options: TONES, required: true },
        ],
      },
    ],
  },
  team: {
    key: "team",
    title: "Team",
    singular: "person",
    description: "People shown on the about page.",
    labelKey: "name",
    summaryKeys: ["role"],
    nav: "company",
    groups: [
      {
        fields: [
          text("name", "Name", { required: true, max: 80 }),
          text("role", "Role", { max: 80 }),
          image("image", "Photo", { required: true }),
          { key: "linkedin", label: "LinkedIn", type: "url", max: 300 },
        ],
      },
    ],
  },
  technologies: {
    key: "technologies",
    title: "Technology",
    singular: "technology",
    description: "The stack shown in the technology section. Known names get their own icon.",
    labelKey: "name",
    summaryKeys: ["category"],
    nav: "company",
    groups: [
      {
        fields: [
          text("name", "Name", { required: true, max: 40 }),
          { key: "category", label: "Category", type: "select", optionsFrom: "techCategories", required: true, max: 40 },
          {
            key: "weight",
            label: "Emphasis",
            type: "select",
            required: true,
            options: [
              { value: "1", label: "Low" },
              { value: "2", label: "Medium" },
              { value: "3", label: "High" },
            ],
          },
        ],
      },
    ],
  },
  processSteps: {
    key: "processSteps",
    title: "Process steps",
    singular: "step",
    description: "Stages in the process timeline.",
    labelKey: "title",
    nav: "company",
    groups: [{ fields: [text("title", "Title", { required: true, max: 80 }), area("description", "Description", { max: 500, full: true })] }],
  },
  principles: {
    key: "principles",
    title: "Principles",
    singular: "principle",
    description: "The principles in the “How we build” section.",
    labelKey: "title",
    nav: "company",
    groups: [{ fields: [text("title", "Title", { required: true, max: 80 }), area("description", "Description", { max: 500, full: true })] }],
  },
  pricingTiers: {
    key: "pricingTiers",
    title: "Pricing tiers",
    singular: "tier",
    description: "Cards in the pricing section.",
    labelKey: "name",
    summaryKeys: ["price"],
    nav: "pricing",
    groups: [
      {
        fields: [
          text("name", "Name", { required: true, max: 60 }),
          text("price", "Price", { required: true, max: 30, placeholder: "₹24,999" }),
          text("period", "Period", { max: 20, help: 'Shown after the price as "/project". Type "from" to show "From" above the price instead.' }),
          text("note", "Note under the price", { max: 80 }),
          area("description", "Description", { max: 300, full: true }),
          lines("features", "Features", { maxItems: 12, max: 120 }),
          text("cta", "Button text", { max: 40, required: true }),
          link("ctaHref", "Button link", { required: true }),
          check("featured", "Highlight this tier"),
        ],
      },
    ],
  },
  comparisonRows: {
    key: "comparisonRows",
    title: "Comparison rows",
    singular: "row",
    description: "Rows of the side-by-side comparison table. Column titles are set on the comparison section.",
    labelKey: "label",
    nav: "pricing",
    groups: [
      {
        fields: [
          text("label", "Row title", { required: true, max: 80 }),
          text("template", "Column 1", { max: 80 }),
          text("freelancer", "Column 2", { max: 80 }),
          text("inHouse", "Column 3", { max: 80 }),
          text("bondbyte", "Column 4 (highlighted)", { max: 80 }),
        ],
      },
    ],
  },
  industries: {
    key: "industries",
    title: "Industry packages",
    singular: "industry",
    description: "Industries in the package picker, each with three packages.",
    labelKey: "name",
    unique: ["slug"],
    nav: "pricing",
    groups: [
      {
        title: "Industry",
        fields: [
          text("name", "Name", { required: true, max: 60 }),
          { key: "slug", label: "Short id", type: "slug", required: true, max: 60 },
          area("description", "Description", { max: 400, full: true }),
        ],
      },
      { title: "First tier", fields: [{ key: "normal", label: "Package", type: "group", full: true, fields: packageFields() }] },
      { title: "Second tier", fields: [{ key: "exclusive", label: "Package", type: "group", full: true, fields: packageFields() }] },
      { title: "Third tier", fields: [{ key: "complete", label: "Package", type: "group", full: true, fields: packageFields() }] },
    ],
  },
};

/* ── Sections: the building blocks of pages ─────────────────────────────── */

export interface SectionDef {
  type: string;
  label: string;
  description: string;
  groups: Group[];
}

const headingGroup = (extra: Field[] = []): Group => ({ fields: [eyebrow, heading, ...extra] });

export const SECTION_TYPES: Record<string, SectionDef> = {
  hero: {
    type: "hero",
    label: "Hero banner",
    description: "Full-screen opening with two headline lines and two buttons.",
    groups: [
      {
        fields: [
          eyebrow,
          text("line1", "Headline, first line", { required: true, max: 80 }),
          text("line2", "Headline, second line (in blue)", { max: 80 }),
          area("text", "Supporting text", { max: 400, full: true }),
          text("primaryLabel", "Main button text", { max: 40 }),
          link("primaryHref", "Main button link"),
          text("secondaryLabel", "Second button text", { max: 40 }),
          link("secondaryHref", "Second button link"),
        ],
      },
    ],
  },
  pageHeader: {
    type: "pageHeader",
    label: "Page title",
    description: "The heading band at the top of an inner page.",
    groups: [
      headingGroup([
        description,
        {
          key: "style",
          label: "Style",
          type: "select",
          required: true,
          default: "dark",
          options: [
            { value: "dark", label: "Dark (standard)" },
            { value: "light", label: "Light" },
          ],
        },
      ]),
    ],
  },
  positioning: {
    type: "positioning",
    label: "Positioning statement",
    description: "Large statement with supporting paragraphs and two facts.",
    groups: [
      headingGroup([
        lines("paragraphs", "Paragraphs", { maxItems: 6, max: 800, full: true, help: "One paragraph per row." }),
        text("fact1Label", "First fact, label", { max: 40 }),
        text("fact1Value", "First fact, value", { max: 80 }),
        text("fact2Label", "Second fact, label", { max: 40 }),
        text("fact2Value", "Second fact, value", { max: 80 }),
      ]),
    ],
  },
  story: {
    type: "story",
    label: "Story",
    description: "Heading on the left, paragraphs on the right.",
    groups: [
      {
        fields: [
          heading,
          lines("paragraphs", "Paragraphs", { maxItems: 8, max: 1200, full: true, help: `One paragraph per row. ${TOKENS_HELP}` }),
        ],
      },
    ],
  },
  capabilities: {
    type: "capabilities",
    label: "What we build",
    description: "Interactive list of product categories (edit them under What we build).",
    groups: [headingGroup([link("linkHref", "Rows link to")])],
  },
  workShowcase: {
    type: "workShowcase",
    label: "Selected work",
    description: "Featured projects with a shared preview.",
    groups: [headingGroup([text("linkLabel", "Link text", { max: 40 })])],
  },
  caseStudies: {
    type: "caseStudies",
    label: "Case studies",
    description: "Featured projects as full case studies.",
    groups: [{ fields: [] }],
  },
  otherWork: {
    type: "otherWork",
    label: "More projects",
    description: "A compact list of the projects that are not featured.",
    groups: [{ fields: [eyebrow] }],
  },
  services: {
    type: "services",
    label: "Services",
    description: "Interactive service list (edit them under Services).",
    groups: [headingGroup([description])],
  },
  technology: {
    type: "technology",
    label: "Technology",
    description: "Technology grid with a category filter.",
    groups: [headingGroup([description])],
  },
  team: {
    type: "team",
    label: "Team",
    description: "Photos of the team (edit them under Team).",
    groups: [headingGroup()],
  },
  process: {
    type: "process",
    label: "Process timeline",
    description: "Stages that light up as the visitor scrolls.",
    groups: [headingGroup([description])],
  },
  howWeBuild: {
    type: "howWeBuild",
    label: "How we build",
    description: "The quality argument with the principles list.",
    groups: [
      headingGroup([
        area("lead", "Lead text", { max: 400, full: true }),
        area("text", "Text", { max: 800, full: true }),
        text("statement", "Closing statement", { max: 200, full: true }),
        text("statementMuted", "Closing statement, quieter part", { max: 200, full: true }),
      ]),
    ],
  },
  pricing: {
    type: "pricing",
    label: "Pricing",
    description: "Pricing tier cards.",
    groups: [headingGroup([description, text("badge", "Badge on the highlighted tier", { max: 30 }), text("footnote", "Note below", { max: 200, full: true })])],
  },
  industries: {
    type: "industries",
    label: "Industry packages",
    description: "Industry picker with packages and prices.",
    groups: [headingGroup([description])],
  },
  comparison: {
    type: "comparison",
    label: "Comparison table",
    description: "Side-by-side table (rows are edited under Comparison rows).",
    groups: [
      headingGroup([
        description,
        text("col1", "Column 1 title", { max: 40 }),
        text("col2", "Column 2 title", { max: 40 }),
        text("col3", "Column 3 title", { max: 40 }),
        text("col4", "Column 4 title (highlighted)", { max: 40 }),
        text("primaryLabel", "Main button text", { max: 40 }),
        link("primaryHref", "Main button link"),
        text("secondaryLabel", "Second button text", { max: 40 }),
        link("secondaryHref", "Second button link"),
      ]),
    ],
  },
  products: {
    type: "products",
    label: "Products",
    description: "Each product with its problem, solution and capabilities.",
    groups: [{ fields: [text("linkLabel", "Case study link text", { max: 40 })] }],
  },
  insightsList: {
    type: "insightsList",
    label: "All articles",
    description: "Every published article with a category filter.",
    groups: [{ fields: [] }],
  },
  insightsLatest: {
    type: "insightsLatest",
    label: "Latest articles",
    description: "The featured article and the most recent ones.",
    groups: [headingGroup([{ key: "limit", label: "Articles shown", type: "number", min: 2, max: 8, default: 4 }])],
  },
  testimonials: {
    type: "testimonials",
    label: "Testimonial",
    description: "The first testimonial as a large quote. Hidden while there are none.",
    groups: [{ fields: [eyebrow] }],
  },
  clients: {
    type: "clients",
    label: "Clients strip",
    description: "Client names in a row. Hidden while there are none.",
    groups: [{ fields: [text("text", "Text", { max: 120 })] }],
  },
  contact: {
    type: "contact",
    label: "Contact and form",
    description: "Contact details next to the enquiry form. Messages appear under Inquiries.",
    groups: [
      headingGroup([
        area("text", "Text", { max: 500, full: true }),
        text("studioNote", "Note under the city", { max: 120 }),
        lines("projectTypes", "Project types in the form", { maxItems: 12, max: 60, required: true }),
        lines("budgets", "Budget ranges in the form", { maxItems: 12, max: 40 }),
        text("successTitle", "Message after sending, title", { max: 80 }),
        area("successText", "Message after sending, text", { max: 300 }),
      ]),
    ],
  },
  cta: {
    type: "cta",
    label: "Call to action",
    description: "Dark closing band with a button.",
    groups: [
      {
        fields: [
          heading,
          area("text", "Text", { max: 300, full: true }),
          text("buttonLabel", "Button text", { max: 40 }),
          link("buttonHref", "Button link"),
          check("showEmail", "Show the contact email next to the button", { default: true }),
        ],
      },
    ],
  },
  textBlocks: {
    type: "textBlocks",
    label: "Text blocks",
    description: "Titled blocks of text, e.g. for legal pages.",
    groups: [
      {
        fields: [
          {
            key: "blocks",
            label: "Blocks",
            type: "list",
            itemLabel: "block",
            labelKey: "title",
            maxItems: 40,
            full: true,
            fields: [
              text("title", "Title", { required: true, max: 120 }),
              area("body", "Text", { max: 4000, full: true, help: `Leave an empty line between paragraphs. ${TOKENS_HELP}` }),
            ],
          },
        ],
      },
    ],
  },
};

export const sectionLabel = (type: string) => SECTION_TYPES[type]?.label ?? type;

/* ── Pages ───────────────────────────────────────────────────────────────── */

export const PAGE_FIELDS: Field[] = [
  text("title", "Page name", { required: true, max: 80, help: "Used in the admin panel and as the browser tab title." }),
  { key: "slug", label: "Address", type: "slug", max: 60 },
  check("published", "Published"),
  text("seoTitle", "Title for search engines", { max: 90, help: "Leave empty to use the page name." }),
  area("seoDescription", "Description for search engines", { max: 300, full: true, help: TOKENS_HELP }),
];

export const HOME_PAGE_ID = "home";

/** Pages whose address other parts of the site depend on. */
export const LOCKED_SLUGS: Record<string, string> = { home: "", work: "work", insights: "insights" };

/** Addresses used by the system: never available to a page. */
export const RESERVED_SLUGS = new Set(["admin", "api", "uploads", "images", "_next", "sitemap.xml", "robots.txt", "favicon.ico"]);

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/* ── Helpers ─────────────────────────────────────────────────────────────── */

export const fieldsOf = (groups: Group[]): Field[] => groups.flatMap((group) => group.fields);

export function makeId(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export const optionValue = (option: Option) => (typeof option === "string" ? option : option.value);
export const optionLabel = (option: Option) => (typeof option === "string" ? option : option.label);

export function defaultValue(field: Field): unknown {
  if (field.default !== undefined) return structuredClone(field.default);
  switch (field.type) {
    case "checkbox":
      return false;
    case "number":
      return field.min ?? 0;
    case "lines":
    case "list":
      return [];
    case "group":
      return defaultsFor(field.fields ?? []);
    case "select":
      return field.required && field.options?.length ? optionValue(field.options[0]) : "";
    default:
      return "";
  }
}

export function defaultsFor(fields: Field[]): Values {
  return Object.fromEntries(fields.map((field) => [field.key, defaultValue(field)]));
}

/* ── Validation ──────────────────────────────────────────────────────────── */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const URL_PATTERN = /^https?:\/\/[^\s]+$/i;
const LINK_PATTERN = /^(\/[^\s]*|#[\w-]*|https?:\/\/[^\s]+|mailto:[^\s]+|tel:[+\d\s()-]+)$/i;
const IMAGE_PATTERN = /^(\/[\w\-./%]+|https:\/\/[^\s]+)$/i;

const oneLine = (value: unknown) => String(value ?? "").replace(/\s+/g, " ").trim();
const multiLine = (value: unknown) =>
  String(value ?? "")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

export interface ValidationResult {
  ok: boolean;
  value: Values;
  errors: Record<string, string>;
}

class FieldError extends Error {}

function cleanValue(field: Field, raw: unknown): unknown {
  const required = (empty: boolean) => {
    if (empty && field.required) throw new FieldError(`${field.label} is required.`);
  };
  const tooLong = (value: string) => {
    if (field.max && value.length > field.max) throw new FieldError(`${field.label} can be at most ${field.max} characters.`);
  };

  switch (field.type) {
    case "checkbox":
      return raw === true || raw === "true";

    case "number": {
      if (raw === "" || raw === null || raw === undefined) {
        required(true);
        return field.min ?? 0;
      }
      const value = Number(raw);
      if (!Number.isFinite(value)) throw new FieldError(`${field.label} must be a number.`);
      if (field.min !== undefined && value < field.min) throw new FieldError(`${field.label} must be at least ${field.min}.`);
      if (field.max !== undefined && value > field.max) throw new FieldError(`${field.label} can be at most ${field.max}.`);
      return value;
    }

    case "lines": {
      const items = (Array.isArray(raw) ? raw : []).map((item) => multiLine(item).replace(/\n+/g, " ")).filter(Boolean);
      required(items.length === 0);
      if (field.maxItems && items.length > field.maxItems) throw new FieldError(`${field.label} can have at most ${field.maxItems} rows.`);
      for (const item of items) {
        if (field.max && item.length > field.max) throw new FieldError(`Each row of ${field.label} can be at most ${field.max} characters.`);
      }
      return items;
    }

    case "list": {
      const items = Array.isArray(raw) ? raw : [];
      required(items.length === 0);
      if (field.maxItems && items.length > field.maxItems) throw new FieldError(`${field.label} can have at most ${field.maxItems} items.`);
      const seen = new Set<string>();
      return items.map((item, index) => {
        const source = item && typeof item === "object" ? (item as Values) : {};
        const result = validateFields(field.fields ?? [], source);
        if (!result.ok) {
          const [first] = Object.values(result.errors);
          throw new FieldError(`${field.label}, ${field.itemLabel ?? "item"} ${index + 1}: ${first}`);
        }
        let id = typeof source.id === "string" && /^[\w-]{1,40}$/.test(source.id) ? source.id : makeId();
        if (seen.has(id)) id = makeId();
        seen.add(id);
        return { id, ...result.value };
      });
    }

    case "group": {
      const source = raw && typeof raw === "object" ? (raw as Values) : {};
      const result = validateFields(field.fields ?? [], source);
      if (!result.ok) {
        const [first] = Object.values(result.errors);
        throw new FieldError(`${field.label}: ${first}`);
      }
      return result.value;
    }

    case "textarea": {
      const value = multiLine(raw);
      required(!value);
      tooLong(value);
      return value;
    }

    case "select": {
      const value = oneLine(raw);
      required(!value);
      if (value && field.options && !field.options.some((option) => optionValue(option) === value)) {
        throw new FieldError(`Choose one of the options for ${field.label}.`);
      }
      tooLong(value);
      return value;
    }

    default: {
      const value = oneLine(raw);
      required(!value);
      tooLong(value);
      if (!value) return value;
      if (field.type === "email" && !EMAIL.test(value)) throw new FieldError(`${field.label} must be an email address.`);
      if (field.type === "url" && !URL_PATTERN.test(value)) throw new FieldError(`${field.label} must start with https:// or http://.`);
      if (field.type === "link" && !LINK_PATTERN.test(value)) {
        throw new FieldError(`${field.label} must be a page address (/contact), a # link, a full web address, mailto: or tel:.`);
      }
      if (field.type === "image" && !IMAGE_PATTERN.test(value)) throw new FieldError(`${field.label} must be a file from the media library or an https:// address.`);
      if (field.type === "slug" && !SLUG_PATTERN.test(value)) {
        throw new FieldError(`${field.label} can only use lowercase letters, numbers and single dashes.`);
      }
      if (field.type === "date" && (!DATE.test(value) || Number.isNaN(Date.parse(value)))) throw new FieldError(`${field.label} must be a date.`);
      return value;
    }
  }
}

/** Checks and cleans values against fields. Unknown keys are dropped. */
export function validateFields(fields: Field[], input: Values): ValidationResult {
  const value: Values = {};
  const errors: Record<string, string> = {};
  for (const field of fields) {
    // A hidden field keeps its value but is not checked, so switching kinds back and forth loses nothing.
    if (field.when && !field.when({ ...input })) {
      value[field.key] = input[field.key] ?? defaultValue(field);
      continue;
    }
    try {
      value[field.key] = cleanValue(field, input[field.key]);
    } catch (err) {
      if (!(err instanceof FieldError)) throw err;
      errors[field.key] = err.message;
    }
  }
  return { ok: Object.keys(errors).length === 0, value, errors };
}

export interface ItemsResult {
  ok: boolean;
  value: Values[];
  error?: string;
}

/** Validates every item of a collection, including unique fields. */
export function validateCollection(key: CollectionKey, items: unknown): ItemsResult {
  const def = COLLECTIONS[key];
  if (!Array.isArray(items)) return { ok: false, value: [], error: "The list is missing." };
  if (items.length > 500) return { ok: false, value: [], error: "The list is too long." };
  const fields = fieldsOf(def.groups);
  const value: Values[] = [];
  const ids = new Set<string>();
  for (const [index, raw] of items.entries()) {
    const source = raw && typeof raw === "object" ? (raw as Values) : {};
    const result = validateFields(fields, source);
    const name = String(source[def.labelKey] ?? "").trim() || `${def.singular} ${index + 1}`;
    if (!result.ok) return { ok: false, value: [], error: `"${name}": ${Object.values(result.errors)[0]}` };
    let id = typeof source.id === "string" && /^[\w-]{1,40}$/.test(source.id) ? source.id : makeId();
    if (ids.has(id)) id = makeId();
    ids.add(id);
    value.push({ id, ...result.value });
  }
  for (const uniqueKey of def.unique ?? []) {
    const seen = new Map<string, string>();
    for (const item of value) {
      const fieldValue = String(item[uniqueKey] ?? "");
      if (!fieldValue) continue;
      const other = seen.get(fieldValue);
      if (other) {
        const label = fields.find((field) => field.key === uniqueKey)?.label ?? uniqueKey;
        return { ok: false, value: [], error: `"${item[def.labelKey]}" and "${other}" have the same ${label.toLowerCase()}. Each one needs its own.` };
      }
      seen.set(fieldValue, String(item[def.labelKey]));
    }
  }
  return { ok: true, value };
}

export function validateObject(key: ObjectKey, input: unknown): ValidationResult & { error?: string } {
  const source = input && typeof input === "object" ? (input as Values) : {};
  const result = validateFields(fieldsOf(OBJECTS[key].groups), source);
  return result.ok ? result : { ...result, error: Object.values(result.errors)[0] };
}

export function validateSection(type: string, input: unknown): ValidationResult & { error?: string } {
  const def = SECTION_TYPES[type];
  if (!def) return { ok: false, value: {}, errors: {}, error: "Unknown section kind." };
  const source = input && typeof input === "object" ? (input as Values) : {};
  const result = validateFields(fieldsOf(def.groups), source);
  return result.ok ? result : { ...result, error: Object.values(result.errors)[0] };
}

/** The address problem of a page, or null when the address is fine. */
export function pageSlugError(slug: string, id: string, pages: { id: string; slug: string; title?: string }[]): string | null {
  if (id in LOCKED_SLUGS) return slug === LOCKED_SLUGS[id] ? null : "The address of this page cannot be changed.";
  if (!slug) return "Enter an address for this page.";
  if (!SLUG_PATTERN.test(slug)) return "The address can only use lowercase letters, numbers and single dashes.";
  if (RESERVED_SLUGS.has(slug)) return `/${slug} is used by the system. Choose another address.`;
  const other = pages.find((page) => page.id !== id && page.slug === slug);
  if (other) return `/${slug} is already used by the page "${other.title ?? other.slug}".`;
  return null;
}

export interface PageInput {
  title: string;
  slug: string;
  published: boolean;
  seoTitle: string;
  seoDescription: string;
  sections: { id: string; type: string; visible: boolean; data: Values }[];
}

/** Validates a whole page: its details and every section. */
export function validatePage(input: unknown, id: string, pages: { id: string; slug: string; title?: string }[]): { ok: boolean; value?: PageInput; error?: string } {
  const source = input && typeof input === "object" ? (input as Values) : {};
  const details = validateFields(PAGE_FIELDS, source);
  if (!details.ok) return { ok: false, error: Object.values(details.errors)[0] };
  const slug = id in LOCKED_SLUGS ? LOCKED_SLUGS[id] : String(details.value.slug ?? "");
  const slugError = pageSlugError(slug, id, pages);
  if (slugError) return { ok: false, error: slugError };

  const rawSections = Array.isArray(source.sections) ? source.sections : [];
  if (rawSections.length > 40) return { ok: false, error: "A page can have at most 40 sections." };
  const ids = new Set<string>();
  const sections: PageInput["sections"] = [];
  for (const [index, raw] of rawSections.entries()) {
    const section = raw && typeof raw === "object" ? (raw as Values) : {};
    const type = String(section.type ?? "");
    const result = validateSection(type, section.data);
    if (!result.ok) return { ok: false, error: `Section ${index + 1} (${sectionLabel(type)}): ${result.error}` };
    let sectionId = typeof section.id === "string" && /^[\w-]{1,40}$/.test(section.id) ? section.id : makeId();
    if (ids.has(sectionId)) sectionId = makeId();
    ids.add(sectionId);
    sections.push({ id: sectionId, type, visible: section.visible !== false, data: result.value });
  }

  return {
    ok: true,
    value: {
      title: String(details.value.title),
      slug,
      // The home page is always published.
      published: id === HOME_PAGE_ID ? true : Boolean(details.value.published),
      seoTitle: String(details.value.seoTitle ?? ""),
      seoDescription: String(details.value.seoDescription ?? ""),
      sections,
    },
  };
}

/** Readable name of a collection item, for lists and messages. */
export function itemLabel(def: CollectionDef, item: Values): string {
  return String(item[def.labelKey] ?? "").trim() || `Untitled ${def.singular}`;
}
