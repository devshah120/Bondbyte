import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80svh] items-center overflow-hidden pt-32">
      <div className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,#000_10%,transparent_70%)]" />

      <div className="container-page relative">
        <span className="text-eyebrow">Error 404</span>
        <h1 className="text-display mt-6 text-[clamp(2.5rem,8vw,5rem)]">
          This page
          <br />
          doesn&apos;t exist.
        </h1>
        <p className="mt-7 max-w-md text-[1.0625rem] leading-relaxed text-fg-muted">
          The link may be out of date, or the page may have moved.
        </p>
        <Link
          href="/"
          className="group mt-10 inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 text-sm font-medium text-fg transition-colors hover:bg-white/[0.04]"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          Back home
        </Link>
      </div>
    </section>
  );
}
