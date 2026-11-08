import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { defaultContent } from "../defaults";
import { normalizeContent } from "../content";
import { SCHEMA_VERSION } from "../schema";
import type { SiteContent } from "../types";
import { createQueue, readJson, writeJsonAtomic } from "./files";
import type { History } from "./history";

export interface Change {
  summary: string;
  mergeKey?: string | null;
}

/**
 * JSON file database. The whole site content lives in data/content.json and
 * is kept in memory. Writes are queued and written atomically, and every save
 * is also kept as a version in the history.
 *
 * Reads check the file's modification time, so a hand edit (or a restore of a
 * backup) is picked up without restarting the server.
 */
export function createStore(dataDir: string, history: History) {
  const file = path.join(dataDir, "content.json");
  let content: SiteContent | null = null;
  let loadedMtime = 0;
  const serial = createQueue();

  async function mtime(): Promise<number> {
    try {
      return (await fs.stat(file)).mtimeMs;
    } catch {
      return 0;
    }
  }

  async function load(): Promise<SiteContent> {
    await fs.mkdir(dataDir, { recursive: true });
    const stored = await readJson<Record<string, unknown>>(file);
    if (stored) {
      content = normalizeContent(stored);
      if ((Number(stored.schemaVersion) || 0) < SCHEMA_VERSION) {
        await writeJsonAtomic(file, content);
        console.log(`Updated ${file} to content version ${SCHEMA_VERSION}.`);
      }
    } else {
      content = defaultContent();
      await writeJsonAtomic(file, content);
      console.log(`Created ${file} with the starting content.`);
    }
    loadedMtime = await mtime();
    // The current content is always the newest version in the history.
    await history.load();
    if (history.list().length === 0) await history.record(content, { summary: "Version history started" });
    return content;
  }

  return {
    async get(): Promise<SiteContent> {
      if (!content) return serial(() => (content ? Promise.resolve(content) : load()));
      const current = await mtime();
      if (current && current !== loadedMtime) {
        return serial(async () => {
          const stored = await readJson(file).catch(() => null);
          if (stored) content = normalizeContent(stored);
          loadedMtime = current;
          return content as SiteContent;
        });
      }
      return content;
    },

    /**
     * `mutate` changes a copy of the content and may throw to cancel the save.
     * `keys` are the parts being saved: their revision numbers go up by one.
     */
    update(
      mutate: (next: SiteContent) => void,
      options: { keys?: string[]; describe?: (before: SiteContent, after: SiteContent) => Change; restoredFrom?: string } = {},
    ): Promise<SiteContent> {
      return serial(async () => {
        if (!content) await load();
        const before = content as SiteContent;
        const next = structuredClone(before);
        mutate(next);
        next.updatedAt = new Date().toISOString();
        next.revisions = { ...next.revisions };
        for (const key of options.keys ?? []) next.revisions[key] = (next.revisions[key] || 0) + 1;
        await writeJsonAtomic(file, next);
        content = next;
        loadedMtime = await mtime();
        const { summary = "Content saved", mergeKey = null } = options.describe ? options.describe(before, next) : {};
        await history
          .record(next, { summary, key: mergeKey, restoredFrom: options.restoredFrom })
          .catch((err) => console.warn(`Version not saved in the history: ${err.message}`));
        return next;
      });
    },
  };
}

export type Store = ReturnType<typeof createStore>;
