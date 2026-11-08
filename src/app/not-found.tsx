import Link from "next/link";

/**
 * Fallback for addresses no route matches at all. Pages inside the site use
 * (site)/not-found.tsx, which keeps the header and footer.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-svh items-center">
      <div className="container-page">
        <span className="text-eyebrow">Error 404</span>
        <h1 className="text-display mt-6 text-[clamp(2.5rem,8vw,5rem)]">This page doesn&apos;t exist.</h1>
        <Link href="/" className="mt-10 inline-flex rounded-full border border-line-strong px-6 py-3 text-sm font-medium text-fg">
          Back home
        </Link>
      </div>
    </main>
  );
}
