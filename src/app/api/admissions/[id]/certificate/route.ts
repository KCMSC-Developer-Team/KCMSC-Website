import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/session";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return new NextResponse("Unauthorized", { status: 401 });

  const app = await prisma.admissionApplication.findUnique({
    where: { id: (await params).id },
    select: { certificateData: true, certificateName: true, certificateMimeType: true },
  });
  if (!app) return new NextResponse("Not found", { status: 404 });

  let bytes: Uint8Array | null = app.certificateData ? new Uint8Array(app.certificateData) : null;
  if (!bytes) {
    const extension = app.certificateMimeType === "application/pdf" ? "pdf" : app.certificateMimeType === "image/png" ? "png" : "jpg";
    try {
      bytes = new Uint8Array(await readFile(path.join(process.cwd(), "storage", "admissions", `${(await params).id}.${extension}`)));
    } catch {
      return new NextResponse("Not found", { status: 404 });
    }
  }

  return new NextResponse(bytes, {
    headers: {
      "Content-Type": app.certificateMimeType ?? "application/octet-stream",
      "Content-Disposition": `attachment; filename="${(app.certificateName ?? "certificate").replace(/[^a-zA-Z0-9._-]/g, "_")}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
