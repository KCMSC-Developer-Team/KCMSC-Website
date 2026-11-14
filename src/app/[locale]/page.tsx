import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { LandingExperience } from "@/components/home/LandingExperience";

export const dynamic = "force-dynamic";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  if (!isLocale((await params).locale)) notFound();
  const locale: Locale = (await params).locale as Locale;
  const notices = await prisma.notice.findMany({
    where: { isPublished: true, noticeAt: { not: null }, imageUrls: { isEmpty: false } },
    orderBy: [{ noticeAt: "desc" }, { publishedAt: "desc" }],
    take: 3,
  });
  const alumni = await prisma.alumniMessage.findMany({
    where: { isPublished: true, isFeatured: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    take: 3,
  });
  const faculty = await prisma.teacherProfile.findMany({
    where: { isActive: true, isPublished: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { id: true, name: true, designation: true, wing: true, photoUrl: true, subjects: true },
    take: 30,
  });
  return <LandingExperience locale={locale} alumni={alumni} faculty={faculty} notices={notices} />;
}
