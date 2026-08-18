import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  FEATURED_INSIGHT,
  PUBLISHED_INSIGHTS,
  formatInsightDate,
} from "@/lib/constants/insights";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/animations/Reveal";
import { InsightCover } from "@/components/ui/InsightCover";

/**
 * Insights index: one featured article plus recent secondary pieces.
 * Server component — no interactivity beyond links, so it ships no JS.
 */
export function InsightsSection({ limit = 4 }: { limit?: number }) {
  const featured = FEATURED_INSIGHT;
  if (!featured) return null;

  const secondary = PUBLISHED_INSIGHTS.filter((i) => i.slug !== featured.slug).slice(
    0,
    limit - 1,
  );

  return (
    <section className="border-t border-line py-28 lg:py-36">
      <div className="container-page">
        <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading eyebrow="Insights" lines={["What we've learned", "building things."]} />
          <Link
            href="/insights"
            className="group inline-flex shrink-0 items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg"
          >
            All insights
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Featured */}
          <Reveal className="lg:col-span-7">
            <Link
              href={`/insights/${featured.slug}`}
              data-cursor="view"
              className="group flex h-full flex-col"
            >
              <InsightCover
                insight={featured}
                className="aspect-[16/10] overflow-hidden rounded-xl border border-line transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
              />

              <div className="mt-6">
                <Meta
                  category={featured.category}
                  date={featured.date}
                  readTime={featured.readTime}
                />
                <h3 className="mt-4 text-[clamp(1.5rem,3vw,2.1rem)] font-medium leading-tight tracking-tight text-fg transition-colors duration-300 group-hover:text-accent">
                  {featured.title}
                </h3>
                <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-fg-muted">
                  {featured.excerpt}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-fg">
                  Read article
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
              </div>
            </Link>
          </Reveal>

          {/* Secondary */}
          <div className="lg:col-span-5">
            <Reveal staggerChildren className="border-t border-line">
              {secondary.map((insight) => (
                <Link
                  key={insight.slug}
                  href={`/insights/${insight.slug}`}
                  className="group flex gap-4 border-b border-line py-5"
                >
                  <InsightCover
                    insight={insight}
                    compact
                    className="aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-lg sm:w-28"
                  />
                  <div className="min-w-0">
                    <Meta
                      category={insight.category}
                      date={insight.date}
                      readTime={insight.readTime}
                    />
                    <h3 className="mt-2 text-[1.05rem] font-medium leading-snug tracking-tight text-fg transition-colors duration-300 group-hover:text-accent">
                      {insight.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-[0.8125rem] leading-relaxed text-fg-muted">
                      {insight.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function Meta({
  category,
  date,
  readTime,
}: {
  category: string;
  date: string;
  readTime: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 font-mono text-[0.625rem] uppercase tracking-[0.14em]">
      <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-accent">
        {category}
      </span>
      <span className="text-fg-subtle">{formatInsightDate(date)}</span>
      <span className="text-fg-subtle">·</span>
      <span className="text-fg-subtle">{readTime}</span>
    </div>
  );
}
