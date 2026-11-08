"use client";

/* eslint-disable @next/next/no-img-element -- previews of uploads at their natural size */

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Search, Upload } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { api, type MediaWithUsage } from "./api";
import { useCms } from "./cms";
import { btn, EmptyState, inputClass, LoadingState, Modal, Spinner } from "./ui";

const ACCEPT = "image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif,image/x-icon,.ico";

/** The media library list, shared by the library screen and the picker. */
export function useMediaList() {
  const { handleError } = useCms();
  const [items, setItems] = useState<MediaWithUsage[] | null>(null);

  const load = useCallback(() => {
    api
      .media()
      .then(setItems)
      .catch((err) => {
        handleError(err);
        setItems((current) => current ?? []);
      });
  }, [handleError]);

  useEffect(load, [load]);

  return { items, setItems, load };
}

/** Upload button and drop zone. Uploads one file after another and reports each result. */
export function UploadZone({ onUploaded, compact = false }: { onUploaded: (item: MediaWithUsage) => void; compact?: boolean }) {
  const { notify, handleError } = useCms();
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  async function upload(files: FileList | File[]) {
    const list = Array.from(files);
    if (list.length === 0) return;
    setBusy(true);
    let done = 0;
    for (const file of list) {
      try {
        onUploaded(await api.upload(file));
        done += 1;
      } catch (err) {
        handleError(err);
      }
    }
    setBusy(false);
    if (done) notify(done === 1 ? "Image uploaded." : `${done} images uploaded.`);
    if (input.current) input.current.value = "";
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        setOver(false);
        void upload(event.dataTransfer.files);
      }}
      className={cn(
        "flex items-center gap-4 rounded-xl border-2 border-dashed px-5 transition-colors",
        compact ? "py-3" : "flex-col justify-center py-8 text-center",
        over ? "border-accent bg-accent/5" : "border-line-strong",
      )}
    >
      <input ref={input} type="file" accept={ACCEPT} multiple className="sr-only" onChange={(event) => event.target.files && void upload(event.target.files)} aria-label="Choose images to upload" />
      <button type="button" className={btn.primary} onClick={() => input.current?.click()} disabled={busy}>
        {busy ? <Spinner /> : <Upload />} {busy ? "Uploading…" : "Upload images"}
      </button>
      <p className="text-sm text-fg-muted">or drop them here. PNG, JPG, WebP, GIF, SVG, AVIF or ICO.</p>
    </div>
  );
}

/** Choose an image from the media library, or upload a new one. */
export function MediaPicker({ current, onPick, onClose }: { current: string; onPick: (url: string) => void; onClose: () => void }) {
  const { items, setItems } = useMediaList();
  const [query, setQuery] = useState("");
  const term = query.trim().toLowerCase();
  const shown = (items ?? []).filter((item) => !term || item.name.toLowerCase().includes(term) || item.file.includes(term));

  return (
    <Modal title="Choose an image" onClose={onClose} wide>
      <div className="space-y-4">
        <UploadZone compact onUploaded={(item) => setItems((list) => [item, ...(list ?? [])])} />
        {items && items.length > 6 && (
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" />
            <input className={cn(inputClass, "pl-9")} type="search" placeholder="Search images" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search images" />
          </div>
        )}
        {!items ? (
          <LoadingState label="Loading images…" />
        ) : items.length === 0 ? (
          <EmptyState>No images yet. Upload one above. Images already in the site&apos;s /images folder can be used by typing their address.</EmptyState>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {shown.map((item) => {
              const selected = item.url === current;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onPick(item.url)}
                    aria-pressed={selected}
                    className={cn("group block w-full overflow-hidden rounded-lg border text-left transition-colors", selected ? "border-accent ring-2 ring-accent/30" : "border-line hover:border-line-strong")}
                  >
                    <span className="relative flex aspect-[4/3] items-center justify-center bg-[repeating-conic-gradient(#eef2fb_0%_25%,#fff_0%_50%)] bg-[length:16px_16px]">
                      <img src={item.url} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
                      {selected && (
                        <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </span>
                    <span className="block truncate px-2.5 py-2 text-xs text-fg-muted">{item.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Modal>
  );
}
