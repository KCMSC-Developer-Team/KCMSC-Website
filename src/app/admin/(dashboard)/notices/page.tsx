
import Link from "next/link";
import { prisma } from "@/lib/db";
import { deleteNoticeAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function NoticesListPage() {
  const notices = await prisma.notice.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl text-ink">Notices</h1>
        <Link
          href="/admin/notices/new"
          className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          New notice
        </Link>
      </div>

      {notices.length === 0 ? (
        <p className="mt-8 rounded-lg border border-dashed border-border p-8 text-center text-ink-muted">
          No notices yet. Create the first one.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-border rounded-lg border border-border bg-white">
          {notices.map((n) => (
            <li
              key={n.id}
              className="flex items-center justify-between gap-4 p-4"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-ink">{n.titleEn}</p>
                <p className="mt-1 flex gap-2 text-xs">
                  <span
                    className={
                      n.isPublished ? "text-primary" : "text-ink-muted"
                    }
                  >
                    {n.isPublished ? "Published" : "Draft"}
                  </span>
                  {n.isImportant ? (
                    <span className="text-brick">
                      Popup{n.imageUrls.length > 0 ? ` · ${n.imageUrls.length} image${n.imageUrls.length > 1 ? "s" : ""}` : ""}
                    </span>
                  ) : null}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <Link
                  href={`/admin/notices/${n.id}/edit`}
                  className="text-sm text-primary hover:underline"
                >
                  Edit
                </Link>
                <form action={deleteNoticeAction}>
                  <input type="hidden" name="id" value={n.id} />
                  <button
                    type="submit"
                    className="text-sm text-brick hover:underline"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
