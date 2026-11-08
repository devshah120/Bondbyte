"use client";

import { useState } from "react";
import { ArrowLeft, ExternalLink, Trash2 } from "lucide-react";
import { COLLECTIONS, defaultsFor, fieldsOf, itemLabel, makeId } from "@/lib/cms/schema";
import type { CollectionKey } from "@/lib/cms/types";
import { api } from "../api";
import { AdminLink, useAdminNavigate, useCms, useContent, useDirtyGuard } from "../cms";
import { FormGroups, useForm } from "../fields";
import { btn, ConfirmDialog, EmptyState, SaveBar, ScreenHeader } from "../ui";
import { itemUrl } from "./CollectionList";

type Item = Record<string, unknown> & { id: string };

/** One item of a collection. `itemId` "new" starts an empty one. */
export function ItemEditor({ collectionKey, itemId }: { collectionKey: CollectionKey; itemId: string }) {
  const content = useContent();
  const { setContent, notify, handleError } = useCms();
  const navigate = useAdminNavigate();
  const def = COLLECTIONS[collectionKey];
  const fields = fieldsOf(def.groups);
  const items = content[collectionKey] as unknown as Item[];
  const isNew = itemId === "new";
  const existing = items.find((item) => item.id === itemId);

  const [id] = useState(() => (isNew ? makeId() : itemId));
  const form = useForm<Item>(existing ?? { id, ...defaultsFor(fields) });
  const [base, setBase] = useState(content.revisions[collectionKey] ?? 0);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  useDirtyGuard(`item:${collectionKey}:${id}`, form.dirty || (isNew && saving));

  const back = (
    <AdminLink href={`/admin/c/${collectionKey}`} className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg">
      <ArrowLeft className="h-4 w-4" /> {def.title}
    </AdminLink>
  );

  if (!isNew && !existing) {
    return (
      <div>
        <ScreenHeader title="Not found" back={back} />
        <EmptyState>This {def.singular} no longer exists. It may have been deleted on another device.</EmptyState>
      </div>
    );
  }

  async function save() {
    const result = form.validate(fields);
    if (!result.ok) {
      notify("Please check the highlighted fields.", "error");
      return;
    }
    const value: Item = { id, ...result.value };
    // Unique fields are checked here too, so the message points at the field.
    for (const key of def.unique ?? []) {
      const clash = items.find((item) => item.id !== id && item[key] === value[key]);
      if (clash) {
        form.setErrors({ [key]: `"${itemLabel(def, clash)}" already uses this. Each ${def.singular} needs its own.` });
        notify("Please check the highlighted fields.", "error");
        return;
      }
    }
    const next = existing ? items.map((item) => (item.id === id ? value : item)) : [...items, value];
    setSaving(true);
    try {
      const saved = await api.putCollection(collectionKey, next, base);
      setContent(saved);
      const stored = (saved[collectionKey] as unknown as Item[]).find((item) => item.id === id) ?? value;
      form.reset(stored);
      setBase(saved.revisions[collectionKey] ?? 0);
      notify(isNew ? `${def.singular[0].toUpperCase()}${def.singular.slice(1)} added.` : "Saved.");
      if (isNew) navigate(`/admin/c/${collectionKey}/${id}`, { force: true, replace: true });
    } catch (err) {
      handleError(err);
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    setSaving(true);
    try {
      setContent(await api.putCollection(collectionKey, items.filter((item) => item.id !== id), base));
      notify(`${def.singular[0].toUpperCase()}${def.singular.slice(1)} deleted.`);
      navigate(`/admin/c/${collectionKey}`, { force: true });
    } catch (err) {
      handleError(err);
      setSaving(false);
      setDeleting(false);
    }
  }

  const url = existing ? itemUrl(collectionKey, existing) : null;
  const live = def.toggleKey && existing ? Boolean(existing[def.toggleKey]) : true;

  return (
    <div>
      <ScreenHeader
        back={back}
        title={isNew ? `New ${def.singular}` : itemLabel(def, form.saved)}
        actions={
          !isNew && (
            <>
              {url && live && (
                <a href={url} target="_blank" rel="noopener noreferrer" className={btn.outline}>
                  <ExternalLink /> View on website
                </a>
              )}
              <button type="button" className={btn.dangerText} onClick={() => setDeleting(true)}>
                <Trash2 /> Delete
              </button>
            </>
          )
        }
      />
      <FormGroups groups={def.groups} values={form.draft} errors={form.errors} onChange={form.update} idPrefix={`${collectionKey}-${id}`} />
      <SaveBar dirty={form.dirty || isNew} saving={saving} onSave={save} onDiscard={isNew ? () => navigate(`/admin/c/${collectionKey}`) : form.discard} label={isNew ? `Add ${def.singular}` : "Save changes"} />

      {deleting && (
        <ConfirmDialog
          title={`Delete this ${def.singular}?`}
          message={<>&ldquo;{itemLabel(def, form.saved)}&rdquo; will be removed from the website. You can bring it back from Version history.</>}
          confirmLabel="Delete"
          danger
          busy={saving}
          onCancel={() => setDeleting(false)}
          onConfirm={remove}
        />
      )}
    </div>
  );
}
