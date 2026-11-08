import { ArrowUpRight } from "lucide-react";
import type { Settings } from "@/lib/cms/types";
import { phoneHref } from "@/lib/cms/content";
import { AnimatedText } from "@/components/animations/AnimatedText";
import { ContactForm } from "./ContactForm";

export interface ContactData {
  eyebrow: string;
  heading: string[];
  text: string;
  studioNote: string;
  projectTypes: string[];
  budgets: string[];
  successTitle: string;
  successText: string;
}

/** Contact details next to the enquiry form. Messages land under Inquiries in the admin panel. */
export function ContactSection({ data, settings }: { data: ContactData; settings: Settings }) {
  const location = [settings.city, settings.region].filter(Boolean).join(", ");

  return (
    <section className="relative pt-40 pb-28 lg:pt-48 lg:pb-40">
      <div className="bg-grid absolute inset-x-0 top-0 h-[32rem] opacity-40 [mask-image:linear-gradient(to_bottom,#000,transparent)]" />

      <div className="container-page relative">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            {data.eyebrow && (
              <div className="mb-7 flex items-center gap-3">
                <span className="h-px w-8 bg-line-strong" />
                <span className="text-eyebrow">{data.eyebrow}</span>
              </div>
            )}

            <AnimatedText as="h1" lines={data.heading} className="text-display text-[clamp(2.4rem,5.6vw,4rem)]" onScroll={false} />

            {data.text && <p className="mt-8 max-w-md text-[1.0625rem] leading-relaxed text-fg-muted">{data.text}</p>}

            <dl className="mt-14 space-y-8 border-t border-line pt-10">
              <div>
                <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-fg-subtle">Email</dt>
                <dd className="mt-2">
                  <a
                    href={`mailto:${settings.email}`}
                    className="group inline-flex items-center gap-1.5 text-[1.0625rem] text-fg transition-colors hover:text-accent-hi"
                  >
                    {settings.email}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </dd>
              </div>

              {settings.phone && (
                <div>
                  <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-fg-subtle">Phone</dt>
                  <dd className="mt-2">
                    <a href={phoneHref(settings.phone)} className="text-[1.0625rem] text-fg transition-colors hover:text-accent-hi">
                      {settings.phone}
                    </a>
                  </dd>
                </div>
              )}

              {location && (
                <div>
                  <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-fg-subtle">Studio</dt>
                  <dd className="mt-2 text-[1.0625rem] text-fg">
                    {location}
                    {data.studioNote && <span className="mt-1 block text-sm text-fg-subtle">{data.studioNote}</span>}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-lg border border-line bg-bg-secondary/40 p-7 lg:p-10">
              <ContactForm
                projectTypes={data.projectTypes}
                budgets={data.budgets}
                successTitle={data.successTitle}
                successText={data.successText}
                email={settings.email}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
