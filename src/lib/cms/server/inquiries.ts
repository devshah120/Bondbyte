import "server-only";
import crypto from "node:crypto";
import path from "node:path";
import type { Inquiry, InquiryStatus } from "../types";
import { CmsError } from "./errors";
import { createQueue, readJson, writeJsonAtomic } from "./files";

const MAX_STORED = 5000;
const STATUSES = new Set<InquiryStatus>(["new", "read", "archived"]);
const ID_PATTERN = /^[0-9a-f]{16}$/;

export class InquiryError extends CmsError {}

/**
 * Messages from the contact form, kept in data/inquiries.json (newest first).
 * They are not part of the site content, so restoring an earlier version of
 * the content never removes them.
 */
export function createInquiries(dataDir: string) {
  const file = path.join(dataDir, "inquiries.json");
  let items: Inquiry[] = [];
  const serial = createQueue();
  const save = () => writeJsonAtomic(file, items);

  return {
    async load() {
      const stored = await readJson<Inquiry[]>(file).catch((err) => {
        console.warn(`${file} could not be read: ${err.message}`);
        return null;
      });
      items = Array.isArray(stored) ? stored.filter((item) => item && ID_PATTERN.test(item.id)) : [];
    },

    list: () => items.map((item) => ({ ...item })),

    newCount: () => items.filter((item) => item.status === "new").length,

    add(values: Omit<Inquiry, "id" | "status" | "createdAt">) {
      return serial(async () => {
        const item: Inquiry = { id: crypto.randomBytes(8).toString("hex"), ...values, status: "new", createdAt: new Date().toISOString() };
        items.unshift(item);
        items.splice(MAX_STORED);
        await save();
        return { ...item };
      });
    },

    setStatus(id: string, status: unknown) {
      return serial(async () => {
        if (!STATUSES.has(status as InquiryStatus)) throw new InquiryError("Unknown status.");
        const item = items.find((entry) => entry.id === id);
        if (!item) return null;
        item.status = status as InquiryStatus;
        await save();
        return { ...item };
      });
    },

    remove(id: string) {
      return serial(async () => {
        const index = items.findIndex((entry) => entry.id === id);
        if (index === -1) return false;
        items.splice(index, 1);
        await save();
        return true;
      });
    },
  };
}

export type Inquiries = ReturnType<typeof createInquiries>;
