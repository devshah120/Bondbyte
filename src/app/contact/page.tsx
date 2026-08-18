import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { ContactForm } from "@/components/sections/ContactForm";
import { AnimatedText } from "@/components/animations/AnimatedText";
import { SITE } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us what you're building. BondByte designs and engineers digital products from Ahmedabad, working with teams anywhere.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section className="relative pt-40 pb-28 lg:pt-48 lg:pb-40">
      <div className="bg-grid absolute inset-x-0 top-0 h-[32rem] opacity-40 [mask-image:linear-gradient(to_bottom,#000,transparent)]" />

      <div className="container-page relative">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-8 bg-line-strong" />
              <span className="text-eyebrow">Contact</span>
            </div>

            <AnimatedText
              as="h1"
              lines={["Tell us what", "you're building."]}
              className="text-display text-[clamp(2.4rem,5.6vw,4rem)]"
              onScroll={false}
            />

            <p className="mt-8 max-w-md text-[1.0625rem] leading-relaxed text-fg-muted">
              Whether it is a rough idea or a product already in flight, send us
              the details. We read every message and reply personally.
            </p>

            <dl className="mt-14 space-y-8 border-t border-line pt-10">
              <div>
                <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-fg-subtle">
                  Email
                </dt>
                <dd className="mt-2">
                  <a
                    href={`mailto:${SITE.email}`}
                    className="group inline-flex items-center gap-1.5 text-[1.0625rem] text-fg transition-colors hover:text-accent-hi"
                  >
                    {SITE.email}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </dd>
              </div>

              <div>
                <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-fg-subtle">
                  Phone
                </dt>
                <dd className="mt-2">
                  <a
                    href={SITE.phoneHref}
                    className="text-[1.0625rem] text-fg transition-colors hover:text-accent-hi"
                  >
                    {SITE.phone}
                  </a>
                </dd>
              </div>

              <div>
                <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-fg-subtle">
                  Studio
                </dt>
                <dd className="mt-2 text-[1.0625rem] text-fg">
                  {SITE.location.city}, {SITE.location.region}
                  <span className="mt-1 block text-sm text-fg-subtle">
                    Working with teams across time zones.
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-lg border border-line bg-bg-secondary/40 p-7 lg:p-10">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
