"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiEye, FiEyeOff, FiLock, FiShield } from "react-icons/fi";

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
    <main className="min-h-screen bg-[#f7f5ef] text-[#242824]">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_.95fr]">
        <section className="relative flex min-h-[340px] flex-col overflow-hidden bg-[#124c36] px-6 py-6 text-[#fffdf8] sm:px-10 sm:py-8 lg:min-h-screen lg:px-14 xl:px-20">
          <div className="pointer-events-none absolute -right-36 -top-40 h-[480px] w-[480px] rounded-full border border-white/10 sm:h-[620px] sm:w-[620px]" />
          <div className="pointer-events-none absolute -right-12 top-24 h-56 w-56 rounded-full border border-white/10 sm:top-36 sm:h-72 sm:w-72" />
          <div className="relative flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#fffdf8] p-1.5">
              <img src="/kcmsc/kcmsc-logo.png" alt="K C Model School & College" className="h-full w-full object-contain" />
            </span>
            <span><span className="block font-heading text-lg leading-tight">K C Model School</span><span className="mt-1 block text-[9px] uppercase tracking-[0.22em] text-white/55">Administration</span></span>
          </div>

          <div className="relative my-auto py-12 lg:py-20">
            <p className="flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#d4c38c]"><span>01</span><span className="h-px w-10 bg-[#d4c38c]/60" /> Admin workspace</p>
            <h1 className="mt-7 max-w-2xl font-heading text-[clamp(3.5rem,8vw,7rem)] font-normal leading-[.94] tracking-[-.055em]">The work<br />behind the<br /><span className="text-[#d4c38c]">school.</span></h1>
            <p className="mt-7 max-w-md text-sm leading-7 text-white/65 sm:text-base sm:leading-8">One thoughtful workspace to manage admissions, people, announcements and the digital presence of K C Model School & College.</p>
            <a href="/" target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-3 border-b border-white/25 pb-2 text-xs font-medium text-white/85 transition hover:border-[#d4c38c] hover:text-[#d4c38c]">Explore the public website <FiArrowRight /></a>
          </div>

          <div className="relative flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-5 text-[9px] uppercase tracking-[0.16em] text-white/45">
            <span>KCMSC · Management</span><span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#8bd0a0]" /> Secure access</span>
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-12 xl:px-20">
          <div className="w-full max-w-[440px]">
            <div className="mb-9 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#176b45]"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#e8eee6]"><FiShield className="h-4 w-4" /></span> Authorized access only</div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.23em] text-[#8a918b]">Administrator sign in</p>
            <h2 className="mt-3 font-heading text-4xl leading-tight tracking-[-0.04em] text-[#124c36] sm:text-[44px]">Welcome back.</h2>
            <p className="mt-3 text-sm leading-6 text-[#69716b]">Sign in to continue to your administration dashboard.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="admin-email" className="mb-2 block text-xs font-medium text-[#414741]">Email address</label>
                <input id="admin-email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@kcmsc.edu.bd" className="h-12 w-full rounded-xl border border-[#d9d8cf] bg-[#fffdf8] px-4 text-sm text-[#242824] outline-none transition placeholder:text-[#a0a59f] focus:border-[#176b45] focus:ring-4 focus:ring-[#176b45]/10" />
              </div>
              <div>
                <label htmlFor="admin-password" className="mb-2 block text-xs font-medium text-[#414741]">Password</label>
                <div className="relative">
                  <input id="admin-password" type={showPassword ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="h-12 w-full rounded-xl border border-[#d9d8cf] bg-[#fffdf8] px-4 pr-12 text-sm text-[#242824] outline-none transition placeholder:text-[#a0a59f] focus:border-[#176b45] focus:ring-4 focus:ring-[#176b45]/10" />
                  <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute inset-y-0 right-0 grid w-12 place-items-center text-[#8a918b] transition hover:text-[#176b45]">{showPassword ? <FiEyeOff /> : <FiEye />}</button>
                </div>
              </div>

              {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-700">{error}</div>}

              <button type="submit" disabled={loading} className="group flex h-12 w-full items-center justify-between rounded-xl bg-[#176b45] px-5 text-xs font-semibold tracking-[0.04em] text-white transition hover:bg-[#124c36] disabled:cursor-not-allowed disabled:opacity-65">
                <span>{loading ? "Signing in…" : "Enter dashboard"}</span><span className="grid h-8 w-8 place-items-center rounded-lg border border-white/25 transition group-hover:translate-x-0.5"><FiArrowRight className="h-4 w-4" /></span>
              </button>
            </form>

            <div className="mt-7 flex items-start gap-3 border-t border-[#d9d8cf] pt-5">
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#efeee7] text-[#176b45]"><FiLock className="h-3.5 w-3.5" /></span>
              <p className="text-[11px] leading-5 text-[#858c85]">This area is restricted to authorized KCMSC administrators. Keep your credentials private and sign out when you finish.</p>
            </div>
            <p className="mt-8 text-center text-[10px] text-[#a0a59f]">© {new Date().getFullYear()} K C Model School & College</p>
          </div>
        </section>
      </div>
    </main>
  );
}
