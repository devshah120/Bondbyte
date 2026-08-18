import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FEATURED_PROJECTS } from "@/lib/constants/work";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CaseStudy } from "./CaseStudy";

/** §14 — featured client work. */
export function FeaturedWork() {
  return (
    <section className="relative border-t border-line py-28 lg:py-40">
      <div className="container-page">
        <div className="mb-16 flex flex-col gap-8 lg:mb-20 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Selected work"
            lines={["Products we've", "put into the world."]}
          />
          <Link
            href="/work"
            className="group inline-flex shrink-0 items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg"
          >
            All work
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>

        {FEATURED_PROJECTS.map((project, i) => (
          <CaseStudy
            key={project.slug}
            project={project}
            index={i}
            priority={i === 0}
          />
        ))}
      </div>
    </section>
  );
}
