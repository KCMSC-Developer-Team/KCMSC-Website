import type { Locale } from "@/i18n/config";
import { HeroVideoStage } from "./HeroVideoStage";

const copy = {
  en: {
    kicker: "K C Model School & College",
    title: "Learning that moves with life.",
    body: "A school community built around learning, curiosity, character and participation.",
  },
  bn: {
    kicker: "কে সি মডেল স্কুল অ্যান্ড কলেজ",
    title: "শেখা, যা জীবনের সঙ্গে এগিয়ে চলে।",
    body: "শেখা, কৌতূহল, চরিত্র ও অংশগ্রহণকে ঘিরে গড়ে ওঠা একটি শিক্ষাঙ্গন।",
  },
} as const;

/**
 * Pinned full-viewport campus video used as the landing hero. Shown instead of
 * the slideshow when LANDING_HERO is "video" (see LandingExperience.tsx).
 */
export function HeroVideo({ locale }: { locale: Locale }) {
  const c = copy[locale === "bn" ? "bn" : "en"];
  return <HeroVideoStage kicker={c.kicker} title={c.title} body={c.body} />;
}

export default HeroVideo;
