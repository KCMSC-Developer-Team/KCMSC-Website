import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/i18n/config";
import { prisma } from "@/lib/db";

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
      "From the first classroom to board examinations, KC Model School & College gives students a structured academic path while leaving room for curiosity, competition and growth.",
    heroNote: "Play Group → Grade XII · Bangla & English Versions",
    heroAlt: "Students learning in a KC Model School & College classroom",
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
      "প্রথম শ্রেণিকক্ষ থেকে বোর্ড পরীক্ষা পর্যন্ত KC Model School & College শিক্ষার্থীদের একটি সুসংগঠিত শিক্ষার পথ দেয়, যেখানে কৌতূহল, প্রতিযোগিতা ও বিকাশেরও জায়গা থাকে।",
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
   PASS RATE
========================================================= */

function PassRate({ rate }: { rate: number }) {
  const degrees = rate * 3.6;

  return (
    <div
      className="relative h-24 w-24 shrink-0 rounded-full"
      style={{
        background: `conic-gradient(#1D4ED8 0deg ${degrees}deg, #d8d5cc ${degrees}deg 360deg)`,
      }}
    >
      <div className="absolute inset-[7px] flex flex-col items-center justify-center rounded-full bg-[#f8f6f0]">
        <span className="font-heading text-xl text-[#12324A]">{rate}%</span>

        <span className="mt-1 text-[7px] font-bold uppercase tracking-[.14em] text-[#747b74]">
          pass rate
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default async function AcademicsPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();

  const locale: Locale = params.locale;
  const t = copy[locale];
  const dict = getDictionary(locale);

  const entries = await getAchievementEntries(
    locale,
    dict.achievementsPage.entries,
  );

  const featuredEntries = entries.slice(0, 4);

  return (
    <main className="overflow-hidden bg-[#fffdf8] text-[#25362e]">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="kc-feature-hero border-b border-[#d9d8cf] bg-[#12324A] text-white">
        <div className="kc-feature-hero mx-auto grid min-h-[610px] max-w-[1440px] lg:grid-cols-[1.18fr_.82fr]">
          <div className="relative flex flex-col justify-center px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
            <div className="relative z-10 max-w-3xl">
              <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.28em] text-[#FBBF24]">
                <span className="h-px w-9 bg-[#FBBF24]" />
                {t.kicker}
              </p>

              <h1 className="mt-6 max-w-3xl font-heading text-[clamp(3.2rem,7vw,7rem)] leading-[.86] tracking-[-.06em]">
                {t.heroTitle}
              </h1>

              <p className="mt-8 max-w-2xl text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
                {t.heroBody}
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href="#results"
                  className="inline-flex items-center bg-white px-5 py-3 text-[10px] font-bold uppercase tracking-[.16em] text-[#12324A] transition hover:bg-[#b59a4a]"
                >
                  {t.explore}
                </a>

                <Link
                  href={`/${locale}/admissions`}
                  className="inline-flex items-center border border-white/25 px-5 py-3 text-[10px] font-bold uppercase tracking-[.16em] text-white/85 transition hover:border-white"
                >
                  {t.admissions}
                </Link>
              </div>
            </div>
          </div>

          <div className="relative m-5 min-h-[300px] overflow-hidden border border-white/10 sm:m-8 lg:m-10 lg:ml-0 lg:min-h-0">
            <ClearImage
              src="/kcmsc/media/teacher_taking_class.jpg"
              alt={t.heroAlt}
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-center"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#082b20]/85 via-[#082b20]/10 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <p className="max-w-xs font-heading text-2xl leading-none sm:text-3xl">
                {t.heroNote}
              </p>

              <div className="mt-5 h-px w-full bg-white/20" />

              <p className="mt-3 text-[9px] font-bold uppercase tracking-[.18em] text-white/50">
                K C Model School & College · Est. 2014
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          AT A GLANCE
      ===================================================== */}

      <section className="border-b border-[#d9d8cf] bg-[#eeeae0]">
        <div className="mx-auto max-w-[1440px] px-6 py-8 sm:px-10 lg:px-16">
          <div className="mb-6 flex items-center gap-3">
            <span className="text-[9px] font-bold uppercase tracking-[.24em] text-[#b07a17]">
              {t.overview}
            </span>

            <span className="h-px flex-1 bg-[#d4d0c5]" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4">
            {[
              ["2,336", t.students, t.studentsDetail],
              ["53%", t.bangla, t.banglaDetail],
              ["47%", t.english, t.englishDetail],
              ["2", t.structure, "Junior + Senior"],
            ].map(([value, label, detail], index) => (
              <div
                key={label}
                className={`py-4 pr-6 sm:pr-10 lg:py-2 lg:px-7 ${
                  index < 3 ? "border-r border-[#d4d0c5]" : ""
                } ${
                  index > 1 ? "border-t border-[#d4d0c5] lg:border-t-0" : ""
                }`}
              >
                <p className="font-heading text-4xl tracking-[-.04em] text-[#12324A] sm:text-5xl">
                  {value}
                </p>

                <p className="mt-2 text-xs font-semibold text-[#25362e]">
                  {label}
                </p>

                <p className="mt-1 text-[8px] uppercase tracking-[.14em] text-[#747b74]">
                  {detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          ACADEMIC STRUCTURE
      ===================================================== */}

      <section className="border-b border-[#d9d8cf] bg-[#fffdf8]">
        <div className="mx-auto max-w-[1240px] px-6 py-20 sm:px-10 lg:py-28">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.25em] text-[#b07a17]">
                {t.structure}
              </p>

              <h2 className="mt-4 max-w-xl font-heading text-4xl leading-[.92] tracking-[-.045em] text-[#12324A] sm:text-6xl">
                {t.structureTitle}
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-7 text-[#68716a] lg:justify-self-end">
              {t.structureBody}
            </p>
          </div>

          <div className="mt-14 grid gap-4 lg:grid-cols-2">
            {[
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
            ].map((wing) => (
              <article
                key={wing.title}
                className="group grid overflow-hidden border border-[#d9d3c7] bg-[#f1eee5] sm:grid-cols-[.72fr_1.28fr]"
              >
                <div className="relative min-h-[230px] overflow-hidden sm:min-h-full">
                  <ClearImage
                    src={wing.image}
                    alt={wing.alt}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover object-center"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#082b20]/55 via-transparent to-transparent" />

                  <span className="absolute bottom-5 left-5 font-heading text-5xl text-white/80">
                    {wing.number}
                  </span>
                </div>

                <div className="p-7 sm:p-8">
                  <p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#b07a17]">
                    {wing.eyebrow}
                  </p>

                  <h3 className="mt-3 font-heading text-3xl text-[#12324A] sm:text-4xl">
                    {wing.title}
                  </h3>

                  <p className="mt-4 text-sm leading-6 text-[#68716a]">
                    {wing.body}
                  </p>

                  <div className="mt-7 border-t border-[#d3cdbf] pt-5">
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <p className="text-[8px] font-bold uppercase tracking-[.18em] text-[#b07a17]">
                          Classes
                        </p>

                        <p className="mt-2 text-xs text-[#68716a]">
                          {wing.classes}
                        </p>
                      </div>

                      <span className="max-w-[190px] text-right text-[9px] font-semibold uppercase leading-4 tracking-[.1em] text-[#1D4ED8]">
                        {wing.staff}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          CLASSROOM
          Single background photograph + green overlay
      ===================================================== */}

      <section className="relative min-h-[620px] overflow-hidden bg-[#12324A] text-white">
        <div className="absolute inset-0">
          <ClearImage
            src="/kcmsc/media/students_at_bookfair.jpg"
            alt={t.classroomAlt}
            priority
            sizes="100vw"
            className="object-cover object-center"
          />

          <div className="absolute inset-0 bg-[#082b20]/30" />

          <div className="absolute inset-0 bg-black/15" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[620px] max-w-[1240px] items-stretch px-6 sm:px-10">
          <div className="flex w-full max-w-[520px] flex-col justify-center bg-[#12324A]/95 px-7 py-16 backdrop-blur-[2px] sm:px-10 lg:px-14">
            <p className="text-[10px] font-bold uppercase tracking-[.25em] text-[#FBBF24]">
              {t.classroomKicker}
            </p>

            <h2 className="mt-5 max-w-md font-heading text-4xl leading-[.92] tracking-[-.04em] sm:text-5xl lg:text-6xl">
              {t.classroomTitle}
            </h2>

            <p className="mt-6 max-w-lg text-sm leading-7 text-white/70">
              {t.classroomBody}
            </p>

            <div className="mt-10 grid grid-cols-2 gap-6 border-t border-white/15 pt-6">
              <div>
                <p className="text-[8px] uppercase tracking-[.16em] text-white/40">
                  {t.schoolHours}
                </p>

                <p className="mt-2 font-heading text-lg leading-tight sm:text-xl">
                  {t.schoolHoursValue}
                </p>
              </div>

              <div>
                <p className="text-[8px] uppercase tracking-[.16em] text-white/40">
                  Days
                </p>

                <p className="mt-2 font-heading text-lg leading-tight sm:text-xl">
                  {t.schoolHoursDetail}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          ACADEMIC JOURNEY
      ===================================================== */}

      <section className="border-b border-[#d9d8cf] bg-[#eae6db]">
        <div className="mx-auto max-w-[1240px] px-6 py-20 sm:px-10 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr]">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.25em] text-[#b07a17]">
                {t.journeyKicker}
              </p>

              <h2 className="mt-4 max-w-md font-heading text-4xl leading-[.94] tracking-[-.04em] text-[#12324A] sm:text-5xl">
                {t.journeyTitle}
              </h2>

              <p className="mt-6 max-w-md text-sm leading-7 text-[#68716a]">
                {t.journeyBody}
              </p>
            </div>

            <div className="border-t border-[#cbc5b7]">
              {classes.map(([name, age], index) => (
                <div
                  key={name}
                  className="grid grid-cols-[35px_1fr_auto] items-center gap-3 border-b border-[#cbc5b7] py-4 sm:grid-cols-[50px_1fr_190px]"
                >
                  <span className="text-[8px] font-bold tracking-[.15em] text-[#b07a17]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="font-heading text-lg text-[#12324A] sm:text-xl">
                    {name}
                  </span>

                  <span className="text-right text-[9px] uppercase tracking-[.1em] text-[#747b74]">
                    {age}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          RESULTS
      ===================================================== */}

      <section id="results" className="border-b border-[#d9d8cf] bg-[#fffdf8]">
        <div className="mx-auto max-w-[1240px] px-6 py-20 sm:px-10 lg:py-28">
          <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.25em] text-[#b07a17]">
                {t.resultsKicker}
              </p>

              <h2 className="mt-4 max-w-xl font-heading text-4xl leading-[.92] tracking-[-.045em] text-[#12324A] sm:text-6xl">
                {t.resultsTitle}
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-7 text-[#68716a] lg:justify-self-end">
              {t.resultsBody}
            </p>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            {results.map((result) => (
              <article
                key={result.exam}
                className="border border-[#d9d8cf] bg-[#f1eee5] p-6 sm:p-8"
              >
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#b07a17]">
                      {result.year}
                    </p>

                    <h3 className="mt-2 font-heading text-4xl text-[#12324A]">
                      {result.exam}
                    </h3>
                  </div>

                  <PassRate rate={result.rate} />
                </div>

                <div className="mt-8 grid grid-cols-3 border-t border-[#d9d8cf] pt-5">
                  {[
                    [t.appeared, result.appeared],
                    [t.passed, result.passed],
                    [t.gpa5, result.gpa],
                  ].map(([label, value], index) => (
                    <div
                      key={label}
                      className={index ? "border-l border-[#d9d8cf] pl-4" : ""}
                    >
                      <p className="text-[8px] uppercase tracking-[.13em] text-[#747b74]">
                        {label}
                      </p>

                      <p
                        className={`mt-2 font-heading text-2xl ${
                          index === 2 ? "text-[#1D4ED8]" : "text-[#12324A]"
                        }`}
                      >
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <p className="mt-5 text-[8px] font-semibold uppercase tracking-[.12em] text-[#858a83]">
            {t.resultNote}
          </p>
        </div>
      </section>

      {/* =====================================================
          CURRICULUM
      ===================================================== */}

      <section className="border-b border-white/10 bg-[#12324A] text-white">
        <div className="mx-auto max-w-[1240px] px-6 py-20 sm:px-10 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[.68fr_1.32fr]">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.25em] text-[#FBBF24]">
                {t.curriculumKicker}
              </p>

              <h2 className="mt-4 max-w-md font-heading text-4xl leading-[.93] tracking-[-.04em] sm:text-5xl">
                {t.curriculumTitle}
              </h2>

              <p className="mt-6 max-w-md text-sm leading-7 text-white/60">
                {t.curriculumBody}
              </p>
            </div>

            <div className="border-t border-white/15">
              {t.curriculumItems.map(([number, title, body]) => (
                <div
                  key={number}
                  className="grid gap-4 border-b border-white/15 py-6 sm:grid-cols-[45px_190px_1fr] sm:items-start"
                >
                  <span className="text-[9px] font-bold tracking-[.16em] text-[#FBBF24]">
                    {number}
                  </span>

                  <h3 className="font-heading text-xl">{title}</h3>

                  <p className="text-sm leading-6 text-white/55">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          ACHIEVEMENTS
      ===================================================== */}

      <section className="border-b border-[#d9d8cf] bg-[#f4f1e8]">
        <div className="mx-auto max-w-[1240px] px-6 py-20 sm:px-10 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.25em] text-[#b07a17]">
                {t.beyondKicker}
              </p>

              <h2 className="mt-4 max-w-lg font-heading text-4xl leading-[.92] tracking-[-.045em] text-[#12324A] sm:text-6xl">
                {t.beyondTitle}
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-7 text-[#68716a] lg:justify-self-end">
              {t.beyondBody}
            </p>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-[.8fr_1.2fr]">
            {/* Achievement feature image */}

            <div className="relative min-h-[360px] overflow-hidden bg-[#12324A]">
              <ClearImage
                src="/kcmsc/media/ict_olympiad_at_kc.jpg"
                alt={
                  locale === "bn"
                    ? "কেসিএমএসসির শিক্ষার্থীদের অলিম্পিয়াডে অংশগ্রহণ"
                    : "KCMSC students at an ICT Olympiad"
                }
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover object-center"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#082b20]/90 via-[#082b20]/15 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-8">
                <p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#FBBF24]">
                  {t.highlights}
                </p>

                <p className="mt-3 max-w-sm font-heading text-2xl leading-tight text-white">
                  {locale === "bn"
                    ? "শেখার সুযোগ শ্রেণিকক্ষের বাইরেও আছে।"
                    : "Another classroom begins beyond the classroom."}
                </p>
              </div>
            </div>

            {/* Achievement records */}

            <div className="border border-[#d9d8cf] bg-[#fffdf8]">
              {featuredEntries.length ? (
                featuredEntries.map((entry, index) => (
                  <article
                    key={`${entry.year}-${entry.title}-${index}`}
                    className="grid gap-4 border-b border-[#d9d8cf] p-6 last:border-b-0 sm:grid-cols-[70px_1fr_auto] sm:items-start sm:p-7"
                  >
                    <span className="font-heading text-2xl text-[#12324A]">
                      {entry.year}
                    </span>

                    <div>
                      <p className="text-[8px] font-bold uppercase tracking-[.18em] text-[#b07a17]">
                        {entry.category}
                      </p>

                      <h3 className="mt-2 font-heading text-xl leading-tight text-[#12324A]">
                        {entry.title}
                      </h3>

                      <p className="mt-2 max-w-2xl text-xs leading-5 text-[#68716a]">
                        {entry.details}
                      </p>
                    </div>

                    <span className="hidden text-[8px] font-bold uppercase tracking-[.15em] text-[#9a9f98] sm:block">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </article>
                ))
              ) : (
                <p className="p-8 text-sm leading-6 text-[#68716a]">
                  {t.noEntries}
                </p>
              )}
            </div>
          </div>

          {/* =================================================
              ACHIEVEMENT FOOTER
          ================================================= */}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#d9d8cf] pt-5">
            <p className="text-[9px] uppercase tracking-[.14em] text-[#858a83]">
              {entries.length}{" "}
              {locale === "bn" ? "টি প্রকাশিত রেকর্ড" : "published records"}
            </p>

            <Link
              href={`/${locale}/achievements`}
              className="text-[9px] font-bold uppercase tracking-[.16em] text-[#12324A] underline decoration-[#b07a17] underline-offset-4 transition hover:text-[#1D4ED8]"
            >
              {t.allAchievements} ↗
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL SCHOOL-LIFE END CAP
      ===================================================== */}

      <section className="bg-[#12324A] text-white">
        <div className="mx-auto max-w-[1240px] px-6 py-14 sm:px-10 lg:py-16">
          <div className="grid overflow-hidden border border-white/10 lg:grid-cols-[.8fr_1.2fr]">
            {/* Text panel */}

            <div className="flex flex-col justify-center bg-[#12324A] px-7 py-12 sm:px-10 lg:px-12">
              <p className="text-[10px] font-bold uppercase tracking-[.25em] text-[#FBBF24]">
                K C Model School & College
              </p>

              <h2 className="mt-5 max-w-xl font-heading text-4xl leading-[.94] tracking-[-.04em] sm:text-5xl">
                {locale === "bn"
                  ? "ফলাফলের পেছনের শিক্ষাজীবনও দেখুন।"
                  : "See the school life behind the results."}
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-white/60">
                {locale === "bn"
                  ? "শ্রেণিকক্ষ, প্রতিযোগিতা, বন্ধুত্ব ও প্রতিদিনের অভিজ্ঞতাই একটি পূর্ণ শিক্ষাজীবনের অংশ।"
                  : "Classrooms, competitions, friendships and everyday experiences are all part of the academic journey."}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={`/${locale}/student-life`}
                  className="inline-flex bg-white px-5 py-3 text-[9px] font-bold uppercase tracking-[.16em] text-[#12324A] transition hover:bg-[#FBBF24]"
                >
                  {t.studentLife}
                </Link>

                <Link
                  href={`/${locale}/admissions`}
                  className="inline-flex border border-white/30 px-5 py-3 text-[9px] font-bold uppercase tracking-[.16em] text-white transition hover:border-white hover:bg-white/5"
                >
                  {t.admissions}
                </Link>
              </div>
            </div>

            {/* Image */}

            <div className="relative min-h-[320px]">
              <ClearImage
                src="/kcmsc/media/winner.jpg"
                alt={
                  locale === "bn"
                    ? "কেসিএমএসসির শিক্ষার্থীর পুরস্কার অর্জন"
                    : "KCMSC student receiving an award"
                }
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover object-center"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-[#12324A]/55 via-transparent to-transparent" />

              <div className="absolute bottom-5 left-5 border border-white/20 bg-[#12324A]/60 px-4 py-2 backdrop-blur-sm">
                <p className="text-[8px] font-bold uppercase tracking-[.18em] text-white/75">
                  KC Model School & College
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
