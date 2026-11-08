import fs from "node:fs/promises";
import path from "node:path";
import { config } from "@/lib/cms/server/config";
import { MEDIA_TYPES, UPLOAD_FILE_PATTERN } from "@/lib/cms/server/media";

type Context = { params: Promise<{ file: string }> };

/**
 * Files uploaded in the media library, served from data/uploads.
 *
 * Names are unique, so files are cached for a year. SVGs get a strict policy
 * so a file opened on its own can never run anything. In production nginx
 * can serve this folder directly (see deploy/nginx-bondbyte.conf).
 */
export async function GET(_request: Request, context: Context) {
  const { file } = await context.params;
  if (!UPLOAD_FILE_PATTERN.test(file)) return new Response("Not found", { status: 404 });

  let data: Buffer;
  try {
    data = await fs.readFile(path.join(config.uploadsDir, file));
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const extension = file.slice(file.lastIndexOf(".") + 1);
  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": MEDIA_TYPES[extension] ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; sandbox",
    },
  });
}
