"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import type { Inquiry, InquiryStatus, SiteContent } from "@/lib/cms/types";
import { api, ConflictError, SessionExpiredError } from "./api";
import { cn } from "@/lib/utils/cn";

type ToastTone = "ok" | "error";
interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

interface CmsValue {
  content: SiteContent | null;
  loadError: string | null;
  setContent: (content: SiteContent) => void;
  reload: () => Promise<void>;
  inquiries: Inquiry[] | null;
  loadInquiries: () => Promise<void>;
  updateInquiry: (id: string, status: InquiryStatus) => Promise<void>;
  removeInquiry: (id: string) => Promise<void>;
  notify: (message: string, tone?: ToastTone) => void;
  /** Shows the right message for a failed request; returns true when it was handled specially. */
  handleError: (err: unknown) => void;
  signOut: () => void;
  setDirty: (key: string, dirty: boolean) => void;
  confirmLeave: () => boolean;
}

const CmsContext = createContext<CmsValue | null>(null);

export function useCms(): CmsValue {
  const value = useContext(CmsContext);
  if (!value) throw new Error("useCms must be used inside <CmsProvider>.");
  return value;
}

export function useContent(): SiteContent {
  const { content } = useCms();
  if (!content) throw new Error("Content is not loaded yet.");
  return content;
}

const LEAVE_MESSAGE = "You have unsaved changes. Leave without saving?";

export function CmsProvider({ onSignedOut, children }: { onSignedOut: () => void; children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[] | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const dirty = useRef(new Set<string>());
  const toastId = useRef(0);

  const notify = useCallback((message: string, tone: ToastTone = "ok") => {
    const id = ++toastId.current;
    setToasts((current) => [...current.slice(-3), { id, message, tone }]);
    setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), tone === "error" ? 7000 : 3500);
  }, []);

  const signOut = useCallback(() => {
    dirty.current.clear();
    api.signOut().catch(() => {});
    onSignedOut();
  }, [onSignedOut]);

  const reload = useCallback(async () => {
    setLoadError(null);
    try {
      setContent(await api.content());
    } catch (err) {
      if (err instanceof SessionExpiredError) {
        onSignedOut();
        return;
      }
      setLoadError((err as Error).message);
    }
  }, [onSignedOut]);

  const handleError = useCallback(
    (err: unknown) => {
      if (err instanceof SessionExpiredError) {
        notify(err.message, "error");
        dirty.current.clear();
        onSignedOut();
        return;
      }
      if (err instanceof ConflictError) {
        notify(err.message, "error");
        void reload();
        return;
      }
      notify((err as Error).message || "Something went wrong.", "error");
    },
    [notify, onSignedOut, reload],
  );

  const loadInquiries = useCallback(async () => {
    try {
      setInquiries(await api.inquiries());
    } catch (err) {
      if (err instanceof SessionExpiredError) onSignedOut();
      else throw err;
    }
  }, [onSignedOut]);

  const updateInquiry = useCallback(async (id: string, status: InquiryStatus) => {
    const item = await api.setInquiryStatus(id, status);
    setInquiries((current) => current?.map((entry) => (entry.id === id ? item : entry)) ?? null);
  }, []);

  const removeInquiry = useCallback(async (id: string) => {
    await api.deleteInquiry(id);
    setInquiries((current) => current?.filter((entry) => entry.id !== id) ?? null);
  }, []);

  const setDirty = useCallback((key: string, value: boolean) => {
    if (value) dirty.current.add(key);
    else dirty.current.delete(key);
  }, []);

  const confirmLeave = useCallback(() => {
    if (dirty.current.size === 0) return true;
    if (!window.confirm(LEAVE_MESSAGE)) return false;
    dirty.current.clear();
    return true;
  }, []);

  useEffect(() => {
    api
      .content()
      .then(setContent)
      .catch((err) => {
        if (err instanceof SessionExpiredError) onSignedOut();
        else setLoadError((err as Error).message);
      });
    api
      .inquiries()
      .then(setInquiries)
      .catch(() => {});
    // The sidebar badge for new inquiries stays current.
    const timer = setInterval(() => loadInquiries().catch(() => {}), 60_000);
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (dirty.current.size > 0) event.preventDefault();
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => {
      clearInterval(timer);
      window.removeEventListener("beforeunload", beforeUnload);
    };
  }, [onSignedOut, loadInquiries]);

  const value = useMemo<CmsValue>(
    () => ({ content, loadError, setContent, reload, inquiries, loadInquiries, updateInquiry, removeInquiry, notify, handleError, signOut, setDirty, confirmLeave }),
    [content, loadError, reload, inquiries, loadInquiries, updateInquiry, removeInquiry, notify, handleError, signOut, setDirty, confirmLeave],
  );

  return (
    <CmsContext.Provider value={value}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-[300] flex w-[min(24rem,calc(100%-2rem))] flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={toast.tone === "error" ? "alert" : "status"}
            className={cn(
              "pointer-events-auto flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm shadow-lg",
              toast.tone === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-line bg-[#0c1832] text-white",
            )}
          >
            {toast.tone === "error" ? <XCircle className="mt-0.5 h-4 w-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-hi" />}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </CmsContext.Provider>
  );
}

/** Keeps the leave warning in step with a form's unsaved changes. */
export function useDirtyGuard(key: string, dirty: boolean) {
  const { setDirty } = useCms();
  useEffect(() => {
    setDirty(key, dirty);
    return () => setDirty(key, false);
  }, [key, dirty, setDirty]);
}

/** A link inside the panel that asks before leaving unsaved changes. */
export function AdminLink({ href, onClick, ...props }: React.ComponentProps<typeof Link> & { href: string }) {
  const { confirmLeave } = useCms();
  return (
    <Link
      href={href}
      onClick={(event) => {
        if (!confirmLeave()) event.preventDefault();
        onClick?.(event);
      }}
      {...props}
    />
  );
}

/** Navigates inside the panel, asking before leaving unsaved changes. */
export function useAdminNavigate() {
  const router = useRouter();
  const { confirmLeave } = useCms();
  return useCallback(
    (href: string, { force = false, replace = false } = {}) => {
      if (!force && !confirmLeave()) return;
      if (replace) router.replace(href);
      else router.push(href);
    },
    [router, confirmLeave],
  );
}
