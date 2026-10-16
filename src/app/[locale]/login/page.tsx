import Link from "next/link";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

const roles = [
  {
    number: "01",
    title: "Administrator",
    subtitle: "ADMIN PORTAL",
    description: "Manage school content, accounts, and administrative operations.",
    href: "/admin/login",
    action: "Continue to admin login",
  },
  {
    number: "02",
    title: "Faculty member",
    subtitle: "TEACHER PORTAL",
    description: "Access your staff account and faculty tools using your employee credentials.",
    href: "/teacher/login",
    action: "Continue to faculty login",
  },
  {
    number: "03",
    title: "Writer",
    subtitle: "KCMSC JOURNAL",
    description: "Sign in to write, edit, and manage articles for the school blog.",
    href: "/blogger/login",
    action: "Continue to writer login",
  },
];

export default function LoginPortalPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const bn = locale === "bn";

  return (
    <main
      className="kc-login-portal relative isolate min-h-[calc(100vh-140px)] bg-cover bg-center text-[#17382b]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(10, 45, 31, 0.78), rgba(10, 45, 31, 0.68)), url('/kcmsc/student-life/students_at_bookfair.jpg')",
      }}
    >
      <section className="border-b border-white/20 bg-transparent">
        <div className="mx-auto max-w-[1120px] px-5 py-12 sm:px-8 sm:py-16">
          <p className="text-[10px] font-semibold uppercase tracking-[.22em] text-[#d9c47e]">
            {bn ? "কে সি মডেল স্কুল অ্যান্ড কলেজ" : "K C MODEL SCHOOL & COLLEGE"}
          </p>
          <h1 className="mt-4 max-w-2xl font-heading text-4xl font-normal leading-tight tracking-[-.04em] text-white sm:text-5xl">
            {bn ? "আপনার পোর্টাল নির্বাচন করুন" : "Choose your sign-in portal."}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/85 sm:text-base">
            {bn
              ? "আপনার দায়িত্ব অনুযায়ী পোর্টাল নির্বাচন করে নিরাপদে লগইন করুন।"
              : "Select the portal that matches your role at KCMSC. Each portal provides access to the tools and information relevant to your work."}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] px-5 py-10 sm:px-8 sm:py-14">
        <div className="grid gap-4 md:grid-cols-3">
          {roles.map((role) => (
            <Link
              key={role.number}
              href={role.href}
              className="group flex min-h-[270px] flex-col border border-[#d1dacf] bg-[#fffdf8] p-6 transition-colors hover:border-[#176b45] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176b45] sm:p-7"
            >
              <div className="flex items-center justify-between border-b border-[#e0e5de] pb-5">
                <span className="text-[10px] font-semibold tracking-[.18em] text-[#8a7740]">{role.subtitle}</span>
                <span className="font-heading text-2xl text-[#b2bfb3] transition-colors group-hover:text-[#176b45]">{role.number}</span>
              </div>
              <h2 className="mt-6 font-heading text-2xl font-normal tracking-[-.025em] text-[#124c36]">{bn ? (
                role.number === "01" ? "অ্যাডমিন" : role.number === "02" ? "শিক্ষক" : "লেখক"
              ) : role.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[#657269]">{bn ? (
                role.number === "01" ? "প্রশাসনিক কার্যক্রম, অ্যাকাউন্ট ও ওয়েবসাইট পরিচালনা করুন।" : role.number === "02" ? "আপনার কর্মী পরিচিতি দিয়ে শিক্ষক পোর্টালে প্রবেশ করুন।" : "স্কুলের ব্লগের লেখা তৈরি ও সম্পাদনা করুন।"
              ) : role.description}</p>
              <span className="mt-auto flex items-center justify-between border-t border-[#e0e5de] pt-5 text-[10px] font-semibold uppercase tracking-[.12em] text-[#176b45]">
                {bn ? "লগইন পোর্টালে যান" : role.action}
                <span aria-hidden="true" className="text-base transition-transform group-hover:translate-x-1">↗</span>
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-8 border-t border-white/25 pt-5">
          <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-xs font-medium text-white/85 transition hover:text-white">
            <span aria-hidden="true">←</span> {bn ? "মূল ওয়েবসাইটে ফিরে যান" : "Return to the main website"}
          </Link>
        </div>
      </section>
    </main>
  );
}
