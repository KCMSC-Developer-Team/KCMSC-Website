import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { NoticeForm } from "../../NoticeForm";
import { updateNoticeAction } from "../../actions";

export default async function EditNoticePage({ params }: { params: Promise<{ id: string }> }) {
  const notice = await prisma.notice.findUnique({ where: { id: (await params).id } });
  if (!notice) notFound();

  const boundAction = updateNoticeAction.bind(null, notice.id);

  return (
    <div>
      <h1 className="font-heading text-2xl text-ink">Edit Notice</h1>
      <div className="mt-6">
        <NoticeForm action={boundAction} defaults={notice} />
      </div>
    </div>
  );
}
