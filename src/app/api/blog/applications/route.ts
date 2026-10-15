import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const bangladeshMobile = /^\+880-1[3-9]\d-\d{3}-\d{4}$/;

const schema = z.object({
  type: z.enum(["STUDENT", "TEACHER"]),
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(190),
  schoolId: z.string().trim().min(2).max(80),

  phone: z.string().trim().max(40).optional(),
  className: z.string().trim().max(40).optional(),
  section: z.string().trim().max(40).optional(),
  rollNumber: z.string().trim().max(40).optional(),
  guardianName: z.string().trim().max(120).optional(),
  guardianRelationship: z.string().trim().max(80).optional(),
  guardianPhone: z.string().trim().max(40).optional(),
  formTeacher: z.string().trim().max(120).optional(),
  subject: z.string().trim().max(120).optional(),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Please check the information entered.",
          fields: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const d = parsed.data;

    if (d.type === "STUDENT") {
      const requiredFields = [
        d.className,
        d.section,
        d.rollNumber,
        d.guardianName,
        d.guardianRelationship,
        d.guardianPhone,
        d.formTeacher,
      ];

      if (requiredFields.some((value) => !value?.trim())) {
        return NextResponse.json(
          { error: "Complete all required student and guardian fields." },
          { status: 400 },
        );
      }

      if (!bangladeshMobile.test(d.guardianPhone!)) {
        return NextResponse.json(
          {
            error:
              "Enter a valid Bangladesh guardian mobile number, e.g. +880-171-234-5678.",
          },
          { status: 400 },
        );
      }
    }

    if (d.type === "TEACHER") {
      if (!d.phone?.trim() || !d.subject?.trim()) {
        return NextResponse.json(
          { error: "Complete the teacher phone and subject fields." },
          { status: 400 },
        );
      }

      if (!bangladeshMobile.test(d.phone)) {
        return NextResponse.json(
          {
            error:
              "Enter a valid Bangladesh mobile number, e.g. +880-171-234-5678.",
          },
          { status: 400 },
        );
      }
    }

    const existing = await prisma.blogApplication.findFirst({
      where: {
        schoolId: d.schoolId,
        type: d.type,
        status: { in: ["PENDING", "APPROVED"] },
      },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        {
          error:
            "An application or active account already exists for this school ID.",
        },
        { status: 409 },
      );
    }

    await prisma.blogApplication.create({
      data: {
        type: d.type,
        fullName: d.fullName,
        email: d.email,
        schoolId: d.schoolId,
        phone: d.phone,
        className: d.className,
        section: d.section,
        rollNumber: d.rollNumber,
        guardianName: d.guardianName,
        guardianRelationship: d.guardianRelationship,
        guardianPhone: d.guardianPhone,
        formTeacher: d.formTeacher,
        subject: d.subject,
        reviewedById: null,
      },
    });

    return NextResponse.json(
      { ok: true, message: "Application submitted successfully." },
      { status: 201 },
    );
  } catch (error) {
    // The actual cause appears in the development server terminal,
    // not in the public response.
    console.error("[BLOG_APPLICATION_SUBMISSION_ERROR]", error);

    return NextResponse.json(
      {
        error: "We could not submit your application. Please try again later.",
      },
      { status: 500 },
    );
  }
}
