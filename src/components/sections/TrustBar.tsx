import type { Client } from "@/lib/cms/types";
import { Reveal } from "@/components/animations/Reveal";

/**
 * §11 — only real, named clients from the existing site are shown. No logos
 * are invented; names are set as typographic marks.
 */
export function TrustBar({ text, clients }: { text: string; clients: Client[] }) {
  if (clients.length === 0) return null;

  return (
    <section className="border-y border-line bg-bg-secondary/40 py-14">
      <div className="container-page">
        <Reveal className="flex flex-col gap-9 lg:flex-row lg:items-center lg:justify-between">
          {text && <p className="max-w-xs text-sm leading-relaxed text-fg-muted">{text}</p>}
          <div className="flex flex-wrap items-center gap-x-12 gap-y-6">
            {clients.map((client) => (
              <span
                key={client.id}
                className="text-[1.0625rem] font-medium tracking-tight text-fg-subtle transition-colors duration-500 hover:text-fg"
              >
                {client.name}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
