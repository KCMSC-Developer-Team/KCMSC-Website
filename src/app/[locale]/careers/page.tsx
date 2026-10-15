import { getDictionary, isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { applyForCareerAction } from "./actions";

async function getPublishedCareers() {
  try {
    return await prisma.career.findMany({
      where: {
        isPublished: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch {
    return null;
  }
}

export default async function CareersPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: {
    applied?: string;
    error?: string;
  };
}) {
  if (!isLocale(params.locale)) {
    notFound();
  }

  const locale: Locale = params.locale;
  const dict = getDictionary(locale);
  const page = dict.careersPage;
  const careers = await getPublishedCareers();
  const isBangla = locale === "bn";
  const careerCount = careers?.length ?? 0;

  return (
    <main className="kc-page-shell min-h-screen">
      {/* Editorial page introduction */}
      <section className="relative overflow-hidden border-b border-[#dfded5]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-28 h-[26rem] w-[26rem] rounded-full border border-[#d9d6c8] sm:-right-10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-5 top-8 h-[19rem] w-[19rem] rounded-full border border-[#e7e4d9]"
        />
        <div className="relative mx-auto grid max-w-[1320px] gap-10 px-6 py-16 sm:px-10 sm:py-20 lg:grid-cols-[1fr_360px] lg:items-end lg:gap-16 lg:px-14 lg:py-24">
          <div className="max-w-3xl">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-9 bg-[#c5b579]" />
              <span className="kc-section-label">
                {isBangla ? "কেসিএমএসসি · ক্যারিয়ার" : "KCMSC · CAREERS"}
              </span>
            </div>
            <h1 className="max-w-3xl font-heading text-5xl leading-[0.98] tracking-[-0.045em] text-[#124c36] sm:text-6xl lg:text-[5.4rem]">
              {page.heading}
              <span className="text-[#b4a36b]">.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-[#68736b] sm:text-lg">
              {isBangla
                ? "শিক্ষা, কৌতূহল ও শিক্ষার্থীদের সম্ভাবনা গড়ে তোলার কাজে আমাদের সঙ্গে যুক্ত হোন। আপনার দক্ষতা ও অভিজ্ঞতা দিয়ে একটি অর্থবহ পরিবর্তন আনুন।"
                : "Help shape a thoughtful, ambitious learning community. Bring your skills, experience and ideas to a school where every role can make a lasting difference."}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#open-positions"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#176b45] px-6 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-[#124c36] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176b45]"
              >
                {isBangla ? "খোলা পদগুলো দেখুন" : "Explore open positions"}
                <span aria-hidden="true" className="ml-3 text-base">↘</span>
              </a>
              <span className="text-xs tracking-wide text-[#7a817a]">
                {isBangla
                  ? "প্রতিটি পদে আলাদাভাবে আবেদন করুন"
                  : "Applications are submitted for each role"}
              </span>
            </div>
          </div>

          <aside className="relative overflow-hidden rounded-2xl bg-[#075d3e] p-7 text-[#fffdf8] sm:p-9 lg:mb-1">
            <div
              aria-hidden="true"
              className="absolute -right-12 -top-14 h-48 w-48 rounded-full border border-white/15"
            />
            <div
              aria-hidden="true"
              className="absolute -right-2 -top-6 h-28 w-28 rounded-full border border-white/15"
            />
            <div className="relative">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e1d3a0]">
                {isBangla ? "আমাদের সঙ্গে কাজ করুন" : "MAKE AN IMPACT"}
              </p>
              <p className="mt-7 font-heading text-5xl leading-none tracking-tight">
                {String(careerCount).padStart(2, "0")}
              </p>
              <p className="mt-3 text-sm text-white/75">
                {isBangla ? "বর্তমানে প্রকাশিত পদ" : "published opportunities"}
              </p>
              <div className="my-7 h-px bg-white/20" />
              <p className="max-w-xs font-heading text-2xl leading-snug">
                {isBangla
                  ? "একটি ভালো স্কুল তৈরি হয় ভালো মানুষদের দিয়ে।"
                  : "Great schools are built by people who care."}
              </p>
              <p className="mt-4 text-xs leading-6 text-white/65">
                {isBangla
                  ? "শিক্ষকতা, প্রযুক্তি ও সহায়ক ভূমিকায় আমাদের সুযোগগুলো দেখুন।"
                  : "Explore opportunities to contribute across teaching, technology and school support."}
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section
        id="open-positions"
        className="mx-auto max-w-[1320px] px-6 py-14 sm:px-10 sm:py-20 lg:px-14"
      >
        <div className="mb-10 flex flex-col justify-between gap-4 border-b border-[#dfded5] pb-7 sm:flex-row sm:items-end">
          <div>
            <p className="kc-section-label">
              {isBangla ? "আপনার পরবর্তী অধ্যায়" : "YOUR NEXT CHAPTER"}
            </p>
            <h2 className="mt-3 font-heading text-3xl tracking-tight text-[#124c36] sm:text-4xl">
              {isBangla ? "বর্তমান সুযোগ" : "Current opportunities"}
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#727970]">
            {isBangla
              ? "যে পদটি আপনার দক্ষতার সঙ্গে মানানসই, সেটি বেছে নিয়ে আবেদনপত্র পূরণ করুন।"
              : "Find a role that fits your strengths, then complete the application form for that position."}
          </p>
        </div>

        {searchParams?.applied === "1" ? (
          <div
            role="status"
            className="mb-8 flex gap-3 rounded-xl border border-[#b9d9c7] bg-[#edf8f1] px-5 py-4 text-sm leading-6 text-[#176b45]"
          >
            <span aria-hidden="true" className="text-lg">✓</span>
            <span>
              {isBangla
                ? "আপনার চাকরির আবেদন সফলভাবে জমা হয়েছে।"
                : "Your career application has been submitted successfully."}
            </span>
          </div>
        ) : null}

        {searchParams?.error === "closed" ? (
          <div
            role="alert"
            className="mb-8 rounded-xl border border-[#ead6c8] bg-[#fff6ef] px-5 py-4 text-sm leading-6 text-[#9b4d28]"
          >
            {isBangla
              ? "এই পদটির আবেদন বর্তমানে বন্ধ রয়েছে।"
              : "Applications for this position are currently closed."}
          </div>
        ) : null}

        {searchParams?.error === "invalid" ? (
          <div
            role="alert"
            className="mb-8 rounded-xl border border-[#ead6c8] bg-[#fff6ef] px-5 py-4 text-sm leading-6 text-[#9b4d28]"
          >
            {isBangla
              ? "অনুগ্রহ করে ফর্মের তথ্যগুলো সঠিকভাবে পূরণ করুন।"
              : "Please check the application form and try again."}
          </div>
        ) : null}

        {!careers || careers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#d8d8ce] bg-[#efeee7]/60 px-6 py-16 text-center sm:px-12">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#d8d8ce] text-xl text-[#176b45]">
              ✳
            </span>
            <h3 className="mt-5 font-heading text-2xl text-[#124c36]">
              {isBangla ? "এই মুহূর্তে কোনো পদ খোলা নেই" : "No open positions right now"}
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#727970]">
              {page.empty}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {careers.map((career, index) => {
              const deadlinePassed =
                career.deadline &&
                new Date() >
                  new Date(
                    new Date(career.deadline).setUTCHours(23, 59, 59, 999),
                  );

              return (
                <article
                  key={career.id}
                  className="group overflow-hidden rounded-2xl border border-[#dfded5] bg-[#fffdf8] transition duration-300 hover:border-[#c7c8b9] hover:shadow-[0_18px_55px_rgba(24,54,38,0.07)]"
                >
                  <div className="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
                    <div className="relative flex flex-col overflow-hidden bg-[#efeee7] p-6 sm:p-9 lg:p-10">
                      <div
                        aria-hidden="true"
                        className="absolute -right-16 -top-16 h-56 w-56 rounded-full border border-[#d8d6ca]"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute -right-7 -top-7 h-36 w-36 rounded-full border border-[#d8d6ca]"
                      />
                      <div className="relative flex items-center justify-between gap-3">
                        <span className="rounded-full border border-[#d2d0c3] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#59675c]">
                          {isBangla ? "পদ" : "POSITION"} {String(index + 1).padStart(2, "0")}
                        </span>
                        {deadlinePassed ? (
                          <span className="rounded-full bg-[#e4ded4] px-3 py-1.5 text-[10px] font-medium text-[#785c49]">
                            {isBangla ? "আবেদন বন্ধ" : "Closed"}
                          </span>
                        ) : (
                          <span className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[#176b45]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#176b45]" />
                            {isBangla ? "আবেদন চলছে" : "Accepting applications"}
                          </span>
                        )}
                      </div>

                      <div className="relative mt-12 sm:mt-16">
                        <h3 className="max-w-lg font-heading text-3xl leading-tight tracking-[-0.025em] text-[#124c36] sm:text-4xl">
                          {isBangla ? career.titleBn : career.titleEn}
                        </h3>
                        <p className="mt-5 whitespace-pre-line text-sm leading-7 text-[#626e65]">
                          {isBangla
                            ? career.descriptionBn
                            : career.descriptionEn}
                        </p>
                      </div>

                      <div className="relative mt-9 border-t border-[#d8d6ca] pt-5">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#727970]">
                          {career.deadline
                            ? isBangla
                              ? "আবেদনের শেষ তারিখ"
                              : "APPLICATION DEADLINE"
                            : isBangla
                              ? "আবেদনের সময়সীমা"
                              : "APPLICATION WINDOW"}
                        </p>
                        <p className="mt-2 text-sm font-medium text-[#243d30]">
                          {career.deadline
                            ? new Date(career.deadline).toLocaleDateString(
                                isBangla ? "bn-BD" : "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )
                            : isBangla
                              ? "আবেদন খোলা রয়েছে"
                              : "Open until further notice"}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 sm:p-9 lg:p-10">
                      {deadlinePassed ? (
                        <div className="flex h-full min-h-48 flex-col justify-center rounded-xl border border-[#dfded5] bg-[#f5f3ed] p-6">
                          <span className="text-2xl text-[#8a8d83]" aria-hidden="true">↗</span>
                          <h4 className="mt-4 font-heading text-2xl text-[#124c36]">
                            {isBangla ? "আবেদন গ্রহণ শেষ" : "Applications are closed"}
                          </h4>
                          <p className="mt-2 max-w-sm text-sm leading-7 text-[#727970]">
                            {isBangla
                              ? "এই পদের আবেদনের সময়সীমা শেষ হয়েছে। নতুন সুযোগের জন্য পরে আবার দেখুন।"
                              : "The deadline for this role has passed. Please check back for future opportunities."}
                          </p>
                        </div>
                      ) : (
                        <form
                          action={applyForCareerAction}
                          className="space-y-6"
                        >
                          <input
                            type="hidden"
                            name="careerId"
                            value={career.id}
                          />
                          <input type="hidden" name="locale" value={locale} />

                          <div className="border-b border-[#e3e1d8] pb-5">
                            <p className="kc-section-label">
                              {isBangla ? "আবেদনপত্র" : "APPLICATION FORM"}
                            </p>
                            <h4 className="mt-2 font-heading text-2xl text-[#124c36]">
                              {isBangla ? "এই পদে আবেদন করুন" : "Apply for this role"}
                            </h4>
                            <p className="mt-2 text-xs leading-6 text-[#727970]">
                              {isBangla
                                ? "নিচের তথ্যগুলো পূরণ করুন। * চিহ্নিত ক্ষেত্রগুলো আবশ্যক।"
                                : "Share a few details to get your application started. Fields marked * are required."}
                            </p>
                          </div>

                          <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
                            <div>
                              <label
                                htmlFor={`fullName-${career.id}`}
                                className="block text-xs font-medium text-[#35463a]"
                              >
                                {isBangla ? "পূর্ণ নাম" : "Full name"} <span className="text-[#176b45]">*</span>
                              </label>
                              <input
                                id={`fullName-${career.id}`}
                                name="fullName"
                                autoComplete="name"
                                required
                                className="mt-2 min-h-12 w-full rounded-lg border border-[#dcdcd2] bg-white px-3.5 py-3 text-sm text-[#243d30] outline-none transition placeholder:text-[#a2a59c] focus:border-[#176b45] focus:ring-2 focus:ring-[#176b45]/10"
                              />
                            </div>

                            <div>
                              <label
                                htmlFor={`email-${career.id}`}
                                className="block text-xs font-medium text-[#35463a]"
                              >
                                {isBangla ? "ইমেইল" : "Email"} <span className="text-[#176b45]">*</span>
                              </label>
                              <input
                                id={`email-${career.id}`}
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="mt-2 min-h-12 w-full rounded-lg border border-[#dcdcd2] bg-white px-3.5 py-3 text-sm text-[#243d30] outline-none transition placeholder:text-[#a2a59c] focus:border-[#176b45] focus:ring-2 focus:ring-[#176b45]/10"
                              />
                            </div>

                            <div>
                              <label
                                htmlFor={`phone-${career.id}`}
                                className="block text-xs font-medium text-[#35463a]"
                              >
                                {isBangla ? "মোবাইল নম্বর" : "Phone number"} <span className="text-[#176b45]">*</span>
                              </label>
                              <input
                                id={`phone-${career.id}`}
                                name="phone"
                                type="tel"
                                autoComplete="tel"
                                required
                                className="mt-2 min-h-12 w-full rounded-lg border border-[#dcdcd2] bg-white px-3.5 py-3 text-sm text-[#243d30] outline-none transition placeholder:text-[#a2a59c] focus:border-[#176b45] focus:ring-2 focus:ring-[#176b45]/10"
                              />
                            </div>

                            <div>
                              <label
                                htmlFor={`qualification-${career.id}`}
                                className="block text-xs font-medium text-[#35463a]"
                              >
                                {isBangla ? "শিক্ষাগত যোগ্যতা" : "Qualification"}
                              </label>
                              <input
                                id={`qualification-${career.id}`}
                                name="qualification"
                                autoComplete="organization-title"
                                className="mt-2 min-h-12 w-full rounded-lg border border-[#dcdcd2] bg-white px-3.5 py-3 text-sm text-[#243d30] outline-none transition placeholder:text-[#a2a59c] focus:border-[#176b45] focus:ring-2 focus:ring-[#176b45]/10"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label
                                htmlFor={`experience-${career.id}`}
                                className="block text-xs font-medium text-[#35463a]"
                              >
                                {isBangla ? "অভিজ্ঞতা" : "Experience"}
                              </label>
                              <textarea
                                id={`experience-${career.id}`}
                                name="experience"
                                rows={3}
                                className="mt-2 w-full resize-y rounded-lg border border-[#dcdcd2] bg-white px-3.5 py-3 text-sm leading-6 text-[#243d30] outline-none transition focus:border-[#176b45] focus:ring-2 focus:ring-[#176b45]/10"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label
                                htmlFor={`coverLetter-${career.id}`}
                                className="block text-xs font-medium text-[#35463a]"
                              >
                                {isBangla
                                  ? "কভার লেটার / অতিরিক্ত তথ্য"
                                  : "Cover letter / additional information"}
                              </label>
                              <textarea
                                id={`coverLetter-${career.id}`}
                                name="coverLetter"
                                rows={4}
                                maxLength={5000}
                                className="mt-2 w-full resize-y rounded-lg border border-[#dcdcd2] bg-white px-3.5 py-3 text-sm leading-6 text-[#243d30] outline-none transition focus:border-[#176b45] focus:ring-2 focus:ring-[#176b45]/10"
                              />
                              <p className="mt-2 text-right text-[10px] text-[#8a8d83]">
                                {isBangla ? "সর্বোচ্চ ৫,০০০ অক্ষর" : "Maximum 5,000 characters"}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col gap-3 border-t border-[#e3e1d8] pt-5 sm:flex-row sm:items-center sm:justify-between">
                            <p className="max-w-xs text-[10px] leading-5 text-[#858a80]">
                              {isBangla
                                ? "জমা দেওয়ার আগে আপনার যোগাযোগের তথ্য যাচাই করুন।"
                                : "Please double-check your contact details before submitting."}
                            </p>
                            <button
                              type="submit"
                              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#176b45] px-6 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-[#124c36] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176b45]"
                            >
                              {isBangla ? "আবেদন জমা দিন" : "Submit application"}
                              <span aria-hidden="true" className="ml-3">↗</span>
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="border-t border-[#dfded5] bg-[#efeee7]">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-14">
          <div>
            <p className="kc-section-label">
              {isBangla ? "কেসিএমএসসি" : "K C MODEL SCHOOL & COLLEGE"}
            </p>
            <p className="mt-2 font-heading text-xl text-[#124c36]">
              {isBangla
                ? "আপনার কাজের মাধ্যমে ভবিষ্যৎ গড়ুন।"
                : "Help shape what comes next."}
            </p>
          </div>
          <a
            href="#open-positions"
            className="kc-classic-link w-fit"
          >
            {isBangla ? "সুযোগগুলো আবার দেখুন" : "View open positions"}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </main>
  );
}
