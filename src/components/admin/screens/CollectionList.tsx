"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Copy, ExternalLink, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { COLLECTIONS, itemLabel, makeId } from "@/lib/cms/schema";
import type { CollectionKey } from "@/lib/cms/types";
import { cn } from "@/lib/utils/cn";
import { api } from "../api";
import { AdminLink, useCms, useContent } from "../cms";
import { btn, ConfirmDialog, EmptyState, iconBtn, inputClass, ScreenHeader, Switch } from "../ui";

type Item = Record<string, unknown> & { id: string };

/** Where an item can be seen on the website, when it has its own page. */
export function itemUrl(key: CollectionKey, item: Item): string | null {
  if (key === "projects" && item.slug) return `/work/${item.slug}`;
  if (key === "insights" && item.slug) return `/insights/${item.slug}`;
  return null;
}

/** A collection: reorder, switch live/hidden, copy and delete here; edit each item on its own screen. */
export function CollectionList({ collectionKey }: { collectionKey: CollectionKey }) {
  const content = useContent();
  const { setContent, notify, handleError } = useCms();
  const def = COLLECTIONS[collectionKey];
  const items = content[collectionKey] as unknown as Item[];
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState<Item | null>(null);

  async function saveItems(next: Item[], message: string) {
    setBusy(true);
    try {
      setContent(await api.putCollection(collectionKey, next, content.revisions[collectionKey] ?? 0));
      notify(message);
    } catch (err) {
      handleError(err);
    } finally {
      setBusy(false);
      setDeleting(null);
    }
  }

  const move = (index: number, delta: number) => {
    const next = [...items];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item);
    void saveItems(next, "Order saved.");
  };

  const duplicate = (index: number) => {
    const copy: Item = { ...structuredClone(items[index]), id: makeId() };
    for (const key of def.unique ?? []) {
      // Unique fields (page addresses) get a free variant: kindify → kindify-copy, kindify-copy-2 …
      const taken = new Set(items.map((item) => String(item[key])));
      let candidate = `${copy[key]}-copy`;
      for (let n = 2; taken.has(candidate); n++) candidate = `${copy[key]}-copy-${n}`;
      copy[key] = candidate;
    }
    if (def.labelKey in copy) copy[def.labelKey] = `${copy[def.labelKey]} (copy)`;
    if (def.toggleKey) copy[def.toggleKey] = false;
    const next = [...items];
    next.splice(index + 1, 0, copy);
    void saveItems(next, `Copied. The copy is hidden until you switch it on.`);
  };

  const toggle = (index: number, value: boolean) => {
    if (!def.toggleKey) return;
    const key = def.toggleKey;
    void saveItems(
      items.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
      value ? "Now live on the website." : "Hidden from the website.",
    );
  };

  const term = query.trim().toLowerCase();
  const shown = items.map((item, index) => ({ item, index })).filter(({ item }) => !term || JSON.stringify(item).toLowerCase().includes(term));

  return (
    <div>
      <ScreenHeader
        title={def.title}
        description={def.description}
        actions={
          <AdminLink href={`/admin/c/${collectionKey}/new`} className={btn.primary}>
            <Plus /> Add {def.singular}
          </AdminLink>
        }
      />

      {items.length > 8 && (
        <div className="relative mb-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" />
          <input className={cn(inputClass, "pl-9")} type="search" placeholder={`Search ${def.title.toLowerCase()}`} value={query} onChange={(event) => setQuery(event.target.value)} aria-label={`Search ${def.title}`} />
        </div>
      )}

      {items.length === 0 ? (
        <EmptyState>
          Nothing here yet.{" "}
          <AdminLink href={`/admin/c/${collectionKey}/new`} className="text-accent hover:underline">
            Add the first {def.singular}
          </AdminLink>
          .
        </EmptyState>
      ) : shown.length === 0 ? (
        <EmptyState>Nothing matches your search.</EmptyState>
      ) : (
        <ul className="overflow-hidden rounded-xl border border-line bg-surface">
          {shown.map(({ item, index }) => {
            const label = itemLabel(def, item);
            const summary = (def.summaryKeys ?? []).map((key) => String(item[key] ?? "")).filter(Boolean).join(" · ");
            const live = def.toggleKey ? Boolean(item[def.toggleKey]) : true;
            const url = itemUrl(collectionKey, item);
            return (
              <li key={item.id} className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-line px-4 py-3 last:border-b-0">
                <span className="w-7 shrink-0 text-xs tabular-nums text-fg-subtle">{String(index + 1).padStart(2, "0")}</span>
                <AdminLink href={`/admin/c/${collectionKey}/${item.id}`} className="min-w-0 flex-1 basis-48">
                  <span className={cn("block truncate text-[0.9375rem] font-medium hover:text-accent", live ? "text-fg" : "text-fg-subtle")}>{label}</span>
                  {summary && <span className="block truncate text-xs text-fg-subtle">{summary}</span>}
                </AdminLink>
                {def.toggleKey && <Switch checked={live} onChange={(value) => toggle(index, value)} disabled={busy} label={<span className="text-sm text-fg-muted">{live ? "Live" : "Hidden"}</span>} />}
                <div className="flex items-center">
                  {url && live && (
                    <a href={url} target="_blank" rel="noopener noreferrer" className={iconBtn} aria-label={`View "${label}" on the website`} title="View on website">
                      <ExternalLink />
                    </a>
                  )}
                  <AdminLink href={`/admin/c/${collectionKey}/${item.id}`} className={iconBtn} aria-label={`Edit "${label}"`} title="Edit">
                    <Pencil />
                  </AdminLink>
                  {!term && (
                    <>
                      <button type="button" className={iconBtn} onClick={() => move(index, -1)} disabled={busy || index === 0} aria-label={`Move "${label}" up`}>
                        <ChevronUp />
                      </button>
                      <button type="button" className={iconBtn} onClick={() => move(index, 1)} disabled={busy || index === items.length - 1} aria-label={`Move "${label}" down`}>
                        <ChevronDown />
                      </button>
                    </>
                  )}
                  <button type="button" className={iconBtn} onClick={() => duplicate(index)} disabled={busy} aria-label={`Copy "${label}"`} title="Copy">
                    <Copy />
                  </button>
                  <button type="button" className={cn(iconBtn, "hover:bg-red-50 hover:text-red-600")} onClick={() => setDeleting(item)} disabled={busy} aria-label={`Delete "${label}"`} title="Delete">
                    <Trash2 />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {deleting && (
        <ConfirmDialog
          title={`Delete this ${def.singular}?`}
          message={
            <>
              &ldquo;{itemLabel(def, deleting)}&rdquo; will be removed from the website. You can bring it back from Version history.
            </>
          }
          confirmLabel="Delete"
          danger
          busy={busy}
          onCancel={() => setDeleting(null)}
          onConfirm={() =>
            saveItems(
              items.filter((item) => item.id !== deleting.id),
              `${def.singular[0].toUpperCase()}${def.singular.slice(1)} deleted.`,
            )
          }
        />
      )}
    </div>
  );
}
