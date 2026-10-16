import Image from "next/image";
import Link from "next/link";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

type FacilityEntry = { title: string; description: string };

async function getFacilityEntries(locale: Locale): Promise<FacilityEntry[]> {
  try {
    const rows = await prisma.facility.findMany({
      orderBy: [{ isFeatured: "desc" }, { createdAt: "asc" }],
    });
    if (rows.length > 0) {
      return rows.map((f) => ({
        title: locale === "bn" ? f.titleBn : f.titleEn,
        description: locale === "bn" ? f.descriptionBn : f.descriptionEn,
      }));
    }
  } catch {
    // Use the built-in institutional content when the CMS is unavailable.
  }
  return [];
}

const copy = {
  en: {
    eyebrow: "THE KCMSC CAMPUS",
    title: "A campus built around school life.",
    intro:
      "K C Model School & College brings teaching, student activities and everyday school services together on a ten-storied campus in Dakshinkhan, Dhaka.",
    location: "275 Prembagan · Dakshinkhan · Dhaka",
    campusKicker: "THE CAMPUS",
    campusTitle: "A school campus should feel lived in.",
    campusBody:
      "From the central interior spaces to classrooms, libraries, laboratories and rooftop gardens, the campus is designed around the ordinary rhythm of school: arriving, learning, meeting friends, reading, practising and going home.",
    learningKicker: "01 · LEARNING",
    learningTitle: "Rooms made for teaching.",
    learningBody:
      "Classrooms have natural light and ventilation, with projector- and laptop-supported teaching. Dedicated science laboratories support Physics, Chemistry and Biology, while computer laboratories provide 50+ PCs and high-speed internet.",
    libraryKicker: "02 · READING",
    libraryTitle: "A place to read, study and stay curious.",
    libraryBody:
      "KCMSC maintains library facilities for primary and secondary students, with more than 10,000 books and digital resources listed for the institution.",
    gardenKicker: "03 · ROOFTOP GARDENS",
    gardenTitle: "Green space above the classroom.",
    gardenBody:
      "Rooftop gardens are maintained across four ten-storied buildings. Students plant and care for trees, including fruit-bearing trees, vegetables and flowering plants.",
    factsKicker: "AT A GLANCE",
    factsTitle: "What is here.",
    facts: [
      ["10", "stories across the main campus buildings"],
      ["50+", "PCs in the air-conditioned computer laboratories"],
      ["10,000+", "books and digital resources"],
      ["4", "rooftop gardens maintained by the school"],
    ],
    supportKicker: "EVERYDAY SERVICES",
    supportTitle: "The details that keep a school running.",
    supportBody:
      "The campus also provides transportation, residential facilities, childcare and day-care support, water purification, backup power, ventilation and CCTV-supported security.",
    services: [
      "Transportation",
      "Residential facilities",
      "Childcare and day care",
      "Water purification",
      "Backup generator",
      "CCTV-supported security",
    ],
    closingKicker: "VISIT KCMSC",
    closingTitle: "See the school as it is used every day.",
    closingBody:
      "For admissions, school notices or office enquiries, continue to the relevant section of the site.",
    admissions: "Admissions",
    contact: "Contact the school",
  },
  bn: {
    eyebrow: "কেসিএমএসসি ক্যাম্পাস",
    title: "স্কুলজীবনের প্রয়োজনকে সামনে রেখে গড়ে ওঠা একটি ক্যাম্পাস।",
    intro:
      "কে সি মডেল স্কুল অ্যান্ড কলেজের দশতলা ক্যাম্পাসে পাঠদান, শিক্ষার্থীদের কার্যক্রম ও দৈনন্দিন স্কুলসেবা পরিচালিত হয়।",
    location: "২৭৫ প্রেমবাগান · দক্ষিণখান · ঢাকা",
    campusKicker: "ক্যাম্পাস",
    campusTitle: "একটি স্কুলের ক্যাম্পাসে পড়াশোনার পাশাপাশি স্কুলজীবনেরও ছাপ থাকা দরকার।",
    campusBody:
      "শ্রেণিকক্ষ, লাইব্রেরি, ল্যাবরেটরি ও ছাদবাগানসহ পুরো ক্যাম্পাসটি শিক্ষার্থীদের প্রতিদিনের স্কুলজীবনের প্রয়োজনকে ঘিরে সাজানো। এখানে তারা আসে, শেখে, বন্ধুদের সঙ্গে সময় কাটায়, অনুশীলন করে এবং দিনের শেষে বাড়ি ফেরে।",
    learningKicker: "০১ · শিক্ষা",
    learningTitle: "পাঠদানের উপযোগী শ্রেণিকক্ষ।",
    learningBody:
      "শ্রেণিকক্ষে পর্যাপ্ত আলো ও বায়ু চলাচলের ব্যবস্থা রয়েছে। প্রজেক্টর ও ল্যাপটপের সহায়তায় পাঠদান করা হয়। পাশাপাশি পদার্থবিজ্ঞান, রসায়ন ও জীববিজ্ঞানের ল্যাবরেটরি এবং ৫০টির বেশি কম্পিউটার ও উচ্চগতির ইন্টারনেটসহ কম্পিউটার ল্যাব রয়েছে।",
    libraryKicker: "০২ · পাঠাভ্যাস",
    libraryTitle: "পড়াশোনা ও পাঠাভ্যাসের জন্য আলাদা ব্যবস্থা।",
    libraryBody:
      "প্রাইমারি ও সেকেন্ডারি শিক্ষার্থীদের জন্য লাইব্রেরি সুবিধা রয়েছে। প্রতিষ্ঠানে ১০,০০০-এর বেশি বই ও বিভিন্ন ডিজিটাল রিসোর্স রয়েছে।",
    gardenKicker: "০৩ · ছাদবাগান",
    gardenTitle: "ক্যাম্পাসের ওপরে সবুজের এক টুকরো জায়গা।",
    gardenBody:
      "চারটি দশতলা ভবনের ছাদে বাগান রয়েছে। শিক্ষার্থীরা ফলের গাছ, সবজি ও ফুলের গাছ লাগানো ও পরিচর্যার কাজে অংশ নেয়।",
    factsKicker: "এক নজরে",
    factsTitle: "ক্যাম্পাসে যা রয়েছে।",
    facts: [
      ["১০", "মূল ক্যাম্পাস ভবনের তলা"],
      ["৫০+", "কম্পিউটার ল্যাবের কম্পিউটার"],
      ["১০,০০০+", "বই ও ডিজিটাল রিসোর্স"],
      ["৪", "ছাদবাগান"],
    ],
    supportKicker: "দৈনন্দিন সেবা",
    supportTitle: "প্রতিদিনের প্রয়োজনীয় সেবাগুলোও এখানে রয়েছে।",
    supportBody:
      "পরিবহন, আবাসিক সুবিধা, চাইল্ডকেয়ার ও ডে-কেয়ার, পানি বিশুদ্ধকরণ, ব্যাকআপ বিদ্যুৎ এবং সিসিটিভি নিরাপত্তার ব্যবস্থাও রয়েছে।",
    services: ["পরিবহন", "আবাসিক সুবিধা", "চাইল্ডকেয়ার ও ডে-কেয়ার", "পানি বিশুদ্ধকরণ", "ব্যাকআপ জেনারেটর", "সিসিটিভি নিরাপত্তা"],
    closingKicker: "কেসিএমএসসি",
    closingTitle: "একটি স্কুলকে তার প্রতিদিনের কাজের মধ্যেই সবচেয়ে ভালোভাবে চেনা যায়।",
    closingBody: "ভর্তি, নোটিশ ও অফিস-সংক্রান্ত তথ্যের জন্য ওয়েবসাইটের সংশ্লিষ্ট বিভাগগুলো দেখুন।",
    admissions: "ভর্তি",
    contact: "যোগাযোগ",
  },
} as const;

export default async function FacilitiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const lang: Locale = locale;
  const c = copy[lang];
  const dbFacilities = await getFacilityEntries(lang);
  const facilityItems = dbFacilities.length
    ? dbFacilities.map((item) => item.title + (item.description ? ` — ${item.description}` : ""))
    : [
        "Air-conditioned computer laboratories with 50+ PCs and high-speed internet",
        "Science laboratories for Physics, Chemistry and Biology",
        "Library with 10,000+ books and digital resources",
        "Sports facilities and co-curricular activities",
        "ICT, robotics and coding activities",
        "Music Club, Language Club and Scout activities",
        "Conference room and day-care room",
        "Transportation and residential facilities",
        "Water purification and backup power",
        "CCTV-supported campus security",
      ];

  return (
    <main className="bg-[#F8FAFC] text-[#183e30]">
      {/* Opening image: let the campus photograph do the work. */}
      <section className="kc-feature-hero relative min-h-[78svh] overflow-hidden bg-[#12382b] text-[#f7f1e6]">
        <Image
          src="/kcmsc/media/kcmsc3.jpg"
          alt="Interior of K C Model School & College"
          fill
          priority
          sizes="100vw"
          quality={92}
          className="object-cover object-[50%_48%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,39,29,.82)_0%,rgba(8,39,29,.46)_44%,rgba(8,39,29,.12)_78%,rgba(8,39,29,.25)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 border-t border-white/20">
          <div className="mx-auto grid max-w-[1440px] gap-8 px-6 py-7 sm:px-10 lg:grid-cols-[1fr_auto] lg:px-14">
            <div>
              <p className="kc-light-kicker">{c.eyebrow}</p>
              <h1 className="mt-4 max-w-5xl font-heading text-[clamp(2.55rem,7vw,7.6rem)] leading-[.86] tracking-[-.055em]">
                {c.title}
              </h1>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">{c.intro}</p>
            </div>
            <p className="self-end border-l border-[#cbb56d]/70 pl-4 text-[10px] font-semibold uppercase tracking-[.17em] text-[#e2d18a] lg:mb-1">
              {c.location}
            </p>
          </div>
        </div>
      </section>

      {/* A single statement, followed by one strong architectural image. */}
      <section className="bg-[#F8FAFC]">
        <div className="mx-auto grid max-w-[1240px] gap-12 px-6 py-20 sm:px-10 sm:py-24 lg:grid-cols-[.55fr_1.45fr] lg:px-12 lg:py-28">
          <div>
            <p className="kc-classic-kicker">{c.campusKicker}</p>
          </div>
          <div>
            <h2 className="max-w-5xl font-heading text-[clamp(2.2rem,5.3vw,5.8rem)] leading-[.9] tracking-[-.05em]">{c.campusTitle}</h2>
            <p className="mt-7 max-w-3xl text-[15px] leading-8 text-[#64748B] sm:text-base">{c.campusBody}</p>
          </div>
        </div>
        <div className="relative mx-auto max-w-[1440px] overflow-hidden">
          <div className="relative aspect-[16/7] min-h-[250px] lg:min-h-[320px]">
            <Image
              src="/kcmsc/media/kcmsc1.jpg"
              alt="K C Model School & College campus building"
              fill
              sizes="(min-width: 1440px) 1440px, 100vw"
              quality={94}
              className="object-cover object-[50%_58%]"
            />
          </div>
          <div className="absolute bottom-0 left-0 bg-[#F8FAFC] px-5 py-3 text-[9px] font-semibold uppercase tracking-[.18em] text-[#52645a] sm:px-7">
            K C Model School & College · Campus
          </div>
        </div>
      </section>

      {/* Three places, three photographs, no card wall. */}
      <section className="bg-[#e9e2d6]">
        <div className="mx-auto max-w-[1440px] px-6 py-16 sm:px-10 sm:py-20 lg:px-14 lg:py-24">
          <div className="grid gap-20 lg:grid-cols-12 lg:gap-x-12">
            <article className="lg:col-span-7">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src="/kcmsc/media/teacher_taking_class.jpg" alt="Students in a KCMSC classroom" fill sizes="(min-width: 1024px) 58vw, 100vw" quality={92} className="object-cover" />
              </div>
              <div className="mt-7 max-w-2xl">
                <p className="kc-classic-kicker">{c.learningKicker}</p>
                <h3 className="mt-3 font-heading text-[clamp(2rem,4vw,4rem)] leading-[.94] tracking-[-.04em]">{c.learningTitle}</h3>
                <p className="mt-5 text-sm leading-7 text-[#64748B] sm:text-base">{c.learningBody}</p>
              </div>
            </article>

            <article className="lg:col-span-4 lg:col-start-9 lg:mt-28">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src="/kcmsc/media/students_at_library.jpg" alt="Students at the KCMSC library" fill sizes="(min-width: 1024px) 33vw, 100vw" quality={92} className="object-cover" />
              </div>
              <div className="mt-7">
                <p className="kc-classic-kicker">{c.libraryKicker}</p>
                <h3 className="mt-3 font-heading text-[clamp(2rem,3.2vw,3.2rem)] leading-[.96] tracking-[-.035em]">{c.libraryTitle}</h3>
                <p className="mt-5 text-sm leading-7 text-[#64748B]">{c.libraryBody}</p>
              </div>
            </article>

            <article className="lg:col-span-8 lg:col-start-3 lg:mt-4">
              <div className="relative aspect-[16/8] overflow-hidden">
                <Image src="/kcmsc/media/rooftop_garden.jpg" alt="KCMSC rooftop garden" fill sizes="(min-width: 1024px) 67vw, 100vw" quality={92} className="object-cover" />
              </div>
              <div className="mt-7 grid gap-6 sm:grid-cols-[.45fr_1fr]">
                <p className="kc-classic-kicker">{c.gardenKicker}</p>
                <div>
                  <h3 className="font-heading text-[clamp(2rem,4vw,4rem)] leading-[.94] tracking-[-.04em]">{c.gardenTitle}</h3>
                  <p className="mt-5 max-w-2xl text-sm leading-7 text-[#64748B] sm:text-base">{c.gardenBody}</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Facts, deliberately restrained. */}
      <section className="bg-[#12382b] text-[#f7f1e6]">
        <div className="mx-auto max-w-[1240px] px-6 py-18 sm:px-10 sm:py-24 lg:px-12 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[.45fr_1.55fr]">
            <div>
              <p className="kc-light-kicker">{c.factsKicker}</p>
              <h2 className="mt-5 max-w-md font-heading text-[clamp(2.25rem,4.8vw,5rem)] leading-[.92] tracking-[-.045em]">{c.factsTitle}</h2>
            </div>
            <div className="grid border-t border-white/20 sm:grid-cols-2">
              {c.facts.map(([number, label]) => (
                <div key={number} className="border-b border-white/20 px-0 py-8 sm:px-7 sm:py-10 sm:first:pl-0">
                  <p className="font-heading text-[clamp(2.5rem,5vw,5.5rem)] leading-none text-[#e2d18a]">{number}</p>
                  <p className="mt-3 max-w-xs text-sm leading-6 text-white/70">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F8FAFC]">
        <div className="mx-auto grid max-w-[1240px] gap-12 px-6 py-20 sm:px-10 sm:py-24 lg:grid-cols-[.65fr_1.35fr] lg:px-12 lg:py-28">
          <div>
            <p className="kc-classic-kicker">{c.supportKicker}</p>
            <h2 className="mt-5 max-w-xl font-heading text-[clamp(2.2rem,4.5vw,4.7rem)] leading-[.94] tracking-[-.04em]">{c.supportTitle}</h2>
          </div>
          <div>
            <p className="max-w-2xl text-sm leading-7 text-[#64748B] sm:text-base">{c.supportBody}</p>
            <div className="mt-9 grid border-t border-[#CBD5E1] sm:grid-cols-2">
              {c.services.map((item, index) => (
                <div key={item} className="grid grid-cols-[48px_1fr] border-b border-[#CBD5E1] py-4 text-sm text-[#354b41]">
                  <span className="font-mono text-[10px] text-[#9c8040]">{String(index + 1).padStart(2, "0")}</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#ebe4d8]">
        <div className="mx-auto max-w-[1240px] px-6 py-20 sm:px-10 sm:py-24 lg:px-12 lg:py-28">
          <div className="grid gap-10 border-y border-[#cec5b6] py-10 sm:py-14 lg:grid-cols-[1fr_.7fr] lg:items-end">
            <div>
              <p className="kc-classic-kicker">{c.closingKicker}</p>
              <h2 className="mt-5 max-w-4xl font-heading text-[clamp(2.25rem,5vw,5.2rem)] leading-[.92] tracking-[-.045em]">{c.closingTitle}</h2>
            </div>
            <div>
              <p className="max-w-xl text-sm leading-7 text-[#64748B]">{c.closingBody}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={`/${locale}/admissions`} className="kc-classic-button kc-classic-button-primary">{c.admissions}</Link>
                <Link href={`/${locale}/contact`} className="kc-classic-button kc-classic-button-outline">{c.contact}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
