import "server-only";

/**
 * An error whose message is meant for the person using the site or panel.
 *
 * Next bundles each route separately, so the stores (created once and kept
 * on globalThis) may throw an error class from a different bundle than the
 * one a route imports. `instanceof` fails across bundles, so errors are
 * recognised by a brand property instead: always use `isCmsError`.
 */
export class CmsError extends Error {
  readonly isCmsError = true;

  constructor(
    message: string,
    public status = 400,
    public field?: string,
  ) {
    super(message);
  }
}

export function isCmsError(err: unknown): err is CmsError {
  return typeof err === "object" && err !== null && (err as { isCmsError?: unknown }).isCmsError === true;
}
