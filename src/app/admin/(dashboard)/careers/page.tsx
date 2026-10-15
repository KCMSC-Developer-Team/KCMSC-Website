import Link from "next/link";
import { prisma } from "@/lib/db";
import { deleteCareerAction } from "./actions";

export default async function CareersListPage() {
  const careers = await prisma.career.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      applications: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const totalApplications = careers.reduce(
    (total, career) => total + career.applications.length,
    0,
  );

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#7c847d]">
            Recruitment
          </p>

          <h1 className="mt-1 font-heading text-2xl text-ink">Careers</h1>

          <p className="mt-1 text-sm text-ink-muted">
            Manage vacancies and review career applications.
          </p>
        </div>

        <Link
          href="/admin/careers/new"
          className="inline-flex w-fit rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
        >
          New vacancy
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-white p-5">
          <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-ink-muted">
            Vacancies
          </p>

          <p className="mt-2 font-heading text-3xl text-ink">
            {careers.length}
          </p>

          <p className="mt-1 text-xs text-ink-muted">
            Published and draft positions.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-5">
          <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-ink-muted">
            Applications
          </p>

          <p className="mt-2 font-heading text-3xl text-ink">
            {totalApplications}
          </p>

          <p className="mt-1 text-xs text-ink-muted">
            Total applications received.
          </p>
        </div>
      </div>

      {careers.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-border p-10 text-center text-ink-muted">
          No vacancies yet. Post the first one.
        </p>
      ) : (
        <div className="mt-8 space-y-6">
          {careers.map((career) => (
            <section
              key={career.id}
              className="overflow-hidden rounded-xl border border-border bg-white"
            >
              <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-start gap-4">
                  {career.imageData ? <img src={career.imageData} alt="" className="h-16 w-24 shrink-0 rounded-lg object-cover" /> : <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg bg-[#efeee7] text-xs text-ink-muted">No image</div>}
                  <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-medium text-ink">{career.titleEn}</h2>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
                        career.isPublished
                          ? "bg-[#e9f6ee] text-primary"
                          : "bg-[#efeee7] text-ink-muted"
                      }`}
                    >
                      {career.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-ink-muted">
                    {career.applications.length}{" "}
                    {career.applications.length === 1
                      ? "application"
                      : "applications"}
                    {career.deadline
                      ? ` · Deadline ${career.deadline.toLocaleDateString()}`
                      : ""}
                  </p>
                  <p className="mt-2 line-clamp-2 max-w-2xl text-xs leading-5 text-ink-muted">{career.summaryEn || career.descriptionEn.replace(/<[^>]*>/g, " ").trim()}</p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-4">
                  <Link
                    href={`/admin/careers/${career.id}/edit`}
                    className="text-sm text-primary hover:underline"
                  >
                    Edit
                  </Link>

                  <form action={deleteCareerAction}>
                    <input type="hidden" name="id" value={career.id} />

                    <button
                      type="submit"
                      className="text-sm text-brick hover:underline"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">
                  Applicants
                </h3>

                {career.applications.length === 0 ? (
                  <div className="mt-4 rounded-lg border border-dashed border-border p-6 text-center text-sm text-ink-muted">
                    No applications received for this vacancy.
                  </div>
                ) : (
                  <div className="mt-4 overflow-x-auto rounded-lg border border-border">
                    <table className="w-full min-w-[900px] text-left text-sm">
                      <thead className="border-b border-border bg-[#f8f7f2]">
                        <tr>
                          <th className="px-4 py-3 font-medium text-ink">
                            Applicant
                          </th>

                          <th className="px-4 py-3 font-medium text-ink">
                            Contact
                          </th>

                          <th className="px-4 py-3 font-medium text-ink">
                            Qualification
                          </th>

                          <th className="px-4 py-3 font-medium text-ink">
                            Experience
                          </th>

                          <th className="px-4 py-3 font-medium text-ink">
                            Applied
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-border">
                        {career.applications.map((application) => (
                          <tr key={application.id} className="align-top">
                            <td className="px-4 py-4">
                              <p className="font-medium text-ink">
                                {application.fullName}
                              </p>

                              {application.coverLetter ? (
                                <details className="mt-2 max-w-xs">
                                  <summary className="cursor-pointer text-xs text-primary">
                                    View cover letter
                                  </summary>

                                  <p className="mt-2 whitespace-pre-line text-xs leading-5 text-ink-muted">
                                    {application.coverLetter}
                                  </p>
                                </details>
                              ) : null}
                            </td>

                            <td className="px-4 py-4">
                              <p className="text-ink">{application.email}</p>

                              <p className="mt-1 text-xs text-ink-muted">
                                {application.phone}
                              </p>
                            </td>

                            <td className="px-4 py-4 text-ink-muted">
                              {application.qualification || "—"}
                            </td>

                            <td className="max-w-xs whitespace-pre-line px-4 py-4 text-xs leading-5 text-ink-muted">
                              {application.experience || "—"}
                            </td>

                            <td className="whitespace-nowrap px-4 py-4 text-xs text-ink-muted">
                              {application.createdAt.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
