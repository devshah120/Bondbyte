import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { NAV_LINKS, SITE, SOCIALS } from "@/lib/constants/site";
import { SERVICES } from "@/lib/constants/company";
import { UdyamMark } from "@/components/ui/UdyamMark";

/** Server component — no interactivity, so no client bundle cost. */
export function Footer() {
  const year = new Date().getFullYear();
  const socials = SOCIALS.filter(
    (s): s is { label: string; url: string } => s.url !== null,
  );

  return (
    <footer data-band="dark" className="relative overflow-hidden border-t border-line">
      <div className="container-page pt-20">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="text-lg font-semibold tracking-tight">
              Bond<span className="text-accent-hi">Byte</span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-fg-muted">
              Strategy, design and engineering under one roof. Built in{" "}
              {SITE.location.city}, working with teams anywhere.
            </p>
            <a
              href={`mailto:${SITE.email}`}
              className="group mt-7 inline-flex items-center gap-1.5 text-sm text-fg transition-colors hover:text-accent-hi"
            >
              {SITE.email}
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          <FooterColumn title="Navigate">
            {NAV_LINKS.map((link) => (
              <FooterLink key={link.href} href={link.href}>
                {link.label}
              </FooterLink>
            ))}
            <FooterLink href="/insights">Insights</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
          </FooterColumn>

          <FooterColumn title="Services">
            {SERVICES.slice(0, 6).map((service) => (
              <FooterLink key={service.index} href="/services">
                {service.title}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Contact">
            <li>
              <a
                href={SITE.phoneHref}
                className="text-sm text-fg-muted transition-colors hover:text-fg"
              >
                {SITE.phone}
              </a>
            </li>
            <li className="text-sm text-fg-muted">
              {SITE.location.city}, {SITE.location.region}
            </li>
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-fg-muted transition-colors hover:text-fg"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </FooterColumn>
        </div>

        {/* Legal / registration strip */}
        <div className="mt-16 flex flex-col gap-6 border-t border-line pt-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-fg-subtle">
            <span>
              © {year} {SITE.legalName}
            </span>
            <span aria-hidden>·</span>
            <Link href="/privacy" className="transition-colors hover:text-fg">
              Privacy
            </Link>
            <span aria-hidden>·</span>
            <Link href="/terms" className="transition-colors hover:text-fg">
              Terms
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-fg-subtle">
            <span>UDYAM-GJ-01-0132398</span>
            <span aria-hidden>·</span>
            <UdyamMark />
          </div>
        </div>
      </div>

      {/* Oversized wordmark — bleeds to the edges and is clipped at the base */}
      <div aria-hidden className="relative mt-10 select-none overflow-hidden">
        <span className="block whitespace-nowrap px-2 text-center text-[19vw] font-bold leading-[0.78] tracking-[-0.045em] text-fg/[0.07] lg:text-[15.5vw]">
          BondByte
        </span>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-eyebrow mb-5">{title}</h3>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-fg-muted transition-colors duration-300 hover:text-fg"
      >
        {children}
      </Link>
    </li>
  );
}
