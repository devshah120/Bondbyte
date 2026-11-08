import "server-only";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import type { MediaItem } from "../types";
import { CmsError } from "./errors";
import { createQueue, readJson, writeJsonAtomic } from "./files";

export class MediaError extends CmsError {}

export const MEDIA_TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
  ico: "image/x-icon",
  avif: "image/avif",
};

/** Uploaded file names: readable part, 12-hex id, extension. */
export const UPLOAD_FILE_PATTERN = /^[a-z0-9-]{1,60}-[0-9a-f]{12}\.(png|jpg|webp|gif|svg|ico|avif)$/;
const ID_PATTERN = /^[0-9a-f]{12}$/;
const BOM = String.fromCharCode(0xfeff);

/** The real file type from the first bytes. The file name is never trusted. */
export function sniffFile(buffer: Buffer): string | null {
  if (buffer.length >= 8 && buffer.readUInt32BE(0) === 0x89504e47) return "png";
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "jpg";
  if (buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") return "webp";
  if (buffer.length >= 6 && /^GIF8[79]a$/.test(buffer.toString("ascii", 0, 6))) return "gif";
  if (buffer.length >= 6 && buffer.readUInt32BE(0) === 0x00000100) return "ico";
  if (buffer.length >= 12 && buffer.toString("ascii", 4, 8) === "ftyp" && /^avi[fs]$/.test(buffer.toString("ascii", 8, 12))) return "avif";
  const head = buffer.toString("utf8", 0, Math.min(buffer.length, 2000)).replace(BOM, "").trimStart();
  if (/^(<\?xml[^>]*>\s*)?(<!--[\s\S]*?-->\s*)*(<!DOCTYPE svg[^>]*>\s*)?(<!--[\s\S]*?-->\s*)*<svg[\s>]/i.test(head)) return "svg";
  return null;
}

/** Scripts, event handlers and outside resources have no place in a logo or picture. */
function unsafeSvg(buffer: Buffer): boolean {
  return /<script|<foreignObject|\son[a-z]+\s*=|javascript:|<!ENTITY|href\s*=\s*["']\s*(?!#|data:image\/)/i.test(buffer.toString("utf8"));
}

function jpegSize(buffer: Buffer) {
  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    if (marker === 0xff) {
      offset += 1;
      continue;
    }
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2;
      continue;
    }
    const length = buffer.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
    }
    offset += 2 + length;
  }
  return {};
}

function webpSize(buffer: Buffer) {
  const chunk = buffer.toString("ascii", 12, 16);
  if (chunk === "VP8 ") return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff };
  if (chunk === "VP8L") {
    const bits = buffer.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  if (chunk === "VP8X") return { width: buffer.readUIntLE(24, 3) + 1, height: buffer.readUIntLE(27, 3) + 1 };
  return {};
}

function svgSize(buffer: Buffer) {
  const tag = /<svg[^>]*>/i.exec(buffer.toString("utf8", 0, Math.min(buffer.length, 6000)))?.[0] ?? "";
  const attribute = (name: string) => {
    const match = new RegExp(`\\s${name}\\s*=\\s*["']\\s*([\\d.]+)(px)?\\s*["']`, "i").exec(tag);
    return match ? Math.round(Number(match[1])) : 0;
  };
  let width = attribute("width");
  let height = attribute("height");
  if (!width || !height) {
    const box = /viewBox\s*=\s*["']\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(tag);
    if (box) {
      width = Math.round(Number(box[1]));
      height = Math.round(Number(box[2]));
    }
  }
  return width && height ? { width, height } : {};
}

function imageSize(buffer: Buffer, kind: string): { width?: number; height?: number } {
  try {
    switch (kind) {
      case "png":
        return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
      case "gif":
        return { width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8) };
      case "jpg":
        return jpegSize(buffer);
      case "webp":
        return webpSize(buffer);
      case "svg":
        return svgSize(buffer);
      case "ico":
        return { width: buffer[6] || 256, height: buffer[7] || 256 };
      default:
        return {};
    }
  } catch {
    return {};
  }
}

const slugify = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/g, "");

/** Uploaded images in data/uploads, with an index (data/media.json) for their names. */
export function createMedia(dataDir: string, uploadsDir: string) {
  const indexFile = path.join(dataDir, "media.json");
  let items: MediaItem[] = [];
  const serial = createQueue();
  const save = () => writeJsonAtomic(indexFile, items);

  async function describeFile(file: string): Promise<MediaItem | null> {
    const buffer = await fs.readFile(path.join(uploadsDir, file));
    const kind = sniffFile(buffer);
    if (!kind) return null;
    const { width = null, height = null } = imageSize(buffer, kind);
    const stat = await fs.stat(path.join(uploadsDir, file));
    const id = /-([0-9a-f]{12})\.[a-z]+$/.exec(file)?.[1] ?? crypto.randomBytes(6).toString("hex");
    return { id, file, url: `/uploads/${file}`, name: file, type: MEDIA_TYPES[kind], size: buffer.length, width, height, uploadedAt: stat.mtime.toISOString() };
  }

  return {
    async load() {
      await fs.mkdir(uploadsDir, { recursive: true });
      const stored = await readJson<MediaItem[]>(indexFile).catch(() => null);
      items = Array.isArray(stored) ? stored.filter((item) => item && ID_PATTERN.test(item.id) && typeof item.file === "string") : [];
      // Keep the index in step with the folder: drop missing files, add files copied in by hand.
      const files = (await fs.readdir(uploadsDir)).filter((name) => UPLOAD_FILE_PATTERN.test(name));
      const onDisk = new Set(files);
      const known = new Set(items.map((item) => item.file));
      const before = items.length;
      items = items.filter((item) => onDisk.has(item.file));
      let added = 0;
      for (const file of files) {
        if (known.has(file)) continue;
        const item = await describeFile(file).catch(() => null);
        if (item && !items.some((existing) => existing.id === item.id)) {
          items.push(item);
          added += 1;
        }
      }
      if (added || items.length !== before || !stored) {
        items.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
        await save();
      }
    },

    list: () => items.map((item) => ({ ...item })),

    get: (id: string) => items.find((item) => item.id === id) ?? null,

    add(buffer: Buffer, originalName: string) {
      return serial(async () => {
        const kind = sniffFile(buffer);
        if (!kind) throw new MediaError("Please choose an image: PNG, JPG, WebP, GIF, SVG, AVIF or ICO.");
        if (kind === "svg" && unsafeSvg(buffer)) {
          throw new MediaError("This SVG file contains scripts or links to other files, which are not allowed. Please save it as a plain SVG or a PNG.");
        }
        const name = String(originalName || "image").trim().slice(0, 120) || "image";
        const base = slugify(name.replace(/\.[a-z0-9]{2,5}$/i, "")) || "image";
        const id = crypto.randomBytes(6).toString("hex");
        const file = `${base}-${id}.${kind}`;
        await fs.writeFile(path.join(uploadsDir, file), buffer, { flag: "wx" });
        const { width = null, height = null } = imageSize(buffer, kind);
        const item: MediaItem = { id, file, url: `/uploads/${file}`, name, type: MEDIA_TYPES[kind], size: buffer.length, width, height, uploadedAt: new Date().toISOString() };
        items.unshift(item);
        await save();
        return { ...item };
      });
    },

    rename(id: string, name: unknown) {
      return serial(async () => {
        const item = items.find((entry) => entry.id === id);
        if (!item) return null;
        if (typeof name === "string" && name.trim()) item.name = name.replace(/\s+/g, " ").trim().slice(0, 120);
        await save();
        return { ...item };
      });
    },

    remove(id: string) {
      return serial(async () => {
        const index = items.findIndex((entry) => entry.id === id);
        if (index === -1) return false;
        const [item] = items.splice(index, 1);
        await fs.unlink(path.join(uploadsDir, item.file)).catch((err: NodeJS.ErrnoException) => {
          if (err.code !== "ENOENT") throw err;
        });
        await save();
        return true;
      });
    },
  };
}

export type Media = ReturnType<typeof createMedia>;
