import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyApplicationDownloadToken } from "@/lib/admission-download";
import { createAdmissionPdf } from "@/lib/admission-pdf";
import { getCurrentAdmissionsStaff } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getCurrentAdmissionsStaff();
  const token = new URL(request.url).searchParams.get("token");

  if (!admin && (!token || !verifyApplicationDownloadToken((await params).id, token))) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const application = await prisma.admissionApplication.findUnique({
    where: { id: (await params).id },
    include: { cycle: true, guardians: true },
  });

  if (!application) return new NextResponse("Not found", { status: 404 });

  try {
    const pdf = await createAdmissionPdf({
      fullName: application.fullName,
      dateOfBirth: application.dateOfBirth,
      gender: application.gender,
      nationality: application.nationality,
      medium: application.medium,
      applyingClass: application.applyingClass,
      previousInstitution: application.previousInstitution,
      birthRegistrationNo: application.birthRegistrationNo,
      certificateName: application.certificateName,
      certificateMimeType: application.certificateMimeType,
      fatherName: application.fatherName,
      fatherNidNumber: application.fatherNidNumber,
      fatherContactNumber: application.fatherContactNumber,
      fatherOccupation: application.fatherOccupation,
      fatherNationality: application.fatherNationality,
      fatherIsAlive: application.fatherIsAlive,
      motherName: application.motherName,
      motherNidNumber: application.motherNidNumber,
      motherContactNumber: application.motherContactNumber,
      motherOccupation: application.motherOccupation,
      motherNationality: application.motherNationality,
      motherIsAlive: application.motherIsAlive,
      presentAddress: application.presentAddress,
      permanentAddress: application.permanentAddress,
      createdAt: application.createdAt,
      cycleName: application.cycle.nameEn,
      guardians: application.guardians.map((guardian: typeof application.guardians[number]) => ({
        name: guardian.name,
        relationship: guardian.relationship,
        nidNumber: guardian.nidNumber,
        contactNumber: guardian.contactNumber,
        occupation: guardian.occupation,
        nationality: guardian.nationality,
        isAlive: guardian.isAlive,
      })),
    });

    const filename =
      `${application.fullName || "Applicant"}-Admission-Application-${application.cycle.nameEn || "Application"}`
        .replace(/[^a-zA-Z0-9._-]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") + ".pdf";

    return new NextResponse(pdf as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Admission PDF generation failed", error);
    return new NextResponse("Unable to generate the application PDF", {
      status: 500,
    });
  }
}
