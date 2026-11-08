import "server-only";
import { createAuth, createRateLimit } from "./auth";
import { config } from "./config";
import { createHistory } from "./history";
import { createInquiries } from "./inquiries";
import { createMedia } from "./media";
import { createStore } from "./store";

function createCms() {
  const history = createHistory(config.historyDir);
  const store = createStore(config.dataDir, history);
  const auth = createAuth(config);
  const inquiries = createInquiries(config.dataDir);
  const media = createMedia(config.dataDir, config.uploadsDir);
  const allowInquiry = createRateLimit({ max: 5, windowMs: 10 * 60 * 1000 });

  const ready = (async () => {
    await store.get();
    await Promise.all([auth.load(), inquiries.load(), media.load()]);
    if (!auth.canSignIn()) console.warn("ADMIN_PASSWORD is not set, so the admin panel is locked.");
    if (config.tokenSecretIsRandom) console.warn("TOKEN_SECRET is not set, so admin sessions end when the server restarts.");
  })();

  return { history, store, auth, inquiries, media, allowInquiry, ready };
}

type Cms = ReturnType<typeof createCms>;

// Kept on globalThis so every route and page in the process shares one set of
// stores (and one write queue), including across dev-server reloads.
const globalForCms = globalThis as unknown as { __bbCms?: Cms };

/** The JSON stores, loaded once per server process. */
export async function cms(): Promise<Cms> {
  const instance = (globalForCms.__bbCms ??= createCms());
  try {
    await instance.ready;
  } catch (err) {
    // A failed start (unreadable data folder) is retried on the next request.
    globalForCms.__bbCms = undefined;
    throw err;
  }
  return instance;
}

/** The current site content. */
export async function getContent() {
  const { store } = await cms();
  return store.get();
}
