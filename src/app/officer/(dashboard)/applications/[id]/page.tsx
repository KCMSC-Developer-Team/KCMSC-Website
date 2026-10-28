import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireOfficer } from "@/lib/session";
import {
  ApplicationDetail,
  statusText,
} from "@/components/admin/ApplicationDetail";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { submitReviewAction } from "../actions";

const WORKFLOW_STATUSES = [
  "NEW",
  "UNDER_REVIEW",
  "AWAITING_APPLICANT",
  "ELIGIBLE",
  "NOT_ELIGIBLE",
  "EXAM_ELIGIBLE",
  "EXAM_COMPLETED",
  "FINAL_DECISION",
] as const;

const WORKFLOW_STATUS_LABELS: Record<
  (typeof WORKFLOW_STATUSES)[number],
  string
> = {
  NEW: "New",
  UNDER_REVIEW: "Under Review",
  AWAITING_APPLICANT: "Awaiting Applicant",
  ELIGIBLE: "Eligible",
  NOT_ELIGIBLE: "Not Eligible",
  EXAM_ELIGIBLE: "Exam Eligible",
  EXAM_COMPLETED: "Exam Completed",
  FINAL_DECISION: "Final Decision",
};

const MESSAGES: Record<string, { tone: "error" | "ok"; text: string }> = {
  invalid: {
    tone: "error",
    text: "Choose a valid status and write an internal note.",
  },
  saved: {
    tone: "ok",
    text: "Review saved.",
  },
};

function getInitialStatus(status: string) {
  /*
   * UNASSIGNED and ASSIGNED are legacy values from the old
   * officer-assignment workflow.
   *
   * They are no longer displayed to officers.
   */
  if (status === "UNASSIGNED" || status === "ASSIGNED") {
    return "NEW";
  }

  if (
    WORKFLOW_STATUSES.includes(status as (typeof WORKFLOW_STATUSES)[number])
  ) {
    return status;
  }

  return "NEW";
}

export default async function OfficerApplicationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    error?: string;
    saved?: string;
  }>;
}) {
  await requireOfficer();

  const app = await prisma.admissionApplication.findUnique({
    where: {
      id: (await params).id,
    },
    include: {
      cycle: {
        select: {
          nameEn: true,
        },
      },
      guardians: true,
      reviews: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          officer: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!app) {
    notFound();
  }

  const { error, saved } = await searchParams;
  const banner = error
    ? MESSAGES[error]
    : saved
      ? MESSAGES.saved
      : null;

  const boundReview = submitReviewAction.bind(null, app.id);

  const initialStatus = getInitialStatus(app.status);

  return (
    <div className="max-w-5xl">
      {/* Back */}
      <Link
        href="/officer/applications"
        className="text-sm text-[#176b45] hover:underline"
      >
        ← All applications
      </Link>

      {/* Feedback */}
      {banner ? (
        <p
          className={`mt-4 rounded-md border px-4 py-3 text-sm ${
            banner.tone === "error"
              ? "border-[#a64b3c]/30 bg-[#a64b3c]/5 text-[#a64b3c]"
              : "border-[#176b45]/30 bg-[#176b45]/5 text-[#124c36]"
          }`}
        >
          {banner.text}
        </p>
      ) : null}

      {/* Application details */}
      <div className="mt-4">
        <ApplicationDetail app={app} />
      </div>

      {/* Application workflow */}
      <section className="mt-6 rounded-[14px] border border-[#d9d8cf] bg-[#fffdf8] p-6 sm:p-7">
        <form action={boundReview} className="space-y-6">
          {/* Header */}
          <div>
            <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#176b45]">
              Application workflow
            </p>

            <h2 className="mt-1 font-heading text-xl text-[#124c36]">
              Process application
            </h2>

            <p className="mt-1 text-sm leading-6 text-[#69716b]">
              Update the application status as the admission process moves
              forward.
            </p>
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="application-status"
              className="block text-sm font-medium text-[#242824]"
            >
              Status
            </label>

            <select
              id="application-status"
              name="status"
              required
              defaultValue={initialStatus}
              className="mt-2 w-full max-w-sm rounded-md border border-[#d9d8cf] bg-white px-3 py-2.5 text-sm text-[#242824] outline-none transition focus:border-[#176b45] focus:ring-1 focus:ring-[#176b45]"
            >
              {WORKFLOW_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {WORKFLOW_STATUS_LABELS[status]}
                </option>
              ))}
            </select>

            <p className="mt-2 text-[11px] leading-5 text-[#8a918b]">
              Applications are automatically available to admission officers.
              The status records where the application currently stands in the
              admission process.
            </p>
          </div>

          {/* Internal note */}
          <div>
            <label
              htmlFor="internal-note"
              className="block text-sm font-medium text-[#242824]"
            >
              Internal note{" "}
              <span className="font-normal text-[#69716b]">
                (never shown to the applicant)
              </span>
            </label>

            <textarea
              id="internal-note"
              name="internalNote"
              required
              rows={4}
              placeholder="Write notes about your review..."
              className="mt-2 w-full rounded-md border border-[#d9d8cf] bg-white px-3 py-2.5 text-sm text-[#242824] outline-none transition placeholder:text-[#9aa19b] focus:border-[#176b45] focus:ring-1 focus:ring-[#176b45]"
            />
          </div>

          {/* Applicant message */}
          <div>
            <label
              htmlFor="applicant-message"
              className="block text-sm font-medium text-[#242824]"
            >
              Message to applicant{" "}
              <span className="font-normal text-[#69716b]">(optional)</span>
            </label>

            <textarea
              id="applicant-message"
              name="applicantMessage"
              rows={3}
              placeholder="Optional message for the applicant..."
              className="mt-2 w-full rounded-md border border-[#d9d8cf] bg-white px-3 py-2.5 text-sm text-[#242824] outline-none transition placeholder:text-[#9aa19b] focus:border-[#176b45] focus:ring-1 focus:ring-[#176b45]"
            />
          </div>

          {/* Submit */}
          <div className="pt-1">
            <SubmitButton label="Save status" pendingLabel="Saving…" />
          </div>
        </form>
      </section>
    </div>
  );
}
