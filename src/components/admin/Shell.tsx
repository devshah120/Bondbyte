"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ExternalLink, LogOut, Menu, X } from "lucide-react";
import { COLLECTIONS } from "@/lib/cms/schema";
import type { CollectionKey, ObjectKey } from "@/lib/cms/types";
import { cn } from "@/lib/utils/cn";
import { AdminLink, useCms } from "./cms";
import { NAV, isActive } from "./nav";
import { btn, iconBtn, LoadingState } from "./ui";
import { Overview } from "./screens/Overview";
import { Inquiries } from "./screens/Inquiries";
import { ObjectScreen } from "./screens/ObjectScreen";
import { CollectionList } from "./screens/CollectionList";
import { ItemEditor } from "./screens/ItemEditor";
import { Pages } from "./screens/Pages";
import { PageEditor } from "./screens/PageEditor";
import { MediaLibrary } from "./screens/MediaLibrary";
import { HistoryScreen } from "./screens/History";
import { Account } from "./screens/Account";

const OBJECT_SCREENS = new Set<ObjectKey>(["settings", "header", "footer", "brand"]);

function NavList({ path }: { path: string }) {
  const { content, inquiries } = useCms();
  return (
    <nav aria-label="Admin sections" className="space-y-5">
      {NAV.map((group, index) => (
        <div key={group.title ?? index}>
          {group.title && <p className="mb-1.5 px-3 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-white/40">{group.title}</p>}
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = isActive(item, path);
              const alert = item.alert?.(inquiries) ?? 0;
              return (
                <li key={item.href}>
                  <AdminLink
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[0.875rem] transition-colors",
                      active ? "bg-white/10 font-medium text-white" : "text-white/70 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    <item.Icon className="h-4 w-4 shrink-0" aria-hidden />
                    <span className="flex-1 truncate">{item.label}</span>
                    {alert > 0 ? (
                      <span className="rounded-full bg-accent px-1.5 text-[0.6875rem] font-semibold leading-5 text-white" aria-label={`${alert} new`}>
                        {alert}
                      </span>
                    ) : (
                      item.count && content && <span className="text-[0.75rem] tabular-nums text-white/40">{item.count(content)}</span>
                    )}
                  </AdminLink>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function NotFound() {
  return (
    <div className="py-16 text-center">
      <p className="text-fg-muted">This page of the admin panel does not exist.</p>
      <AdminLink href="/admin" className={`${btn.primary} mt-5`}>
        Go to the overview
      </AdminLink>
    </div>
  );
}

/** Picks the screen for an /admin address. */
function Screen({ path }: { path: string }) {
  const [screen, id, sub] = path.replace(/^\/admin\/?/, "").split("/").filter(Boolean);
  switch (screen) {
    case undefined:
      return <Overview />;
    case "inquiries":
      return <Inquiries />;
    case "pages":
      return id ? <PageEditor key={id} pageId={id} /> : <Pages />;
    case "c": {
      if (!id || !Object.hasOwn(COLLECTIONS, id)) return <NotFound />;
      const key = id as CollectionKey;
      return sub ? <ItemEditor key={`${key}/${sub}`} collectionKey={key} itemId={sub} /> : <CollectionList key={key} collectionKey={key} />;
    }
    case "media":
      return <MediaLibrary />;
    case "history":
      return <HistoryScreen />;
    case "account":
      return <Account />;
    default:
      if (OBJECT_SCREENS.has(screen as ObjectKey)) return <ObjectScreen key={screen} objectKey={screen as ObjectKey} />;
      return <NotFound />;
  }
}

export function Shell() {
  const { content, loadError, reload, signOut, notify, confirmLeave } = useCms();
  const path = usePathname() ?? "/admin";
  const [drawer, setDrawer] = useState(false);
  const [drawerPath, setDrawerPath] = useState(path);
  // The phone menu closes when the address changes.
  if (drawerPath !== path) {
    setDrawerPath(path);
    if (drawer) setDrawer(false);
  }

  const companyName = content?.settings.name;
  useEffect(() => {
    document.title = companyName ? `Admin | ${companyName}` : "Admin";
  }, [companyName]);

  function handleSignOut() {
    if (!confirmLeave()) return;
    signOut();
    notify("You have been signed out.");
  }

  let main: React.ReactNode;
  if (loadError) {
    main = (
      <div className="py-16 text-center">
        <p className="text-fg-muted">{loadError}</p>
        <button type="button" className={`${btn.primary} mt-5`} onClick={() => void reload()}>
          Try again
        </button>
      </div>
    );
  } else if (!content) {
    main = <LoadingState label="Loading content…" />;
  } else {
    main = <Screen path={path} />;
  }

  const sidebar = (
    <>
      <div className="flex items-center justify-between gap-3 px-3 pb-5">
        <AdminLink href="/admin" className="text-[1.0625rem] font-semibold tracking-tight text-white">
          {content?.brand.wordFirst ?? "Admin"}
          <span className="text-accent-hi">{content?.brand.wordSecond}</span>
          <span className="ml-2 rounded bg-white/10 px-1.5 py-0.5 align-middle text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-white/70">Admin</span>
        </AdminLink>
      </div>
      <NavList path={path} />
      <div className="mt-6 space-y-1 border-t border-white/10 pt-4">
        <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[0.875rem] text-white/70 hover:bg-white/5 hover:text-white">
          <ExternalLink className="h-4 w-4" /> View website
        </a>
        <button type="button" onClick={handleSignOut} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[0.875rem] text-white/70 hover:bg-white/5 hover:text-white">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-svh bg-bg">
      {/* Phone and tablet top bar */}
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/10 bg-[#0c1832] px-4 py-3 lg:hidden">
        <button type="button" className={cn(iconBtn, "text-white hover:bg-white/10 hover:text-white")} onClick={() => setDrawer(true)} aria-label="Open menu">
          <Menu />
        </button>
        <span className="font-semibold text-white">
          {content?.brand.wordFirst}
          <span className="text-accent-hi">{content?.brand.wordSecond}</span> <span className="text-white/60">Admin</span>
        </span>
      </header>

      <aside className="fixed inset-y-0 left-0 hidden w-64 overflow-y-auto bg-[#0c1832] px-3 py-5 lg:block">{sidebar}</aside>

      {drawer && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin sections">
          <button type="button" className="absolute inset-0 bg-black/40" onClick={() => setDrawer(false)} aria-label="Close menu" />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] overflow-y-auto bg-[#0c1832] px-3 py-5">
            <button type="button" className={cn(iconBtn, "absolute right-3 top-4 text-white hover:bg-white/10 hover:text-white")} onClick={() => setDrawer(false)} aria-label="Close menu">
              <X />
            </button>
            {sidebar}
          </div>
        </div>
      )}

      <main className="px-4 py-6 sm:px-8 sm:py-8 lg:ml-64">
        <div className="mx-auto max-w-5xl">{main}</div>
      </main>
    </div>
  );
}
