import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { prisma } from "@/lib/db";
import AlumniExperienceDialog from "./AlumniExperienceDialog";

export default async function AlumniPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const bn = locale === "bn";
  const messages = await prisma.alumniMessage.findMany({ where: { isPublished: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
  const copy = bn
    ? { kicker: "প্রাক্তন শিক্ষার্থী", title: "যাঁরা কেসিএমএসসি থেকে শুরু করেছিলেন, তাঁদের কিছু কথা।", intro: "বিদ্যালয়ের সঙ্গে সম্পর্ক শুধু একটি নির্দিষ্ট সময়ের মধ্যে সীমাবদ্ধ নয়। প্রাক্তন শিক্ষার্থীদের স্মৃতি, অভিজ্ঞতা ও শুভকামনাও এই প্রতিষ্ঠানের পথচলার অংশ।", empty: "প্রাক্তন শিক্ষার্থীদের বার্তা শিগগিরই এখানে প্রকাশ করা হবে।", back: "হোমে ফিরুন", readMore: "সম্পূর্ণ অভিজ্ঞতা পড়ুন" }
    : { kicker: "Alumni", title: "A few words from those who started here.", intro: "A school relationship does not end with the last day of class. Alumni memories, experiences and good wishes remain part of the institution's story.", empty: "Alumni messages will be published here soon.", back: "Back home", readMore: "Read full experience" };

  return (
    <main className="bg-[#f7f5ef] text-[#242824]">
      <section className="kc-feature-hero relative isolate flex min-h-[390px] items-center overflow-hidden border-b border-[#d9d8cf] bg-[#124c36] sm:min-h-[430px] lg:min-h-[490px]">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{ backgroundImage: "url('/kcmsc/media/farewell.jpeg')" }}
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-[#092c21]/85 via-[#0b3326]/65 to-[#102b23]/35" />
        <div className="mx-auto w-full max-w-[1180px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <span className="kc-classic-kicker !text-[#e1c777]">{copy.kicker}</span>
          <h1 className="mt-5 max-w-4xl font-heading text-[clamp(2.8rem,6vw,6rem)] leading-[.9] tracking-[-.05em] text-white">{copy.title}</h1>
          <p className="mt-8 max-w-2xl text-[15px] leading-7 text-white/90 sm:text-base">{copy.intro}</p>
        </div>
      </section>

      <section className="kc-classic-section bg-[#f7f5ef]">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-10">
          {messages.length === 0 ? (
            <div className="border-y border-[#d9d8cf] py-20 text-center text-sm text-[#69716b]">{copy.empty}</div>
          ) : (
            <div className="divide-y divide-[#d9d8cf] border-y border-[#d9d8cf]">
              {messages.map((message) => {
                const name = bn ? message.nameBn : message.nameEn;
                const text = bn ? message.previewBn || message.messageBn : message.previewEn || message.messageEn;
                const fullText = bn ? message.messageBn : message.messageEn;
                const position = bn ? message.roleBn || message.roleEn : message.roleEn || message.roleBn;
                const batches = [
                  message.sscBatch ? `SSC ${message.sscBatch}` : null,
                  message.hscBatch ? `HSC ${message.hscBatch}` : null,
                ].filter(Boolean).join(" · ");

                return (
                  <article key={message.id} className="grid gap-8 py-10 lg:grid-cols-[260px_1fr] lg:gap-12 lg:py-14">
                    <div className="flex items-start gap-4 lg:block">
                      <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-[#176b45] font-heading text-xl text-white">
                        {message.photoUrl ? <img src={message.photoUrl} alt={name} className="h-full w-full object-cover" /> : name.trim().charAt(0)}
                      </div>
                      <div className="lg:mt-5">
                        <p className="font-heading text-xl text-[#124c36]">{name}</p>
                        {batches ? <p className="mt-2 text-[9px] uppercase tracking-[.16em] text-[#b59a4a]">{batches}</p> : null}
                        {position ? <p className="mt-2 text-xs leading-5 text-[#69716b]">{position}</p> : null}
                      </div>
                    </div>

                    <div>
                      <span className="font-heading text-5xl leading-none text-[#b59a4a]">“</span>
                      <p className="-mt-2 max-w-3xl whitespace-pre-line font-heading text-[clamp(1.7rem,3vw,2.65rem)] leading-[1.16] tracking-[-.025em] text-[#124c36]">{text}</p>
                      <AlumniExperienceDialog name={name} message={fullText} label={copy.readMore} locale={locale} />
                    </div>
                  </article>
                );
              })}
            </div>
          )}
          <div className="mt-8"><Link href={`/${locale}`} className="kc-classic-link">{copy.back}<span>↗</span></Link></div>
        </div>
      </section>
    </main>
  );
}
