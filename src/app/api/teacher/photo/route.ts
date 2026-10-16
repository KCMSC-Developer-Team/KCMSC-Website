import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import { mkdir, unlink } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";
const uploadDir = path.join(process.cwd(), "public", "uploads", "teacher-photos");

async function getTeacher() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "TEACHER") return { error: "Unauthorized", status: 401 as const };
  const teacher = await prisma.teacherProfile.findUnique({ where: { userId: session.user.id } });
  if (!teacher || !teacher.isActive) return { error: "Teacher account unavailable.", status: 403 as const };
  if (teacher.mustChangePassword) return { error: "Change your temporary password first.", status: 403 as const };
  return { teacher };
}

function managedFilename(photoUrl: string | null) {
  if (!photoUrl) return null;
  try {
    const url = new URL(photoUrl);
    const filename = path.basename(url.pathname);
    return /^teacher-[a-f0-9-]+\.jpg$/i.test(filename) ? filename : null;
  } catch { return null; }
}

export async function POST(req: Request) {
  const auth = await getTeacher();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  try {
    const form = await req.formData();
    const file = form.get("photo");
    if (!(file instanceof File)) return NextResponse.json({ error: "Select an image to upload." }, { status: 400 });
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) return NextResponse.json({ error: "Only JPG, PNG, and WebP images are supported." }, { status: 400 });
    if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: "Image must be smaller than 8 MB." }, { status: 400 });
    const bytes = Buffer.from(await file.arrayBuffer());
    // The client cropper converts the image to a square JPEG before upload.
    const filename = `teacher-${randomUUID()}.jpg`;
    await mkdir(uploadDir, { recursive: true });
    await import("node:fs/promises").then(fs => fs.writeFile(path.join(uploadDir, filename), bytes, { flag: "wx" }));
    const origin = new URL(req.url).origin;
    const photoUrl = `${origin}/uploads/teacher-photos/${filename}`;
    const oldFilename = managedFilename(auth.teacher.photoUrl);
    await prisma.teacherProfile.update({ where: { id: auth.teacher.id }, data: { photoUrl } });
    if (oldFilename && oldFilename !== filename) await unlink(path.join(uploadDir, oldFilename)).catch(() => undefined);
    return NextResponse.json({ ok: true, photoUrl });
  } catch {
    return NextResponse.json({ error: "Unable to upload the photo." }, { status: 500 });
  }
}

export async function DELETE() {
  const auth = await getTeacher();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  try {
    const oldFilename = managedFilename(auth.teacher.photoUrl);
    await prisma.teacherProfile.update({ where: { id: auth.teacher.id }, data: { photoUrl: null } });
    if (oldFilename) await unlink(path.join(uploadDir, oldFilename)).catch(() => undefined);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to remove the photo." }, { status: 500 });
  }
}
