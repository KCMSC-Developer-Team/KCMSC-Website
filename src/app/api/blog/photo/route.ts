import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

const uploadDir = path.join(process.cwd(), "public", "uploads", "blogger-photos");
const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

async function getBlogger() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "BLOGGER") {
    return { error: "Unauthorized", status: 401 as const };
  }

  const profile = await prisma.bloggerProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true, photoUrl: true },
  });
  if (!profile) return { error: "Blogger profile not found.", status: 403 as const };
  return { profile };
}

function managedFilename(photoUrl: string | null) {
  if (!photoUrl) return null;
  const filename = path.basename(photoUrl);
  return /^blogger-[a-f0-9-]+\.(jpg|png|webp)$/i.test(filename)
    ? filename
    : null;
}

export async function POST(req: Request) {
  try {
    const auth = await getBlogger();
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const form = await req.formData();
    const file = form.get("photo");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Select an image to upload." }, { status: 400 });
    }

    const extension = extensions[file.type];
    if (!extension) {
      return NextResponse.json(
        { error: "Only JPG, PNG, and WebP images are supported." },
        { status: 400 },
      );
    }
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image must be smaller than 8 MB." },
        { status: 400 },
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const validImage =
      (extension === "jpg" &&
        bytes.length >= 3 &&
        bytes[0] === 0xff &&
        bytes[1] === 0xd8 &&
        bytes[2] === 0xff) ||
      (extension === "png" &&
        bytes.length >= 8 &&
        bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) ||
      (extension === "webp" &&
        bytes.length >= 12 &&
        bytes.toString("ascii", 0, 4) === "RIFF" &&
        bytes.toString("ascii", 8, 12) === "WEBP");
    if (!validImage) {
      return NextResponse.json(
        { error: "The selected file is not a valid image." },
        { status: 400 },
      );
    }

    const filename = `blogger-${randomUUID()}.${extension}`;
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), bytes, { flag: "wx" });

    const photoUrl = `/uploads/blogger-photos/${filename}`;
    try {
      await prisma.bloggerProfile.update({
        where: { id: auth.profile.id },
        data: { photoUrl },
      });
    } catch (error) {
      await unlink(path.join(uploadDir, filename)).catch(() => undefined);
      throw error;
    }

    const oldFilename = managedFilename(auth.profile.photoUrl);
    if (oldFilename) await unlink(path.join(uploadDir, oldFilename)).catch(() => undefined);
    revalidatePath("/[locale]/blog", "page");
    revalidatePath("/[locale]/blog/[slug]", "page");
    return NextResponse.json({ ok: true, photoUrl });
  } catch (error) {
    console.error("Blogger photo upload failed.", error);
    return NextResponse.json({ error: "Unable to upload the photo." }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const auth = await getBlogger();
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    await prisma.bloggerProfile.update({
      where: { id: auth.profile.id },
      data: { photoUrl: null },
    });
    const oldFilename = managedFilename(auth.profile.photoUrl);
    if (oldFilename) await unlink(path.join(uploadDir, oldFilename)).catch(() => undefined);
    revalidatePath("/[locale]/blog", "page");
    revalidatePath("/[locale]/blog/[slug]", "page");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Blogger photo removal failed.", error);
    return NextResponse.json({ error: "Unable to remove the photo." }, { status: 500 });
  }
}
