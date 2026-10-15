import { getDictionary, isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import CareerExplorer from "./CareerExplorer";
import { sanitizeRichText } from "@/lib/rich-text";

async function getPublishedCareers() {
  try {
    return await prisma.career.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        titleEn: true,
        titleBn: true,
        descriptionEn: true,
        descriptionBn: true,
        summaryEn: true,
        summaryBn: true,
        categoryEn: true,
        categoryBn: true,
        imageData: true,
        deadline: true,
        createdAt: true,
      },
    });
  } catch {
    return null;
  }
}

export default async function CareersPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: { applied?: string; error?: string };
}) {
  if (!isLocale(params.locale)) notFound();

  const locale: Locale = params.locale;
  const page = getDictionary(locale).careersPage;
  const careers = (await getPublishedCareers())?.map((career) => ({
    ...career,
    descriptionEn: sanitizeRichText(career.descriptionEn),
    descriptionBn: sanitizeRichText(career.descriptionBn),
  })) ?? null;

  return (
    <CareerExplorer
      careers={careers}
      locale={locale}
      emptyMessage={page.empty}
      applied={searchParams?.applied}
      error={searchParams?.error}
    />
  );
}
