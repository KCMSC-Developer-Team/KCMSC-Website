"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Locale } from "@/i18n/config";

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

export default function TeachersDirectory({ locale, teachers }: { locale: Locale; teachers: Teacher[] }) {
  const bn = locale === "bn";
  const [search, setSearch] = useState("");
  const [wing, setWing] = useState("all");
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

  return (
    <main className="min-h-screen bg-[#edf1ed] text-[#17352a]">
      <section className="kc-feature-hero relative isolate min-h-[390px] overflow-hidden border-b border-[#b59a4a] bg-[#102f24] text-white sm:min-h-[450px] lg:min-h-[490px]">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{ backgroundImage: "url('/kcmsc/hero/kcmsc-building.jpg')" }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(8,31,23,.94) 0%, rgba(13,48,35,.86) 48%, rgba(13,48,35,.54) 100%), linear-gradient(0deg, rgba(8,31,23,.35), transparent 55%)",
          }}
        />
        <div className="kc-feature-hero mx-auto flex min-h-[390px] max-w-[1240px] items-center px-5 py-16 sm:min-h-[450px] sm:px-10 sm:py-20 lg:min-h-[490px]">
          <div className="max-w-[780px]">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[#d7bd68]" />
              <p className="text-[10px] font-semibold uppercase tracking-[.25em] text-[#e5cf83]">
                {bn ? "কে সি মডেল স্কুল অ্যান্ড কলেজ · শিক্ষকবৃন্দ" : "K C MODEL SCHOOL & COLLEGE · FACULTY"}
              </p>
            </div>
            <h1 className="mt-6 max-w-[760px] font-heading text-[2.8rem] font-normal leading-[.98] tracking-[-.045em] sm:text-6xl lg:text-[5.1rem]">
              {bn ? "শিক্ষার পেছনের মানুষগুলো" : <>Meet the people<br className="hidden sm:block" /> behind learning.</>}
            </h1>
            <p className="mt-6 max-w-[550px] text-sm leading-7 text-white/80 sm:text-base sm:leading-8">
              {bn
                ? "আমাদের শিক্ষকবৃন্দের পরিচিতি, একাডেমিক দক্ষতা ও বিষয়ভিত্তিক তথ্য খুঁজে দেখুন।"
                : "Get to know the educators who guide our students, share their expertise and bring learning to life across KCMSC."}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#faculty-directory" className="inline-flex min-h-12 items-center gap-5 border border-[#d9c47e] bg-[#d9c47e] px-5 text-xs font-semibold uppercase tracking-[.13em] text-[#17382a] transition hover:bg-[#eadba7]">
                {bn ? "শিক্ষক খুঁজুন" : "Explore faculty"} <span aria-hidden="true" className="text-base">↘</span>
              </a>
              <span className="text-xs tracking-wide text-white/65">{bn ? "নাম, বিষয় ও বিভাগ দিয়ে অনুসন্ধান করুন" : "Search by name, subject or division"}</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 h-1 w-2/5 bg-[#d9c47e]" />
      </section>

      <section id="faculty-directory" className="mx-auto max-w-[1240px] px-5 py-8 sm:px-10 sm:py-12">
        <div className="border border-[#d3ddd4] bg-[#f8faf7]">
          <div className="grid gap-4 p-4 sm:grid-cols-[minmax(220px,1fr)_220px_220px] sm:p-5">
            <label className="block">
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[.16em] text-[#607266]">{bn ? "শিক্ষক খুঁজুন" : "Search faculty"}</span>
              <div className="flex h-11 items-center border border-[#cbd7cd] bg-white focus-within:border-[#176b45]">
                <span aria-hidden="true" className="pl-3 text-[#718477]">⌕</span>
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder={bn ? "নাম, বিষয় বা পদবি..." : "Name, subject or designation..."} className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-[#17352a] outline-none placeholder:text-[#8b9990]" />
                {search && <button onClick={() => { setSearch(""); setPage(1); }} className="px-3 text-xs text-[#607266]" aria-label="Clear search">×</button>}
              </div>
            </label>
            <label className="block">
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[.16em] text-[#607266]">{bn ? "বিভাগ" : "School division"}</span>
              <select value={wing} onChange={e => { setWing(e.target.value); setPage(1); }} className="h-11 w-full border border-[#cbd7cd] bg-white px-3 text-sm text-[#17352a] outline-none focus:border-[#176b45]">
                <option value="all">{bn ? "সব বিভাগ" : "All divisions"}</option>
                {wings.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[.16em] text-[#607266]">{bn ? "বিষয়" : "Subject"}</span>
              <select value={subject} onChange={e => { setSubject(e.target.value); setPage(1); }} className="h-11 w-full border border-[#cbd7cd] bg-white px-3 text-sm text-[#17352a] outline-none focus:border-[#176b45]">
                <option value="all">{bn ? "সব বিষয়" : "All subjects"}</option>
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#dbe3dc] px-4 py-3 sm:px-5">
            <p className="text-xs text-[#64776a]"><strong className="font-semibold text-[#17352a]">{filtered.length}</strong> {bn ? "টি প্রোফাইল পাওয়া গেছে" : `of ${teachers.length} faculty profiles`}</p>
            {(search || wing !== "all" || subject !== "all") && <button onClick={resetFilters} className="text-xs font-semibold text-[#176b45] underline decoration-[#b7c8ba] underline-offset-4">{bn ? "ফিল্টার মুছুন" : "Clear filters"}</button>}
          </div>
        </div>

        {teachers.length === 0 ? (
          <div className="mt-8 border border-[#d3ddd4] bg-[#f8faf7] px-6 py-16 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#9a854a]">KCMSC FACULTY</p>
            <h2 className="mt-3 font-heading text-2xl text-[#17352a]">{bn ? "শিক্ষক পরিচিতি প্রস্তুত করা হচ্ছে" : "Teacher profiles are being prepared"}</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#64776a]">{bn ? "যাচাইকৃত তথ্য প্রকাশের সঙ্গে সঙ্গে এই তালিকা হালনাগাদ করা হবে।" : "Verified teacher profiles will appear here as they are approved for publication."}</p>
          </div>
        ) : visible.length === 0 ? (
          <div className="mt-8 border border-[#d3ddd4] bg-[#f8faf7] px-6 py-16 text-center">
            <h2 className="font-heading text-2xl text-[#17352a]">{bn ? "কোনো প্রোফাইল পাওয়া যায়নি" : "No matching faculty found"}</h2>
            <p className="mt-2 text-sm text-[#64776a]">{bn ? "অনুসন্ধান বা ফিল্টার পরিবর্তন করে দেখুন।" : "Try another name, subject or division."}</p>
            <button onClick={resetFilters} className="mt-5 border border-[#176b45] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#176b45]">{bn ? "সব প্রোফাইল দেখুন" : "Show all profiles"}</button>
          </div>
        ) : (
          <>
            <div className="mb-4 mt-8 flex items-end justify-between border-b border-[#cbd7cd] pb-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#9a854a]">{bn ? "শিক্ষক ডিরেক্টরি" : "Faculty directory"}</p>
                <h2 className="mt-1 font-heading text-2xl tracking-tight text-[#17352a]">{wing === "all" ? (bn ? "সকল শিক্ষক" : "All faculty") : wing}</h2>
              </div>
              <p className="text-xs text-[#64776a]">{bn ? `পৃষ্ঠা ${currentPage} / ${pageCount}` : `Page ${currentPage} of ${pageCount}`}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map(t => (
                <Link key={t.id} href={`/${locale}/teachers/${t.id}`} className="group flex min-h-[122px] border border-[#d3ddd4] bg-[#f9fbf8] transition-colors hover:border-[#176b45] hover:bg-white focus-visible:outline-[#176b45]">
                  <div className="flex w-[94px] shrink-0 items-start justify-center border-r border-[#e0e7e0] bg-[#e7eee7] p-3">
                    <div className="h-[76px] w-[62px] overflow-hidden bg-[#d5e2d6]">
                      {t.photoUrl ? <img src={t.photoUrl} alt={t.name} loading="lazy" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center font-heading text-xl text-[#176b45]">{t.name.trim().split(/\s+/).slice(0,2).map(n => n[0]).join("").toUpperCase()}</div>}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 p-3.5">
                    <span className="block text-[9px] font-semibold uppercase tracking-[.12em] text-[#8b7840]">{t.wing}</span>
                    <h3 className="mt-1 line-clamp-2 font-heading text-[17px] leading-snug text-[#17352a] group-hover:text-[#176b45]">{t.name}</h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#68796d]">{t.designation}</p>
                    {t.subjects.length > 0 && <p className="mt-2 line-clamp-1 text-[10px] font-medium text-[#176b45]">{t.subjects.join(" · ")}</p>}
                    <span className="mt-3 inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[.13em] text-[#176b45]">{bn ? "সম্পূর্ণ পরিচিতি" : "View profile"} <span aria-hidden="true">↗</span></span>
                  </div>
                </Link>
              ))}
            </div>
            {pageCount > 1 && <nav aria-label="Faculty pages" className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#cbd7cd] pt-5">
              <p className="text-xs text-[#64776a]">{bn ? `${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filtered.length)} দেখানো হচ্ছে` : `Showing ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filtered.length)} of ${filtered.length}`}</p>
              <div className="flex items-center gap-1">
                <button disabled={currentPage === 1} onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="border border-[#cbd7cd] px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-40">{bn ? "পূর্ববর্তী" : "Previous"}</button>
                {Array.from({ length: pageCount }, (_, i) => i + 1).filter(n => n === 1 || n === pageCount || Math.abs(n - currentPage) <= 1).map((n, i, arr) => <span key={n} className="contents">{i > 0 && arr[i - 1] !== n - 1 && <span className="px-1 text-xs text-[#64776a]">…</span>}<button onClick={() => { setPage(n); window.scrollTo({ top: 0, behavior: "smooth" }); }} aria-current={n === currentPage ? "page" : undefined} className={`min-w-9 border px-3 py-2 text-xs ${n === currentPage ? "border-[#176b45] bg-[#176b45] text-white" : "border-[#cbd7cd] text-[#365443] hover:bg-white"}`}>{n}</button></span>)}
                <button disabled={currentPage === pageCount} onClick={() => { setPage(p => Math.min(pageCount, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="border border-[#cbd7cd] px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-40">{bn ? "পরবর্তী" : "Next"}</button>
              </div>
            </nav>}
          </>
        )}
      </section>
    </main>
  );
}
