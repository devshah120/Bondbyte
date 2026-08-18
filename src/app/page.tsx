import { Hero } from "@/components/hero/Hero";
import { Positioning } from "@/components/sections/Positioning";
import { WhatWeBuild } from "@/components/sections/WhatWeBuild";
import { WorkShowcase } from "@/components/work/WorkShowcase";
import { ServicesSection } from "@/components/services/ServicesSection";
import { TechnologySection } from "@/components/sections/TechnologySection";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTASection } from "@/components/sections/CTASection";

export default function Home() {
  return (
    <>
      {/* dark */}
      <Hero />

      {/* light */}
      <Positioning />

      {/* tint */}
      <WhatWeBuild />

      {/* light */}
      <WorkShowcase />

      {/* tint */}
      <ServicesSection />

      {/* light */}
      <TechnologySection />

      {/* light */}
      <Testimonials />

      {/* dark */}
      <CTASection />
    </>
  );
}
