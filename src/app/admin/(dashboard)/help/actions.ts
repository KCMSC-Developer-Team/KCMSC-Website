"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { logAudit } from "@/lib/audit";

const schema = z.object({
  slug: z.string().trim().min(1).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase URL slug with hyphens."),
  questionEn: z.string().trim().min(1).max(300),
  questionBn: z.string().trim().min(1).max(300),
  answerEn: z.string().trim().min(1).max(12000),
  answerBn: z.string().trim().min(1).max(12000),
  categoryEn: z.string().trim().min(1).max(100),
  categoryBn: z.string().trim().min(1).max(100),
  sortOrder: z.coerce.number().int().min(0).max(9999),
  isPublished: z.boolean(),
  isFeatured: z.boolean(),
});

function parse(formData: FormData) {
  return schema.parse({
    slug: formData.get("slug"),
    questionEn: formData.get("questionEn"),
    questionBn: formData.get("questionBn"),
    answerEn: formData.get("answerEn"),
    answerBn: formData.get("answerBn"),
    categoryEn: formData.get("categoryEn"),
    categoryBn: formData.get("categoryBn"),
    sortOrder: formData.get("sortOrder") || 0,
    isPublished: formData.get("isPublished") === "on",
    isFeatured: formData.get("isFeatured") === "on",
  });
}

function refresh() {
  revalidatePath("/admin/help");
  revalidatePath("/en/help");
  revalidatePath("/bn/help");
}

export async function createHelpArticleAction(formData: FormData) {
  const actor = await requireAdmin();
  const data = parse(formData);
  const article = await prisma.helpArticle.create({ data });
  await logAudit({ userId: actor.id, actorLabel: actor.email, action: "CREATE_HELP_ARTICLE", targetType: "HelpArticle", targetId: article.id });
  refresh();
  redirect("/admin/help");
}

export async function updateHelpArticleAction(id: string, formData: FormData) {
  const actor = await requireAdmin();
  const data = parse(formData);
  await prisma.helpArticle.update({ where: { id }, data });
  await logAudit({ userId: actor.id, actorLabel: actor.email, action: "UPDATE_HELP_ARTICLE", targetType: "HelpArticle", targetId: id });
  refresh();
  redirect("/admin/help");
}

export async function deleteHelpArticleAction(formData: FormData) {
  const actor = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin/help");
  await prisma.helpArticle.delete({ where: { id } });
  await logAudit({ userId: actor.id, actorLabel: actor.email, action: "DELETE_HELP_ARTICLE", targetType: "HelpArticle", targetId: id });
  refresh();
  redirect("/admin/help");
}
