import type { HeadingData, Section, SiteContent } from "@/lib/cms/types";
import { featuredInsight, publishedInsights, publishedProjects } from "@/lib/cms/content";
import { Hero, type HeroData } from "@/components/hero/Hero";
import { Positioning, type PositioningData } from "@/components/sections/Positioning";
import { WhatWeBuild } from "@/components/sections/WhatWeBuild";
import { WorkShowcase } from "@/components/work/WorkShowcase";
import { ServicesSection } from "@/components/services/ServicesSection";
import { TechnologySection } from "@/components/sections/TechnologySection";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTASection, type CtaData } from "@/components/sections/CTASection";
import { PageHeader } from "@/components/ui/PageHeader";
import { Story } from "@/components/sections/Story";
import { TeamSection } from "@/components/sections/TeamSection";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { HowWeBuild, type HowWeBuildData } from "@/components/sections/HowWeBuild";
import { PricingSection, type PricingData } from "@/components/sections/PricingSection";
import { WorkByIndustry } from "@/components/sections/WorkByIndustry";
import { ComparisonSection, type ComparisonData } from "@/components/sections/ComparisonSection";
import { CaseStudies } from "@/components/work/CaseStudies";
import { OtherWork } from "@/components/work/OtherWork";
import { ProductsSection } from "@/components/sections/ProductsSection";
import { InsightsList } from "@/components/sections/InsightsList";
import { InsightsSection } from "@/components/sections/InsightsSection";
import { TrustBar } from "@/components/sections/TrustBar";
import { ContactSection, type ContactData } from "@/components/sections/ContactSection";
import { TextBlocks, type TextBlocksData } from "@/components/sections/TextBlocks";


/**
 * Renders one page section from its stored data. Tokens ({company} …) are
 * already filled in by the page. Lists (projects, services …) come from the
 * content collections, so the same list can appear on several pages.
 */
export function SectionView({ section, content }: { section: Section; content: SiteContent }) {
  const data = section.data as Record<string, unknown>;
  const heading = data as unknown as HeadingData;
  const str = (key: string) => (typeof data[key] === "string" ? (data[key] as string) : "");

  switch (section.type) {
    case "hero":
      return <Hero data={data as unknown as HeroData} />;

    case "pageHeader":
      return <PageHeader eyebrow={heading.eyebrow ?? ""} lines={heading.heading} description={heading.description} dark={str("style") === "dark"} />;

    case "positioning":
      return <Positioning data={data as unknown as PositioningData} />;

    case "story":
      return <Story heading={heading.heading} paragraphs={(data.paragraphs as string[]) ?? []} />;

    case "capabilities":
      return <WhatWeBuild heading={heading} items={content.capabilities} linkHref={str("linkHref") || "/services"} />;

    case "workShowcase":
      return <WorkShowcase heading={heading} linkLabel={str("linkLabel")} projects={publishedProjects(content).filter((project) => project.featured)} />;

    case "caseStudies":
      return <CaseStudies projects={publishedProjects(content).filter((project) => project.featured)} />;

    case "otherWork":
      return <OtherWork eyebrow={str("eyebrow")} projects={publishedProjects(content).filter((project) => !project.featured)} />;

    case "services":
      return <ServicesSection heading={heading} services={content.services} />;

    case "technology":
      return <TechnologySection heading={heading} technologies={content.technologies} categories={content.settings.techCategories} />;

    case "team":
      return <TeamSection heading={heading} team={content.team} />;

    case "process":
      return <ProcessTimeline heading={heading} steps={content.processSteps} />;

    case "howWeBuild":
      return <HowWeBuild data={data as unknown as HowWeBuildData} principles={content.principles} />;

    case "pricing":
      return <PricingSection data={data as unknown as PricingData} tiers={content.pricingTiers} />;

    case "industries":
      return (
        <WorkByIndustry
          heading={heading}
          industries={content.industries}
          discount={content.settings.yearlyDiscount}
          tierLabels={{ normal: content.settings.tierNormal, exclusive: content.settings.tierExclusive, complete: content.settings.tierComplete }}
        />
      );

    case "comparison":
      return <ComparisonSection data={data as unknown as ComparisonData} rows={content.comparisonRows} />;

    case "products":
      return <ProductsSection products={content.products} projects={publishedProjects(content)} linkLabel={str("linkLabel")} />;

    case "insightsList":
      return <InsightsList insights={publishedInsights(content)} />;

    case "insightsLatest": {
      const insights = publishedInsights(content);
      return <InsightsSection heading={heading} featured={featuredInsight(insights)} insights={insights} limit={Number(data.limit) || 4} />;
    }

    case "testimonials":
      return <Testimonials eyebrow={str("eyebrow")} testimonials={content.testimonials} />;

    case "clients":
      return <TrustBar text={str("text")} clients={content.clients} />;

    case "contact":
      return <ContactSection data={data as unknown as ContactData} settings={content.settings} />;

    case "cta":
      return <CTASection data={data as unknown as CtaData} email={content.settings.email} />;

    case "textBlocks":
      return <TextBlocks data={data as unknown as TextBlocksData} />;

    default:
      return null;
  }
}
