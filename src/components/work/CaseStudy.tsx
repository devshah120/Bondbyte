"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/constants/work";
import { ProjectVisual } from "./ProjectVisual";
import { AnimatedText } from "@/components/animations/AnimatedText";
import { Reveal } from "@/components/animations/Reveal";
import { createParallax } from "@/lib/animations/parallax";
import { cn } from "@/lib/utils/cn";

/**
 * §14 — a case study rendered as a mini landing page. Every second entry
 * mirrors its layout so the page never reads as a repeating grid.
 */
export function CaseStudy({
  project,
  index,
  priority = false,
}: {
  project: Project;
  index: number;
  priority?: boolean;
}) {
  const visualRef = useRef<HTMLDivElement>(null);
  const mirrored = index % 2 === 1;

  useEffect(() => {
    const el = visualRef.current;
    if (!el) return;
    const inner = el.querySelector<HTMLElement>("[data-parallax-inner]");
    if (!inner) return;
    return createParallax(inner, { distance: 46, trigger: el });
  }, []);

  return (
    <article className="group relative border-t border-line py-20 lg:py-28">
      <div
        className={cn(
          "grid items-center gap-10 lg:grid-cols-12 lg:gap-16",
          mirrored && "lg:[direction:rtl]",
        )}
      >
        {/* Copy */}
        <div className={cn("lg:col-span-5 lg:[direction:ltr]")}>
          <div className="mb-7 flex items-center gap-4">
            <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-fg-subtle">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="h-px w-8 bg-line-strong" />
            <span className="text-eyebrow">{project.discipline}</span>
          </div>

          <AnimatedText
            as="h3"
            lines={[project.title]}
            className="text-display text-[clamp(2.1rem,4.6vw,3.4rem)]"
          />

          <Reveal delay={0.1} className="mt-6">
            <p className="max-w-md text-[1.0625rem] leading-relaxed text-fg-muted">
              {project.summary}
            </p>

            {project.description && (
              <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-fg-subtle">
                {project.description}
              </p>
            )}

            {/* Rendered only when verified metrics exist — never fabricated */}
            {project.metrics.length > 0 && (
              <dl className="mt-8 flex gap-10">
                {project.metrics.map((metric) => (
                  <div key={metric.label}>
                    <dt className="sr-only">{metric.label}</dt>
                    <dd className="text-2xl font-medium tracking-tight text-fg">
                      {metric.value}
                    </dd>
                    <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-fg-subtle">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-9 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-line px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-fg-subtle"
                >
                  {tech}
                </span>
              ))}
            </div>

            <Link
              href={`/work/${project.slug}`}
              data-cursor="cta"
              className="group/link mt-10 inline-flex items-center gap-2 text-sm font-medium text-fg"
            >
              View Case Study
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
            </Link>
          </Reveal>
        </div>

        {/* Visual */}
        <div ref={visualRef} className="lg:col-span-7 lg:[direction:ltr]">
          <Link
            href={`/work/${project.slug}`}
            data-cursor="view"
            aria-label={`View the ${project.title} case study`}
            className="block overflow-hidden rounded-lg"
          >
            <div data-parallax-inner>
              <ProjectVisual
                project={project}
                priority={priority}
                className="aspect-[16/11] w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
              />
            </div>
          </Link>
        </div>
      </div>
    </article>
  );
}
