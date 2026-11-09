"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export type ExploreItem = {
  title: string;
  body: string;
  image: string;
  href: string;
  link: string;
};

/** Three-part explorer: pick a tab (click or hover) to preview that part of school life. */
export function ExploreTabs({ items, kicker }: { items: ExploreItem[]; kicker: string }) {
  const [active, setActive] = useState(0);
  const item = items[active] ?? items[0];
  if (!item) return null;

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] lg:gap-10">
      <div role="tablist" aria-orientation="vertical" className="flex min-w-0 flex-col gap-3">
        {items.map((it, i) => {
          const selected = i === active;
          return (
            <button
              key={it.title}
              type="button"
              role="tab"
              id={`explore-tab-${i}`}
              aria-selected={selected}
              aria-controls="explore-panel"
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className={`group flex items-center gap-4 rounded-2xl border px-5 py-5 text-left transition-all duration-300 ease-out ${
                selected
                  ? "border-[#1f8a5b] bg-white shadow-[var(--kc-shadow-lift)]"
                  : "border-[#d3e3d8] bg-white/60 hover:-translate-y-0.5 hover:bg-white"
              }`}
            >
              <span
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl font-heading text-xl transition-colors duration-300 ${
                  selected ? "bg-[#1f8a5b] text-white" : "bg-[#e3f2e9] text-[#176b45]"
                }`}
              >
                0{i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-heading text-2xl leading-tight text-[#124c36]">{it.title}</span>
                <span className="mt-1 block truncate text-sm text-[#69716b]">{it.body}</span>
              </span>
              <span
                aria-hidden="true"
                className={`text-lg text-[#1f8a5b] transition-transform duration-300 ${selected ? "translate-x-1" : "group-hover:translate-x-1"}`}
              >
                →
              </span>
            </button>
          );
        })}
      </div>

      <div
        id="explore-panel"
        role="tabpanel"
        aria-labelledby={`explore-tab-${active}`}
        key={active}
        className="kc-explore-panel relative min-w-0 w-full overflow-hidden rounded-3xl bg-white shadow-[var(--kc-shadow-lift)]"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#e7e4da]">
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover transition duration-700 ease-out hover:scale-[1.04]"
          />
          <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[.16em] text-[#8a7740] backdrop-blur">
            {kicker}
          </span>
        </div>
        <div className="p-7 sm:p-9">
          <h3 className="font-heading text-3xl text-[#124c36]">{item.title}</h3>
          <p className="mt-3 max-w-xl text-[15px] leading-7 text-[#58645c]">{item.body}</p>
          <Link
            href={item.href}
            className="group mt-7 inline-flex items-center gap-3 rounded-full bg-[#1f8a5b] px-5 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#124c36]"
          >
            {item.link}
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ExploreTabs;
