import "server-only";
import crypto from "node:crypto";
import path from "node:path";
import { promisify } from "node:util";
import { CmsError } from "./errors";
import { readJson, writeJsonAtomic } from "./files";

const scrypt = promisify(crypto.scrypt) as (password: string, salt: Buffer, keylen: number) => Promise<Buffer>;

export const SESSION_COOKIE = "bb_admin";
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;
const KEY_LENGTH = 64;
export const USERNAME_PATTERN = /^[A-Za-z0-9._@-]{3,40}$/;
export const MIN_PASSWORD_LENGTH = 8;

interface StoredLogin {
  username: string;
  salt: string;
  hash: string;
  updatedAt: string;
}

const sha256 = (value: string) => crypto.createHash("sha256").update(String(value)).digest();
const sameText = (a: string, b: string) => crypto.timingSafeEqual(sha256(a), sha256(b));

export class AuthError extends CmsError {}

/**
 * One admin account with signed, expiring session tokens kept in an httpOnly
 * cookie. The login starts as the one in the environment (ADMIN_USERNAME and
 * ADMIN_PASSWORD); once the admin sets their own in the dashboard it is kept
 * (hashed) in data/auth.json and the environment login stops working.
 * Deleting that file brings it back.
 */
export function createAuth(options: { dataDir: string; adminUsername: string; adminPassword: string; tokenSecret: string; tokenTtlHours: number }) {
  const file = path.join(options.dataDir, "auth.json");
  const attempts = new Map<string, { count: number; resetAt: number }>();
  let stored: StoredLogin | null = null;

  const sign = (body: string) => crypto.createHmac("sha256", options.tokenSecret).update(body).digest();
  // Tokens carry a fingerprint of the login, so changing the password signs everyone out.
  const fingerprint = () =>
    sha256(stored ? `${stored.username}\n${stored.hash}` : `${options.adminUsername}\n${options.adminPassword}`)
      .toString("base64url")
      .slice(0, 16);

  const account = () =>
    stored ? { username: stored.username, source: "dashboard" as const, updatedAt: stored.updatedAt } : { username: options.adminUsername, source: "env" as const };

  async function passwordMatches(username: string, password: string): Promise<boolean> {
    if (stored) {
      const hash = await scrypt(String(password ?? ""), Buffer.from(stored.salt, "hex"), KEY_LENGTH);
      const passwordOk = crypto.timingSafeEqual(hash, Buffer.from(stored.hash, "hex"));
      return sameText(username ?? "", stored.username) && passwordOk;
    }
    const userOk = sameText(username ?? "", options.adminUsername);
    const passwordOk = sameText(password ?? "", options.adminPassword);
    return Boolean(options.adminPassword) && userOk && passwordOk;
  }

  function issueToken() {
    const expiresAt = Date.now() + options.tokenTtlHours * 60 * 60 * 1000;
    const body = Buffer.from(JSON.stringify({ sub: account().username, fp: fingerprint(), exp: expiresAt })).toString("base64url");
    return { token: `${body}.${sign(body).toString("base64url")}`, expiresAt };
  }

  function verifyToken(token: string | undefined): boolean {
    const [body, signature] = typeof token === "string" ? token.split(".") : [];
    if (!body || !signature) return false;
    const given = Buffer.from(signature, "base64url");
    const expected = sign(body);
    if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) return false;
    try {
      const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
      return payload.exp > Date.now() && payload.fp === fingerprint();
    } catch {
      return false;
    }
  }

  function checkLockout(ip: string) {
    const entry = attempts.get(ip);
    if (entry && entry.resetAt > Date.now() && entry.count >= MAX_ATTEMPTS) {
      throw new AuthError("Too many attempts. Please wait 15 minutes and try again.", 429);
    }
  }

  function recordFailure(ip: string) {
    const now = Date.now();
    const entry = attempts.get(ip);
    if (!entry || entry.resetAt <= now) attempts.set(ip, { count: 1, resetAt: now + ATTEMPT_WINDOW_MS });
    else entry.count += 1;
    if (attempts.size > 1000) {
      for (const [key, value] of attempts) if (value.resetAt <= now) attempts.delete(key);
    }
  }

  return {
    async load() {
      const saved = await readJson<StoredLogin>(file).catch((err) => {
        console.warn(`${file} could not be read, so the login from the environment is used: ${err.message}`);
        return null;
      });
      const valid = saved && USERNAME_PATTERN.test(saved.username) && /^[0-9a-f]{32}$/.test(saved.salt) && /^[0-9a-f]{128}$/.test(saved.hash);
      stored = valid ? saved : null;
    },

    canSignIn: () => Boolean(stored || options.adminPassword),
    account,
    verifyToken,

    async login(username: unknown, password: unknown, ip: string) {
      if (!stored && !options.adminPassword) {
        throw new AuthError("The admin password is not set. Add ADMIN_PASSWORD to the server environment and restart it.", 503);
      }
      checkLockout(ip);
      if (!(await passwordMatches(String(username ?? ""), String(password ?? "")))) {
        recordFailure(ip);
        throw new AuthError("Incorrect username or password.", 401);
      }
      attempts.delete(ip);
      return issueToken();
    },

    /** Changes the username and/or password. The current password is always required. */
    async changeAccount(input: { currentPassword?: unknown; username?: unknown; newPassword?: unknown }, ip: string) {
      checkLockout(ip);
      const currentPassword = String(input.currentPassword ?? "");
      if (!(await passwordMatches(account().username, currentPassword))) {
        recordFailure(ip);
        throw new AuthError("Your current password is not correct.", 400, "currentPassword");
      }
      const nextUsername = String(input.username ?? "").trim();
      if (!USERNAME_PATTERN.test(nextUsername)) {
        throw new AuthError("The username must be 3 to 40 characters: letters, numbers, dots, dashes, underscores or @.", 400, "username");
      }
      const password = String(input.newPassword ?? "");
      if (password && (password.length < MIN_PASSWORD_LENGTH || password.length > 200)) {
        throw new AuthError(`The new password must be at least ${MIN_PASSWORD_LENGTH} characters long.`, 400, "newPassword");
      }
      if (password && password.toLowerCase() === nextUsername.toLowerCase()) {
        throw new AuthError("The password cannot be the same as the username.", 400, "newPassword");
      }
      if (!password && nextUsername === account().username) {
        throw new AuthError("Enter a new username or a new password to change.", 400, "newPassword");
      }
      const salt = crypto.randomBytes(16);
      const hash = await scrypt(password || currentPassword, salt, KEY_LENGTH);
      const next: StoredLogin = { username: nextUsername, salt: salt.toString("hex"), hash: hash.toString("hex"), updatedAt: new Date().toISOString() };
      await writeJsonAtomic(file, next, { mode: 0o600 });
      stored = next;
      attempts.delete(ip);
      return { ...issueToken(), account: account() };
    },
  };
}

export type Auth = ReturnType<typeof createAuth>;

/** A few requests per visitor in a time window. */
export function createRateLimit({ max = 5, windowMs = 10 * 60 * 1000 } = {}) {
  const hits = new Map<string, { count: number; resetAt: number }>();
  return (key: string) => {
    const now = Date.now();
    const entry = hits.get(key);
    if (!entry || entry.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      if (hits.size > 5000) for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
      return true;
    }
    entry.count += 1;
    return entry.count <= max;
  };
}
