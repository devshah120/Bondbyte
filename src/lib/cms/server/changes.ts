import "server-only";
import { COLLECTIONS, OBJECTS, PAGE_FIELDS, fieldsOf, itemLabel, sectionLabel } from "../schema";
import type { CollectionKey, ObjectKey, Page } from "../types";
import type { Change } from "./store";

// Short, readable descriptions of a save for the version history, plus a merge
// key: saves with the same key in quick succession are kept as one version.

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const quote = (text: unknown) => {
  const value = String(text ?? "").trim();
  return `"${value.length > 50 ? `${value.slice(0, 49)}…` : value}"`;
};

function names<T>(items: T[], label: (item: T) => string) {
  const shown = items.slice(0, 2).map(label).join(", ");
  return items.length > 2 ? `${shown} and ${items.length - 2} more` : shown;
}

export function describeObjectChange(key: ObjectKey, before: unknown, after: unknown): Change {
  const def = OBJECTS[key];
  const a = (before ?? {}) as Record<string, unknown>;
  const b = (after ?? {}) as Record<string, unknown>;
  const changed = fieldsOf(def.groups).filter((field) => !same(a[field.key], b[field.key]));
  if (changed.length === 0) return { summary: `${def.title}: saved, nothing changed`, mergeKey: `object:${key}` };
  const shown = changed.slice(0, 3).map((field) => field.label).join(", ");
  const more = changed.length > 3 ? ` and ${changed.length - 3} more` : "";
  return { summary: `${def.title}: ${shown}${more} changed`, mergeKey: `object:${key}` };
}

type Item = Record<string, unknown> & { id: string };

export function describeListChange(key: CollectionKey, before: Item[], after: Item[]): Change {
  const def = COLLECTIONS[key];
  const label = (item: Item) => quote(itemLabel(def, item));
  const was = new Map(before.map((item) => [item.id, item]));
  const now = new Set(after.map((item) => item.id));
  const added = after.filter((item) => !was.has(item.id));
  const removed = before.filter((item) => !now.has(item.id));
  const kept = after.filter((item) => was.has(item.id));
  const edited = kept.filter((item) => !same(was.get(item.id), item));
  const reordered = before.filter((item) => now.has(item.id)).map((item) => item.id).join() !== kept.map((item) => item.id).join();

  const parts: string[] = [];
  if (added.length) parts.push(`added ${names(added, label)}`);
  if (removed.length) parts.push(`deleted ${names(removed, label)}`);
  if (edited.length) parts.push(`edited ${names(edited, label)}`);
  if (reordered) parts.push("order changed");
  const summary = `${def.title}: ${parts.length ? parts.join(", ") : "saved, nothing changed"}`;

  let mergeKey: string | null = null;
  if (parts.length === 1 && reordered) mergeKey = `${key}:order`;
  else if (parts.length === 1 && edited.length === 1) mergeKey = `${key}:edit:${edited[0].id}`;
  return { summary, mergeKey };
}

/** `before` is missing for a new page, `after` for a deleted one. */
export function describePageChange(before: Page | undefined, after: Page | undefined): Change {
  const name = quote((after ?? before)?.title);
  if (!before) return { summary: `Pages: added ${name}`, mergeKey: null };
  if (!after) return { summary: `Pages: deleted ${name}`, mergeKey: null };

  const label = (section: Page["sections"][number]) => quote(sectionLabel(section.type));
  const was = new Map(before.sections.map((section) => [section.id, section]));
  const now = new Set(after.sections.map((section) => section.id));
  const added = after.sections.filter((section) => !was.has(section.id));
  const removed = before.sections.filter((section) => !now.has(section.id));
  const kept = after.sections.filter((section) => was.has(section.id));
  const edited = kept.filter((section) => !same(was.get(section.id)?.data, section.data));
  const toggled = kept.filter((section) => was.get(section.id)?.visible !== section.visible);
  const reordered = before.sections.filter((section) => now.has(section.id)).map((section) => section.id).join() !== kept.map((section) => section.id).join();
  const details = PAGE_FIELDS.filter((field) => field.key !== "published" && !same(before[field.key as keyof Page], after[field.key as keyof Page]));

  const parts: string[] = [];
  if (details.length) parts.push(`${details.map((field) => field.label).join(", ")} changed`);
  if (before.published !== after.published) parts.push(after.published ? "published" : "unpublished");
  if (added.length) parts.push(`added ${names(added, label)}`);
  if (removed.length) parts.push(`removed ${names(removed, label)}`);
  if (edited.length) parts.push(`edited ${names(edited, label)}`);
  for (const section of toggled.slice(0, 3)) parts.push(`${label(section)} ${section.visible ? "shown" : "hidden"}`);
  if (reordered) parts.push("sections reordered");
  const summary = `Page ${name}: ${parts.length ? parts.join(", ") : "saved, nothing changed"}`;

  let mergeKey: string | null = null;
  if (parts.length === 1 && details.length) mergeKey = `page:${after.id}:details`;
  else if (parts.length === 1 && edited.length === 1) mergeKey = `page:${after.id}:edit:${edited[0].id}`;
  else if (parts.length === 1 && reordered) mergeKey = `page:${after.id}:order`;
  return { summary, mergeKey };
}
