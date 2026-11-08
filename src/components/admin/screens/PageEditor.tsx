"use client";

import { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronRight, ChevronUp, Copy, Eye, EyeOff, ExternalLink, Plus, Trash2 } from "lucide-react";
import { HOME_PAGE_ID, LOCKED_SLUGS, PAGE_FIELDS, SECTION_TYPES, defaultsFor, fieldsOf, makeId, sectionLabel, validateSection } from "@/lib/cms/schema";
import { pagePath } from "@/lib/cms/content";
import type { Page, Section } from "@/lib/cms/types";
import { cn } from "@/lib/utils/cn";
import { api } from "../api";
import { AdminLink, useCms, useContent, useDirtyGuard } from "../cms";
import { FieldGrid, FieldInput, useForm } from "../fields";
import { btn, cardClass, EmptyState, iconBtn, inputClass, SaveBar, ScreenHeader } from "../ui";

type PageDraft = Omit<Page, "id" | "updatedAt">;

const toDraft = (page: Page): PageDraft => ({
  title: page.title,
  slug: page.slug,
  published: page.published,
  seoTitle: page.seoTitle,
  seoDescription: page.seoDescription,
  sections: page.sections,
});

/** A short description of a section for its row: its first heading line or title. */
function sectionHint(section: Section): string {
  const data = section.data;
  const heading = Array.isArray(data.heading) ? (data.heading as string[]).join(" ") : "";
  return heading || String(data.line1 ?? data.eyebrow ?? "");
}

export function PageEditor({ pageId }: { pageId: string }) {
  const content = useContent();
  const { setContent, notify, handleError } = useCms();
  const page = content.pages.find((entry) => entry.id === pageId);
  const form = useForm<PageDraft & Record<string, unknown>>(page ? toDraft(page) : ({} as PageDraft));
  const [base, setBase] = useState(content.revisions[`page:${pageId}`] ?? 0);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [newType, setNewType] = useState("");
  useDirtyGuard(`page:${pageId}`, form.dirty);

  const back = (
    <AdminLink href="/admin/pages" className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg">
      <ArrowLeft className="h-4 w-4" /> Pages
    </AdminLink>
  );

  if (!page) {
    return (
      <div>
        <ScreenHeader title="Not found" back={back} />
        <EmptyState>This page no longer exists. It may have been deleted on another device.</EmptyState>
      </div>
    );
  }

  const sections = form.draft.sections;
  const setSections = (next: Section[]) => form.update("sections", next);
  const locked = pageId in LOCKED_SLUGS;
  const isHome = pageId === HOME_PAGE_ID;

  const toggleOpen = (id: string) =>
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const move = (index: number, delta: number) => {
    const next = [...sections];
    const [section] = next.splice(index, 1);
    next.splice(index + delta, 0, section);
    setSections(next);
  };
  const updateSection = (index: number, change: Partial<Section>) => setSections(sections.map((section, i) => (i === index ? { ...section, ...change } : section)));
  const duplicate = (index: number) => {
    const copy = { ...structuredClone(sections[index]), id: makeId() };
    const next = [...sections];
    next.splice(index + 1, 0, copy);
    setSections(next);
    setOpen((current) => new Set([...current, copy.id]));
  };
  const add = () => {
    if (!newType) return;
    const section: Section = { id: makeId(), type: newType, visible: true, data: defaultsFor(fieldsOf(SECTION_TYPES[newType].groups)) };
    setSections([...sections, section]);
    setOpen((current) => new Set([...current, section.id]));
    setNewType("");
  };

  async function save() {
    const details = form.validate(PAGE_FIELDS.filter((field) => field.key !== "slug"));
    if (!details.ok) {
      notify("Please check the page details.", "error");
      return;
    }
    // Checked here first, so the section with a problem can be opened.
    for (const section of sections) {
      const result = validateSection(section.type, section.data);
      if (!result.ok) {
        setOpen((current) => new Set([...current, section.id]));
        notify(`${sectionLabel(section.type)}: ${result.error}`, "error");
        return;
      }
    }
    setSaving(true);
    try {
      const saved = await api.putPage(pageId, form.draft, base);
      setContent(saved);
      const stored = saved.pages.find((entry) => entry.id === pageId);
      if (stored) form.reset(toDraft(stored) as PageDraft & Record<string, unknown>);
      setBase(saved.revisions[`page:${pageId}`] ?? 0);
      notify(`"${form.draft.title}" saved.`);
    } catch (err) {
      handleError(err);
    } finally {
      setSaving(false);
    }
  }

  const detailFields = PAGE_FIELDS.filter((field) => field.key !== "slug" && field.key !== "published");
  const slugField = PAGE_FIELDS.find((field) => field.key === "slug")!;
  const publishedField = PAGE_FIELDS.find((field) => field.key === "published")!;

  return (
    <div>
      <ScreenHeader
        back={back}
        title={page.title}
        description={
          <span className="font-mono text-sm">
            {pagePath(page)}
            {!page.published && <span className="ml-2 font-sans text-amber-700">Draft — not on the website</span>}
          </span>
        }
        actions={
          page.published && (
            <a href={pagePath(page)} target="_blank" rel="noopener noreferrer" className={btn.outline}>
              <ExternalLink /> View page
            </a>
          )
        }
      />

      <div className="space-y-5">
        <section className={cardClass}>
          <h2 className="text-base font-semibold tracking-tight text-fg">Page details</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <FieldInput field={detailFields[0]} value={form.draft.title} error={form.errors.title} onChange={(value) => form.update("title", value)} idPrefix={`page-${pageId}`} />
            <div>
              <FieldInput
                field={{ ...slugField, help: locked ? "This address is fixed: other parts of the site depend on it." : "Shown as /address. Changing it breaks old links to this page." }}
                value={locked ? LOCKED_SLUGS[pageId] || "(home page)" : form.draft.slug}
                error={form.errors.slug}
                onChange={(value) => form.update("slug", value)}
                idPrefix={`page-${pageId}`}
                disabled={locked}
              />
            </div>
            <div className="sm:col-span-2">
              <FieldInput
                field={{ ...publishedField, help: isHome ? "The home page is always published." : "Drafts are not on the website and not in the sitemap." }}
                value={isHome ? true : form.draft.published}
                onChange={(value) => form.update("published", value)}
                idPrefix={`page-${pageId}`}
                disabled={isHome}
              />
            </div>
          </div>
          <FieldGrid fields={detailFields.slice(1)} values={form.draft} errors={form.errors} onChange={form.update} idPrefix={`page-${pageId}`} className="mt-5" />
        </section>

        <section className={cardClass}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-base font-semibold tracking-tight text-fg">Sections</h2>
            <p className="text-sm text-fg-muted">Shown from top to bottom. Hidden sections stay here but are not on the website.</p>
          </div>

          {sections.length === 0 ? (
            <p className="mt-4 rounded-lg border border-dashed border-line-strong px-4 py-3 text-sm text-fg-subtle">This page has no sections yet.</p>
          ) : (
            <ol className="mt-4 space-y-2">
              {sections.map((section, index) => {
                const def = SECTION_TYPES[section.type];
                const expanded = open.has(section.id);
                const label = sectionLabel(section.type);
                const hint = sectionHint(section);
                const hasFields = def ? fieldsOf(def.groups).length > 0 : false;
                return (
                  <li key={section.id} className={cn("rounded-lg border bg-surface", expanded ? "border-line-strong" : "border-line", !section.visible && "bg-bg")}>
                    <div className="flex items-center gap-1 pr-1.5">
                      <button type="button" className="flex min-w-0 flex-1 items-center gap-2.5 px-3 py-3 text-left" aria-expanded={expanded} onClick={() => toggleOpen(section.id)}>
                        <ChevronRight className={cn("h-4 w-4 shrink-0 text-fg-subtle transition-transform", expanded && "rotate-90")} />
                        <span className="w-6 shrink-0 text-xs tabular-nums text-fg-subtle">{index + 1}</span>
                        <span className="min-w-0">
                          <span className={cn("block truncate text-sm font-medium", section.visible ? "text-fg" : "text-fg-subtle line-through")}>{label}</span>
                          {hint && <span className="block truncate text-xs text-fg-subtle">{hint}</span>}
                        </span>
                      </button>
                      <button
                        type="button"
                        className={iconBtn}
                        onClick={() => updateSection(index, { visible: !section.visible })}
                        aria-label={section.visible ? `Hide "${label}"` : `Show "${label}"`}
                        title={section.visible ? "Hide" : "Show"}
                      >
                        {section.visible ? <Eye /> : <EyeOff />}
                      </button>
                      <button type="button" className={iconBtn} onClick={() => move(index, -1)} disabled={index === 0} aria-label={`Move "${label}" up`}>
                        <ChevronUp />
                      </button>
                      <button type="button" className={iconBtn} onClick={() => move(index, 1)} disabled={index === sections.length - 1} aria-label={`Move "${label}" down`}>
                        <ChevronDown />
                      </button>
                      <button type="button" className={iconBtn} onClick={() => duplicate(index)} aria-label={`Copy "${label}"`} title="Copy">
                        <Copy />
                      </button>
                      <button type="button" className={cn(iconBtn, "hover:bg-red-50 hover:text-red-600")} onClick={() => setSections(sections.filter((_, i) => i !== index))} aria-label={`Remove "${label}"`} title="Remove">
                        <Trash2 />
                      </button>
                    </div>
                    {expanded && def && (
                      <div className="border-t border-line px-4 py-4">
                        <p className="mb-4 text-sm text-fg-muted">{def.description}</p>
                        {hasFields ? (
                          def.groups.map((group, groupIndex) => (
                            <FieldGrid
                              key={groupIndex}
                              fields={group.fields}
                              values={section.data}
                              onChange={(key, value) => updateSection(index, { data: { ...section.data, [key]: value } })}
                              idPrefix={`section-${section.id}`}
                              className={groupIndex > 0 ? "mt-5" : ""}
                            />
                          ))
                        ) : (
                          <p className="text-sm text-fg-subtle">This section has nothing to set here.</p>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          )}

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <select className={cn(inputClass, "sm:max-w-xs")} value={newType} onChange={(event) => setNewType(event.target.value)} aria-label="Kind of section to add">
              <option value="">Choose a section to add…</option>
              {Object.values(SECTION_TYPES).map((def) => (
                <option key={def.type} value={def.type}>
                  {def.label}
                </option>
              ))}
            </select>
            <button type="button" className={btn.outline} onClick={add} disabled={!newType}>
              <Plus /> Add section
            </button>
          </div>
          {newType && <p className="mt-2 text-sm text-fg-subtle">{SECTION_TYPES[newType].description}</p>}
        </section>
      </div>

      <SaveBar dirty={form.dirty} saving={saving} onSave={save} onDiscard={form.discard} />
    </div>
  );
}
