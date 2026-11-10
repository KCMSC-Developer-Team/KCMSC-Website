import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/i18n/config";
import { prisma } from "@/lib/db";
import { Reveal } from "@/components/home/Reveal";
import { SubpageHero, SubpageIntro } from "@/components/subpage/SubpageKit";
import { AchievementTicker } from "@/components/achievements/AchievementTicker";

type Entry = {
  year: string;
  category: string;
  title: string;
  details: string;
};

async function getAchievementEntries(
  locale: Locale,
  fallback: Entry[],
): Promise<Entry[]> {
  try {
    const rows = await prisma.achievement.findMany({
      orderBy: [{ year: "desc" }, { createdAt: "desc" }],
    });

    if (rows.length === 0) return fallback;

    return rows.map((row) => ({
      year: String(row.year),
      category: row.category,
      title: locale === "bn" ? row.titleBn : row.titleEn,
      details: locale === "bn" ? row.descriptionBn : row.descriptionEn,
    }));
  } catch {
    return fallback;
  }
}

/* =========================================================
   HIGH-RESOLUTION IMAGE
========================================================= */

function ClearImage({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "100vw",
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      unoptimized
      quality={100}
      sizes={sizes}
      className={className}
    />
  );
}

/* =========================================================
   LOCALIZED COPY
========================================================= */

const copy = {
  en: {
    kicker: "Academics",
    heroTitle: "Learning has more than one measure.",
    heroBody:
      "From the first classroom to board examinations, K C Model School & College gives students a structured academic path while leaving room for curiosity, competition and growth.",
    heroNote: "Play Group → Grade XII · Bangla & English Versions",
    heroAlt: "Students learning in a K C Model School & College classroom",
    explore: "Explore the academic journey",
    admissions: "Admissions",

    overview: "At a glance",

    students: "Students",
    studentsDetail: "2025 enrollment",

    bangla: "Bangla Version",
    banglaDetail: "1,240 students · 53%",

    english: "English Version",
    englishDetail: "1,096 students · 47%",

    structure: "Academic structure",
    structureTitle: "A clear route through every stage.",
    structureBody:
      "Junior and Senior Wings give each stage of school its own rhythm, while keeping the full academic journey connected.",

    junior: "Junior Wing",
    juniorEyebrow: "Play Group · Primary",
    juniorBody:
      "The foundation years focus on building confident learners through Pre-Primary and Primary education.",
    juniorClasses: "Pre-Primary & Primary",
    juniorStaff: "76 teachers",

    senior: "Senior Wing",
    seniorEyebrow: "Secondary · Higher Secondary",
    seniorBody:
      "Students progress through Secondary and Higher Secondary education with a stronger focus on subject depth and examination readiness.",
    seniorClasses: "Secondary & Higher Secondary",
    seniorStaff: "22 Lecturers · 20 Senior Teachers · 22 Assistant Teachers",

    classroomKicker: "Inside the classroom",
    classroomTitle: "The daily work behind the results.",
    classroomBody:
      "Academic life is built through ordinary days: lessons, questions, practice, feedback and the steady progression from one class to the next.",
    classroomAlt: "KCMSC students at a book fair",

    journeyKicker: "The academic journey",
    journeyTitle: "From Play Group to Grade XII.",
    journeyBody:
      "A connected sequence of stages helps students understand where they are and what comes next.",

    schoolHours: "School hours",
    schoolHoursValue: "7:45 AM – 2:30 PM",
    schoolHoursDetail: "Sunday – Thursday",

    resultsKicker: "Academic results",
    resultsTitle: "Results, with the context around them.",
    resultsBody:
      "The 2024 SSC and HSC results show a strong examination record, but they are only one part of the wider academic story.",

    appeared: "Appeared",
    passed: "Passed",
    gpa5: "GPA 5",
    passRate: "Pass rate",
    resultNote: "2024 academic results",

    curriculumKicker: "Curriculum",
    curriculumTitle: "One national curriculum, two language versions.",
    curriculumBody:
      "KCMSC follows the National Curriculum across its academic structure and offers both Bangla and English Versions.",

    curriculumItems: [
      ["01", "National Curriculum", "Play Group through Grade XII."],
      ["02", "Bangla Version", "1,240 students in 2025."],
      ["03", "English Version", "1,096 students in 2025."],
      [
        "04",
        "Continuous progression",
        "Junior and Senior Wings connect the journey.",
      ],
    ],

    beyondKicker: "Beyond the classroom",
    beyondTitle: "Achievement is part of academic life too.",
    beyondBody:
      "Olympiads, competitions, scholarships and institutional recognition give students opportunities to apply what they learn and build confidence beyond routine examinations.",

    highlights: "Recent highlights",

    noEntries: "Achievement records will appear here as they are published.",

    allAchievements: "All achievement records",

    studentLife: "Student life",
  },

  bn: {
    kicker: "শিক্ষাব্যবস্থা",
    heroTitle: "শেখার মাপ শুধু ফলাফলে নয়।",
    heroBody:
      "প্রথম শ্রেণিকক্ষ থেকে বোর্ড পরীক্ষা পর্যন্ত K C Model School & College শিক্ষার্থীদের একটি সুসংগঠিত শিক্ষার পথ দেয়, যেখানে কৌতূহল, প্রতিযোগিতা ও বিকাশেরও জায়গা থাকে।",
    heroNote: "প্লে গ্রুপ → দ্বাদশ শ্রেণি · বাংলা ও ইংরেজি ভার্সন",
    heroAlt: "কেসিএমএসসির শ্রেণিকক্ষে শিক্ষার্থীরা",
    explore: "শিক্ষাব্যবস্থা দেখুন",
    admissions: "ভর্তি",

    overview: "এক নজরে",

    students: "শিক্ষার্থী",
    studentsDetail: "২০২৫ সালের তথ্য",

    bangla: "বাংলা ভার্সন",
    banglaDetail: "১,২৪০ শিক্ষার্থী · ৫৩%",

    english: "ইংরেজি ভার্সন",
    englishDetail: "১,০৯৬ শিক্ষার্থী · ৪৭%",

    structure: "শিক্ষাব্যবস্থা কাঠামো",
    structureTitle: "প্রতিটি ধাপের জন্য একটি পরিষ্কার পথ।",
    structureBody:
      "Junior ও Senior Wing শিক্ষার প্রতিটি ধাপকে নিজস্ব কাঠামো দেয় এবং পুরো শিক্ষাযাত্রাকে একটি ধারাবাহিকতায় রাখে।",

    junior: "Junior Wing",
    juniorEyebrow: "Play Group · Primary",
    juniorBody:
      "প্রি-প্রাইমারি ও প্রাইমারি পর্যায়ে শিক্ষার্থীদের আত্মবিশ্বাসী ও কৌতূহলী শিক্ষার্থী হিসেবে গড়ে তোলার ভিত্তি তৈরি করা হয়।",
    juniorClasses: "Pre-Primary ও Primary",
    juniorStaff: "৭৬ জন শিক্ষক",

    senior: "Senior Wing",
    seniorEyebrow: "Secondary · Higher Secondary",
    seniorBody:
      "Secondary ও Higher Secondary পর্যায়ে বিষয়ভিত্তিক জ্ঞান এবং পরীক্ষার প্রস্তুতির দিকে আরও গভীরভাবে এগিয়ে যায় শিক্ষার্থীরা।",
    seniorClasses: "Secondary ও Higher Secondary",
    seniorStaff: "২২ Lecturer · ২০ Senior Teacher · ২২ Assistant Teacher",

    classroomKicker: "শ্রেণিকক্ষের ভেতরে",
    classroomTitle: "ফলাফলের পেছনের প্রতিদিনের কাজ।",
    classroomBody:
      "শিক্ষাব্যবস্থা তৈরি হয় প্রতিদিনের ছোট ছোট কাজ দিয়ে: পাঠ, প্রশ্ন, অনুশীলন, feedback এবং এক শ্রেণি থেকে পরের শ্রেণিতে ধারাবাহিক অগ্রগতি।",
    classroomAlt: "কেসিএমএসসির শিক্ষার্থীরা বইমেলায়",

    journeyKicker: "শিক্ষাব্যবস্থা যাত্রা",
    journeyTitle: "Play Group থেকে Grade XII।",
    journeyBody:
      "ধারাবাহিক ধাপগুলো শিক্ষার্থীদের বর্তমান অবস্থান এবং পরবর্তী গন্তব্য দুটোই বুঝতে সাহায্য করে।",

    schoolHours: "স্কুলের সময়",
    schoolHoursValue: "সকাল ৭:৪৫ – দুপুর ২:৩০",
    schoolHoursDetail: "রবিবার – বৃহস্পতিবার",

    resultsKicker: "শিক্ষাব্যবস্থা ফলাফল",
    resultsTitle: "ফলাফল, তার প্রেক্ষাপটসহ।",
    resultsBody:
      "২০২৪ সালের SSC ও HSC ফলাফল শক্তিশালী পরীক্ষার রেকর্ড দেখায়, তবে এটি পুরো শিক্ষাযাত্রার কেবল একটি অংশ।",

    appeared: "পরীক্ষার্থী",
    passed: "উত্তীর্ণ",
    gpa5: "GPA 5",
    passRate: "পাসের হার",
    resultNote: "২০২৪ সালের ফলাফল",

    curriculumKicker: "শিক্ষাক্রম",
    curriculumTitle: "একটি জাতীয় শিক্ষাক্রম, দুটি ভাষা ভার্সন।",
    curriculumBody:
      "KCMSC তার শিক্ষাব্যবস্থায় জাতীয় শিক্ষাক্রম অনুসরণ করে এবং বাংলা ও ইংরেজি উভয় ভার্সনে শিক্ষা প্রদান করে।",

    curriculumItems: [
      ["০১", "জাতীয় শিক্ষাক্রম", "Play Group থেকে Grade XII পর্যন্ত।"],
      ["০২", "বাংলা ভার্সন", "২০২৫ সালে ১,২৪০ শিক্ষার্থী।"],
      ["০৩", "ইংরেজি ভার্সন", "২০২৫ সালে ১,০৯৬ শিক্ষার্থী।"],
      [
        "০৪",
        "ধারাবাহিক অগ্রগতি",
        "Junior ও Senior Wing পুরো যাত্রাকে যুক্ত রাখে।",
      ],
    ],

    beyondKicker: "শ্রেণিকক্ষের বাইরেও",
    beyondTitle: "অর্জনও শিক্ষাজীবনের অংশ।",
    beyondBody:
      "অলিম্পিয়াড, প্রতিযোগিতা, বৃত্তি ও প্রাতিষ্ঠানিক স্বীকৃতি শিক্ষার্থীদের শেখা বিষয়গুলো বাস্তবে প্রয়োগ এবং শ্রেণিকক্ষের বাইরেও আত্মবিশ্বাস তৈরি করার সুযোগ দেয়।",

    highlights: "সাম্প্রতিক অর্জন",

    noEntries: "প্রকাশিত হলে অর্জনের তথ্য এখানে দেখা যাবে।",

    allAchievements: "সব অর্জনের তথ্য",

    studentLife: "শিক্ষাজীবন",
  },
} as const;

/* =========================================================
   ACADEMIC JOURNEY
========================================================= */

const classes = [
  ["Play Group", "3.5–4.5 years"],
  ["Nursery / KG", "4.5–5.5 years"],
  ["Class 1", "5.5–6.5 years"],
  ["Class 2", "6.5–7.5 years"],
  ["Class 3", "7.5–8.5 years"],
  ["Class 4", "8.5–9.5 years"],
  ["Class 5", "9.5–10.5 years"],
  ["Class 6–8", "Junior / secondary progression"],
  ["Class 9–10", "Secondary"],
  ["Class 11–12", "Higher Secondary"],
] as const;

/* =========================================================
   RESULTS
========================================================= */

const results = [
  {
    exam: "SSC",
    year: "2024",
    appeared: "130",
    passed: "128",
    rate: 98.48,
    gpa: "67",
  },
  {
    exam: "HSC",
    year: "2024",
    appeared: "47",
    passed: "47",
    rate: 100,
    gpa: "13",
  },
] as const;

/* =========================================================
   PASS RATE (green ring, matches the site palette)
========================================================= */

function PassRate({ rate, label }: { rate: number; label: string }) {
  const degrees = rate * 3.6;

  return (
    <div
      className="relative h-24 w-24 shrink-0 rounded-full"
      style={{
        background: `conic-gradient(#1f8a5b 0deg ${degrees}deg, #e6eae7 ${degrees}deg 360deg)`,
      }}
    >
      <div className="absolute inset-[7px] flex flex-col items-center justify-center rounded-full bg-[#fffdf8]">
        <span className="font-heading text-xl text-[#124c36]">{rate}%</span>
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-[.14em] text-[#69716b]">{label}</span>
      </div>
    </div>
  );
}

/* =========================================================
   SHARED BLOCKS (same language as the landing page)
========================================================= */

/** Grey arch that rises inside a panel and fills it green on hover. */
function ArchBackdrop() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-[35%] -z-10 h-[260px] w-[260px] -translate-x-1/2 rounded-t-full bg-[#dfe2e0] transition-[transform,background-color] duration-700 ease-out will-change-transform group-hover:scale-[4] group-hover:bg-[#176b45]"
    />
  );
}

/* =========================================================
   PAGE
========================================================= */

export default async function AcademicsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  if (!isLocale((await params).locale)) notFound();

  const locale: Locale = (await params).locale as Locale;
  const t = copy[locale];
  const dict = getDictionary(locale);

  const entries = await getAchievementEntries(
    locale,
    dict.achievementsPage.entries,
  );

  const featuredEntries = entries.slice(0, 4);

  const glance = [
    { value: "2,336", label: t.students, detail: t.studentsDetail },
    { value: "53%", label: t.bangla, detail: t.banglaDetail },
    { value: "47%", label: t.english, detail: t.englishDetail },
    { value: "2", label: t.structure, detail: "Junior + Senior" },
  ];

  const wings = [
    {
      number: "01",
      title: t.junior,
      eyebrow: t.juniorEyebrow,
      body: t.juniorBody,
      classes: t.juniorClasses,
      staff: t.juniorStaff,
      image: "/kcmsc/media/vibrant_student_life2.jpg",
      alt: "KCMSC students during school life",
    },
    {
      number: "02",
      title: t.senior,
      eyebrow: t.seniorEyebrow,
      body: t.seniorBody,
      classes: t.seniorClasses,
      staff: t.seniorStaff,
      image: "/kcmsc/media/students_at_library.jpg",
      alt: "KCMSC students studying in the library",
    },
  ];

  return (
    <div className="kc-sub-page" data-no-reveal>
      {/* =====================================================
          HERO — shared subpage hero (same as About and Leadership)
      ===================================================== */}
      <SubpageHero
        kicker={t.kicker}
        title={t.heroTitle}
        body={t.heroBody}
        image="/kcmsc/media/teacher_taking_class.jpg"
        imageAlt={t.heroAlt}
        priority
        actions={
          <>
            <a
              href="#results"
              className="inline-flex items-center rounded-full bg-[#1f8a5b] px-5 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#124c36]"
            >
              {t.explore}
            </a>
            <Link
              href={`/${locale}/admissions`}
              className="inline-flex items-center rounded-full border border-white/35 px-5 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white/10"
            >
              {t.admissions}
            </Link>
          </>
        }
      />

      {/* =====================================================
          AT A GLANCE — white cards overlapping the hero, green wave on hover
      ===================================================== */}
      <section aria-label={t.overview} className="px-4 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1180px] grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {glance.map((item, index) => (
            <Reveal key={item.label} delay={index * 110} className="h-full">
              <div className="group relative isolate flex h-full min-h-[150px] cursor-default select-none flex-col justify-between overflow-hidden rounded-2xl border border-[#e4e2da] bg-white px-5 py-5 shadow-[var(--kc-shadow-lift)] sm:px-6">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -z-10 bg-[#176b45] [clip-path:ellipse(0%_0%_at_50%_100%)] transition-[clip-path] duration-[900ms] ease-out group-hover:[clip-path:ellipse(150%_150%_at_50%_100%)]"
                />

                <div className="flex items-start justify-between">
                  <span className="font-heading text-sm tabular-nums text-[#8a948e] transition-colors duration-700 group-hover:text-white/70">
                    {`0${index + 1}`}
                  </span>
                  <span
                    aria-hidden="true"
                    className="grid h-7 w-7 place-items-center rounded-full bg-[#e6eae7] transition-colors duration-700 group-hover:bg-white"
                  >
                    <span className="h-2 w-2 rounded-full bg-[#176b45]" />
                  </span>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[.2em] text-[#1f8a5b] transition-colors duration-700 group-hover:text-white/85 sm:text-xs">
                    {item.label}
                  </p>
                  <p className="mt-2 break-words font-heading text-[clamp(1.5rem,2.3vw,2.1rem)] leading-tight tracking-[-.01em] text-[#124c36] transition-colors duration-700 group-hover:text-white">
                    {item.value}
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[.14em] text-[#747b74] transition-colors duration-700 group-hover:text-white/70">
                    {item.detail}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* =====================================================
          ACADEMIC STRUCTURE — wing panels with the arch fill
      ===================================================== */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-10">
          <SubpageIntro kicker={t.structure} title={t.structureTitle} body={t.structureBody} />

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {wings.map((wing, index) => (
              <Reveal key={wing.number} delay={index * 120} className="h-full">
                <article className="kc-sub-panel group flex h-full flex-col overflow-hidden sm:flex-row">
                  <div className="relative min-h-[240px] overflow-hidden sm:w-[40%] sm:min-h-full">
                    <ClearImage
                      src={wing.image}
                      alt={wing.alt}
                      sizes="(min-width: 1024px) 25vw, 100vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#082b20]/60 via-transparent to-transparent" />
                    <span className="absolute bottom-5 left-5 font-heading text-5xl text-white/85">{wing.number}</span>
                  </div>

                  <div className="relative isolate flex flex-1 flex-col overflow-hidden p-7 sm:p-8">
                    <ArchBackdrop />

                    <span className="kc-sub-year self-start transition-colors duration-700 group-hover:bg-white/90">
                      {wing.eyebrow}
                    </span>
                    <h3 className="mt-5 font-heading text-3xl text-[#124c36] transition-colors duration-700 group-hover:text-white sm:text-4xl">
                      {wing.title}
                    </h3>
                    <p className="mt-4 text-[15px] leading-7 text-[#58645c] transition-colors duration-700 group-hover:text-white/90">
                      {wing.body}
                    </p>

                    <div className="mt-auto border-t border-[#d9d8cf] pt-5 transition-colors duration-700 group-hover:border-white/25">
                      <div className="flex items-start justify-between gap-5">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-[#1f8a5b] transition-colors duration-700 group-hover:text-white/85">
                            Classes
                          </p>
                          <p className="mt-2 text-xs text-[#58645c] transition-colors duration-700 group-hover:text-white/90">
                            {wing.classes}
                          </p>
                        </div>
                        <span className="max-w-[200px] text-right text-[11px] font-semibold uppercase leading-4 tracking-[.1em] text-[#176b45] transition-colors duration-700 group-hover:text-white">
                          {wing.staff}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          CLASSROOM — green band with photo
      ===================================================== */}
      <section className="pb-20 lg:pb-28">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-10">
          <Reveal>
            <div className="kc-faculty-band grid overflow-hidden rounded-[32px] lg:grid-cols-[1fr_1fr]">
              <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14">
                <p className="kc-sub-hero-kicker">{t.classroomKicker}</p>
                <h2 className="mt-4 font-heading text-[clamp(2.2rem,4vw,3.6rem)] font-normal leading-[1.02] tracking-[-.03em]">
                  {t.classroomTitle}
                </h2>
                <p className="mt-6 max-w-lg text-[15px] leading-7 text-white/75">{t.classroomBody}</p>

                <div className="mt-10 grid grid-cols-2 gap-6 border-t border-white/15 pt-6">
                  <div>
                    <p className="text-[11px] uppercase tracking-[.16em] text-white/50">{t.schoolHours}</p>
                    <p className="mt-2 font-heading text-lg leading-tight sm:text-xl">{t.schoolHoursValue}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[.16em] text-white/50">Days</p>
                    <p className="mt-2 font-heading text-lg leading-tight sm:text-xl">{t.schoolHoursDetail}</p>
                  </div>
                </div>
              </div>

              <div className="relative min-h-[320px] lg:min-h-[480px]">
                <ClearImage
                  src="/kcmsc/media/students_at_bookfair.jpg"
                  alt={t.classroomAlt}
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#082b20]/40 via-transparent to-transparent" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =====================================================
          ACADEMIC JOURNEY — class rows in a rounded panel
      ===================================================== */}
      <section className="pb-20 lg:pb-28">
        <div className="mx-auto grid max-w-[1180px] gap-12 px-5 sm:px-8 lg:grid-cols-[.72fr_1.28fr] lg:items-start lg:px-10">
          <Reveal>
            <p className="kc-classic-kicker">{t.journeyKicker}</p>
            <h2 className="kc-classic-title mt-3">{t.journeyTitle}</h2>
            <p className="mt-5 max-w-md text-[15px] leading-7 text-[#69716b]">{t.journeyBody}</p>
          </Reveal>

          <Reveal delay={120}>
            <div className="kc-sub-panel divide-y divide-[#e4e2da] overflow-hidden p-2 sm:p-3">
              {classes.map(([name, age], index) => (
                <div
                  key={name}
                  className="grid grid-cols-[40px_1fr_auto] items-center gap-3 rounded-2xl px-4 py-4 transition-colors duration-500 hover:bg-[#eef6f1] sm:grid-cols-[56px_1fr_220px] sm:px-6"
                >
                  <span className="text-[12px] font-bold tracking-[.15em] text-[#c9a83f]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-heading text-lg text-[#124c36] sm:text-xl">{name}</span>
                  <span className="text-right text-[11px] uppercase tracking-[.1em] text-[#69716b]">{age}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* =====================================================
          RESULTS
      ===================================================== */}
      <section id="results" className="pb-20 lg:pb-28">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-10">
          <SubpageIntro kicker={t.resultsKicker} title={t.resultsTitle} body={t.resultsBody} />

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {results.map((result, index) => (
              <Reveal key={result.exam} delay={index * 120} className="h-full">
                <article className="kc-sub-panel flex h-full flex-col p-7 sm:p-9">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <span className="kc-sub-year">{result.year}</span>
                      <h3 className="mt-4 font-heading text-4xl text-[#124c36]">{result.exam}</h3>
                    </div>
                    <PassRate rate={result.rate} label={t.passRate} />
                  </div>

                  <div className="mt-8 grid grid-cols-3 border-t border-[#e4e2da] pt-5">
                    {[
                      [t.appeared, result.appeared],
                      [t.passed, result.passed],
                      [t.gpa5, result.gpa],
                    ].map(([label, value], position) => (
                      <div key={label} className={position ? "border-l border-[#e4e2da] pl-4" : ""}>
                        <p className="text-[11px] uppercase tracking-[.13em] text-[#747b74]">{label}</p>
                        <p
                          className={`mt-2 font-heading text-2xl ${
                            position === 2 ? "text-[#1f8a5b]" : "text-[#124c36]"
                          }`}
                        >
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <p className="mt-5 text-[11px] font-semibold uppercase tracking-[.14em] text-[#858a83]">{t.resultNote}</p>
        </div>
      </section>

      {/* =====================================================
          CURRICULUM — green panel, numbered rows
      ===================================================== */}
      <section className="pb-20 lg:pb-28">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-10">
          <Reveal>
            <div className="kc-faculty-band rounded-[32px] p-8 sm:p-12 lg:p-14">
              <div className="grid gap-12 lg:grid-cols-[.68fr_1.32fr]">
                <div>
                  <p className="kc-sub-hero-kicker">{t.curriculumKicker}</p>
                  <h2 className="mt-4 font-heading text-[clamp(2.2rem,4vw,3.4rem)] font-normal leading-[1.02] tracking-[-.03em]">
                    {t.curriculumTitle}
                  </h2>
                  <p className="mt-6 max-w-md text-[15px] leading-7 text-white/70">{t.curriculumBody}</p>
                </div>

                <div className="border-t border-white/15">
                  {t.curriculumItems.map(([number, title, body]) => (
                    <div
                      key={number}
                      className="grid gap-4 border-b border-white/15 py-6 sm:grid-cols-[45px_190px_1fr] sm:items-start"
                    >
                      <span className="text-[12px] font-bold tracking-[.16em] text-[#6fe0a9]">{number}</span>
                      <h3 className="font-heading text-xl">{title}</h3>
                      <p className="text-sm leading-6 text-white/65">{body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =====================================================
          ACHIEVEMENTS
      ===================================================== */}
      <section className="pb-20 lg:pb-28">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-10">
          <SubpageIntro kicker={t.beyondKicker} title={t.beyondTitle} body={t.beyondBody} />

          <div className="mt-12 grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
            <Reveal className="h-full">
              <div className="group relative min-h-[360px] overflow-hidden rounded-[28px] bg-[#124c36] lg:h-full">
                <ClearImage
                  src="/kcmsc/media/ict_olympiad_at_kc.jpg"
                  alt={
                    locale === "bn"
                      ? "কেসিএমএসসির শিক্ষার্থীদের অলিম্পিয়াডে অংশগ্রহণ"
                      : "KCMSC students at an ICT Olympiad"
                  }
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#082b20]/90 via-[#082b20]/15 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-8">
                  <p className="kc-sub-hero-kicker">{t.highlights}</p>
                  <p className="mt-3 max-w-sm font-heading text-2xl leading-tight text-white">
                    {locale === "bn"
                      ? "শেখার সুযোগ শ্রেণিকক্ষের বাইরেও আছে।"
                      : "Another classroom begins beyond the classroom."}
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120} className="h-full">
              {featuredEntries.length ? (
                  <AchievementTicker
                    items={featuredEntries}
                    ariaLabel={locale === "bn" ? "সাম্প্রতিক অর্জনের তালিকা" : "Recent achievements"}
                  />
                ) : (
                  <div className="kc-sub-panel p-8">
                    <p className="text-sm leading-6 text-[#69716b]">{t.noEntries}</p>
                  </div>
                )}
            </Reveal>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#e4e2da] pt-5">
            <p className="text-[11px] uppercase tracking-[.14em] text-[#858a83]">
              {entries.length} {locale === "bn" ? "টি প্রকাশিত রেকর্ড" : "published records"}
            </p>

            <Link href={`/${locale}/achievements`} className="kc-classic-link">
              {t.allAchievements}
              <span>↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          END CAP — green panel with photo, same as the landing close
      ===================================================== */}
      <section className="px-4 pb-20 sm:px-8 sm:pb-28">
        <Reveal>
          <div className="kc-dash-hero relative mx-auto grid max-w-[1180px] overflow-hidden rounded-[32px] shadow-lift lg:grid-cols-[1fr_.9fr]">
            <div className="relative flex flex-col justify-center p-8 sm:p-12">
              <p className="kc-light-kicker">K C Model School & College</p>
              <h2 className="mt-4 max-w-xl font-heading text-[clamp(2.1rem,4vw,3.4rem)] font-normal leading-[1.02] tracking-[-.03em]">
                {locale === "bn"
                  ? "ফলাফলের পেছনের শিক্ষাজীবনও দেখুন।"
                  : "See the school life behind the results."}
              </h2>
              <p className="mt-5 max-w-md text-[15px] leading-7 text-white/75">
                {locale === "bn"
                  ? "শ্রেণিকক্ষ, প্রতিযোগিতা, বন্ধুত্ব ও প্রতিদিনের অভিজ্ঞতাই একটি পূর্ণ শিক্ষাজীবনের অংশ।"
                  : "Classrooms, competitions, friendships and everyday experiences are all part of the academic journey."}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={`/${locale}/student-life`}
                  className="inline-flex rounded-full bg-[#c9a83f] px-5 py-3 text-sm font-semibold text-[#10372a] transition-colors duration-300 hover:bg-[#f2c94c]"
                >
                  {t.studentLife}
                </Link>
                <Link
                  href={`/${locale}/admissions`}
                  className="inline-flex rounded-full border border-white/35 px-5 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white/10"
                >
                  {t.admissions}
                </Link>
              </div>
            </div>

            <div className="relative min-h-[300px] lg:min-h-[420px]">
              <ClearImage
                src="/kcmsc/media/winner.jpg"
                alt={locale === "bn" ? "কেসিএমএসসির শিক্ষার্থীর পুরস্কার অর্জন" : "KCMSC student receiving an award"}
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0f4a34]/50 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 rounded-full border border-white/25 bg-[#124c36]/70 px-4 py-2 backdrop-blur-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[.16em] text-white/85">
                  K C Model School & College
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
