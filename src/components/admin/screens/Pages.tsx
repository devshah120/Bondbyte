"use client";

import { useState } from "react";
import { Copy, ExternalLink, FilePlus2, Pencil, Trash2 } from "lucide-react";
import { HOME_PAGE_ID, LOCKED_SLUGS, SECTION_TYPES, defaultsFor, fieldsOf, makeId, pageSlugError } from "@/lib/cms/schema";
import { pagePath } from "@/lib/cms/content";
import type { Page } from "@/lib/cms/types";
import { cn } from "@/lib/utils/cn";
import { api } from "../api";
import { AdminLink, useAdminNavigate, useCms, useContent } from "../cms";
import { btn, Chip, ConfirmDialog, iconBtn, inputClass, Modal, ScreenHeader, Spinner, timeAgo } from "../ui";

const slugFrom = (title: string) =>
  title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

const newSection = (type: string) => ({ id: makeId(), type, visible: true, data: defaultsFor(fieldsOf(SECTION_TYPES[type].groups)) });

function AddPage({ copyOf, onClose }: { copyOf?: Page; onClose: () => void }) {
  const content = useContent();
  const { setContent, notify, handleError } = useCms();
  const navigate = useAdminNavigate();
  const [title, setTitle] = useState(copyOf ? `${copyOf.title} (copy)` : "");
  const [slug, setSlug] = useState(copyOf ? `${copyOf.slug || "home"}-copy` : "");
  const [slugEdited, setSlugEdited] = useState(Boolean(copyOf));
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function create(event: React.FormEvent) {
    event.preventDefault();
    const id = makeId();
    const problem = !title.trim() ? "Enter a name for the page." : pageSlugError(slug, id, content.pages);
    if (problem) {
      setError(problem);
      return;
    }
    const sections = copyOf
      ? copyOf.sections.map((section) => ({ ...structuredClone(section), id: makeId() }))
      : [{ ...newSection("pageHeader"), data: { ...defaultsFor(fieldsOf(SECTION_TYPES.pageHeader.groups)), eyebrow: title.trim(), heading: [title.trim()], style: "dark" } }, newSection("cta")];
    setBusy(true);
    try {
      const saved = await api.putPage(id, { title: title.trim(), slug, published: false, seoTitle: "", seoDescription: copyOf?.seoDescription ?? "", sections }, 0);
      setContent(saved);
      notify("Page added. It stays hidden until you publish it.");
      navigate(`/admin/pages/${id}`, { force: true });
    } catch (err) {
      handleError(err);
      setBusy(false);
    }
  }

  return (
    <Modal
      title={copyOf ? `Copy "${copyOf.title}"` : "Add a page"}
      onClose={onClose}
      footer={
        <>
          <button type="button" className={btn.outline} onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button type="submit" form="add-page" className={btn.primary} disabled={busy}>
            {busy && <Spinner />} {copyOf ? "Copy page" : "Add page"}
          </button>
        </>
      }
    >
      <form id="add-page" onSubmit={create} className="space-y-4">
        <div>
          <label htmlFor="new-page-title" className="mb-1.5 block text-sm font-medium text-fg">
            Page name
          </label>
          <input
            id="new-page-title"
            className={inputClass}
            value={title}
            maxLength={80}
            autoFocus
            onChange={(event) => {
              setTitle(event.target.value);
              if (!slugEdited) setSlug(slugFrom(event.target.value));
              setError(null);
            }}
          />
        </div>
        <div>
          <label htmlFor="new-page-slug" className="mb-1.5 block text-sm font-medium text-fg">
            Address
          </label>
          <div className="flex items-center">
            <span className="rounded-l-lg border border-r-0 border-line-strong bg-surface-hi px-3 py-2 font-mono text-sm text-fg-muted">/</span>
            <input
              id="new-page-slug"
              className={cn(inputClass, "rounded-l-none font-mono text-sm")}
              value={slug}
              maxLength={60}
              spellCheck={false}
              onChange={(event) => {
                setSlug(event.target.value.toLowerCase().replace(/\s+/g, "-"));
                setSlugEdited(true);
                setError(null);
              }}
            />
          </div>
        </div>
        {error && (
          <p role="alert" className="text-sm font-medium text-red-600">
            {error}
          </p>
        )}
      </form>
    </Modal>
  );
}

export function Pages() {
  const content = useContent();
  const { setContent, notify, handleError } = useCms();
  const [adding, setAdding] = useState<{ copyOf?: Page } | null>(null);
  const [deleting, setDeleting] = useState<Page | null>(null);
  const [busy, setBusy] = useState(false);

  async function remove(page: Page) {
    setBusy(true);
    try {
      setContent(await api.deletePage(page.id));
      notify(`"${page.title}" deleted.`);
    } catch (err) {
      handleError(err);
    } finally {
      setBusy(false);
      setDeleting(null);
    }
  }

  return (
    <div>
      <ScreenHeader
        title="Pages"
        description="Every page of the website. Open one to change its texts, its search engine details and its sections."
        actions={
          <button type="button" className={btn.primary} onClick={() => setAdding({})}>
            <FilePlus2 /> Add page
          </button>
        }
      />

      <ul className="overflow-hidden rounded-xl border border-line bg-surface">
        {content.pages.map((page) => {
          const visibleSections = page.sections.filter((section) => section.visible).length;
          return (
            <li key={page.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line px-4 py-3 last:border-b-0">
              <AdminLink href={`/admin/pages/${page.id}`} className="min-w-0 flex-1 basis-56">
                <span className="block truncate text-[0.9375rem] font-medium text-fg hover:text-accent">{page.title}</span>
                <span className="block truncate font-mono text-xs text-fg-subtle">
                  {pagePath(page)}
                  <span className="font-sans">
                    {" "}
                    · {visibleSections} of {page.sections.length} sections shown{page.updatedAt ? ` · changed ${timeAgo(page.updatedAt)}` : ""}
                  </span>
                </span>
              </AdminLink>
              {page.published ? <Chip tone="ok">Published</Chip> : <Chip tone="warn">Draft</Chip>}
              <div className="flex items-center">
                {page.published && (
                  <a href={pagePath(page)} target="_blank" rel="noopener noreferrer" className={iconBtn} aria-label={`View "${page.title}"`} title="View on website">
                    <ExternalLink />
                  </a>
                )}
                <AdminLink href={`/admin/pages/${page.id}`} className={iconBtn} aria-label={`Edit "${page.title}"`} title="Edit">
                  <Pencil />
                </AdminLink>
                <button type="button" className={iconBtn} onClick={() => setAdding({ copyOf: page })} aria-label={`Copy "${page.title}"`} title="Copy">
                  <Copy />
                </button>
                <button
                  type="button"
                  className={cn(iconBtn, "hover:bg-red-50 hover:text-red-600")}
                  onClick={() => setDeleting(page)}
                  disabled={page.id === HOME_PAGE_ID || busy}
                  aria-label={`Delete "${page.title}"`}
                  title={page.id === HOME_PAGE_ID ? "The home page cannot be deleted" : "Delete"}
                >
                  <Trash2 />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-sm text-fg-subtle">
        The home, work and insights pages keep their addresses ({Object.values(LOCKED_SLUGS).map((slug) => `/${slug}`).join(", ")}) because projects and articles live under them.
      </p>

      {adding && <AddPage copyOf={adding.copyOf} onClose={() => setAdding(null)} />}
      {deleting && (
        <ConfirmDialog
          title="Delete this page?"
          message={
            <>
              &ldquo;{deleting.title}&rdquo; ({pagePath(deleting)}) will be removed from the website. Links to it in the menu or footer stop working. You can bring it back from Version history.
            </>
          }
          confirmLabel="Delete page"
          danger
          busy={busy}
          onCancel={() => setDeleting(null)}
          onConfirm={() => remove(deleting)}
        />
      )}
    </div>
  );
}
