import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { getCurrentAdmin } from "@/lib/session";
import { NOTICE_UPLOAD_DIR, NOTICE_URL_PREFIX } from "@/lib/notice-images";

export const runtime = "nodejs";

// The browser compresses images before upload, so this limit is a safety net.
const MAX_BYTES = 4 * 1024 * 1024;

const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function hasImageSignature(type: string, bytes: Buffer) {
  if (type === "image/jpeg") {
    return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (type === "image/png") {
    return bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  }
  if (type === "image/webp") {
    return bytes.length >= 12 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
  }
  return false;
}

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const file = form.get("image");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Select an image to upload." }, { status: 400 });
    }

    const extension = extensions[file.type];
    if (!extension) {
      return NextResponse.json({ error: "Only JPG, PNG, and WebP images are supported." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Image is too large after compression (max 4 MB)." }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    if (!hasImageSignature(file.type, bytes)) {
      return NextResponse.json({ error: "The selected file is not a valid image." }, { status: 400 });
    }

    const filename = `notice-${randomUUID()}.${extension}`;
    await mkdir(NOTICE_UPLOAD_DIR, { recursive: true });
    await writeFile(path.join(NOTICE_UPLOAD_DIR, filename), bytes, { flag: "wx" });

    return NextResponse.json({ ok: true, url: `${NOTICE_URL_PREFIX}${filename}` });
  } catch (error) {
    console.error("Notice image upload failed.", error);
    return NextResponse.json({ error: "Unable to upload the image." }, { status: 500 });
  }
}
