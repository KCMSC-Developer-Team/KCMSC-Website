"use client";

import { useState } from "react";

export default function PasswordForm() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setBusy(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/blog/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current: form.get("current"),
          next: form.get("next"),
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Unable to update password.");
        return;
      }

      formElement.reset();
      setMessage("Password updated successfully.");
    } catch {
      setError("A network error occurred. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const inputClass =
    "mt-2 block w-full rounded-xl border border-[#dce4da] bg-white px-4 py-3 text-sm text-[#263c2f] outline-none transition placeholder:text-[#9aa39b] focus:border-[#176b45] focus:ring-4 focus:ring-[#176b45]/10";

  return (
    <form onSubmit={submit} className="mt-6 space-y-5">
      <label className="block text-sm font-semibold text-[#35483b]">
        Current password
        <input
          name="current"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </label>
      <label className="block text-sm font-semibold text-[#35483b]">
        New password
        <input
          name="next"
          type="password"
          minLength={10}
          maxLength={100}
          required
          autoComplete="new-password"
          aria-describedby="password-requirement"
          className={inputClass}
        />
        <span id="password-requirement" className="mt-1.5 block text-xs font-normal text-[#7b857d]">
          Use at least 10 characters.
        </span>
      </label>
      {error && (
        <p role="alert" className="rounded-lg bg-[#fbf1f0] px-3 py-2 text-sm text-[#8b3c36]">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="rounded-lg bg-[#edf5ee] px-3 py-2 text-sm text-[#176b45]">
          {message}
        </p>
      )}
      <button
        type="submit"
        disabled={busy}
        className="rounded-xl bg-[#176b45] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#124c36] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176b45] focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
      >
        {busy ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
