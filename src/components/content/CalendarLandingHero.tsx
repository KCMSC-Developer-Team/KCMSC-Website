"use client";

import type { Locale } from "@/i18n/config";

type Props = {
  locale: Locale;
  kicker: string;
  title: string;
  intro: string;
  note: string;
};

export default function CalendarLandingHero({ locale, kicker, title, intro, note }: Props) {
  const bn = locale === "bn";

  return (
    <section className="relative overflow-hidden border-b border-[#D9E2EC] bg-[#fffdf8]">
      <div className="relative mx-auto grid max-w-[1240px] gap-10 px-6 pb-12 pt-12 sm:px-10 sm:pb-16 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end lg:gap-16 lg:pb-[4.5rem] lg:pt-[4.5rem]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="kc-classic-kicker">{kicker}</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D9E2EC] bg-white/80 px-3 py-1.5 text-[11px] font-medium text-[#176b45]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#176b45]" />
              {bn ? "Google Calendar · ঢাকা সময়" : "Google Calendar · Dhaka time"}
            </span>
          </div>

          <h1 className="mt-6 max-w-[850px] font-heading text-[clamp(2.8rem,6.4vw,5.8rem)] leading-[.94] tracking-[-.055em] text-[#12324A]">
            {title}
          </h1>

          <p className="mt-6 max-w-[650px] text-[15px] leading-7 text-[#64748B] sm:text-base sm:leading-8">
            {intro}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#academic-calendar"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#176b45] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#12324A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176b45] focus-visible:ring-offset-2"
            >
              {bn ? "ক্যালেন্ডার দেখুন" : "Explore calendar"}
              <span aria-hidden="true" className="ml-2">↓</span>
            </a>
            <a
              href="https://calendar.google.com/calendar/embed?src=kcmodelcollege%40gmail.com&ctz=Asia%2FDhaka"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#D9E2EC] bg-white/70 px-5 py-3 text-sm font-semibold text-[#12324A] transition hover:border-[#176b45] hover:text-[#176b45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176b45] focus-visible:ring-offset-2"
            >
              {bn ? "Google Calendar খুলুন" : "Open Google Calendar"}
              <span aria-hidden="true" className="ml-2">↗</span>
            </a>
          </div>

          <p className="mt-6 max-w-[650px] border-l-2 border-[#d5bd75] pl-4 text-sm leading-6 text-[#707770]">
            {note}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          <div className="rounded-2xl border border-[#D9E2EC] bg-white/85 p-4 sm:p-5">
            <span className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#9A854A]">
              {bn ? "হালনাগাদ তথ্য" : "Calendar source"}
            </span>
            <p className="mt-2 font-heading text-lg text-[#12324A]">
              {bn ? "সরাসরি Google থেকে" : "Live from Google"}
            </p>
            <p className="mt-1 text-xs leading-5 text-[#64748B]">
              {bn ? "প্রকাশিত ইভেন্টগুলো এখানে দেখানো হয়।" : "Published school events appear in the calendar below."}
            </p>
          </div>
          <div className="rounded-2xl border border-[#D9E2EC] bg-[#F8FAFC]/90 p-4 sm:p-5">
            <span className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#9A854A]">
              {bn ? "পরিকল্পনা করুন" : "Plan ahead"}
            </span>
            <p className="mt-2 font-heading text-lg text-[#12324A]">
              {bn ? "তারিখ নির্বাচন করুন" : "Choose a date"}
            </p>
            <p className="mt-1 text-xs leading-5 text-[#64748B]">
              {bn ? "তারিখে চাপ দিয়ে ইভেন্টের বিবরণ দেখুন।" : "Select any date to explore its event details."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
