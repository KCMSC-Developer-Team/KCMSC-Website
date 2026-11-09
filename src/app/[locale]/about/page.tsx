import Image from "next/image";
import Link from "next/link";
import { getDictionary, isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/home/Reveal";
import { SubpageCTA, SubpageHero, SubpageIntro } from "@/components/subpage/SubpageKit";

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) notFound();

  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);
  const bn = locale === "bn";

  const milestones = bn
    ? [
        {
          year: "২০১৪",
          title: "প্রতিষ্ঠা",
          text: "আল-হাজ্জ মো. খসরু চৌধুরী (সিআইপি), নিপা গ্রুপের প্রতিষ্ঠাতা, KCMSC প্রতিষ্ঠা করেন।",
        },
        {
          year: "১ জানুয়ারি ২০১৫",
          title: "যাত্রা শুরু",
          text: "প্রতিষ্ঠানটির শিক্ষা কার্যক্রম শুরু হয় প্রায় ২,২০০ শিক্ষার্থী নিয়ে।",
        },
        {
          year: "বর্তমান",
          title: "Play Group থেকে Grade XII",
          text: "বাংলা ও ইংরেজি ভার্সনে জাতীয় শিক্ষাক্রম অনুসরণ করে Play Group থেকে Grade Twelve পর্যন্ত শিক্ষা কার্যক্রম পরিচালিত হয়।",
        },
      ]
    : [
        {
          year: "2014",
          title: "Founded",
          text: "KCMSC was founded by Al-Hajj Md. Khashru Chowdhury (CIP), founder of Nipa Group.",
        },
        {
          year: "1 January 2015",
          title: "The first day",
          text: "The school began its journey with around 2,200 students in a ten-storied campus at Prembagan, Dakshinkhan.",
        },
        {
          year: "Today",
          title: "Play Group to Grade Twelve",
          text: "KCMSC serves students from Play Group through Grade Twelve in Bangla and English Versions of the National Curriculum.",
        },
      ];

  const identity = [
    { label: "EIIN", value: "137368" },
    { label: bn ? "স্কুল কোড" : "School Code", value: "1417" },
    { label: bn ? "কলেজ কোড" : "College Code", value: "1290" },
  ];

  return (
    <div className="kc-sub-page" data-no-reveal>
      <SubpageHero
        kicker={bn ? "আমাদের পরিচয়" : "Our beginning"}
        title={bn ? "একটি বিদ্যালয়ের গল্প, শুরু থেকে আজ পর্যন্ত।" : "The story of a school, from its roots."}
        body={dict.about.body}
        image="/kcmsc/student-life/student_trip1.jpg"
        imageAlt="K C Model School and College campus"
        priority
      />

      {/* A short history */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-10">
          <SubpageIntro
            kicker={bn ? "আমাদের পথচলা" : "A short history"}
            title={bn ? "একটি সময়, একটি স্থান, একটি লক্ষ্য।" : "A beginning, a place and a clear purpose."}
            body={
              bn
                ? "কেসিএমএসসির পরিচয় তার প্রতিষ্ঠার ইতিহাস, শিক্ষার্থী এবং প্রতিদিনের শিক্ষা কার্যক্রমের সঙ্গে জড়িত।"
                : "KCMSC’s identity is tied to its founding, the students it serves, and the ordinary work of teaching and learning."
            }
          />

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {milestones.map((item, index) => (
              <Reveal key={item.year} delay={index * 120} className="h-full">
                <article className="kc-sub-panel flex h-full flex-col p-7 sm:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <span className="kc-sub-year">{item.year}</span>
                    <span className="font-heading text-3xl text-[#c9a83f]">0{index + 1}</span>
                  </div>
                  <h3 className="mt-8 font-heading text-2xl leading-snug text-[#124c36]">{item.title}</h3>
                  <p className="mt-3 flex-1 text-[15px] leading-7 text-[#58645c]">{item.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Mission and vision */}
      <section className="pb-20 lg:pb-28">
        <div className="mx-auto grid max-w-[1180px] gap-5 px-5 sm:px-8 lg:grid-cols-2 lg:px-10">
          <Reveal className="h-full">
            <div className="kc-faculty-band h-full rounded-[28px] p-9 sm:p-12 lg:p-14">
              <p className="kc-sub-hero-kicker">{bn ? "লক্ষ্য" : "Mission"}</p>
              <p className="mt-6 font-heading text-[clamp(1.9rem,3vw,3rem)] leading-[1.1] tracking-[-.02em]">
                “{dict.about.mission}”
              </p>
            </div>
          </Reveal>
          <Reveal delay={120} className="h-full">
            <div className="kc-sub-panel h-full rounded-[28px] p-9 sm:p-12 lg:p-14">
              <p className="kc-classic-kicker">{bn ? "দৃষ্টিভঙ্গি" : "Vision"}</p>
              <p className="mt-6 font-heading text-[clamp(1.9rem,3vw,3rem)] leading-[1.1] tracking-[-.02em] text-[#124c36]">
                “{dict.about.vision}”
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* People behind the school */}
      <section className="pb-20 lg:pb-28">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-10">
          <Reveal>
            <div className="grid overflow-hidden rounded-[32px] border border-[#e4e2da] bg-[#fffdf8] shadow-[var(--kc-shadow-card)] lg:grid-cols-[1.1fr_.9fr]">
              <div className="relative min-h-[300px] lg:min-h-[520px]">
                <Image
                  src="/kcmsc/about/leadership-gathering.jpg"
                  alt="KCMSC leadership and school community gathering"
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover object-center transition duration-700 ease-out hover:scale-[1.03]"
                  quality={90}
                />
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
                <p className="kc-classic-kicker">{bn ? "মানুষ ও নেতৃত্ব" : "People behind the school"}</p>
                <h2 className="kc-classic-title mt-5">
                  {bn
                    ? "একটি প্রতিষ্ঠানের পরিচয় তার মানুষদের মধ্যেও ফুটে ওঠে।"
                    : "A school is shaped by the people who serve it."}
                </h2>
                <p className="mt-6 text-[15px] leading-7 text-[#69716b]">
                  {bn
                    ? "প্রতিষ্ঠাতা, প্রশাসন ও শিক্ষক নেতৃত্ব কেসিএমএসসির শিক্ষা কার্যক্রমকে এগিয়ে নিয়ে যায়।"
                    : "The founders, administration and academic leadership form the people responsible for guiding KCMSC’s educational environment."}
                </p>
                <div className="mt-8 border-t border-[#e4e2da] pt-5 text-[12px] font-semibold uppercase tracking-[.14em] text-[#1f8a5b]">
                  {bn ? "কেসিএমএসসি · নেতৃত্ব ও কমিউনিটি" : "KCMSC · leadership and community"}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Leadership */}
      <section className="pb-20 lg:pb-28">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-10">
          <SubpageIntro
            kicker={bn ? "নেতৃত্ব" : "Leadership"}
            title={bn ? "যাঁরা প্রতিষ্ঠানটির নেতৃত্ব দেন।" : "The people who lead the institution."}
            aside={
              <p className="max-w-sm text-[15px] leading-7 text-[#69716b]">
                {bn
                  ? "প্রতিষ্ঠানের নেতৃত্বের প্রধান দায়িত্বগুলো এক নজরে।"
                  : "The institution’s principal leadership roles."}
              </p>
            }
          />

          <Reveal className="mt-12">
            <div className="overflow-hidden rounded-3xl border border-[#e4e2da] bg-[#fffdf8] shadow-[var(--kc-shadow-card)]">
              {dict.leadership.map((person, index) => (
                <div
                  key={person.name}
                  className="kc-sub-row grid items-center gap-3 border-t border-[#e4e2da] px-6 py-6 first:border-t-0 sm:grid-cols-[72px_1fr_auto] sm:px-10"
                >
                  <span className="text-xs font-bold tracking-[.14em] text-[#1f8a5b]">0{index + 1}</span>
                  <div>
                    <p className="font-heading text-2xl text-[#124c36]">{person.name}</p>
                    <p className="mt-1 text-sm text-[#69716b]">{person.role}</p>
                  </div>
                  <span className="hidden text-[12px] font-semibold uppercase tracking-[.16em] text-[#c9a83f] sm:block">
                    KCMSC
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Trustee board */}
      <section className="pb-20 lg:pb-28">
        <div className="mx-auto grid max-w-[1180px] gap-10 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:items-start lg:px-10">
          <Reveal>
            <p className="kc-classic-kicker">{bn ? "ট্রাস্টি বোর্ড" : "Trustee board"}</p>
            <h2 className="kc-classic-title mt-3">{dict.trusteeBoard.heading}</h2>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {dict.trusteeBoard.members.map((member, index) => (
              <Reveal key={member.name} delay={index * 80} className="h-full">
                <div className="kc-sub-panel flex h-full items-start gap-4 p-6">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#e3f2e9] font-heading text-lg text-[#176b45]">
                    0{index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium text-[#26382f]">{member.name}</p>
                    <p className="mt-1 text-sm text-[#69716b]">{member.designation}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Official identification */}
      <section className="pb-20 lg:pb-28">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-10">
          <SubpageIntro
            kicker={bn ? "প্রাতিষ্ঠানিক পরিচিতি" : "Official identification"}
            title={bn ? "প্রাতিষ্ঠানিক তথ্য" : "Institutional information"}
            body={
              bn
                ? "প্রতিষ্ঠানটির পরিচিতিমূলক তথ্য ও কোড।"
                : "Official identification details for K C Model School & College."
            }
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {identity.map((item, index) => (
              <Reveal key={item.label} delay={index * 120} className="h-full">
                <div className="kc-sub-panel relative h-full overflow-hidden p-7 sm:p-8">
                  <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#27a872] to-[#176b45]" aria-hidden="true" />
                  <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#69716b]">{item.label}</p>
                  <p className="mt-4 font-heading text-4xl tabular-nums text-[#176b45]">{item.value}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <SubpageCTA
        kicker={bn ? "আরও জানুন" : "Continue exploring"}
        title={
          bn
            ? "শিক্ষা ও দৈনন্দিন কার্যক্রমের মাধ্যমে কেসিএমএসসিকে আরও কাছ থেকে দেখুন।"
            : "See KCMSC through its teaching and everyday school life."
        }
        actions={
          <>
            <Link href={`/${locale}/academics`} className="kc-classic-button kc-classic-button-light">
              {bn ? "শিক্ষাব্যবস্থা" : "Academics"}
            </Link>
            <Link href={`/${locale}/student-life`} className="kc-classic-button kc-classic-button-ghost-light">
              {bn ? "শিক্ষাজীবন" : "Student life"}
            </Link>
          </>
        }
      />
    </div>
  );
}
