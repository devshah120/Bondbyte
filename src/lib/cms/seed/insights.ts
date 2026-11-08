/**
 * Insights / blog entries.
 *
 * These are BondByte's own editorial pieces — genuine engineering opinions
 * drawn from the way the studio actually works. They are marked `published`
 * so an unfinished draft can sit here without appearing on the site.
 *
 * `slug` maps to /insights/[slug].
 */

export type InsightCategory =
  | "Engineering"
  | "Product"
  | "Design"
  | "AI"
  | "Technology"
  | "Business";

export interface Insight {
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly category: InsightCategory;
  /** ISO date — rendered with a fixed locale so SSR and client agree. */
  readonly date: string;
  readonly readTime: string;
  readonly author: string;
  readonly featured: boolean;
  readonly published: boolean;
  /**
   * Article body as typed blocks, so a piece can carry section headings and
   * pull quotes rather than being one flat run of paragraphs.
   *
   * Inline `backticks` inside paragraph text render as code.
   */
  readonly body: readonly InsightBlock[];
}

export type InsightBlock =
  | { readonly type: "p"; readonly text: string }
  | { readonly type: "h2"; readonly text: string }
  | { readonly type: "quote"; readonly text: string }
  | { readonly type: "list"; readonly items: readonly string[] };

export const INSIGHT_CATEGORIES: readonly InsightCategory[] = [
  "Engineering",
  "Product",
  "Design",
  "AI",
  "Technology",
  "Business",
];

export const INSIGHTS: readonly Insight[] = [
  {
    slug: "why-we-scope-before-we-quote",
    title: "Why we scope before we quote",
    excerpt:
      "A number given before the problem is understood is a guess wearing a suit. Here is what we do instead, and why it makes projects cheaper rather than slower.",
    category: "Business",
    date: "2026-07-28",
    readTime: "6 min read",
    author: "Devarsh Shah",
    featured: true,
    published: true,
    body: [
      { type: "p", text: "Most software projects do not fail during the build. They fail at the point where someone agreed a price for work nobody had defined yet. The estimate becomes a commitment, the commitment meets reality, and everything after that is a negotiation about who absorbs the difference." },
      { type: "h2", text: "What discovery actually produces" },
      { type: "p", text: "We run a short discovery before quoting anything substantial. It is a fixed, paid engagement with a defined output: a scoped build plan, an architecture outline, and a costed roadmap. It usually takes one to two weeks." },
      { type: "p", text: "Clients sometimes read this as a delay. In practice it is the opposite. The alternative is not a faster start — it is a start in the wrong direction, discovered in week six, paid for by someone. Discovery is the cheapest week of the project because it is the week where changing your mind costs nothing." },
      { type: "h2", text: "Why it makes projects cheaper" },
      { type: "p", text: "It also changes the conversation. Once the plan exists, the discussion moves from 'how much for a website' to 'which of these things do we actually need first'. That is a much better question, and it is one you can only ask when the options are written down." },
      { type: "p", text: "If the discovery says the project should not happen, that is a good outcome too. We would rather tell you that in week one than bill you for four months of building something that was never going to work." },
    ],
  },
  {
    slug: "the-cost-of-a-cheap-website",
    title: "The real cost of a cheap website",
    excerpt:
      "Template builds are not cheaper. They move the cost from the invoice to everything that comes after — and that bill arrives with interest.",
    category: "Business",
    date: "2026-07-14",
    readTime: "5 min read",
    author: "Devarsh Shah",
    featured: false,
    published: true,
    body: [
      { type: "p", text: "A template site quoted at a fraction of a custom build looks like an obvious saving. The saving is real on day one. The question is what happens on day two hundred." },
      { type: "h2", text: "Where the cost reappears" },
      { type: "p", text: "Three costs tend to surface. The first is the plugin tax: every feature the template does not have becomes a third-party dependency, each with its own subscription, update cycle and failure mode. The second is the performance cost, because a page assembled from a dozen plugins loads like a page assembled from a dozen plugins. The third, and the expensive one, is that you do not own the thing you paid for." },
      { type: "h2", text: "When a template is the right call" },
      { type: "p", text: "None of this makes templates wrong. For a brochure site that will not change much, a template is a sensible, honest choice, and we will tell you so." },
      { type: "p", text: "It becomes wrong when the site is load-bearing — when it takes payments, holds customer data, or is the primary way people reach the business. At that point the constraint stops being cosmetic and starts being structural, and structural constraints are the ones you cannot design around later." },
      { type: "h2", text: "The question worth asking" },
      { type: "p", text: "The useful test is not 'what does this cost'. It is 'what does it cost to change this in a year'. Ask that early and the answer usually picks the approach for you." },
    ],
  },
  {
    slug: "typed-from-the-database-up",
    title: "Typed from the database up",
    excerpt:
      "Most runtime errors in a web product are shape errors — data arriving in a form the code did not expect. Types are the cheapest place to catch them.",
    category: "Engineering",
    date: "2026-06-30",
    readTime: "7 min read",
    author: "Ishan Trivedi",
    featured: false,
    published: true,
    body: [
      { type: "p", text: "A surprising share of production bugs reduce to the same thing: something was null when the code assumed it was not, or a field arrived as a string when the code expected a number. These are not logic errors. They are shape errors, and shape errors are exactly what a type system exists to prevent." },
      { type: "h2", text: "Pushing types to the source" },
      { type: "p", text: "We run TypeScript in `strict` mode on every project, and we push the types as close to the data source as we can. The database schema informs the API types, the API types inform the client, and validation at the boundary — we use `zod` — guarantees that anything crossing into the system matches the shape the types promise." },
      { type: "p", text: "The pay-off is not fewer bugs in an abstract sense. It is that a whole class of bug stops being possible, and the compiler tells you at the moment you write the mistake rather than the moment a user finds it." },
      { type: "h2", text: "The discipline cost" },
      { type: "p", text: "There is a discipline cost. `strict` mode is genuinely more annoying in the first week of a project. It is dramatically less annoying in the sixth month, when someone changes a field name and the compiler lists every place that needs updating instead of leaving you to find them in production." },
      { type: "p", text: "The rule we hold to is simple: if a value can be absent, the type says so — `string | null`, never a quiet `as string`. No casting it away because the deadline is close. That cast is a bug with a scheduled delivery date." },
    ],
  },
  {
    slug: "animation-that-earns-its-place",
    title: "Animation that earns its place",
    excerpt:
      "Motion should explain something — where a thing came from, what just changed, what is now interactive. If it does not, it is decoration with a frame cost.",
    category: "Design",
    date: "2026-06-16",
    readTime: "5 min read",
    author: "Shailesh Prajapati",
    featured: false,
    published: true,
    body: [
      { type: "p", text: "The fastest way to make a site feel cheap is to animate everything. The second fastest is to animate nothing. The difference between premium motion and noise is not quantity — it is whether each movement carries information." },
      { type: "h2", text: "What useful motion does" },
      { type: "p", text: "Useful motion answers a question the user would otherwise have to work out. Where did this panel come from? What changed after I clicked? Which of these things is interactive? A reveal that stages content in reading order is doing hierarchy work. A bounce on a logo is not doing anything." },
      { type: "h2", text: "The two rules we hold" },
      { type: "p", text: "We hold two rules. First, motion follows the content's logic: things enter from where they conceptually live, and related elements move together. Second, duration scales with distance — a small state change is fast, a full section transition can afford to breathe." },
      { type: "p", text: "The constraint that improves the work most is honouring `prefers-reduced-motion` properly. Not disabling everything, but replacing movement with a plain state change. If a design collapses when motion is removed, the motion was carrying weight that the layout should have carried." },
      { type: "h2", text: "Why reduced motion improves the work" },
      { type: "p", text: "Good motion is mostly invisible. People do not notice the transitions on a well-built product. They notice that it feels considered, and they cannot say why." },
    ],
  },
  {
    slug: "where-ai-actually-helps",
    title: "Where AI actually helps in a product",
    excerpt:
      "The useful applications are rarely the demo-friendly ones. They are the boring internal workflows where a human is currently retyping data between systems.",
    category: "AI",
    date: "2026-05-29",
    readTime: "6 min read",
    author: "Dev Shah",
    featured: false,
    published: true,
    body: [
      { type: "p", text: "Most requests we get for AI features describe a chat interface. Most problems those clients actually have would be better solved by something with no chat interface at all." },
      { type: "h2", text: "The pattern that pays for itself" },
      { type: "p", text: "The pattern that reliably pays for itself is unglamorous: somewhere in the business, a person is moving information between two systems by hand. Reading an invoice and typing it into an accounting tool. Categorising support tickets. Extracting fields from a document. These are narrow, high-volume, tolerant of a review step — and that combination is where current models are genuinely strong." },
      { type: "p", text: "The pattern that reliably disappoints is the open-ended assistant bolted onto a product, where the model must be right about anything a user might ask, and there is no cheap way to verify that it was." },
      { type: "h2", text: "The question that decides it" },
      { type: "p", text: "The engineering question is always the same: what happens when it is wrong? If a wrong answer costs a click to correct, automate aggressively. If a wrong answer silently corrupts financial data, you need a human in the loop regardless of how good the benchmark looked." },
      { type: "p", text: "We would rather ship a narrow feature that quietly removes an hour of manual work every day than a broad one that impresses in a demo and gets switched off in a month." },
    ],
  },
  {
    slug: "shipping-in-48-hours",
    title: "What we can genuinely ship in 48 hours",
    excerpt:
      "Fast delivery is a scoping discipline, not a heroics problem. Here is exactly what fits in two days and what does not.",
    category: "Product",
    date: "2026-05-12",
    readTime: "4 min read",
    author: "Devarsh Shah",
    featured: false,
    published: true,
    body: [
      { type: "p", text: "We tell clients we can have something live within 48 hours. That claim is only honest if we are equally clear about what it covers." },
      { type: "h2", text: "What fits, and what does not" },
      { type: "p", text: "What fits: a landing page or single-purpose marketing site with custom design, real copy, responsive layout, analytics and a working contact path. Deployed, on your domain, ready to send traffic to." },
      { type: "p", text: "What does not fit: authentication, payments, a database with meaningful relationships, an admin panel, or anything requiring integration with a system we have not seen. Those are weeks, and anyone promising them in two days is either misunderstanding the request or planning to hand you something that will need rebuilding." },
      { type: "h2", text: "Why it works" },
      { type: "p", text: "The reason the fast version works is preparation, not speed. We keep a hardened Next.js foundation with the design system, deployment pipeline, form handling and performance budget already solved. Starting a landing page means starting at the design, not at the tooling." },
      { type: "p", text: "The rule we apply: the 48-hour version is a real, finished thing at a small scope — never a large thing delivered badly. When a request does not fit, we say so and quote the version that does." },
    ],
  },
];

/** Published entries, newest first. */
export const PUBLISHED_INSIGHTS: readonly Insight[] = [...INSIGHTS]
  .filter((insight) => insight.published)
  .sort((a, b) => b.date.localeCompare(a.date));

export const FEATURED_INSIGHT: Insight | undefined =
  PUBLISHED_INSIGHTS.find((insight) => insight.featured) ?? PUBLISHED_INSIGHTS[0];

/** Fixed locale keeps server and client output identical. */
export function formatInsightDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
