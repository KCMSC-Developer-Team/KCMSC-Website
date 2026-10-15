"use client";

import { useEffect, useState } from "react";
import { applyForCareerAction } from "./actions";

type CareerItem = {
  id: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  summaryEn: string | null;
  summaryBn: string | null;
  categoryEn: string | null;
  categoryBn: string | null;
  imageData: string | null;
  deadline: Date | string | null;
  createdAt: Date | string;
};

type Props = {
  careers: CareerItem[] | null;
  locale: "en" | "bn";
  emptyMessage: string;
  applied?: string;
  error?: string;
};

function roleVisual(title: string) {
  const value = title.toLowerCase();
  if (/developer|software|ict|it |technology|web/.test(value)) {
    return {
      category: "Technology",
      image: "/kcmsc/facilities/ict_olympiad_at_kc.jpg",
      number: "01",
    };
  }
  if (/chem|lab|science|physics|biology/.test(value)) {
    return {
      category: "Science & Laboratory",
      image: "/kcmsc/facilities/teacher_taking_class.jpg",
      number: "02",
    };
  }
  if (/teacher|faculty|academic|instructor/.test(value)) {
    return {
      category: "Teaching & Learning",
      image: "/kcmsc/facilities/students_at_library.jpg",
      number: "03",
    };
  }
  if (/admin|office|account|finance|hr|human resource/.test(value)) {
    return {
      category: "Administration",
      image: "/kcmsc/about/leadership-gathering.jpg",
      number: "04",
    };
  }
  return {
    category: "School Operations",
    image: "/kcmsc/hero/kcmsc-building.jpg",
    number: "05",
  };
}

function getDeadline(deadline: Date | string | null, locale: "en" | "bn") {
  if (!deadline) return locale === "bn" ? "পরবর্তী ঘোষণা পর্যন্ত" : "Until further notice";
  return new Date(deadline).toLocaleDateString(locale === "bn" ? "bn-BD" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function hasDeadlinePassed(deadline: Date | string | null) {
  if (!deadline) return false;
  const end = new Date(deadline);
  end.setUTCHours(23, 59, 59, 999);
  return new Date() > end;
}

export default function CareerExplorer({ careers, locale, emptyMessage, applied, error }: Props) {
  const isBn = locale === "bn";
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = careers?.find((career) => career.id === selectedId) ?? null;
  const selectedTitle = selected ? (isBn ? selected.titleBn : selected.titleEn) : "";

  useEffect(() => {
    if (!selected) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selected]);

  return (
    <>
      <main className="kc-page-shell min-h-screen">
        <section className="kc-careers-hero relative isolate overflow-hidden">
          <div className="kc-careers-hero-image" aria-hidden="true" />
          <div className="kc-careers-hero-shade" aria-hidden="true" />
          <div className="relative mx-auto grid min-h-[570px] max-w-[1440px] items-end gap-12 px-6 pb-12 pt-20 sm:px-10 sm:pb-16 lg:min-h-[640px] lg:grid-cols-[1fr_310px] lg:px-16 lg:pb-20">
            <div className="max-w-3xl text-white">
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-9 bg-[#d8c58a]" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/80">
                  {isBn ? "কেসিএমএসসি · ক্যারিয়ার" : "K C MODEL SCHOOL & COLLEGE · CAREERS"}
                </span>
              </div>
              <h1 className="max-w-3xl font-heading text-5xl leading-[0.96] tracking-[-0.05em] sm:text-7xl lg:text-[6.6rem]">
                {isBn ? "আপনার কাজের অর্থ থাকুক" : "Make your work"}<br />
                <span className="text-[#e0d09b]">{isBn ? "একটি পরিবর্তন।" : "mean something."}</span>
              </h1>
              <p className="mt-7 max-w-xl text-sm leading-7 text-white/80 sm:text-base sm:leading-8">
                {isBn
                  ? "শিক্ষার্থীদের সম্ভাবনা, কৌতূহল ও ভবিষ্যৎ গড়ে তুলতে আমাদের সঙ্গে যুক্ত হোন।"
                  : "Join a community shaping curious minds, opening doors and building the next generation. Bring your perspective. Help us move education forward."}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a href="#opportunities" className="inline-flex min-h-12 items-center gap-5 rounded-full bg-[#f8f6ef] px-6 text-xs font-semibold text-[#124c36] transition hover:bg-[#e0d09b]">
                  {isBn ? "সুযোগগুলো দেখুন" : "Explore opportunities"}<span aria-hidden="true">↘</span>
                </a>
                <span className="text-xs text-white/65">
                  {isBn ? "আপনার পরবর্তী অধ্যায় এখানেই শুরু হতে পারে" : "Your next chapter could start here"}
                </span>
              </div>
            </div>

            <aside className="kc-careers-hero-note">
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#e0d09b]">
                {isBn ? "একসঙ্গে এগিয়ে চলি" : "GROW WITH US"}
              </p>
              <p className="mt-5 font-heading text-5xl leading-none">{String(careers?.length ?? 0).padStart(2, "0")}</p>
              <p className="mt-2 text-xs text-white/70">{isBn ? "প্রকাশিত পদ" : "open opportunities"}</p>
              <div className="my-6 h-px bg-white/20" />
              <p className="font-heading text-2xl leading-snug">{isBn ? "শিক্ষার ভবিষ্যৎ মানুষই গড়ে।" : "Education moves forward because people do."}</p>
              <p className="mt-3 text-xs leading-6 text-white/65">
                {isBn ? "শিক্ষা, প্রযুক্তি ও সহায়ক কাজে অবদান রাখুন।" : "Bring your ideas to teaching, technology and the work that keeps a school thriving."}
              </p>
            </aside>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-white/25" />
        </section>

        <section id="opportunities" className="mx-auto max-w-[1440px] scroll-mt-8 px-6 py-14 sm:px-10 sm:py-20 lg:px-16">
          <div className="mb-8 flex flex-col gap-5 border-b border-[#d9d8cf] pb-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="kc-section-label">{isBn ? "আপনার পরবর্তী অধ্যায়" : "FIND YOUR PLACE"}</p>
              <h2 className="mt-3 font-heading text-3xl tracking-[-0.035em] text-[#124c36] sm:text-5xl">
                {isBn ? "বর্তমান সুযোগ" : "Open positions"}<span className="text-[#b59a4a]">.</span>
              </h2>
            </div>
            <div className="flex max-w-lg items-center justify-between gap-6 sm:justify-end">
              <p className="max-w-xs text-xs leading-6 text-[#69716b] sm:text-sm">
                {isBn ? "পদ সম্পর্কে বিস্তারিত দেখতে নির্বাচন করুন।" : "Explore the role first. Open its details to learn more and submit your application."}
              </p>
              <span className="shrink-0 rounded-full border border-[#d9d8cf] px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-[#526258]">
                {String(careers?.length ?? 0).padStart(2, "0")} {isBn ? "টি পদ" : "roles"}
              </span>
            </div>
          </div>

          {applied === "1" ? <div role="status" className="mb-7 rounded-xl border border-[#b9d9c7] bg-[#edf8f1] px-5 py-4 text-sm text-[#176b45]">{isBn ? "আপনার চাকরির আবেদন সফলভাবে জমা হয়েছে।" : "Your application has been submitted successfully. Thank you for your interest."}</div> : null}
          {error === "closed" ? <div role="alert" className="mb-7 rounded-xl border border-[#ead6c8] bg-[#fff6ef] px-5 py-4 text-sm text-[#9b4d28]">{isBn ? "এই পদটির আবেদন বর্তমানে বন্ধ রয়েছে।" : "Applications for this position are currently closed."}</div> : null}
          {error === "invalid" ? <div role="alert" className="mb-7 rounded-xl border border-[#ead6c8] bg-[#fff6ef] px-5 py-4 text-sm text-[#9b4d28]">{isBn ? "অনুগ্রহ করে ফর্মের তথ্যগুলো সঠিকভাবে পূরণ করুন।" : "Please check the application form and try again."}</div> : null}

          {!careers || careers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#d9d8cf] bg-white/50 px-6 py-16 text-center sm:px-12">
              <p className="kc-section-label">{isBn ? "নতুন সুযোগের অপেক্ষায়" : "NOTHING OPEN JUST YET"}</p>
              <h3 className="mt-4 font-heading text-3xl text-[#124c36]">{isBn ? "এই মুহূর্তে কোনো পদ খোলা নেই" : "The next opportunity is still ahead."}</h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#69716b]">{emptyMessage}</p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {careers.map((career, index) => {
                const title = isBn ? career.titleBn : career.titleEn;
                const fullDescription = isBn ? career.descriptionBn : career.descriptionEn;
                const description = (isBn ? career.summaryBn : career.summaryEn) || fullDescription.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
                const visual = roleVisual(career.titleEn);
                const cardImage = career.imageData || visual.image;
                const cardCategory = (isBn ? career.categoryBn : career.categoryEn) || visual.category;
                const closed = hasDeadlinePassed(career.deadline);
                return (
                  <article key={career.id} className="kc-job-card group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#d9d8cf] bg-[#fffdf8] transition duration-300 hover:-translate-y-1 hover:border-[#b7c6b8] hover:shadow-[0_22px_55px_rgba(18,76,54,0.10)]">
                    <button type="button" onClick={() => setSelectedId(career.id)} aria-label={`${isBn ? "বিস্তারিত দেখুন" : "View details for"} ${title}`} className="kc-job-thumb relative block h-48 w-full overflow-hidden text-left sm:h-52">
                      <img src={cardImage} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
                      <span className="absolute inset-0 bg-gradient-to-t from-[#0b3024]/80 via-[#0b3024]/10 to-[#0b3024]/5" />
                      <span className="absolute left-5 top-5 rounded-full border border-white/40 bg-black/15 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm">{cardCategory}</span>
                      <span className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/50 text-xs text-white backdrop-blur-sm">{String(index + 1).padStart(2, "0")}</span>
                      <span className="absolute bottom-5 left-5 right-5 font-heading text-2xl leading-tight text-white sm:text-3xl">{title}</span>
                    </button>
                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.13em]">
                        <span className={`h-1.5 w-1.5 rounded-full ${closed ? "bg-[#a36b50]" : "bg-[#278653]"}`} />
                        <span className={closed ? "text-[#a36b50]" : "text-[#26744b]"}>{closed ? (isBn ? "আবেদন বন্ধ" : "Applications closed") : (isBn ? "আবেদন চলছে" : "Accepting applications")}</span>
                      </div>
                      <p className="mt-3 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-[#69716b]">{description}</p>
                      <div className="mt-5 flex items-end justify-between gap-3 border-t border-[#e7e5dc] pt-4">
                        <div>
                          <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#858a80]">{isBn ? "শেষ তারিখ" : "DEADLINE"}</p>
                          <p className="mt-1 text-xs font-medium text-[#37483c]">{getDeadline(career.deadline, locale)}</p>
                        </div>
                        <button type="button" onClick={() => setSelectedId(career.id)} className="inline-flex min-h-10 shrink-0 items-center gap-3 rounded-full bg-[#176b45] px-4 text-xs font-semibold text-white transition hover:bg-[#124c36] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176b45]">
                          {isBn ? "বিস্তারিত" : "View role"}<span aria-hidden="true">↗</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="border-t border-[#d9d8cf] bg-[#eeede5]">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-6 py-9 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16">
            <div><p className="kc-section-label">K C MODEL SCHOOL & COLLEGE</p><p className="mt-2 font-heading text-2xl text-[#124c36]">{isBn ? "ভবিষ্যৎ গড়ার কাজে যুক্ত হোন।" : "Bring your talent. Build what matters."}</p></div>
            <a href="#opportunities" className="kc-classic-link w-fit">{isBn ? "সব পদ দেখুন" : "Explore all positions"}<span aria-hidden="true">↗</span></a>
          </div>
        </section>
      </main>

      {selected ? (
        <div className="kc-career-modal-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedId(null); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="kc-career-modal-title" className="kc-career-modal">
            <div className="kc-career-modal-cover">
              <img src={selected.imageData || roleVisual(selected.titleEn).image} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#092e22]/90 via-[#092e22]/25 to-[#092e22]/10" />
              <button type="button" onClick={() => setSelectedId(null)} aria-label={isBn ? "বন্ধ করুন" : "Close details"} className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-black/20 text-xl text-white backdrop-blur-sm transition hover:bg-white hover:text-[#124c36]">×</button>
              <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e0d09b]">{(isBn ? selected.categoryBn : selected.categoryEn) || roleVisual(selected.titleEn).category}</p>
                <h2 id="kc-career-modal-title" className="mt-3 max-w-3xl font-heading text-3xl leading-tight text-white sm:text-5xl">{selectedTitle}</h2>
                <p className="mt-3 text-xs text-white/75">{isBn ? "আবেদনের শেষ তারিখ" : "Application deadline"}: {getDeadline(selected.deadline, locale)}</p>
              </div>
            </div>
            <div className="kc-career-modal-body">
              <div className="border-b border-[#e4e2d8] pb-6">
                <p className="kc-section-label">{isBn ? "পদের বিবরণ" : "ABOUT THE ROLE"}</p>
                <div className="kc-career-rich-content mt-3 text-sm leading-7 text-[#5f6c62]" dangerouslySetInnerHTML={{ __html: (isBn ? selected.descriptionBn : selected.descriptionEn) }} />
              </div>
              {hasDeadlinePassed(selected.deadline) ? (
                <div className="mt-6 rounded-xl border border-[#ead6c8] bg-[#fff6ef] p-5 text-sm leading-6 text-[#9b4d28]">{isBn ? "এই পদের আবেদনের সময়সীমা শেষ হয়েছে।" : "Applications for this position have closed. Please explore other open roles."}</div>
              ) : (
                <form action={applyForCareerAction} className="mt-7">
                  <input type="hidden" name="careerId" value={selected.id} />
                  <input type="hidden" name="locale" value={locale} />
                  <p className="kc-section-label">{isBn ? "আবেদন করুন" : "YOUR APPLICATION"}</p>
                  <h3 className="mt-2 font-heading text-2xl text-[#124c36]">{isBn ? "আপনার তথ্য জমা দিন" : "Take the next step."}</h3>
                  <p className="mt-2 text-xs leading-6 text-[#7a817a]">{isBn ? "* চিহ্নিত ক্ষেত্রগুলো আবশ্যক।" : "Fields marked * are required."}</p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div><label htmlFor={`fullName-${selected.id}`} className="kc-form-label">{isBn ? "পূর্ণ নাম" : "Full name"} *</label><input id={`fullName-${selected.id}`} name="fullName" autoComplete="name" required className="kc-form-input" /></div>
                    <div><label htmlFor={`email-${selected.id}`} className="kc-form-label">Email *</label><input id={`email-${selected.id}`} name="email" type="email" autoComplete="email" required className="kc-form-input" /></div>
                    <div><label htmlFor={`phone-${selected.id}`} className="kc-form-label">{isBn ? "মোবাইল নম্বর" : "Phone number"} *</label><input id={`phone-${selected.id}`} name="phone" type="tel" autoComplete="tel" required className="kc-form-input" /></div>
                    <div><label htmlFor={`qualification-${selected.id}`} className="kc-form-label">{isBn ? "শিক্ষাগত যোগ্যতা" : "Qualification"}</label><input id={`qualification-${selected.id}`} name="qualification" className="kc-form-input" /></div>
                    <div className="sm:col-span-2"><label htmlFor={`experience-${selected.id}`} className="kc-form-label">{isBn ? "অভিজ্ঞতা" : "Experience"}</label><textarea id={`experience-${selected.id}`} name="experience" rows={3} className="kc-form-input resize-y" /></div>
                    <div className="sm:col-span-2"><label htmlFor={`coverLetter-${selected.id}`} className="kc-form-label">{isBn ? "কভার লেটার / অতিরিক্ত তথ্য" : "Cover letter / additional information"}</label><textarea id={`coverLetter-${selected.id}`} name="coverLetter" rows={4} maxLength={5000} className="kc-form-input resize-y" /><p className="mt-1 text-right text-[10px] text-[#858a80]">{isBn ? "সর্বোচ্চ ৫,০০০ অক্ষর" : "Maximum 5,000 characters"}</p></div>
                  </div>
                  <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#e4e2d8] pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <button type="button" onClick={() => setSelectedId(null)} className="kc-classic-button kc-classic-button-outline">{isBn ? "ফিরে যান" : "Back to positions"}</button>
                    <button type="submit" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#176b45] px-6 text-xs font-semibold text-white transition hover:bg-[#124c36]">{isBn ? "আবেদন জমা দিন" : "Submit application"}<span aria-hidden="true">↗</span></button>
                  </div>
                </form>
              )}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
