"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import { AuthShell } from "@/components/auth/AuthShell";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
        callbackUrl: "/admin",
      });
      if (!result || result.error) {
        if (result?.error === "TooManyAttempts") setError("Too many failed attempts. Please try again later.");
        else if (result?.error === "Configuration") setError("Authentication is not configured correctly. Check the server environment.");
        else setError("Incorrect email or password.");
        return;
      }
      router.replace(result.url || "/admin");
      router.refresh();
    } catch (err) {
      console.error("KCMSC login failed:", err);
      setError("The sign-in request could not be completed. Check the development server terminal for the exact error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      portal="admin"
      eyebrow="Administration"
      headline={<>The work<br />behind the<br /><span className="text-[#e4d49a]">school.</span></>}
      blurb="One thoughtful workspace to manage admissions, people, announcements and the digital presence of K C Model School & College."
      points={["Notices, events and alumni messages", "Faculty profiles and careers", "Blogger programme and Help Center"]}
      title="Welcome back."
      subtitle="Sign in to continue to your administration dashboard."
      footer={
        <>
          <p className="flex items-start gap-3 border-t border-[#e4e2da] pt-5 leading-6">
            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#e3f2e9] text-[#176b45]"><FiLock className="h-4 w-4" /></span>
            This area is restricted to authorized KCMSC administrators. Keep your credentials private and sign out when you finish.
          </p>
          <a href="/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-medium text-[#176b45] transition hover:gap-3 hover:text-[#124c36]">
            Explore the public website <FiArrowRight />
          </a>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="admin-email" className="mb-2 block text-sm font-medium text-[#414741]">Email address</label>
          <input id="admin-email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@kcmsc.edu.bd" className="kc-input" />
        </div>
        <div>
          <label htmlFor="admin-password" className="mb-2 block text-sm font-medium text-[#414741]">Password</label>
          <div className="relative">
            <input id="admin-password" type={showPassword ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="kc-input pr-12" />
            <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute inset-y-0 right-0 grid w-12 place-items-center text-[#8a918b] transition hover:text-[#176b45]">{showPassword ? <FiEyeOff /> : <FiEye />}</button>
          </div>
        </div>

        {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">{error}</div>}

        <button type="submit" disabled={loading} className="kc-btn kc-btn-primary group w-full justify-between px-5">
          <span>{loading ? "Signing in…" : "Enter dashboard"}</span>
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/30 transition group-hover:translate-x-0.5"><FiArrowRight className="h-4 w-4" /></span>
        </button>
      </form>
    </AuthShell>
  );
}
