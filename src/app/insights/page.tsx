import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { InsightsList } from "@/components/sections/InsightsList";
import { CTASection } from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Engineering and product writing from the BondByte team — how we scope, build and ship software that holds up in production.",
  alternates: { canonical: "/insights" },
};

export default function InsightsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Insights"
        lines={["Notes from", "the build."]}
        description="What we have learned designing, engineering and shipping products — scoping, architecture, interface work and the parts that only show up once something is live. Honest, occasionally opinionated."
      />

      <InsightsList />
      <CTASection />
    </>
  );
}
