import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { ApplicationDetail } from "@/components/admin/ApplicationDetail";

export default async function AdminApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const app = await prisma.admissionApplication.findUnique({
    where: { id: (await params).id },
    include: {
      cycle: { select: { nameEn: true } },
      guardians: true,
      reviews: {
        orderBy: { createdAt: "desc" },
        include: { officer: { select: { name: true, email: true } } }
      }
    }
  });
  if (!app) notFound();

  return (
    <div className="max-w-[1180px]">
      <Link href="/admin/admissions?view=applications" className="inline-flex items-center gap-2 text-xs font-medium text-[#176b45] hover:text-[#124c36]">
        ← Back to applications
      </Link>
      <div className="mt-5">
        <ApplicationDetail app={app} />
      </div>
      <div className="mt-5 flex flex-wrap gap-2 rounded-[14px] border border-[#d9d8cf] bg-[#fffdf8] p-5">
        <a href={`/api/admissions/${app.id}/certificate`} className="kc-classic-button kc-classic-button-outline">Download certificate</a>
        <a href={`/api/admissions/${app.id}/form`} className="kc-classic-button kc-classic-button-primary">Download application PDF</a>
      </div>
    </div>
  );
}
