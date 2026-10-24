"use server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { createInvitation } from "@/lib/invitation";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function decideApplication(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") || "");
  const decision = String(formData.get("decision") || "");
  const note = String(formData.get("note") || "").slice(0, 1000);
  const app = await prisma.blogApplication.findUnique({ where: { id } });

  if (!app) {
    redirect("/admin/blog/applications");
  }

  if (decision === "reset" && app.status === "APPROVED") {
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: app.email, mode: "insensitive" } },
          { bloggerProfile: { schoolId: app.schoolId } }
        ]
      },
      include: { bloggerProfile: true }
    });
    if (
      existing &&
      (existing.role !== "BLOGGER" ||
        existing.email.toLowerCase() !== app.email.toLowerCase() ||
        existing.bloggerProfile?.schoolId !== app.schoolId)
    ) {
      redirect("/admin/blog/applications?error=account-exists");
    }

    const invitation = await prisma.$transaction((tx) =>
      createInvitation(
        {
          email: app.email.toLowerCase(),
          role: "BLOGGER",
          createdById: admin.id
        },
        tx
      )
    );

    revalidatePath("/admin/blog/applications");
    redirect(
      `/admin/blog/applications?invitation=${encodeURIComponent(invitation.rawToken)}`
    );
  }

  if (app.status !== "PENDING") {
    redirect("/admin/blog/applications");
  }

  if (decision === "reject") {
    const result = await prisma.blogApplication.updateMany({
      where: { id, status: "PENDING" },
      data: {
        status: "REJECTED",
        reviewedById: admin.id,
        reviewNote: note || null
      }
    });
    if (result.count === 0) redirect("/admin/blog/applications");

    revalidatePath("/admin/blog/applications");
    redirect("/admin/blog/applications?updated=rejected");
  }

  if (decision !== "approve") {
    redirect("/admin/blog/applications");
  }

  const already = await prisma.user.findFirst({
    where: {
      OR: [
        { email: { equals: app.email, mode: "insensitive" } },
        { bloggerProfile: { schoolId: app.schoolId } }
      ]
    }
  });
  if (already) redirect("/admin/blog/applications?error=account-exists");

  const invitation = await prisma.$transaction(async (tx) => {
    const result = await tx.blogApplication.updateMany({
      where: { id, status: "PENDING" },
      data: {
        status: "APPROVED",
        reviewedById: admin.id,
        reviewNote: note || null
      }
    });
    if (result.count === 0) return null;

    return createInvitation(
      {
        email: app.email.toLowerCase(),
        role: "BLOGGER",
        createdById: admin.id
      },
      tx
    );
  });
  if (!invitation) redirect("/admin/blog/applications");

  revalidatePath("/admin/blog/applications");
  redirect(
    `/admin/blog/applications?invitation=${encodeURIComponent(invitation.rawToken)}`
  );
}
