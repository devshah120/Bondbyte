import { CLIENTS } from "@/lib/constants/work";
import { Reveal } from "@/components/animations/Reveal";

/**
 * §11 — only real, named clients from the existing site are shown. No logos
 * are invented; names are set as typographic marks.
 */
export function TrustBar() {
  if (CLIENTS.length === 0) return null;

  return (
    <section className="border-y border-line bg-bg-secondary/40 py-14">
      <div className="container-page">
        <Reveal className="flex flex-col gap-9 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-xs text-sm leading-relaxed text-fg-muted">
            Trusted by teams building what&apos;s next.
          </p>
          <div className="flex flex-wrap items-center gap-x-12 gap-y-6">
            {CLIENTS.map((client) => (
              <span
                key={client}
                className="text-[1.0625rem] font-medium tracking-tight text-fg-subtle transition-colors duration-500 hover:text-fg"
              >
                {client}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
