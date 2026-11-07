import { requireAdmin } from "@/lib/session";
import { deleteOwnAdminAccountAction, createAdminAction, resetAdminPasswordAction, getAdministratorsData } from "./actions";

const ERRORS: Record<string, string> = {
  invalid_name: "Enter a name.", invalid_email: "Enter a valid email address.", already_exists: "An account with that email already exists.",
  weak_password: "Password must be at least 8 characters and contain a letter and a number.", password_mismatch: "The passwords do not match.",
  not_found: "The requested account was not found.", last_admin: "The last administrator account cannot be deleted."
};

export default async function AdministratorsPage({ searchParams }: { searchParams: Promise<{ error?: string; created?: string; reset?: string }> }) {
  await requireAdmin();
  const { currentAdmin, admins } = await getAdministratorsData();
  const errorCode = (await searchParams).error;
  const error = errorCode ? ERRORS[errorCode] : null;

  return (
    <div className="max-w-[1200px]">
      <header className="border-b border-[#d9d8cf] pb-7"><p className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#176b45]">Administration</p><h1 className="mt-2 font-heading text-3xl font-normal tracking-tight text-[#124c36]">Administrators</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#69716b]">Create staff accounts directly. Give the credentials to the person, then they can change their own password from My Account.</p></header>
      {error ? <div className="mt-6 rounded-[12px] border border-[#b14d3b]/25 bg-[#b14d3b]/5 px-4 py-3 text-sm text-[#8f392b]">{error}</div> : null}
      {(await searchParams).created ? <div className="mt-6 rounded-[12px] border border-[#176b45]/20 bg-[#176b45]/5 px-4 py-3 text-sm text-[#176b45]">Administrator account created. Give the new staff member the credentials you entered.</div> : null}
      {(await searchParams).reset ? <div className="mt-6 rounded-[12px] border border-[#176b45]/20 bg-[#176b45]/5 px-4 py-3 text-sm text-[#176b45]">Password reset successfully. Give the new temporary password to the administrator.</div> : null}

      <section className="mt-7 rounded-2xl border border-[#d9d8cf] bg-[#fffdf8] p-6">
        <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#176b45]">Create account</p><h2 className="mt-1 font-heading text-xl text-[#124c36]">New administrator</h2>
        <form action={createAdminAction} className="mt-5 grid gap-4 sm:grid-cols-2">
          <label><span className="text-xs font-medium text-[#4f5751]">Full name</span><input name="name" required className="mt-2 w-full rounded-lg border border-[#d9d8cf] bg-white px-3.5 py-3 text-sm outline-none focus:border-[#176b45]" /></label>
          <label><span className="text-xs font-medium text-[#4f5751]">Email</span><input name="email" type="email" required autoComplete="email" className="mt-2 w-full rounded-lg border border-[#d9d8cf] bg-white px-3.5 py-3 text-sm outline-none focus:border-[#176b45]" /></label>
          <label><span className="text-xs font-medium text-[#4f5751]">Password</span><input name="password" type="password" required minLength={8} autoComplete="new-password" className="mt-2 w-full rounded-lg border border-[#d9d8cf] bg-white px-3.5 py-3 text-sm outline-none focus:border-[#176b45]" /></label>
          <label><span className="text-xs font-medium text-[#4f5751]">Confirm password</span><input name="confirmPassword" type="password" required minLength={8} autoComplete="new-password" className="mt-2 w-full rounded-lg border border-[#d9d8cf] bg-white px-3.5 py-3 text-sm outline-none focus:border-[#176b45]" /></label>
          <div className="sm:col-span-2"><button className="kc-classic-button kc-classic-button-primary" type="submit">Create administrator</button></div>
        </form>
      </section>

      <section className="mt-7 rounded-2xl border border-[#d9d8cf] bg-[#fffdf8]">
        <div className="border-b border-[#d9d8cf] px-6 py-5"><p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#176b45]">Active accounts</p><h2 className="mt-1 font-heading text-xl text-[#124c36]">Administrators</h2></div>
        <div className="divide-y divide-[#d9d8cf]">{admins.map((admin) => <div key={admin.id} className="p-6"><div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><p className="font-medium text-[#242824]">{admin.name}{admin.id === currentAdmin?.id ? <span className="ml-2 rounded-full bg-[#efeee7] px-2 py-1 text-[12px] uppercase tracking-wide text-[#176b45]">You</span> : null}</p><p className="mt-1 text-sm text-[#69716b]">{admin.email}</p></div>{admin.id === currentAdmin?.id ? <form action={deleteOwnAdminAccountAction}><input type="hidden" name="userId" value={admin.id}/><button className="text-sm text-[#8f392b] hover:underline">Delete my account</button></form> : null}</div>{admin.id !== currentAdmin?.id ? <details className="mt-5"><summary className="cursor-pointer text-sm font-medium text-[#176b45]">Reset password</summary><form action={resetAdminPasswordAction} className="mt-4 grid gap-4 rounded-lg bg-[#efeee7] p-4 sm:grid-cols-2"><input type="hidden" name="userId" value={admin.id}/><label><span className="text-xs font-medium text-[#4f5751]">New password</span><input name="password" type="password" required minLength={8} className="mt-2 w-full rounded-lg border border-[#d9d8cf] bg-white px-3 py-2.5 text-sm"/></label><label><span className="text-xs font-medium text-[#4f5751]">Confirm password</span><input name="confirmPassword" type="password" required minLength={8} className="mt-2 w-full rounded-lg border border-[#d9d8cf] bg-white px-3 py-2.5 text-sm"/></label><div className="sm:col-span-2"><button type="submit" className="rounded-full bg-[#176b45] px-4 py-2.5 text-xs font-medium text-white hover:bg-[#124c36]">Reset password</button></div></form></details> : null}</div>)}</div>
      </section>
    </div>
  );
}
