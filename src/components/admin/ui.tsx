"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/* ── Shared class names ─────────────────────────────────────────────────── */

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0";

export const btn = {
  primary: cn(btnBase, "bg-accent text-white hover:bg-accent-dim"),
  outline: cn(btnBase, "border border-line-strong bg-surface text-fg hover:bg-surface-hi"),
  ghost: cn(btnBase, "text-fg-muted hover:bg-surface-hi hover:text-fg"),
  danger: cn(btnBase, "bg-red-600 text-white hover:bg-red-700"),
  dangerText: cn(btnBase, "text-red-600 hover:bg-red-50"),
  sm: "px-3 py-1.5 text-[0.8125rem]",
};

export const iconBtn =
  "inline-flex h-8 w-8 items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-surface-hi hover:text-fg disabled:cursor-not-allowed disabled:opacity-30 [&_svg]:h-4 [&_svg]:w-4";

export const inputClass =
  "w-full rounded-lg border border-line-strong bg-surface px-3 py-2 text-[0.9375rem] text-fg placeholder:text-fg-subtle focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:bg-surface-hi disabled:text-fg-muted aria-[invalid=true]:border-red-500";

export const cardClass = "rounded-xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(12,24,50,0.04)] sm:p-6";

/* ── Pieces ─────────────────────────────────────────────────────────────── */

export function Spinner({ className }: { className?: string }) {
  return <span aria-hidden className={cn("inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent", className)} />;
}

export function LoadingState({ label }: { label: string }) {
  return (
    <div role="status" className="flex items-center gap-3 py-16 text-fg-muted">
      <Spinner /> {label}
    </div>
  );
}

export function EmptyState({ icon: Icon, children }: { icon?: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line-strong px-6 py-14 text-center text-fg-muted">
      {Icon && <Icon className="mb-3 h-8 w-8 text-fg-subtle" />}
      <div className="max-w-md text-[0.9375rem]">{children}</div>
    </div>
  );
}

export function ScreenHeader({
  title,
  description,
  actions,
  back,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  back?: React.ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {back && <div className="mb-2">{back}</div>}
        <h1 className="text-2xl font-semibold tracking-tight text-fg">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-[0.9375rem] text-fg-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function Switch({ checked, onChange, label, disabled, id }: { checked: boolean; onChange: (value: boolean) => void; label: React.ReactNode; disabled?: boolean; id?: string }) {
  return (
    <label className={cn("inline-flex cursor-pointer items-center gap-3 text-[0.9375rem] text-fg", disabled && "cursor-not-allowed opacity-60")}>
      <input id={id} type="checkbox" role="switch" className="peer sr-only" checked={checked} disabled={disabled} onChange={(event) => onChange(event.target.checked)} />
      <span
        aria-hidden
        className="relative h-5 w-9 shrink-0 rounded-full bg-line-strong transition-colors peer-checked:bg-accent peer-focus-visible:ring-2 peer-focus-visible:ring-accent/40 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-4"
      />
      <span>{label}</span>
    </label>
  );
}

export function Chip({ tone = "muted", children }: { tone?: "new" | "muted" | "ok" | "warn"; children: React.ReactNode }) {
  const tones = {
    new: "bg-accent/10 text-accent-dim",
    muted: "bg-surface-hi text-fg-muted",
    ok: "bg-emerald-50 text-emerald-700",
    warn: "bg-amber-50 text-amber-700",
  };
  return <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", tones[tone])}>{children}</span>;
}

/** Accessible modal built on <dialog>: focus stays inside and Escape closes it. */
export function Modal({ title, onClose, children, footer, wide = false }: { title: React.ReactNode; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    dialog.showModal();
    const handleCancel = (event: Event) => {
      event.preventDefault();
      onCloseRef.current();
    };
    dialog.addEventListener("cancel", handleCancel);
    return () => {
      dialog.removeEventListener("cancel", handleCancel);
      if (dialog.open) dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={ref}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      className={cn(
        "m-auto max-h-[90svh] w-[calc(100%-2rem)] overflow-hidden rounded-2xl border border-line bg-surface p-0 text-fg shadow-2xl backdrop:bg-[#0c1832]/50",
        wide ? "max-w-4xl" : "max-w-xl",
      )}
    >
      <div className="flex max-h-[90svh] flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          <h2 className="truncate text-lg font-semibold tracking-tight">{title}</h2>
          <button type="button" className={iconBtn} onClick={onClose} aria-label="Close">
            <X />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-5">{children}</div>
        {footer && <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line px-5 py-4">{footer}</div>}
      </div>
    </dialog>
  );
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  danger = false,
  busy = false,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: React.ReactNode;
  confirmLabel: string;
  danger?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button type="button" className={btn.outline} onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button type="button" className={danger ? btn.danger : btn.primary} onClick={onConfirm} disabled={busy}>
            {busy && <Spinner />} {confirmLabel}
          </button>
        </>
      }
    >
      <div className="text-[0.9375rem] text-fg-muted">{message}</div>
    </Modal>
  );
}

/** Sticky bar shown while a form has unsaved changes. */
export function SaveBar({ dirty, saving, onSave, onDiscard, label = "Save changes" }: { dirty: boolean; saving: boolean; onSave: () => void; onDiscard: () => void; label?: string }) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-20 -mx-4 mt-6 flex items-center justify-between gap-3 border-t border-line bg-surface/95 px-4 py-3 backdrop-blur transition-opacity sm:-mx-8 sm:px-8",
        dirty || saving ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden={!dirty && !saving}
    >
      <p className="text-sm text-fg-muted">{saving ? "Saving…" : "You have unsaved changes."}</p>
      <div className="flex gap-2">
        <button type="button" className={btn.outline} onClick={onDiscard} disabled={saving}>
          Discard
        </button>
        <button type="button" className={btn.primary} onClick={onSave} disabled={saving}>
          {saving && <Spinner />} {label}
        </button>
      </div>
    </div>
  );
}

/* ── Formatting ─────────────────────────────────────────────────────────── */

export function dateTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function timeAgo(iso: string) {
  const seconds = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} d ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function fileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
