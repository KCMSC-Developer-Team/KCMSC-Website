import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { prisma } from "@/lib/db";
import HelpCenterExplorer from "./HelpCenterExplorer";

export default async function HelpCenterPage({ params }: { params: Promise<{ locale: string }> }) {
  if (!isLocale((await params).locale)) notFound();
  const articles = await prisma.helpArticle.findMany({ where: { isPublished: true }, orderBy: [{ sortOrder: "asc" }, { questionEn: "asc" }], select: { id: true, slug: true, questionEn: true, questionBn: true, answerEn: true, answerBn: true, categoryEn: true, categoryBn: true, isFeatured: true } });
  return <HelpCenterExplorer articles={articles} locale={(await params).locale as Locale} />;
}
