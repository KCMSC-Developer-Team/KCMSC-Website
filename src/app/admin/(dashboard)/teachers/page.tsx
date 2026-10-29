import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import TeachersAdmin from "./TeachersAdmin";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const PAGE_SIZES = [10, 20, 50, 100] as const;

export default async function TeachersAdminPage({ searchParams }: {
  searchParams: Promise<{ page?: string; pageSize?: string; q?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const query = (params.q || "").trim().slice(0, 100);
  const requestedSize = Number(params.pageSize);
  const pageSize = PAGE_SIZES.includes(requestedSize as (typeof PAGE_SIZES)[number]) ? requestedSize : 20;
  const where = query ? { OR: [
    { name: { contains: query, mode: "insensitive" as const } },
    { staffId: { contains: query, mode: "insensitive" as const } },
    { designation: { contains: query, mode: "insensitive" as const } },
    { wing: { contains: query, mode: "insensitive" as const } },
    { subjects: { has: query } },
  ] } : {};
  const total = await prisma.teacherProfile.count({ where });
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const requestedPage = Math.max(1, Number.parseInt(params.page || "1", 10) || 1);
  const page = Math.min(requestedPage, pageCount);
  if (requestedPage !== page) {
    const search = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (query) search.set("q", query);
    redirect(`/admin/teachers?${search.toString()}`);
  }
  const teachers = await prisma.teacherProfile.findMany({
    where,
    orderBy: [{ wing: "asc" }, { name: "asc" }, { id: "asc" }],
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
  return <TeachersAdmin
    key={`${page}:${pageSize}:${query}`}
    initialTeachers={teachers.map(t => ({ id:t.id, staffId:t.staffId, name:t.name, designation:t.designation, wing:t.wing, subjects:t.subjects, photoUrl:t.photoUrl, highestDegree:t.highestDegree, university:t.university, qualifications:t.qualifications, quote:t.quote, biography:t.biography, studentMessage:t.studentMessage, isPublished:t.isPublished, isActive:t.isActive }))}
    total={total}
    page={page}
    pageSize={pageSize}
    pageCount={pageCount}
    query={query}
  />;
}
