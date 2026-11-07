"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const f = new FormData(e.currentTarget);
    const r = await signIn("credentials", {
      email: String(f.get("schoolId")),
      password: String(f.get("password")),
      redirect: false,
    });
    setBusy(false);
    if (r?.error) {
      setError("Login failed. Check your school ID and password, or contact the administration.");
      return;
    }
    router.push("/blogger/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <label className="block text-sm font-medium text-[#414741]">
        Student ID / Teacher ID
        <input name="schoolId" required autoComplete="username" className="kc-input mt-2" />
      </label>
      <label className="block text-sm font-medium text-[#414741]">
        Password
        <input name="password" type="password" required autoComplete="current-password" className="kc-input mt-2" />
      </label>
      {error && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
          {error}
        </p>
      )}
      <button disabled={busy} className="kc-btn kc-btn-primary w-full">
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
