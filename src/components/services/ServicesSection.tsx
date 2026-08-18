"use client";

import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { SERVICES } from "@/lib/constants/company";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils/cn";

/**
 * §13 — interactive vertical service list. Hovering a row expands its
 * description, shifts the number, and moves a shared accent line.
 */
export function ServicesSection() {
  const [active, setActive] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  return (
    <section data-band="tint" className="relative border-t border-line py-28 lg:py-40">
      <div className="container-page">
        <SectionHeading
          eyebrow="Services"
          lines={["What we do,", "end to end."]}
          description="Eight disciplines that cover the full life of a product — from the first conversation to the release after launch."
          className="mb-16 lg:mb-24"
        />

        <ul ref={listRef} className="border-t border-line">
          {SERVICES.map((service, i) => {
            const isActive = active === i;
            const dimmed = active !== null && !isActive;

            return (
              <li
                key={service.index}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className={cn(
                  "group relative border-b border-line transition-opacity duration-500",
                  dimmed && "opacity-40",
                )}
              >
                {/* Accent wash on hover */}
                <span
                  className={cn(
                    "pointer-events-none absolute inset-0 bg-gradient-to-r from-accent/[0.07] to-transparent transition-opacity duration-500",
                    isActive ? "opacity-100" : "opacity-0",
                  )}
                />
                {/* Left accent rule */}
                <span
                  className={cn(
                    "pointer-events-none absolute left-0 top-0 h-full w-px bg-accent-hi transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    isActive ? "scale-y-100" : "scale-y-0",
                  )}
                />

                <div className="relative flex flex-col gap-5 px-1 py-8 lg:flex-row lg:items-baseline lg:gap-12 lg:px-6 lg:py-10">
                  <span
                    className={cn(
                      "font-mono text-[0.6875rem] tracking-[0.16em] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      isActive
                        ? "translate-x-1 text-accent-hi"
                        : "translate-x-0 text-fg-subtle",
                    )}
                  >
                    {service.index}
                  </span>

                  <div className="flex-1 lg:grid lg:grid-cols-12 lg:items-baseline lg:gap-10">
                    <h3
                      className={cn(
                        "text-[1.75rem] font-medium tracking-tight transition-colors duration-500 lg:col-span-5 lg:text-[2.1rem]",
                        isActive ? "text-fg" : "text-fg",
                      )}
                    >
                      {service.title}
                    </h3>

                    <div className="mt-4 lg:col-span-7 lg:mt-0">
                      <p className="max-w-lg text-[0.9375rem] leading-relaxed text-fg-muted">
                        {service.description}
                      </p>
                      {/* Capability chips expand only for the hovered row */}
                      <div
                        className={cn(
                          "grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                          isActive
                            ? "mt-4 grid-rows-[1fr] opacity-100"
                            : "mt-0 grid-rows-[0fr] opacity-0",
                        )}
                      >
                        <div className="overflow-hidden">
                          <div className="flex flex-wrap gap-2">
                            {service.capabilities.map((cap) => (
                              <span
                                key={cap}
                                className="rounded-full border border-line px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-fg-subtle"
                              >
                                {cap}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <ArrowUpRight
                    className={cn(
                      "hidden h-5 w-5 shrink-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:block",
                      isActive
                        ? "translate-x-0 -translate-y-0 text-accent-hi opacity-100"
                        : "-translate-x-2 translate-y-2 text-fg-subtle opacity-0",
                    )}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
