import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { z } from "zod";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "BLOGGER") {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const parsed = z
    .object({ current: z.string().min(1), next: z.string().min(10).max(100) })
    .safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "New password must be between 10 and 100 characters." },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { bloggerProfile: true }
  });
  if (!user || !(await verifyPassword(parsed.data.current, user.passwordHash))) {
    return NextResponse.json(
      { error: "Current password is incorrect." },
      { status: 400 }
    );
  }
  if (parsed.data.next === user.bloggerProfile?.schoolId) {
    return NextResponse.json(
      { error: "Your school ID cannot be used as your password." },
      { status: 400 }
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(parsed.data.next) }
  });
  return NextResponse.json({ ok: true });
}
