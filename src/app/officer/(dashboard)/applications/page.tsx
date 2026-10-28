import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireOfficer } from "@/lib/session";
import { APPLICATION_STATUSES, APPLICATION_STATUS_LABELS } from "@/lib/admissions";

export default async function OfficerApplicationsPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const officer = await requireOfficer();
  const status = (await searchParams).status;
  const q = ((await searchParams).q ?? "").trim();
  const where: any = {};
  if (status && (APPLICATION_STATUSES as readonly string[]).includes(status) && status !== "UNASSIGNED") where.status = status;
  if (q) {
    where.OR = [
      { fullName: { contains: q, mode: "insensitive" } },
      { fatherName: { contains: q, mode: "insensitive" } },
      { motherName: { contains: q, mode: "insensitive" } },
      { fatherContactNumber: { contains: q } },
      { motherContactNumber: { contains: q } },
      { birthRegistrationNo: { contains: q } },
    ];
  }
  const applications = await prisma.admissionApplication.findMany({
    where, orderBy: { createdAt: "desc" }, take: 200,
    include: { cycle: { select: { nameEn: true } } }
  });
  return <div className="max-w-[1200px]">
    <header className="border-b border-[#d9d8cf] pb-7"><p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#176b45]">Admissions</p><h1 className="mt-2 font-heading text-3xl font-normal text-[#124c36]">My applications</h1><p className="mt-2 text-sm leading-6 text-[#69716b]">All submitted applications are available to admission officers. Review the full application and update its status as you process it.</p></header>
    <form method="GET" className="mt-6 rounded-[14px] border border-[#d9d8cf] bg-[#fffdf8] p-4"><div className="grid gap-3 lg:grid-cols-[1fr_210px_auto]"><input name="q" defaultValue={q} placeholder="Search name, parent name, phone or birth registration no." className="rounded-full border border-[#d9d8cf] bg-[#fffdf8] px-4 py-2.5 text-sm outline-none focus:border-[#176b45]"/><select name="status" defaultValue={status ?? ""} className="rounded-full border border-[#d9d8cf] bg-[#fffdf8] px-4 py-2.5 text-sm text-[#242824] outline-none focus:border-[#176b45]"><option value="">All statuses</option>{APPLICATION_STATUSES.filter(s => s !== "UNASSIGNED").map(s=><option key={s} value={s}>{APPLICATION_STATUS_LABELS[s]}</option>)}</select><button type="submit" className="kc-classic-button kc-classic-button-primary">Search</button></div></form>
    {applications.length === 0 ? <p className="mt-8 rounded-[14px] border border-dashed border-[#d9d8cf] bg-[#fffdf8] p-8 text-center text-sm text-[#69716b]">No applications match.</p> : <ul className="mt-6 divide-y divide-[#d9d8cf] rounded-[14px] border border-[#d9d8cf] bg-[#fffdf8]">{applications.map(a=><li key={a.id}><Link href={`/officer/applications/${a.id}`} className="flex items-center justify-between gap-4 p-5 hover:bg-[#efeee7]"><div><p className="truncate text-sm font-medium text-[#242824]">{a.fullName}</p><p className="mt-1 text-xs text-[#69716b]">{a.applyingClass} · {a.cycle.nameEn} · {a.createdAt.toLocaleDateString("en-GB")}</p></div><span className="rounded-full bg-[#efeee7] px-2.5 py-1 text-[10px] font-medium text-[#176b45]">{APPLICATION_STATUS_LABELS[a.status]}</span></Link></li>)}</ul>}
  </div>;
}
