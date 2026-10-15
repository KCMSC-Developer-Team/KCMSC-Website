import type { Metadata } from "next";
import { isLocale, defaultLocale, getDictionary, type Locale } from "@/i18n/config";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { notFound } from "next/navigation";
import { Noto_Sans_Bengali, Noto_Serif_Bengali } from "next/font/google";
import { prisma } from "@/lib/db";
import { SiteNotification } from "@/components/layout/SiteNotification";
import { KnowledgeQuiz } from "@/components/engagement/KnowledgeQuiz";

const banglaSans = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bangla"
});

const banglaSerif = Noto_Serif_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bangla-heading"
});

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "bn" }];
}

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const dict = getDictionary(locale);
  return {
    title: dict.site.name,
    description: dict.about.body
  };
}

async function getActiveNotification() {
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
        updatedAt: true,
      },
    });
  } catch {
    return null;
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const rawNotification = await getActiveNotification();
  const notification = rawNotification
    ? { ...rawNotification, updatedAt: rawNotification.updatedAt.toISOString() }
    : null;

  return (
    <div
      lang={locale}
      className={`${locale === "bn" ? "font-bangla" : "font-sans"} ${banglaSans.variable} ${banglaSerif.variable}`}
    >
      <SiteNotification locale={locale} notification={notification} />
      <Navbar locale={locale} />
      <main>{children}</main>
      <Footer locale={locale} />
      <KnowledgeQuiz locale={locale} />
    </div>
  );
}
