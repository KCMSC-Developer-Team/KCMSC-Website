"use client";

import Link from "next/link";
import { useState } from "react";
import { FiX } from "react-icons/fi";

export type NoticeTickerItem = {
  id: string;
  titleEn: string;
  titleBn: string;
};

// Scrolling top bar for text notices. Only titles move; each has a Read more
// link to the full notice page. Popup notices never appear here.
export function NoticeTicker({
  locale,
  notices,
}: {
  locale: "en" | "bn";
  notices: NoticeTickerItem[];
}) {
  const [hidden, setHidden] = useState(false);
  if (hidden || notices.length === 0) return null;

  const isBn = locale === "bn";
  const duration = Math.max(18, notices.length * 9);

  return (
    <div className="kc-ticker relative z-[60] flex items-center border-b border-[#d9d8cf] bg-[#176b45] text-white">
      <style>{`
        .kc-ticker-track { display: flex; width: max-content; animation: kc-ticker-scroll ${duration}s linear infinite; }
        .kc-ticker:hover .kc-ticker-track { animation-play-state: paused; }
        @keyframes kc-ticker-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .kc-ticker-track { animation: none; } }
      `}</style>

      <span className="shrink-0 bg-[#125a39] px-4 py-2.5 text-[12px] font-medium uppercase tracking-[0.18em]">
        {isBn ? "নোটিশ" : "Notice"}
      </span>

      <div className="min-w-0 flex-1 overflow-hidden">
        <div className="kc-ticker-track">
          {/* The list is rendered twice so the scroll loops without a gap. */}
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0" aria-hidden={copy === 1 ? true : undefined}>
              {notices.map((notice) => (
                <span key={`${copy}-${notice.id}`} className="flex items-center gap-3 whitespace-nowrap px-6 py-2.5 text-sm">
                  <span>{isBn ? notice.titleBn : notice.titleEn}</span>
                  {copy === 0 ? (
                    <Link
                      href={`/${locale}/notices/${notice.id}`}
                      className="rounded-full border border-white/40 px-3 py-0.5 text-xs font-medium transition hover:bg-white hover:text-[#176b45]"
                    >
                      {isBn ? "আরও পড়ুন" : "Read more"}
                    </Link>
                  ) : (
                    <span className="rounded-full border border-white/40 px-3 py-0.5 text-xs font-medium">
                      {isBn ? "আরও পড়ুন" : "Read more"}
                    </span>
                  )}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setHidden(true)}
        aria-label={isBn ? "নোটিশ বন্ধ করুন" : "Hide notices"}
        className="mr-2 grid h-8 w-8 shrink-0 place-items-center rounded-full text-white/75 transition hover:bg-white/10 hover:text-white"
      >
        <FiX className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
