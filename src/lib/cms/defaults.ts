/**
 * Starting content for a fresh install.
 *
 * Built from the original hand-written data in ./seed, so the first run of
 * the CMS renders the site exactly as it was before the admin panel existed.
 * After that, data/content.json is the source of truth and these values are
 * only used to fill in fields added in later versions.
 */

import { SITE, SOCIALS, NAV_LEFT, NAV_RIGHT } from "./seed/site";
import { TEAM, SERVICES, PROCESS_STEPS, PRINCIPLES, TESTIMONIALS } from "./seed/company";
import { CAPABILITIES } from "./seed/capabilities";
import { TECHNOLOGIES, TECH_CATEGORIES } from "./seed/technology";
import { PROJECTS, PRODUCTS, CLIENTS } from "./seed/work";
import { PRICING_TIERS, COMPARISON_ROWS, COMPARISON_COLUMNS } from "./seed/pricing";
import { INSIGHTS, INSIGHT_CATEGORIES } from "./seed/insights";
import { INDUSTRIES, TIER_LABELS, YEARLY_DISCOUNT } from "./seed/industries";
import { SCHEMA_VERSION, makeId } from "./schema";
import type { Page, Section, SiteContent } from "./types";

const section = (type: string, data: Record<string, unknown> = {}): Section => ({ id: makeId(), type, visible: true, data });
const link = (label: string, href: string) => ({ id: makeId(), label, href });

const cta = section("cta", {
  heading: ["Have a product", "worth building?"],
  text: "Tell us what you're building. We'll help turn the idea into something real.",
  buttonLabel: "Start a Conversation",
  buttonHref: "/contact",
  showEmail: true,
});
// Every page ends with the same call to action, each with its own id.
const closing = () => ({ ...structuredClone(cta), id: makeId() });

const pageHeader = (eyebrow: string, heading: string[], description: string, style = "light") =>
  section("pageHeader", { eyebrow, heading, description, style });

function page(id: string, title: string, slug: string, seoDescription: string, sections: Section[], seoTitle = ""): Page {
  return { id, title, slug, published: true, seoTitle, seoDescription, sections };
}

function defaultPages(): Page[] {
  return [
    page(
      "home",
      "Home",
      "",
      "{company} partners with ambitious companies to design, engineer and scale high-performance digital products.",
      [
        section("hero", {
          eyebrow: "Digital product studio",
          line1: "Your idea. Our code.",
          line2: "Live within 48 hours.",
          text: "We design, build and ship production software — landing pages and stores in 48 hours, full products in weeks. Strategy, design and engineering under one roof.",
          primaryLabel: "Start a Project",
          primaryHref: "/contact",
          secondaryLabel: "Explore Our Work",
          secondaryHref: "/work",
        }),
        section("positioning", {
          eyebrow: "What we believe",
          heading: ["Technology should", "create leverage,", "not complexity."],
          paragraphs: [
            "BondByte combines strategy, design and engineering to turn ambitious ideas into reliable digital products.",
            "We work as one team across the whole build — the same people who shape the idea are the ones who ship it. That keeps decisions fast and the result coherent.",
          ],
          fact1Label: "Based in",
          fact1Value: "{city}, {region}",
          fact2Label: "Working with",
          fact2Value: "Teams anywhere",
        }),
        section("capabilities", { eyebrow: "What we build", heading: ["Digital products engineered", "for real-world impact."], linkHref: "/services" }),
        section("workShowcase", { eyebrow: "Selected work", heading: ["Products we've", "put into the world."], linkLabel: "All work" }),
        section("services", {
          eyebrow: "Services",
          heading: ["What we do,", "end to end."],
          description: "Eight disciplines that cover the full life of a product — from the first conversation to the release after launch.",
        }),
        section("technology", {
          eyebrow: "Technology",
          heading: ["We build with technology", "that gets out of the way."],
          description: "Tools chosen for the problem, not the trend. This is the stack we actually ship with.",
        }),
        section("testimonials", { eyebrow: "Client" }),
        closing(),
      ],
    ),
    page(
      "about",
      "About",
      "about",
      "BondByte is a digital product studio in Ahmedabad combining strategy, design and engineering to build software that holds up in the real world.",
      [
        pageHeader("About", ["A studio built", "around the product."], "BondByte combines strategy, design and engineering to turn ambitious ideas into reliable digital products."),
        section("story", {
          heading: ["Small team.", "Whole product."],
          paragraphs: [
            "We are a compact team of {teamCount} specialists in {city} covering product management, full-stack engineering, mobile development and design. That size is the point: the people who scope your project are the people who build it.",
            "Our work runs from client products to software we own and operate ourselves — including Kindify, a platform that lets NGOs register and receive donations with payment routing built in. Running our own product keeps us honest about what it takes to maintain one.",
            "We work with founders and teams who need the whole path covered: shaping the idea, designing the interface, engineering the system and staying involved once it is live.",
          ],
        }),
        section("team", { eyebrow: "Team", heading: ["The people", "who build it."] }),
        section("process", {
          eyebrow: "Process",
          heading: ["From first conversation", "to production."],
          description: "Four stages, one team. You see working software throughout, not a reveal at the end.",
        }),
        closing(),
      ],
    ),
    page(
      "services",
      "Services",
      "services",
      "Product strategy, UI/UX design, web and mobile development, backend engineering, cloud and DevOps — the full path from idea to production.",
      [
        pageHeader("Services", ["Strategy, design", "and engineering", "under one roof."], "We cover the whole build. No handoffs between agencies, no gaps where the work falls through."),
        section("services", {
          eyebrow: "Services",
          heading: ["What we do,", "end to end."],
          description: "Eight disciplines that cover the full life of a product — from the first conversation to the release after launch.",
        }),
        section("capabilities", { eyebrow: "What we build", heading: ["Digital products engineered", "for real-world impact."], linkHref: "/services" }),
        closing(),
      ],
    ),
    page(
      "work",
      "Work",
      "work",
      "Selected work from BondByte — mobile applications, web products, interface design and brand identity, including Kindify, Padhaku and Furmart, plus industry-specific solutions and packages.",
      [
        pageHeader("Work", ["Products, interfaces", "and identities."], "A selection of what we have designed and engineered — for clients, and for ourselves."),
        section("caseStudies"),
        section("otherWork", { eyebrow: "Also from the studio" }),
        industriesSection(),
        closing(),
      ],
    ),
    page(
      "products",
      "Products",
      "products",
      "Software BondByte builds and operates itself — including Kindify, a platform where NGOs register and receive donations with payment routing built in.",
      [
        pageHeader("Products", ["Software we own,", "not just ship."], "Client work is one half of the studio. These are the products we build, run and maintain ourselves."),
        section("products", { linkLabel: "View the case study" }),
        closing(),
      ],
    ),
    page(
      "pricing",
      "Pricing",
      "pricing",
      "Fixed-scope pricing for landing pages, websites and product builds, plus dedicated teams for ongoing work. Clear scope, clear price.",
      [
        pageHeader("Pricing", ["What it costs", "to build it right."], "Most work is fixed-scope and fixed-price, agreed before anything starts. No hourly surprises."),
        section("howWeBuild", {
          eyebrow: "Why we cost what we cost",
          heading: ["The difference", "is how we build."],
          lead: "Anyone can quote a lower number. The question is what arrives, and what it costs you to live with it afterwards.",
          text: "We are not the cheapest way to get software made, and we do not try to be. What we offer is work that is scoped honestly, engineered to be changed, and owned by you outright — so the second year costs less than the first rather than more.",
          statement: "Cheap software is only cheap until you need to change it.",
          statementMuted: "We build the version that survives its own success.",
        }),
        section("pricing", {
          eyebrow: "Pricing",
          heading: ["Clear scope.", "Clear price."],
          description: "Fixed-price engagements for defined work, and a monthly team when the roadmap keeps going.",
          badge: "Most chosen",
          footnote: "Every engagement starts with a call. No obligation, no sales script.",
        }),
        industriesSection(),
        section("comparison", {
          eyebrow: "Side by side",
          heading: ["Four ways to build it.", "Only one is ours."],
          description: "How the common options actually differ once the work starts.",
          col1: COMPARISON_COLUMNS[0],
          col2: COMPARISON_COLUMNS[1],
          col3: COMPARISON_COLUMNS[2],
          col4: COMPARISON_COLUMNS[3],
          primaryLabel: "Start a Project",
          primaryHref: "/contact",
          secondaryLabel: "See our work",
          secondaryHref: "/work",
        }),
        closing(),
      ],
    ),
    page(
      "insights",
      "Insights",
      "insights",
      "Engineering and product writing from the BondByte team — how we scope, build and ship software that holds up in production.",
      [
        pageHeader(
          "Insights",
          ["Notes from", "the build."],
          "What we have learned designing, engineering and shipping products — scoping, architecture, interface work and the parts that only show up once something is live. Honest, occasionally opinionated.",
          "dark",
        ),
        section("insightsList"),
        closing(),
      ],
    ),
    page(
      "contact",
      "Contact",
      "contact",
      "Tell us what you're building. BondByte designs and engineers digital products from Ahmedabad, working with teams anywhere.",
      [
        section("contact", {
          eyebrow: "Contact",
          heading: ["Tell us what", "you're building."],
          text: "Whether it is a rough idea or a product already in flight, send us the details. We read every message and reply personally.",
          studioNote: "Working with teams across time zones.",
          projectTypes: ["Web application", "Mobile application", "Website", "UI/UX design", "Brand & identity", "Something else"],
          budgets: ["Under ₹1L", "₹1L – ₹5L", "₹5L – ₹15L", "₹15L+", "Not sure yet"],
          successTitle: "Message received.",
          successText: "Thanks for reaching out — we read every enquiry and will get back to you shortly.",
        }),
      ],
    ),
    page(
      "privacy",
      "Privacy Policy",
      "privacy",
      "How {legalName} collects, uses and protects the information you share with us.",
      [
        pageHeader("Legal", ["Privacy Policy"], "What we collect, why we collect it, and what we do with it."),
        textBlocks([
          ["What we collect", "The only personal information this website collects is what you choose to send through our contact form: your name, email address, company name (optional), the type of project, an optional budget range, and your message."],
          ["Why we collect it", "We use it solely to read and respond to your enquiry. We do not sell it, rent it, or share it with third parties for marketing."],
          ["How long we keep it", "Enquiries are retained for as long as needed to respond and to maintain a record of our correspondence. You can ask us to delete your data at any time by emailing {email}."],
          ["Analytics", "We may use privacy-respecting analytics to understand which pages are visited. This does not identify you personally."],
          ["Your rights", "You can request a copy of the information we hold about you, ask us to correct it, or ask us to delete it. Write to {email} and we will respond."],
          ["Contact", "{legalName}, {city}, {region}, {country}. Email {email}."],
        ]),
      ],
    ),
    page(
      "terms",
      "Terms of Use",
      "terms",
      "The terms that apply when you use the {legalName} website.",
      [
        pageHeader("Legal", ["Terms of Use"], "The terms that apply when you use this website."),
        textBlocks([
          ["Using this site", "You may browse and share this website freely. You may not copy its design, code or written content for commercial use without our written permission."],
          ["Indicative pricing", "Any prices, timelines or package contents shown on this site are indicative and for guidance only. They are not an offer or a quotation. Final scope, cost and timelines are confirmed in a written proposal after a discovery conversation."],
          ["Project work", "Work we carry out for clients is governed by the specific agreement signed for that engagement, not by this page. Where the two differ, the signed agreement applies."],
          ["Intellectual property", "The BondByte name, wordmark and the content of this site belong to {legalName}. Project names and marks belonging to our clients remain theirs."],
          ["Liability", "This website is provided as is. We take care to keep it accurate, but we do not warrant that it is free of errors, and we are not liable for decisions taken solely on the basis of its content."],
          ["Contact", "Questions about these terms can go to {email}."],
        ]),
      ],
    ),
  ];
}

function industriesSection() {
  return section("industries", {
    eyebrow: "Work by industry",
    heading: ["Solutions shaped", "around your sector."],
    description: "Pick your industry to see the work it involves, what each package covers and what it costs.",
  });
}

function textBlocks(blocks: [string, string][]) {
  return section("textBlocks", { blocks: blocks.map(([title, body]) => ({ id: makeId(), title, body })) });
}

export function defaultContent(): SiteContent {
  return {
    schemaVersion: SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
    revisions: {},

    settings: {
      name: SITE.name,
      legalName: SITE.legalName,
      description: SITE.description,
      email: SITE.email,
      phone: SITE.phone,
      city: SITE.location.city,
      region: SITE.location.region,
      country: SITE.location.country,
      countryCode: SITE.location.countryCode,
      registration: "UDYAM-GJ-01-0132398",
      domain: SITE.domain,
      titleSuffix: "Digital Product Studio",
      keywords: [
        "software development company",
        "web development",
        "mobile app development",
        "UI UX design",
        "product development",
        "technology partner",
        "software development Ahmedabad",
      ],
      shareImage: "",
      yearlyDiscount: Math.round(YEARLY_DISCOUNT * 100),
      tierNormal: TIER_LABELS.normal,
      tierExclusive: TIER_LABELS.exclusive,
      tierComplete: TIER_LABELS.complete,
      techCategories: [...TECH_CATEGORIES],
      insightCategories: [...INSIGHT_CATEGORIES],
      disciplines: ["Mobile Application", "Web Development", "UI/UX Design", "Logo Design"],
    },

    header: {
      leftLinks: NAV_LEFT.map((item) => link(item.label, item.href)),
      rightLinks: NAV_RIGHT.map((item) => link(item.label, item.href)),
      ctaLabel: "Get in Touch",
      ctaHref: "/contact",
      mobileExtraLinks: [link("Products", "/products")],
      mobileCtaLabel: "Start a Project",
    },

    footer: {
      blurb: "Strategy, design and engineering under one roof. Built in {city}, working with teams anywhere.",
      navTitle: "Navigate",
      navLinks: [
        ...[...NAV_LEFT, ...NAV_RIGHT].map((item) => link(item.label, item.href)),
        link("Products", "/products"),
        link("Contact", "/contact"),
      ],
      servicesTitle: "Services",
      servicesCount: 6,
      contactTitle: "Contact",
      socials: SOCIALS.filter((item) => item.url).map((item) => ({ id: makeId(), label: item.label, url: item.url as string })),
      showUdyamMark: true,
      wordmark: SITE.name,
    },

    brand: {
      logo: "/images/logo-mark.png",
      wordFirst: "Bond",
      wordSecond: "Byte",
      favicon: "",
    },

    pages: defaultPages(),

    projects: PROJECTS.map((project) => ({
      id: makeId(),
      slug: project.slug,
      title: project.title,
      discipline: project.discipline,
      summary: project.summary,
      description: project.description ?? "",
      year: project.year ?? "",
      stack: [...project.stack],
      metrics: project.metrics.map((metric) => ({ id: makeId(), ...metric })),
      image: project.image ?? "",
      tone: project.tone,
      featured: project.featured,
      published: true,
    })),

    insights: INSIGHTS.map((insight) => ({
      id: makeId(),
      slug: insight.slug,
      title: insight.title,
      excerpt: insight.excerpt,
      category: insight.category,
      date: insight.date,
      readTime: insight.readTime,
      author: insight.author,
      featured: insight.featured,
      published: insight.published,
      body: insight.body.map((block) => ({
        id: makeId(),
        type: block.type,
        text: "text" in block ? block.text : "",
        items: "items" in block ? [...block.items] : [],
      })),
    })),

    services: SERVICES.map((service) => ({
      id: makeId(),
      title: service.title,
      description: service.description,
      capabilities: [...service.capabilities],
    })),

    capabilities: CAPABILITIES.map((item) => ({
      id: makeId(),
      title: item.title,
      description: item.description,
      examples: [...item.examples],
      tone: item.tone,
    })),

    team: TEAM.map((member) => ({ id: makeId(), name: member.name, role: member.role, image: member.image, linkedin: member.linkedin ?? "" })),

    technologies: TECHNOLOGIES.map((tech) => ({ id: makeId(), name: tech.name, category: tech.category, weight: String(tech.weight) })),

    processSteps: PROCESS_STEPS.map((step) => ({ id: makeId(), title: step.title, description: step.description })),
    principles: PRINCIPLES.map((step) => ({ id: makeId(), title: step.title, description: step.description })),

    pricingTiers: PRICING_TIERS.map((tier) => ({
      id: makeId(),
      name: tier.name,
      description: tier.description,
      price: tier.price,
      period: tier.period ?? "",
      features: [...tier.features],
      cta: tier.cta,
      ctaHref: tier.ctaHref,
      note: tier.note,
      featured: tier.featured,
    })),

    comparisonRows: COMPARISON_ROWS.map((row) => ({ id: makeId(), ...row })),

    industries: INDUSTRIES.map((industry) => {
      const pkg = (tier: "normal" | "exclusive" | "complete") => {
        const source = industry.packages[tier];
        return {
          name: source.name,
          description: source.description,
          monthlyPrice: source.monthlyPrice,
          timeline: source.timeline,
          bestFor: source.bestFor,
          features: [...source.features],
          details: source.details.map((group) => ({ id: makeId(), title: group.title, items: [...group.items] })),
        };
      };
      return {
        id: makeId(),
        slug: industry.id,
        name: industry.name,
        description: industry.description,
        normal: pkg("normal"),
        exclusive: pkg("exclusive"),
        complete: pkg("complete"),
      };
    }),

    products: PRODUCTS.map((product) => ({
      id: makeId(),
      name: product.name,
      tagline: product.tagline,
      problem: product.problem,
      solution: product.solution,
      features: [...product.features],
      stack: [...product.stack],
      status: product.status,
      caseStudy: PROJECTS.find((project) => project.title === product.name)?.slug ?? "",
    })),

    testimonials: TESTIMONIALS.map((item) => ({ id: makeId(), ...item })),
    clients: CLIENTS.map((name) => ({ id: makeId(), name })),
  };
}
