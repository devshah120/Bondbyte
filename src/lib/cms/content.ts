/**
 * Helpers for reading content: normalising stored JSON, filling in automatic
 * values ({company}, {email} ...) and picking what the site shows.
 *
 * Runs in the browser and on the server — no Node imports.
 */

import { defaultContent } from "./defaults";
import { COLLECTIONS, OBJECTS, SCHEMA_VERSION, SECTION_TYPES, defaultsFor, fieldsOf } from "./schema";
import type { CollectionKey, Insight, ObjectKey, Page, Project, SiteContent } from "./types";

const isObject = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object" && !Array.isArray(value);

/**
 * Brings stored content up to the current shape: missing parts come from the
 * defaults and missing fields get their default value, so content saved by an
 * older version keeps working after an update.
 */
export function normalizeContent(stored: unknown): SiteContent {
  const base = defaultContent();
  if (!isObject(stored)) return base;
  const content = { ...base } as unknown as Record<string, unknown>;

  for (const key of Object.keys(OBJECTS) as ObjectKey[]) {
    const fieldDefaults = defaultsFor(fieldsOf(OBJECTS[key].groups));
    const value = isObject(stored[key]) ? stored[key] : {};
    content[key] = { ...fieldDefaults, ...(base[key] as unknown as Record<string, unknown>), ...value };
  }

  for (const key of Object.keys(COLLECTIONS) as CollectionKey[]) {
    if (!Array.isArray(stored[key])) continue;
    const fieldDefaults = defaultsFor(fieldsOf(COLLECTIONS[key].groups));
    content[key] = (stored[key] as unknown[]).filter(isObject).map((item) => ({ ...fieldDefaults, ...item }));
  }

  if (Array.isArray(stored.pages)) {
    content.pages = (stored.pages as unknown[]).filter(isObject).map((raw) => {
      const sections = Array.isArray(raw.sections) ? raw.sections.filter(isObject) : [];
      return {
        ...raw,
        sections: sections
          .filter((section) => typeof section.type === "string" && section.type in SECTION_TYPES)
          .map((section) => ({
            ...section,
            visible: section.visible !== false,
            data: { ...defaultsFor(fieldsOf(SECTION_TYPES[section.type as string].groups)), ...(isObject(section.data) ? section.data : {}) },
          })),
      };
    });
  }

  content.revisions = isObject(stored.revisions) ? stored.revisions : {};
  content.updatedAt = typeof stored.updatedAt === "string" ? stored.updatedAt : base.updatedAt;
  content.schemaVersion = SCHEMA_VERSION;
  return content as unknown as SiteContent;
}

/* ── Automatic values ────────────────────────────────────────────────────── */

export type TokenValues = Record<string, string>;

export function tokenValues(content: SiteContent): TokenValues {
  const { settings } = content;
  return {
    company: settings.name,
    legalName: settings.legalName,
    email: settings.email,
    phone: settings.phone,
    city: settings.city,
    region: settings.region,
    country: settings.country,
    year: String(new Date().getFullYear()),
    teamCount: String(content.team.length),
    projectCount: String(content.projects.filter((project) => project.published).length),
  };
}

export function fillTokens(text: string, values: TokenValues): string {
  return text.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? values[key] : match));
}

/** Replaces tokens in every string inside a value (objects and arrays included). */
export function fillTokensDeep<T>(value: T, values: TokenValues): T {
  if (typeof value === "string") return fillTokens(value, values) as T;
  if (Array.isArray(value)) return value.map((item) => fillTokensDeep(item, values)) as T;
  if (isObject(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, fillTokensDeep(item, values)])) as T;
  }
  return value;
}

/* ── What the site shows ─────────────────────────────────────────────────── */

export const pagePath = (page: Pick<Page, "slug">) => (page.slug ? `/${page.slug}` : "/");

export function findPage(content: SiteContent, slug: string): Page | undefined {
  return content.pages.find((page) => page.published && page.slug === slug);
}

export const publishedProjects = (content: SiteContent): Project[] => content.projects.filter((project) => project.published);

export function publishedInsights(content: SiteContent): Insight[] {
  return content.insights.filter((insight) => insight.published).sort((a, b) => b.date.localeCompare(a.date));
}

export function featuredInsight(insights: Insight[]): Insight | undefined {
  return insights.find((insight) => insight.featured) ?? insights[0];
}

/** "+91 91063 15912" → "tel:+919106315912" */
export const phoneHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
