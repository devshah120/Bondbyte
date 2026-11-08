import {
  Briefcase,
  Building2,
  FileText,
  Files,
  History,
  Images,
  Inbox,
  KeyRound,
  LayoutDashboard,
  Newspaper,
  PanelBottom,
  PanelTop,
  Settings,
  Stamp,
  Tags,
  type LucideIcon,
} from "lucide-react";
import { COLLECTIONS } from "@/lib/cms/schema";
import type { CollectionKey, Inquiry, SiteContent } from "@/lib/cms/types";

export interface NavItem {
  href: string;
  label: string;
  Icon: LucideIcon;
  exact?: boolean;
  count?: (content: SiteContent) => number;
  alert?: (inquiries: Inquiry[] | null) => number;
}

export interface NavGroup {
  title?: string;
  items: NavItem[];
}

const collectionItem = (key: CollectionKey, Icon: LucideIcon): NavItem => ({
  href: `/admin/c/${key}`,
  label: COLLECTIONS[key].title,
  Icon,
  count: (content) => content[key].length,
});

const listGroup = (nav: "work" | "company" | "pricing", Icon: LucideIcon) =>
  (Object.keys(COLLECTIONS) as CollectionKey[])
    .filter((key) => COLLECTIONS[key].nav === nav && key !== "projects" && key !== "insights")
    .map((key) => collectionItem(key, Icon));

/** The admin menu, used by the sidebar. */
export const NAV: NavGroup[] = [
  {
    items: [
      { href: "/admin", label: "Overview", Icon: LayoutDashboard, exact: true },
      { href: "/admin/inquiries", label: "Inquiries", Icon: Inbox, alert: (list) => (list ?? []).filter((item) => item.status === "new").length },
    ],
  },
  {
    title: "Website",
    items: [
      { href: "/admin/pages", label: "Pages", Icon: Files, count: (content) => content.pages.length },
      collectionItem("projects", Briefcase),
      collectionItem("insights", Newspaper),
      { href: "/admin/header", label: "Header", Icon: PanelTop },
      { href: "/admin/footer", label: "Footer", Icon: PanelBottom },
    ],
  },
  { title: "Work", items: listGroup("work", FileText) },
  { title: "Company", items: listGroup("company", Building2) },
  { title: "Pricing", items: listGroup("pricing", Tags) },
  {
    title: "Settings",
    items: [
      { href: "/admin/brand", label: "Brand", Icon: Stamp },
      { href: "/admin/media", label: "Media library", Icon: Images },
      { href: "/admin/settings", label: "General settings", Icon: Settings },
      { href: "/admin/history", label: "Version history", Icon: History },
      { href: "/admin/account", label: "Login and password", Icon: KeyRound },
    ],
  },
];

export function isActive(item: NavItem, path: string) {
  if (item.exact) return path === item.href || path === `${item.href}/`;
  return path === item.href || path.startsWith(`${item.href}/`);
}
