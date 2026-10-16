import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { prisma } from "@/lib/db";
import TeachersDirectory from "./TeachersDirectory";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const teachers = await prisma.teacherProfile.findMany({
    where: { isActive: true, isPublished: true },
    orderBy: [{ wing: "asc" }, { sortOrder: "asc" }, { designation: "asc" }, { name: "asc" }],
    select: { id: true, staffId: true, name: true, designation: true, wing: true, subjects: true, photoUrl: true, highestDegree: true, university: true },
  });
  return <TeachersDirectory locale={params.locale as Locale} teachers={teachers} />;
}
