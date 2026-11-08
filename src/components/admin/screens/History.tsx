"use client";

import { useEffect, useState } from "react";
import { History as HistoryIcon, RotateCcw } from "lucide-react";
import type { HistoryEntry } from "@/lib/cms/types";
import { cn } from "@/lib/utils/cn";
import { api } from "../api";
import { useCms, useContent } from "../cms";
import { btn, Chip, ConfirmDialog, dateTime, EmptyState, LoadingState, ScreenHeader, timeAgo } from "../ui";

/** Every save is kept as a version (the latest 150); any of them can be restored. */
export function HistoryScreen() {
  const content = useContent();
  const { setContent, notify, handleError, confirmLeave } = useCms();
  const [entries, setEntries] = useState<HistoryEntry[] | null>(null);
  const [restoring, setRestoring] = useState<HistoryEntry | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .history()
      .then(setEntries)
      .catch((err) => {
        handleError(err);
        setEntries([]);
      });
  }, [handleError, content.updatedAt]);

  async function restore(entry: HistoryEntry) {
    setBusy(true);
    try {
      setContent(await api.restore(entry.id));
      notify(`Restored the version from ${dateTime(entry.savedAt)}.`);
    } catch (err) {
      handleError(err);
    } finally {
      setBusy(false);
      setRestoring(null);
    }
  }

  return (
    <div>
      <ScreenHeader
        title="Version history"
        description="Every save is kept as a version (the latest 150). Restoring one replaces the content of the whole website; the current version is kept too, so a restore can be undone. Inquiries and uploaded images are not affected."
      />

      {!entries ? (
        <LoadingState label="Loading versions…" />
      ) : entries.length === 0 ? (
        <EmptyState icon={HistoryIcon}>No versions yet.</EmptyState>
      ) : (
        <ol className="overflow-hidden rounded-xl border border-line bg-surface">
          {entries.map((entry, index) => (
            <li key={entry.id} className={cn("flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line px-4 py-3 last:border-b-0", index === 0 && "bg-accent/[0.03]")}>
              <div className="min-w-0 flex-1 basis-64">
                <p className="text-[0.9375rem] text-fg">{entry.summary}</p>
                <p className="text-xs text-fg-subtle">
                  <span title={dateTime(entry.savedAt)}>{timeAgo(entry.savedAt)}</span> · {dateTime(entry.savedAt)}
                  {entry.restoredFrom && <> · restored from {dateTime(entry.restoredFrom)}</>}
                </p>
              </div>
              {index === 0 ? (
                <Chip tone="ok">Current</Chip>
              ) : (
                <button type="button" className={cn(btn.outline, btn.sm)} onClick={() => confirmLeave() && setRestoring(entry)} disabled={busy}>
                  <RotateCcw /> Restore
                </button>
              )}
            </li>
          ))}
        </ol>
      )}

      {restoring && (
        <ConfirmDialog
          title="Restore this version?"
          message={
            <>
              The whole website goes back to how it was on <strong>{dateTime(restoring.savedAt)}</strong> ({restoring.summary}). The current version stays in the history.
            </>
          }
          confirmLabel="Restore"
          busy={busy}
          onCancel={() => setRestoring(null)}
          onConfirm={() => restore(restoring)}
        />
      )}
    </div>
  );
}
