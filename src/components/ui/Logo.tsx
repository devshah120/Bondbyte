/**
 * BondByte wordmark.
 *
 * Type-only mark — the accent colour on "Byte" carries the brand at nav size.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={`flex items-center ${className ?? ""}`}>
      <span className="text-[1.0625rem] font-semibold tracking-tight text-fg">
        Bond<span className="text-accent-hi">Byte</span>
      </span>
    </span>
  );
}
