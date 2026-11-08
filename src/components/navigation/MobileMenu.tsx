"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useSite } from "@/components/site/SiteProvider";

/** Fullscreen mobile navigation with staggered item entrance (§7). */
export function MobileMenu({ onClose }: { onClose: () => void }) {
  const { header, email, city, region } = useSite();
  const links = [...header.leftLinks, ...header.rightLinks, ...header.mobileExtraLinks];
  return (
    <motion.div
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      animate={{ clipPath: "inset(0 0 0% 0)" }}
      exit={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.62, ease: [0.76, 0, 0.24, 1] }}
      data-band="dark"
      className="fixed inset-0 z-[120] flex flex-col lg:hidden"
    >
      <div className="bg-grid absolute inset-0 opacity-40" />

      <nav className="container-page relative flex flex-1 flex-col justify-center">
        <ul className="space-y-1">
          {links.map((link, i) => (
            <li key={link.id} className="overflow-hidden">
              <motion.div
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                exit={{ y: "110%", transition: { duration: 0.3 } }}
                transition={{
                  duration: 0.7,
                  delay: 0.16 + i * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="flex items-baseline gap-4 py-2 text-[2.4rem] font-medium tracking-tight text-fg"
                >
                  <span className="font-mono text-[0.7rem] text-fg-subtle">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {link.label}
                </Link>
              </motion.div>
            </li>
          ))}
        </ul>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-14 border-t border-line pt-8"
        >
          <Link
            href={header.ctaHref}
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3.5 text-sm font-medium text-bg"
          >
            {header.mobileCtaLabel || header.ctaLabel}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <a
            href={`mailto:${email}`}
            className="mt-7 block text-sm text-fg-muted"
          >
            {email}
          </a>
          <p className="mt-1 text-sm text-fg-subtle">
            {[city, region].filter(Boolean).join(", ")}
          </p>
        </motion.div>
      </nav>
    </motion.div>
  );
}
