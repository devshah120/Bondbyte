"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Archive, ArchiveRestore, Copy, Download, Inbox, Mail, MailOpen, Reply, Search, Trash2 } from "lucide-react";
import type { Inquiry, InquiryStatus } from "@/lib/cms/types";
import { cn } from "@/lib/utils/cn";
import { useCms } from "../cms";
import { btn, Chip, dateTime, EmptyState, iconBtn, inputClass, LoadingState, Modal, ScreenHeader, timeAgo } from "../ui";

const STATUS_LABELS: Record<InquiryStatus, string> = { new: "New", read: "Read", archived: "Archived" };
type Filter = "inbox" | "new" | "archived";

// A text cell for the CSV file. Cells starting with = + - @ are prefixed so spreadsheets never run them.
const csvCell = (value: unknown) => {
  let text = String(value ?? "");
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
};

function downloadCsv(items: Inquiry[], name: string) {
  const head = ["Received", "Status", "Name", "Email", "Company", "Project type", "Budget", "Message"];
  const rows = items.map((item) => [new Date(item.createdAt).toLocaleString("en-GB"), STATUS_LABELS[item.status], item.name, item.email, item.company, item.projectType, item.budget, item.message]);
  const csv = [head, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
  // The byte order mark makes Excel read the file as UTF-8.
  const url = URL.createObjectURL(new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function InquiryDetails({ item, onClose }: { item: Inquiry; onClose: () => void }) {
  const { content, updateInquiry, removeInquiry, notify, handleError } = useCms();
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const subject = `Re: your enquiry${item.projectType ? ` – ${item.projectType}` : ""}`;
  const quoted = [`Hello ${item.name},`, "", "", "", `> ${item.message}`.replace(/\n/g, "\n> ")].join("\n");
  const replyLink = `mailto:${item.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(quoted)}`;

  async function setStatus(status: InquiryStatus, message: string) {
    setBusy(true);
    try {
      await updateInquiry(item.id, status);
      notify(message);
      onClose();
    } catch (err) {
      handleError(err);
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    try {
      await removeInquiry(item.id);
      notify("Inquiry deleted.");
      onClose();
    } catch (err) {
      handleError(err);
      setBusy(false);
    }
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(item.email);
      notify("Email address copied.");
    } catch {
      notify("Could not copy. Select the address and copy it by hand.", "error");
    }
  }

  const facts: [string, React.ReactNode][] = [
    [
      "Email",
      <span key="email" className="inline-flex items-center gap-1">
        <a href={`mailto:${item.email}`} className="text-accent hover:underline">
          {item.email}
        </a>
        <button type="button" className={cn(iconBtn, "h-7 w-7")} onClick={copyEmail} aria-label="Copy email address" title="Copy">
          <Copy />
        </button>
      </span>,
    ],
    ["Company", item.company],
    ["Project type", item.projectType],
    ["Budget", item.budget],
  ];

  return (
    <Modal
      title={item.name}
      onClose={onClose}
      footer={
        <div className="flex w-full flex-wrap items-center justify-between gap-2">
          <button type="button" className={btn.dangerText} onClick={() => setConfirming(true)} disabled={busy}>
            <Trash2 /> Delete
          </button>
          <div className="flex flex-wrap gap-2">
            {item.status === "archived" ? (
              <button type="button" className={btn.outline} onClick={() => setStatus("read", "Moved back to the inbox.")} disabled={busy}>
                <ArchiveRestore /> Move to inbox
              </button>
            ) : (
              <>
                <button type="button" className={btn.outline} onClick={() => setStatus("new", "Marked as new.")} disabled={busy}>
                  <Mail /> Mark as new
                </button>
                <button type="button" className={btn.outline} onClick={() => setStatus("archived", "Inquiry archived.")} disabled={busy}>
                  <Archive /> Archive
                </button>
              </>
            )}
            <a className={btn.primary} href={replyLink}>
              <Reply /> Reply by email
            </a>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 font-semibold text-accent-dim">{item.name.charAt(0).toUpperCase()}</span>
          <p className="flex-1 text-sm text-fg-muted">Received {dateTime(item.createdAt)}</p>
          <Chip tone={item.status === "new" ? "new" : "muted"}>{STATUS_LABELS[item.status]}</Chip>
        </div>
        <dl className="grid gap-x-6 gap-y-3 rounded-lg bg-bg p-4 sm:grid-cols-2">
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs font-medium uppercase tracking-wide text-fg-subtle">{label}</dt>
              <dd className="mt-0.5 break-words text-sm text-fg">{value || <span className="text-fg-subtle">Not given</span>}</dd>
            </div>
          ))}
        </dl>
        <div>
          <p className="mb-1.5 text-sm font-medium text-fg">Message</p>
          <p className="whitespace-pre-wrap break-words rounded-lg border border-line p-4 text-[0.9375rem] leading-relaxed text-fg">{item.message}</p>
        </div>
        {confirming && (
          <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800">Delete this inquiry for good?</p>
            <div className="mt-3 flex gap-2">
              <button type="button" className={cn(btn.outline, btn.sm)} onClick={() => setConfirming(false)} disabled={busy}>
                Keep it
              </button>
              <button type="button" className={cn(btn.danger, btn.sm)} onClick={remove} disabled={busy}>
                Delete
              </button>
            </div>
          </div>
        )}
        {content && <p className="text-xs text-fg-subtle">Replies are sent from your own email program, not from {content.settings.name}&apos;s server.</p>}
      </div>
    </Modal>
  );
}

export function Inquiries() {
  const { content, inquiries, loadInquiries, updateInquiry, handleError } = useCms();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("inbox");
  const [selected, setSelected] = useState<string | null>(() => searchParams?.get("open") ?? null);

  // Refreshed on every visit.
  useEffect(() => {
    loadInquiries().catch(handleError);
  }, [loadInquiries, handleError]);

  const list = inquiries ?? [];
  const counts: Record<Filter, number> = {
    inbox: list.filter((item) => item.status !== "archived").length,
    new: list.filter((item) => item.status === "new").length,
    archived: list.filter((item) => item.status === "archived").length,
  };
  const filters: { key: Filter; label: string }[] = [
    { key: "inbox", label: "Inbox" },
    { key: "new", label: "New" },
    { key: "archived", label: "Archived" },
  ];

  const term = query.trim().toLowerCase();
  const shown = list.filter((item) => {
    if (filter === "inbox" && item.status === "archived") return false;
    if (filter === "new" && item.status !== "new") return false;
    if (filter === "archived" && item.status !== "archived") return false;
    if (!term) return true;
    return [item.name, item.email, item.company, item.projectType, item.message].join(" ").toLowerCase().includes(term);
  });
  const current = selected ? list.find((item) => item.id === selected) : undefined;

  // Opening a new inquiry marks it as read.
  function open(item: Inquiry) {
    setSelected(item.id);
    if (item.status === "new") updateInquiry(item.id, "read").catch(() => {});
  }

  return (
    <div>
      <ScreenHeader
        title="Inquiries"
        description="Messages sent with the contact form on the website, newest first. Open one to read it and reply by email."
        actions={
          list.length > 0 && (
            <button type="button" className={cn(btn.outline, btn.sm)} onClick={() => downloadCsv(shown, content?.settings.name ?? "site")} disabled={shown.length === 0}>
              <Download /> Download CSV
            </button>
          )
        }
      />

      {!inquiries ? (
        <LoadingState label="Loading inquiries…" />
      ) : list.length === 0 ? (
        <EmptyState icon={Inbox}>No inquiries yet. Messages sent with the contact form on the website appear here.</EmptyState>
      ) : (
        <>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" />
              <input className={cn(inputClass, "pl-9")} type="search" placeholder="Search name, email, message…" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search inquiries" />
            </div>
            <div className="inline-flex rounded-lg border border-line-strong bg-surface p-1" role="radiogroup" aria-label="Show">
              {filters.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  role="radio"
                  aria-checked={filter === item.key}
                  onClick={() => setFilter(item.key)}
                  className={cn("rounded-md px-3 py-1.5 text-sm transition-colors", filter === item.key ? "bg-[#0c1832] text-white" : "text-fg-muted hover:text-fg")}
                >
                  {item.label} <span className="ml-1 tabular-nums opacity-70">{counts[item.key]}</span>
                </button>
              ))}
            </div>
          </div>

          {shown.length === 0 ? (
            <EmptyState>{term ? "No inquiries match your search." : filter === "new" ? "No new inquiries. You are all caught up." : "Nothing here."}</EmptyState>
          ) : (
            <ul className="overflow-hidden rounded-xl border border-line bg-surface">
              {shown.map((item) => (
                <li key={item.id} className="border-b border-line last:border-b-0">
                  <button type="button" onClick={() => open(item)} className={cn("flex w-full items-start gap-3 px-4 py-4 text-left transition-colors hover:bg-bg", item.status === "new" && "bg-accent/[0.03]")}>
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent-dim">{item.name.charAt(0).toUpperCase()}</span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-baseline gap-x-2">
                        <span className={cn("text-[0.9375rem] text-fg", item.status === "new" && "font-semibold")}>{item.name}</span>
                        {item.projectType && <span className="text-sm text-fg-muted">{item.projectType}</span>}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-fg-subtle">{[item.email, item.company, item.budget].filter(Boolean).join(" · ")}</span>
                      <span className="mt-1.5 line-clamp-2 block text-sm text-fg-muted">{item.message}</span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1.5">
                      <span className="text-xs text-fg-subtle" title={dateTime(item.createdAt)}>
                        {timeAgo(item.createdAt)}
                      </span>
                      {item.status === "new" ? <Chip tone="new">New</Chip> : item.status === "archived" ? <Chip>Archived</Chip> : <MailOpen className="h-4 w-4 text-fg-subtle" aria-label="Read" />}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {current && <InquiryDetails key={current.id} item={current} onClose={() => setSelected(null)} />}
    </div>
  );
}
