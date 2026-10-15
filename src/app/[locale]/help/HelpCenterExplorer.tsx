"use client";

import { useMemo, useState } from "react";
import {
  FiArrowRight, FiArrowUpRight, FiBookOpen, FiChevronDown, FiChevronLeft,
  FiChevronRight, FiCreditCard, FiFileText, FiHelpCircle, FiSearch,
  FiUsers, FiClock, FiBriefcase, FiShield, FiAward, FiX,
} from "react-icons/fi";

type Article = {
  id: string; slug: string; questionEn: string; questionBn: string;
  answerEn: string; answerBn: string; categoryEn: string; categoryBn: string;
  isFeatured: boolean;
};

const PAGE_SIZE = 6;
const iconFor = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("admission")) return FiBookOpen;
  if (n.includes("fee") || n.includes("financial")) return FiCreditCard;
  if (n.includes("school time") || n.includes("shift")) return FiClock;
  if (n.includes("student") || n.includes("class")) return FiUsers;
  if (n.includes("teacher") || n.includes("recruit")) return FiBriefcase;
  if (n.includes("result") || n.includes("academic")) return FiAward;
  if (n.includes("rule") || n.includes("general")) return FiShield;
  return FiFileText;
};

export default function HelpCenterExplorer({ articles, locale }: { articles: Article[]; locale: "en" | "bn" }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [open, setOpen] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const bn = locale === "bn";
  const categories = useMemo(() => Array.from(new Set(articles.map((a) => bn ? a.categoryBn : a.categoryEn))).sort((a,b) => a.localeCompare(b, bn ? "bn" : "en")), [articles, bn]);
  const featured = useMemo(() => articles.filter((a) => a.isFeatured).slice(0, 3), [articles]);
  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    return articles.filter((a) => {
      const name = bn ? a.categoryBn : a.categoryEn;
      const text = [a.questionEn, a.questionBn, a.answerEn, a.answerBn, a.categoryEn, a.categoryBn].join(" ").toLocaleLowerCase();
      return (category === "all" || name === category) && (!q || text.includes(q));
    });
  }, [articles, bn, category, query]);
  const hasFilter = Boolean(query.trim()) || category !== "all";
  const visible = filtered.slice(0, page * PAGE_SIZE);
  const setTopic = (value: string) => { setCategory(value); setPage(1); setOpen(null); };
  const clearFilters = () => { setQuery(""); setTopic("all"); };

  return <div className="kc-help-center min-h-[70vh] bg-[#f7f5ef] font-sans text-[#242824]">
    <section className="relative overflow-hidden bg-[#124c36] px-5 py-14 text-white sm:py-20">
      <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute right-10 top-12 h-48 w-48 rounded-full border border-white/10" />
      <div className="relative mx-auto max-w-5xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#c9d9ce]">K C Model School & College · {bn ? "সহায়তা কেন্দ্র" : "HELP CENTER"}</p>
        <h1 className="mt-4 max-w-3xl font-heading text-4xl font-normal leading-tight tracking-[-0.035em] sm:text-6xl">{bn ? "কীভাবে সাহায্য করতে পারি?" : "How can we help you?"}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">{bn ? "ভর্তি, ফি, একাডেমিক তথ্য এবং স্কুলের বিভিন্ন সেবা সম্পর্কে উত্তর খুঁজুন।" : "Find clear answers about admissions, fees, academics and school services."}</p>
        <label className="mt-8 flex max-w-2xl items-center gap-3 rounded-2xl bg-white p-2 pl-4 text-[#34443a] shadow-xl ring-1 ring-black/5">
          <FiSearch className="h-5 w-5 shrink-0 text-[#69756d]" />
          <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder={bn ? "আপনার প্রশ্ন লিখুন..." : "Search for a question or topic..."} className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-[#89918b]" />
          {query && <button type="button" aria-label={bn ? "মুছুন" : "Clear search"} onClick={() => { setQuery(""); setPage(1); }} className="rounded-lg p-2 text-[#69756d] hover:bg-[#f0f2ed]"><FiX /></button>}
          <span className="hidden rounded-lg bg-[#f0f2ed] px-3 py-2 text-[10px] text-[#647168] sm:inline">{articles.length} {bn ? "টি উত্তর" : "answers"}</span>
        </label>
      </div>
    </section>

    <section className="mx-auto max-w-5xl px-5 py-9 sm:py-12">
      {!hasFilter && <>
        {featured.length > 0 && <div className="mb-12">
          <div className="mb-4 flex items-end justify-between gap-4"><div><p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#176b45]">{bn ? "দ্রুত উত্তর" : "QUICK ANSWERS"}</p><h2 className="mt-2 font-heading text-2xl font-normal tracking-[-0.025em] sm:text-3xl">{bn ? "জনপ্রিয় প্রশ্ন" : "Popular questions"}</h2></div><span className="hidden text-xs text-[#7b847b] sm:block">{bn ? "সাধারণ জিজ্ঞাসা" : "Frequently asked"}</span></div>
          <div className="grid gap-3 md:grid-cols-3">{featured.map((a) => <button key={a.id} onClick={() => { setTopic(bn ? a.categoryBn : a.categoryEn); setOpen(a.id); }} className="group flex min-h-28 items-start gap-3 rounded-2xl border border-[#e3e3d9] bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-[#176b45]/40 hover:shadow-md"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#eaf2ec] text-[#176b45]"><FiBookOpen /></span><span className="flex-1 text-sm font-medium leading-6">{bn ? a.questionBn : a.questionEn}</span><FiArrowUpRight className="mt-1 shrink-0 text-[#7e8a80] transition group-hover:text-[#176b45]" /></button>)}</div>
        </div>}
        <div className="mb-12">
          <div className="mb-5"><p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#176b45]">{bn ? "বিষয় অনুযায়ী খুঁজুন" : "BROWSE BY TOPIC"}</p><h2 className="mt-2 font-heading text-2xl font-normal tracking-[-0.025em] sm:text-3xl">{bn ? "আপনার প্রয়োজনীয় বিষয় বেছে নিন" : "What do you need help with?"}</h2></div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{categories.map((c) => { const Icon = iconFor(c); const count = articles.filter(a => (bn ? a.categoryBn : a.categoryEn) === c).length; return <button key={c} onClick={() => setTopic(c)} className="group flex min-h-[116px] items-center gap-4 rounded-2xl border border-[#e3e3d9] bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-[#176b45]/40 hover:shadow-md"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#edf3ed] text-xl text-[#176b45] transition group-hover:bg-[#176b45] group-hover:text-white"><Icon /></span><span className="min-w-0 flex-1"><span className="block font-semibold leading-5">{c}</span><span className="mt-1 block text-xs text-[#7b847b]">{count} {bn ? "টি প্রশ্ন" : count === 1 ? "article" : "articles"}</span></span><FiArrowRight className="shrink-0 text-[#89918b] transition group-hover:translate-x-1 group-hover:text-[#176b45]" /></button>; })}</div>
        </div>
      </>}

      {hasFilter && <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside><div className="mb-3 flex items-center justify-between"><p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#737d74]">{bn ? "বিষয়" : "TOPICS"}</p><button onClick={clearFilters} className="text-xs font-medium text-[#176b45] hover:underline">{bn ? "সব দেখুন" : "Clear"}</button></div><div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible"><button onClick={() => setTopic("all")} className={`shrink-0 rounded-xl px-3 py-2.5 text-left text-sm transition ${category === "all" ? "bg-[#176b45] font-medium text-white" : "bg-white text-[#59645b] hover:bg-[#e9eee8]"}`}>{bn ? "সব প্রশ্ন" : "All questions"}</button>{categories.map((c) => <button key={c} onClick={() => setTopic(c)} className={`shrink-0 rounded-xl px-3 py-2.5 text-left text-sm transition ${category === c ? "bg-[#176b45] font-medium text-white" : "bg-white text-[#59645b] hover:bg-[#e9eee8]"}`}>{c}</button>)}</div><div className="mt-6 hidden rounded-2xl border border-[#e1e2d8] bg-white p-4 lg:block"><FiHelpCircle className="h-5 w-5 text-[#176b45]"/><p className="mt-3 text-sm font-semibold">{bn ? "উত্তর খুঁজে পাননি?" : "Still need help?"}</p><p className="mt-1 text-xs leading-5 text-[#687269]">{bn ? "নিশ্চিত তথ্যের জন্য স্কুল অফিসে যোগাযোগ করুন।" : "Contact the school office for information that needs confirmation."}</p><a href={`/${locale}/contact`} className="mt-3 inline-flex text-xs font-semibold text-[#176b45] hover:underline">{bn ? "যোগাযোগ করুন" : "Contact KCMSC"} <FiArrowUpRight className="ml-1" /></a></div></aside>
        <div><div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#176b45]">{category === "all" ? (bn ? "সার্চের ফলাফল" : "SEARCH RESULTS") : category}</p><h2 className="mt-1 font-heading text-2xl font-normal tracking-[-0.025em] sm:text-3xl">{bn ? "প্রশ্ন ও উত্তর" : "Questions & answers"}</h2></div><span className="text-xs text-[#7b847b]">{filtered.length} {bn ? "টি পাওয়া গেছে" : filtered.length === 1 ? "result" : "results"}</span></div>
          {filtered.length ? <><div className="space-y-3">{visible.map((a) => { const expanded = open === a.id; return <article id={`article-${a.id}`} key={a.id} className={`overflow-hidden rounded-2xl border bg-white transition ${expanded ? "border-[#176b45]/40 shadow-sm" : "border-[#e2e3d9]"}`}><button aria-expanded={expanded} onClick={() => setOpen(expanded ? null : a.id)} className="flex w-full items-start gap-4 p-5 text-left sm:p-6"><span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#f0f2ed] text-sm font-semibold text-[#176b45]">?</span><span className="flex-1"><span className="block text-[10px] font-semibold uppercase tracking-[0.13em] text-[#7c887e]">{bn ? a.categoryBn : a.categoryEn}</span><span className="mt-1 block text-sm font-semibold leading-6 text-[#202a24] sm:text-base">{bn ? a.questionBn : a.questionEn}</span></span><FiChevronDown className={`mt-2 shrink-0 text-[#738076] transition-transform ${expanded ? "rotate-180" : ""}`} /></button>{expanded && <div className="border-t border-[#ecece4] px-5 pb-6 pl-[4.25rem] sm:px-6 sm:pl-[4.5rem]"><p className="whitespace-pre-line pt-4 text-sm leading-7 text-[#59645b]">{bn ? a.answerBn : a.answerEn}</p></div>}</article>; })}</div>
            {visible.length < filtered.length && <div className="mt-6 flex justify-center"><button onClick={() => setPage(p => p + 1)} className="inline-flex items-center gap-2 rounded-full border border-[#176b45]/25 bg-white px-5 py-3 text-sm font-semibold text-[#176b45] transition hover:bg-[#edf3ed]">{bn ? "আরও প্রশ্ন দেখুন" : "Load more questions"}<FiChevronDown /></button></div>}
          </> : <div className="rounded-2xl border border-dashed border-[#d6d9cf] bg-white px-6 py-14 text-center"><FiSearch className="mx-auto h-7 w-7 text-[#879187]"/><h3 className="mt-3 font-heading text-xl font-normal tracking-[-0.02em]">{bn ? "কোনো ফলাফল পাওয়া যায়নি" : "No matching answers"}</h3><p className="mt-2 text-sm text-[#687269]">{bn ? "অন্য শব্দ দিয়ে খুঁজুন অথবা অন্য বিষয় নির্বাচন করুন।" : "Try another search term or browse a different topic."}</p><button onClick={clearFilters} className="mt-4 rounded-full bg-[#176b45] px-4 py-2 text-xs font-semibold text-white">{bn ? "সব বিষয় দেখুন" : "Browse all topics"}</button></div>}
        </div>
      </div>}

      <div className="mt-10 rounded-2xl bg-[#eaf0e9] p-6 sm:flex sm:items-center sm:justify-between sm:p-8"><div><p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#176b45]">KCMSC SUPPORT</p><h2 className="mt-2 font-heading text-2xl font-normal tracking-[-0.025em]">{bn ? "আরও তথ্য প্রয়োজন?" : "Need information specific to your situation?"}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#5f6d62]">{bn ? "ফি, ভর্তি বা প্রশাসনিক বিষয়ে নিশ্চিত তথ্যের জন্য স্কুল অফিসের সাথে যোগাযোগ করুন।" : "For current fees, admission decisions or administrative matters, contact the school directly."}</p></div><a href={`/${locale}/contact`} className="mt-5 inline-flex shrink-0 items-center justify-center rounded-full bg-[#176b45] px-5 py-3 text-sm font-medium text-white hover:bg-[#124c36] sm:mt-0">{bn ? "স্কুলে যোগাযোগ করুন" : "Contact the school"}<FiArrowUpRight className="ml-2" /></a></div>
    </section>
  </div>;
}
