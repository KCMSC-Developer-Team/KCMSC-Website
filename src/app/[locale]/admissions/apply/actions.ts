"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCycleById } from "@/lib/admissions";
import type { Locale } from "@/i18n/config";
import { createApplicationDownloadToken } from "@/lib/admission-download";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const phonePattern = /^\+880-1\d-\d{4}-\d{4}$/;

const guardianSchema = z
  .object({
    name: z.string().trim().min(1),
    relationship: z.string().trim().min(1),
    nidNumber: z.string().trim().min(1),
    contactNumber: z.string(),
    occupation: z.string().trim().min(1),
    nationality: z.string().trim().min(1),
    isAlive: z.boolean(),
  })
  .superRefine((guardian, ctx) => {
    if (guardian.isAlive && !phonePattern.test(guardian.contactNumber)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["contactNumber"],
        message: "Invalid Bangladesh phone number",
      });
    }
  });

const schema = z.object({
  declarationAccepted: z.literal(true),
  fullName: z.string().trim().min(1),
  dateOfBirth: z
    .string()
    .min(1)
    .refine(
      (value) => !Number.isNaN(Date.parse(value)),
      "Enter a valid date of birth",
    ),
  gender: z.string().min(1),
  nationality: z.string().min(1),
  medium: z.enum(["Bangla Version", "English Version"]),
  applyingClass: z.string().min(1),
  previousInstitution: z.string().optional().default(""),
  birthRegistrationNo: z
    .string()
    .regex(
      /^\d{17}$/,
      "Birth registration number must contain exactly 17 digits",
    ),
  fatherName: z.string().trim().min(1),
  fatherNidNumber: z.string().trim().min(1),
  fatherContactNumber: z.string(),
  fatherOccupation: z.string().trim().min(1),
  fatherNationality: z.string().min(1),
  fatherIsAlive: z.boolean(),
  motherName: z.string().trim().min(1),
  motherNidNumber: z.string().trim().min(1),
  motherContactNumber: z.string(),
  motherOccupation: z.string().trim().min(1),
  motherNationality: z.string().min(1),
  motherIsAlive: z.boolean(),
  presentAddress: z.string().trim().min(1),
  permanentAddress: z.string().trim().min(1),
  guardians: z.array(guardianSchema).max(10),
});

type ApplicationActionError = {
  ok: false;
  message: string;
};

function errorMessage(
  locale: Locale,
  key:
    | "closed"
    | "invalid"
    | "certificateType"
    | "certificateSize"
    | "server"
    | "storage",
) {
  const messages = {
    en: {
      closed:
        "This admission cycle is not currently accepting applications. Your details have not been submitted.",
      invalid:
        "Please correct the fields listed below. Your entries are still on this form.",
      certificateType:
        "The birth registration certificate must be a PDF, JPG, or PNG file.",
      certificateSize:
        "The birth registration certificate must be smaller than 5 MB.",
      server:
        "We couldn't save your application because of a server problem. Your entries are still on this form. Please try again shortly. If this keeps happening, contact the school office.",
      storage:
        "Your application could not be saved because the certificate file could not be stored. Your entries are still on this form. Please try again or contact the school office.",
    },
    bn: {
      closed:
        "এই ভর্তি কার্যক্রমে বর্তমানে আবেদন গ্রহণ করা হচ্ছে না। আপনার তথ্য জমা হয়নি।",
      invalid:
        "নিচে উল্লেখ করা তথ্যগুলো সংশোধন করুন। আপনার দেওয়া তথ্য এই ফর্মেই রয়েছে।",
      certificateType: "জন্মনিবন্ধনের সনদ PDF, JPG অথবা PNG ফাইল হতে হবে।",
      certificateSize: "জন্মনিবন্ধনের সনদের ফাইল ৫ MB-এর কম হতে হবে।",
      server:
        "সার্ভারের সমস্যার কারণে আবেদনটি সংরক্ষণ করা যায়নি। আপনার তথ্য এই ফর্মেই রয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন। সমস্যা চলতে থাকলে স্কুল অফিসে যোগাযোগ করুন।",
      storage:
        "সনদের ফাইল সংরক্ষণ করা যায়নি, তাই আবেদনটি সম্পন্ন হয়নি। আপনার তথ্য এই ফর্মেই রয়েছে। আবার চেষ্টা করুন অথবা স্কুল অফিসে যোগাযোগ করুন।",
    },
  };

  return messages[locale][key];
}

const fieldLabels: Record<string, string> = {
  declarationAccepted: "Declaration confirmation",
  fullName: "Student full name",
  dateOfBirth: "Date of birth",
  gender: "Gender",
  nationality: "Student nationality",
  medium: "Medium",
  applyingClass: "Class applying for",
  previousInstitution: "Previous institution",
  birthRegistrationNo: "Birth registration number (exactly 17 digits)",
  fatherName: "Father's name",
  fatherNidNumber: "Father's NID number",
  fatherContactNumber: "Father's contact number (format: +880-17-1234-5678)",
  fatherOccupation: "Father's occupation",
  fatherNationality: "Father's nationality",
  fatherIsAlive: "Father's status",
  motherName: "Mother's name",
  motherNidNumber: "Mother's NID number",
  motherContactNumber: "Mother's contact number (format: +880-17-1234-5678)",
  motherOccupation: "Mother's occupation",
  motherNationality: "Mother's nationality",
  motherIsAlive: "Mother's status",
  presentAddress: "Present address",
  permanentAddress: "Permanent address",
  guardians: "Additional guardian details",
  certificate: "Birth registration certificate",
};

function describeValidationIssues(
  issues: z.ZodIssue[],
  locale: Locale,
): string {
  const labels = issues.map((issue) => {
    const path = issue.path.map(String);
    const root = path[0] ?? "";
    let label = fieldLabels[root] ?? root;

    if (root === "guardians" && path.length >= 3) {
      // Zod paths can contain missing array/property segments.
      // Normalize them before using them as object indexes.
      const guardianIndex = path[1] ?? "0";
      const guardianNumber = Number(guardianIndex) + 1;
      const property = path[2] ?? "details";

      const guardianFields: Record<string, string> = {
        name: "name",
        relationship: "relationship",
        nidNumber: "NID number",
        contactNumber: "contact number (format: +880-17-1234-5678)",
        occupation: "occupation",
        nationality: "nationality",
        isAlive: "status",
      };

      label = `Additional guardian ${guardianNumber} ${
        guardianFields[property] ?? property
      }`;
    } else if (root === "birthRegistrationNo") {
      label = "Birth registration number (must contain exactly 17 digits)";
    } else if (root === "declarationAccepted") {
      label =
        locale === "bn"
          ? "ঘোষণা ও সম্মতির চেকবক্সটি নির্বাচন করুন"
          : "Please accept the declaration checkbox";
    } else if (
      root === "fatherContactNumber" ||
      root === "motherContactNumber" ||
      root === "contactNumber"
    ) {
      label = `${label} must use the format +880-17-1234-5678`;
    }

    return label;
  });

  const unique = [...new Set(labels.filter(Boolean))];

  if (!unique.length) {
    return errorMessage(locale, "invalid");
  }

  return locale === "bn"
    ? `অনুগ্রহ করে এই তথ্যগুলো যাচাই করুন: ${unique.join(", ")}.`
    : `Please check these fields: ${unique.join(", ")}.`;
}

export async function createApplicationAction(
  locale: Locale,
  cycleId: string,
  formData: FormData,
): Promise<ApplicationActionError | void> {
  let cycle;

  try {
    cycle = await getCycleById(cycleId);
  } catch (error) {
    console.error("Admission cycle lookup failed", error);

    return {
      ok: false,
      message: errorMessage(locale, "server"),
    };
  }

  const now = new Date();

  if (!cycle || now < cycle.opensAt || now > cycle.closesAt) {
    return {
      ok: false,
      message: errorMessage(locale, "closed"),
    };
  }

  const certificate = formData.get("certificate");
  const guardiansRaw = String(formData.get("guardiansJson") ?? "[]");

  let guardians: unknown;

  try {
    guardians = JSON.parse(guardiansRaw);
  } catch {
    return {
      ok: false,
      message:
        locale === "bn"
          ? "অতিরিক্ত অভিভাবকের তথ্য পড়া যায়নি। অভিভাবকের তথ্যগুলো যাচাই করে আবার চেষ্টা করুন।"
          : "The additional guardian details could not be read. Please review those fields and try again.",
    };
  }

  const parsed = schema.safeParse({
    declarationAccepted: formData.get("declarationAccepted") === "on",
    fullName: formData.get("fullName"),
    dateOfBirth: formData.get("dateOfBirth"),
    gender: formData.get("gender"),
    nationality: formData.get("nationality"),
    medium: formData.get("medium"),
    applyingClass: formData.get("applyingClass"),
    previousInstitution: formData.get("previousInstitution"),
    birthRegistrationNo: formData.get("birthRegistrationNo"),
    fatherName: formData.get("fatherName"),
    fatherNidNumber: formData.get("fatherNidNumber"),
    fatherContactNumber: String(formData.get("fatherContactNumber") ?? ""),
    fatherOccupation: formData.get("fatherOccupation"),
    fatherNationality: formData.get("fatherNationality"),
    fatherIsAlive: formData.get("fatherIsAlive") === "on",
    motherName: formData.get("motherName"),
    motherNidNumber: formData.get("motherNidNumber"),
    motherContactNumber: String(formData.get("motherContactNumber") ?? ""),
    motherOccupation: formData.get("motherOccupation"),
    motherNationality: formData.get("motherNationality"),
    motherIsAlive: formData.get("motherIsAlive") === "on",
    presentAddress: formData.get("presentAddress"),
    permanentAddress: formData.get("permanentAddress"),
    guardians,
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: describeValidationIssues(parsed.error.issues, locale),
    };
  }

  if (!(certificate instanceof File) || certificate.size === 0) {
    return {
      ok: false,
      message:
        locale === "bn"
          ? "জন্মনিবন্ধনের সনদের ফাইলটি সংযুক্ত করুন। আপনার অন্য তথ্য মুছে যায়নি।"
          : "Please attach the birth registration certificate. Your other entries are still on this form.",
    };
  }

  if (certificate.size > 5 * 1024 * 1024) {
    return {
      ok: false,
      message: errorMessage(locale, "certificateSize"),
    };
  }

  const allowedCertificateTypes = new Set([
    "application/pdf",
    "image/jpeg",
    "image/png",
  ]);

  if (!allowedCertificateTypes.has(certificate.type)) {
    return {
      ok: false,
      message: errorMessage(locale, "certificateType"),
    };
  }

  const data = parsed.data;

  if (data.fatherIsAlive && !phonePattern.test(data.fatherContactNumber)) {
    return {
      ok: false,
      message:
        locale === "bn"
          ? "পিতার যোগাযোগ নম্বরটি +880-17-1234-5678 ফরম্যাটে লিখুন।"
          : "Father's contact number must use the format +880-17-1234-5678.",
    };
  }

  if (data.motherIsAlive && !phonePattern.test(data.motherContactNumber)) {
    return {
      ok: false,
      message:
        locale === "bn"
          ? "মাতার যোগাযোগ নম্বরটি +880-17-1234-5678 ফরম্যাটে লিখুন।"
          : "Mother's contact number must use the format +880-17-1234-5678.",
    };
  }

  for (const guardian of data.guardians) {
    if (!guardian.isAlive) {
      guardian.contactNumber = "";
    }
  }

  if (!data.fatherIsAlive) {
    data.fatherContactNumber = "";
  }

  if (!data.motherIsAlive) {
    data.motherContactNumber = "";
  }

  let buffer: Buffer;

  try {
    buffer = Buffer.from(await certificate.arrayBuffer());
  } catch (error) {
    console.error("Failed to read admission certificate", error);

    return {
      ok: false,
      message: errorMessage(locale, "storage"),
    };
  }

  const extension =
    certificate.type === "application/pdf"
      ? "pdf"
      : certificate.type === "image/png"
        ? "png"
        : "jpg";

  const uploadDirectory = path.join(process.cwd(), "storage", "admissions");

  let app: { id: string } | undefined;

  try {
    app = await prisma.admissionApplication.create({
      data: {
        cycleId: cycle.id,
        fullName: data.fullName,
        dateOfBirth: new Date(data.dateOfBirth),
        gender: data.gender,
        nationality: data.nationality,
        medium: data.medium,
        applyingClass: data.applyingClass,
        previousInstitution: data.previousInstitution ?? "",
        birthRegistrationNo: data.birthRegistrationNo,
        certificateData: null,
        certificateName: certificate.name,
        certificateMimeType: certificate.type,
        fatherName: data.fatherName,
        fatherNidNumber: data.fatherNidNumber,
        fatherContactNumber: data.fatherContactNumber,
        fatherOccupation: data.fatherOccupation,
        fatherNationality: data.fatherNationality,
        fatherIsAlive: data.fatherIsAlive,
        motherName: data.motherName,
        motherNidNumber: data.motherNidNumber,
        motherContactNumber: data.motherContactNumber,
        motherOccupation: data.motherOccupation,
        motherNationality: data.motherNationality,
        motherIsAlive: data.motherIsAlive,
        presentAddress: data.presentAddress,
        permanentAddress: data.permanentAddress,
        guardians: {
          create: data.guardians,
        },
        status: "UNASSIGNED",
      },
    });

    await mkdir(uploadDirectory, { recursive: true });

    await writeFile(
      path.join(uploadDirectory, `${app.id}.${extension}`),
      buffer,
    );
  } catch (error) {
    console.error("Admission application submission failed", error);

    if (app?.id) {
      await prisma.admissionApplication
        .delete({
          where: { id: app.id },
        })
        .catch((deleteError) => {
          console.error(
            "Failed to roll back incomplete admission application",
            deleteError,
          );
        });

      return {
        ok: false,
        message: errorMessage(locale, "storage"),
      };
    }

    return {
      ok: false,
      message: errorMessage(locale, "server"),
    };
  }

  const downloadToken = createApplicationDownloadToken(app.id);

  redirect(
    `/${locale}/admissions/success?application=${encodeURIComponent(
      app.id,
    )}&download=${encodeURIComponent(downloadToken)}`,
  );
}
