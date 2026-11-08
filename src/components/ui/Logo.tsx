import Image from "next/image";
import type { Brand } from "@/lib/cms/types";

/**
 * Wordmark with the logo mark. The name is set in two parts — the second in
 * the accent colour — so mark and wordmark read as the same two halves.
 * Edited in the admin panel under Brand.
 */
export function Logo({ brand, className }: { brand: Brand; className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className ?? ""}`}>
      {brand.logo && (
        <Image
          src={brand.logo}
          alt=""
          aria-hidden
          width={479}
          height={509}
          priority
          className="h-[30px] w-auto shrink-0"
        />
      )}
      <span className="text-[1.0625rem] font-semibold tracking-tight text-fg">
        {brand.wordFirst}
        {brand.wordSecond && <span className="text-accent-hi">{brand.wordSecond}</span>}
      </span>
    </span>
  );
}
