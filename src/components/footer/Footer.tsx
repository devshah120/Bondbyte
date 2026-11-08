import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { SiteContent } from "@/lib/cms/types";
import { fillTokens, phoneHref, tokenValues } from "@/lib/cms/content";
import { UdyamMark } from "@/components/ui/UdyamMark";

/** Server component — no interactivity, so no client bundle cost. Edited under Footer. */
export function Footer({ content }: { content: SiteContent }) {
  const { footer, settings, brand, services } = content;
  const year = new Date().getFullYear();
  const location = [settings.city, settings.region].filter(Boolean).join(", ");
  const shownServices = services.slice(0, footer.servicesCount);

  return (
    <footer data-band="dark" className="relative overflow-hidden border-t border-line">
      <div className="container-page pt-20">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="text-lg font-semibold tracking-tight">
              {brand.wordFirst}
              {brand.wordSecond && <span className="text-accent-hi">{brand.wordSecond}</span>}
            </Link>
            {footer.blurb && (
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-fg-muted">
                {fillTokens(footer.blurb, tokenValues(content))}
              </p>
            )}
            <a
              href={`mailto:${settings.email}`}
              className="group mt-7 inline-flex items-center gap-1.5 text-sm text-fg transition-colors hover:text-accent-hi"
            >
              {settings.email}
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          {footer.navLinks.length > 0 && (
            <FooterColumn title={footer.navTitle}>
              {footer.navLinks.map((link) => (
                <FooterLink key={link.id} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </FooterColumn>
          )}

          {shownServices.length > 0 && (
            <FooterColumn title={footer.servicesTitle}>
              {shownServices.map((service) => (
                <FooterLink key={service.id} href="/services">
                  {service.title}
                </FooterLink>
              ))}
            </FooterColumn>
          )}

          <FooterColumn title={footer.contactTitle}>
            {settings.phone && (
              <li>
                <a
                  href={phoneHref(settings.phone)}
                  className="text-sm text-fg-muted transition-colors hover:text-fg"
                >
                  {settings.phone}
                </a>
              </li>
            )}
            {location && <li className="text-sm text-fg-muted">{location}</li>}
            {footer.socials.map((social) => (
              <li key={social.id}>
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
              © {year} {settings.legalName}
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

          {(settings.registration || footer.showUdyamMark) && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-fg-subtle">
              {settings.registration && <span>{settings.registration}</span>}
              {settings.registration && footer.showUdyamMark && <span aria-hidden>·</span>}
              {footer.showUdyamMark && <UdyamMark />}
            </div>
          )}
        </div>
      </div>

      {/* Oversized wordmark — bleeds to the edges and is clipped at the base */}
      {footer.wordmark && (
        <div aria-hidden className="relative mt-10 select-none overflow-hidden">
          <span className="block whitespace-nowrap px-2 text-center text-[19vw] font-bold leading-[0.78] tracking-[-0.045em] text-fg/[0.07] lg:text-[15.5vw]">
            {footer.wordmark}
          </span>
        </div>
      )}
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
      {title && <h3 className="text-eyebrow mb-5">{title}</h3>}
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
