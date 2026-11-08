import { handleAdmin } from "@/lib/cms/server/admin-api";

/**
 * The admin panel API: /api/admin/<path>. One file routes every request so
 * the session and same-origin checks live in one place
 * (src/lib/cms/server/admin-api.ts).
 */

type Context = { params: Promise<{ path: string[] }> };

async function handle(request: Request, context: Context) {
  const { path } = await context.params;
  return handleAdmin(request, path);
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
