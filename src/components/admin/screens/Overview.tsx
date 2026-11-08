"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Briefcase, Files, Inbox, Newspaper, Plus, Settings } from "lucide-react";
import type { HistoryEntry } from "@/lib/cms/types";
import { api } from "../api";
import { AdminLink, useCms, useContent } from "../cms";
import { btn, cardClass, Chip, ScreenHeader, timeAgo } from "../ui";

export function Overview() {
  const content = useContent();
  const { inquiries, handleError } = useCms();
  const [recent, setRecent] = useState<HistoryEntry[] | null>(null);

  useEffect(() => {
    api
      .history()
      .then((list) => setRecent(list.slice(0, 6)))
      .catch((err) => {
        handleError(err);
        setRecent([]);
      });
  }, [handleError, content.updatedAt]);

  const newCount = (inquiries ?? []).filter((item) => item.status === "new").length;
  const latest = (inquiries ?? []).filter((item) => item.status !== "archived").slice(0, 5);
  const stats = [
    { label: "New inquiries", value: newCount, href: "/admin/inquiries", Icon: Inbox, highlight: newCount > 0 },
    { label: "Published pages", value: content.pages.filter((page) => page.published).length, href: "/admin/pages", Icon: Files },
    { label: "Live projects", value: content.projects.filter((project) => project.published).length, href: "/admin/c/projects", Icon: Briefcase },
    { label: "Live articles", value: content.insights.filter((insight) => insight.published).length, href: "/admin/c/insights", Icon: Newspaper },
  ];

  return (
    <div>
      <ScreenHeader title="Overview" description={`Everything on ${content.settings.name}, saved straight to the website.`} />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <AdminLink key={stat.label} href={stat.href} className={`${cardClass} group transition-colors hover:border-line-strong`}>
            <div className="flex items-center justify-between">
              <stat.Icon className={stat.highlight ? "h-5 w-5 text-accent" : "h-5 w-5 text-fg-subtle"} />
              <ArrowRight className="h-4 w-4 text-fg-subtle opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <p className="mt-4 text-3xl font-semibold tabular-nums tracking-tight text-fg">{stat.value}</p>
            <p className="mt-1 text-sm text-fg-muted">{stat.label}</p>
          </AdminLink>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className={cardClass}>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-fg">Latest inquiries</h2>
            <AdminLink href="/admin/inquiries" className="text-sm text-accent hover:underline">
              All inquiries
            </AdminLink>
          </div>
          {!inquiries ? (
            <p className="mt-4 text-sm text-fg-muted">Loading…</p>
          ) : latest.length === 0 ? (
            <p className="mt-4 text-sm text-fg-muted">No inquiries yet. Messages from the contact form appear here.</p>
          ) : (
            <ul className="mt-3 divide-y divide-line">
              {latest.map((item) => (
                <li key={item.id}>
                  <AdminLink href={`/admin/inquiries?open=${item.id}`} className="flex items-center gap-3 py-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent-dim">{item.name.charAt(0).toUpperCase()}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-fg">{item.name}</span>
                      <span className="block truncate text-xs text-fg-muted">{item.projectType || item.email}</span>
                    </span>
                    <span className="shrink-0 text-xs text-fg-subtle">{timeAgo(item.createdAt)}</span>
                    {item.status === "new" && <Chip tone="new">New</Chip>}
                  </AdminLink>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={cardClass}>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-fg">Recent changes</h2>
            <AdminLink href="/admin/history" className="text-sm text-accent hover:underline">
              Version history
            </AdminLink>
          </div>
          {!recent ? (
            <p className="mt-4 text-sm text-fg-muted">Loading…</p>
          ) : (
            <ul className="mt-3 divide-y divide-line">
              {recent.map((entry) => (
                <li key={entry.id} className="flex items-start justify-between gap-3 py-3 text-sm">
                  <span className="text-fg">{entry.summary}</span>
                  <span className="shrink-0 text-xs text-fg-subtle">{timeAgo(entry.savedAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="mt-6">
        <h2 className="mb-3 font-semibold text-fg">Quick actions</h2>
        <div className="flex flex-wrap gap-2">
          <AdminLink href="/admin/c/projects/new" className={btn.outline}>
            <Plus /> Add a project
          </AdminLink>
          <AdminLink href="/admin/c/insights/new" className={btn.outline}>
            <Plus /> Write an article
          </AdminLink>
          <AdminLink href="/admin/pages" className={btn.outline}>
            <Files /> Edit pages
          </AdminLink>
          <AdminLink href="/admin/settings" className={btn.outline}>
            <Settings /> General settings
          </AdminLink>
        </div>
      </section>
    </div>
  );
}
