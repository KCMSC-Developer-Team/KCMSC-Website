"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Slide = {
  image: string;
  kicker: string;
  title: string;
  body: string;
};

const slides: Slide[] = [
  {
    image: "/kcmsc/media/kcmsc1.jpg",
    kicker: "K C Model School & College",
    title: "Learning that moves with life.",
    body: "A school community built around learning, curiosity, character and participation.",
  },
  {
    image: "/kcmsc/media/teacher_taking_class.jpg",
    kicker: "Academics",
    title: "A place to learn deeply.",
    body: "From the early years to higher secondary education, students learn within a structured academic environment.",
  },
  {
    image: "/kcmsc/media/students_at_bookfair.jpg",
    kicker: "Student Life",
    title: "More than the classroom.",
    body: "Reading, culture, sport, clubs and shared experiences are part of everyday school life.",
  },
  {
    image: "/kcmsc/media/kc_team_representing_at_AIUB.jpg",
    kicker: "Participation",
    title: "Learn. Take part. Grow.",
    body: "Students are encouraged to explore their interests and take part in activities beyond their regular lessons.",
  },
];

const bn: Slide[] = [
  {
    image: "/kcmsc/media/kcmsc1.jpg",
    kicker: "কে সি মডেল স্কুল অ্যান্ড কলেজ",
    title: "শেখা, যা জীবনের সঙ্গে এগিয়ে চলে।",
    body: "শেখা, কৌতূহল, চরিত্র ও অংশগ্রহণকে ঘিরে গড়ে ওঠা একটি শিক্ষাঙ্গন।",
  },
  {
    image: "/kcmsc/media/teacher_taking_class.jpg",
    kicker: "শিক্ষা",
    title: "গভীরভাবে শেখার একটি পরিবেশ।",
    body: "প্রাথমিক স্তর থেকে উচ্চমাধ্যমিক পর্যন্ত শিক্ষার্থীরা একটি সুসংগঠিত একাডেমিক পরিবেশে শেখে।",
  },
  {
    image: "/kcmsc/media/students_at_bookfair.jpg",
    kicker: "শিক্ষাজীবন",
    title: "শ্রেণিকক্ষের বাইরেও শেখা।",
    body: "পাঠাভ্যাস, সংস্কৃতি, খেলাধুলা, ক্লাব ও নানা অভিজ্ঞতা স্কুল জীবনের অংশ।",
  },
  {
    image: "/kcmsc/media/kc_team_representing_at_AIUB.jpg",
    kicker: "অংশগ্রহণ",
    title: "শিখুন। অংশ নিন। এগিয়ে যান।",
    body: "শিক্ষার্থীদের নিয়মিত পড়াশোনার পাশাপাশি নিজেদের আগ্রহ ও দক্ষতা বিকাশে অংশ নিতে উৎসাহিত করা হয়।",
  },
];

type HeroSlideshowProps = {
  locale?: string;
};

export function HeroSlideshow({ locale = "en" }: HeroSlideshowProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  /*
   * The arrays are non-empty, but TypeScript cannot infer that
   * from normal array indexing. The fallback keeps the type safe.
   */
  const slide: Slide = slides[active] ?? slides[0]!;

  const copy: Slide = locale === "bn" ? (bn[active] ?? bn[0] ?? slide) : slide;

  useEffect(() => {
    if (paused) return;

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [paused]);

  const previousSlide = () => {
    setActive((current) => (current === 0 ? slides.length - 1 : current - 1));
  };

  const nextSlide = () => {
    setActive((current) => (current + 1) % slides.length);
  };

  return (
    <section
      className="relative overflow-hidden bg-black px-3 pb-3 pt-3 sm:px-5 sm:pb-5 sm:pt-5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative min-h-[500px] overflow-hidden rounded-[1.5rem] sm:min-h-[620px] lg:min-h-[680px]">
        {slides.map((item, index) => (
          <div
            key={item.image}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === active ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={index !== active}
          >
            <Image
              src={item.image}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/20" />
          </div>
        ))}

        <div className="relative z-10 flex min-h-[500px] items-end sm:min-h-[620px] lg:min-h-[680px]">
          <div className="w-full px-6 pb-10 sm:px-10 sm:pb-14 lg:px-16 lg:pb-16">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.18em] text-white/70">
                <span>{copy.kicker}</span>
                <span className="h-px w-8 bg-white/40" />
              </div>

              <h1 className="mt-5 max-w-xl font-heading text-[clamp(2.35rem,8vw,5.8rem)] font-normal leading-[0.96] tracking-[-0.04em] text-white sm:mt-7">
                {copy.title}
              </h1>

              <p className="mt-5 max-w-md text-[13px] leading-6 text-white/75 sm:mt-6 sm:text-[14px] sm:leading-7">
                {copy.body}
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between sm:mt-10">
              <div className="flex items-center gap-2">
                {slides.map((item, index) => (
                  <button
                    key={item.image}
                    type="button"
                    onClick={() => setActive(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-current={index === active}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === active
                        ? "w-8 bg-white"
                        : "w-1.5 bg-white/45 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={previousSlide}
                  aria-label="Previous slide"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/10 text-white backdrop-blur-sm transition hover:bg-white/15"
                >
                  <span aria-hidden="true">←</span>
                </button>

                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next slide"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/10 text-white backdrop-blur-sm transition hover:bg-white/15"
                >
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSlideshow;
