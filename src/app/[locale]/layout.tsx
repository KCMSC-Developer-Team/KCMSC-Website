import type { Metadata } from "next";
import {
  isLocale,
  defaultLocale,
  getDictionary,
  type Locale,
} from "@/i18n/config";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { notFound } from "next/navigation";
import { Noto_Sans_Bengali, Noto_Serif_Bengali } from "next/font/google";
import { prisma } from "@/lib/db";
import { SiteNotification } from "@/components/layout/SiteNotification";
import { NoticeTicker } from "@/components/layout/NoticeTicker";
import { KnowledgeQuiz } from "@/components/engagement/KnowledgeQuiz";
import { FloatingWhatsAppButton } from "@/components/layout/FloatingWhatsAppButton";
import { ScrollEffects } from "@/components/motion/ScrollEffects";
import { SpeedInsights } from "@vercel/speed-insights/next";

const banglaSans = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bangla",
});

const banglaSerif = Noto_Serif_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bangla-heading",
});

// Knowledge quiz is hidden for now. Set to true to show it again.
const SHOW_KNOWLEDGE_QUIZ = false;

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "bn" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getDictionary(locale);
  return {
    title: dict.site.name,
    description: dict.about.body,
  };
}

// The newest published popup notice (with photos). Popups are never shown on the top bar.
async function getPopupNotice() {
  try {
    return await prisma.notice.findFirst({
      where: { isPublished: true, isImportant: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        titleEn: true,
        titleBn: true,
        bodyEn: true,
        bodyBn: true,
        imageUrls: true,
        noticeAt: true,
        publishedAt: true,
        updatedAt: true,
      },
    });
  } catch {
    return null;
  }
}

// Published text notices, shown as a scrolling title on the top bar.
async function getTopBarNotices() {
  try {
    return await prisma.notice.findMany({
      where: { isPublished: true, isImportant: false },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 10,
      select: { id: true, titleEn: true, titleBn: true },
    });
  } catch {
    return [];
  }
}

function displayAt(notice: { noticeAt: Date | null; publishedAt: Date | null }) {
  const date = notice.noticeAt ?? notice.publishedAt;
  return date ? date.toISOString() : null;
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;

  const [popupRaw, topBarRaw] = await Promise.all([
    getPopupNotice(),
    getTopBarNotices(),
  ]);

  const popup = popupRaw
    ? {
        id: popupRaw.id,
        titleEn: popupRaw.titleEn,
        titleBn: popupRaw.titleBn,
        bodyEn: popupRaw.bodyEn,
        bodyBn: popupRaw.bodyBn,
        imageUrls: popupRaw.imageUrls ?? [],
        displayAt: displayAt(popupRaw),
        updatedAt: popupRaw.updatedAt.toISOString(),
      }
    : null;

  return (
    <div
      lang={locale}
      className={`${locale === "bn" ? "font-bangla" : "font-sans"} ${banglaSans.variable} ${banglaSerif.variable}`}
    >
      <ScrollEffects progress />
      <SiteNotification locale={locale} notification={popup} />
      <NoticeTicker locale={locale} notices={topBarRaw} />
      <Navbar locale={locale} />
      <main className="kc-public-layout">{children}</main>
      <Footer locale={locale} />
      {SHOW_KNOWLEDGE_QUIZ && <KnowledgeQuiz locale={locale} />}
      <FloatingWhatsAppButton />
      <SpeedInsights />
    </div>
  );
}
