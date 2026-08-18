import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import {
  PUBLISHED_INSIGHTS,
  formatInsightDate,
} from "@/lib/constants/insights";
import { CTASection } from "@/components/sections/CTASection";
import { InsightCover } from "@/components/ui/InsightCover";
import { ArticleBody } from "@/components/ui/ArticleBody";
import { SITE } from "@/lib/constants/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PUBLISHED_INSIGHTS.map((insight) => ({ slug: insight.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const insight = PUBLISHED_INSIGHTS.find((i) => i.slug === slug);
  if (!insight) return {};

  return {
    title: insight.title,
    description: insight.excerpt,
    alternates: { canonical: `/insights/${insight.slug}` },
    openGraph: {
      type: "article",
      title: insight.title,
      description: insight.excerpt,
      publishedTime: insight.date,
      authors: [insight.author],
    },
  };
}

export default async function InsightPage({ params }: PageProps) {
  const { slug } = await params;
  const insight = PUBLISHED_INSIGHTS.find((i) => i.slug === slug);
  if (!insight) notFound();

  const index = PUBLISHED_INSIGHTS.indexOf(insight);
  const next = PUBLISHED_INSIGHTS[(index + 1) % PUBLISHED_INSIGHTS.length];

  // Article schema — helps the piece surface correctly in search results.
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: insight.title,
    description: insight.excerpt,
    datePublished: insight.date,
    author: { "@type": "Person", name: insight.author },
    publisher: { "@type": "Organization", name: SITE.legalName },
    mainEntityOfPage: `${SITE.domain}/insights/${insight.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <article className="relative pt-32 lg:pt-40">
        {/* container-page caps at 88rem; the inner wrapper sets the reading
            measure so the cover and text share one narrow column. */}
        <div className="container-page relative">
          <div className="mx-auto w-full max-w-2xl">
            <Link
              href="/insights"
              className="group inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-fg-muted transition-colors hover:text-fg"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
              Back to blog
            </Link>

            {/* Cover leads the page, as on the index */}
            <InsightCover
              insight={insight}
              className="mt-8 aspect-[3/2] w-full overflow-hidden rounded-xl border border-line"
            />

            <h1 className="mt-10 text-[clamp(1.9rem,4.4vw,2.75rem)] font-semibold leading-[1.1] tracking-tight text-fg">
              {insight.title}
            </h1>

            {/* Single metadata line, author included */}
            <div className="mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em]">
              <span className="text-accent">{insight.category}</span>
              <span className="text-fg-subtle" aria-hidden>·</span>
              <span className="text-fg-subtle">{formatInsightDate(insight.date)}</span>
              <span className="text-fg-subtle" aria-hidden>·</span>
              <span className="text-fg-subtle">{insight.readTime}</span>
              <span className="text-fg-subtle" aria-hidden>·</span>
              <span className="text-fg-subtle">By {insight.author}</span>
            </div>
          </div>
        </div>

        <div className="container-page relative mt-12 pb-24">
          <div className="mx-auto w-full max-w-2xl">
            <ArticleBody blocks={insight.body} />
          </div>
        </div>

        <div className="border-t border-line">
          <div className="container-page py-14">
            <Link href={`/insights/${next.slug}`} className="group block">
              <span className="text-eyebrow">Read next</span>
              <div className="mt-4 flex items-center justify-between gap-6">
                <h2 className="text-[clamp(1.5rem,3.5vw,2.25rem)] font-semibold tracking-tight transition-colors group-hover:text-accent">
                  {next.title}
                </h2>
                <ArrowUpRight className="h-6 w-6 shrink-0 text-fg-subtle transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-fg" />
              </div>
            </Link>
          </div>
        </div>
      </article>

      <CTASection />
    </>
  );
}
