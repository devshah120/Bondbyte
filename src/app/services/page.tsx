import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { ServicesSection } from "@/components/services/ServicesSection";
import { WhatWeBuild } from "@/components/sections/WhatWeBuild";
import { CTASection } from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Product strategy, UI/UX design, web and mobile development, backend engineering, cloud and DevOps — the full path from idea to production.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        lines={["Strategy, design", "and engineering", "under one roof."]}
        description="We cover the whole build. No handoffs between agencies, no gaps where the work falls through."
      />
      <ServicesSection />
      <WhatWeBuild />
      <CTASection />
    </>
  );
}
