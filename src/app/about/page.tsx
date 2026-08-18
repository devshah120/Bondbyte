import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/animations/Reveal";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { CTASection } from "@/components/sections/CTASection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TEAM } from "@/lib/constants/company";
import { SITE } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "BondByte is a digital product studio in Ahmedabad combining strategy, design and engineering to build software that holds up in the real world.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        lines={["A studio built", "around the product."]}
        description="BondByte combines strategy, design and engineering to turn ambitious ideas into reliable digital products."
      />

      <section className="border-t border-line py-24 lg:py-32">
        <div className="container-page">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-5">
              <h2 className="text-display text-[clamp(1.9rem,4vw,2.75rem)]">
                Small team.
                <br />
                Whole product.
              </h2>
            </div>
            <div className="lg:col-span-7">
              <Reveal staggerChildren className="space-y-6">
                <p className="text-[1.0625rem] leading-relaxed text-fg-muted">
                  We are a compact team of {TEAM.length} specialists in{" "}
                  {SITE.location.city} covering product management, full-stack
                  engineering, mobile development and design. That size is the
                  point: the people who scope your project are the people who
                  build it.
                </p>
                <p className="text-[1.0625rem] leading-relaxed text-fg-muted">
                  Our work runs from client products to software we own and
                  operate ourselves — including Kindify, a platform that lets
                  NGOs register and receive donations with payment routing built
                  in. Running our own product keeps us honest about what it takes
                  to maintain one.
                </p>
                <p className="text-[1.0625rem] leading-relaxed text-fg-muted">
                  We work with founders and teams who need the whole path
                  covered: shaping the idea, designing the interface, engineering
                  the system and staying involved once it is live.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line py-24 lg:py-32">
        <div className="container-page">
          <SectionHeading
            eyebrow="Team"
            lines={["The people", "who build it."]}
            className="mb-16"
          />

          <Reveal staggerChildren className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM.map((member) => (
              <div key={member.name} className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-line bg-surface">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover grayscale transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] group-hover:grayscale-0"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
                </div>
                <h3 className="mt-5 text-[1.0625rem] font-medium tracking-tight text-fg">
                  {member.name}
                </h3>
                <p className="mt-1 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-fg-subtle">
                  {member.role}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <ProcessTimeline />
      <CTASection />
    </>
  );
}
