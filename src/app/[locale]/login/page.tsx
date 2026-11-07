import Link from "next/link";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { FiArrowUpRight, FiBookOpen, FiShield, FiUsers } from "react-icons/fi";

const roleIcons = { "01": FiShield, "02": FiUsers, "03": FiBookOpen } as const;

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

export default async function LoginPortalPage({ params }: { params: Promise<{ locale: string }> }) {
  if (!isLocale((await params).locale)) notFound();
  const locale: Locale = (await params).locale as Locale;
  const bn = locale === "bn";

  return (
    <main
      className="kc-login-portal relative isolate min-h-[calc(100vh-140px)] bg-cover bg-center text-[#17382b]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(10, 45, 31, 0.80), rgba(10, 45, 31, 0.66)), url('/kcmsc/student-life/students_at_bookfair.jpg')",
      }}
    >
      <section className="border-b border-white/20 bg-transparent">
        <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8 sm:py-20">
          <p className="kc-enter text-xs font-semibold uppercase tracking-[.22em] text-[#e4d49a]">
            {bn ? "কে সি মডেল স্কুল অ্যান্ড কলেজ" : "K C MODEL SCHOOL & COLLEGE"}
          </p>
          <h1 className="kc-enter mt-4 max-w-2xl font-heading text-5xl font-normal leading-[1.02] tracking-[-.04em] text-white sm:text-6xl" style={{ ["--kc-d" as string]: "90ms" }}>
            {bn ? "আপনার পোর্টাল নির্বাচন করুন" : "Choose your sign-in portal."}
          </h1>
          <p className="kc-enter mt-5 max-w-2xl text-base leading-8 text-white/85 sm:text-lg" style={{ ["--kc-d" as string]: "180ms" }}>
            {bn
              ? "আপনার দায়িত্ব অনুযায়ী পোর্টাল নির্বাচন করে নিরাপদে লগইন করুন।"
              : "Select the portal that matches your role at KCMSC. Each portal provides access to the tools and information relevant to your work."}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8 sm:py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {roles.map((role, index) => {
            const Icon = roleIcons[role.number as keyof typeof roleIcons];
            return (
              <Link
                key={role.number}
                href={role.href}
                style={{ ["--kc-d" as string]: `${260 + index * 110}ms` }}
                className="kc-enter kc-lift group flex min-h-[300px] flex-col rounded-2xl border border-[#d1dacf] bg-[#fffdf8] p-7 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176b45] sm:p-8"
              >
                <div className="flex items-center justify-between border-b border-[#e0e5de] pb-5">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#e3f2e9] text-[#176b45] transition-colors group-hover:bg-[#176b45] group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="text-xs font-semibold tracking-[.16em] text-[#8a7740]">{role.subtitle}</span>
                </div>
                <h2 className="mt-6 font-heading text-3xl font-normal tracking-[-.025em] text-[#124c36]">{bn ? (
                  role.number === "01" ? "অ্যাডমিন" : role.number === "02" ? "শিক্ষক" : "লেখক"
                ) : role.title}</h2>
                <p className="mt-3 text-base leading-7 text-[#58645c]">{bn ? (
                  role.number === "01" ? "প্রশাসনিক কার্যক্রম, অ্যাকাউন্ট ও ওয়েবসাইট পরিচালনা করুন।" : role.number === "02" ? "আপনার কর্মী পরিচিতি দিয়ে শিক্ষক পোর্টালে প্রবেশ করুন।" : "স্কুলের ব্লগের লেখা তৈরি ও সম্পাদনা করুন।"
                ) : role.description}</p>
                <span className="mt-auto flex items-center justify-between border-t border-[#e0e5de] pt-5 text-sm font-semibold text-[#176b45]">
                  {bn ? "লগইন পোর্টালে যান" : role.action}
                  <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-full bg-[#e3f2e9] transition-all group-hover:translate-x-1 group-hover:bg-[#176b45] group-hover:text-white"><FiArrowUpRight className="h-4 w-4" /></span>
                </span>
              </Link>
            );
          })}
        </div>
        <div className="mt-10 border-t border-white/25 pt-6">
          <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-sm font-medium text-white/85 transition hover:gap-3 hover:text-white">
            <span aria-hidden="true">←</span> {bn ? "মূল ওয়েবসাইটে ফিরে যান" : "Return to the main website"}
          </Link>
        </div>
      </section>
    </main>
  );
}
