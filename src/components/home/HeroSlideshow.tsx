"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Slide = { image: string; kicker: string; title: string; body: string };
const slides: Slide[] = [
  { image: "/kcmsc/media/kcmsc1.jpg", kicker: "K C Model School & College", title: "Learning that moves with life.", body: "A school community built around learning, curiosity, character and participation." },
  { image: "/kcmsc/media/teacher_taking_class.jpg", kicker: "Academics", title: "A place to learn deeply.", body: "From the early years to higher secondary education, students learn within a structured academic environment." },
  { image: "/kcmsc/media/students_at_bookfair.jpg", kicker: "Student Life", title: "More than the classroom.", body: "Reading, culture, sport, clubs and shared experiences are part of everyday school life." },
  { image: "/kcmsc/media/kc_team_representing_at_AIUB.jpg", kicker: "Participation", title: "Learn. Take part. Grow.", body: "Students are encouraged to explore their interests and take part in activities beyond their regular lessons." },
];
const slidesBn: Slide[] = [
  { image: "/kcmsc/media/kcmsc1.jpg", kicker: "কে সি মডেল স্কুল অ্যান্ড কলেজ", title: "শেখা, যা জীবনের সঙ্গে এগিয়ে চলে।", body: "শেখা, কৌতূহল, চরিত্র ও অংশগ্রহণকে ঘিরে গড়ে ওঠা একটি শিক্ষাঙ্গন।" },
  { image: "/kcmsc/media/teacher_taking_class.jpg", kicker: "শিক্ষা", title: "গভীরভাবে শেখার একটি পরিবেশ।", body: "প্রাথমিক স্তর থেকে উচ্চমাধ্যমিক পর্যন্ত শিক্ষার্থীরা একটি সুসংগঠিত একাডেমিক পরিবেশে শেখে।" },
  { image: "/kcmsc/media/students_at_bookfair.jpg", kicker: "শিক্ষাজীবন", title: "শ্রেণিকক্ষের বাইরেও শেখা।", body: "পাঠাভ্যাস, সংস্কৃতি, খেলাধুলা, ক্লাব ও নানা অভিজ্ঞতা স্কুল জীবনের অংশ।" },
  { image: "/kcmsc/media/kc_team_representing_at_AIUB.jpg", kicker: "অংশগ্রহণ", title: "শিখুন। অংশ নিন। এগিয়ে যান।", body: "শিক্ষার্থীদের নিয়মিত পড়াশোনার পাশাপাশি নিজেদের আগ্রহ ও দক্ষতা বিকাশে অংশ নিতে উৎসাহিত করা হয়।" },
];

export function HeroSlideshow({ locale = "en" }: { locale?: string }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const copy = (locale === "bn" ? slidesBn : slides)[active] ?? slides[0]!;

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % slides.length), 6000);
    return () => window.clearInterval(timer);
  }, [paused]);

  const previous = () => setActive((value) => (value - 1 + slides.length) % slides.length);
  const next = () => setActive((value) => (value + 1) % slides.length);

  return (
    <section className="kc-home-hero" aria-label="KCMSC highlights" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="kc-home-hero-frame">
        {slides.map((item, index) => (
          <div key={item.image} className={`kc-home-hero-slide ${index === active ? "is-active" : ""}`} aria-hidden={index !== active}>
            <Image src={item.image} alt="" fill priority={index === 0} sizes="(max-width: 640px) 100vw, 100vw" className="object-cover" />
          </div>
        ))}
        <div className="kc-home-hero-shade" />
        <div className="kc-home-hero-content">
          <div className="kc-home-hero-copy" key={`${locale}-${active}`}>
            <p className="kc-home-hero-kicker"><span>{copy.kicker}</span><i /></p>
            <h1>{copy.title}</h1>
            <p className="kc-home-hero-description">{copy.body}</p>
          </div>
          <div className="kc-home-hero-controls">
            <div className="kc-home-hero-dots" aria-label="Choose slide">
              {slides.map((item, index) => <button key={item.image} type="button" onClick={() => setActive(index)} aria-label={`Go to slide ${index + 1}`} aria-current={index === active} className={index === active ? "is-active" : ""} />)}
            </div>
            <div className="kc-home-hero-arrows">
              <button type="button" onClick={previous} aria-label="Previous slide">←</button>
              <button type="button" onClick={next} aria-label="Next slide">→</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default HeroSlideshow;
