import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { HowWeBuild } from "@/components/sections/HowWeBuild";
import { PricingSection } from "@/components/sections/PricingSection";
import { WorkByIndustry } from "@/components/sections/WorkByIndustry";
import { ComparisonSection } from "@/components/sections/ComparisonSection";
import { CTASection } from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Fixed-scope pricing for landing pages, websites and product builds, plus dedicated teams for ongoing work. Clear scope, clear price.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        lines={["What it costs", "to build it right."]}
        description="Most work is fixed-scope and fixed-price, agreed before anything starts. No hourly surprises."
      />
      <HowWeBuild />
      <PricingSection />
      <WorkByIndustry />
      <ComparisonSection />
      <CTASection />
    </>
  );
}
