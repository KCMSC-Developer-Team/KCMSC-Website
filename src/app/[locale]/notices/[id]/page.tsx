import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { PageHeader } from "@/components/ui/PageHeader";
import { prisma } from "@/lib/db";
import { formatNoticeDate } from "@/lib/notice-format";

export const dynamic = "force-dynamic";

export default async function NoticeDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: rawLocale, id } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;

  const notice = await prisma.notice
    .findFirst({ where: { id, isPublished: true } })
    .catch(() => null);
  if (!notice) notFound();

  const isBn = locale === "bn";
  const title = isBn ? notice.titleBn : notice.titleEn;
  const body = isBn ? notice.bodyBn : notice.bodyEn;
  const when = formatNoticeDate(notice.noticeAt ?? notice.publishedAt, locale);
  const images = notice.imageUrls ?? [];

  return (
    <>
      <PageHeader heading={title} />
      <article className="mx-auto max-w-content px-6 py-16">
        <Link href={`/${locale}/notices`} className="text-sm font-medium text-[#176b45] hover:underline">
          {isBn ? "← নোটিশ তালিকায় ফিরুন" : "← Back to notices"}
        </Link>

        {when ? <p className="mt-6 text-sm font-medium text-[#176b45]">{when}</p> : null}

        {images.length > 0 ? (
          <div className="mt-6 space-y-4">
            {images.map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={url}
                src={url}
                alt={`${title} ${i + 1}`}
                className="w-full rounded-lg border border-border bg-[#f4f5f1] object-contain"
              />
            ))}
          </div>
        ) : null}

        <h2 className="mt-8 font-heading text-2xl text-ink">{title}</h2>
        <p className="mt-4 whitespace-pre-line text-base leading-8 text-ink-muted">{body}</p>
      </article>
    </>
  );
}
