import type { Metadata } from "next";
import { InsightsList } from "@/components/sections/InsightsList";
import { CTASection } from "@/components/sections/CTASection";
import { AnimatedText } from "@/components/animations/AnimatedText";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Engineering and product writing from the BondByte team — how we scope, build and ship software that holds up in production.",
  alternates: { canonical: "/insights" },
};

export default function InsightsPage() {
  return (
    <>
      {/* Dark editorial masthead, mirroring the article pages */}
      <section
        data-band="dark"
        className="relative overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-28"
      >
        <div className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_30%_30%,#000_10%,transparent_70%)]" />
        <div className="pointer-events-none absolute -right-32 top-16 h-[26rem] w-[26rem] rounded-full bg-accent/[0.10] blur-[130px]" />

        <div className="container-page relative">
          <div className="mb-7 flex items-center gap-3">
            <span className="h-px w-8 bg-line-strong" />
            <span className="text-eyebrow">Insights</span>
          </div>

          <AnimatedText
            as="h1"
            lines={["Notes from", "the build."]}
            className="text-display max-w-4xl text-[clamp(2.4rem,6.4vw,4.75rem)]"
            onScroll={false}
          />

          <p className="mt-8 max-w-2xl text-[1.0625rem] leading-relaxed text-fg-muted">
            What we have learned designing, engineering and shipping products —
            scoping, architecture, interface work and the parts that only show up
            once something is live. Honest, occasionally opinionated.
          </p>
        </div>
      </section>

      <InsightsList />
      <CTASection />
    </>
  );
}
