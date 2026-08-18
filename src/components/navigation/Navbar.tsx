"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LEFT, NAV_RIGHT } from "@/lib/constants/site";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { MobileMenu } from "./MobileMenu";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils/cn";

/**
 * Sticky nav with the wordmark centred and navigation split either side (§7).
 * Opaque white bar at every scroll position; gains a hairline shadow once
 * scrolled so it separates from the content passing beneath it.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu when the route changes. Tracked as derived state rather
  // than a setState-in-effect, which cascades an extra render.
  const [menuPathname, setMenuPathname] = useState(pathname);
  if (menuPathname !== pathname) {
    setMenuPathname(pathname);
    if (menuOpen) setMenuOpen(false);
  }

  // Prevent background scroll while the fullscreen menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-[100] bg-surface transition-all duration-500",
          scrolled ? "border-b border-line shadow-[0_1px_20px_rgba(12,24,50,0.08)]" : "border-b border-line/60",
        )}
      >
        <nav className="container-page flex h-[76px] items-center justify-between gap-8">
          {/* Left nav — desktop */}
          <ul className="hidden flex-1 items-center gap-8 lg:flex">
            {NAV_LEFT.map((link) => (
              <NavItem key={link.href} href={link.href} active={pathname === link.href}>
                {link.label}
              </NavItem>
            ))}
          </ul>

          {/* Centred wordmark */}
          <Link
            href="/"
            aria-label="BondByte — home"
            className="shrink-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2"
          >
            <Logo />
          </Link>

          {/* Right nav + CTA — desktop */}
          <div className="hidden flex-1 items-center justify-end gap-8 lg:flex">
            <ul className="flex items-center gap-8">
              {NAV_RIGHT.map((link) => (
                <NavItem key={link.href} href={link.href} active={pathname === link.href}>
                  {link.label}
                </NavItem>
              ))}
            </ul>
            <MagneticButton href="/contact" className="px-5 py-2.5 text-[0.8125rem]">
              Get in Touch
            </MagneticButton>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="relative z-[130] flex h-10 w-10 flex-col items-center justify-center gap-[5px] lg:hidden"
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
              className="block h-[1.5px] w-5 bg-fg"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
              className="block h-[1.5px] w-5 bg-fg"
            />
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

function NavItem({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "group relative font-mono text-[0.75rem] uppercase tracking-[0.12em] transition-colors duration-300",
          active ? "text-fg" : "text-fg-muted hover:text-fg",
        )}
      >
        <span className="text-accent-hi">{"//"}</span> {children}
        <span
          className={cn(
            "absolute -bottom-1.5 left-0 h-px bg-accent-hi transition-all duration-300",
            active ? "w-full" : "w-0 group-hover:w-full",
          )}
        />
      </Link>
    </li>
  );
}
