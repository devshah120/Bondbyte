import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/** The admin panel has its own chrome; the public site's header and footer are not used here. */
export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
