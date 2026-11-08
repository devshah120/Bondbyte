import "server-only";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import type { HistoryEntry } from "../types";
import { createQueue, readJson, writeFileAtomic, writeJsonAtomic } from "./files";

const MAX_VERSIONS = 150;
// Repeated saves of the same thing (moving a project up five times) within
// this time become one version, so small steps do not push older ones out.
const MERGE_WINDOW_MS = 2 * 60 * 1000;
const ID_PATTERN = /^\d{8}T\d{9}Z-[0-9a-f]{6}$/;

const makeId = (date: Date) => `${date.toISOString().replace(/[-:.]/g, "")}-${crypto.randomBytes(3).toString("hex")}`;

/** Saved versions of the content: one file per version plus an index of when and what. */
export function createHistory(historyDir: string) {
  const indexFile = path.join(historyDir, "index.json");
  let index: HistoryEntry[] = []; // newest first
  const serial = createQueue();
  const fileOf = (id: string) => path.join(historyDir, `${id}.json`);
  const saveIndex = () => writeJsonAtomic(indexFile, index);

  return {
    async load() {
      await fs.mkdir(historyDir, { recursive: true });
      const stored = await readJson<HistoryEntry[]>(indexFile).catch((err) => {
        console.warn(`Version history index could not be read, starting a new one: ${err.message}`);
        return null;
      });
      index = Array.isArray(stored) ? stored.filter((entry) => entry && ID_PATTERN.test(entry.id)) : [];
      if (!stored) await saveIndex();
    },

    list: () => index.map((entry) => ({ ...entry })),

    async read(id: string): Promise<unknown | null> {
      if (!ID_PATTERN.test(id) || !index.some((entry) => entry.id === id)) return null;
      return readJson(fileOf(id));
    },

    /** Saves `content` as the newest version. */
    record(content: unknown, { summary, key = null, restoredFrom }: { summary: string; key?: string | null; restoredFrom?: string }) {
      return serial(async () => {
        const now = new Date();
        const last = index[0];
        let entry: HistoryEntry;
        if (last && key && last.key === key && now.getTime() - new Date(last.savedAt).getTime() < MERGE_WINDOW_MS) {
          entry = { ...last, savedAt: now.toISOString(), summary };
          index[0] = entry;
        } else {
          entry = { id: makeId(now), savedAt: now.toISOString(), summary, key, ...(restoredFrom ? { restoredFrom } : {}) };
          index.unshift(entry);
        }
        await writeFileAtomic(fileOf(entry.id), JSON.stringify(content));
        const removed = index.splice(MAX_VERSIONS);
        await Promise.all(removed.map((old) => fs.unlink(fileOf(old.id)).catch(() => {})));
        await saveIndex();
        return entry;
      });
    },
  };
}

export type History = ReturnType<typeof createHistory>;
