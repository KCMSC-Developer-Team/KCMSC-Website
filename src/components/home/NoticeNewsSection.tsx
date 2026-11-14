import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { formatNoticeDate } from "@/lib/notice-format";

type NewsItem = {
  id: string;
  titleEn: string;
  titleBn: string;
  bodyEn: string;
  bodyBn: string;
  imageUrls: string[];
  noticeAt: Date | null;
  publishedAt: Date | null;
};

export function NoticeNewsSection({ locale, notices }: { locale: Locale; notices: NewsItem[] }) {
  const isBn = locale === "bn";
  return (
    <section className="relative overflow-hidden bg-[#f5f6f1] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[.22em] text-[#1f8a5b]">
              {isBn ? "নোটিশ ও সর্বশেষ সংবাদ" : "NOTICES & LATEST NEWS"}
            </p>
            <h2 className="mt-3 font-heading text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] tracking-[-.035em] text-[#173b2d]">
              {isBn ? "ক্যাম্পাসের সর্বশেষ খবর" : "The latest from our campus."}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#69716b]">
              {isBn ? "গুরুত্বপূর্ণ নোটিশ, ঘোষণা ও প্রতিষ্ঠানের সাম্প্রতিক খবর এক জায়গায়।" : "Important notices, announcements and recent updates from K C Model School & College."}
            </p>
          </div>
          <Link href={`/${locale}/notices`} className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#176b45] transition hover:gap-3">
            {isBn ? "সব নোটিশ ও সংবাদ" : "View all notices & news"}<span aria-hidden="true">↗</span>
          </Link>
        </div>

        {notices.length ? (
          <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {notices.map((notice) => {
              const title = isBn ? notice.titleBn : notice.titleEn;
              const body = isBn ? notice.bodyBn : notice.bodyEn;
              const date = formatNoticeDate(notice.noticeAt, locale);
              const image = notice.imageUrls[0];
              if (!image) return null;
              return (
                <article key={notice.id} className="group overflow-hidden rounded-2xl border border-[#e1e4dc] bg-white shadow-[0_12px_35px_rgba(20,50,35,.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(20,50,35,.12)]">
                  <Link href={`/${locale}/notices/${notice.id}`} className="block">
                    <div className="relative aspect-[16/9] overflow-hidden bg-[#e8ece5]">
                      <Image src={image} alt={title} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" />
                    </div>
                    <div className="p-5 sm:p-6">
                      {date ? <p className="text-[11px] font-semibold uppercase tracking-[.12em] text-[#1f8a5b]">{date}</p> : null}
                      <h3 className="mt-3 line-clamp-2 font-heading text-xl leading-snug text-[#173b2d] group-hover:text-[#176b45]">{title}</h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#69716b]">{body}</p>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#176b45]">{isBn ? "বিস্তারিত পড়ুন" : "Read the update"}<span aria-hidden="true">↗</span></span>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-9 rounded-2xl border border-dashed border-[#d9dfd5] bg-white/70 px-6 py-12 text-center text-sm text-[#69716b]">
            {isBn ? "নতুন নোটিশ ও সংবাদ শিগগিরই প্রকাশিত হবে।" : "New notices and updates will appear here soon."}
          </div>
        )}
      </div>
    </section>
  );
}
