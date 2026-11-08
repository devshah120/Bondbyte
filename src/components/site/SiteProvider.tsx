"use client";

import { createContext, useContext } from "react";
import type { Brand, Header } from "@/lib/cms/types";

/** The small slice of content the site chrome (header, menus, CTA) needs on the client. */
export interface SiteChrome {
  name: string;
  email: string;
  city: string;
  region: string;
  brand: Brand;
  header: Header;
}

const SiteContext = createContext<SiteChrome | null>(null);

export function SiteProvider({ value, children }: { value: SiteChrome; children: React.ReactNode }) {
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite(): SiteChrome {
  const value = useContext(SiteContext);
  if (!value) throw new Error("useSite must be used inside <SiteProvider>.");
  return value;
}
