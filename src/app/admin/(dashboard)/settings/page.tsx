import { requireAdmin } from "@/lib/session";
import { changeOwnAdminPasswordAction } from "../administrators/actions";

const ERRORS: Record<string, string> = {
  wrong_current_password: "Your current password is incorrect.",
  weak_password: "Password must be at least 8 characters and contain a letter and a number.",
  password_mismatch: "The new passwords do not match.",
  not_found: "Your account could not be found."
};

export default async function AdminSettingsPage({ searchParams }: { searchParams: Promise<{ error?: string; changed?: string }> }) {
  const admin = await requireAdmin();
  const errorCode = (await searchParams).error;
  const error = errorCode ? ERRORS[errorCode] : null;

  return (
    <div className="max-w-[900px]">
      <header className="border-b border-[#d9d8cf] pb-7">
        <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#176b45]">Account</p>
        <h1 className="mt-2 font-heading text-3xl font-normal tracking-tight text-[#124c36]">My Account</h1>
        <p className="mt-2 text-sm leading-6 text-[#69716b]">Manage your administrator credentials. Existing passwords are never displayed.</p>
      </header>

      {error ? <div className="mt-6 rounded-[12px] border border-[#b14d3b]/25 bg-[#b14d3b]/5 px-4 py-3 text-sm text-[#8f392b]">{error}</div> : null}
      {(await searchParams).changed ? <div className="mt-6 rounded-[12px] border border-[#176b45]/20 bg-[#176b45]/5 px-4 py-3 text-sm text-[#176b45]">Password changed successfully.</div> : null}

      <section className="mt-7 rounded-2xl border border-[#d9d8cf] bg-[#fffdf8] p-6">
        <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#8a918b]">Signed in account</p>
        <p className="mt-2 text-base font-medium text-[#242824]">{admin.name}</p>
        <p className="mt-1 text-sm text-[#69716b]">{admin.email}</p>
      </section>

      <section className="mt-6 rounded-2xl border border-[#d9d8cf] bg-[#fffdf8] p-6">
        <h2 className="font-heading text-xl text-[#124c36]">Change password</h2>
        <p className="mt-2 text-sm leading-6 text-[#69716b]">Use this whenever you want to change your own password.</p>
        <form action={changeOwnAdminPasswordAction} className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2"><span className="text-xs font-medium text-[#4f5751]">Current password</span><input name="currentPassword" type="password" required autoComplete="current-password" className="mt-2 w-full rounded-lg border border-[#d9d8cf] bg-white px-3.5 py-3 text-sm outline-none focus:border-[#176b45]" /></label>
          <label><span className="text-xs font-medium text-[#4f5751]">New password</span><input name="password" type="password" required minLength={8} autoComplete="new-password" className="mt-2 w-full rounded-lg border border-[#d9d8cf] bg-white px-3.5 py-3 text-sm outline-none focus:border-[#176b45]" /></label>
          <label><span className="text-xs font-medium text-[#4f5751]">Confirm new password</span><input name="confirmPassword" type="password" required minLength={8} autoComplete="new-password" className="mt-2 w-full rounded-lg border border-[#d9d8cf] bg-white px-3.5 py-3 text-sm outline-none focus:border-[#176b45]" /></label>
          <div className="sm:col-span-2"><button type="submit" className="kc-classic-button kc-classic-button-primary">Change password</button></div>
        </form>
      </section>
    </div>
  );
}
