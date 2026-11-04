import Link from "next/link";
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

  return (
    <div className="w-full space-y-8">
      <section className="grid min-h-[310px] w-full overflow-hidden border border-[#124c36] bg-[#124c36] text-[#fffdf8] lg:grid-cols-[1.2fr_.8fr]">
        <div className="flex flex-col justify-between border-b border-white/15 px-6 py-8 sm:px-9 sm:py-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-11">
          <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#d4c38c]">K C Model School & College · Administration</p>
          <div className="py-8 lg:py-10">
            <h1 className="font-heading text-5xl font-normal leading-[.98] tracking-[-0.045em] sm:text-6xl xl:text-7xl">Welcome back,<br /><span className="text-[#d4c38c]">{firstName}.</span></h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/75">Your administrative overview. Maintain school content, manage staff and keep the institution’s digital services up to date.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/admin/notices" className="inline-flex min-h-11 items-center gap-3 bg-[#fffdf8] px-5 text-[11px] font-semibold text-[#124c36] hover:bg-[#e9e5d8]">Manage notices <FiArrowUpRight className="h-4 w-4" /></Link>
              <Link href="/admin/settings" className="inline-flex min-h-11 items-center gap-3 border border-white/35 px-5 text-[11px] font-semibold text-white hover:bg-white/10">Account settings <FiArrowUpRight className="h-4 w-4" /></Link>
            </div>
          </div>
          <p className="text-[9px] uppercase tracking-[0.18em] text-white/45">Administrator workspace · Live system summary</p>
        </div>
        <div className="flex flex-col justify-center px-6 py-8 sm:px-9 lg:px-10 xl:px-12">
          <div className="flex items-start justify-between gap-4 border-b border-white/20 pb-5">
            <div><p className="text-[9px] uppercase tracking-[0.2em] text-white/55">Operational summary</p><p className="mt-2 font-heading text-2xl sm:text-3xl">Admin workspace</p></div>
            <span className="border border-white/25 px-3 py-2 text-[9px] uppercase tracking-[0.13em] text-[#e4d5a4]">Live data</span>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-5 py-6 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
            {[
              { label: "Administrators", value: administrators },
              { label: "Faculty", value: teachers },
              { label: "Notices", value: notices },
              { label: "Vacancies", value: careers },
              { label: "Content records", value: alumni + helpArticles + clubs + facilities + achievements },
              { label: "Admin accounts", value: administrators },
            ].map((item) => <div key={item.label}><p className="text-[9px] uppercase tracking-[0.16em] text-white/50">{item.label}</p><p className="mt-1 font-heading text-3xl sm:text-4xl">{item.value}</p></div>)}
          </div>
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center justify-between gap-4 border-t border-white/20 pt-4 text-xs text-white/75 hover:text-white"><span>Open public website</span><FiArrowUpRight className="h-4 w-4" /></a>
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-[#d9d8cf] pb-3">
          <div><p className="kc-section-label">Workspace directory</p><h2 className="mt-1 font-heading text-2xl text-[#124c36]">Overview of administration</h2></div>
          <p className="text-xs text-[#69716b]">Current record counts · Select a section to manage it</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {summaryGroups.map((group, index) => {
            const Icon = group.icon;
            return <section key={group.title} className="flex min-w-0 flex-col border border-[#d9d8cf] bg-[#fffdf8]">
              <div className="flex items-start gap-3 border-b border-[#d9d8cf] px-5 py-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center border border-[#d9d8cf] bg-[#f1f1e9] text-[#176b45]"><Icon className="h-4 w-4" /></span>
                <div className="min-w-0"><p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-[#858c85]">Section {String(index + 1).padStart(2, "0")}</p><h3 className="mt-1 font-heading text-xl text-[#124c36]">{group.title}</h3><p className="mt-1 text-xs leading-5 text-[#69716b]">{group.description}</p></div>
              </div>
              <div className="flex-1 divide-y divide-[#e4e2da]">
                {group.items.map((item) => <Link key={item.label} href={item.href} className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-[#f5f4ee]">
                  <span className="text-sm text-[#303831]">{item.label}</span><span className="flex items-center gap-3"><strong className="font-heading text-xl font-normal tabular-nums text-[#124c36]">{item.value}</strong><FiArrowUpRight className="h-3.5 w-3.5 text-[#8a918b]" /></span>
                </Link>)}
              </div>
            </section>;
          })}
        </div>
      </section>

      <section className="border-t border-[#d9d8cf] pt-5">
        <div className="mb-3"><p className="kc-section-label">Common tasks</p><h2 className="mt-1 font-heading text-xl text-[#124c36]">Administration shortcuts</h2></div>
        <div className="grid gap-px border border-[#d9d8cf] bg-[#d9d8cf] sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Publish a notice", description: "Community announcements", href: "/admin/notices", icon: FiBell },
            { label: "Manage alumni", description: "Alumni messages and profiles", href: "/admin/alumni", icon: FiMessageSquare },
            { label: "Review careers", description: "Vacancies and applications", href: "/admin/careers", icon: FiBriefcase },
            { label: "Review blogger requests", description: "Student contributor applications", href: "/admin/blog/applications", icon: FiBookOpen },
            { label: "Manage facilities", description: "Campus facilities records", href: "/admin/facilities", icon: FiGrid },
            { label: "Manage achievements", description: "Institutional achievements", href: "/admin/achievements", icon: FiAward },
            { label: "Help Center", description: "Support articles and guidance", href: "/admin/help", icon: FiHelpCircle },
            { label: "Account & security", description: "Administrator settings", href: "/admin/settings", icon: FiShield },
          ].map((item) => { const Icon = item.icon; return <Link key={item.href + item.label} href={item.href} className="flex items-center gap-3 bg-[#fffdf8] p-4 hover:bg-[#f5f4ee]"><span className="grid h-9 w-9 shrink-0 place-items-center border border-[#d9d8cf] text-[#176b45]"><Icon className="h-4 w-4" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-medium text-[#242824]">{item.label}</span><span className="mt-1 block text-xs leading-5 text-[#69716b]">{item.description}</span></span><FiArrowUpRight className="h-4 w-4 shrink-0 text-[#8a918b]" /></Link>; })}
        </div>
      </section>
    </div>
  );
}
