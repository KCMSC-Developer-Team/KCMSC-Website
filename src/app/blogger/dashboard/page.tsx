import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { FiArrowUpRight, FiEye, FiFileText, FiPenTool, FiPlus } from "react-icons/fi";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import { BloggerProfileMenu, BloggerSidebar } from "./DashboardNavigation";

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
      tone: "bg-[#edf2ee] text-[#176b45]",
    },
    {
      label: "Published",
      value: publishedCount,
      note: "Visible in the journal",
      icon: FiPenTool,
      tone: "bg-[#eef3ea] text-[#526f42]",
    },
    {
      label: "Drafts",
      value: draftCount,
      note: "Ready when you are",
      icon: FiFileText,
      tone: "bg-[#f5f0e4] text-[#987633]",
    },
    {
      label: "Article views",
      value: totalViews,
      note: "Across all articles",
      icon: FiEye,
      tone: "bg-[#edf0f4] text-[#4b6380]",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f6f3] text-[#25352b] lg:flex">
      <BloggerSidebar />
      <main className="min-w-0 flex-1 lg:ml-64">
        <header className="sticky top-0 z-20 flex min-h-[76px] items-center justify-between border-b border-[#e4e8e1] bg-white/95 px-5 py-3 backdrop-blur sm:px-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#778078]">
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
          <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium text-[#176b45]">KCMSC Journal</p>
              <h1 className="mt-2 font-serif text-3xl font-medium tracking-[-.03em] text-[#203a2c] sm:text-4xl">
                Welcome back, {profile.displayName}
              </h1>
              <p className="mt-2 text-sm text-[#768078]">
                {roleLabel} <span className="mx-1.5 text-[#c2c9c1]">/</span> Here&apos;s
                how your writing is doing.
              </p>
            </div>
            <Link
              href="/blogger/articles/new"
              className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl bg-[#176b45] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#124c36] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176b45] focus-visible:ring-offset-2 sm:self-auto"
            >
              <FiPlus aria-hidden="true" size={17} />
              Write an article
            </Link>
          </section>

          <section aria-label="Writing statistics" className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map(({ label, value, note, icon: Icon, tone }) => (
              <article
                key={label}
                className="rounded-2xl border border-[#e4e8e1] bg-white p-5 shadow-[0_2px_8px_rgba(30,55,38,.03)] sm:p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-[#6c786e]">{label}</p>
                  <span className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}>
                    <Icon aria-hidden="true" size={18} />
                  </span>
                </div>
                <p className="mt-4 font-serif text-4xl text-[#223c2d]">{number(value)}</p>
                <p className="mt-1 text-xs text-[#899189]">{note}</p>
              </article>
            ))}
          </section>

          <div className="mt-8 grid items-start gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(270px,.8fr)]">
            <section
              id="articles"
              aria-labelledby="articles-heading"
              className="min-w-0 rounded-2xl border border-[#e4e8e1] bg-white p-5 shadow-[0_2px_8px_rgba(30,55,38,.03)] sm:p-7"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#8a938b]">
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
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.08em] ${
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
              <section className="overflow-hidden rounded-2xl bg-[#123b2d] p-6 text-white">
                <p className="text-[10px] font-bold uppercase tracking-[.16em] text-white/55">
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

              <section className="rounded-2xl border border-[#e4e8e1] bg-white p-6 shadow-[0_2px_8px_rgba(30,55,38,.03)]">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl text-[#223c2d]">Publishing status</h2>
                  <FiFileText aria-hidden="true" className="text-[#829084]" size={17} />
                </div>
                <div className="mt-5 space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#69766d]">Published</span>
                      <span className="font-semibold text-[#314337]">
                        {number(publishedCount)}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#edf0eb]">
                      <div
                        className="h-full rounded-full bg-[#39835b]"
                        style={{
                          width: `${articleCount ? (publishedCount / articleCount) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#69766d]">Drafts</span>
                      <span className="font-semibold text-[#314337]">
                        {number(draftCount)}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#edf0eb]">
                      <div
                        className="h-full rounded-full bg-[#c5a15b]"
                        style={{
                          width: `${articleCount ? (draftCount / articleCount) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
                <p className="mt-5 border-t border-[#edf0eb] pt-4 text-xs leading-5 text-[#899189]">
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
