import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { COMPARISON_ROWS } from "@/lib/constants/pricing";
import { AnimatedText } from "@/components/animations/AnimatedText";
import { Reveal } from "@/components/animations/Reveal";

/**
 * Delivery-model comparison.
 *
 * Compares structural differences between ways of getting software built.
 * Deliberately makes no claims about the price or quality of any named agency.
 */
export function ComparisonSection() {
  return (
    <section className="border-t border-line bg-bg-secondary py-28 lg:py-36">
      <div className="container-page">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="text-eyebrow">Side by side</span>
          <AnimatedText
            as="h2"
            lines={["Four ways to build it.", "Only one is ours."]}
            className="text-display mt-6 text-[clamp(2rem,5vw,3.5rem)]"
          />
          <p className="mx-auto mt-6 max-w-lg text-[1.0625rem] leading-relaxed text-fg-muted">
            How the common options actually differ once the work starts.
          </p>
        </div>

        <Reveal>
          {/* Scrolls independently so the page never overflows horizontally */}
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[46rem] border-collapse bg-surface text-fg">
              <caption className="sr-only">
                Comparison of website builders, freelancers, in-house hires and
                BondByte across delivery factors
              </caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="w-[15rem] px-6 py-5 text-left text-sm font-medium text-fg-subtle">
                    <span className="sr-only">Factor</span>
                  </th>
                  <th scope="col" className="px-5 py-5 text-center text-[0.9375rem] font-semibold">
                    Website builder
                  </th>
                  <th scope="col" className="px-5 py-5 text-center text-[0.9375rem] font-semibold">
                    Freelancer
                  </th>
                  <th scope="col" className="px-5 py-5 text-center text-[0.9375rem] font-semibold">
                    In-house hire
                  </th>
                  <th
                    scope="col"
                    className="bg-accent/[0.09] px-5 py-5 text-center text-[0.9375rem] font-semibold text-accent-dim"
                  >
                    BondByte
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.label} className="border-b border-line last:border-b-0">
                    <th
                      scope="row"
                      className="px-6 py-4 text-left text-[0.875rem] font-semibold"
                    >
                      {row.label}
                    </th>
                    <td className="px-5 py-4 text-center text-[0.875rem] text-fg-muted">
                      {row.template}
                    </td>
                    <td className="px-5 py-4 text-center text-[0.875rem] text-fg-muted">
                      {row.freelancer}
                    </td>
                    <td className="px-5 py-4 text-center text-[0.875rem] text-fg-muted">
                      {row.inHouse}
                    </td>
                    <td className="bg-accent/[0.07] px-5 py-4 text-center text-[0.875rem] font-semibold text-accent-dim">
                      {row.bondbyte}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/contact"
            data-cursor="cta"
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent-hi"
          >
            Start a Project
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/work"
            className="inline-flex items-center gap-2 rounded-full border border-line-strong px-7 py-3.5 text-sm font-medium text-fg transition-colors hover:bg-accent/[0.06]"
          >
            See our work
          </Link>
        </div>
      </div>
    </section>
  );
}
