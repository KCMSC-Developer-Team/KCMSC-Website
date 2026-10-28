import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { createOfficerAction, resetOfficerPasswordAction, removeOfficerAction } from "./actions";

const ERRORS: Record<string, string> = {
  invalid_name: "Enter a name.", invalid_email: "Enter a valid email address.", already_exists: "An account with that email already exists.",
  weak_password: "Password must be at least 8 characters and contain a letter and a number.", password_mismatch: "The passwords do not match.", not_found: "The requested officer was not found."
};

export default async function OfficersPage({ searchParams }: { searchParams: Promise<{ error?: string; created?: string; reset?: string; removed?: string }> }) {
  await requireAdmin();
  const officers = await prisma.user.findMany({
    where: { role: "ADMISSION_OFFICER" }, orderBy: { createdAt: "asc" },
    select: { id: true, name: true, email: true, createdAt: true, _count: { select: { reviews: true } } }
  });
  const errorCode = (await searchParams).error;
  const error = errorCode ? ERRORS[errorCode] : null;

  return (
    <div className="max-w-[1200px]">
      <header className="border-b border-[#d9d8cf] pb-7"><p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#176b45]">Admissions</p><h1 className="mt-2 font-heading text-3xl font-normal tracking-tight text-[#124c36]">Admission Officers</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#69716b]">Create officer accounts directly. Every submitted application is available to active admission officers; administrators can reset credentials when needed.</p></header>
      {error ? <div className="mt-6 rounded-[12px] border border-[#b14d3b]/25 bg-[#b14d3b]/5 px-4 py-3 text-sm text-[#8f392b]">{error}</div> : null}
      {(await searchParams).created ? <div className="mt-6 rounded-[12px] border border-[#176b45]/20 bg-[#176b45]/5 px-4 py-3 text-sm text-[#176b45]">Officer account created. Give the new officer the credentials you entered.</div> : null}
      {(await searchParams).reset ? <div className="mt-6 rounded-[12px] border border-[#176b45]/20 bg-[#176b45]/5 px-4 py-3 text-sm text-[#176b45]">Password reset successfully. Give the new temporary password to the officer.</div> : null}
      {(await searchParams).removed ? <div className="mt-6 rounded-[12px] border border-[#176b45]/20 bg-[#176b45]/5 px-4 py-3 text-sm text-[#176b45]">Officer account removed. Application and review records were preserved.</div> : null}

      <section className="mt-7 rounded-[14px] border border-[#d9d8cf] bg-[#fffdf8] p-6">
        <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-[#176b45]">Create account</p><h2 className="mt-1 font-heading text-xl text-[#124c36]">New admission officer</h2>
        <form action={createOfficerAction} className="mt-5 grid gap-4 sm:grid-cols-2">
          <label><span className="text-xs font-medium text-[#4f5751]">Full name</span><input name="name" required className="mt-2 w-full rounded-lg border border-[#d9d8cf] bg-white px-3.5 py-3 text-sm outline-none focus:border-[#176b45]" /></label>
          <label><span className="text-xs font-medium text-[#4f5751]">Email</span><input name="email" type="email" required autoComplete="email" className="mt-2 w-full rounded-lg border border-[#d9d8cf] bg-white px-3.5 py-3 text-sm outline-none focus:border-[#176b45]" /></label>
          <label><span className="text-xs font-medium text-[#4f5751]">Password</span><input name="password" type="password" required minLength={8} autoComplete="new-password" className="mt-2 w-full rounded-lg border border-[#d9d8cf] bg-white px-3.5 py-3 text-sm outline-none focus:border-[#176b45]" /></label>
          <label><span className="text-xs font-medium text-[#4f5751]">Confirm password</span><input name="confirmPassword" type="password" required minLength={8} autoComplete="new-password" className="mt-2 w-full rounded-lg border border-[#d9d8cf] bg-white px-3.5 py-3 text-sm outline-none focus:border-[#176b45]" /></label>
          <div className="sm:col-span-2"><button className="kc-classic-button kc-classic-button-primary" type="submit">Create admission officer</button></div>
        </form>
      </section>

      <section className="mt-7 rounded-[14px] border border-[#d9d8cf] bg-[#fffdf8]">
        <div className="border-b border-[#d9d8cf] px-6 py-5"><p className="text-[9px] font-medium uppercase tracking-[0.16em] text-[#176b45]">Active accounts</p><h2 className="mt-1 font-heading text-xl text-[#124c36]">Officers</h2></div>
        <div className="divide-y divide-[#d9d8cf]">{officers.length ? officers.map((o) => <div key={o.id} className="p-6"><div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><p className="font-medium text-[#242824]">{o.name}</p><p className="mt-1 text-sm text-[#69716b]">{o.email}</p><p className="mt-2 text-xs text-[#8a918b]">{o._count.reviews} reviews recorded</p></div><form action={removeOfficerAction}><input type="hidden" name="userId" value={o.id}/><button type="submit" className="text-sm text-[#8f392b] hover:underline">Remove account</button></form></div><details className="mt-5"><summary className="cursor-pointer text-sm font-medium text-[#176b45]">Reset password</summary><form action={resetOfficerPasswordAction} className="mt-4 grid gap-4 rounded-lg bg-[#efeee7] p-4 sm:grid-cols-2"><input type="hidden" name="userId" value={o.id}/><label><span className="text-xs font-medium text-[#4f5751]">New password</span><input name="password" type="password" required minLength={8} className="mt-2 w-full rounded-lg border border-[#d9d8cf] bg-white px-3 py-2.5 text-sm"/></label><label><span className="text-xs font-medium text-[#4f5751]">Confirm password</span><input name="confirmPassword" type="password" required minLength={8} className="mt-2 w-full rounded-lg border border-[#d9d8cf] bg-white px-3 py-2.5 text-sm"/></label><div className="sm:col-span-2"><button type="submit" className="rounded-full bg-[#176b45] px-4 py-2.5 text-xs font-medium text-white hover:bg-[#124c36]">Reset password</button></div></form></details></div>) : <div className="p-8 text-center text-sm text-[#69716b]">No admission officers yet.</div>}</div>
      </section>
    </div>
  );
}
