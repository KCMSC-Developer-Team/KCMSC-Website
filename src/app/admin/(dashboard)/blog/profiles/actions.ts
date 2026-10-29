"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { hashPassword } from "@/lib/password";
import { logAudit } from "@/lib/audit";

const idSchema = z.string().min(1).max(100);
const profileSchema = z.object({ displayName: z.string().trim().min(1).max(120), schoolId: z.string().trim().min(1).max(100), phone: z.string().trim().max(40), formTeacher: z.string().trim().max(120), subject: z.string().trim().max(120) });
const refresh = () => { revalidatePath("/admin"); revalidatePath("/admin/blog/profiles"); revalidatePath("/admin/blog/articles"); };

export async function updateBloggerProfile(form: FormData) {
  const admin = await requireAdmin();
  const id = String(form.get("id") || "");
  const parsed = profileSchema.safeParse(Object.fromEntries(["displayName", "schoolId", "phone", "formTeacher", "subject"].map((key) => [key, String(form.get(key) || "")] )));
  if (!idSchema.safeParse(id).success || !parsed.success) redirect("/admin/blog/profiles?error=invalid");
  const profile = await prisma.bloggerProfile.findUnique({ where: { id }, select: { userId: true } });
  if (!profile) redirect("/admin/blog/profiles?error=not-found");
  try {
    await prisma.$transaction([
      prisma.bloggerProfile.update({ where: { id }, data: { ...parsed.data, phone: parsed.data.phone || null, formTeacher: parsed.data.formTeacher || null, subject: parsed.data.subject || null } }),
      prisma.user.update({ where: { id: profile.userId }, data: { name: parsed.data.displayName } }),
    ]);
  } catch { redirect("/admin/blog/profiles?error=conflict"); }
  await logAudit({ userId: admin.id, actorLabel: admin.email, action: "UPDATE_BLOGGER_PROFILE", targetType: "BloggerProfile", targetId: id });
  refresh(); redirect("/admin/blog/profiles?updated=1");
}

export async function resetBloggerPassword(form: FormData) {
  const admin = await requireAdmin();
  const id = String(form.get("id") || "");
  const password = String(form.get("password") || "");
  const confirmation = String(form.get("confirmation") || "");
  if (!idSchema.safeParse(id).success || password.length < 10 || password.length > 100 || password !== confirmation) redirect(`/admin/blog/profiles?edit=${encodeURIComponent(id)}&error=password`);
  const profile = await prisma.bloggerProfile.findUnique({ where: { id }, select: { userId: true, schoolId: true } });
  if (!profile) redirect("/admin/blog/profiles?error=not-found");
  if (password === profile.schoolId) redirect(`/admin/blog/profiles?edit=${encodeURIComponent(id)}&error=password`);
  await prisma.user.update({ where: { id: profile.userId }, data: { passwordHash: await hashPassword(password) } });
  await logAudit({ userId: admin.id, actorLabel: admin.email, action: "RESET_BLOGGER_PASSWORD", targetType: "BloggerProfile", targetId: id });
  refresh(); redirect("/admin/blog/profiles?reset=1");
}

export async function deleteBloggerAccount(form: FormData) {
  const admin = await requireAdmin();
  const id = String(form.get("id") || "");
  if (!idSchema.safeParse(id).success) redirect("/admin/blog/profiles?error=invalid");
  const profile = await prisma.bloggerProfile.findUnique({ where: { id }, include: { _count: { select: { articles: true } } } });
  if (!profile) redirect("/admin/blog/profiles?error=not-found");
  if (profile._count.articles) redirect(`/admin/blog/profiles?error=has-articles&edit=${encodeURIComponent(id)}`);
  try { await prisma.user.delete({ where: { id: profile.userId } }); }
  catch { redirect(`/admin/blog/profiles?error=delete-failed&edit=${encodeURIComponent(id)}`); }
  await logAudit({ userId: admin.id, actorLabel: admin.email, action: "DELETE_BLOGGER_ACCOUNT", targetType: "BloggerProfile", targetId: id });
  refresh(); redirect("/admin/blog/profiles?deleted=1");
}
