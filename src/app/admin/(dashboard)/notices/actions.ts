"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { logAudit } from "@/lib/audit";
import { NOTICE_UPLOAD_DIR, noticeImageFilename } from "@/lib/notice-images";
import { parseDhakaDate } from "@/lib/notice-format";

// Only images this site uploaded to the notices folder can be attached.
const noticeImageUrl = z
  .string()
  .refine((value) => noticeImageFilename(value) !== null, "Invalid image address");

const noticeSchema = z.object({
  titleEn: z.string().min(1, "English title is required"),
  titleBn: z.string().min(1, "Bangla title is required"),
  bodyEn: z.string().min(1, "English body is required"),
  bodyBn: z.string().min(1, "Bangla body is required"),
  isImportant: z.boolean(),
  isPublished: z.boolean(),
  noticeAt: z.date().nullable(),
  imageUrls: z.array(noticeImageUrl).max(10, "A notice can have up to 10 images")
}).superRefine((data, ctx) => {
  if (data.isPublished && !data.noticeAt) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["noticeAt"], message: "Set a publishing date before publishing." });
  }
  if (data.isPublished && data.imageUrls.length === 0) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["imageUrls"], message: "Add at least one image before publishing." });
  }
});

function parseForm(formData: FormData) {
  return noticeSchema.parse({
    titleEn: formData.get("titleEn"),
    titleBn: formData.get("titleBn"),
    bodyEn: formData.get("bodyEn"),
    bodyBn: formData.get("bodyBn"),
    isImportant: false,
    isPublished: formData.get("isPublished") === "on",
    noticeAt: parseDhakaDate(String(formData.get("noticeAt") ?? "")),
    imageUrls: formData.getAll("imageUrls").map(String).filter(Boolean)
  });
}

async function removeNoticeImages(urls: string[]) {
  for (const url of urls) {
    const filename = noticeImageFilename(url);
    if (!filename) continue;
    await unlink(path.join(NOTICE_UPLOAD_DIR, filename)).catch(() => undefined);
  }
}

function revalidateNotices() {
  revalidatePath("/admin/notices");
  revalidatePath("/en/notices");
  revalidatePath("/bn/notices");
  revalidatePath("/en");
  revalidatePath("/bn");
  revalidatePath("/en", "layout");
  revalidatePath("/bn", "layout");
}

export async function createNoticeAction(formData: FormData) {
  const actor = await requireAdmin();
  const data = parseForm(formData);

  const notice = await prisma.notice.create({
    data: { ...data, publishedAt: data.isPublished ? new Date() : null }
  });

  await logAudit({
    userId: actor.id,
    actorLabel: actor.email,
    action: "CREATE_NOTICE",
    targetType: "Notice",
    targetId: notice.id
  });

  revalidateNotices();
  redirect("/admin/notices");
}

export async function updateNoticeAction(id: string, formData: FormData) {
  const actor = await requireAdmin();
  const data = parseForm(formData);
  const existing = await prisma.notice.findUniqueOrThrow({ where: { id } });

  await prisma.notice.update({
    where: { id },
    data: {
      ...data,
      publishedAt:
        data.isPublished && !existing.isPublished ? new Date() : existing.publishedAt
    }
  });

  // Images removed from this notice are deleted from disk.
  const removed = existing.imageUrls.filter((url) => !data.imageUrls.includes(url));
  await removeNoticeImages(removed);

  await logAudit({
    userId: actor.id,
    actorLabel: actor.email,
    action: "UPDATE_NOTICE",
    targetType: "Notice",
    targetId: id
  });

  revalidateNotices();
  redirect("/admin/notices");
}

export async function deleteNoticeAction(formData: FormData) {
  const actor = await requireAdmin();
  const id = String(formData.get("id") ?? "");

  const existing = await prisma.notice.findUnique({
    where: { id },
    select: { imageUrls: true }
  });

  await prisma.notice.delete({ where: { id } });
  await removeNoticeImages(existing?.imageUrls ?? []);

  await logAudit({
    userId: actor.id,
    actorLabel: actor.email,
    action: "DELETE_NOTICE",
    targetType: "Notice",
    targetId: id
  });

  revalidateNotices();
}
