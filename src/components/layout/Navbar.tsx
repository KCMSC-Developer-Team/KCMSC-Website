"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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

type PortalIconName = "admin" | "faculty" | "writer";

function PortalIcon({ name }: { name: PortalIconName }) {
  const common = {
    width: 14, height: 14, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: 1.8,
    strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };
  if (name === "admin") return <svg {...common}><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></svg>;
  if (name === "faculty") return <svg {...common}><path d="m22 10-10-5L2 10l10 5 10-5Z" /><path d="M6 12v5c3.5 3 8.5 3 12 0v-5" /><path d="M22 10v6" /></svg>;
  return <svg {...common}><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" /></svg>;
}

export function Navbar({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showTopbar, setShowTopbar] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const text = (en: string, bn: string) => (locale === "bn" ? bn : en);
  const currentRoute = pathname.split("/").slice(2).join("/");

  // Navigation is grouped by visitor intent. Careers is a dedicated top-level section, separate from About.
  const groups: MenuGroup[] = [
    {
      id: "about",
      href: "about",
      label: text("About", "পরিচিতি"),
      eyebrow: text("Get to know KCMSC", "KCMSC-কে জানুন"),
      description: text(
        "Learn about our story, people, values and the campus community.",
        "আমাদের ইতিহাস, মানুষ, মূল্যবোধ ও ক্যাম্পাস সম্পর্কে জানুন।",
      ),
      links: [
        {
          href: "about",
          label: text("Our Story", "আমাদের গল্প"),
          description: text(
            "Our background, mission and values.",
            "আমাদের পরিচয়, লক্ষ্য ও মূল্যবোধ।",
          ),
        },
        {
          href: "why-kcmsc",
          label: text("Why Choose KCMSC", "কেন KCMSC"),
          description: text(
            "What makes the KCMSC learning experience distinctive.",
            "KCMSC-এর শিক্ষার অভিজ্ঞতার বিশেষ দিকগুলো।",
          ),
        },
        {
          href: "leadership-messages",
          label: text("Leadership Messages", "নেতৃত্বের বার্তা"),
          description: text(
            "Perspectives from the people guiding the school.",
            "বিদ্যালয়ের নেতৃত্বের বার্তা।",
          ),
        },
        {
          href: "teachers",
          label: text("Teachers & Staff", "শিক্ষক ও কর্মচারী"),
          description: text(
            "Meet the people who support our students.",
            "শিক্ষার্থীদের পাশে থাকা মানুষদের জানুন।",
          ),
        },
      ],
    },
    {
      id: "academics",
      href: "academics",
      label: text("Academics", "একাডেমিক"),
      eyebrow: text("Learning and achievement", "শিক্ষা ও সাফল্য"),
      description: text(
        "Find learning programmes, schedules, academic updates and student achievements.",
        "শিক্ষা কার্যক্রম, সময়সূচি, একাডেমিক আপডেট ও শিক্ষার্থীদের সাফল্য দেখুন।",
      ),
      links: [
        {
          href: "academics",
          label: text("Academic Programmes", "একাডেমিক কার্যক্রম"),
          description: text(
            "Explore classes, subjects and learning programmes.",
            "শ্রেণি, বিষয় ও শিক্ষা কার্যক্রম সম্পর্কে জানুন।",
          ),
        },
        {
          href: "class-routine",
          label: text("Class Routine", "ক্লাস রুটিন"),
          description: text(
            "Check class schedules and routine updates.",
            "ক্লাসের সময়সূচি ও রুটিনের আপডেট দেখুন।",
          ),
        },
        {
          href: "calendar",
          label: text("Academic Calendar", "একাডেমিক ক্যালেন্ডার"),
          description: text(
            "Keep track of important academic dates.",
            "গুরুত্বপূর্ণ একাডেমিক তারিখ জেনে রাখুন।",
          ),
        },
        {
          href: "achievements",
          label: text("Results & Achievements", "ফলাফল ও অর্জন"),
          description: text(
            "Celebrate academic results and student accomplishments.",
            "একাডেমিক ফলাফল ও শিক্ষার্থীদের অর্জন।",
          ),
        },
        {
          href: "scholarships",
          label: text("Scholarships", "বৃত্তি"),
          description: text(
            "Find scholarship information and announcements.",
            "বৃত্তির তথ্য ও ঘোষণা দেখুন।",
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
        "Explore the activities, spaces and experiences that make up life at KCMSC.",
        "KCMSC-এর কার্যক্রম, ক্যাম্পাস ও শিক্ষার্থীদের অভিজ্ঞতা ঘুরে দেখুন।",
      ),
      links: [
        {
          href: "student-life",
          label: text("Life at KCMSC", "KCMSC-এ শিক্ষাজীবন"),
          description: text(
            "Discover student experiences and campus life.",
            "শিক্ষার্থীদের অভিজ্ঞতা ও ক্যাম্পাস জীবন।",
          ),
        },
        {
          href: "clubs",
          label: text("Clubs & Activities", "ক্লাব ও কার্যক্রম"),
          description: text(
            "Explore interests, clubs and extracurricular activities.",
            "ক্লাব, আগ্রহ ও সহশিক্ষা কার্যক্রম।",
          ),
        },
        {
          href: "facilities",
          label: text("Campus & Facilities", "ক্যাম্পাস ও সুবিধা"),
          description: text(
            "Explore the spaces and facilities around the school.",
            "বিদ্যালয়ের ক্যাম্পাস ও সুযোগ-সুবিধা।",
          ),
        },
        {
          href: "events",
          label: text("Events & Celebrations", "অনুষ্ঠান ও উদ্‌যাপন"),
          description: text(
            "Browse upcoming events and highlights from past school activities.",
            "আসন্ন অনুষ্ঠান ও স্কুলের সাম্প্রতিক কার্যক্রমের ঝলক দেখুন।",
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
        "Stay connected with the stories and community of KCMSC alumni.",
        "KCMSC-এর প্রাক্তন শিক্ষার্থীদের গল্প ও সম্প্রদায়ের সঙ্গে যুক্ত থাকুন।",
      ),
      links: [
        {
          href: "alumni",
          label: text(
            "Alumni Stories & Network",
            "প্রাক্তন শিক্ষার্থীদের গল্প ও নেটওয়ার্ক",
          ),
          description: text(
            "Read alumni messages and stay connected with the school.",
            "প্রাক্তন শিক্ষার্থীদের বার্তা পড়ুন এবং বিদ্যালয়ের সঙ্গে যুক্ত থাকুন।",
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
        "Explore job circulars and opportunities to contribute to our school community.",
        "নিয়োগ বিজ্ঞপ্তি ও আমাদের শিক্ষাপ্রতিষ্ঠানে কাজের সুযোগ দেখুন।",
      ),
      links: [
        {
          href: "careers",
          label: text(
            "Job Circulars & Open Positions",
            "নিয়োগ বিজ্ঞপ্তি ও শূন্য পদ",
          ),
          description: text(
            "View current vacancies and application information.",
            "বর্তমান শূন্য পদ ও আবেদনের তথ্য দেখুন।",
          ),
        },
      ],
    },
    {
      id: "news-resources",
      href: "notices",
      label: text("News & Resources", "খবর ও রিসোর্স"),
      eyebrow: text(
        "Updates, ideas and useful information",
        "আপডেট, ভাবনা ও প্রয়োজনীয় তথ্য",
      ),
      description: text(
        "Stay informed with official notices, articles and practical school resources.",
        "প্রাতিষ্ঠানিক নোটিশ, লেখা ও প্রয়োজনীয় স্কুল রিসোর্সের সঙ্গে আপডেট থাকুন।",
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
          href: "blog",
          label: text("KCMSC Blog", "KCMSC ব্লগ"),
          description: text(
            "Articles, ideas and perspectives from students and teachers.",
            "শিক্ষার্থী ও শিক্ষকদের লেখা, ভাবনা ও অভিজ্ঞতা।",
          ),
        },
        {
          href: "downloads",
          label: text("Downloads & Resources", "ডাউনলোড ও রিসোর্স"),
          description: text(
            "Find useful forms and school documents.",
            "প্রয়োজনীয় ফর্ম ও স্কুলের নথি খুঁজুন।",
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
            "Find contact details and ways to reach the school.",
            "যোগাযোগের তথ্য ও বিদ্যালয়ে পৌঁছানোর উপায়।",
          ),
        },
      ],
    },
  ];

  useEffect(() => {
    const updateScrollControls = () => {
      setShowTopbar(window.scrollY <= 8);
      setShowBackToTop(window.scrollY > 320);
    };
    updateScrollControls();
    window.addEventListener("scroll", updateScrollControls, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollControls);
  }, []);

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
        <div
          className={`kc-topbar overflow-hidden bg-[#176b45] text-white transition-[max-height,opacity,transform] duration-300 ease-in-out ${
            showTopbar
              ? "max-h-[100px] translate-y-0 opacity-100"
              : "max-h-0 -translate-y-full opacity-0"
          }`}
          aria-hidden={!showTopbar}
        >
          <div className="mx-auto flex min-h-[38px] w-full max-w-[1280px] flex-wrap items-center justify-between gap-x-5 gap-y-1 px-3 py-2 text-[12px] leading-4 sm:px-6 sm:text-[12px] lg:px-10">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-white/90">
              <span><strong className="font-semibold text-white">EIIN</strong> 137368</span>
              <span><strong className="font-semibold text-white">School Code</strong> 1417</span>
              <span><strong className="font-semibold text-white">College Code</strong> 1290</span>
            </div>
            <nav aria-label={text("Portal logins", "পোর্টাল লগইন")} className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <Link href="/admin/login" tabIndex={showTopbar ? 0 : -1} className="inline-flex items-center gap-1.5 font-semibold text-white transition hover:text-[#e5d8a7]">
                <PortalIcon name="admin" />
                {text("Admin Portal Login", "অ্যাডমিন পোর্টাল লগইন")}
              </Link>
              <Link href="/teacher/login" tabIndex={showTopbar ? 0 : -1} className="inline-flex items-center gap-1.5 font-semibold text-white transition hover:text-[#e5d8a7]">
                <PortalIcon name="faculty" />
                {text("Faculty Member Login", "শিক্ষক লগইন")}
              </Link>
              <Link href="/blogger/login" tabIndex={showTopbar ? 0 : -1} className="inline-flex items-center gap-1.5 font-semibold text-white transition hover:text-[#e5d8a7]">
                <PortalIcon name="writer" />
                {text("Writer Login", "লেখক লগইন")}
              </Link>
            </nav>
          </div>
        </div>
        <div className="kc-navbar-inner mx-auto flex h-[66px] w-full max-w-[1280px] items-center px-3 sm:px-6 lg:h-[72px] lg:px-10">
          <Link
            href={`/${locale}`}
            className="kc-navbar-brand flex min-w-0 shrink items-center gap-2 sm:gap-3"
            onClick={() => {
              setOpen(false);
              setActiveMenu(null);
            }}
          >
            <span className="relative flex h-10 w-9 shrink-0 items-center justify-center overflow-visible sm:h-11 sm:w-10">
              <img
                src="/kcmsc/kcmsc-logo.png"
                alt="K C Model School & College logo"
                className="block h-full w-full object-contain"
              />
            </span>
            <span className="kc-navbar-title block min-w-0 font-heading text-[15px] font-normal leading-tight text-[#124c36] sm:whitespace-nowrap sm:text-[17px]">
              K C Model School & College
            </span>
          </Link>

          <nav
            className="ml-auto hidden h-full items-center gap-0 lg:flex"
            aria-label="Primary navigation"
          >
            {groups.map((group) => {
              // Alumni and Careers are direct links, not mega-menu triggers.
              const hasMegaMenu =
                group.id !== "alumni" && group.id !== "careers";

              return (
                <div
                  key={group.id}
                  className="kc-mega-trigger flex h-full items-center"
                  onMouseEnter={() =>
                    setActiveMenu(hasMegaMenu ? group.id : null)
                  }
                >
                  <Link
                    href={`/${locale}/${group.href}`}
                    className={`kc-nav-link !rounded-none !px-[10px] 2xl:!px-3 ${activeMenu === group.id || (group.id === "student-life" && currentRoute === "events") ? "is-active" : ""}`}
                    aria-haspopup={hasMegaMenu ? "true" : undefined}
                    aria-expanded={
                      hasMegaMenu ? activeMenu === group.id : undefined
                    }
                    onFocus={() => setActiveMenu(hasMegaMenu ? group.id : null)}
                    aria-current={
                      group.id === "student-life" && currentRoute === "events"
                        ? "location"
                        : undefined
                    }
                  >
                    {group.label}
                  </Link>
                </div>
              );
            })}
          </nav>

          <div className="kc-navbar-actions ml-auto flex shrink-0 items-center gap-1.5 sm:ml-4 sm:gap-2">
            <LanguageSwitcher current={locale} />
            <button
              type="button"
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((value) => !value)}
              className="kc-navbar-menu rounded-full border border-[#d9d8cf] px-3 py-2 text-[12px] font-medium uppercase tracking-[.08em] text-[#3f4741] transition hover:border-[#176b45] hover:text-[#176b45] lg:hidden sm:px-4"
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
                          aria-current={
                            currentRoute === item.href ? "page" : undefined
                          }
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
                        src={
                          group.id === "academics"
                            ? "/kcmsc/facilities/chemistry-lab.png"
                            : group.id === "student-life"
                              ? "/kcmsc/student-life/class-party.jpg"
                              : "/kcmsc/hero/kcmsc-building.jpg"
                        }
                        alt={
                          group.id === "academics"
                            ? text(
                                "KCMSC chemistry laboratory",
                                "KCMSC-এর রসায়ন ল্যাবরেটরি",
                              )
                            : group.id === "student-life"
                              ? text(
                                  "KCMSC students celebrating a class party",
                                  "KCMSC শিক্ষার্থীদের ক্লাস পার্টি",
                                )
                              : text(
                                  "K C Model School & College campus",
                                  "কে সি মডেল স্কুল অ্যান্ড কলেজ ক্যাম্পাস",
                                )
                        }
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
                      className="flex items-center justify-between py-2 text-[16px] font-medium text-[#124c36]"
                    >
                      <span>
                        <span className="mr-3 text-[12px] text-[#b59a4a]">
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
                              itemIndex &&
                            (item.href !== group.href ||
                              group.id === "student-life"),
                        )
                        .map((item) => (
                          <Link
                            key={`${group.id}-${item.href}`}
                            href={`/${locale}/${item.href}`}
                            onClick={closeMobile}
                            aria-current={
                              currentRoute === item.href ? "page" : undefined
                            }
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
            <div className="mt-5 rounded-xl border border-[#d9d8cf] bg-[#fffdf8] p-5">
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

      <button
        type="button"
        aria-label={text("Back to top", "উপরে ফিরে যান")}
        title={text("Back to top", "উপরে ফিরে যান")}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        tabIndex={showBackToTop ? 0 : -1}
        aria-hidden={!showBackToTop}
        className={`fixed bottom-6 right-6 z-[60] grid h-12 w-12 place-items-center rounded-full bg-[#176b45] text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#124c36] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8b878] focus-visible:ring-offset-2 sm:bottom-8 sm:right-8 ${
          showBackToTop
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-3 scale-90 opacity-0"
        }`}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m18 15-6-6-6 6" />
          <path d="M12 9v12" />
        </svg>
      </button>
    </>
  );
}
