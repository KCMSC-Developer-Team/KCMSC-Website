"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { logAudit } from "@/lib/audit";

const schema = z.object({ title: z.string().trim().min(3).max(180), slug: z.string().trim().min(1).max(220).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), excerpt: z.string().max(600), content: z.string().min(1).max(2000000), status: z.enum(["DRAFT", "PUBLISHED", "HIDDEN"]) });
const refresh = () => { revalidatePath("/admin"); revalidatePath("/admin/blog/articles"); revalidatePath("/blog"); };

export async function updateBlogArticle(form: FormData) {
  const admin = await requireAdmin();
  const id = String(form.get("id") || "");
  const parsed = schema.safeParse(Object.fromEntries(["title", "slug", "excerpt", "content", "status"].map((key) => [key, String(form.get(key) || "")])));
  if (!id || id.length > 100 || !parsed.success) redirect("/admin/blog/articles?error=invalid");
  const existing = await prisma.blogArticle.findUnique({ where: { id }, select: { publishedAt: true } });
  if (!existing) redirect("/admin/blog/articles?error=not-found");
  const content = sanitizeHtml(parsed.data.content, { allowedTags: ["p", "br", "strong", "b", "em", "i", "u", "h2", "h3", "ul", "ol", "li", "blockquote", "a", "img"], allowedAttributes: { a: ["href", "target", "rel"], img: ["src", "alt", "title"] }, allowedSchemes: ["http", "https", "mailto", "data"], transformTags: { a: sanitizeHtml.simpleTransform("a", { rel: "nofollow noopener noreferrer", target: "_blank" }) } });
  try { await prisma.blogArticle.update({ where: { id }, data: { ...parsed.data, content, excerpt: parsed.data.excerpt || null, publishedAt: parsed.data.status === "PUBLISHED" ? existing.publishedAt || new Date() : null } }); }
  catch { redirect(`/admin/blog/articles?error=conflict&edit=${encodeURIComponent(id)}`); }
  await logAudit({ userId: admin.id, actorLabel: admin.email, action: "UPDATE_BLOG_ARTICLE", targetType: "BlogArticle", targetId: id });
  refresh(); redirect("/admin/blog/articles?updated=1");
}

export async function deleteBlogArticle(form: FormData) {
  const admin = await requireAdmin();
  const id = String(form.get("id") || "");
  if (!id || id.length > 100) redirect("/admin/blog/articles?error=invalid");
  let result;
  try { result = await prisma.blogArticle.deleteMany({ where: { id } }); }
  catch { redirect(`/admin/blog/articles?error=delete-failed&edit=${encodeURIComponent(id)}`); }
  if (!result.count) redirect("/admin/blog/articles?error=not-found");
  await logAudit({ userId: admin.id, actorLabel: admin.email, action: "DELETE_BLOG_ARTICLE", targetType: "BlogArticle", targetId: id });
  refresh(); redirect("/admin/blog/articles?deleted=1");
}
