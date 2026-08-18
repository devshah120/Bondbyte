import Link from "next/link";
import { Check } from "lucide-react";
import { PRICING_TIERS } from "@/lib/constants/pricing";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/animations/Reveal";
import { cn } from "@/lib/utils/cn";

/** Pricing tiers, with the primary tier raised and accented. */
export function PricingSection() {
  return (
    <section id="pricing" className="relative border-t border-line py-28 lg:py-36">
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[46rem] -translate-x-1/2 rounded-full bg-accent/[0.08] blur-[130px]" />

      <div className="container-page relative">
        <SectionHeading
          eyebrow="Pricing"
          lines={["Clear scope.", "Clear price."]}
          description="Fixed-price engagements for defined work, and a monthly team when the roadmap keeps going."
          align="center"
          className="mb-16"
        />

        <Reveal
          staggerChildren
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:items-start"
        >
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "relative flex h-full flex-col rounded-xl border p-7 transition-colors duration-500",
                tier.featured
                  ? "border-accent/40 bg-surface shadow-[0_0_60px_-15px] shadow-accent/30 lg:-mt-4 lg:pb-9"
                  : "border-line bg-surface/40 hover:border-line-strong",
              )}
            >
              {tier.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-white">
                  Most chosen
                </span>
              )}

              <h3 className="text-[1.375rem] font-medium tracking-tight text-fg">
                {tier.name}
              </h3>
              <p className="mt-2.5 min-h-[3rem] text-[0.875rem] leading-relaxed text-fg-muted">
                {tier.description}
              </p>

              <div className="mt-7">
                {tier.period === "from" && (
                  <span className="mb-1 block font-mono text-[0.625rem] uppercase tracking-[0.14em] text-fg-subtle">
                    From
                  </span>
                )}
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[2.5rem] font-medium leading-none tracking-tight text-fg">
                    {tier.price}
                  </span>
                  {tier.period && tier.period !== "from" && (
                    <span className="text-sm text-fg-subtle">/{tier.period}</span>
                  )}
                </div>
                <p className="mt-2 text-[0.75rem] text-fg-subtle">{tier.note}</p>
              </div>

              <ul className="mt-8 flex-1 space-y-3 border-t border-line pt-7">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-[0.875rem] text-fg-muted">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-hi" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={tier.ctaHref}
                data-cursor="cta"
                className={cn(
                  "mt-8 inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors duration-300",
                  tier.featured
                    ? "bg-accent text-white hover:bg-accent-hi"
                    : "border border-line-strong text-fg hover:bg-accent/[0.06]",
                )}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </Reveal>

        <p className="mt-10 text-center text-[0.8125rem] text-fg-subtle">
          Every engagement starts with a call. No obligation, no sales script.
        </p>
      </div>
    </section>
  );
}
