import type { HistoryEntry, Inquiry, InquiryStatus, MediaItem, SiteContent } from "@/lib/cms/types";

/** The session expired or was ended elsewhere: the panel shows the sign in form again. */
export class SessionExpiredError extends Error {}
/** The same part was saved in another tab or on another device in the meantime. */
export class ConflictError extends Error {}
export class ApiError extends Error {
  constructor(
    message: string,
    public field?: string,
    public errors?: Record<string, string>,
  ) {
    super(message);
  }
}

export type MediaWithUsage = MediaItem & { usedIn: string[] };
export interface Account {
  username: string;
  source: "env" | "dashboard";
  updatedAt?: string;
}

async function request<T>(path: string, { method = "GET", body, raw }: { method?: string; body?: unknown; raw?: File } = {}): Promise<T> {
  // The custom header proves the request came from this panel (a cross-site form cannot add it).
  const headers: Record<string, string> = { "x-bondbyte-admin": "1" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (raw) headers["Content-Type"] = raw.type || "application/octet-stream";

  let response: Response;
  try {
    response = await fetch(`/api/admin${path}`, {
      method,
      headers,
      credentials: "same-origin",
      cache: "no-store",
      body: raw ?? (body === undefined ? undefined : JSON.stringify(body)),
    });
  } catch {
    throw new Error("Could not reach the server. Check your connection and try again.");
  }
  const data = await response.json().catch(() => null);
  if (response.ok) return data as T;

  const message = data?.error || `The server returned an error (${response.status}).`;
  if (response.status === 401 && path !== "/login") throw new SessionExpiredError(message);
  if (response.status === 409 && !data?.usedIn) throw new ConflictError(message);
  throw new ApiError(message, data?.field, data?.errors);
}

export const api = {
  session: () => request<{ signedIn: boolean; canSignIn: boolean; account: Account | null }>("/session"),
  signIn: (username: string, password: string) => request<{ ok: true; account: Account }>("/login", { method: "POST", body: { username, password } }),
  signOut: () => request<{ ok: true }>("/logout", { method: "POST" }),

  content: () => request<SiteContent>("/content"),
  putObject: (key: string, value: unknown, base: number) => request<SiteContent>(`/objects/${key}`, { method: "PUT", body: { value, base } }),
  putCollection: (key: string, items: unknown[], base: number) => request<SiteContent>(`/collections/${key}`, { method: "PUT", body: { items, base } }),
  putPage: (id: string, value: unknown, base: number) => request<SiteContent>(`/pages/${id}`, { method: "PUT", body: { value, base } }),
  deletePage: (id: string) => request<SiteContent>(`/pages/${id}`, { method: "DELETE" }),

  media: () => request<MediaWithUsage[]>("/media"),
  upload: (file: File) => request<MediaWithUsage>(`/media?name=${encodeURIComponent(file.name)}`, { method: "POST", raw: file }),
  renameMedia: (id: string, name: string) => request<MediaWithUsage>(`/media/${id}`, { method: "PATCH", body: { name } }),
  deleteMedia: (id: string) => request<{ ok: true }>(`/media/${id}`, { method: "DELETE" }),

  inquiries: () => request<Inquiry[]>("/inquiries"),
  setInquiryStatus: (id: string, status: InquiryStatus) => request<Inquiry>(`/inquiries/${id}`, { method: "PATCH", body: { status } }),
  deleteInquiry: (id: string) => request<{ ok: true }>(`/inquiries/${id}`, { method: "DELETE" }),

  history: () => request<HistoryEntry[]>("/history"),
  version: (id: string) => request<SiteContent>(`/history/${id}`),
  restore: (id: string) => request<SiteContent>(`/history/${id}/restore`, { method: "POST" }),

  account: () => request<Account>("/account"),
  putAccount: (changes: { currentPassword: string; username: string; newPassword: string }) =>
    request<{ ok: true; account: Account }>("/account", { method: "PUT", body: changes }),
};
