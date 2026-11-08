"use client";

/* eslint-disable @next/next/no-img-element -- previews of uploads at their natural size */

import { useState } from "react";
import { Copy, Images, Search, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { api, type MediaWithUsage } from "../api";
import { useCms } from "../cms";
import { useMediaList, UploadZone } from "../media";
import { btn, dateTime, EmptyState, fileSize, inputClass, LoadingState, Modal, ScreenHeader, Spinner } from "../ui";

function MediaDetails({ item, onClose, onChange, onRemoved }: { item: MediaWithUsage; onClose: () => void; onChange: (item: MediaWithUsage) => void; onRemoved: (id: string) => void }) {
  const { notify, handleError } = useCms();
  const [name, setName] = useState(item.name);
  const [busy, setBusy] = useState(false);

  async function rename() {
    if (!name.trim() || name === item.name) return;
    setBusy(true);
    try {
      onChange(await api.renameMedia(item.id, name.trim()));
      notify("Name saved.");
    } catch (err) {
      handleError(err);
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    try {
      await api.deleteMedia(item.id);
      onRemoved(item.id);
      notify("Image deleted.");
      onClose();
    } catch (err) {
      handleError(err);
      setBusy(false);
    }
  }

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(item.url);
      notify("Address copied.");
    } catch {
      notify("Could not copy. Select the address and copy it by hand.", "error");
    }
  }

  const inUse = item.usedIn.length > 0;

  return (
    <Modal
      title={item.name}
      onClose={onClose}
      wide
      footer={
        <div className="flex w-full flex-wrap items-center justify-between gap-2">
          <button type="button" className={btn.dangerText} onClick={remove} disabled={busy || inUse} title={inUse ? "Choose another image where this one is used first" : undefined}>
            <Trash2 /> Delete
          </button>
          <button type="button" className={btn.outline} onClick={onClose}>
            Close
          </button>
        </div>
      }
    >
      <div className="grid gap-6 md:grid-cols-[1.3fr_1fr]">
        <div className="flex min-h-48 items-center justify-center rounded-lg border border-line bg-[repeating-conic-gradient(#eef2fb_0%_25%,#fff_0%_50%)] bg-[length:16px_16px] p-4">
          <img src={item.url} alt="" className="max-h-80 max-w-full object-contain" />
        </div>
        <div className="space-y-4 text-sm">
          <div>
            <label htmlFor="media-name" className="mb-1.5 block font-medium text-fg">
              Name
            </label>
            <div className="flex gap-2">
              <input id="media-name" className={inputClass} value={name} maxLength={120} onChange={(event) => setName(event.target.value)} onKeyDown={(event) => event.key === "Enter" && rename()} />
              <button type="button" className={btn.outline} onClick={rename} disabled={busy || !name.trim() || name === item.name}>
                {busy ? <Spinner /> : "Save"}
              </button>
            </div>
          </div>
          <div>
            <p className="mb-1.5 font-medium text-fg">Address</p>
            <div className="flex items-center gap-2">
              <code className="min-w-0 flex-1 truncate rounded-md bg-bg px-2 py-1.5 text-xs">{item.url}</code>
              <button type="button" className={cn(btn.ghost, btn.sm)} onClick={copyUrl}>
                <Copy /> Copy
              </button>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-3 text-fg-muted">
            <div>
              <dt className="text-xs uppercase tracking-wide text-fg-subtle">Size</dt>
              <dd>{fileSize(item.size)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-fg-subtle">Dimensions</dt>
              <dd>{item.width && item.height ? `${item.width} × ${item.height}` : "—"}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-xs uppercase tracking-wide text-fg-subtle">Uploaded</dt>
              <dd>{dateTime(item.uploadedAt)}</dd>
            </div>
          </dl>
          <div>
            <p className="mb-1.5 font-medium text-fg">Used in</p>
            {inUse ? (
              <ul className="list-disc space-y-1 pl-5 text-fg-muted">
                {item.usedIn.map((place) => (
                  <li key={place}>{place}</li>
                ))}
              </ul>
            ) : (
              <p className="text-fg-subtle">Not used anywhere yet.</p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export function MediaLibrary() {
  const { items, setItems, load } = useMediaList();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const term = query.trim().toLowerCase();
  const shown = (items ?? []).filter((item) => !term || item.name.toLowerCase().includes(term) || item.file.includes(term));
  const current = selected ? items?.find((item) => item.id === selected) : undefined;

  return (
    <div>
      <ScreenHeader title="Media library" description="Images uploaded for the website. Images that are in use cannot be deleted." />
      <UploadZone onUploaded={(item) => setItems((list) => [item, ...(list ?? [])])} />

      {items && items.length > 0 && (
        <div className="relative mt-5">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" />
          <input className={cn(inputClass, "pl-9")} type="search" placeholder="Search images" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search images" />
        </div>
      )}

      <div className="mt-5">
        {!items ? (
          <LoadingState label="Loading images…" />
        ) : items.length === 0 ? (
          <EmptyState icon={Images}>No images uploaded yet. The images that came with the site live in its /images folder and keep working.</EmptyState>
        ) : shown.length === 0 ? (
          <EmptyState>No images match your search.</EmptyState>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {shown.map((item) => (
              <li key={item.id}>
                <button type="button" onClick={() => setSelected(item.id)} className="group block w-full overflow-hidden rounded-xl border border-line bg-surface text-left transition-colors hover:border-line-strong">
                  <span className="flex aspect-[4/3] items-center justify-center bg-[repeating-conic-gradient(#eef2fb_0%_25%,#fff_0%_50%)] bg-[length:16px_16px]">
                    <img src={item.url} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
                  </span>
                  <span className="block px-3 py-2">
                    <span className="block truncate text-sm text-fg">{item.name}</span>
                    <span className="block text-xs text-fg-subtle">
                      {fileSize(item.size)} · {item.usedIn.length > 0 ? `Used in ${item.usedIn.length}` : "Not used"}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {current && (
        <MediaDetails
          key={current.id}
          item={current}
          onClose={() => {
            setSelected(null);
            void load();
          }}
          onChange={(next) => setItems((list) => list?.map((entry) => (entry.id === next.id ? next : entry)) ?? null)}
          onRemoved={(id) => setItems((list) => list?.filter((entry) => entry.id !== id) ?? null)}
        />
      )}
    </div>
  );
}
