import Image from "next/image";

/**
 * Udyam / MSME registration badge — the official certificate logo.
 *
 * The asset ships with a white background, so it sits on a white plate rather
 * than the dark footer band. Intrinsic size is 900×495; rendered at a fixed
 * height with `w-auto` so the ratio is never distorted.
 */
export function UdyamMark() {
  return (
    <Image
      src="/images/msme-logo.png"
      alt="Udyam registered — Ministry of MSME, Government of India"
      width={900}
      height={495}
      sizes="80px"
      className="h-10 w-auto rounded-sm bg-white p-1"
    />
  );
}
