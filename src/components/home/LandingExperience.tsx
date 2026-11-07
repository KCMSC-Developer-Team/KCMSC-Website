import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { AlumniMessage } from "@prisma/client";
import { HeroSlideshow } from "./HeroSlideshow";
import { MissionVisionParallax } from "./MissionVisionParallax";
import { CountUp } from "@/components/motion/CountUp";
import { Bar, Ring } from "@/components/motion/Charts";

const copy = {
  en: {
    glance: "At a glance",
    students: "Students",
    range: "Range",
    versions: "Versions",
    hours: "School day",
    studentsValue: "2,336",
    rangeValue: "Play Group – XII",
    versionsValue: "Bangla + English",
    hoursValue: "Sun–Thu · 7:45–2:30",
    storyKicker: "THE SCHOOL",
    storyTitle:
      "A clear purpose, from the first classroom to higher secondary.",
    storyBody:
      "Founded in 2014 and opened on 1 January 2015, K C Model School & College was established to help students develop their academic ability alongside discipline, values and responsibility.",
    storyLink: "Our story",
    focusKicker: "EXPLORE",
    focusTitle: "Three parts of school life, one shared direction.",
    academics: "Academics",
    academicsBody:
      "Junior and Senior Wings follow the Bangla and English Versions of the National Curriculum from the early years through Grade XII.",
    life: "Student life",
    lifeBody:
      "Culture, reading, sport, trips and school events give students ways to learn and participate beyond regular lessons.",
    campus: "Campus",
    campusBody:
      "Libraries, science and computer labs, sports spaces and rooftop gardens support learning throughout the school day.",
    academicsLink: "Explore academics",
    lifeLink: "See student life",
    campusLink: "View facilities",
    missionKicker: "MISSION",
    mission:
      "To help students discover and develop their physical, mental and spiritual potential while growing into responsible global citizens.",
    vision:
      "To nurture capable, responsible global citizens equipped to excel in the 21st century.",
    resultsKicker: "ACADEMIC RESULTS",
    resultsTitle: "Recent results, without the clutter.",
    resultsBody: "The 2024 board-examination results are summarised below.",
    ssc: "SSC 2024",
    hsc: "HSC 2024",
    candidates: "candidates",
    passed: "passed",
    gpa5: "GPA 5",
    resultsLink: "Results & achievements",
    admissionKicker: "ADMISSIONS",
    admissionTitle: "Information for families starts here.",
    admissionBody:
      "Find admission information, notices and contact details in one place.",
    admissionLink: "Admissions",
    contactLink: "Contact",
    alumniKicker: "ALUMNI",
    alumniTitle: "A few words from former students.",
    alumniLink: "Meet our alumni",
  },
  bn: {
    glance: "এক নজরে",
    students: "শিক্ষার্থী",
    range: "শিক্ষার পরিসর",
    versions: "ভার্সন",
    hours: "স্কুলের সময়",
    studentsValue: "২,৩৩৬",
    rangeValue: "প্লে গ্রুপ – দ্বাদশ",
    versionsValue: "বাংলা + ইংরেজি",
    hoursValue: "রবি–বৃহস্পতি · ৭:৪৫–২:৩০",
    storyKicker: "স্কুল",
    storyTitle:
      "প্রথম শ্রেণিকক্ষ থেকে উচ্চমাধ্যমিক পর্যন্ত একটি স্পষ্ট শিক্ষাপথ।",
    storyBody:
      "২০১৪ সালে প্রতিষ্ঠিত এবং ১ জানুয়ারি ২০১৫-তে যাত্রা শুরু করা K C Model School & College একাডেমিক শিক্ষার পাশাপাশি শৃঙ্খলা, মূল্যবোধ ও দায়িত্ববোধ গড়ে তোলার লক্ষ্য নিয়ে এগিয়ে চলে।",
    storyLink: "আমাদের গল্প",
    focusKicker: "দেখুন",
    focusTitle: "স্কুলজীবনের তিনটি দিক, একটি অভিন্ন লক্ষ্য।",
    academics: "একাডেমিক",
    academicsBody:
      "জুনিয়র ও সিনিয়র উইং বাংলা ও ইংরেজি ভার্সনে প্রাথমিক পর্যায় থেকে দ্বাদশ শ্রেণি পর্যন্ত জাতীয় শিক্ষাক্রম অনুসরণ করে।",
    life: "শিক্ষাজীবন",
    lifeBody:
      "সংস্কৃতি, বই পড়া, খেলাধুলা, শিক্ষা সফর ও বিভিন্ন আয়োজনে নিয়মিত ক্লাসের বাইরেও শেখার সুযোগ থাকে।",
    campus: "ক্যাম্পাস",
    campusBody:
      "লাইব্রেরি, বিজ্ঞান ও কম্পিউটার ল্যাব, খেলাধুলার স্থান এবং ছাদবাগান দৈনন্দিন শিক্ষাকে সহায়তা করে।",
    academicsLink: "একাডেমিক দেখুন",
    lifeLink: "শিক্ষাজীবন দেখুন",
    campusLink: "সুবিধা দেখুন",
    missionKicker: "লক্ষ্য",
    mission:
      "শিক্ষার্থীদের শারীরিক, মানসিক ও আধ্যাত্মিক সম্ভাবনা বিকশিত করে দায়িত্বশীল বিশ্বনাগরিক হিসেবে গড়ে তোলা।",
    vision: "২১শ শতকে উৎকর্ষের জন্য সক্ষম ও দায়িত্বশীল বিশ্বনাগরিক গড়ে তোলা।",
    resultsKicker: "একাডেমিক ফলাফল",
    resultsTitle: "ফলাফল, অপ্রয়োজনীয় জটিলতা ছাড়া।",
    resultsBody: "২০২৪ সালের বোর্ড পরীক্ষার ফলাফল সংক্ষেপে নিচে দেখানো হয়েছে।",
    ssc: "SSC ২০২৪",
    hsc: "HSC ২০২৪",
    candidates: "পরীক্ষার্থী",
    passed: "উত্তীর্ণ",
    gpa5: "GPA 5",
    resultsLink: "ফলাফল ও অর্জন",
    admissionKicker: "ভর্তি",
    admissionTitle: "পরিবারের জন্য প্রয়োজনীয় তথ্য এক জায়গায়।",
    admissionBody: "ভর্তি, নোটিশ ও যোগাযোগের তথ্য সহজে খুঁজে নিন।",
    admissionLink: "ভর্তি",
    contactLink: "যোগাযোগ",
    alumniKicker: "প্রাক্তন শিক্ষার্থী",
    alumniTitle: "প্রাক্তন শিক্ষার্থীদের কিছু কথা।",
    alumniLink: "প্রাক্তন শিক্ষার্থীদের দেখুন",
  },
} as const;

const images = {
  story: "/kcmsc/media/IMG-20260113-WA0005.jpg",
  academics: "/kcmsc/media/teacher_taking_class.jpg",
  life: "/kcmsc/facilities/students_at_library.jpg",
  campus: "/kcmsc/kc/kcmsc1.jpg",
} as const;

export function LandingExperience({
  locale,
  alumni = [],
}: {
  locale: Locale;
  alumni?: AlumniMessage[];
}) {
  const t = copy[locale];

  const stats = [
    [t.students, t.studentsValue],
    [t.range, t.rangeValue],
    [t.versions, t.versionsValue],
    [t.hours, t.hoursValue],
  ];

  const focus = [
    {
      title: t.academics,
      body: t.academicsBody,
      image: images.academics,
      href: "academics",
      link: t.academicsLink,
    },
    {
      title: t.life,
      body: t.lifeBody,
      image: images.life,
      href: "student-life",
      link: t.lifeLink,
    },
    {
      title: t.campus,
      body: t.campusBody,
      image: images.campus,
      href: "facilities",
      link: t.campusLink,
    },
  ];

  return (
    <div className="kc-homepage bg-[#f7f5ef] text-[#242824]">
      <HeroSlideshow locale={locale} />

      <section className="relative z-10 -mt-6 px-4 sm:-mt-10 sm:px-8">
        <div className="kc-panel kc-enter mx-auto grid w-full max-w-[1180px] grid-cols-2 overflow-hidden rounded-3xl lg:grid-cols-4" style={{ ["--kc-d" as string]: "250ms" }}>
          {stats.map(([label, value], index) => (
            <div
              key={label}
              className={`min-w-0 px-5 py-6 sm:px-7 lg:px-8 lg:py-8 ${index % 2 ? "border-l border-[#e4e2da]" : ""} ${index > 1 ? "border-t border-[#e4e2da]" : ""} lg:border-t-0 ${index ? "lg:border-l" : "lg:border-l-0"}`}
            >
              <p className="text-xs uppercase tracking-[.12em] text-[#69716b]">
                {label}
              </p>
              <p className="mt-2 break-words font-heading text-xl font-normal leading-snug text-[#176b45] sm:text-2xl">
                {index === 0 && value ? (
                  <CountUp text={value} duration={1800} className="kc-home-stat-value" />
                ) : (
                  <span className="kc-home-stat-value">{value}</span>
                )}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="kc-classic-section bg-[#f7f5ef]">
        <div className="mx-auto grid max-w-[1180px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-[.85fr_1.15fr] lg:gap-20 lg:px-10">
          <div>
            <p className="kc-classic-kicker">{t.storyKicker}</p>
            <h2 className="kc-classic-title mt-4">{t.storyTitle}</h2>
            <p className="mt-6 max-w-lg text-base leading-8 text-[#58645c]">
              {t.storyBody}
            </p>
            <Link href={`/${locale}/about`} className="kc-classic-link mt-7">
              {t.storyLink}
              <span>↗</span>
            </Link>
          </div>
          <div className="relative aspect-[5/3] overflow-hidden rounded-3xl bg-[#e5e2d8] shadow-lift">
            <Image
              src={images.story}
              alt="KCMSC students and staff on campus"
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-[#d9d8cf] bg-[#fffdf8]">
        <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="kc-classic-kicker">{t.focusKicker}</p>
              <h2 className="mt-3 font-heading text-[clamp(2.25rem,4.5vw,4rem)] font-normal leading-[1] tracking-[-.035em] text-[#124c36]">
                {t.focusTitle}
              </h2>
            </div>
            <span className="text-xs uppercase tracking-[.12em] text-[#7b817b]">
              01 — 03
            </span>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {focus.map((item, index) => (
              <Link
                key={item.title}
                href={`/${locale}/${item.href}`}
                className="kc-panel kc-lift group flex flex-col overflow-hidden"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#e7e4da]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-[#fffdf8]/90 px-3 py-1 text-xs font-semibold tracking-[.12em] text-[#8a7740] backdrop-blur">
                    0{index + 1}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <h3 className="font-heading text-3xl font-normal text-[#176b45]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-7 text-[#58645c]">
                    {item.body}
                  </p>
                  <span className="mt-auto flex items-center gap-2 pt-6 text-sm font-semibold text-[#176b45] transition-all group-hover:gap-3">
                    {item.link}
                    <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-full bg-[#e3f2e9] transition-colors group-hover:bg-[#176b45] group-hover:text-white">↗</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <MissionVisionParallax>
        <div className="relative z-10 mx-auto grid max-w-[1180px] gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-20 lg:px-10 lg:py-28">
          <div className="kc-mission-vision-panel">
            <p className="kc-classic-kicker">{t.missionKicker}</p>
            <p className="mt-5 max-w-xl font-heading text-[clamp(2rem,3.6vw,3.5rem)] font-normal leading-[1.03] tracking-[-.03em] text-[#124c36]">
              {t.mission}
            </p>
          </div>
          <div className="kc-mission-vision-panel">
            <p className="kc-classic-kicker">
              {locale === "bn" ? "দৃষ্টিভঙ্গি" : "Vision"}
            </p>
            <p className="mt-5 max-w-xl font-heading text-[clamp(2rem,3.6vw,3.5rem)] font-normal leading-[1.03] tracking-[-.03em] text-[#124c36]">
              {t.vision}
            </p>
          </div>
        </div>
      </MissionVisionParallax>

      <section className="kc-classic-section bg-[#f7f5ef]">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-xl">
              <p className="kc-classic-kicker">{t.resultsKicker}</p>
              <h2 className="kc-classic-title mt-3">{t.resultsTitle}</h2>
              <p className="mt-5 text-[15px] leading-7 text-[#69716b]">
                {t.resultsBody}
              </p>
            </div>
            <Link href={`/${locale}/academics`} className="kc-classic-link">
              {t.resultsLink}
              <span>↗</span>
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              { label: t.ssc, pct: 98.48, text: "98.48%", total: 130, passed: 128, gpa: 67 },
              { label: t.hsc, pct: 100, text: "100%", total: 47, passed: 47, gpa: 13 },
            ].map((row) => (
              <div key={row.label} className="kc-panel kc-lift flex flex-col items-start gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
                <Ring value={row.pct} max={100} size={132} stroke={11} label={`${row.label}: ${row.text} pass rate`}>
                  <span className="font-heading text-[28px] leading-none text-[#176b45]">
                    <CountUp text={row.text} duration={1800} />
                  </span>
                </Ring>
                <div className="w-full min-w-0">
                  <p className="text-xs uppercase tracking-[.12em] text-[#69716b]">{row.label}</p>
                  <div className="mt-4 space-y-4">
                    <div>
                      <div className="flex items-baseline justify-between text-sm text-[#58645c]">
                        <span>{t.passed}</span>
                        <span className="font-heading text-xl text-[#124c36]">
                          <CountUp text={row.passed} /> <span className="text-sm text-[#7b817b]">/ {row.total} {t.candidates}</span>
                        </span>
                      </div>
                      <Bar value={row.passed} max={row.total} className="mt-1.5 h-2" />
                    </div>
                    <div>
                      <div className="flex items-baseline justify-between text-sm text-[#58645c]">
                        <span>{t.gpa5}</span>
                        <span className="font-heading text-xl text-[#124c36]">
                          <CountUp text={row.gpa} />
                        </span>
                      </div>
                      <Bar value={row.gpa} max={row.total} delay={120} className="mt-1.5 h-2" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {alumni.length > 0 && (
        <section className="border-t border-[#d9d8cf] bg-[#fffdf8]">
          <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8 lg:px-10 lg:py-16">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div className="max-w-2xl">
                <p className="kc-classic-kicker">{t.alumniKicker}</p>
                <h2 className="mt-3 font-heading text-[clamp(2.1rem,4vw,3.7rem)] font-normal leading-[1] tracking-[-.035em] text-[#124c36]">
                  {t.alumniTitle}
                </h2>
              </div>
              <Link href={`/${locale}/alumni`} className="kc-classic-link">
                {t.alumniLink}
                <span>↗</span>
              </Link>
            </div>
            <div className="mt-9 grid gap-5 md:grid-cols-3">
              {alumni.map((message) => {
                const name = locale === "bn" ? message.nameBn : message.nameEn;
                const quote =
                  locale === "bn"
                    ? message.previewBn || message.messageBn
                    : message.previewEn || message.messageEn;
                const role = locale === "bn" ? message.roleBn : message.roleEn;
                return (
                  <article key={message.id} className="kc-panel kc-lift p-6 sm:p-8">
                    <span className="font-heading text-4xl leading-none text-[#b59a4a]">
                      “
                    </span>
                    <p className="mt-1 font-heading text-xl leading-[1.4] text-[#124c36]">
                      {quote}
                    </p>
                    <div className="mt-6 border-t border-[#d9d8cf] pt-4">
                      <p className="font-heading text-lg text-[#176b45]">
                        {name}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-[#69716b]">
                        {[
                          role,
                          locale === "bn"
                            ? message.organizationBn
                            : message.organizationEn,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#f7f5ef] px-4 pb-16 pt-6 sm:px-8 sm:pb-24">
        <div className="kc-dash-hero mx-auto grid max-w-[1180px] gap-8 rounded-3xl px-6 py-12 shadow-lift sm:px-12 sm:py-16 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="kc-light-kicker">{t.admissionKicker}</p>
            <h2 className="mt-3 max-w-3xl font-heading text-[clamp(2.2rem,4vw,3.75rem)] font-normal leading-[1.02] tracking-[-.03em]">
              {t.admissionTitle}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-8 text-white/80">
              {t.admissionBody}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link
              href={`/${locale}/admissions`}
              className="kc-classic-button kc-classic-button-light"
            >
              {t.admissionLink}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="kc-classic-button kc-classic-button-ghost-light"
            >
              {t.contactLink}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
