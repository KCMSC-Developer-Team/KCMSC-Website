import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { AlumniMessage } from "@prisma/client";
import { HeroSlideshow } from "./HeroSlideshow";
import { FacultyShowcase, type FacultyCard } from "./FacultyShowcase";
import { ExploreTabs } from "./ExploreTabs";
import { Reveal } from "./Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { Bar, Ring } from "@/components/motion/Charts";

const copy = {
  en: {
    students: "Students",
    range: "Range",
    versions: "Versions",
    hours: "School day",
    studentsValue: "2,336",
    rangeValue: "Play Group – XII",
    versionsValue: "Bangla + English",
    hoursValue: "Sun–Thu · 7:45–2:30",
    glanceKicker: "At a glance",
    foundedLabel: "Founded",
    foundedValue: "2014",
    openedLabel: "Opened",
    openedValue: "1 January 2015",
    storyKicker: "THE SCHOOL",
    storyTitle: "A clear purpose, from the first classroom to higher secondary.",
    storyBody:
      "Founded in 2014 and opened on 1 January 2015, K C Model School & College was established to help students develop their academic ability alongside discipline, values and responsibility.",
    storyLink: "Our story",
    leadershipKicker: "LEADERSHIP",
    leadershipTitle: "Guided by experience. Driven by a belief in education.",
    leadershipBody: "A few words from the people shaping the values, direction and future of K C Model School & College.",
    readMessage: "Read the full message",
    allMessages: "All leadership messages",
    facultyKicker: "FACULTY",
    facultyTitle: "Meet the people behind learning.",
    facultyBody: "Get to know the educators who guide our students, share their expertise and bring learning to life.",
    facultyLink: "Faculty directory",
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
    admissionBody: "Find admission information, notices and contact details in one place.",
    admissionLink: "Admissions",
    contactLink: "Contact",
    alumniKicker: "ALUMNI",
    alumniTitle: "A few words from former students.",
    alumniLink: "Meet our alumni",
  },
  bn: {
    students: "শিক্ষার্থী",
    range: "শিক্ষার পরিসর",
    versions: "ভার্সন",
    hours: "স্কুলের সময়",
    studentsValue: "২,৩৩৬",
    rangeValue: "প্লে গ্রুপ – দ্বাদশ",
    versionsValue: "বাংলা + ইংরেজি",
    hoursValue: "রবি–বৃহস্পতি · ৭:৪৫–২:৩০",
    glanceKicker: "এক নজরে",
    foundedLabel: "প্রতিষ্ঠিত",
    foundedValue: "২০১৪",
    openedLabel: "যাত্রা শুরু",
    openedValue: "১ জানুয়ারি ২০১৫",
    storyKicker: "স্কুল",
    storyTitle: "প্রথম শ্রেণিকক্ষ থেকে উচ্চমাধ্যমিক পর্যন্ত একটি স্পষ্ট শিক্ষাপথ।",
    storyBody:
      "২০১৪ সালে প্রতিষ্ঠিত এবং ১ জানুয়ারি ২০১৫-তে যাত্রা শুরু করা K C Model School & College একাডেমিক শিক্ষার পাশাপাশি শৃঙ্খলা, মূল্যবোধ ও দায়িত্ববোধ গড়ে তোলার লক্ষ্য নিয়ে এগিয়ে চলে।",
    storyLink: "আমাদের গল্প",
    leadershipKicker: "নেতৃত্ব",
    leadershipTitle: "অভিজ্ঞতার দিকনির্দেশনা, শিক্ষার প্রতি অঙ্গীকার।",
    leadershipBody: "কে সি মডেল স্কুল অ্যান্ড কলেজের মূল্যবোধ, অগ্রযাত্রা ও ভবিষ্যৎ নির্মাণে যাঁরা ভূমিকা রাখছেন, তাঁদের কিছু কথা।",
    readMessage: "সম্পূর্ণ বার্তা পড়ুন",
    allMessages: "সব নেতৃত্বের বার্তা",
    facultyKicker: "শিক্ষকবৃন্দ",
    facultyTitle: "শিক্ষার পেছনের মানুষগুলো।",
    facultyBody: "আমাদের শিক্ষকবৃন্দের পরিচিতি ও বিষয়ভিত্তিক দক্ষতা খুঁজে দেখুন।",
    facultyLink: "শিক্ষকদের তালিকা",
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
  faculty = [],
}: {
  locale: Locale;
  alumni?: AlumniMessage[];
  faculty?: FacultyCard[];
}) {
  const t = copy[locale];

  // Glance cards: each card fills with its own colour on hover.
  const stats = [
    { label: t.students, value: t.studentsValue, hover: "hover:bg-[#2fbf7f] hover:border-[#2fbf7f]", hoverText: "group-hover:text-white" },
    { label: t.range, value: t.rangeValue, hover: "hover:bg-[#22a6b3] hover:border-[#22a6b3]", hoverText: "group-hover:text-white" },
    { label: t.versions, value: t.versionsValue, hover: "hover:bg-[#f2b134] hover:border-[#f2b134]", hoverText: "group-hover:text-[#10372a]" },
    { label: t.hours, value: t.hoursValue, hover: "hover:bg-[#ef6f5e] hover:border-[#ef6f5e]", hoverText: "group-hover:text-white" },
  ];

  const leaders = [
    {
      number: "01",
      name: "মোঃ খসরু চৌধুরী",
      role: locale === "bn" ? "চেয়ারম্যান" : "Chairman",
      image: "/kcmsc/leadership/chairman.jpg",
      excerpt:
        locale === "bn"
          ? "উন্নত ও আধুনিক শিক্ষার সুযোগ নিয়ে শিক্ষার্থীরা নিশ্চিত সাফল্য অর্জন করবে এবং বিশ্ব নাগরিক হিসেবে গড়ে উঠবে, এটাই আমার একান্ত চাওয়া।"
          : "My hope is that access to modern, forward-looking education will help students achieve success and grow into responsible global citizens.",
    },
    {
      number: "02",
      name: "নীপা চৌধুরী",
      role: locale === "bn" ? "ভাইস চেয়ারম্যান" : "Vice Chairman",
      image: "/kcmsc/leadership/vice-chairman.jpg",
      excerpt:
        locale === "bn"
          ? "শিক্ষা মানে শুধু পুঁথিগত বিদ্যা নয়; জ্ঞানকে জীবনে কাজে লাগানো এবং নিজের সুকুমার বৃত্তি সবার মাঝে ছড়িয়ে দেওয়ার মানসিকতা।"
          : "Education is more than knowledge from books. It is the ability to apply what we learn and share our better qualities with others.",
    },
    {
      number: "03",
      name: "ব্রিঃ জেঃ এ এস এম মুশফিকুর রহমান (অব.)",
      role: locale === "bn" ? "প্রধান উপদেষ্টা" : "Chief Advisor",
      image: "/kcmsc/leadership/chief-advisor.jpg",
      excerpt:
        locale === "bn"
          ? "বর্তমান সময়ের শিক্ষা হতে হবে শিক্ষার্থীবান্ধব, জীবনঘনিষ্ঠ, মানবিক, বিজ্ঞানমুখী ও সর্বাঙ্গীন।"
          : "Education today must be student-centred, relevant to life, humane, science-minded and holistic.",
    },
    {
      number: "04",
      name: "প্রফেসর মোঃ আবদুল বাতেন",
      role: locale === "bn" ? "অধ্যক্ষ" : "Principal",
      image: "/kcmsc/leadership/principal.jpg",
      excerpt:
        locale === "bn"
          ? "শিক্ষা মানুষের সুপ্ত প্রতিভা বিকাশে সহায়তা করে এবং একটি সুন্দর সমাজ ও বিশ্ব গঠনে অনন্য ভূমিকা রাখে।"
          : "Education unlocks human potential and plays a defining role in building a better society and a better world.",
    },
  ];

  const explore = [
    { title: t.academics, body: t.academicsBody, image: images.academics, href: `/${locale}/academics`, link: t.academicsLink },
    { title: t.life, body: t.lifeBody, image: images.life, href: `/${locale}/student-life`, link: t.lifeLink },
    { title: t.campus, body: t.campusBody, image: images.campus, href: `/${locale}/facilities`, link: t.campusLink },
  ];

  const results = [
    { label: t.ssc, pct: 98.48, text: "98.48%", total: 130, passed: 128, gpa: 67, accent: "from-[#27a872] to-[#176b45]" },
    { label: t.hsc, pct: 100, text: "100%", total: 47, passed: 47, gpa: 13, accent: "from-[#c9a83f] to-[#9a7412]" },
  ];

  return (
    <div className="kc-homepage bg-[#f7f5ef] text-[#242824]" data-no-reveal>
      <HeroSlideshow locale={locale} />

      {/* ───────── At a glance: cards floating over the bottom of the hero ───────── */}
      <section aria-label={t.glanceKicker} className="relative z-20 -mt-[64px] w-full px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1180px] grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((s, index) => (
            <Reveal key={s.label} delay={index * 110} className="h-full">
              <div
                className={`group cursor-default select-none flex h-full min-h-[128px] min-w-0 flex-col justify-between rounded-2xl border border-[#e4e2da] bg-[#fffdf8] px-5 py-5 shadow-[var(--kc-shadow-lift)] transition-all duration-500 ease-out hover:-translate-y-1 hover:border-transparent sm:px-6 ${s.hover}`}
              >
                <p className={`text-[11px] font-semibold uppercase tracking-[.2em] text-[#1f8a5b] transition-colors duration-500 sm:text-xs ${s.hoverText}`}>
                  {s.label}
                </p>
                <p className={`mt-4 break-words font-heading text-[clamp(1.5rem,2.3vw,2.1rem)] leading-tight tracking-[-.01em] text-[#124c36] transition-colors duration-500 ${s.hoverText}`}>
                  {index === 0 ? <CountUp text={s.value} duration={1800} /> : s.value}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────── The School ───────── */}
      <section className="relative overflow-hidden bg-[#f7f5ef] py-20 lg:py-28">
        <div className="mx-auto grid max-w-[1180px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-20 lg:px-10">
          <Reveal variant="left">
            <p className="kc-classic-kicker">{t.storyKicker}</p>
            <h2 className="kc-classic-title mt-4">{t.storyTitle}</h2>
            <p className="mt-6 max-w-lg text-base leading-8 text-[#58645c]">{t.storyBody}</p>
            <Link href={`/${locale}/about`} className="kc-classic-link mt-8">
              {t.storyLink}
              <span>↗</span>
            </Link>
          </Reveal>
          <Reveal variant="right" delay={120}>
            <div className="relative">
              <div className="relative aspect-[5/4] overflow-hidden rounded-[28px] bg-[#e5e2d8] shadow-lift">
                <Image
                  src={images.story}
                  alt="KCMSC students and staff on campus"
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover transition duration-700 ease-out hover:scale-[1.03]"
                />
              </div>
              <div className="absolute -bottom-6 left-4 right-4 flex gap-3 sm:left-auto sm:right-8 sm:w-auto">
                <div className="flex-1 rounded-2xl bg-[#176b45] px-5 py-4 text-white shadow-[var(--kc-shadow-lift)] sm:min-w-[170px]">
                  <p className="text-[11px] font-semibold uppercase tracking-[.16em] text-white/75">{t.foundedLabel}</p>
                  <p className="mt-1 font-heading text-2xl">{t.foundedValue}</p>
                </div>
                <div className="flex-1 rounded-2xl bg-[#c9a83f] px-5 py-4 text-[#10372a] shadow-[var(--kc-shadow-lift)] sm:min-w-[190px]">
                  <p className="text-[11px] font-semibold uppercase tracking-[.16em] text-[#10372a]/70">{t.openedLabel}</p>
                  <p className="mt-1 font-heading text-2xl">{t.openedValue}</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── Leadership ───────── */}
      <section className="relative overflow-hidden bg-[#fffdf8] py-20 lg:py-28">
        <div className="pointer-events-none absolute -right-24 -top-28 h-96 w-96 rounded-full bg-[#d5efe2] blur-3xl kc-orb" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#f6e9bf] blur-3xl kc-orb" />
        <div className="relative mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <Reveal className="max-w-2xl">
              <p className="kc-classic-kicker">{t.leadershipKicker}</p>
              <h2 className="kc-classic-title mt-3">{t.leadershipTitle}</h2>
              <p className="mt-5 max-w-xl text-[15px] leading-7 text-[#69716b]">{t.leadershipBody}</p>
            </Reveal>
            <Reveal delay={120}>
              <Link href={`/${locale}/leadership-messages`} className="kc-classic-link shrink-0">
                {t.allMessages}
                <span>↗</span>
              </Link>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {leaders.map((leader, index) => (
              <Reveal key={leader.number} delay={index * 110} className="h-full">
                <article className="kc-lead-card group flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border border-[#e4e2da] bg-white shadow-[var(--kc-shadow-card)] transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[var(--kc-shadow-lift)]">
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#e7e4da]">
                    <Image
                      src={leader.image}
                      alt={leader.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover object-top transition duration-700 ease-out group-hover:scale-[1.06]"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold tracking-[.14em] text-[#8a7740] backdrop-blur">
                      {leader.number}
                    </span>
                  </div>
                  <div className="kc-accent-bar" aria-hidden="true" />
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[.14em] text-[#1f8a5b]">{leader.role}</p>
                    <h3
                      className={`mt-2 font-heading text-xl leading-snug text-[#124c36] ${locale === "bn" ? "font-bangla" : ""}`}
                      lang={locale === "bn" ? "bn" : undefined}
                    >
                      {leader.name}
                    </h3>
                    <p
                      className={`mt-4 flex-1 text-[14px] leading-7 text-[#58645c] ${locale === "bn" ? "font-bangla" : ""}`}
                      lang={locale === "bn" ? "bn" : undefined}
                    >
                      “{leader.excerpt}”
                    </p>
                    <Link
                      href={`/${locale}/leadership-messages#message-${leader.number}`}
                      className="mt-5 inline-flex items-center gap-2 border-t border-[#e4e2da] pt-4 text-sm font-semibold text-[#176b45] transition-all duration-300 hover:gap-3 hover:text-[#1f8a5b]"
                    >
                      {t.readMessage}
                      <span aria-hidden="true">↗</span>
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Faculty slideshow (dark band) ───────── */}
      {faculty.length > 0 && (
        <section className="kc-faculty-band relative overflow-hidden py-20 lg:py-28">
          <div className="relative mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-10">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <Reveal className="max-w-2xl">
                <p className="text-[12px] font-medium uppercase tracking-[.18em] text-[#6fe0a9]">{t.facultyKicker}</p>
                <h2 className="mt-3 font-heading text-[clamp(2.15rem,4.4vw,4.25rem)] leading-[.99] tracking-[-.035em] text-white">
                  {t.facultyTitle}
                </h2>
                <p className="mt-5 max-w-xl text-[15px] leading-7 text-white/70">{t.facultyBody}</p>
              </Reveal>
              <Reveal delay={120}>
                <Link href={`/${locale}/teachers`} className="kc-faculty-link shrink-0">
                  {t.facultyLink}
                  <span aria-hidden="true">↗</span>
                </Link>
              </Reveal>
            </div>
          </div>
          <Reveal delay={150} className="relative mt-12">
            <FacultyShowcase locale={locale} faculty={faculty} ariaLabel={t.facultyKicker} />
          </Reveal>
        </section>
      )}

      {/* ───────── Explore: interactive tabs ───────── */}
      <section className="bg-[#f7f5ef] py-20 lg:py-28">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-10">
          <Reveal className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="kc-classic-kicker">{t.focusKicker}</p>
              <h2 className="kc-classic-title mt-3">{t.focusTitle}</h2>
            </div>
          </Reveal>
          <Reveal delay={120} className="mt-12">
            <ExploreTabs items={explore} kicker={t.focusKicker} />
          </Reveal>
        </div>
      </section>

      {/* ───────── Academic results ───────── */}
      <section className="border-y border-[#e4e2da] bg-[#fffdf8] py-20 lg:py-28">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <Reveal className="max-w-xl">
              <p className="kc-classic-kicker">{t.resultsKicker}</p>
              <h2 className="kc-classic-title mt-3">{t.resultsTitle}</h2>
              <p className="mt-5 text-[15px] leading-7 text-[#69716b]">{t.resultsBody}</p>
            </Reveal>
            <Reveal delay={120}>
              <Link href={`/${locale}/academics`} className="kc-classic-link">
                {t.resultsLink}
                <span>↗</span>
              </Link>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {results.map((row, index) => (
              <Reveal key={row.label} delay={index * 140} className="h-full">
                <div className="kc-result-card group relative flex h-full flex-col gap-6 overflow-hidden rounded-3xl border border-[#e4e2da] bg-white p-6 shadow-[var(--kc-shadow-card)] transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[var(--kc-shadow-lift)] sm:flex-row sm:items-center sm:p-8">
                  <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${row.accent}`} aria-hidden="true" />
                  <Ring value={row.pct} max={100} size={132} stroke={11} label={`${row.label}: ${row.text} pass rate`}>
                    <span className="font-heading text-[28px] leading-none text-[#176b45]">
                      <CountUp text={row.text} duration={1800} />
                    </span>
                  </Ring>
                  <div className="w-full min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#69716b]">{row.label}</p>
                    <div className="mt-4 space-y-4">
                      <div>
                        <div className="flex items-baseline justify-between text-sm text-[#58645c]">
                          <span>{t.passed}</span>
                          <span className="font-heading text-xl text-[#124c36]">
                            <CountUp text={row.passed} /> <span className="text-sm text-[#7b817b]">/ {row.total} {t.candidates}</span>
                          </span>
                        </div>
                        <Bar value={row.passed} max={row.total} className="mt-1.5 h-2.5" />
                      </div>
                      <div>
                        <div className="flex items-baseline justify-between text-sm text-[#58645c]">
                          <span>{t.gpa5}</span>
                          <span className="font-heading text-xl text-[#124c36]">
                            <CountUp text={row.gpa} />
                          </span>
                        </div>
                        <Bar value={row.gpa} max={row.total} delay={120} className="mt-1.5 h-2.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Alumni ───────── */}
      {alumni.length > 0 && (
        <section className="bg-[#f7f5ef] py-20 lg:py-28">
          <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-10">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <Reveal className="max-w-2xl">
                <p className="kc-classic-kicker">{t.alumniKicker}</p>
                <h2 className="kc-classic-title mt-3">
                  {t.alumniTitle}
                </h2>
              </Reveal>
              <Reveal delay={120}>
                <Link href={`/${locale}/alumni`} className="kc-classic-link">
                  {t.alumniLink}
                  <span>↗</span>
                </Link>
              </Reveal>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {alumni.map((message, index) => {
                const name = locale === "bn" ? message.nameBn : message.nameEn;
                const quote = locale === "bn" ? message.previewBn || message.messageBn : message.previewEn || message.messageEn;
                const role = locale === "bn" ? message.roleBn : message.roleEn;
                return (
                  <Reveal key={message.id} delay={index * 120} className="h-full">
                    <article className="kc-alumni-card flex h-full flex-col rounded-3xl border border-[#e4e2da] bg-white p-6 shadow-[var(--kc-shadow-card)] transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[var(--kc-shadow-lift)] sm:p-8">
                      <span className="font-heading text-5xl leading-none text-[#c9a83f]">“</span>
                      <p className="mt-2 flex-1 font-heading text-xl leading-[1.4] text-[#124c36]">{quote}</p>
                      <div className="mt-6 border-t border-[#e4e2da] pt-4">
                        <p className="font-heading text-lg text-[#176b45]">{name}</p>
                        <p className="mt-1 text-sm leading-6 text-[#69716b]">
                          {[role, locale === "bn" ? message.organizationBn : message.organizationEn].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ───────── Admissions call to action ───────── */}
      <section className="bg-[#f7f5ef] px-4 pb-20 pt-4 sm:px-8 sm:pb-28">
        <Reveal>
          <div className="kc-dash-hero kc-cta relative mx-auto grid max-w-[1180px] gap-8 rounded-[32px] px-6 py-12 shadow-lift sm:px-12 sm:py-16 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-[#27a872]/30 blur-3xl kc-orb" />
            <div className="relative">
              <p className="kc-light-kicker">{t.admissionKicker}</p>
              <h2 className="mt-3 max-w-3xl font-heading text-[clamp(2.2rem,4vw,3.75rem)] font-normal leading-[1.02] tracking-[-.03em]">
                {t.admissionTitle}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-8 text-white/80">{t.admissionBody}</p>
            </div>
            <div className="relative flex flex-wrap gap-3 lg:justify-end">
              <Link href={`/${locale}/admissions`} className="kc-classic-button kc-classic-button-light">
                {t.admissionLink}
              </Link>
              <Link href={`/${locale}/contact`} className="kc-classic-button kc-classic-button-ghost-light">
                {t.contactLink}
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
