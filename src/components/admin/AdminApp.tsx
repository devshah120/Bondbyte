"use client";

import { useCallback, useEffect, useState } from "react";
import { LockKeyhole } from "lucide-react";
import { api } from "./api";
import { CmsProvider } from "./cms";
import { Shell } from "./Shell";
import { btn, inputClass, Spinner } from "./ui";

type Session = { state: "loading" } | { state: "signedOut"; canSignIn: boolean } | { state: "signedIn" } | { state: "error"; message: string };

/** The admin panel: checks the session, then shows the sign in form or the panel. */
export function AdminApp() {
  const [session, setSession] = useState<Session>({ state: "loading" });

  const check = useCallback(() => {
    api
      .session()
      .then((result) => setSession(result.signedIn ? { state: "signedIn" } : { state: "signedOut", canSignIn: result.canSignIn }))
      .catch((err: Error) => setSession({ state: "error", message: err.message }));
  }, []);

  useEffect(check, [check]);

  const onSignedOut = useCallback(() => setSession({ state: "signedOut", canSignIn: true }), []);

  if (session.state === "loading") {
    return (
      <div className="flex min-h-svh items-center justify-center gap-3 text-fg-muted" role="status">
        <Spinner /> Loading…
      </div>
    );
  }
  if (session.state === "error") {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-fg-muted">{session.message}</p>
        <button type="button" className={btn.primary} onClick={check}>
          Try again
        </button>
      </div>
    );
  }
  if (session.state === "signedOut") return <Login canSignIn={session.canSignIn} onSignedIn={() => setSession({ state: "signedIn" })} />;

  return (
    <CmsProvider onSignedOut={onSignedOut}>
      <Shell />
    </CmsProvider>
  );
}

function Login({ canSignIn, onSignedIn }: { canSignIn: boolean; onSignedIn: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.signIn(username.trim(), password);
      onSignedIn();
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-[#0c1832] px-4 py-10">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-surface p-7 shadow-2xl sm:p-8">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <LockKeyhole className="h-5 w-5" />
        </span>
        <h1 className="mt-5 text-xl font-semibold tracking-tight text-fg">Sign in to the admin panel</h1>
        <p className="mt-1.5 text-sm text-fg-muted">Manage inquiries and everything on the website.</p>

        {!canSignIn && (
          <p className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-800">
            The admin password is not set yet. Add ADMIN_PASSWORD to the server environment and restart the server.
          </p>
        )}

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="login-username" className="mb-1.5 block text-sm font-medium text-fg">
              Username
            </label>
            <input id="login-username" className={inputClass} autoComplete="username" autoCapitalize="none" spellCheck={false} value={username} onChange={(event) => setUsername(event.target.value)} required />
          </div>
          <div>
            <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-fg">
              Password
            </label>
            <input id="login-password" type="password" className={inputClass} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
            {error}
          </p>
        )}

        <button type="submit" className={`${btn.primary} mt-6 w-full py-2.5`} disabled={busy || !canSignIn}>
          {busy && <Spinner />} Sign in
        </button>
      </form>
    </main>
  );
}
