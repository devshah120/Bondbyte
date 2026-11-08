import "server-only";
import crypto from "node:crypto";
import path from "node:path";

/**
 * Server settings from environment variables (see .env.example).
 *
 * Everything the admin creates lives in DATA_DIR: content, inquiries, uploads,
 * version history and the admin login. In production point it at a folder
 * outside the deployed release so deploys never touch it.
 */

const env = process.env;
const globalForSecret = globalThis as unknown as { __bbTokenSecret?: string };

export const config = {
  // Read at runtime, never bundled: the ignore hint keeps the build from tracing the whole project.
  dataDir: path.resolve(/*turbopackIgnore: true*/ env.DATA_DIR || path.join(process.cwd(), "data")),
  get uploadsDir() {
    return path.join(this.dataDir, "uploads");
  },
  get historyDir() {
    return path.join(this.dataDir, "history");
  },
  adminUsername: env.ADMIN_USERNAME || "admin",
  adminPassword: env.ADMIN_PASSWORD || "",
  // Without TOKEN_SECRET, sessions are signed with a key that lasts until the server restarts.
  tokenSecret: env.TOKEN_SECRET || (globalForSecret.__bbTokenSecret ??= crypto.randomBytes(32).toString("hex")),
  tokenSecretIsRandom: !env.TOKEN_SECRET,
  tokenTtlHours: Number(env.TOKEN_TTL_HOURS) || 12,
  maxUploadMb: Number(env.MAX_UPLOAD_MB) || 10,
  secureCookies: env.NODE_ENV === "production" && env.INSECURE_COOKIES !== "true",
};
