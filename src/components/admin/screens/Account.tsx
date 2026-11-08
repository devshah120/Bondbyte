"use client";

import { useEffect, useState } from "react";
import { api, ApiError, type Account as AccountInfo } from "../api";
import { useCms } from "../cms";
import { btn, cardClass, dateTime, inputClass, LoadingState, ScreenHeader, Spinner } from "../ui";

/** Change the admin username and password. Saving signs out every other device. */
export function Account() {
  const { notify, handleError } = useCms();
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .account()
      .then((info) => {
        setAccount(info);
        setUsername(info.username);
      })
      .catch(handleError);
  }, [handleError]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (newPassword && newPassword !== repeat) {
      setErrors({ repeat: "The two new passwords are not the same." });
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      const result = await api.putAccount({ currentPassword, username: username.trim(), newPassword });
      setAccount(result.account);
      setCurrentPassword("");
      setNewPassword("");
      setRepeat("");
      notify("Login saved. Other devices have been signed out.");
    } catch (err) {
      if (err instanceof ApiError && err.field) setErrors({ [err.field]: err.message });
      else handleError(err);
    } finally {
      setBusy(false);
    }
  }

  if (!account) return <LoadingState label="Loading…" />;

  const field = (id: string, label: string, input: React.ReactNode, help?: string) => (
    <div>
      <label htmlFor={`account-${id}`} className="mb-1.5 block text-sm font-medium text-fg">
        {label}
      </label>
      {input}
      {help && !errors[id] && <p className="mt-1.5 text-[0.8125rem] text-fg-subtle">{help}</p>}
      {errors[id] && <p className="mt-1.5 text-[0.8125rem] font-medium text-red-600">{errors[id]}</p>}
    </div>
  );

  return (
    <div>
      <ScreenHeader
        title="Login and password"
        description={
          account.source === "env"
            ? "You are signed in with the login from the server environment (ADMIN_USERNAME and ADMIN_PASSWORD). Set your own here."
            : `Set in the dashboard${account.updatedAt ? ` on ${dateTime(account.updatedAt)}` : ""}. Forgot it? Delete data/auth.json on the server to use the environment login again.`
        }
      />
      <form onSubmit={submit} className={`${cardClass} max-w-xl space-y-5`}>
        {field("username", "Username", <input id="account-username" className={inputClass} autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required />, "3 to 40 characters: letters, numbers, dots, dashes, underscores or @.")}
        {field("newPassword", "New password", <input id="account-newPassword" type="password" className={inputClass} autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />, "At least 8 characters. Leave empty to keep the current password.")}
        {newPassword && field("repeat", "Repeat the new password", <input id="account-repeat" type="password" className={inputClass} autoComplete="new-password" value={repeat} onChange={(event) => setRepeat(event.target.value)} />)}
        <div className="border-t border-line pt-5">
          {field("currentPassword", "Current password", <input id="account-currentPassword" type="password" className={inputClass} autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required />, "Needed to confirm the change.")}
        </div>
        <button type="submit" className={btn.primary} disabled={busy || !currentPassword}>
          {busy && <Spinner />} Save login
        </button>
      </form>
    </div>
  );
}
