import sanitizeHtml from "sanitize-html";
import { notFound } from "next/navigation";
import BloggerAvatar from "@/components/blog/BloggerAvatar";
import { isLocale } from "@/i18n/config";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function BlogArticlePage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!isLocale(params.locale)) notFound();

  const article = await prisma.blogArticle.findFirst({
    where: { slug: params.slug, status: "PUBLISHED" },
    include: {
      author: {
        select: { displayName: true, type: true, photoUrl: true },
      },
    },
  });
  if (!article) notFound();

  await prisma.blogArticle
    .update({
      where: { id: article.id },
      data: { viewCount: { increment: 1 } },
    })
    .catch(() => {});

  return (
    <article className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
      <p className="text-xs font-bold uppercase tracking-[.18em] text-[#176b45]">
        KCMSC Journal ·{" "}
        {article.author.type === "STUDENT"
          ? "Student voice"
          : "Faculty perspective"}
      </p>
      <h1 className="mt-5 font-serif text-4xl font-medium leading-tight tracking-tight sm:text-6xl">
        {article.title}
      </h1>
      {article.excerpt && (
        <p className="mt-6 text-lg leading-8 text-[#667066]">
          {article.excerpt}
        </p>
      )}
      <div className="mt-7 flex items-center gap-3 border-y border-[#e3e5dd] py-4">
        <BloggerAvatar
          name={article.author.displayName}
          photoUrl={article.author.photoUrl}
          className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-[#e7efe5] font-serif text-lg text-[#176b45]"
        />
        <div>
          <p className="text-sm font-semibold">{article.author.displayName}</p>
          <p className="mt-1 text-xs text-[#69716b]">
            {article.publishedAt?.toLocaleDateString(
              params.locale === "bn" ? "bn-BD" : "en-GB",
              { dateStyle: "long" },
            )}
          </p>
        </div>
      </div>
      {article.featuredImage && (
        <img
          src={article.featuredImage}
          alt=""
          className="mt-8 max-h-[520px] w-full rounded-2xl object-cover"
        />
      )}
      <div
        className="blog-article-content mt-10"
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(article.content, {
            allowedTags: [
              "p",
              "br",
              "strong",
              "b",
              "em",
              "i",
              "u",
              "h2",
              "h3",
              "ul",
              "ol",
              "li",
              "blockquote",
              "a",
              "img",
            ],
            allowedAttributes: {
              a: ["href", "target", "rel"],
              img: ["src", "alt", "title"],
            },
            allowedSchemes: ["http", "https", "mailto", "data"],
          }),
        }}
      />
      <style>{`.blog-article-content{font-size:17px;line-height:1.9;color:#333b34;overflow-wrap:anywhere}.blog-article-content h2{font-family:Georgia,serif;font-size:1.8rem;margin:2rem 0 .8rem}.blog-article-content h3{font-size:1.35rem;font-weight:700;margin:1.5rem 0 .6rem}.blog-article-content p{margin:1rem 0}.blog-article-content ul{list-style:disc;padding-left:1.5rem}.blog-article-content ol{list-style:decimal;padding-left:1.5rem}.blog-article-content img{max-width:100%;height:auto;border-radius:12px;margin:1.5rem auto}.blog-article-content blockquote{border-left:3px solid #b59a4a;padding-left:1rem;color:#59665b;font-style:italic}`}</style>
    </article>
  );
}
