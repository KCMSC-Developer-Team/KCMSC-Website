import Link from "next/link";
import { getDictionary, isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { prisma } from "@/lib/db";
import { formatNoticeDate } from "@/lib/notice-format";

// Phase 3: live from the Notice model now. If the database isn't
// reachable yet (e.g. DATABASE_URL not configured in this environment),
// this fails soft into the same empty state a genuinely-empty notice
// board would show, rather than crashing the page.
async function getPublishedNotices() {
  try {
    return await prisma.notice.findMany({
      where: { isPublished: true, noticeAt: { not: null }, imageUrls: { isEmpty: false } },
      orderBy: [{ noticeAt: "desc" }, { publishedAt: "desc" }]
    });
  } catch {
    return null;
  }
}

export default async function NoticesPage({ params }: { params: Promise<{ locale: string }> }) {
  if (!isLocale((await params).locale)) notFound();
  const locale: Locale = (await params).locale as Locale;
  const dict = getDictionary(locale);
  const page = dict.noticesPage;
  const notices = await getPublishedNotices();

  return (
    <>
      <PageHeader heading={page.heading} />
      <section className="mx-auto max-w-content px-6 py-16">
        {!notices || notices.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-10 text-center text-ink-muted">
            {page.empty}
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {notices.map((n) => {
              const when = formatNoticeDate(n.noticeAt, locale);
              const title = locale === "bn" ? n.titleBn : n.titleEn;
              const body = locale === "bn" ? n.bodyBn : n.bodyEn;
              const image = n.imageUrls?.[0];
              return (
                <li key={n.id} className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <Link href={`/${locale}/notices/${n.id}`} className="block">
                    {image ? (
                      <div className="aspect-[16/9] overflow-hidden bg-[#f4f5f1]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={image} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                      </div>
                    ) : null}
                    <div className="p-5">
                      {when ? <p className="text-xs font-semibold uppercase tracking-wide text-[#176b45]">{when}</p> : null}
                      <h2 className="mt-3 font-heading text-xl leading-snug text-ink">{title}</h2>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink-muted">{body}</p>
                      <span className="mt-5 inline-flex text-sm font-semibold text-[#176b45]">{locale === "bn" ? "বিস্তারিত পড়ুন →" : "Read more →"}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
