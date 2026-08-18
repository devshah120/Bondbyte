"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import {
  INDUSTRIES,
  TIER_LABELS,
  TIER_ORDER,
  YEARLY_DISCOUNT,
  formatINR,
  yearlyPrice,
  type PackageTier,
} from "@/lib/constants/industries";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PackageDrawer } from "./PackageDrawer";
import { cn } from "@/lib/utils/cn";

type Billing = "monthly" | "yearly";

/**
 * Industry → package configurator.
 *
 * One reusable UI renders every industry from `INDUSTRIES`; adding an industry
 * is a data change. Selection, tier and billing period are all local state, so
 * every transition happens without a navigation.
 */
export function WorkByIndustry() {
  const [industryId, setIndustryId] = useState(INDUSTRIES[0].id);
  const [tier, setTier] = useState<PackageTier>("exclusive");
  const [billing, setBilling] = useState<Billing>("monthly");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const industry = INDUSTRIES.find((i) => i.id === industryId) ?? INDUSTRIES[0];
  const pkg = industry.packages[tier];

  const price =
    billing === "monthly" ? pkg.monthlyPrice : yearlyPrice(pkg);
  const priceSuffix = billing === "monthly" ? "/month" : "/year";

  return (
    <section
      id="industries"
      data-band="dark"
      className="relative border-t border-line py-28 lg:py-36"
    >
      <div className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,#000_10%,transparent_70%)]" />

      <div className="container-page relative">
        <SectionHeading
          eyebrow="Work by industry"
          lines={["Solutions shaped", "around your sector."]}
          description="Pick your industry to see the work it involves, what each package covers and what it costs."
          className="mb-14"
        />

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Industry navigation */}
          <nav aria-label="Industries" className="lg:col-span-4">
            <ul className="border-t border-line">
              {INDUSTRIES.map((item, i) => {
                const isActive = item.id === industryId;
                return (
                  <li key={item.id} className="border-b border-line">
                    <button
                      type="button"
                      onClick={() => setIndustryId(item.id)}
                      aria-current={isActive ? "true" : undefined}
                      className="group relative flex w-full items-center gap-4 py-4 text-left"
                    >
                      <span
                        className={cn(
                          "absolute left-0 top-0 h-full w-px bg-accent-hi transition-transform duration-500",
                          isActive ? "scale-y-100" : "scale-y-0",
                        )}
                      />
                      <span
                        className={cn(
                          "font-mono text-[0.6875rem] tracking-[0.16em] transition-all duration-500",
                          isActive ? "translate-x-2 text-accent-hi" : "text-fg-subtle",
                        )}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "text-[1.05rem] font-medium tracking-tight transition-all duration-500",
                          isActive
                            ? "translate-x-2 text-fg"
                            : "text-fg-muted group-hover:text-fg",
                        )}
                      >
                        {item.name}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Selected industry + package */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={industry.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3 className="text-[clamp(1.9rem,4vw,2.75rem)] font-medium tracking-tight text-fg">
                  {industry.name}
                </h3>
                <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-fg-muted">
                  {industry.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Tier + billing controls */}
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div
                role="tablist"
                aria-label="Package level"
                className="inline-flex rounded-full border border-line p-1"
              >
                {TIER_ORDER.map((t) => (
                  <button
                    key={t}
                    role="tab"
                    aria-selected={tier === t}
                    type="button"
                    onClick={() => setTier(t)}
                    className={cn(
                      "relative rounded-full px-4 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] transition-colors duration-300",
                      tier === t ? "text-bg" : "text-fg-muted hover:text-fg",
                    )}
                  >
                    {tier === t && (
                      <motion.span
                        layoutId="tier-pill"
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0 rounded-full bg-fg"
                      />
                    )}
                    <span className="relative">{TIER_LABELS[t]}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div
                  role="tablist"
                  aria-label="Billing period"
                  className="inline-flex rounded-full border border-line p-1"
                >
                  {(["monthly", "yearly"] as const).map((b) => (
                    <button
                      key={b}
                      role="tab"
                      aria-selected={billing === b}
                      type="button"
                      onClick={() => setBilling(b)}
                      className={cn(
                        "relative rounded-full px-4 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] transition-colors duration-300",
                        billing === b ? "text-bg" : "text-fg-muted hover:text-fg",
                      )}
                    >
                      {billing === b && (
                        <motion.span
                          layoutId="billing-pill"
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute inset-0 rounded-full bg-fg"
                        />
                      )}
                      <span className="relative">{b}</span>
                    </button>
                  ))}
                </div>
                <span className="rounded-full border border-accent-hi/40 bg-accent/15 px-2.5 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-accent-hi">
                  Save {Math.round(YEARLY_DISCOUNT * 100)}%
                </span>
              </div>
            </div>

            {/* Package panel */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${industry.id}-${tier}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "mt-8 rounded-xl border p-7 lg:p-9",
                  tier === "complete"
                    ? "border-accent-hi/40 bg-surface shadow-[0_0_70px_-20px] shadow-accent/40"
                    : "border-line bg-surface/50",
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    {tier === "complete" && (
                      <span className="mb-3 inline-block rounded-full bg-accent px-3 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-white">
                        Complete solution
                      </span>
                    )}
                    <h4 className="text-[1.5rem] font-medium tracking-tight text-fg">
                      {pkg.name}
                    </h4>
                    <p className="mt-2 max-w-md text-[0.9375rem] leading-relaxed text-fg-muted">
                      {pkg.description}
                    </p>
                  </div>

                  <div className="text-right">
                    {/* Keyed so the number animates when the period changes */}
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={`${price}-${billing}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                        className="text-[2rem] font-medium leading-none tracking-tight text-fg"
                      >
                        {formatINR(price)}
                      </motion.p>
                    </AnimatePresence>
                    <span className="mt-1 block text-[0.75rem] text-fg-subtle">
                      {priceSuffix}
                    </span>
                  </div>
                </div>

                <dl className="mt-7 grid grid-cols-2 gap-5 border-y border-line py-5">
                  <div>
                    <dt className="font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-fg-subtle">
                      Timeline
                    </dt>
                    <dd className="mt-1.5 text-[0.9375rem] text-fg">{pkg.timeline}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-fg-subtle">
                      Best for
                    </dt>
                    <dd className="mt-1.5 text-[0.9375rem] text-fg">{pkg.bestFor}</dd>
                  </div>
                </dl>

                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {pkg.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-[0.875rem] text-fg-muted"
                    >
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-hi" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(true)}
                    data-cursor="cta"
                    className="inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3 text-sm font-medium text-bg transition-colors hover:bg-accent hover:text-white"
                  >
                    View details
                  </button>
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 text-sm font-medium text-fg transition-colors hover:bg-white/[0.06]"
                  >
                    Start a project
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <PackageDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        pkg={pkg}
        industryName={industry.name}
        billing={billing}
      />
    </section>
  );
}
