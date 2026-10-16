import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/i18n/config";
import { prisma } from "@/lib/db";

const photos = {
  hero: "/kcmsc/media/vibrant_student_life.jpg",
  culture: "/kcmsc/media/vibrant_art_culture.jpg",
  reading: "/kcmsc/media/students_at_bookfair.jpg",
  sport: "/kcmsc/media/kc_team_representing_at_AIUB.jpg",
  trip: "/kcmsc/media/student_trip1.jpg",
  garden: "/kcmsc/media/rooftop_garden.jpg",
};

type ClubEntry = { name: string; description: string };

const clubPhotos = [
  { src: "/kcmsc/media/team2.jpg", alt: "KCMSC students on a sports field" },
  { src: "/kcmsc/media/vibrant_student_culture.jpg", alt: "KCMSC students taking part in a school activity" },
  { src: "/kcmsc/media/vibrant_art_culture.jpg", alt: "KCMSC students presenting creative work" },
  { src: "/kcmsc/media/student_trip2.jpg", alt: "KCMSC students together outdoors" },
  { src: "/kcmsc/media/students_at_bookfair.jpg", alt: "KCMSC students browsing books" },
  { src: "/kcmsc/media/students_having_fun_after_sports.jpg", alt: "KCMSC students spending time together" },
];

async function getClubEntries(locale: Locale): Promise<ClubEntry[]> {
  const fallback = getDictionary(locale).clubsPage.clubs
    .filter((club) => !club.name.toLowerCase().includes("alumni") && !club.name.includes("প্রাক্তন শিক্ষার্থী"))
    .map((club) => ({ name: club.name, description: club.description }));

  try {
    const rows = await prisma.club.findMany({ orderBy: { createdAt: "asc" } });
    const entries = rows
      .map((club) => ({
        name: locale === "bn" ? club.nameBn : club.nameEn,
        description: locale === "bn" ? club.descriptionBn : club.descriptionEn,
      }))
      .filter((club) => club.name && !club.name.toLowerCase().includes("alumni") && !club.name.includes("প্রাক্তন শিক্ষার্থী"));
    return entries.length ? entries : fallback;
  } catch {
    return fallback;
  }
}

export default async function StudentLifePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const clubEntries = await getClubEntries(locale);
  const bn = locale === "bn";

  const copy = bn
    ? {
        kicker: "শিক্ষাজীবন",
        title: "স্কুলজীবন শুধু শ্রেণিকক্ষের মধ্যেই সীমাবদ্ধ নয়।",
        body: "সংস্কৃতি, খেলাধুলা, পড়াশোনা ও বিভিন্ন সহশিক্ষা কার্যক্রমে অংশ নিয়ে শিক্ষার্থীরা স্কুলজীবনের নানা অভিজ্ঞতা অর্জন করে।",
        explore: "কেসিএমএসসি সম্পর্কে",
        introKicker: "দৈনন্দিন স্কুলজীবন",
        introTitle: "পড়াশোনার পাশাপাশি নানা কাজ ও অভিজ্ঞতার মধ্য দিয়ে সময় কাটে।",
        introBody: "একটি স্কুলের জীবন শুধু ক্লাসের সময়সূচিতে সীমাবদ্ধ নয়। কেসিএমএসসিতে শিক্ষার্থীরা সাংস্কৃতিক অনুষ্ঠান, খেলাধুলা, বইমেলা, শিক্ষা সফর, ক্লাব ও বিভিন্ন প্রতিযোগিতায় অংশ নেওয়ার সুযোগ পায়।",
        culture: "সংস্কৃতি ও সৃজনশীলতা",
        cultureBody: "সাংস্কৃতিক অনুষ্ঠান, শিল্পচর্চা ও সৃজনশীল কাজ শিক্ষার্থীদের স্কুলজীবনের গুরুত্বপূর্ণ অংশ।",
        reading: "বই ও পাঠাভ্যাস",
        readingBody: "বইমেলা ও লাইব্রেরির মাধ্যমে শিক্ষার্থীরা পড়ার অভ্যাস গড়ে তোলার সুযোগ পায়।",
        sport: "খেলাধুলা",
        sportBody: "বিভিন্ন খেলাধুলা ও প্রতিযোগিতায় অংশ নিয়ে শিক্ষার্থীরা দলগতভাবে স্কুলের প্রতিনিধিত্ব করার সুযোগ পায়।",
        trip: "শিক্ষা সফর",
        tripBody: "শিক্ষা সফর ও স্কুলের বাইরের বিভিন্ন আয়োজন শিক্ষার্থীদের নতুন জায়গা ও অভিজ্ঞতার সঙ্গে পরিচিত হওয়ার সুযোগ দেয়।",
        activitiesKicker: "ক্লাব ও সহশিক্ষা কার্যক্রম",
        activitiesTitle: "নিজের আগ্রহ ও দক্ষতা বিকাশের সুযোগ",
        activitiesBody: "কেসিএমএসসিতে আইসিটি, রোবোটিক্স ও কোডিং, সংগীত, স্কাউট, ভাষা, খেলাধুলা ও সাংস্কৃতিক কার্যক্রমসহ বিভিন্ন ক্লাব রয়েছে।",
        clubs: ["ICT · Robotics · Coding", "Music", "Scout", "Language", "Sports", "Cultural Activities"],
        campusKicker: "ক্যাম্পাস",
        campusTitle: "ছাদবাগানও ক্যাম্পাসের একটি বিশেষ অংশ।",
        campusBody: "চারটি দশতলা ভবনের ছাদবাগানে শিক্ষার্থীরা গাছ লাগানো ও পরিচর্যার কাজে অংশ নেয়।",
        campusLink: "ক্যাম্পাস ও সুবিধাসমূহ দেখুন",
        finalKicker: "KCMSC",
        finalTitle: "স্কুলজীবনের প্রতিটি দিনেই শেখার ও নতুন কিছু করার সুযোগ থাকে।",
        finalBody: "ক্লাস, বন্ধু, খেলাধুলা, সংস্কৃতি ও স্কুলের নানা আয়োজন মিলেই গড়ে ওঠে দৈনন্দিন স্কুলজীবন।",
        admissions: "ভর্তি সম্পর্কে জানুন",
      }
    : {
        kicker: "STUDENT LIFE",
        title: "School days are more than classroom hours.",
        body: "Culture, sport, books, educational trips, competitions and co-curricular activities all form part of everyday life at KCMSC.",
        explore: "Discover KCMSC",
        introKicker: "LIFE AT SCHOOL",
        introTitle: "There is more to the school day than lessons.",
        introBody: "School life continues through cultural programmes, sport, reading, educational trips, clubs and competitions. These activities give students opportunities to take part, work with others and enjoy the ordinary moments of school.",
        culture: "Culture & creativity",
        cultureBody: "Cultural programmes, art and creative activities are part of the school's regular student life.",
        reading: "Books & reading",
        readingBody: "Book fairs and library spaces give students opportunities to spend time with books and develop a reading habit.",
        sport: "Sport",
        sportBody: "Students take part in sporting activities and competitions, including opportunities to represent the school as a team.",
        trip: "Educational trips",
        tripBody: "Trips and activities outside the usual school setting give students experiences beyond their everyday surroundings.",
        activitiesKicker: "CLUBS & CO-CURRICULAR ACTIVITIES",
        activitiesTitle: "Room for interests beyond the syllabus",
        activitiesBody: "The KCMSC has clubs and co-curricular activities including ICT, Robotics & Coding, Music, Scout, Language, Sports and cultural activities.",
        clubs: ["ICT · Robotics · Coding", "Music", "Scout", "Language", "Sports", "Cultural Activities"],
        campusKicker: "CAMPUS",
        campusTitle: "The rooftop gardens are part of campus life.",
        campusBody: "The school has rooftop gardens on four ten-storied buildings, with students taking part in planting and caring for trees.",
        campusLink: "View campus & facilities",
        finalKicker: "KCMSC",
        finalTitle: "The school day does not end with the last class.",
        finalBody: "Lessons, friends, sport, culture and school events all become part of the everyday experience of being a student.",
        admissions: "Admission information",
      };

  return (
    <main className="bg-[#F7F9FC] text-[#1c3d30]">
      {/* Hero: one photograph, one clear introduction. */}
      <section className="relative overflow-hidden border-b border-[#D9E2EC]">
        <div className="kc-feature-hero__visual relative h-[62vh] min-h-[420px] lg:min-h-[520px] w-full">
          <Image
            src={photos.hero}
            alt="KCMSC students taking part in school life"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B2538]/75 via-[#0B2538]/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto max-w-[1440px] px-6 pb-10 sm:px-10 sm:pb-14 lg:px-16 lg:pb-16">
              <p className="kc-light-kicker">{copy.kicker}</p>
              <h1 className="mt-4 max-w-4xl font-heading text-[clamp(2.55rem,6.5vw,6.5rem)] leading-[.91] tracking-[-.045em] text-[#f7f2e8]">
                {copy.title}
              </h1>
              <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <p className="max-w-2xl text-sm leading-7 text-white/80 sm:text-base">{copy.body}</p>
                <Link href={`/${locale}/about`} className="kc-classic-link kc-classic-link-light shrink-0">{copy.explore} <span aria-hidden="true">↗</span></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Short introduction, deliberately quiet. */}
      <section className="border-b border-[#D9E2EC] bg-[#F7F9FC]">
        <div className="mx-auto grid max-w-[1240px] gap-10 px-6 py-16 sm:px-10 sm:py-20 lg:grid-cols-[.7fr_1.3fr] lg:px-12 lg:py-24">
          <div>
            <p className="kc-classic-kicker">{copy.introKicker}</p>
          </div>
          <div>
            <h2 className="max-w-4xl font-heading text-[clamp(2.15rem,4.5vw,4.7rem)] leading-[.96] tracking-[-.035em] text-[#12324A]">{copy.introTitle}</h2>
            <p className="mt-7 max-w-3xl text-sm leading-7 text-[#64748B] sm:text-base">{copy.introBody}</p>
          </div>
        </div>
      </section>

      {/* Four activities, presented as an editorial image spread rather than four cards. */}
      <section className="bg-[#eee9df] py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[1240px] px-6 sm:px-10 lg:px-12">
          <div className="grid gap-5 lg:grid-cols-12">
            <article className="lg:col-span-7">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#D9E2EC]">
                <Image src={photos.culture} alt="KCMSC students taking part in a cultural activity" fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
              </div>
              <div className="border-t border-[#CBD5E1] pt-5">
                <p className="kc-classic-kicker">01</p>
                <h2 className="mt-2 font-heading text-3xl text-[#12324A]">{copy.culture}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">{copy.cultureBody}</p>
              </div>
            </article>

            <div className="grid gap-5 lg:col-span-5">
              <article>
                <div className="relative aspect-[16/10] overflow-hidden bg-[#D9E2EC]">
                  <Image src={photos.reading} alt="Students visiting a book fair at KCMSC" fill sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" />
                </div>
                <div className="border-t border-[#CBD5E1] pt-4">
                  <p className="kc-classic-kicker">02</p>
                  <h2 className="mt-2 font-heading text-2xl text-[#12324A]">{copy.reading}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#64748B]">{copy.readingBody}</p>
                </div>
              </article>

              <article className="grid gap-4 sm:grid-cols-[1.05fr_.95fr] sm:items-start">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#D9E2EC]">
                  <Image src={photos.sport} alt="KCMSC students representing their school in sport" fill sizes="(min-width: 1024px) 24vw, 50vw" className="object-cover" />
                </div>
                <div>
                  <p className="kc-classic-kicker">03</p>
                  <h2 className="mt-2 font-heading text-2xl text-[#12324A]">{copy.sport}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#64748B]">{copy.sportBody}</p>
                </div>
              </article>
            </div>

            <article className="mt-1 lg:col-span-12 lg:grid lg:grid-cols-[.8fr_1.2fr] lg:items-end lg:gap-8">
              <div className="relative aspect-[16/9] overflow-hidden bg-[#D9E2EC] lg:aspect-[2/1]">
                <Image src={photos.trip} alt="KCMSC students on an educational trip" fill sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover" />
              </div>
              <div className="border-t border-[#CBD5E1] pt-5 lg:pb-1">
                <p className="kc-classic-kicker">04</p>
                <h2 className="mt-2 font-heading text-3xl text-[#12324A]">{copy.trip}</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-[#64748B]">{copy.tripBody}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Clubs: typography and list, no unnecessary photograph. */}
      <section className="border-y border-[#D9E2EC] bg-[#F7F9FC]">
        <div className="mx-auto grid max-w-[1240px] gap-10 px-6 py-16 sm:px-10 sm:py-20 lg:grid-cols-[.8fr_1.2fr] lg:px-12 lg:py-24">
          <div>
            <p className="kc-classic-kicker">{copy.activitiesKicker}</p>
            <h2 className="mt-5 max-w-xl font-heading text-[clamp(2.2rem,4.5vw,4.6rem)] leading-[.97] tracking-[-.035em] text-[#12324A]">{copy.activitiesTitle}</h2>
          </div>
          <div>
            <p className="max-w-2xl text-sm leading-7 text-[#64748B] sm:text-base">{copy.activitiesBody}</p>
            <div id="clubs" className="mt-9 border-t border-[#CBD5E1]">
              {clubEntries.map((club, index) => {
                const photo = clubPhotos[index % clubPhotos.length]!;
                return (
                  <article key={`${club.name}-${index}`} className="grid gap-4 border-b border-[#CBD5E1] py-5 sm:grid-cols-[6rem_1fr] sm:items-center sm:gap-6">
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#deddd4]">
                      <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 640px) 6rem, 100vw" className="object-cover" />
                    </div>
                    <div>
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#C27A05]">{String(index + 1).padStart(2, "0")}</p>
                      <h3 className="font-heading text-xl leading-tight text-[#12324A] sm:text-2xl">{club.name}</h3>
                      {club.description ? <p className="mt-2 text-sm leading-6 text-[#64748B]">{club.description}</p> : null}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* One campus photograph, used only for the garden story. */}
      <section className="bg-[#12324A] text-white">
        <div className="mx-auto max-w-[1440px]">
          <div className="relative h-[52vh] min-h-[360px] lg:min-h-[430px] overflow-hidden">
            <Image src={photos.garden} alt="KCMSC rooftop garden and students on campus" fill sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-[#0B2538]/35" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B2538]/90 to-transparent px-6 pb-10 pt-24 sm:px-10 lg:px-16 lg:pb-14">
              <p className="kc-light-kicker">{copy.campusKicker}</p>
              <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_.75fr] lg:items-end">
                <h2 className="max-w-3xl font-heading text-[clamp(2.35rem,5vw,5rem)] leading-[.95] tracking-[-.035em] text-[#f7f2e8]">{copy.campusTitle}</h2>
                <div>
                  <p className="max-w-xl text-sm leading-7 text-white/75">{copy.campusBody}</p>
                  <Link href={`/${locale}/facilities`} className="kc-classic-link kc-classic-link-light mt-6">{copy.campusLink} <span aria-hidden="true">↗</span></Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F7F9FC]">
        <div className="mx-auto max-w-[1240px] px-6 py-16 sm:px-10 sm:py-20 lg:px-12 lg:py-24">
          <div className="grid gap-8 border-y border-[#D9E2EC] py-10 sm:py-14 lg:grid-cols-[1fr_.8fr] lg:items-end">
            <div>
              <p className="kc-classic-kicker">{copy.finalKicker}</p>
              <h2 className="mt-5 max-w-3xl font-heading text-[clamp(2.25rem,4.5vw,4.6rem)] leading-[.96] tracking-[-.035em] text-[#12324A]">{copy.finalTitle}</h2>
            </div>
            <div>
              <p className="max-w-xl text-sm leading-7 text-[#64748B] sm:text-base">{copy.finalBody}</p>
              <Link href={`/${locale}/admissions`} className="kc-classic-button kc-classic-button-primary mt-7">{copy.admissions}</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
