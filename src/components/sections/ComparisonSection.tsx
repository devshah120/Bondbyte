import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ComparisonRow } from "@/lib/cms/types";
import { AnimatedText } from "@/components/animations/AnimatedText";
import { Reveal } from "@/components/animations/Reveal";

/**
 * Delivery-model comparison.
 *
 * Compares structural differences between ways of getting software built.
 * Deliberately makes no claims about the price or quality of any named agency.
 */
export interface ComparisonData {
  eyebrow: string;
  heading: string[];
  description: string;
  col1: string;
  col2: string;
  col3: string;
  col4: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
}

export function ComparisonSection({ data, rows }: { data: ComparisonData; rows: ComparisonRow[] }) {
  return (
    <section className="border-t border-line bg-bg-secondary py-28 lg:py-36">
      <div className="container-page">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          {data.eyebrow && <span className="text-eyebrow">{data.eyebrow}</span>}
          <AnimatedText
            as="h2"
            lines={data.heading}
            className="text-display mt-6 text-[clamp(2rem,5vw,3.5rem)]"
          />
          {data.description && (
            <p className="mx-auto mt-6 max-w-lg text-[1.0625rem] leading-relaxed text-fg-muted">{data.description}</p>
          )}
        </div>

        <Reveal>
          {/* Scrolls independently so the page never overflows horizontally */}
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[46rem] border-collapse bg-surface text-fg">
              <caption className="sr-only">
                {`Comparison of ${[data.col1, data.col2, data.col3, data.col4].filter(Boolean).join(", ")}`}
              </caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="w-[15rem] px-6 py-5 text-left text-sm font-medium text-fg-subtle">
                    <span className="sr-only">Factor</span>
                  </th>
                  <th scope="col" className="px-5 py-5 text-center text-[0.9375rem] font-semibold">
                    {data.col1}
                  </th>
                  <th scope="col" className="px-5 py-5 text-center text-[0.9375rem] font-semibold">
                    {data.col2}
                  </th>
                  <th scope="col" className="px-5 py-5 text-center text-[0.9375rem] font-semibold">
                    {data.col3}
                  </th>
                  <th
                    scope="col"
                    className="bg-accent/[0.09] px-5 py-5 text-center text-[0.9375rem] font-semibold text-accent-dim"
                  >
                    {data.col4}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-line last:border-b-0">
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
          {data.primaryLabel && data.primaryHref && (
          <Link
            href={data.primaryHref}
            data-cursor="cta"
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent-hi"
          >
            {data.primaryLabel}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          )}
          {data.secondaryLabel && data.secondaryHref && (
          <Link
            href={data.secondaryHref}
            className="inline-flex items-center gap-2 rounded-full border border-line-strong px-7 py-3.5 text-sm font-medium text-fg transition-colors hover:bg-accent/[0.06]"
          >
            {data.secondaryLabel}
          </Link>
          )}
        </div>
      </div>
    </section>
  );
}
