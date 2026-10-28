import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { prisma } from "@/lib/db";
import TeachersDirectory from "./TeachersDirectory";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ wing?: string | string[] }>;
};

const VALID_WINGS = new Set([
  "College Wing",
  "Senior Wing",
  "Junior Wing",
  "Primary Wing",
  "Administration",
  "Unassigned",
]);

export default async function Page({ params, searchParams }: PageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();

  const query = searchParams ? await searchParams : {};
  const requestedWing = Array.isArray(query.wing) ? query.wing[0] : query.wing;
  const initialWing =
    requestedWing && VALID_WINGS.has(requestedWing) ? requestedWing : "all";

  const teachers = await prisma.teacherProfile.findMany({
    where: { isActive: true, isPublished: true },
    orderBy: [{ wing: "asc" }, { sortOrder: "asc" }, { designation: "asc" }, { name: "asc" }],
    select: { id: true, staffId: true, name: true, designation: true, wing: true, subjects: true, photoUrl: true, highestDegree: true, university: true },
  });

  return (
    <TeachersDirectory
      locale={rawLocale as Locale}
      teachers={teachers}
      initialWing={initialWing}
    />
  );
}
