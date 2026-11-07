import Link from "next/link";
import { CountUp } from "@/components/motion/CountUp";
import { BarList } from "@/components/motion/Charts";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import {
  FiArrowUpRight, FiBell, FiBookOpen, FiBriefcase, FiGrid, FiHelpCircle,
  FiMessageSquare, FiShield, FiUserCheck, FiAward, FiLayers, FiMapPin,
} from "react-icons/fi";

export default async function DashboardOverviewPage() {
  const user = await requireAdmin();
  const [
    teachers, notices, alumni, careers, careerApplications,
    helpArticles, blogApplications, administrators, clubs, facilities,
    achievements, bloggerProfiles, blogArticles,
  ] = await Promise.all([
    prisma.teacherProfile.count(),
    prisma.notice.count(),
    prisma.alumniMessage.count(),
    prisma.career.count(),
    prisma.careerApplication.count(),
    prisma.helpArticle.count(),
    prisma.blogApplication.count(),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.club.count(),
    prisma.facility.count(),
    prisma.achievement.count(),
    prisma.bloggerProfile.count(),
    prisma.blogArticle.count(),
  ]);

  const firstName = user.name?.trim().split(/\s+/)[0] || user.email?.split("@")[0] || "Administrator";

  const summaryGroups = [
    {
      title: "People", description: "Faculty profiles and institutional personnel", icon: FiUserCheck,
      items: [
        { label: "Teacher profiles", value: teachers, href: "/admin/teachers" },
        { label: "Administrators", value: administrators, href: "/admin/administrators" },
      ],
    },
    {
      title: "Website content", description: "Published information maintained by the administration", icon: FiLayers,
      items: [
        { label: "Notices", value: notices, href: "/admin/notices" },
        { label: "Alumni messages", value: alumni, href: "/admin/alumni" },
        { label: "Help articles", value: helpArticles, href: "/admin/help" },
      ],
    },
    {
      title: "Campus & achievements", description: "The school’s activities and public-facing records", icon: FiMapPin,
      items: [
        { label: "Clubs", value: clubs, href: "/admin/clubs" },
        { label: "Facilities", value: facilities, href: "/admin/facilities" },
        { label: "Achievements", value: achievements, href: "/admin/achievements" },
      ],
    },
    {
      title: "Careers", description: "Recruitment and incoming job applications", icon: FiBriefcase,
      items: [
        { label: "Vacancies", value: careers, href: "/admin/careers" },
        { label: "Career applications", value: careerApplications, href: "/admin/careers" },
      ],
    },
    {
      title: "Blogger programme", description: "Student blogger onboarding and editorial content", icon: FiBookOpen,
      items: [
        { label: "Blogger applications", value: blogApplications, href: "/admin/blog/applications" },
        { label: "Blogger profiles", value: bloggerProfiles, href: "/admin/blog/profiles" },
        { label: "Blog articles", value: blogArticles, href: "/admin/blog/articles" },
      ],
    },
  ];

  const groupTotals = summaryGroups.map((group) => ({
    label: group.title,
    value: group.items.reduce((sum, item) => sum + item.value, 0),
    href: group.items[0]!.href,
  }));

  const summaryTiles = [
    { label: "Administrators", value: administrators },
    { label: "Faculty", value: teachers },
    { label: "Notices", value: notices },
    { label: "Vacancies", value: careers },
    { label: "Content records", value: alumni + helpArticles + clubs + facilities + achievements },
    { label: "Admin accounts", value: administrators },
  ];

  return (
    <div className="w-full space-y-10">
      {/* Welcome */}
      <section className="kc-dash-hero kc-enter grid min-h-[320px] w-full rounded-3xl shadow-lift lg:grid-cols-[1.2fr_.8fr]">
        <div aria-hidden="true" className="kc-float pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full border-[40px] border-white/[0.04]" />
        <div className="relative flex flex-col justify-between border-b border-white/15 px-6 py-8 sm:px-9 sm:py-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-11">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e4d49a]">K C Model School & College · Administration</p>
          <div className="py-8 lg:py-10">
            <h1 className="font-heading text-5xl font-normal leading-[1] tracking-[-0.04em] sm:text-6xl xl:text-7xl">Welcome back,<br /><span className="text-[#e4d49a]">{firstName}.</span></h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/80">Your administrative overview. Maintain school content, manage staff and keep the institution’s digital services up to date.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/admin/notices" className="kc-btn bg-[#fffdf8] text-[#124c36] hover:-translate-y-0.5 hover:bg-white hover:shadow-lift">Manage notices <FiArrowUpRight className="h-4 w-4" /></Link>
              <Link href="/admin/settings" className="kc-btn border border-white/40 text-white hover:-translate-y-0.5 hover:bg-white/10">Account settings <FiArrowUpRight className="h-4 w-4" /></Link>
            </div>
          </div>
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-white/60"><span className="kc-live-dot h-2 w-2 rounded-full bg-[#7fe0aa]" /> Administrator workspace · Live system summary</p>
        </div>
        <div className="relative flex flex-col justify-center px-6 py-8 sm:px-9 lg:px-10 xl:px-12">
          <div className="flex items-start justify-between gap-4 border-b border-white/20 pb-5">
            <div><p className="text-xs uppercase tracking-[0.18em] text-white/65">Operational summary</p><p className="mt-2 font-heading text-2xl sm:text-3xl">Admin workspace</p></div>
            <span className="rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-xs uppercase tracking-[0.12em] text-[#f1e6bd]">Live data</span>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-6 py-7 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
            {summaryTiles.map((item) => (
              <div key={item.label}>
                <p className="text-xs uppercase tracking-[0.14em] text-white/65">{item.label}</p>
                <p className="mt-1 font-heading text-4xl sm:text-5xl"><CountUp text={item.value} /></p>
              </div>
            ))}
          </div>
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center justify-between gap-4 border-t border-white/20 pt-4 text-sm text-white/80 transition hover:text-white"><span>Open public website</span><FiArrowUpRight className="h-4 w-4" /></a>
        </div>
      </section>

      {/* Directory */}
      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-[#d9d8cf] pb-4">
          <div><p className="kc-section-label">Workspace directory</p><h2 className="mt-1 font-heading text-3xl text-[#124c36]">Overview of administration</h2></div>
          <p className="text-sm text-[#69716b]">Current record counts · Select a section to manage it</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {summaryGroups.map((group, index) => {
            const Icon = group.icon;
            return <section key={group.title} className="kc-panel kc-lift flex min-w-0 flex-col overflow-hidden">
              <div className="flex items-start gap-4 border-b border-[#e4e2da] px-6 py-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#e3f2e9] text-[#176b45]"><Icon className="h-5 w-5" /></span>
                <div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#858c85]">Section {String(index + 1).padStart(2, "0")}</p><h3 className="mt-1 font-heading text-2xl text-[#124c36]">{group.title}</h3><p className="mt-1 text-sm leading-6 text-[#69716b]">{group.description}</p></div>
              </div>
              <div className="kc-rows flex-1 divide-y divide-[#e4e2da]">
                {group.items.map((item) => <Link key={item.label} href={item.href} className="flex items-center justify-between gap-4 px-6 py-3.5">
                  <span className="text-base text-[#303831]">{item.label}</span><span className="flex items-center gap-3"><strong className="font-heading text-2xl font-normal tabular-nums text-[#124c36]"><CountUp text={item.value} /></strong><FiArrowUpRight className="h-4 w-4 text-[#8a918b]" /></span>
                </Link>)}
              </div>
            </section>;
          })}
          <section className="kc-panel flex min-w-0 flex-col overflow-hidden">
            <div className="flex items-start gap-4 border-b border-[#e4e2da] px-6 py-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#176b45] text-white"><FiGrid className="h-5 w-5" /></span>
              <div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#858c85]">At a glance</p><h3 className="mt-1 font-heading text-2xl text-[#124c36]">Records by section</h3><p className="mt-1 text-sm leading-6 text-[#69716b]">Total records in each area of the workspace</p></div>
            </div>
            <div className="flex-1 px-6 py-6"><BarList items={groupTotals} /></div>
          </section>
        </div>
      </section>

      {/* Shortcuts */}
      <section>
        <div className="mb-5"><p className="kc-section-label">Common tasks</p><h2 className="mt-1 font-heading text-2xl text-[#124c36]">Administration shortcuts</h2></div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Publish a notice", description: "Community announcements", href: "/admin/notices", icon: FiBell },
            { label: "Manage alumni", description: "Alumni messages and profiles", href: "/admin/alumni", icon: FiMessageSquare },
            { label: "Review careers", description: "Vacancies and applications", href: "/admin/careers", icon: FiBriefcase },
            { label: "Review blogger requests", description: "Student contributor applications", href: "/admin/blog/applications", icon: FiBookOpen },
            { label: "Manage facilities", description: "Campus facilities records", href: "/admin/facilities", icon: FiGrid },
            { label: "Manage achievements", description: "Institutional achievements", href: "/admin/achievements", icon: FiAward },
            { label: "Help Center", description: "Support articles and guidance", href: "/admin/help", icon: FiHelpCircle },
            { label: "Account & security", description: "Administrator settings", href: "/admin/settings", icon: FiShield },
          ].map((item) => { const Icon = item.icon; return <Link key={item.href + item.label} href={item.href} className="kc-panel kc-lift group flex items-center gap-4 p-5"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#e3f2e9] text-[#176b45] transition-colors group-hover:bg-[#176b45] group-hover:text-white"><Icon className="h-5 w-5" /></span><span className="min-w-0"><span className="block text-base font-medium text-[#124c36]">{item.label}</span><span className="mt-0.5 block text-sm text-[#69716b]">{item.description}</span></span></Link>; })}
        </div>
      </section>
    </div>
  );
}
