import Image from "next/image";

/**
 * BondByte wordmark with the "bb" monogram.
 *
 * The mark is two overlapping b-forms: the left carries the "Bond" colour,
 * the right the "Byte" accent, so mark and wordmark read as the same two
 * halves.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <Image
        src="/images/logo-mark.png"
        alt=""
        aria-hidden
        width={479}
        height={509}
        priority
        className="h-[30px] w-auto shrink-0"
      />
      <span className="text-[1.0625rem] font-semibold tracking-tight text-fg">
        Bond<span className="text-accent-hi">Byte</span>
      </span>
    </span>
  );
}
