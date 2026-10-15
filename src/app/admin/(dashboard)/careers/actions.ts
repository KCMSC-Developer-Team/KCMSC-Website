"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { logAudit } from "@/lib/audit";
import { sanitizeRichText } from "@/lib/rich-text";

const careerSchema = z.object({
  titleEn: z.string().trim().min(1).max(160),
  titleBn: z.string().trim().min(1).max(160),
  summaryEn: z.string().trim().min(1).max(500),
  summaryBn: z.string().trim().min(1).max(500),
  categoryEn: z.string().trim().max(80).optional(),
  categoryBn: z.string().trim().max(80).optional(),
  descriptionEn: z.string().min(1).max(30000),
  descriptionBn: z.string().min(1).max(30000),
  imageData: z.string().max(1_000_000).optional(),
  deadline: z.string().optional(),
  isPublished: z.boolean(),
});

function parseForm(formData: FormData) {
  const rawImage = String(formData.get("imageData") ?? "");
  if (rawImage && !/^data:image\/(webp|jpeg|png);base64,[A-Za-z0-9+/=]+$/.test(rawImage)) {
    throw new Error("Invalid image format. Please upload a JPG, PNG or WebP image.");
  }
  const data = careerSchema.parse({
    titleEn: formData.get("titleEn"),
    titleBn: formData.get("titleBn"),
    summaryEn: formData.get("summaryEn"),
    summaryBn: formData.get("summaryBn"),
    categoryEn: formData.get("categoryEn") || "",
    categoryBn: formData.get("categoryBn") || "",
    descriptionEn: formData.get("descriptionEn"),
    descriptionBn: formData.get("descriptionBn"),
    imageData: rawImage || undefined,
    deadline: formData.get("deadline") || undefined,
    isPublished: formData.get("isPublished") === "on",
  });
  return {
    ...data,
    descriptionEn: sanitizeRichText(data.descriptionEn),
    descriptionBn: sanitizeRichText(data.descriptionBn),
    categoryEn: data.categoryEn || null,
    categoryBn: data.categoryBn || null,
    imageData: data.imageData || null,
    deadline: data.deadline ? new Date(`${data.deadline}T23:59:59.999Z`) : null,
  };
}

function revalidateCareerPages() {
  revalidatePath("/admin/careers");
  revalidatePath("/en/careers");
  revalidatePath("/bn/careers");
}

export async function createCareerAction(formData: FormData) {
  const actor = await requireAdmin();
  const data = parseForm(formData);
  const career = await prisma.career.create({ data });

  await logAudit({
    userId: actor.id,
    actorLabel: actor.email,
    action: "CREATE_CAREER",
    targetType: "Career",
    targetId: career.id,
  });

  revalidateCareerPages();
  redirect("/admin/careers");
}

export async function updateCareerAction(id: string, formData: FormData) {
  const actor = await requireAdmin();
  const data = parseForm(formData);
  await prisma.career.update({ where: { id }, data });

  await logAudit({
    userId: actor.id,
    actorLabel: actor.email,
    action: "UPDATE_CAREER",
    targetType: "Career",
    targetId: id,
  });

  revalidateCareerPages();
  redirect("/admin/careers");
}

export async function deleteCareerAction(formData: FormData) {
  const actor = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin/careers");

  await prisma.career.delete({ where: { id } });
  await logAudit({
    userId: actor.id,
    actorLabel: actor.email,
    action: "DELETE_CAREER",
    targetType: "Career",
    targetId: id,
  });

  revalidateCareerPages();
  redirect("/admin/careers");
}
