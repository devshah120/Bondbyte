"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, X } from "lucide-react";
import Link from "next/link";
import {
  formatINR,
  yearlyPrice,
  type Package,
} from "@/lib/constants/industries";

interface PackageDrawerProps {
  open: boolean;
  onClose: () => void;
  pkg: Package;
  industryName: string;
  billing: "monthly" | "yearly";
}

/**
 * Side drawer detailing one package.
 *
 * Accessibility: rendered as a modal dialog — focus moves in on open and
 * returns to the trigger on close, Escape dismisses, and background scroll is
 * locked while it is open.
 */
export function PackageDrawer({
  open,
  onClose,
  pkg,
  industryName,
  billing,
}: PackageDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      // Keep focus inside the panel while it is open.
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      restoreFocusRef.current?.focus();
    };
  }, [open, onClose]);

  const price = billing === "monthly" ? pkg.monthlyPrice : yearlyPrice(pkg);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${pkg.name} details`}
            data-band="dark"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 right-0 z-[210] flex w-full max-w-lg flex-col border-l border-line"
          >
            <header className="flex items-start justify-between gap-4 border-b border-line p-7">
              <div>
                <span className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-fg-subtle">
                  {industryName}
                </span>
                <h2 className="mt-2 text-[1.6rem] font-medium tracking-tight text-fg">
                  {pkg.name}
                </h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close details"
                className="rounded-full border border-line p-2 text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-7">
              <p className="text-[0.9375rem] leading-relaxed text-fg-muted">
                {pkg.description}
              </p>

              <dl className="mt-7 grid grid-cols-2 gap-5 rounded-lg border border-line p-5">
                <div>
                  <dt className="font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-fg-subtle">
                    {billing === "monthly" ? "Per month" : "Per year"}
                  </dt>
                  <dd className="mt-1.5 text-[1.35rem] font-medium tracking-tight text-fg">
                    {formatINR(price)}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-fg-subtle">
                    Timeline
                  </dt>
                  <dd className="mt-1.5 text-[1.35rem] font-medium tracking-tight text-fg">
                    {pkg.timeline}
                  </dd>
                </div>
                <div className="col-span-2 border-t border-line pt-4">
                  <dt className="font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-fg-subtle">
                    Best suited for
                  </dt>
                  <dd className="mt-1.5 text-[0.9375rem] text-fg">{pkg.bestFor}</dd>
                </div>
              </dl>

              <h3 className="mt-9 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-fg-subtle">
                What&apos;s included
              </h3>

              <div className="mt-5 space-y-7">
                {pkg.details.map((group) => (
                  <div key={group.title}>
                    <h4 className="text-[0.9375rem] font-medium text-fg">
                      {group.title}
                    </h4>
                    <ul className="mt-3 space-y-2 border-l border-line pl-4">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 text-[0.875rem] text-fg-muted"
                        >
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-hi" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {pkg.isPlaceholder && (
                <p className="mt-8 rounded-lg border border-line bg-surface/60 p-4 text-[0.8125rem] leading-relaxed text-fg-subtle">
                  Indicative pricing. Final cost is confirmed after a short
                  discovery call, once the scope is agreed.
                </p>
              )}
            </div>

            <footer className="flex gap-3 border-t border-line p-7">
              <Link
                href="/contact"
                onClick={onClose}
                className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hi"
              >
                Start a project
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-full border border-line-strong px-6 py-3 text-sm font-medium text-fg transition-colors hover:bg-white/[0.06]"
              >
                Talk to us
              </Link>
            </footer>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
