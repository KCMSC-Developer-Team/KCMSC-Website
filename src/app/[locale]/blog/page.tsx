import Link from "next/link";
import { prisma } from "@/lib/db";
import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const BOOKFAIR_IMAGE = "/kcmsc/student-life/students_at_bookfair.jpg";

export default async function BlogPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();

  const locale = params.locale;
  const bn = locale === "bn";
  const posts = await prisma.blogArticle
    .findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 30,
      include: { author: { select: { displayName: true, type: true } } },
    })
    .catch(() => []);

  const copy = bn
    ? {
        eyebrow: "কে সি মডেল স্কুল অ্যান্ড কলেজের সাময়িকী",
        title: "ভাবনার শুরু এখানেই।",
        intro: "শিক্ষার্থী ও শিক্ষকদের লেখা, কবিতা, অভিজ্ঞতা এবং নতুন ভাবনার জন্য একটি জায়গা।",
        apply: "লেখক হতে আবেদন করুন",
        noteLabel: "আমাদের বিশ্বাস",
        noteTitle: "প্রতিটি কৌতূহলী মনেরই বলার মতো গল্প আছে।",
        noteBody: "শিক্ষার্থীদের কণ্ঠ, সৃজনশীলতা ও নতুন কিছু আবিষ্কারের একটি পরিসর।",
        sectionEyebrow: "আমাদের কমিউনিটি থেকে",
        latest: "সাম্প্রতিক লেখা",
        sectionIntro: "KCMSC-এর অনুমোদিত লেখকদের গল্প, ভাবনা ও আবিষ্কার।",
        published: "প্রকাশিত লেখা",
        student: "শিক্ষার্থীর লেখা",
        teacher: "শিক্ষকের লেখা",
        read: "লেখাটি পড়ুন",
        emptyTitle: "এখানেই শুরু হোক নতুন অধ্যায়।",
        emptyBody: "অনুমোদিত লেখকদের লেখা প্রকাশিত হলে এখানে দেখা যাবে। আপনিও আপনার ভাবনা ভাগ করে নিতে পারেন।",
        emptyCta: "লেখক হতে আবেদন করুন",
        ctaTitle: "আপনারও কি কিছু বলার আছে?",
        ctaBody: "KCMSC সাময়িকীর অংশ হোন।",
        ctaButton: "লেখা জমা দিন",
      }
    : {
        eyebrow: "THE KCMSC JOURNAL",
        title: "Ideas begin here.",
        intro: "A home for student and teacher writing, poetry, discoveries and thoughtful perspectives.",
        apply: "Become a contributor",
        noteLabel: "OUR BELIEF",
        noteTitle: "Every curious mind has a story worth sharing.",
        noteBody: "A space for student voice, creativity and thoughtful discovery.",
        sectionEyebrow: "FROM OUR COMMUNITY",
        latest: "Latest articles",
        sectionIntro: "Stories, ideas and discoveries published by approved KCMSC contributors.",
        published: "published articles",
        student: "STUDENT VOICE",
        teacher: "FACULTY PERSPECTIVE",
        read: "Read article",
        emptyTitle: "Every journal starts with a first page.",
        emptyBody: "Published work from approved KCMSC contributors will appear here. Have an idea to share? We would love to hear your perspective.",
        emptyCta: "Become a contributor",
        ctaTitle: "Have something worth sharing?",
        ctaBody: "Become part of the KCMSC journal.",
        ctaButton: "Contribute to the journal",
      };

  return (
    <main className="kc-journal-page bg-[#fbfaf6] text-[#252a25]">
      <section className="kc-journal-hero kc-feature-hero relative isolate flex min-h-[500px] items-end overflow-hidden sm:min-h-[560px] lg:min-h-[610px]">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{ backgroundImage: `url('${BOOKFAIR_IMAGE}')` }}
          role="img"
          aria-label={bn ? "বিদ্যালয়ের বইমেলায় শিক্ষার্থীরা বই দেখছে" : "KCMSC students exploring books at a book fair"}
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(12,31,23,.86)_0%,rgba(12,31,23,.67)_45%,rgba(12,31,23,.20)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(8,24,17,.66)_0%,transparent_58%)]" />

        <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 items-end gap-10 px-5 pb-12 pt-20 sm:px-8 sm:pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(250px,360px)] lg:px-10 lg:pb-[4.5rem]">
          <div className="max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#e4d39a] sm:text-xs">{copy.eyebrow}</p>
            <h1 className="mt-5 max-w-3xl font-heading text-5xl font-normal leading-[.99] tracking-[-.045em] text-white sm:text-6xl md:text-7xl lg:text-[5.5rem]">
              {copy.title}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/90 sm:text-lg sm:leading-8">{copy.intro}</p>
            <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row">
              <Link href={`/${locale}/blog/apply`} className="inline-flex min-h-12 items-center justify-center border border-[#e4d39a] bg-[#e4d39a] px-6 py-3 text-sm font-semibold text-[#17382b] transition-colors hover:bg-[#f0e3b5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                {copy.apply} <span aria-hidden="true" className="ml-2">↗</span>
              </Link>
            </div>
          </div>

          <aside className="hidden border-l border-white/40 pl-6 text-white lg:block">
            <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#e4d39a]">{copy.noteLabel}</p>
            <h2 className="mt-4 font-heading text-2xl leading-tight">{copy.noteTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-white/80">{copy.noteBody}</p>
          </aside>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#b59a4a]" />
      </section>

      <section className="relative isolate overflow-hidden bg-[#f0f2eb] px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-[4.5rem]">
        <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-col gap-4 border-b border-[#deded5] pb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#176b45] sm:text-xs">{copy.sectionEyebrow}</p>
            <h2 className="mt-3 font-heading text-3xl font-normal tracking-[-.03em] sm:text-4xl">{copy.latest}</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#69716b] sm:text-base">{copy.sectionIntro}</p>
          </div>
          <p className="shrink-0 text-sm text-[#69716b]">
            <span className="font-semibold text-[#176b45]">{posts.length}</span> {copy.published}
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {posts.map((post, index) => {
              const date = post.publishedAt?.toLocaleDateString(
                bn ? "bn-BD" : "en-GB",
                { day: "numeric", month: "short", year: "numeric" },
              );
              return (
                <article key={post.id} className="group flex h-full flex-col overflow-hidden border border-[#d5ddd2] border-t-2 border-t-[#b59a4a] bg-[#fffdf8] transition-colors hover:border-[#176b45] hover:bg-white">
                  {post.featuredImage ? (
                    <Link href={`/${locale}/blog/${post.slug}`} className="relative block aspect-[16/9] overflow-hidden bg-[#e8e9df]" aria-label={`${copy.read}: ${post.title}`}>
                      <img src={post.featuredImage} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                      <span className="absolute bottom-4 left-4 rounded-full border border-white/35 bg-black/25 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.15em] text-white backdrop-blur-sm">
                        {post.author.type === "STUDENT" ? copy.student : copy.teacher}
                      </span>
                    </Link>
                  ) : null}
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs text-[#777e75]">{date || "KCMSC Journal"}</p>
                      <span className="text-[10px] font-bold uppercase tracking-[.15em] text-[#176b45]">{post.author.type === "STUDENT" ? copy.student : copy.teacher}</span>
                    </div>
                    <h3 className="mt-3 font-heading text-[1.55rem] leading-[1.2] tracking-[-.02em] text-[#252a25] sm:text-[1.7rem]">
                      <Link href={`/${locale}/blog/${post.slug}`} className="decoration-[#b59a4a] decoration-2 underline-offset-4 group-hover:underline">{post.title}</Link>
                    </h3>
                    {post.excerpt ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#69716b]">{post.excerpt}</p> : <p className="mt-3 text-sm leading-6 text-[#69716b]">{copy.noteBody}</p>}
                    <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#edede7] pt-5 mt-6">
                      <span className="min-w-0 truncate text-xs font-medium text-[#525d53]">{post.author.displayName}</span>
                      <Link href={`/${locale}/blog/${post.slug}`} className="inline-flex shrink-0 items-center gap-2 text-xs font-semibold text-[#176b45] hover:text-[#124c36]">{copy.read}<span aria-hidden="true">↗</span></Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 grid overflow-hidden rounded-2xl border border-[#e1e1d8] bg-white md:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
            <div className="min-h-56 bg-cover bg-center md:min-h-[330px]" style={{ backgroundImage: `url('${BOOKFAIR_IMAGE}')` }} role="img" aria-label={bn ? "বইমেলায় শিক্ষার্থীরা" : "Students at the KCMSC book fair"} />
            <div className="flex flex-col items-start justify-center p-7 sm:p-10 lg:p-12">
              <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#176b45]">KCMSC JOURNAL</p>
              <h3 className="mt-4 max-w-lg font-heading text-3xl leading-tight tracking-[-.03em] sm:text-4xl">{copy.emptyTitle}</h3>
              <p className="mt-4 max-w-lg text-sm leading-7 text-[#69716b]">{copy.emptyBody}</p>
              <Link href={`/${locale}/blog/apply`} className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full bg-[#176b45] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#124c36]">{copy.emptyCta}<span aria-hidden="true" className="ml-2">↗</span></Link>
            </div>
          </div>
        )}
        </div>
      </section>

      <section className="border-y border-[#e3e2d9] bg-[#f1f0e8]">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10 lg:py-10">
          <div>
            <h2 className="font-heading text-2xl tracking-[-.02em] text-[#252a25]">{copy.ctaTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-[#69716b]">{copy.ctaBody}</p>
          </div>
          <Link href={`/${locale}/blog/apply`} className="inline-flex min-h-11 items-center justify-center self-start rounded-full border border-[#176b45] px-5 py-3 text-sm font-semibold text-[#176b45] transition hover:bg-[#176b45] hover:text-white md:self-center">
            {copy.ctaButton}<span aria-hidden="true" className="ml-2">↗</span>
          </Link>
        </div>
      </section>

      <style>{`
        .kc-journal-page { overflow-wrap: anywhere; }
        .kc-journal-page a { -webkit-tap-highlight-color: transparent; }
      `}</style>
    </main>
  );
}
