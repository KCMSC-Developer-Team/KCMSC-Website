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
      where: { isPublished: true },
      orderBy: [{ isImportant: "desc" }, { publishedAt: "desc" }]
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
          <ul className="space-y-4">
            {notices.map((n) => {
              const when = formatNoticeDate(n.noticeAt ?? n.publishedAt, locale);
              return (
                <li key={n.id} className="rounded-lg border border-border bg-surface p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-medium text-ink">{locale === "bn" ? n.titleBn : n.titleEn}</h2>
                    {n.isImportant ? (
                      <span className="shrink-0 rounded-full bg-brick/10 px-3 py-1 text-xs font-medium text-brick">
                        {locale === "bn" ? "গুরুত্বপূর্ণ" : "Important"}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{locale === "bn" ? n.bodyBn : n.bodyEn}</p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    {when ? <p className="text-xs text-ink-muted">{when}</p> : <span />}
                    <Link
                      href={`/${locale}/notices/${n.id}`}
                      className="text-sm font-medium text-[#176b45] hover:underline"
                    >
                      {locale === "bn" ? "আরও পড়ুন →" : "Read more →"}
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
