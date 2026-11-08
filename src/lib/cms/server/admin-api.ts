import "server-only";
import { NextResponse } from "next/server";
import { normalizeContent } from "../content";
import {
  COLLECTIONS,
  HOME_PAGE_ID,
  OBJECTS,
  itemLabel,
  pageSlugError,
  sectionLabel,
  validateCollection,
  validateObject,
  validatePage,
} from "../schema";
import type { CollectionKey, ObjectKey, Page, SiteContent } from "../types";
import { SESSION_COOKIE } from "./auth";
import { isCmsError } from "./errors";
import { describeListChange, describeObjectChange, describePageChange } from "./changes";
import { config } from "./config";
import { cms } from "./index";

/** Custom header every admin request must carry: a cross-site form or image tag cannot add it. */
export const ADMIN_HEADER = "x-bondbyte-admin";

class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public extra: Record<string, unknown> = {},
  ) {
    super(message);
  }
}
class ConflictError extends Error {}
class InvalidError extends Error {}

const json = (data: unknown, status = 200) => NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
const pageKey = (id: string) => `page:${id}`;
const ID_PATTERN = /^[\w-]{1,40}$/;

export function clientIp(request: Request): string {
  return request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

async function readBody(request: Request): Promise<Record<string, unknown>> {
  try {
    const body = await request.json();
    return body && typeof body === "object" ? body : {};
  } catch {
    throw new HttpError(400, "The request was not valid JSON.");
  }
}

function setSessionCookie(response: NextResponse, token: string, expiresAt: number) {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: config.secureCookies,
    path: "/",
    expires: new Date(expiresAt),
  });
  return response;
}

/** Where an uploaded file is used, as readable places. */
function mediaUsage(content: SiteContent, url: string): string[] {
  const places: string[] = [];
  const has = (value: unknown) => JSON.stringify(value ?? null).includes(url);
  for (const key of Object.keys(OBJECTS) as ObjectKey[]) if (has(content[key])) places.push(OBJECTS[key].title);
  for (const key of Object.keys(COLLECTIONS) as CollectionKey[]) {
    const def = COLLECTIONS[key];
    for (const item of content[key] as unknown as Record<string, unknown>[]) {
      if (has(item)) places.push(`${def.title}: "${itemLabel(def, item)}"`);
    }
  }
  for (const page of content.pages) {
    for (const section of page.sections) if (has(section.data)) places.push(`Page "${page.title}", ${sectionLabel(section.type)}`);
  }
  return places;
}

/** Handles /api/admin/<path>. */
export async function handleAdmin(request: Request, path: string[]): Promise<Response> {
  try {
    return await route(request, path);
  } catch (err) {
    if (err instanceof HttpError) return json({ error: err.message, ...err.extra }, err.status);
    if (isCmsError(err)) return json({ error: err.message, field: err.field }, err.status);
    console.error(err);
    return json({ error: "Something went wrong on the server. Please try again." }, 500);
  }
}

async function route(request: Request, path: string[]): Promise<Response> {
  const { store, auth, media, history, inquiries } = await cms();
  const method = request.method;
  const [section, id, action] = path;
  const ip = clientIp(request);

  if (method !== "GET" && request.headers.get(ADMIN_HEADER) !== "1") {
    throw new HttpError(403, "This request was not sent by the admin panel.");
  }

  const token = request.headers
    .get("cookie")
    ?.split(/;\s*/)
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`))
    ?.slice(SESSION_COOKIE.length + 1);
  const signedIn = auth.verifyToken(token ? decodeURIComponent(token) : undefined);

  // ── Session ──
  if (section === "session" && method === "GET") {
    return json({ signedIn, canSignIn: auth.canSignIn(), account: signedIn ? auth.account() : null });
  }
  if (section === "login" && method === "POST") {
    const body = await readBody(request);
    const session = await auth.login(body.username, body.password, ip);
    return setSessionCookie(json({ ok: true, account: auth.account() }), session.token, session.expiresAt);
  }
  if (section === "logout" && method === "POST") {
    const response = json({ ok: true });
    response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, sameSite: "strict", secure: config.secureCookies, path: "/", maxAge: 0 });
    return response;
  }

  if (!signedIn) throw new HttpError(401, "Your session has expired. Please sign in again.");

  // Saves one part of the content. `base` is the revision the admin started
  // from: when the same part was saved in the meantime (another tab or
  // device), the save is refused instead of overwriting it.
  async function save(key: string, base: unknown, apply: (next: SiteContent) => void, describe: (before: SiteContent, after: SiteContent) => { summary: string; mergeKey?: string | null }) {
    try {
      const content = await store.update(
        (next) => {
          if (base !== undefined && base !== null && Number(base) !== (next.revisions?.[key] || 0)) throw new ConflictError();
          apply(next);
        },
        { keys: [key], describe },
      );
      return json(content);
    } catch (err) {
      if (err instanceof ConflictError) {
        throw new HttpError(409, "This was changed in another tab or on another device. Reload to get the latest version, then make your change again.");
      }
      if (err instanceof InvalidError) throw new HttpError(400, err.message);
      throw err;
    }
  }

  switch (section) {
    case "content":
      if (method === "GET") return json(await store.get());
      break;

    case "overview":
      if (method === "GET") {
        const content = await store.get();
        return json({ newInquiries: inquiries.newCount(), recent: history.list().slice(0, 6), updatedAt: content.updatedAt });
      }
      break;

    // ── Singletons ──
    case "objects": {
      if (method !== "PUT" || !id) break;
      if (!Object.hasOwn(OBJECTS, id)) throw new HttpError(404, "Unknown part of the site.");
      const key = id as ObjectKey;
      const body = await readBody(request);
      const result = validateObject(key, body.value);
      if (!result.ok) throw new HttpError(400, result.error ?? "Please check the form.", { errors: result.errors });
      return save(
        key,
        body.base,
        (next) => {
          (next as unknown as Record<string, unknown>)[key] = result.value;
        },
        (before, after) => describeObjectChange(key, before[key], after[key]),
      );
    }

    // ── Collections ──
    case "collections": {
      if (method !== "PUT" || !id) break;
      if (!Object.hasOwn(COLLECTIONS, id)) throw new HttpError(404, "Unknown list.");
      const key = id as CollectionKey;
      const body = await readBody(request);
      const result = validateCollection(key, body.items);
      if (!result.ok) throw new HttpError(400, result.error ?? "Please check the list.");
      return save(
        key,
        body.base,
        (next) => {
          (next as unknown as Record<string, unknown>)[key] = result.value;
        },
        (before, after) => {
          type Items = Parameters<typeof describeListChange>[1];
          return describeListChange(key, before[key] as unknown as Items, after[key] as unknown as Items);
        },
      );
    }

    // ── Pages ──
    case "pages": {
      if (!id || !ID_PATTERN.test(id)) throw new HttpError(404, "Unknown page.");
      if (method === "PUT") {
        const body = await readBody(request);
        const result = validatePage(body.value, id, (await store.get()).pages);
        if (!result.ok || !result.value) throw new HttpError(400, result.error ?? "Please check the page.");
        const value = result.value;
        return save(
          pageKey(id),
          body.base,
          (next) => {
            // Checked again here: another page may have taken the address in the meantime.
            const slugError = pageSlugError(value.slug, id, next.pages);
            if (slugError) throw new InvalidError(slugError);
            const page: Page = { id, ...value, updatedAt: new Date().toISOString() };
            const index = next.pages.findIndex((entry) => entry.id === id);
            if (index === -1) next.pages.push(page);
            else next.pages[index] = page;
          },
          (before, after) => describePageChange(before.pages.find((page) => page.id === id), after.pages.find((page) => page.id === id)),
        );
      }
      if (method === "DELETE") {
        if (id === HOME_PAGE_ID) throw new HttpError(400, "The home page cannot be deleted.");
        if (!(await store.get()).pages.some((page) => page.id === id)) throw new HttpError(404, "This page no longer exists.");
        const content = await store.update(
          (next) => {
            next.pages = next.pages.filter((page) => page.id !== id);
          },
          { keys: [pageKey(id)], describe: (before) => describePageChange(before.pages.find((page) => page.id === id), undefined) },
        );
        return json(content);
      }
      break;
    }

    // ── Media library ──
    case "media": {
      const content = await store.get();
      const withUsage = <T extends { url: string }>(item: T) => ({ ...item, usedIn: mediaUsage(content, item.url) });
      if (!id && method === "GET") return json(media.list().map(withUsage));
      if (!id && method === "POST") {
        const length = Number(request.headers.get("content-length") || 0);
        const limit = config.maxUploadMb * 1024 * 1024;
        if (length > limit) throw new HttpError(413, `This file is larger than ${config.maxUploadMb} MB. Please choose a smaller file.`);
        const buffer = Buffer.from(await request.arrayBuffer());
        if (buffer.length === 0) throw new HttpError(400, "The file is empty.");
        if (buffer.length > limit) throw new HttpError(413, `This file is larger than ${config.maxUploadMb} MB. Please choose a smaller file.`);
        const name = new URL(request.url).searchParams.get("name") || "image";
        try {
          return json(withUsage(await media.add(buffer, name)), 201);
        } catch (err) {
          if (isCmsError(err)) throw new HttpError(err.status, err.message);
          throw err;
        }
      }
      if (id && method === "PATCH") {
        const body = await readBody(request);
        const item = await media.rename(id, body.name);
        if (!item) throw new HttpError(404, "This file no longer exists.");
        return json(withUsage(item));
      }
      if (id && method === "DELETE") {
        const item = media.get(id);
        if (!item) throw new HttpError(404, "This file no longer exists.");
        const usedIn = mediaUsage(content, item.url);
        if (usedIn.length > 0) {
          throw new HttpError(409, `This file is still used in: ${usedIn.join(", ")}. Choose another file there first.`, { usedIn });
        }
        await media.remove(item.id);
        return json({ ok: true });
      }
      break;
    }

    // ── Inquiries ──
    case "inquiries": {
      if (!id && method === "GET") return json(inquiries.list());
      if (id && method === "PATCH") {
        const body = await readBody(request);
        try {
          const item = await inquiries.setStatus(id, body.status);
          if (!item) throw new HttpError(404, "This inquiry no longer exists.");
          return json(item);
        } catch (err) {
          if (isCmsError(err)) throw new HttpError(err.status, err.message);
          throw err;
        }
      }
      if (id && method === "DELETE") {
        if (!(await inquiries.remove(id))) throw new HttpError(404, "This inquiry no longer exists.");
        return json({ ok: true });
      }
      break;
    }

    // ── Version history ──
    case "history": {
      if (!id && method === "GET") return json(history.list());
      if (id && !action && method === "GET") {
        const snapshot = await history.read(id);
        if (!snapshot) throw new HttpError(404, "This version no longer exists.");
        return json(normalizeContent(snapshot));
      }
      if (id && action === "restore" && method === "POST") {
        const entry = history.list().find((item) => item.id === id);
        const snapshot = entry && (await history.read(entry.id));
        if (!entry || !snapshot) throw new HttpError(404, "This version no longer exists.");
        const restored = normalizeContent(snapshot);
        const values: Record<string, unknown> = {};
        for (const key of Object.keys(OBJECTS) as ObjectKey[]) {
          const result = validateObject(key, restored[key]);
          if (!result.ok) throw new HttpError(400, `This version cannot be restored: ${result.error}`);
          values[key] = result.value;
        }
        for (const key of Object.keys(COLLECTIONS) as CollectionKey[]) {
          const result = validateCollection(key, restored[key]);
          if (!result.ok) throw new HttpError(400, `This version cannot be restored: ${result.error}`);
          values[key] = result.value;
        }
        const pages: Page[] = [];
        for (const page of restored.pages) {
          const result = validatePage(page, page.id, restored.pages);
          if (!result.ok || !result.value) throw new HttpError(400, `This version cannot be restored: page "${page.title}": ${result.error}`);
          pages.push({ id: page.id, ...result.value, ...(page.updatedAt ? { updatedAt: page.updatedAt } : {}) });
        }
        values.pages = pages;
        // Every page that changes counts as saved, so an editor open elsewhere does not overwrite it.
        const current = await store.get();
        const pageKeys = [...new Set([...current.pages, ...pages].map((page) => pageKey(page.id)))];
        const content = await store.update(
          (next) => {
            Object.assign(next, values);
          },
          {
            keys: [...Object.keys(OBJECTS), ...Object.keys(COLLECTIONS), ...pageKeys],
            describe: () => ({ summary: "Restored an earlier version", mergeKey: null }),
            restoredFrom: entry.savedAt,
          },
        );
        return json(content);
      }
      break;
    }

    // ── Admin login ──
    case "account": {
      if (method === "GET") return json(auth.account());
      if (method === "PUT") {
        const body = await readBody(request);
        const session = await auth.changeAccount(body, ip);
        return setSessionCookie(json({ ok: true, account: session.account }), session.token, session.expiresAt);
      }
      break;
    }
  }

  throw new HttpError(404, "Not found.");
}
