/** Formatting helpers shared by the site and the admin panel. */

/** Formats INR without decimals, e.g. ₹1,24,999. */
export function formatINR(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Yearly total for a monthly price after the yearly discount (in percent). */
export function yearlyPrice(monthlyPrice: number, discountPercent: number): number {
  return Math.round(monthlyPrice * 12 * (1 - discountPercent / 100));
}

/** Fixed locale keeps server and client output identical. */
export function formatInsightDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
