"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { requireAdmin, requireAdmissionsStaff } from "@/lib/session";
import { logAudit } from "@/lib/audit";

const cycleSchema = z.object({
  nameEn: z.string().trim().min(1),
  nameBn: z.string().trim().min(1),
  opensAt: z.string().min(1),
  closesAt: z.string().min(1),
});

function parseWindow(opensAt: string, closesAt: string) {
  const withDhakaOffset = (value: string) =>
    /[zZ]|[+-]\d{2}:?\d{2}$/.test(value) ? value : `${value}:00+06:00`;

  const opens = new Date(withDhakaOffset(opensAt));
  const closes = new Date(withDhakaOffset(closesAt));

  if (
    Number.isNaN(opens.getTime()) ||
    Number.isNaN(closes.getTime()) ||
    closes <= opens
  ) {
    return null;
  }

  return {
    opensAt: opens,
    closesAt: closes,
  };
}

async function ensureNoOverlap(
  opensAt: Date,
  closesAt: Date,
  excludeId?: string,
) {
  const overlap = await prisma.admissionCycle.findFirst({
    where: {
      ...(excludeId
        ? {
            id: {
              not: excludeId,
            },
          }
        : {}),
      opensAt: {
        lt: closesAt,
      },
      closesAt: {
        gt: opensAt,
      },
    },
    select: {
      id: true,
    },
  });

  return !overlap;
}

function destination(role: string) {
  return role === "ADMISSION_OFFICER"
    ? "/officer/cycles"
    : "/admin/admissions?view=cycles";
}

export async function createCycleAction(formData: FormData) {
  const actor = await requireAdmissionsStaff();

  const parsed = cycleSchema.safeParse({
    nameEn: formData.get("nameEn"),
    nameBn: formData.get("nameBn"),
    opensAt: formData.get("opensAt"),
    closesAt: formData.get("closesAt"),
  });

  if (!parsed.success) {
    redirect(`${destination(actor.role)}&error=invalid_cycle`);
  }

  const window = parseWindow(parsed.data.opensAt, parsed.data.closesAt);

  if (!window) {
    redirect(`${destination(actor.role)}&error=invalid_dates`);
  }

  if (!(await ensureNoOverlap(window.opensAt, window.closesAt))) {
    redirect(`${destination(actor.role)}&error=overlap`);
  }

  const cycle = await prisma.admissionCycle.create({
    data: {
      ...parsed.data,
      ...window,
    },
  });

  await logAudit({
    userId: actor.id,
    actorLabel: actor.email,
    action: "CREATE_ADMISSION_CYCLE",
    targetType: "AdmissionCycle",
    targetId: cycle.id,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/admissions");
  revalidatePath("/officer");
  revalidatePath("/officer/cycles");

  revalidatePath("/en/admissions");
  revalidatePath("/bn/admissions");

  redirect(destination(actor.role));
}

export async function updateCycleAction(id: string, formData: FormData) {
  const actor = await requireAdmissionsStaff();

  const parsed = cycleSchema.safeParse({
    nameEn: formData.get("nameEn"),
    nameBn: formData.get("nameBn"),
    opensAt: formData.get("opensAt"),
    closesAt: formData.get("closesAt"),
  });

  if (!parsed.success) {
    redirect(`${destination(actor.role)}&error=invalid_cycle&edit=${id}`);
  }

  const window = parseWindow(parsed.data.opensAt, parsed.data.closesAt);

  if (!window) {
    redirect(`${destination(actor.role)}&error=invalid_dates&edit=${id}`);
  }

  if (!(await ensureNoOverlap(window.opensAt, window.closesAt, id))) {
    redirect(`${destination(actor.role)}&error=overlap&edit=${id}`);
  }

  await prisma.admissionCycle.update({
    where: {
      id,
    },
    data: {
      ...parsed.data,
      ...window,
    },
  });

  await logAudit({
    userId: actor.id,
    actorLabel: actor.email,
    action: "UPDATE_ADMISSION_CYCLE",
    targetType: "AdmissionCycle",
    targetId: id,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/admissions");
  revalidatePath("/officer");
  revalidatePath("/officer/cycles");

  revalidatePath("/en/admissions");
  revalidatePath("/bn/admissions");

  redirect(destination(actor.role));
}

export async function deleteCycleAction(id: string) {
  const actor = await requireAdmin();

  const cycle = await prisma.admissionCycle.findUnique({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          applications: true,
        },
      },
    },
  });

  if (!cycle) {
    redirect(`${destination(actor.role)}&error=cycle_not_found`);
  }

  if (cycle._count.applications > 0) {
    redirect(`${destination(actor.role)}&error=cycle_has_applications`);
  }

  if (cycle.closesAt.getTime() >= Date.now()) {
    redirect(`${destination(actor.role)}&error=cycle_not_closed`);
  }

  try {
    await prisma.admissionCycle.delete({ where: { id } });
  } catch {
    redirect(`${destination(actor.role)}&error=cycle_has_applications`);
  }

  await logAudit({
    userId: actor.id,
    actorLabel: actor.email,
    action: "DELETE_ADMISSION_CYCLE",
    targetType: "AdmissionCycle",
    targetId: id,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/admissions");
  revalidatePath("/officer");
  revalidatePath("/officer/cycles");

  revalidatePath("/en/admissions");
  revalidatePath("/bn/admissions");

  redirect(`${destination(actor.role)}&deleted=1`);
}
