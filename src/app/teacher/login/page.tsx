"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
export default function TeacherLoginPage() {
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const r = await signIn("credentials", {
      email: staffId.trim(),
      password,
      redirect: false,
    });
    if (r?.error) {
      setError("Invalid Employee ID or password, or the account is inactive.");
      setBusy(false);
      return;
    }
    router.push("/teacher/dashboard");
    router.refresh();
  }
  return (
    <AuthShell
      portal="teacher"
      eyebrow="Faculty portal"
      headline={<>Your faculty<br />account,<br /><span className="text-[#e4d49a]">in one place.</span></>}
      blurb="Access your staff account and faculty tools using your employee credentials."
      points={["Sign in with your Employee ID", "Keep your faculty profile up to date", "Your public teacher page, in your hands"]}
      title="Teacher portal"
      subtitle="Sign in with your Employee ID. Your initial password is also your Employee ID."
      footer={
        <a href="/en/teachers" className="inline-flex items-center gap-2 font-medium text-[#176b45] transition hover:text-[#124c36] hover:underline">
          View public teacher directory
        </a>
      }
    >
      <form onSubmit={submit} className="space-y-5">
        {error && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
            {error}
          </p>
        )}
        <label className="block text-sm font-medium text-[#414741]">
          Employee ID
          <input
            required
            autoComplete="username"
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            className="kc-input mt-2"
          />
        </label>
        <label className="block text-sm font-medium text-[#414741]">
          Password
          <input
            required
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="kc-input mt-2"
          />
        </label>
        <button disabled={busy} className="kc-btn kc-btn-primary w-full">
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthShell>
  );
}
