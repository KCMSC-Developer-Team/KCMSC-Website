import Link from "next/link";
import type { ReactNode } from "react";
import { FiArrowLeft, FiBookOpen, FiShield, FiUsers } from "react-icons/fi";

/**
 * One sign-in layout for every portal (administrator, faculty, writer).
 * The brand panel and form column are identical; only the wording, icon and
 * the highlighted portal change. Purely presentational: the form passed in as
 * children keeps its own fields, handlers and destinations.
 */

type Portal = "admin" | "teacher" | "blogger";

const PORTALS: { id: Portal; label: string; href: string; icon: typeof FiShield }[] = [
  { id: "admin", label: "Administrator", href: "/admin/login", icon: FiShield },
  { id: "teacher", label: "Faculty", href: "/teacher/login", icon: FiUsers },
  { id: "blogger", label: "Writer", href: "/blogger/login", icon: FiBookOpen },
];

export function AuthShell({
  portal,
  eyebrow,
  headline,
  blurb,
  points = [],
  title,
  subtitle,
  children,
  footer,
}: {
  portal?: Portal;
  eyebrow: string;
  headline: ReactNode;
  blurb: string;
  points?: string[];
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#242824]">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_.95fr]">
        {/* Brand panel */}
        <section className="kc-auth-brand flex min-h-[320px] flex-col px-6 py-7 text-[#fffdf8] sm:px-10 sm:py-9 lg:min-h-screen lg:px-14 xl:px-20">
          <div
            aria-hidden="true"
            className="kc-float pointer-events-none absolute -right-32 -top-36 h-[460px] w-[460px] rounded-full border border-white/10 sm:h-[600px] sm:w-[600px]"
          />
          <div
            aria-hidden="true"
            className="kc-float pointer-events-none absolute -right-10 top-28 h-56 w-56 rounded-full border border-white/10 sm:h-72 sm:w-72"
            style={{ animationDelay: "-3s" }}
          />

          <Link href="/" className="kc-enter relative flex items-center gap-3.5">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#fffdf8] p-1.5 shadow-lift">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/kcmsc/kcmsc-logo.png" alt="K C Model School & College" className="h-full w-full object-contain" />
            </span>
            <span>
              <span className="block font-heading text-xl leading-tight">K C Model School</span>
              <span className="mt-1 block text-xs uppercase tracking-[0.2em] text-white/65">{eyebrow}</span>
            </span>
          </Link>

          <div className="relative my-auto py-12 lg:py-20">
            <p className="kc-enter flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#e4d49a]" style={{ ["--kc-d" as string]: "80ms" }}>
              <span className="h-px w-10 bg-[#e4d49a]/70" /> {eyebrow}
            </p>
            <h1
              className="kc-enter mt-6 max-w-2xl font-heading text-[clamp(2.75rem,6.4vw,5.75rem)] font-normal leading-[0.98] tracking-[-0.045em]"
              style={{ ["--kc-d" as string]: "160ms" }}
            >
              {headline}
            </h1>
            <p className="kc-enter mt-6 max-w-md text-base leading-8 text-white/80" style={{ ["--kc-d" as string]: "260ms" }}>
              {blurb}
            </p>
            {points.length > 0 && (
              <ul className="kc-enter mt-7 space-y-2.5" style={{ ["--kc-d" as string]: "340ms" }}>
                {points.map((point) => (
                  <li key={point} className="flex items-center gap-3 text-sm text-white/85">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/12 text-[#e4d49a] ring-1 ring-white/20">✓</span>
                    {point}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="relative flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-5 text-xs uppercase tracking-[0.14em] text-white/60">
            <span>K C Model School &amp; College</span>
            <span className="flex items-center gap-2">
              <span className="kc-live-dot h-2 w-2 rounded-full bg-[#7fe0aa]" /> Secure sign-in
            </span>
          </div>
        </section>

        {/* Form column */}
        <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-12 xl:px-20">
          <div className="w-full max-w-[460px]">
            <nav aria-label="Choose portal" className="kc-enter mb-9 flex flex-wrap gap-2" style={{ ["--kc-d" as string]: "120ms" }}>
              {PORTALS.map((item) => {
                const Icon = item.icon;
                const active = item.id === portal;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                      active
                        ? "border-[#176b45] bg-[#176b45] text-white shadow-card"
                        : "border-[#d9d8cf] bg-[#fffdf8] text-[#124c36] hover:border-[#176b45] hover:bg-[#e3f2e9]"
                    }`}
                  >
                    <Icon className="h-4 w-4" /> {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="kc-enter" style={{ ["--kc-d" as string]: "200ms" }}>
              <h2 className="font-heading text-4xl leading-tight tracking-[-0.035em] text-[#124c36] sm:text-[44px]">{title}</h2>
              <p className="mt-3 text-base leading-7 text-[#69716b]">{subtitle}</p>
            </div>

            <div className="kc-enter mt-8 rounded-2xl border border-[#d9d8cf] bg-[#fffdf8] p-6 shadow-card sm:p-8" style={{ ["--kc-d" as string]: "280ms" }}>
              {children}
            </div>

            <div className="kc-enter mt-7 flex flex-col items-start gap-4 text-sm text-[#69716b]" style={{ ["--kc-d" as string]: "360ms" }}>
              {footer}
              <Link href="/" className="inline-flex items-center gap-2 font-medium text-[#176b45] transition hover:gap-3 hover:text-[#124c36]">
                <FiArrowLeft /> Back to the main website
              </Link>
              <p className="text-xs text-[#8a918b]">© {new Date().getFullYear()} K C Model School &amp; College</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AuthShell;
