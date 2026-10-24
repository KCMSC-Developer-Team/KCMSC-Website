import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { decideApplication } from "./actions";

export const dynamic="force-dynamic";
export default async function BlogApplicationsPage({
  searchParams
}: {
  searchParams: { invitation?: string };
}) {
  await requireAdmin();
  const apps = await prisma.blogApplication.findMany({
    orderBy: { createdAt: "desc" },
    take: 100
  });
  const inviteUrl = searchParams.invitation
    ? `/admin/accept-invite?token=${encodeURIComponent(searchParams.invitation)}`
    : null;

  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[.18em] text-[#176b45]">
        Blog management
      </p>
      <h1 className="mt-2 font-serif text-4xl">Blogger applications</h1>
      <p className="mt-3 text-sm text-[#687168]">
        Review identity and school details before approving access. Student guardian
        details are confidential.
      </p>

      {inviteUrl ? (
        <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-semibold text-green-900">
            Application approved. Send this one-time setup link to the applicant
            through a verified channel.
          </p>
          <a
            href={inviteUrl}
            className="mt-2 block break-all text-sm text-green-800 underline"
          >
            {inviteUrl}
          </a>
          <p className="mt-2 text-xs text-green-800">
            The link expires in 72 hours and can only be used once. Do not share it
            publicly.
          </p>
        </div>
      ) : null}

      <div className="mt-7 space-y-4">
        {apps.length ? (
          apps.map((application) => (
            <article
              key={application.id}
              className="rounded-2xl border border-[#e1e4db] bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{application.fullName}</h2>
                  <p className="mt-1 text-sm text-[#687168]">
                    {application.type} · School ID: {application.schoolId} ·{" "}
                    {application.email}
                  </p>
                  <p className="mt-1 text-xs text-[#687168]">
                    Submitted {application.createdAt.toLocaleString()} ·{" "}
                    {application.status}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    application.status === "PENDING"
                      ? "bg-amber-50 text-amber-800"
                      : application.status === "APPROVED"
                        ? "bg-green-50 text-green-800"
                        : "bg-red-50 text-red-800"
                  }`}
                >
                  {application.status}
                </span>
              </div>

              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                {Object.entries({
                  Phone: application.phone,
                  Class: application.className,
                  Section: application.section,
                  Roll: application.rollNumber,
                  Subject: application.subject,
                  Guardian: application.guardianName,
                  "Guardian relationship": application.guardianRelationship,
                  "Guardian phone": application.guardianPhone,
                  "Form teacher": application.formTeacher
                })
                  .filter(([, value]) => value)
                  .map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-xs text-[#687168]">{label}</dt>
                      <dd className="mt-1">{value}</dd>
                    </div>
                  ))}
              </dl>

              {application.status === "PENDING" ? (
                <form
                  action={decideApplication}
                  className="mt-5 flex flex-wrap items-center gap-2 border-t border-[#eceee7] pt-4"
                >
                  <input type="hidden" name="id" value={application.id} />
                  <input
                    name="note"
                    placeholder="Optional review note"
                    className="min-w-48 flex-1 rounded-lg border border-[#d8ddd4] px-3 py-2 text-sm"
                  />
                  <button
                    name="decision"
                    value="approve"
                    className="rounded-lg bg-[#176b45] px-4 py-2 text-sm font-semibold text-white"
                  >
                    Approve &amp; send setup link
                  </button>
                  <button
                    name="decision"
                    value="reject"
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700"
                  >
                    Reject
                  </button>
                </form>
              ) : application.status === "APPROVED" ? (
                <form action={decideApplication} className="mt-5 border-t border-[#eceee7] pt-4">
                  <input type="hidden" name="id" value={application.id} />
                  <button
                    name="decision"
                    value="reset"
                    className="rounded-lg border border-[#d8ddd4] px-4 py-2 text-sm font-semibold text-[#176b45]"
                  >
                    Issue password setup link
                  </button>
                </form>
              ) : null}
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-[#cfd5ca] bg-white p-12 text-center text-[#687168]">
            No applications have been submitted.
          </div>
        )}
      </div>
    </section>
  );
}
