import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { FiArrowUpRight, FiEye, FiFileText, FiPenTool, FiPlus } from "react-icons/fi";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import { BloggerProfileMenu, BloggerSidebar } from "./DashboardNavigation";
import { CountUp } from "@/components/motion/CountUp";
import { Bar, Ring } from "@/components/motion/Charts";
import { ScrollEffects } from "@/components/motion/ScrollEffects";

export const dynamic = "force-dynamic";

export default async function BloggerDashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "BLOGGER") {
    redirect("/blogger/login");
  }

  const profile = await prisma.bloggerProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      articles: {
        orderBy: { updatedAt: "desc" },
        take: 6,
      },
    },
  });
  if (!profile) redirect("/blogger/login");

  const [articleCount, publishedCount, draftCount, viewStats] = await Promise.all([
    prisma.blogArticle.count({ where: { authorId: profile.id } }),
    prisma.blogArticle.count({
      where: { authorId: profile.id, status: "PUBLISHED" },
    }),
    prisma.blogArticle.count({ where: { authorId: profile.id, status: "DRAFT" } }),
    prisma.blogArticle.aggregate({
      where: { authorId: profile.id },
      _sum: { viewCount: true },
    }),
  ]);
  const totalViews = viewStats._sum.viewCount ?? 0;
  const roleLabel =
    profile.type === "STUDENT"
      ? `Student${profile.className ? ` · Class ${profile.className}` : ""}${
          profile.section ? ` · Section ${profile.section}` : ""
        }`
      : `Teacher${profile.subject ? ` · ${profile.subject}` : ""}`;
  const number = (value: number) => value.toLocaleString("en");
  const date = (value: Date) =>
    new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(value);

  const stats = [
    {
      label: "Total articles",
      value: articleCount,
      note: "All your writing",
      icon: FiFileText,
      tone: "bg-[#e3f2e9] text-[#176b45]",
    },
    {
      label: "Published",
      value: publishedCount,
      note: "Visible in the journal",
      icon: FiPenTool,
      tone: "bg-[#d5eedf] text-[#1f8a5b]",
    },
    {
      label: "Drafts",
      value: draftCount,
      note: "Ready when you are",
      icon: FiFileText,
      tone: "bg-[#f3eac8] text-[#8a6d1d]",
    },
    {
      label: "Article views",
      value: totalViews,
      note: "Across all articles",
      icon: FiEye,
      tone: "bg-[#e5efe9] text-[#124c36]",
    },
  ];

  return (
    <div className="kc-dash-canvas min-h-screen text-[#25352b] lg:flex">
      <ScrollEffects />
      <BloggerSidebar />
      <main className="min-w-0 flex-1 lg:ml-64">
        <header className="sticky top-0 z-20 flex min-h-[76px] items-center justify-between border-b border-[#d9d8cf] bg-white/95 px-5 py-3 backdrop-blur sm:px-8">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[.16em] text-[#778078]">
              Blogger workspace
            </p>
            <p className="mt-1 text-sm font-semibold text-[#36463b]">Dashboard</p>
          </div>
          <BloggerProfileMenu
            displayName={profile.displayName}
            roleLabel={roleLabel}
            photoUrl={profile.photoUrl}
          />
        </header>

        <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 sm:py-10 xl:px-12">
          <section className="kc-dash-hero kc-enter flex flex-col justify-between gap-6 rounded-3xl p-6 shadow-lift sm:flex-row sm:items-end sm:p-9">
            <div aria-hidden="true" className="kc-float pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border-[36px] border-white/[0.04]" />
            <div className="relative">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#e4d49a]">KCMSC Journal</p>
              <h1 className="mt-3 font-heading text-4xl font-normal leading-[1.05] tracking-[-.03em] sm:text-5xl">
                Welcome back, {profile.displayName}
              </h1>
              <p className="mt-3 text-base text-white/80">
                {roleLabel} <span className="mx-1.5 text-white/40">/</span> Here&apos;s
                how your writing is doing.
              </p>
            </div>
            <Link
              href="/blogger/articles/new"
              className="kc-btn relative self-start bg-[#fffdf8] text-[#124c36] hover:-translate-y-0.5 hover:bg-white hover:shadow-lift focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <FiPlus aria-hidden="true" size={17} />
              Write an article
            </Link>
          </section>

          <section aria-label="Writing statistics" className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map(({ label, value, note, icon: Icon, tone }) => (
              <article
                key={label}
                className="kc-panel kc-lift p-5 sm:p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-[#6c786e]">{label}</p>
                  <span className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}>
                    <Icon aria-hidden="true" size={18} />
                  </span>
                </div>
                <p className="mt-4 font-heading text-5xl text-[#124c36]"><CountUp text={number(value)} /></p>
                <p className="mt-1 text-sm text-[#69716b]">{note}</p>
              </article>
            ))}
          </section>

          <div className="mt-8 grid items-start gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(270px,.8fr)]">
            <section
              id="articles"
              aria-labelledby="articles-heading"
              className="min-w-0 rounded-2xl border border-[#d9d8cf] bg-white p-5 shadow-card sm:p-7"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-[.15em] text-[#8a938b]">
                    Your workspace
                  </p>
                  <h2
                    id="articles-heading"
                    className="mt-1.5 font-serif text-2xl text-[#223c2d]"
                  >
                    Recent articles
                  </h2>
                </div>
                <span className="rounded-full bg-[#f2f5f1] px-3 py-1.5 text-xs font-medium text-[#617065]">
                  {number(articleCount)} total
                </span>
              </div>

              {profile.articles.length ? (
                <div className="mt-5 divide-y divide-[#edf0eb]">
                  {profile.articles.map((article) => {
                    const published = article.status === "PUBLISHED";
                    return (
                      <article
                        key={article.id}
                        className="flex flex-col gap-3 py-4 first:pt-2 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold text-[#314337]">
                            {article.title || "Untitled article"}
                          </h3>
                          <p className="mt-1.5 text-xs text-[#899189]">
                            Updated {date(article.updatedAt)}
                            <span className="mx-2 text-[#c2c9c1]">·</span>
                            {number(article.viewCount)} views
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[12px] font-bold uppercase tracking-[.08em] ${
                              published
                                ? "bg-[#eaf3eb] text-[#287348]"
                                : "bg-[#f6f0e4] text-[#987633]"
                            }`}
                          >
                            {article.status.toLowerCase()}
                          </span>
                          <Link
                            href={`/blogger/articles/new?edit=${article.id}`}
                            aria-label={`Edit ${article.title || "untitled article"}`}
                            className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#176b45] transition hover:bg-[#f1f5f1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176b45]"
                          >
                            Edit
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-6 rounded-xl border border-dashed border-[#dce4da] bg-[#fafbf9] px-5 py-10 text-center">
                  <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-[#eaf2eb] text-[#176b45]">
                    <FiPenTool aria-hidden="true" size={18} />
                  </span>
                  <h3 className="mt-4 font-serif text-xl text-[#314337]">
                    Your first story starts here
                  </h3>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#7b857d]">
                    Create a draft and share your ideas with the KCMSC community.
                  </p>
                  <Link
                    href="/blogger/articles/new"
                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#176b45] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#124c36]"
                  >
                    <FiPlus aria-hidden="true" size={16} />
                    Start writing
                  </Link>
                </div>
              )}

              {profile.articles.length > 0 && (
                <Link
                  href="#articles"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#176b45] hover:text-[#124c36]"
                >
                  Showing your latest {profile.articles.length}
                  <FiArrowUpRight aria-hidden="true" size={14} />
                </Link>
              )}
            </section>

            <aside className="space-y-6">
              <section className="kc-dash-hero rounded-2xl p-6 shadow-card">
                <p className="text-[12px] font-bold uppercase tracking-[.16em] text-white/55">
                  Keep the ideas flowing
                </p>
                <h2 className="mt-3 font-serif text-2xl leading-tight">
                  Every story adds to our school community.
                </h2>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  Pick up where you left off or start something new.
                </p>
                <Link
                  href="/blogger/articles/new"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#176b45] transition hover:bg-[#eef4ee]"
                >
                  Write a story
                  <FiArrowUpRight aria-hidden="true" size={15} />
                </Link>
              </section>

              <section className="kc-panel p-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-2xl text-[#124c36]">Publishing status</h2>
                  <FiFileText aria-hidden="true" className="text-[#829084]" size={18} />
                </div>
                <div className="mt-5 flex items-center gap-5">
                  <Ring value={publishedCount} max={articleCount || 1} size={96} stroke={9} label="Share of articles published">
                    <span className="font-heading text-xl text-[#124c36]">
                      <CountUp text={`${articleCount ? Math.round((publishedCount / articleCount) * 100) : 0}%`} />
                    </span>
                  </Ring>
                  <p className="text-sm leading-6 text-[#69716b]">of your articles are published in the journal.</p>
                </div>
                <div className="mt-6 space-y-5">
                  <div>
                    <div className="flex items-center justify-between text-base">
                      <span className="text-[#58645c]">Published</span>
                      <span className="font-semibold text-[#124c36]">
                        <CountUp text={number(publishedCount)} />
                      </span>
                    </div>
                    <Bar value={publishedCount} max={articleCount || 1} className="mt-2 h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-base">
                      <span className="text-[#58645c]">Drafts</span>
                      <span className="font-semibold text-[#124c36]">
                        <CountUp text={number(draftCount)} />
                      </span>
                    </div>
                    <Bar value={draftCount} max={articleCount || 1} delay={120} className="mt-2 h-2" />
                  </div>
                </div>
                <p className="mt-5 border-t border-[#edf0eb] pt-4 text-sm leading-6 text-[#69716b]">
                  Your latest six articles appear in the workspace list.
                </p>
              </section>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
