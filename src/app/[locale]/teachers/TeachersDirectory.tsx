"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Locale } from "@/i18n/config";
import { SubpageHero } from "@/components/subpage/SubpageKit";
import { Reveal } from "@/components/home/Reveal";

type Teacher = {
  id: string;
  staffId: string;
  name: string;
  designation: string;
  wing: string;
  subjects: string[];
  photoUrl: string | null;
  highestDegree: string | null;
  university: string | null;
};

const wingOrder = ["College Wing", "Senior Wing", "Junior Wing", "Primary Wing", "Administration", "Unassigned"];
const PAGE_SIZE = 24;

export default function TeachersDirectory({ locale, teachers, initialWing = "all" }: { locale: Locale; teachers: Teacher[]; initialWing?: string }) {
  const bn = locale === "bn";
  const [search, setSearch] = useState("");
  const [wing, setWing] = useState(initialWing);
  const [subject, setSubject] = useState("all");
  const [page, setPage] = useState(1);

  const wings = useMemo(() => [...new Set(teachers.map(t => t.wing))].sort((a, b) => {
    const ai = wingOrder.indexOf(a), bi = wingOrder.indexOf(b);
    return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi) || a.localeCompare(b);
  }), [teachers]);

  const subjects = useMemo(() => [...new Set(teachers.flatMap(t => t.subjects))].filter(Boolean).sort((a,b) => a.localeCompare(b)), [teachers]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return teachers.filter(t => {
      const matchesWing = wing === "all" || t.wing === wing;
      const matchesSubject = subject === "all" || t.subjects.includes(subject);
      const haystack = [t.name, t.designation, t.wing, t.staffId, ...t.subjects, t.highestDegree ?? "", t.university ?? ""].join(" ").toLowerCase();
      return matchesWing && matchesSubject && (!q || haystack.includes(q));
    }).sort((a,b) => {
      const ai = wingOrder.indexOf(a.wing), bi = wingOrder.indexOf(b.wing);
      return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi) || a.name.localeCompare(b.name);
    });
  }, [teachers, search, wing, subject]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function resetFilters() {
    setSearch("");
    setWing("all");
    setSubject("all");
    setPage(1);
  }

  const hasFilter = Boolean(search || wing !== "all" || subject !== "all");
  const pageButtonBase =
    "min-w-10 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40";
  const pageButton = (active: boolean) =>
    `${pageButtonBase} ${
      active
        ? "border-[#1f8a5b] bg-[#1f8a5b] text-white"
        : "border-[#d3e3d8] bg-white text-[#365443] hover:border-[#1f8a5b] hover:text-[#1f8a5b]"
    }`;
  const filterLabel = "mb-2 block text-[11px] font-semibold uppercase tracking-[.16em] text-[#607266]";
  const selectClass =
    "h-12 w-full rounded-xl border border-[#d3e3d8] bg-white px-4 text-sm text-[#17352a] outline-none transition focus:border-[#1f8a5b] focus:shadow-[0_0_0_4px_rgba(31,138,91,.12)]";

  return (
    <div className="kc-sub-page min-h-screen">
      <SubpageHero
        kicker={bn ? "কে সি মডেল স্কুল অ্যান্ড কলেজ · শিক্ষকবৃন্দ" : "K C MODEL SCHOOL & COLLEGE · FACULTY"}
        title={bn ? "শিক্ষার পেছনের মানুষগুলো" : "Meet the people behind learning."}
        body={
          bn
            ? "আমাদের শিক্ষকবৃন্দের পরিচিতি, একাডেমিক দক্ষতা ও বিষয়ভিত্তিক তথ্য খুঁজে দেখুন।"
            : "Get to know the educators who guide our students, share their expertise and bring learning to life across KCMSC."
        }
        image="/kcmsc/hero/kcmsc-building.jpg"
        imageAlt="K C Model School & College campus"
        priority
        actions={
          <>
            <a href="#faculty-directory" className="kc-classic-button kc-classic-button-light gap-2">
              {bn ? "শিক্ষক খুঁজুন" : "Explore faculty"} <span aria-hidden="true">↘</span>
            </a>
            <span className="self-center text-sm text-white/75">
              {bn ? "নাম, বিষয় ও বিভাগ দিয়ে অনুসন্ধান করুন" : "Search by name, subject or division"}
            </span>
          </>
        }
      />

      <section id="faculty-directory" className="mx-auto max-w-[1180px] px-5 pb-20 pt-12 sm:px-8 lg:px-10 lg:pb-28">
        {/* Filters */}
        <Reveal>
          <div className="kc-sub-panel p-5 sm:p-6">
            <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_220px_220px]">
              <label className="block">
                <span className={filterLabel}>{bn ? "শিক্ষক খুঁজুন" : "Search faculty"}</span>
                <div className="flex h-12 items-center gap-3 rounded-xl border border-[#d3e3d8] bg-white px-4 transition focus-within:border-[#1f8a5b] focus-within:shadow-[0_0_0_4px_rgba(31,138,91,.12)]">
                  <span aria-hidden="true" className="text-[#718477]">⌕</span>
                  <input
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    placeholder={bn ? "নাম, বিষয় বা পদবি..." : "Name, subject or designation..."}
                    className="h-full min-w-0 flex-1 bg-transparent text-sm text-[#17352a] outline-none placeholder:text-[#8b9990]"
                  />
                  {search && (
                    <button
                      onClick={() => {
                        setSearch("");
                        setPage(1);
                      }}
                      className="rounded-full px-2 text-sm text-[#607266] hover:text-[#1f8a5b]"
                      aria-label="Clear search"
                    >
                      ×
                    </button>
                  )}
                </div>
              </label>

              <label className="block">
                <span className={filterLabel}>{bn ? "বিভাগ" : "School division"}</span>
                <select
                  value={wing}
                  onChange={(e) => {
                    setWing(e.target.value);
                    setPage(1);
                  }}
                  className={selectClass}
                >
                  <option value="all">{bn ? "সব বিভাগ" : "All divisions"}</option>
                  {wings.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className={filterLabel}>{bn ? "বিষয়" : "Subject"}</span>
                <select
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    setPage(1);
                  }}
                  className={selectClass}
                >
                  <option value="all">{bn ? "সব বিষয়" : "All subjects"}</option>
                  {subjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#e4e2da] pt-4">
              <p className="text-sm text-[#64776a]">
                <strong className="font-semibold text-[#17352a]">{filtered.length}</strong>{" "}
                {bn ? "টি প্রোফাইল পাওয়া গেছে" : `of ${teachers.length} faculty profiles`}
              </p>
              {hasFilter && (
                <button onClick={resetFilters} className="kc-classic-link text-sm">
                  {bn ? "ফিল্টার মুছুন" : "Clear filters"}
                </button>
              )}
            </div>
          </div>
        </Reveal>

        {teachers.length === 0 ? (
          <div className="kc-sub-panel mt-10 px-6 py-16 text-center">
            <p className="kc-classic-kicker">KCMSC FACULTY</p>
            <h2 className="mt-3 font-heading text-3xl text-[#124c36]">
              {bn ? "শিক্ষক পরিচিতি প্রস্তুত করা হচ্ছে" : "Teacher profiles are being prepared"}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#64776a]">
              {bn
                ? "যাচাইকৃত তথ্য প্রকাশের সঙ্গে সঙ্গে এই তালিকা হালনাগাদ করা হবে।"
                : "Verified teacher profiles will appear here as they are approved for publication."}
            </p>
          </div>
        ) : visible.length === 0 ? (
          <div className="kc-sub-panel mt-10 px-6 py-16 text-center">
            <h2 className="font-heading text-3xl text-[#124c36]">
              {bn ? "কোনো প্রোফাইল পাওয়া যায়নি" : "No matching faculty found"}
            </h2>
            <p className="mt-2 text-sm text-[#64776a]">
              {bn ? "অনুসন্ধান বা ফিল্টার পরিবর্তন করে দেখুন।" : "Try another name, subject or division."}
            </p>
            <button onClick={resetFilters} className="kc-classic-button kc-classic-button-primary mt-6">
              {bn ? "সব প্রোফাইল দেখুন" : "Show all profiles"}
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 mt-12 flex items-end justify-between gap-4 border-b border-[#e4e2da] pb-5">
              <div>
                <p className="kc-classic-kicker">{bn ? "শিক্ষক ডিরেক্টরি" : "Faculty directory"}</p>
                <h2 className="kc-classic-title mt-2">
                  {wing === "all" ? (bn ? "সকল শিক্ষক" : "All faculty") : wing}
                </h2>
              </div>
              <p className="shrink-0 text-sm text-[#64776a]">
                {bn ? `পৃষ্ঠা ${currentPage} / ${pageCount}` : `Page ${currentPage} of ${pageCount}`}
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((t, i) => (
                <Reveal key={t.id} delay={Math.min(i, 5) * 60} className="h-full">
                  <Link
                    href={`/${locale}/teachers/${t.id}`}
                    className="kc-sub-panel group flex h-full overflow-hidden focus-visible:outline-[#1f8a5b]"
                  >
                    <div className="relative w-[104px] shrink-0 overflow-hidden bg-gradient-to-br from-[#e3f2e9] via-white to-[#f6e9bf]">
                      {t.photoUrl ? (
                        <img
                          src={t.photoUrl}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover object-top transition duration-700 ease-out group-hover:scale-[1.06]"
                        />
                      ) : (
                        <div className="grid h-full min-h-[150px] place-items-center font-heading text-2xl text-[#176b45]">
                          {t.name.trim().split(/\s+/).slice(0, 2).map((n) => n[0]).join("").toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col p-5">
                      <span className="inline-flex w-fit rounded-full bg-[#f6e9bf] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[.12em] text-[#8a6a12]">
                        {t.wing}
                      </span>
                      <h3 className="mt-3 line-clamp-2 font-heading text-xl leading-snug text-[#124c36] transition-colors duration-300 group-hover:text-[#1f8a5b]">
                        {t.name}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-[#69716b]">{t.designation}</p>
                      {t.subjects.length > 0 && (
                        <p className="mt-2 line-clamp-1 text-[12px] font-semibold text-[#1f8a5b]">
                          {t.subjects.join(" · ")}
                        </p>
                      )}
                      <span className="mt-auto inline-flex items-center gap-2 pt-4 text-[12px] font-semibold uppercase tracking-[.13em] text-[#1f8a5b]">
                        {bn ? "সম্পূর্ণ পরিচিতি" : "View profile"}
                        <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>

            {pageCount > 1 && (
              <nav
                aria-label="Faculty pages"
                className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#e4e2da] pt-6"
              >
                <p className="text-sm text-[#64776a]">
                  {bn
                    ? `${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filtered.length)} দেখানো হচ্ছে`
                    : `Showing ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filtered.length)} of ${filtered.length}`}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => {
                      setPage((p) => Math.max(1, p - 1));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={pageButton(false)}
                  >
                    {bn ? "পূর্ববর্তী" : "Previous"}
                  </button>
                  {Array.from({ length: pageCount }, (_, i) => i + 1)
                    .filter((n) => n === 1 || n === pageCount || Math.abs(n - currentPage) <= 1)
                    .map((n, i, arr) => (
                      <span key={n} className="contents">
                        {i > 0 && arr[i - 1] !== n - 1 && <span className="px-1 text-xs text-[#64776a]">…</span>}
                        <button
                          onClick={() => {
                            setPage(n);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          aria-current={n === currentPage ? "page" : undefined}
                          className={pageButton(n === currentPage)}
                        >
                          {n}
                        </button>
                      </span>
                    ))}
                  <button
                    disabled={currentPage === pageCount}
                    onClick={() => {
                      setPage((p) => Math.min(pageCount, p + 1));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={pageButton(false)}
                  >
                    {bn ? "পরবর্তী" : "Next"}
                  </button>
                </div>
              </nav>
            )}
          </>
        )}
      </section>
    </div>
  );
}
