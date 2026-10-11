"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getDictionary } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { LanguageSwitcher } from "./LanguageSwitcher";

type Item = { href: string; label: string };

export function Navbar({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const [open, setOpen] = useState(false);
  const text = (en: string, bn: string) => (locale === "bn" ? bn : en);

  // Keep the navigation grouped in a consistent order: school information,
  // learning and campus life, community, then announcements and practical links.
  const allItems: Item[] = [
    { href: "about", label: text("About", "পরিচিতি") },
    { href: "academics", label: text("Academics", "একাডেমিক") },
    { href: "student-life", label: text("Student life", "শিক্ষাজীবন") },
    { href: "facilities", label: text("Campus", "ক্যাম্পাস") },
    { href: "alumni", label: text("Alumni", "প্রাক্তন শিক্ষার্থী") },
    { href: "leadership-messages", label: text("Leadership", "নেতৃত্ব") },
    { href: "notices", label: text("Notices", "নোটিশ") },
    { href: "careers", label: text("Careers", "ক্যারিয়ার") },
    { href: "contact", label: text("Contact", "যোগাযোগ") },
  ];

  useEffect(() => {
    const close = (event: KeyboardEvent) =>
      event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", close);
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.removeEventListener("keydown", close);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#d9d8cf] bg-[#fffdf8]/95 backdrop-blur">
        <div className="mx-auto flex h-[66px] max-w-[1280px] items-center px-4 sm:px-7 lg:h-[72px] lg:px-10">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-3"
            onClick={() => setOpen(false)}
          >
            {/* Logo */}
            <span className="relative flex h-11 w-10 shrink-0 items-center justify-center overflow-visible">
              <img
                src="/kcmsc/kcmsc-logo.png"
                alt="K C Model School & College logo"
                className="block h-full w-full object-contain"
              />
            </span>

            <span>
              <span className="block font-heading text-[17px] font-normal leading-none text-[#124c36]">
                K C Model School & College
              </span>
              {/* <span className="mt-1 block text-[7px] font-normal uppercase tracking-[.2em] text-[#858b84]">
                & College
              </span> */}
            </span>
          </Link>

          <nav
            className="ml-auto hidden items-center gap-0 lg:flex"
            aria-label="Primary"
          >
            {allItems.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}/${item.href}`}
                className="kc-nav-link !px-2 2xl:!px-[11px]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-4 flex items-center gap-2">
            <LanguageSwitcher current={locale} />

            <Link
              href={`/${locale}/admissions`}
              className="hidden rounded-full border border-[#176b45] px-4 py-2 text-[10px] font-medium uppercase tracking-[.08em] text-[#176b45] transition hover:bg-[#176b45] hover:text-white sm:inline-flex"
            >
              {locale === "bn" ? "ভর্তি" : dict.nav.admissions}
            </Link>

            <button
              type="button"
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((value) => !value)}
              className="rounded-full border border-[#d9d8cf] px-4 py-2 text-[10px] font-medium uppercase tracking-[.08em] text-[#3f4741] transition hover:border-[#176b45] hover:text-[#176b45] lg:hidden"
            >
              {open ? text("Close", "বন্ধ") : text("Menu", "মেনু")}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div
          id="site-menu"
          className="fixed inset-0 z-40 bg-[#242824]/15 backdrop-blur-[2px] lg:hidden"
          onMouseDown={() => setOpen(false)}
        >
          <div
            className="ml-auto h-full w-full max-w-[480px] overflow-y-auto border-l border-[#d9d8cf] bg-[#f7f5ef] px-6 pb-10 pt-[96px] sm:px-10"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-end justify-between border-b border-[#d9d8cf] pb-5">
              <div>
                <p className="kc-classic-kicker">KCMSC</p>

                <h2 className="mt-2 font-heading text-4xl font-normal tracking-[-.03em] text-[#124c36]">
                  {text("Explore", "আরও দেখুন")}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full border border-[#d9d8cf] text-[#59615b]"
              >
                ×
              </button>
            </div>

            <div className="mt-7">
              <p className="kc-classic-kicker">
                {text("More from KCMSC", "KCMSC সম্পর্কে আরও")}
              </p>

              <div className="mt-3 divide-y divide-[#d9d8cf] border-y border-[#d9d8cf]">
                {allItems.map((item, index) => (
                  <Link
                    key={item.href}
                    href={`/${locale}/${item.href}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-4 text-[15px] text-[#343a35] transition hover:pl-1 hover:text-[#176b45]"
                  >
                    <span>
                      <span className="mr-3 text-[10px] text-[#b59a4a]">
                        0{index + 1}
                      </span>
                      {item.label}
                    </span>

                    <span aria-hidden="true" className="text-[#8a918b]">
                      ↗
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-[#d9d8cf] bg-[#fffdf8] p-5">
              <p className="text-sm leading-6 text-[#69716b]">
                {text(
                  "Find admission information, school notices and contact details in one place.",
                  "ভর্তি, নোটিশ ও যোগাযোগের তথ্য এক জায়গায় দেখুন।",
                )}
              </p>

              <Link
                href={`/${locale}/admissions`}
                onClick={() => setOpen(false)}
                className="kc-classic-link mt-5"
              >
                {locale === "bn" ? "ভর্তি তথ্য" : "Admission information"}
                <span>↗</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
