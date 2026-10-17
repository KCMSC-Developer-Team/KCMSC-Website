import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { prisma } from "@/lib/db";

export default async function EventsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const bn = locale === "bn";
  let events: Awaited<ReturnType<typeof prisma.event.findMany>> = [];
  try {
    events = await prisma.event.findMany({
      where: { isPublished: true },
      orderBy: [{ startAt: "asc" }, { isFeatured: "desc" }],
      take: 100,
    });
  } catch {
    events = [];
  }

  const now = new Date();
  const upcoming = events.filter((event) => (event.endAt ?? event.startAt) >= now);
  const past = events.filter((event) => (event.endAt ?? event.startAt) < now).reverse();
  const date = (value: Date) => new Intl.DateTimeFormat(bn ? "bn-BD" : "en-GB", {
    day: "numeric", month: "long", year: "numeric",
  }).format(value);

  const EventCard = ({ event }: { event: (typeof events)[number] }) => {
    let gallery: string[] = [];
    try {
      const parsed: unknown = JSON.parse(event.photoUrls || "[]");
      if (Array.isArray(parsed)) gallery = parsed.filter((url): url is string => typeof url === "string");
    } catch { gallery = []; }
    const title = bn ? event.titleBn : event.titleEn;
    const summary = bn ? event.summaryBn : event.summaryEn;
    const description = bn ? event.descriptionBn : event.descriptionEn;
    const venue = bn ? (event.venueBn || event.venueEn) : (event.venueEn || event.venueBn);
    const image = event.coverImage || gallery[0];
    return (
      <article key={event.id} className="grid overflow-hidden border-y border-[#D5DDD7] bg-[#FFFEFA] md:grid-cols-[minmax(0,.92fr)_minmax(0,1.08fr)]">
        <div className="relative min-h-[240px] bg-[#E4E8E2] md:min-h-[320px]">
          {image ? <Image src={image} alt={title} fill unoptimized sizes="(min-width: 768px) 45vw, 100vw" className="object-cover transition-transform duration-500 hover:scale-[1.02]" /> : <div className="flex h-full min-h-[240px] items-end bg-[#0B5A40] p-7 text-white"><span className="font-heading text-5xl">KCMSC</span></div>}
          {event.isFeatured ? <span className="absolute left-4 top-4 bg-[#E6C77A] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.15em] text-[#12324A]">{bn ? "বিশেষ আয়োজন" : "Featured event"}</span> : null}
        </div>
        <div className="flex flex-col items-start p-6 sm:p-8 lg:p-10">
          <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#0B6A49]">{date(event.startAt)}{event.endAt && event.endAt.toDateString() !== event.startAt.toDateString() ? ` – ${date(event.endAt)}` : ""}</p>
          <h3 className="mt-4 font-heading text-3xl leading-tight tracking-[-.025em] text-[#12324A] sm:text-4xl">{title}</h3>
          {summary ? <p className="mt-4 text-sm font-medium leading-6 text-[#3F5D50]">{summary}</p> : null}
          {description ? <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#64748B]">{description}</p> : null}
          {venue ? <p className="mt-5 border-t border-[#E1E6E0] pt-4 text-xs font-semibold uppercase tracking-[.1em] text-[#0B5A40]">{bn ? "স্থান" : "VENUE"} · {venue}</p> : null}
          {gallery.length > 1 ? <div className="mt-5 grid w-full grid-cols-3 gap-2">{gallery.slice(0, 3).map((url, index) => <div key={`${event.id}-${url}-${index}`} className="relative aspect-[4/3] overflow-hidden bg-[#E4E8E2]"><Image src={url} alt={`${title} ${index + 1}`} fill unoptimized sizes="160px" className="object-cover" /></div>)}</div> : null}
        </div>
      </article>
    );
  };

  return (
    <main className="min-h-screen bg-[#F7F7F1]">
      <section className="bg-[#0B5A40] text-white">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-6 py-16 sm:px-10 sm:py-20 lg:grid-cols-[1fr_.65fr] lg:items-end lg:px-16 lg:py-24">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#E6C77A]">{bn ? "স্কুলের আয়োজন ও উদ্‌যাপন" : "SCHOOL EVENTS & CELEBRATIONS"}</p>
            <h1 className="mt-5 max-w-3xl font-heading text-[clamp(3rem,7vw,6.5rem)] leading-[.92] tracking-[-.045em]">{bn ? "ক্যাম্পাসের স্মরণীয় মুহূর্ত" : "Moments that bring us together."}</h1>
          </div>
          <p className="max-w-xl text-sm leading-7 text-white/75 sm:text-base">{bn ? "আসন্ন অনুষ্ঠান, স্কুলের উদ্‌যাপন এবং আমাদের শিক্ষার্থী ও কমিউনিটির স্মরণীয় মুহূর্তগুলো এখানে দেখুন।" : "Discover upcoming events, school celebrations and memorable moments from across the KCMSC community."}</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-6 py-14 sm:px-10 sm:py-20 lg:px-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[#CBD5CC] pb-5">
          <div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#0B6A49]">01 / {bn ? "ক্যালেন্ডার" : "THE CALENDAR"}</p><h2 className="mt-2 font-heading text-3xl text-[#12324A] sm:text-4xl">{bn ? "আসন্ন অনুষ্ঠান" : "Upcoming events"}</h2></div>
          <p className="text-sm text-[#64748B]">{upcoming.length} {bn ? "টি অনুষ্ঠান" : upcoming.length === 1 ? "event" : "events"}</p>
        </div>
        {upcoming.length ? <div className="space-y-7">{upcoming.map((event) => <EventCard key={event.id} event={event} />)}</div> : <div className="border border-dashed border-[#CBD5CC] px-6 py-12 text-center"><h3 className="font-heading text-2xl text-[#12324A]">{bn ? "এখনো কোনো আসন্ন অনুষ্ঠান নেই" : "Nothing scheduled just yet."}</h3><p className="mt-2 text-sm text-[#64748B]">{bn ? "নতুন অনুষ্ঠানের তথ্য প্রকাশিত হলে এখানে দেখা যাবে।" : "Newly published school events will appear here."}</p></div>}

        {past.length > 0 ? <div className="mt-20"><div className="mb-8 border-b border-[#CBD5CC] pb-5"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#0B6A49]">02 / {bn ? "স্মৃতিচারণ" : "FROM THE ARCHIVE"}</p><h2 className="mt-2 font-heading text-3xl text-[#12324A] sm:text-4xl">{bn ? "আগের অনুষ্ঠান" : "Past events"}</h2></div><div className="space-y-7">{past.map((event) => <EventCard key={event.id} event={event} />)}</div></div> : null}
      </section>
    </main>
  );
}
