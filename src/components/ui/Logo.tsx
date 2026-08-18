/**
 * BondByte wordmark with a pixel-block mark.
 *
 * The mark reads as bytes/data blocks — a nod to the name — and stays legible
 * at nav size. Pure SVG so it scales and needs no image request.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        aria-hidden
        className="shrink-0"
      >
        {/* Ascending byte blocks */}
        <rect x="2" y="17" width="6" height="6" rx="1.2" fill="var(--color-accent-dim)" />
        <rect x="9.5" y="12" width="6" height="6" rx="1.2" fill="var(--color-accent)" />
        <rect x="17" y="7" width="6" height="6" rx="1.2" fill="var(--color-accent-hi)" />
        <rect x="24.5" y="2" width="4" height="4" rx="1" fill="var(--color-accent-hi)" opacity="0.55" />
        <rect x="9.5" y="20.5" width="4" height="4" rx="1" fill="var(--color-accent)" opacity="0.4" />
      </svg>
      <span className="text-[1.0625rem] font-semibold tracking-tight text-fg">
        Bond<span className="text-accent-hi">Byte</span>
      </span>
    </span>
  );
}
