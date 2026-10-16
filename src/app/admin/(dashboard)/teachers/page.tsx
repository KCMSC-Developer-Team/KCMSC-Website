import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import TeachersAdmin from "./TeachersAdmin";
export const dynamic = "force-dynamic";
export default async function TeachersAdminPage() {
  await requireAdmin();
  const teachers = await prisma.teacherProfile.findMany({ orderBy: [{ wing: "asc" }, { name: "asc" }], include: { user: { select: { id: true } } } });
  return <TeachersAdmin initialTeachers={teachers.map(t => ({ id:t.id, staffId:t.staffId, name:t.name, designation:t.designation, wing:t.wing, subjects:t.subjects, photoUrl:t.photoUrl, highestDegree:t.highestDegree, university:t.university, qualifications:t.qualifications, quote:t.quote, biography:t.biography, studentMessage:t.studentMessage, isPublished:t.isPublished, isActive:t.isActive }))} />;
}
