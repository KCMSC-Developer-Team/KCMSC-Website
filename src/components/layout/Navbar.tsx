"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getDictionary } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { LanguageSwitcher } from "./LanguageSwitcher";

type MenuLink = { href: string; label: string; description?: string };
type MenuGroup = {
  id: string;
  href: string;
  label: string;
  eyebrow: string;
  description: string;
  links: MenuLink[];
};

export function Navbar({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const text = (en: string, bn: string) => (locale === "bn" ? bn : en);

  const groups: MenuGroup[] = [
    {
      id: "about",
      href: "about",
      label: text("About", "পরিচিতি"),
      eyebrow: text("Discover KCMSC", "KCMSC-কে জানুন"),
      description: text(
        "The people, principles and story behind our school community.",
        "আমাদের বিদ্যালয় পরিবারের মানুষ, আদর্শ ও পথচলার গল্প।",
      ),
      links: [
        {
          href: "about",
          label: text("Our Story", "আমাদের গল্প"),
          description: text(
            "Who we are and what we stand for.",
            "আমরা কারা, আমাদের লক্ষ্য কী।",
          ),
        },
        {
          href: "leadership-messages",
          label: text("Leadership Messages", "নেতৃত্বের বার্তা"),
          description: text(
            "Messages from the people guiding KCMSC.",
            "KCMSC-এর নেতৃত্বের বার্তা।",
          ),
        },
        {
          href: "facilities",
          label: text("Campus & Facilities", "ক্যাম্পাস ও সুবিধা"),
          description: text(
            "Explore the spaces where learning happens.",
            "শেখার উপযোগী স্থান ও সুযোগ-সুবিধা।",
          ),
        },
      ],
    },
    {
      id: "academics",
      href: "academics",
      label: text("Academics", "একাডেমিক"),
      eyebrow: text("Learning with purpose", "উদ্দেশ্যপূর্ণ শিক্ষা"),
      description: text(
        "Explore learning programmes and the academic achievements of our students.",
        "শিক্ষা কার্যক্রম ও শিক্ষার্থীদের একাডেমিক সাফল্য সম্পর্কে জানুন।",
      ),
      links: [
        {
          href: "academics",
          label: text("Academic Programmes", "একাডেমিক কার্যক্রম"),
          description: text(
            "Classes, subjects and our learning approach.",
            "শ্রেণি, বিষয় ও শিক্ষার পদ্ধতি।",
          ),
        },
        {
          href: "achievements",
          label: text("Results & Achievements", "ফলাফল ও অর্জন"),
          description: text(
            "Academic results and student accomplishments.",
            "একাডেমিক ফলাফল ও শিক্ষার্থীদের সাফল্য।",
          ),
        },
      ],
    },
    {
      id: "student-life",
      href: "student-life",
      label: text("Student Life", "শিক্ষাজীবন"),
      eyebrow: text("Beyond the classroom", "শ্রেণিকক্ষের বাইরেও"),
      description: text(
        "Discover the experiences, interests and spaces that bring campus to life.",
        "শিক্ষার্থীদের অভিজ্ঞতা, আগ্রহ ও ক্যাম্পাস জীবনের নানা দিক।",
      ),
      links: [
        {
          href: "student-life",
          label: text("Life at KCMSC", "KCMSC-এ শিক্ষাজীবন"),
          description: text(
            "Student experiences and campus activities.",
            "শিক্ষার্থীদের অভিজ্ঞতা ও ক্যাম্পাস কার্যক্রম।",
          ),
        },
        {
          href: "clubs",
          label: text("Clubs & Activities", "ক্লাব ও কার্যক্রম"),
          description: text(
            "Find your interests and get involved.",
            "নিজের আগ্রহ খুঁজে নাও, অংশ নাও।",
          ),
        },
        {
          href: "facilities",
          label: text("Campus & Facilities", "ক্যাম্পাস ও সুবিধা"),
          description: text(
            "Explore the spaces where learning happens.",
            "শেখার উপযোগী স্থান ও সুযোগ-সুবিধা।",
          ),
        },
      ],
    },
    {
      id: "alumni",
      href: "alumni",
      label: text("Alumni", "প্রাক্তন শিক্ষার্থী"),
      eyebrow: text("A community for life", "আজীবনের বন্ধন"),
      description: text(
        "Stay connected with the people and memories that make KCMSC a lifelong community.",
        "KCMSC-এর মানুষ ও স্মৃতির সঙ্গে আজীবন যুক্ত থাকুন।",
      ),
      links: [
        {
          href: "alumni",
          label: text("Alumni Network", "প্রাক্তন শিক্ষার্থী নেটওয়ার্ক"),
          description: text(
            "Stories and connections beyond school.",
            "বিদ্যালয়ের পরেও চলতে থাকা সম্পর্ক ও গল্প।",
          ),
        },
      ],
    },
    {
      id: "news-resources",
      href: "notices",
      label: text("News & Resources", "খবর ও রিসোর্স"),
      eyebrow: text("Stay informed", "সঙ্গে থাকুন"),
      description: text(
        "Find official updates, helpful information and ways to contact the school.",
        "প্রাতিষ্ঠানিক ঘোষণা, প্রয়োজনীয় তথ্য ও যোগাযোগের মাধ্যম খুঁজুন।",
      ),
      links: [
        {
          href: "notices",
          label: text("Latest Notices", "সাম্প্রতিক নোটিশ"),
          description: text(
            "Announcements, updates and important dates.",
            "ঘোষণা, আপডেট ও গুরুত্বপূর্ণ তারিখ।",
          ),
        },
        {
          href: "help",
          label: text("Help Center / FAQs", "সহায়তা কেন্দ্র / সাধারণ প্রশ্ন"),
          description: text(
            "Answers to common questions about KCMSC.",
            "KCMSC সম্পর্কে সাধারণ প্রশ্নের উত্তর।",
          ),
        },
        {
          href: "contact",
          label: text("Contact the School", "যোগাযোগ করুন"),
          description: text(
            "Addresses and ways to get in touch.",
            "ঠিকানা ও যোগাযোগের মাধ্যম।",
          ),
        },
      ],
    },
    {
      id: "careers",
      href: "careers",
      label: text("Careers", "ক্যারিয়ার"),
      eyebrow: text("Work with KCMSC", "KCMSC-এর সঙ্গে কাজ করুন"),
      description: text(
        "Explore current opportunities to contribute to our school community.",
        "আমাদের শিক্ষাপরিবারে কাজ করার বর্তমান সুযোগগুলো দেখুন।",
      ),
      links: [
        {
          href: "careers",
          label: text("Careers & Job Circulars", "ক্যারিয়ার ও নিয়োগ বিজ্ঞপ্তি"),
          description: text(
            "View vacancies and apply online when applications are open.",
            "শূন্যপদ দেখুন এবং আবেদন চালু থাকলে অনলাইনে আবেদন করুন।",
          ),
        },
      ],
    },
  ];

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setActiveMenu(null);
      }
    };
    document.addEventListener("keydown", close);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", close);
      document.body.style.overflow = "";
    };
  }, [open]);

  const closeMobile = () => setOpen(false);

  return (
    <>
      <header
        className="kc-site-header sticky top-0 z-50 border-b border-[#d9d8cf] bg-[#fffdf8]/95 backdrop-blur"
        onMouseLeave={() => setActiveMenu(null)}
      >
        <div className="mx-auto flex h-[66px] max-w-[1280px] items-center px-4 sm:px-7 lg:h-[72px] lg:px-10">
          <Link
            href={`/${locale}`}
            className="flex shrink-0 items-center gap-3"
            onClick={() => {
              setOpen(false);
              setActiveMenu(null);
            }}
          >
            <span className="relative flex h-11 w-10 shrink-0 items-center justify-center overflow-visible">
              <img
                src="/kcmsc/kcmsc-logo.png"
                alt="K C Model School & College logo"
                className="block h-full w-full object-contain"
              />
            </span>
            <span className="block whitespace-nowrap font-heading text-[16px] font-normal leading-none text-[#124c36] sm:text-[17px]">
              K C Model School & College
            </span>
          </Link>

          <nav
            className="ml-auto hidden h-full items-center gap-0 lg:flex"
            aria-label="Primary navigation"
            onFocus={() => {}}
          >
            {groups.map((group) => (
              <div
                key={group.id}
                className="kc-mega-trigger flex h-full items-center"
                onMouseEnter={() => setActiveMenu(group.id)}
              >
                <Link
                  href={`/${locale}/${group.href}`}
                  className={`kc-nav-link !rounded-none !px-[10px] 2xl:!px-3 ${activeMenu === group.id ? "is-active" : ""}`}
                  aria-haspopup="true"
                  aria-expanded={activeMenu === group.id}
                  onFocus={() => setActiveMenu(group.id)}
                >
                  {group.label}
                </Link>
              </div>
            ))}
          </nav>

          <div className="ml-3 flex shrink-0 items-center gap-2 sm:ml-4">
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

          {activeMenu && (
            <div
              className="kc-mega-panel"
              onMouseEnter={() => setActiveMenu(activeMenu)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              {groups
                .filter((group) => group.id === activeMenu)
                .map((group) => (
                  <div key={group.id} className="kc-mega-inner">
                    <div className="kc-mega-intro">
                      <p className="kc-mega-eyebrow">{group.eyebrow}</p>
                      <h2>{group.label}</h2>
                      <p className="kc-mega-description">{group.description}</p>
                      <Link
                        href={`/${locale}/${group.href}`}
                        className="kc-mega-all"
                        onClick={() => setActiveMenu(null)}
                      >
                        {text("Explore this section", "এই বিভাগটি দেখুন")}{" "}
                        <span aria-hidden="true">↗</span>
                      </Link>
                    </div>
                    <div
                      className="kc-mega-links"
                      aria-label={`${group.label} pages`}
                    >
                      {group.links.map((item, index) => (
                        <Link
                          key={`${group.id}-${item.href}-${index}`}
                          href={`/${locale}/${item.href}`}
                          className="kc-mega-link"
                          onClick={() => setActiveMenu(null)}
                        >
                          <span className="kc-mega-number">0{index + 1}</span>
                          <span className="kc-mega-link-copy">
                            <strong>{item.label}</strong>
                            {item.description && (
                              <small>{item.description}</small>
                            )}
                          </span>
                          <span className="kc-mega-arrow" aria-hidden="true">
                            ↗
                          </span>
                        </Link>
                      ))}
                    </div>
                    <Link
                      href={`/${locale}/admissions`}
                      className="kc-mega-feature"
                      onClick={() => setActiveMenu(null)}
                    >
                      <img
                        src="/kcmsc/hero/kcmsc-building.jpg"
                        alt="K C Model School & College campus"
                      />
                      <span className="kc-mega-feature-shade" />
                      <span className="kc-mega-feature-copy">
                        <small>
                          {text("YOUR NEXT CHAPTER", "তোমার পরবর্তী অধ্যায়")}
                        </small>
                        <strong>
                          {text(
                            "A place to learn, grow and belong.",
                            "শেখা, বেড়ে ওঠা ও আপন হওয়ার জায়গা।",
                          )}
                        </strong>
                        <span>
                          {text("Admissions information", "ভর্তির তথ্য")} ↗
                        </span>
                      </span>
                    </Link>
                  </div>
                ))}
            </div>
          )}
        </div>
      </header>

      {open && (
        <div
          id="site-menu"
          className="fixed inset-0 z-40 bg-[#242824]/15 backdrop-blur-[2px] lg:hidden"
          onMouseDown={closeMobile}
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
                onClick={closeMobile}
                aria-label={text("Close menu", "মেনু বন্ধ করুন")}
                className="grid h-9 w-9 place-items-center rounded-full border border-[#d9d8cf] text-[#59615b]"
              >
                ×
              </button>
            </div>
            <div className="mt-7">
              <p className="kc-classic-kicker">
                {text("Explore KCMSC", "KCMSC ঘুরে দেখুন")}
              </p>
              <div className="mt-3 divide-y divide-[#d9d8cf] border-y border-[#d9d8cf]">
                {groups.map((group, index) => (
                  <div key={group.id} className="py-3">
                    <Link
                      href={`/${locale}/${group.href}`}
                      onClick={closeMobile}
                      className="flex items-center justify-between py-2 text-[15px] font-medium text-[#124c36]"
                    >
                      <span>
                        <span className="mr-3 text-[10px] text-[#b59a4a]">
                          0{index + 1}
                        </span>
                        {group.label}
                      </span>
                      <span aria-hidden="true">↗</span>
                    </Link>
                    <div className="ml-8 grid gap-1 pb-1">
                      {group.links
                        .filter(
                          (item, itemIndex, arr) =>
                            arr.findIndex((x) => x.href === item.href) ===
                              itemIndex && item.href !== group.href,
                        )
                        .map((item) => (
                          <Link
                            key={`${group.id}-${item.href}`}
                            href={`/${locale}/${item.href}`}
                            onClick={closeMobile}
                            className="py-2 text-sm text-[#646b64] hover:text-[#176b45]"
                          >
                            {item.label}
                          </Link>
                        ))}
                    </div>
                  </div>
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
                onClick={closeMobile}
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
