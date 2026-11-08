import "server-only";
import fs from "node:fs/promises";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Writes to a temp file and renames it into place, so a crash never leaves half a file. */
export async function writeFileAtomic(file: string, data: string | Buffer, options: { mode?: number } = {}): Promise<void> {
  const tmp = `${file}.${process.pid}.tmp`;
  await fs.writeFile(tmp, data, { mode: options.mode });
  for (let attempt = 0; ; attempt++) {
    try {
      await fs.rename(tmp, file);
      return;
    } catch (err) {
      // Windows can briefly lock the target (antivirus, an open editor), so retry a few times.
      const code = (err as NodeJS.ErrnoException).code ?? "";
      if (attempt >= 5 || !["EPERM", "EBUSY", "EACCES"].includes(code)) throw err;
      await sleep(50 * (attempt + 1));
    }
  }
}

export const writeJsonAtomic = (file: string, data: unknown, options?: { mode?: number }) =>
  writeFileAtomic(file, `${JSON.stringify(data, null, 2)}\n`, options);

/** The parsed file, or null when it does not exist. */
export async function readJson<T = unknown>(file: string): Promise<T | null> {
  let text: string;
  try {
    text = await fs.readFile(file, "utf8");
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
  try {
    return JSON.parse(text) as T;
  } catch (err) {
    throw new Error(`Could not read ${file}: ${(err as Error).message}`);
  }
}

/** Runs tasks one after another, so two saves never interleave. */
export function createQueue() {
  let queue: Promise<unknown> = Promise.resolve();
  return function serial<T>(task: () => Promise<T>): Promise<T> {
    const run = queue.then(task);
    queue = run.catch(() => {});
    return run;
  };
}
